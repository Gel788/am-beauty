"use client";

import { useRef, useState } from "react";
import { GripVertical, Loader2, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminButton } from "@/components/admin/admin-form";
import { AdminUploadImage } from "@/components/admin/admin-upload-image";
import { cn } from "@/lib/utils";

type MediaGalleryProps = {
  label?: string;
  images: string[];
  mainImage?: string;
  onChange: (images: string[]) => void;
  onMainChange?: (url: string) => void;
};

async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Ошибка загрузки");
  return data.file.url as string;
}

export function MediaGallery({
  label = "Галерея",
  images,
  mainImage,
  onChange,
  onMainChange,
}: MediaGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;

    setUploading(true);
    const urls: string[] = [];
    try {
      for (const file of files) {
        urls.push(await uploadImage(file));
      }
      onChange([...images, ...urls]);
      if (!mainImage && urls[0] && onMainChange) onMainChange(urls[0]);
      toast.success(`Загружено: ${urls.length}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = async (index: number) => {
    const url = images[index];
    if (url.startsWith("/uploads/") && confirm("Удалить файл с сервера?")) {
      await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    }
    const next = images.filter((_, i) => i !== index);
    onChange(next);
    if (mainImage === url && onMainChange) {
      onMainChange(next[0] ?? "");
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <p className="text-[10px] tracking-[0.16em] text-grey uppercase">{label}</p>

      <div
        className={cn(
          "mt-2 border border-dashed border-black/20 bg-cream/40 p-4 transition-colors",
          dragOver && "border-gold bg-gold/5",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void addFiles(e.dataTransfer.files);
        }}
      >
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group relative aspect-square border border-black/10 bg-white"
              >
                <AdminUploadImage src={url} alt="" fill objectFit="contain" sizes="160px" className="p-1" />
                {mainImage === url ? (
                  <span className="absolute top-1 left-1 bg-gold px-1.5 py-0.5 text-[8px] tracking-wider text-white uppercase">
                    Главное
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {onMainChange ? (
                    <button
                      type="button"
                      title="Сделать главным"
                      onClick={() => onMainChange(url)}
                      className="cursor-pointer p-1 text-white hover:text-gold"
                    >
                      <Star className="size-3.5" />
                    </button>
                  ) : (
                    <span />
                  )}
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(index, index - 1)}
                      className="cursor-pointer p-1 text-white hover:text-gold"
                      aria-label="Влево"
                    >
                      <GripVertical className="size-3.5 rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeAt(index)}
                      className="cursor-pointer p-1 text-white hover:text-red-300"
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-grey">
            Перетащите фото сюда или нажмите «Добавить фото» — можно несколько сразу
          </p>
        )}

        <div className="mt-4 flex justify-center">
          <AdminButton onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="mr-2 inline size-4 animate-spin" />
            ) : (
              <Upload className="mr-2 inline size-4" />
            )}
            {uploading ? "Загрузка…" : "Добавить фото"}
          </AdminButton>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

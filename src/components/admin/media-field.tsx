"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Film, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminButton } from "@/components/admin/admin-form";
import { cn } from "@/lib/utils";
import type { MediaFile, MediaKind } from "@/lib/admin/media-types";

type MediaFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  accept: MediaKind;
  hint?: string;
  className?: string;
};

async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Ошибка загрузки");
  return data.file as MediaFile;
}

async function deleteFile(url: string) {
  if (!url.startsWith("/uploads/")) return;
  await fetch("/api/admin/media", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

function MediaPicker({
  open,
  accept,
  onClose,
  onSelect,
}: {
  open: boolean;
  accept: MediaKind;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/admin/media?type=${accept}`)
      .then((r) => r.json())
      .then((d) => setFiles(d.files))
      .finally(() => setLoading(false));
  }, [open, accept]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h3 className="text-[10px] tracking-[0.2em] uppercase">
            Библиотека · {accept === "image" ? "Фото" : "Видео"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[10px] tracking-[0.14em] text-grey uppercase hover:text-black"
          >
            Закрыть
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-grey">Загрузка…</p>
          ) : files.length === 0 ? (
            <p className="text-sm text-grey">Пока нет файлов — загрузите первый.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {files.map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => {
                    onSelect(file.url);
                    onClose();
                  }}
                  className="group relative aspect-square cursor-pointer overflow-hidden border border-black/10 bg-cream hover:border-gold"
                >
                  {file.kind === "image" ? (
                    <Image src={file.url} alt="" fill className="object-cover" sizes="160px" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-grey">
                      <Film className="size-8" strokeWidth={1.25} />
                      <span className="px-2 text-[9px] tracking-wide uppercase">{file.name}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MediaField({
  label,
  value,
  onChange,
  accept,
  hint,
  className,
}: MediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const saved = await uploadFile(file);
        onChange(saved.url);
        toast.success(accept === "image" ? "Фото загружено" : "Видео загружено");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setUploading(false);
      }
    },
    [accept, onChange],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleUpload(file);
  };

  const remove = async () => {
    if (!value) return;
    if (value.startsWith("/uploads/") && confirm("Удалить файл с сервера?")) {
      await deleteFile(value);
      toast.success("Файл удалён");
    }
    onChange("");
  };

  const acceptAttr = accept === "image" ? "image/*" : "video/mp4,video/webm,video/quicktime";

  return (
    <div className={className}>
      {label ? (
        <p className="text-[10px] tracking-[0.16em] text-grey uppercase">{label}</p>
      ) : null}

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
        onDrop={onDrop}
      >
        {value ? (
          <div className="space-y-3">
            {accept === "image" ? (
              <div className="relative mx-auto aspect-[4/3] max-w-xs border border-black/10 bg-white">
                <Image src={value} alt="" fill className="object-contain p-2" sizes="320px" />
              </div>
            ) : (
              <video
                src={value}
                controls
                className="mx-auto max-h-48 w-full max-w-md border border-black/10 bg-black"
              />
            )}
            <p className="truncate text-center text-xs text-grey">{value}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <AdminButton variant="ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
                Заменить
              </AdminButton>
              <AdminButton variant="danger" onClick={() => void remove()}>
                <Trash2 className="mr-1 inline size-3.5" />
                Удалить
              </AdminButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            {accept === "image" ? (
              <ImageIcon className="size-8 text-grey" strokeWidth={1.25} />
            ) : (
              <Film className="size-8 text-grey" strokeWidth={1.25} />
            )}
            <p className="text-sm text-charcoal">
              Перетащите {accept === "image" ? "фото" : "видео"} или нажмите «Загрузить»
            </p>
            <p className="text-xs text-grey">
              {accept === "image" ? "JPG, PNG, WebP до 15 МБ" : "MP4, WebM, MOV до 80 МБ"}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <AdminButton onClick={() => inputRef.current?.click()} disabled={uploading}>
                {uploading ? (
                  <Loader2 className="mr-2 inline size-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 inline size-4" />
                )}
                {uploading ? "Загрузка…" : "Загрузить"}
              </AdminButton>
              <AdminButton variant="ghost" onClick={() => setPickerOpen(true)}>
                Из библиотеки
              </AdminButton>
            </div>
          </div>
        )}

        {value ? (
          <div className="mt-3 flex justify-center">
            <AdminButton variant="ghost" onClick={() => setPickerOpen(true)}>
              Из библиотеки
            </AdminButton>
          </div>
        ) : null}
      </div>

      {hint ? <p className="mt-1 text-xs text-grey">{hint}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
          e.target.value = "";
        }}
      />

      <MediaPicker
        open={pickerOpen}
        accept={accept}
        onClose={() => setPickerOpen(false)}
        onSelect={onChange}
      />
    </div>
  );
}

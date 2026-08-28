"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Film, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminButton } from "@/components/admin/admin-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { formatBytes, type MediaFile } from "@/lib/admin/media-types";
import { cn } from "@/lib/utils";

type Filter = "all" | "image" | "video";

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    const qs = filter === "all" ? "" : `?type=${filter}`;
    fetch(`/api/admin/media${qs}`)
      .then((r) => r.json())
      .then((d) => setFiles(d.files))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = async (fileList: FileList | File[]) => {
    const list = Array.from(fileList);
    if (!list.length) return;

    setUploading(true);
    let ok = 0;
    for (const file of list) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok) ok += 1;
      else toast.error(data.error ?? `Ошибка: ${file.name}`);
    }
    setUploading(false);
    if (ok) {
      toast.success(`Загружено: ${ok}`);
      load();
    }
  };

  const remove = async (file: MediaFile) => {
    if (!confirm(`Удалить «${file.name}»?`)) return;
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: file.path }),
    });
    if (res.ok) {
      toast.success("Удалено");
      load();
    }
  };

  const copyUrl = (url: string) => {
    void navigator.clipboard.writeText(url);
    toast.success("URL скопирован");
  };

  return (
    <AdminShell title="Медиа" description="Фото и видео — загрузка, библиотека, удаление">
      <div className="space-y-6">
        <AdminPanel title="Загрузить">
          <div
            className={cn(
              "border border-dashed border-black/20 bg-cream/40 p-10 text-center transition-colors",
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
              void upload(e.dataTransfer.files);
            }}
          >
            <Upload className="mx-auto size-10 text-grey" strokeWidth={1.25} />
            <p className="mt-4 text-sm">Перетащите файлы сюда</p>
            <p className="mt-1 text-xs text-grey">Фото до 15 МБ · Видео до 80 МБ</p>
            <AdminButton className="mt-5" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? (
                <Loader2 className="mr-2 inline size-4 animate-spin" />
              ) : (
                <Upload className="mr-2 inline size-4" />
              )}
              {uploading ? "Загрузка…" : "Выбрать файлы"}
            </AdminButton>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/mp4,video/webm,video/quicktime"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) void upload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </AdminPanel>

        <AdminPanel
          title="Библиотека"
          action={
            <div className="flex gap-2">
              {(["all", "image", "video"] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "cursor-pointer px-3 py-1 text-[10px] tracking-[0.12em] uppercase",
                    filter === f ? "bg-black text-white" : "border border-black/15 text-grey",
                  )}
                >
                  {f === "all" ? "Все" : f === "image" ? "Фото" : "Видео"}
                </button>
              ))}
            </div>
          }
        >
          {loading ? (
            <p className="text-sm text-grey">Загрузка…</p>
          ) : files.length === 0 ? (
            <p className="text-sm text-grey">Пусто — загрузите первые файлы.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {files.map((file) => (
                <div key={file.path} className="group border border-black/10 bg-white">
                  <div className="relative aspect-square bg-cream">
                    {file.kind === "image" ? (
                      <Image src={file.url} alt="" fill className="object-cover" sizes="200px" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-grey">
                        <Film className="size-10" strokeWidth={1.25} />
                        <span className="px-2 text-center text-[9px] uppercase">Видео</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate text-xs font-medium" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[10px] text-grey">{formatBytes(file.size)}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(file.url)}
                        className="cursor-pointer text-[10px] tracking-[0.1em] text-grey uppercase hover:text-gold"
                      >
                        Копировать
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(file)}
                        className="cursor-pointer text-[10px] tracking-[0.1em] text-red-600 uppercase hover:text-red-800"
                      >
                        <Trash2 className="mr-0.5 inline size-3" />
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}

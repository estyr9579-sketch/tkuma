"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage } from "@/actions/articles";
import { Label } from "@/components/ui/Field";

/** Uploads an image to storage and stores its public URL in a hidden input. */
export function ImageField({ name, label, initialUrl, round = false }: { name: string; label: string; initialUrl?: string | null; round?: boolean }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const id = `${name}-file`;

  async function onChange(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setUrl(res.url ?? "");
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-4">
        {url ? (
          <Image src={url} alt="" width={round ? 64 : 160} height={round ? 64 : 100} className={`${round ? "h-16 w-16 rounded-full" : "h-25 w-40"} object-cover border border-stone`} unoptimized />
        ) : (
          <div className={`${round ? "h-16 w-16 rounded-full" : "h-25 w-40"} border border-dashed border-stone bg-mist`} aria-hidden="true" />
        )}
        <div className="flex flex-col gap-2 text-sm">
          <input ref={ref} id={id} type="file" accept="image/jpeg,image/png,image/webp" className="max-w-xs text-sm" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
          {url && <button type="button" className="self-start text-red-700 underline underline-offset-2" onClick={() => { setUrl(""); if (ref.current) ref.current.value = ""; }}>הסרת תמונה</button>}
          <span className="text-slate">{busy ? "מעלה…" : "JPG / PNG / WebP עד 4MB"}</span>
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      <input type="hidden" name={name} value={url} />
    </div>
  );
}

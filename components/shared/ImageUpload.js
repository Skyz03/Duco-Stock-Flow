"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageUpload({ value, onChange, disabled }) {
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setLocalError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }
      onChange(json.url || "");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
          {uploading ? "Uploading…" : "Choose image"}
          <input type="file" accept="image/*" className="hidden" disabled={disabled || uploading} onChange={onFile} />
        </label>
        {value ? (
          <Image
            src={value}
            alt="Uploaded product image preview"
            width={48}
            height={48}
            className="rounded-lg object-cover ring-1 ring-zinc-200"
          />
        ) : null}
      </div>
      {value ? (
        <input
          type="url"
          readOnly
          value={value}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600"
        />
      ) : null}
      {localError ? <p className="text-sm text-red-600">{localError}</p> : null}
    </div>
  );
}

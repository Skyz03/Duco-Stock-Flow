"use client";

import { Download } from "lucide-react";

export function ExportCSVButton({ exportUrl, filename, search, dateFrom, dateTo, className = "" }) {
  function download() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    const qs = params.toString();
    const href = qs ? `${exportUrl}?${qs}` : exportUrl;
    window.location.href = href;
  }

  return (
    <button
      type="button"
      onClick={download}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-base font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 sm:text-sm ${className}`}
    >
      <Download className="h-4 w-4" aria-hidden />
      Export CSV
    </button>
  );
}

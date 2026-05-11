"use client";

export function ExportCSVButton({ exportUrl, filename, search, dateFrom, dateTo }) {
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
      className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50"
    >
      Export CSV
    </button>
  );
}

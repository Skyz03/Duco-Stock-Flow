"use client";

export function SearchAndFilter({ search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search code or name…"
        className="min-w-[200px] flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
      />
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs font-medium text-zinc-600">
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-zinc-300 px-2 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-medium text-zinc-600">
          To
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-zinc-300 px-2 py-2 text-sm"
          />
        </label>
      </div>
    </div>
  );
}

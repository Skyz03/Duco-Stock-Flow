"use client";

import { Search } from "lucide-react";

const dateInputClass =
  "min-h-[44px] w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base outline-none focus:ring-2 focus:ring-zinc-300";

export function SearchAndFilter({ search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <div className="relative min-w-0 flex-1 md:min-w-[200px]">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search… e.g. DC-001 or Classic Cup"
          aria-label="Search entries"
          className="min-h-[44px] w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-9 pr-3 text-base outline-none focus:ring-2 focus:ring-zinc-300"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
        <label className="flex flex-col gap-1 text-xs font-semibold text-zinc-700">
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            aria-label="Filter from date"
            className={dateInputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-zinc-700">
          To
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            aria-label="Filter to date"
            className={dateInputClass}
          />
        </label>
      </div>
    </div>
  );
}

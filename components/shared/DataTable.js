"use client";

import Image from "next/image";
import { Package, Trash2 } from "lucide-react";

function isAbsoluteUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function cellVisibility(col) {
  return col.hideMobile ? "hidden md:table-cell" : "";
}

export function DataTable({ columns, data, isLoading, onDelete, rowClassName, hasFilters }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
        <thead className="bg-zinc-50/80">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-700 ${cellVisibility(col)} ${col.headerClassName || ""}`}
              >
                {col.header}
              </th>
            ))}
            {onDelete ? (
              <th scope="col" className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3.5 ${cellVisibility(col)}`}>
                      <div className="h-4 animate-pulse rounded-md bg-zinc-100" />
                    </td>
                  ))}
                  {onDelete ? (
                    <td className="px-4 py-3.5">
                      <div className="h-8 w-9 animate-pulse rounded-lg bg-zinc-100" />
                    </td>
                  ) : null}
                </tr>
              ))
            : null}
          {!isLoading && !data.length ? (
            <tr>
              <td colSpan={columns.length + (onDelete ? 1 : 0)} className="px-4 py-14 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
                    <Package className="h-6 w-6 text-zinc-400" aria-hidden />
                  </div>
                  <p className="text-sm font-medium text-zinc-500">
                    {hasFilters
                      ? "No entries match your filters."
                      : "No entries yet. Add your first entry!"}
                  </p>
                </div>
              </td>
            </tr>
          ) : null}
          {!isLoading &&
            data.map((row) => (
              <tr
                key={row.id || row.product_code}
                className={
                  rowClassName
                    ? rowClassName(row)
                    : "transition-colors duration-100 hover:bg-zinc-50/60"
                }
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 text-zinc-800 ${cellVisibility(col)} ${col.className || ""}`}>
                    {col.key === "product_pic" ? (
                      row.product_pic && isAbsoluteUrl(row.product_pic) ? (
                        <Image
                          src={row.product_pic}
                          alt={row.product_name || "Product"}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover ring-1 ring-zinc-200"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                          <Package className="h-4 w-4 text-zinc-400" aria-hidden />
                        </div>
                      )
                    ) : col.render ? (
                      col.render(row)
                    ) : (
                      String(row[col.key] ?? "—")
                    )}
                  </td>
                ))}
                {onDelete ? (
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                      aria-label="Delete entry"
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

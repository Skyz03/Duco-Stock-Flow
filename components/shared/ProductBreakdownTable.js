"use client";

import Image from "next/image";
import { RefreshCw } from "lucide-react";

function isAbsoluteUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProductBreakdownTable({ title, rows, isLoading, onRefresh, variant, accentColor }) {
  const isDuco = variant === "duco";

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-zinc-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh breakdown table"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} aria-hidden />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 text-left text-sm">
          <thead className="bg-zinc-50/80">
            <tr>
              <th scope="col" className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Image</th>
              <th scope="col" className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Code</th>
              <th scope="col" className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Product</th>
              {isDuco ? (
                <>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Purchased</th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Produced</th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Sold</th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-red-400">Damage</th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Net Stock</th>
                </>
              ) : (
                <>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Purchased</th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Sold</th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-red-400">Damage</th>
                  <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Net Stock</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={isDuco ? 8 : 7} className="px-3 py-4">
                      <div className="h-4 animate-pulse rounded-md bg-zinc-100" />
                    </td>
                  </tr>
                ))
              : null}
            {!isLoading && !rows.length ? (
              <tr>
                <td colSpan={isDuco ? 8 : 7} className="px-3 py-10 text-center text-sm text-zinc-500">
                  No products yet.
                </td>
              </tr>
            ) : null}
            {!isLoading &&
              rows.map((row) => {
                const low = row.is_low_stock;
                return (
                  <tr key={row.product_code} className={low ? "bg-red-50" : "transition-colors hover:bg-zinc-50/60"}>
                    <td className="px-3 py-2.5">
                      {row.product_pic && isAbsoluteUrl(row.product_pic) ? (
                        <Image
                          src={row.product_pic}
                          alt={row.product_name || "Product"}
                          width={36}
                          height={36}
                          className="rounded-md object-cover ring-1 ring-zinc-200"
                        />
                      ) : (
                        <span className="inline-block h-9 w-9 rounded-md bg-zinc-100" />
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-zinc-900">{row.product_code}</td>
                    <td className="px-3 py-2 text-zinc-700">{row.product_name}</td>
                    {isDuco ? (
                      <>
                        <td className="px-3 py-2 text-right tabular-nums">{row.total_purchased_pcs}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{row.total_produced_pcs}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{row.total_sold_pcs}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-red-500">{row.total_damage_pcs}</td>
                        <td
                          className={`px-3 py-2 text-right text-base font-bold tabular-nums ${
                            row.net_stock_pcs <= 0 ? "text-red-600" : "text-emerald-600"
                          }`}
                        >
                          {row.net_stock_pcs}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2 text-right tabular-nums">{row.total_purchased_boxes}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{row.total_sold_boxes}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{row.total_damage_boxes}</td>
                        <td
                          className={`px-3 py-2 text-right text-base font-bold tabular-nums ${
                            row.net_stock_boxes <= 0 ? "text-red-600" : "text-emerald-600"
                          }`}
                        >
                          {row.net_stock_boxes}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

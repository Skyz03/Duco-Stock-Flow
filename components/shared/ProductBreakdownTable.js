"use client";

import { RefreshCw } from "lucide-react";

export function ProductBreakdownTable({ title, rows, isLoading, onRefresh, variant }) {
  const isDuco = variant === "duco";

  return (
    <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-3 py-2">Image</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Product</th>
              {isDuco ? (
                <>
                  <th className="px-3 py-2 text-right">Purchased</th>
                  <th className="px-3 py-2 text-right">Produced</th>
                  <th className="px-3 py-2 text-right">Sold</th>
                  <th className="px-3 py-2 text-right text-red-500">Damage</th>
                  <th className="px-3 py-2 text-right">Net Stock</th>
                </>
              ) : (
                <>
                  <th className="px-3 py-2 text-right">Purchased</th>
                  <th className="px-3 py-2 text-right">Sold</th>
                  <th className="px-3 py-2 text-right">Damage</th>
                  <th className="px-3 py-2 text-right">Net Stock</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={isDuco ? 8 : 7} className="px-3 py-4">
                      <div className="h-4 animate-pulse rounded bg-zinc-200" />
                    </td>
                  </tr>
                ))
              : null}
            {!isLoading && !rows.length ? (
              <tr>
                <td colSpan={isDuco ? 8 : 7} className="px-3 py-8 text-center text-zinc-500">
                  No products yet.
                </td>
              </tr>
            ) : null}
            {!isLoading &&
              rows.map((row) => {
                const low = row.is_low_stock;
                return (
                  <tr key={row.product_code} className={low ? "bg-red-50" : "hover:bg-zinc-50/80"}>
                    <td className="px-3 py-2">
                      {row.product_pic ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={row.product_pic} alt="" className="h-9 w-9 rounded-md object-cover ring-1 ring-zinc-200" />
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

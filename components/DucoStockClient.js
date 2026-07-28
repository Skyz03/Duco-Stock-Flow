"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { DataTable } from "./shared/DataTable";
import { useStock } from "../hooks/useStock";

const columns = [
  { key: "product_code", header: "Product code" },
  { key: "product_name", header: "Product name" },
  { key: "product_pic", header: "Image", hideMobile: true },
  {
    key: "total_carton_purchased",
    header: "Cartons in",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
    hideMobile: true,
  },
  {
    key: "total_carton_used",
    header: "Cartons used",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
    hideMobile: true,
  },
  {
    key: "net_carton_stock",
    header: "Cartons left",
    headerClassName: "text-right",
    className: "text-right tabular-nums font-semibold",
    hideMobile: true,
    render: (row) => (
      <span className={row.net_carton_stock <= 0 ? "text-red-600 font-bold" : "text-zinc-800"}>
        {row.net_carton_stock}
      </span>
    ),
  },
  {
    key: "total_produced_pcs",
    header: "Produced (pcs)",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
    hideMobile: true,
  },
  {
    key: "total_sold_pcs",
    header: "Sold (pcs)",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
    hideMobile: true,
  },
  {
    key: "total_damage_pcs",
    header: "Damage (pcs)",
    headerClassName: "text-right",
    className: "text-right tabular-nums text-red-500",
    hideMobile: true,
  },
  {
    key: "net_stock_pcs",
    header: "Net stock (pcs)",
    headerClassName: "text-right",
    className: "text-right",
    render: (row) => (
      <span
        className={
          row.net_stock_pcs <= 0
            ? "text-base font-bold text-red-600"
            : "text-base font-semibold text-emerald-700"
        }
      >
        {row.net_stock_pcs}
      </span>
    ),
  },
];

export function DucoStockClient() {
  const { stockItems, isLoading, error, refetch } = useStock("/api/duco/stock");

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Duco Cups</p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-900 md:text-3xl">Stock by product</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Net pieces from purchases, production, sales, and damage.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
        Red rows indicate low or out of stock (net ≤ 0).
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <DataTable
        columns={columns}
        data={stockItems}
        isLoading={isLoading}
        rowClassName={(row) => (row.is_low_stock ? "bg-red-50" : "transition-colors hover:bg-zinc-50/60")}
      />
    </div>
  );
}

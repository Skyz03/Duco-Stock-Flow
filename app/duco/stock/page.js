"use client";

import { DataTable } from "../../../components/shared/DataTable";
import { useStock } from "../../../hooks/useStock";

const columns = [
  { key: "product_code", header: "Product code" },
  { key: "product_name", header: "Product name" },
  { key: "product_pic", header: "Image" },
  {
    key: "total_purchased_pcs",
    header: "Purchased",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
  },
  {
    key: "total_produced_pcs",
    header: "Produced",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
  },
  {
    key: "total_sold_pcs",
    header: "Sold",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
  },
  {
    key: "total_damage_pcs",
    header: "Damage",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
  },
  {
    key: "net_stock_pcs",
    header: "Net stock",
    headerClassName: "text-right",
    className: "text-right",
    render: (row) => (
      <span className={row.net_stock_pcs <= 0 ? "text-base font-bold text-red-600" : "text-base font-semibold text-emerald-700"}>
        {row.net_stock_pcs}
      </span>
    ),
  },
];

export default function DucoStockPage() {
  const { stockItems, isLoading, error, refetch } = useStock("/api/duco/stock");

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">Stock by product</h1>
          <p className="text-sm text-zinc-600">Net pieces from purchases, production, sales, and damage.</p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Refresh
        </button>
      </div>
      <p className="text-sm text-red-600">Red rows indicate low or out of stock (net ≤ 0).</p>
      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <DataTable
        columns={columns}
        data={stockItems}
        isLoading={isLoading}
        rowClassName={(row) => (row.is_low_stock ? "bg-red-50" : "hover:bg-zinc-50/80")}
      />
    </div>
  );
}

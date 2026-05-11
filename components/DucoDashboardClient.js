"use client";

import Link from "next/link";
import { useBreakdown } from "../hooks/useBreakdown";
import { useDashboard } from "../hooks/useDashboard";
import { ProductBreakdownTable } from "./shared/ProductBreakdownTable";
import { StatCard } from "./StatCard";

const cards = [
  { href: "/duco/purchase", title: "Purchase", description: "Log purchases and box quantities." },
  { href: "/duco/production", title: "Production", description: "Record output and damages." },
  { href: "/duco/sales", title: "Sales", description: "Track outbound sales." },
  { href: "/duco/stock", title: "Stock", description: "Net stock by product code." },
];

export function DucoDashboardClient() {
  const { stats, isLoading, error } = useDashboard("/api/duco/dashboard");
  const breakdown = useBreakdown("/api/duco/dashboard/breakdown");

  const net = stats?.net_stock_pcs ?? 0;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Duco Cups</p>
        <h1 className="text-3xl font-semibold text-zinc-950 md:text-4xl">Dashboard</h1>
        <p className="max-w-2xl text-zinc-600">
          Summary totals and per-product stock. Lowest net stock appears first in the breakdown table.
        </p>
      </div>

      {error ? <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total purchased (pcs)"
          value={isLoading ? "…" : (stats?.total_purchased_pcs ?? 0).toLocaleString()}
          accentColor="#1D9E75"
        />
        <StatCard
          title="Total produced (pcs)"
          value={isLoading ? "…" : (stats?.total_produced_pcs ?? 0).toLocaleString()}
          accentColor="#1D9E75"
        />
        <StatCard
          title="Total sold (pcs)"
          value={isLoading ? "…" : (stats?.total_sold_pcs ?? 0).toLocaleString()}
          accentColor="#1D9E75"
        />
        <StatCard
          title="Total damage (pcs)"
          value={isLoading ? "…" : (stats?.total_damage_pcs ?? 0).toLocaleString()}
          accentColor="#1D9E75"
        />
        <StatCard
          title="Net stock (pcs)"
          value={isLoading ? "…" : net.toLocaleString()}
          accentColor={net <= 0 ? "#DC2626" : "#1D9E75"}
          valueClassName={net <= 0 ? "text-red-600" : "text-emerald-600"}
        />
      </div>

      <ProductBreakdownTable
        title="Stock by product"
        variant="duco"
        rows={breakdown.rows}
        isLoading={breakdown.isLoading}
        onRefresh={breakdown.refetch}
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-zinc-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-lg font-semibold text-zinc-950">{card.title}</p>
            <p className="mt-2 text-sm text-zinc-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

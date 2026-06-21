"use client";

import { AlertTriangle, Boxes, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useBreakdown } from "../hooks/useBreakdown";
import { useDashboard } from "../hooks/useDashboard";
import { THEME } from "../lib/theme";
import { ProductBreakdownTable } from "./shared/ProductBreakdownTable";
import { StatCard } from "./StatCard";

const cards = [
  { href: "/pack/entries", title: "Inventory", description: "Add purchase, sales, and damage rows.", icon: Package },
  { href: "/pack/stock", title: "Stock", description: "Net boxes by product code.", icon: Boxes },
];

export function PackDashboardClient() {
  const { stats, isLoading, error } = useDashboard("/api/pack/dashboard");
  const breakdown = useBreakdown("/api/pack/dashboard/breakdown");

  const net = stats?.net_stock_boxes ?? 0;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Packmandu</p>
        <h1 className="text-3xl font-semibold text-zinc-950 md:text-4xl">Dashboard</h1>
        <p className="max-w-2xl text-zinc-600">
          Totals across all inventory rows and a per-product breakdown sorted by lowest net boxes.
        </p>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total purchased boxes"
          value={isLoading ? "…" : (stats?.total_purchased_boxes ?? 0).toLocaleString()}
          accentColor={THEME.pack.primary}
          icon={Package}
        />
        <StatCard
          title="Total sold boxes"
          value={isLoading ? "…" : (stats?.total_sold_boxes ?? 0).toLocaleString()}
          accentColor={THEME.pack.primary}
          icon={ShoppingBag}
        />
        <StatCard
          title="Total damage boxes"
          value={isLoading ? "…" : (stats?.total_damage_boxes ?? 0).toLocaleString()}
          accentColor={THEME.pack.primary}
          icon={AlertTriangle}
        />
        <StatCard
          title="Net stock boxes"
          value={isLoading ? "…" : net.toLocaleString()}
          accentColor={net <= 0 ? THEME.danger : THEME.pack.primary}
          valueClassName={net <= 0 ? "text-red-600" : "text-emerald-600"}
          icon={Boxes}
        />
      </div>

      <ProductBreakdownTable
        title="Stock by product"
        variant="pack"
        rows={breakdown.rows}
        isLoading={breakdown.isLoading}
        onRefresh={breakdown.refetch}
        accentColor={THEME.pack.primary}
      />

      <div className="mt-10">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Quick access</p>
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                  <Icon className="h-5 w-5 text-zinc-500 transition-colors duration-200 group-hover:text-blue-700" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-zinc-950">{card.title}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">{card.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

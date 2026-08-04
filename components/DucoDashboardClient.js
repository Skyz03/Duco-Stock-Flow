"use client";

import { AlertTriangle, Boxes, Factory, Package, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useBreakdown } from "../hooks/useBreakdown";
import { useDashboard } from "../hooks/useDashboard";
import { THEME } from "../lib/theme";
import { ProductBreakdownTable } from "./shared/ProductBreakdownTable";
import { StatCard } from "./StatCard";

const cards = [
  { href: "/duco/purchase", title: "Purchase", description: "Log purchases and box quantities.", icon: Package },
  { href: "/duco/production", title: "Production", description: "Record output and damages.", icon: Factory },
  { href: "/duco/sales", title: "Sales", description: "Track outbound sales.", icon: ShoppingBag },
  { href: "/duco/stock", title: "Stock", description: "Net stock by product code.", icon: Boxes },
];

export function DucoDashboardClient() {
  const { stats, isLoading, error } = useDashboard("/api/duco/dashboard");
  const breakdown = useBreakdown("/api/duco/dashboard/breakdown");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const displayStats = selectedProduct
    ? {
        total_purchased_pcs: selectedProduct.total_purchased_pcs,
        total_produced_pcs: selectedProduct.total_produced_pcs,
        total_sold_pcs: selectedProduct.total_sold_pcs,
        total_damage_pcs: selectedProduct.total_damage_pcs,
        net_stock_pcs: selectedProduct.net_stock_pcs,
      }
    : stats;

  const net = displayStats?.net_stock_pcs ?? 0;
  const statsLoading = selectedProduct ? false : isLoading;

  return (
    <div>
      <div className="mb-6 md:mb-8 flex flex-col gap-2 md:gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-600">Duco Cups</p>
        <h1 className="text-2xl font-semibold text-zinc-950 md:text-3xl lg:text-4xl">Dashboard</h1>
        <p className="max-w-2xl text-sm md:text-base text-zinc-600">
          Summary totals and per-product stock. Lowest net stock appears first in the breakdown table.
        </p>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {selectedProduct ? (
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            All products
          </button>
          <span className="text-sm text-zinc-500">
            Showing: <span className="font-semibold text-zinc-800">{selectedProduct.product_name} ({selectedProduct.product_code})</span>
          </span>
        </div>
      ) : null}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total purchased (pcs)"
          value={statsLoading ? "…" : (displayStats?.total_purchased_pcs ?? 0).toLocaleString()}
          accentColor={THEME.duco.primary}
          icon={Package}
        />
        <StatCard
          title="Total produced (pcs)"
          value={statsLoading ? "…" : (displayStats?.total_produced_pcs ?? 0).toLocaleString()}
          accentColor={THEME.duco.primary}
          icon={Factory}
        />
        <StatCard
          title="Total sold (pcs)"
          value={statsLoading ? "…" : (displayStats?.total_sold_pcs ?? 0).toLocaleString()}
          accentColor={THEME.duco.primary}
          icon={ShoppingBag}
        />
        <StatCard
          title="Total damage (pcs)"
          value={statsLoading ? "…" : (displayStats?.total_damage_pcs ?? 0).toLocaleString()}
          accentColor={THEME.duco.primary}
          icon={AlertTriangle}
        />
        <StatCard
          title="Net stock (pcs)"
          value={statsLoading ? "…" : net.toLocaleString()}
          accentColor={net <= 0 ? THEME.danger : THEME.duco.primary}
          valueClassName={net <= 0 ? "text-red-600" : "text-emerald-600"}
          icon={Boxes}
        />
      </div>

      <ProductBreakdownTable
        title="Stock by product"
        variant="duco"
        rows={breakdown.rows}
        isLoading={breakdown.isLoading}
        onRefresh={breakdown.refetch}
        accentColor={THEME.duco.primary}
        onRowClick={setSelectedProduct}
        selectedCode={selectedProduct?.product_code}
      />

      <div className="mt-10">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Quick access</p>
        <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 md:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 transition-colors duration-200"
                  style={{ ["--group-hover-bg"]: `${THEME.duco.primary}18` }}
                >
                  <Icon className="h-5 w-5 text-zinc-500 transition-colors duration-200 group-hover:text-emerald-700" aria-hidden />
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

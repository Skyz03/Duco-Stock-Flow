import Link from "next/link";
import { StatCard } from "../../components/StatCard";
import { supabaseServer } from "../../lib/supabaseServer";

const cards = [
  { href: "/duco/purchase", title: "Purchase", description: "View or add purchase entries." },
  { href: "/duco/production", title: "Production", description: "Track production and damaged items." },
  { href: "/duco/sales", title: "Sales", description: "Log sales and review sale history." },
  { href: "/duco/stock", title: "Stock", description: "Review net stock by product code." },
];

function sumByField(rows, field) {
  return rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);
}

async function getDucoSummary() {
  const [purchases, production, sales] = await Promise.all([
    supabaseServer.from("duco_purchase").select("product_pcs_qty"),
    supabaseServer.from("duco_production").select("product_pcs_qty, product_damage_pcs"),
    supabaseServer.from("duco_sales").select("product_pcs_qty"),
  ]);

  const hasError = purchases.error || production.error || sales.error;
  if (hasError) {
    return { totalPurchases: 0, totalProduction: 0, totalSales: 0, totalDamage: 0, netStock: 0 };
  }

  const totalPurchases = sumByField(purchases.data ?? [], "product_pcs_qty");
  const totalProduction = sumByField(production.data ?? [], "product_pcs_qty");
  const totalDamage = sumByField(production.data ?? [], "product_damage_pcs");
  const totalSales = sumByField(sales.data ?? [], "product_pcs_qty");
  const netStock = totalPurchases + totalProduction - totalSales - totalDamage;

  return { totalPurchases, totalProduction, totalSales, totalDamage, netStock };
}

export default async function DucoDashboard() {
  const summary = await getDucoSummary();

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Duco Cups</p>
        <h1 className="text-3xl font-semibold text-zinc-950 md:text-4xl">Duco dashboard</h1>
        <p className="max-w-2xl text-zinc-600">
          Inventory summary for purchase, production, sales, and net stock. Use the left menu to jump between modules quickly.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total purchases" value={summary.totalPurchases.toLocaleString()} accentColor="#1D9E75" description="Purchased pieces." />
        <StatCard title="Total production" value={summary.totalProduction.toLocaleString()} accentColor="#1D9E75" description="Produced pieces." />
        <StatCard title="Total sales" value={summary.totalSales.toLocaleString()} accentColor="#1D9E75" description="Sold pieces." />
        <StatCard title="Net stock" value={summary.netStock.toLocaleString()} accentColor={summary.netStock <= 0 ? "#DC2626" : "#1D9E75"} description={`Damage: ${summary.totalDamage.toLocaleString()} pcs`} />
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="rounded-3xl border border-zinc-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:shadow-md">
            <p className="text-lg font-semibold text-zinc-950">{card.title}</p>
            <p className="mt-2 text-sm text-zinc-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

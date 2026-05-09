import Link from "next/link";
import { StatCard } from "../../components/StatCard";
import { supabaseServer } from "../../lib/supabaseServer";

const cards = [
  { href: "/pack/entries", title: "Entries", description: "View or add Packmandu inventory entries." },
  { href: "/pack/stock", title: "Stock", description: "Review net boxes by product code." },
];

function sumByField(rows, field) {
  return rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);
}

async function getPackSummary() {
  const { data, error } = await supabaseServer
    .from("pack_inventory")
    .select("product_purchase_per_box, product_sales_per_box, product_damage_per_box");

  if (error) {
    return { totalPurchased: 0, totalSold: 0, totalDamage: 0, netStock: 0 };
  }

  const rows = data ?? [];
  const totalPurchased = sumByField(rows, "product_purchase_per_box");
  const totalSold = sumByField(rows, "product_sales_per_box");
  const totalDamage = sumByField(rows, "product_damage_per_box");
  const netStock = totalPurchased - totalSold - totalDamage;

  return { totalPurchased, totalSold, totalDamage, netStock };
}

export default async function PackDashboard() {
  const summary = await getPackSummary();

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Packmandu</p>
        <h1 className="text-3xl font-semibold text-zinc-950 md:text-4xl">Packmandu dashboard</h1>
        <p className="max-w-2xl text-zinc-600">
          Inventory overview for packaging boxes. Use the left menu to move between entries and stock in one click.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total purchased boxes" value={summary.totalPurchased.toLocaleString()} accentColor="#185FA5" description="Purchased boxes." />
        <StatCard title="Total sold boxes" value={summary.totalSold.toLocaleString()} accentColor="#185FA5" description="Sold boxes." />
        <StatCard title="Total damages" value={summary.totalDamage.toLocaleString()} accentColor="#185FA5" description="Damaged boxes." />
        <StatCard title="Net stock" value={summary.netStock.toLocaleString()} accentColor={summary.netStock <= 0 ? "#DC2626" : "#185FA5"} description="Calculated net stock by box." />
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

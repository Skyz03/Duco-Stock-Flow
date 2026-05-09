import { CompanyCard } from "../components/CompanyCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Dual company inventory</p>
          <h1 className="text-5xl font-semibold text-zinc-950">Dual Company Inventory Management</h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600">
            Manage Duco Cups and Packmandu inventories with Supabase-backed data storage, image uploads, and stock tracking.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          <CompanyCard
            title="Duco Cups"
            description="Cup manufacturing inventory, production, sales, and stock."
            href="/duco"
            accentColor="#1D9E75"
          />
          <CompanyCard
            title="Packmandu"
            description="Packaging inventory tracking for boxes, sales, and damages."
            href="/pack"
            accentColor="#185FA5"
          />
        </div>
      </div>
    </div>
  );
}

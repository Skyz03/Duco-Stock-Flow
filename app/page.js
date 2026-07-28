import { AlertTriangle, BarChart3, Database, Download, Factory, Package, ShoppingCart, Upload } from "lucide-react";
import Link from "next/link";
import { CompanyCard } from "../components/CompanyCard";
import { THEME } from "../lib/theme";

export const metadata = {
  title: "Home",
  description: "Manage Duco Cups and Packmandu inventories in one place.",
};

const features = [
  { icon: BarChart3, label: "Real-time stock" },
  { icon: Package, label: "Product tracking" },
  { icon: ShoppingCart, label: "Sales & purchases" },
  { icon: Factory, label: "Production logs" },
  { icon: AlertTriangle, label: "Low stock alerts" },
  { icon: Download, label: "CSV export" },
  { icon: Upload, label: "Image uploads" },
  { icon: Database, label: "Supabase backend" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--app-bg)" }}>
      {/* Sticky navbar */}
      <header className="sticky top-0 z-10 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950">
              <BarChart3 className="h-4 w-4 text-white" aria-hidden />
            </div>
            <span className="text-sm font-bold tracking-tight text-zinc-900">StockFlow</span>
          </div>
          <nav className="flex items-center gap-5">
            <Link
              href="/duco"
              className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
              style={{ ["--hover-color"]: THEME.duco.primary }}
            >
              Duco Cups
            </Link>
            <Link
              href="/pack"
              className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
            >
              Packmandu
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-100 bg-grid py-14 md:py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-zinc-700 shadow-sm">
            Inventory Management Platform
          </div>
          <h1 className="mb-5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl lg:text-7xl">
            Two companies.
            <br />
            <span className="text-zinc-600">One dashboard.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            Unified inventory management for Duco Cups and Packmandu — with real-time stock
            aggregation, purchase and sales tracking, and Supabase-backed data storage.
          </p>
        </div>
      </section>

      {/* Company cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <CompanyCard
            title="Duco Cups"
            description="Manufacturing inventory with purchase, production, and sales tracking. Net stock is computed in real time across all three transaction types."
            href="/duco"
            accentColor={THEME.duco.primary}
            features={[
              "Purchase & production logs",
              "Sales tracking",
              "Net stock by product (pcs)",
              "Low stock warnings",
            ]}
          />
          <CompanyCard
            title="Packmandu"
            description="Packaging inventory with unified purchase, sales, and damage tracking per entry row. Box-level quantities with live aggregation."
            href="/pack"
            accentColor={THEME.pack.primary}
            features={[
              "Inventory entry rows",
              "Box-level tracking",
              "Damage logging",
              "Net stock by product (boxes)",
            ]}
          />
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-12">
          <p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            Platform features
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100">
                  <Icon className="h-5 w-5 text-zinc-600" aria-hidden />
                </div>
                <span className="text-xs font-semibold text-zinc-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack footer */}
      <footer className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-10 text-center">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Built with</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["Next.js 16", "React 19", "Supabase", "Tailwind CSS v4", "Zod", "Cloudinary"].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}

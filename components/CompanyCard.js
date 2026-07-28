import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function CompanyCard({ title, description, href, accentColor, features = [] }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />
      <div className="flex flex-1 flex-col p-5 md:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">Inventory</p>
          <h2 className="mt-1.5 text-2xl font-bold text-zinc-950">{title}</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">{description}</p>
        {features.length > 0 && (
          <ul className="mt-4 space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-zinc-600">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={href}
          className="mt-6 md:mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:gap-3 hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Go to dashboard
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

export function CompanyCard({ title, description, href, accentColor }) {
  return (
    <Link href={href} className="block rounded-3xl border border-zinc-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">{title}</p>
          <p className="mt-4 text-xl font-semibold text-zinc-950">{description}</p>
        </div>
        <div className="h-12 w-12 rounded-2xl" style={{ backgroundColor: accentColor }} />
      </div>
    </Link>
  );
}

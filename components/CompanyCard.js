import Link from "next/link";

export function CompanyCard({ title, description, href, accentColor }) {
  return (
    <div
      className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      style={{ borderTopColor: accentColor, borderTopWidth: "4px" }}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">{title}</p>
        <p className="mt-4 text-lg leading-relaxed text-zinc-800">{description}</p>
      </div>
      <Link
        href={href}
        className="mt-8 inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
        style={{ backgroundColor: accentColor }}
      >
        Go to dashboard
      </Link>
    </div>
  );
}

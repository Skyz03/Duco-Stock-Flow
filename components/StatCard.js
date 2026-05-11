export function StatCard({ title, value, accentColor, description, valueClassName }) {
  return (
    <div
      className="rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5"
      style={{
        borderColor: "var(--app-border)",
        backgroundColor: "var(--app-surface)",
        boxShadow: "var(--app-shadow)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--app-text-muted)" }}>
          {title}
        </p>
        <div className="h-2 w-14 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.9 }} />
      </div>
      <p
        className={`mt-5 text-3xl font-semibold ${valueClassName || ""}`}
        style={valueClassName ? undefined : { color: "var(--app-text)" }}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-3 text-sm" style={{ color: "var(--app-text-muted)" }}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

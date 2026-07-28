export function StatCard({ title, value, accentColor, description, valueClassName, icon: Icon }) {
  return (
    <div
      className="rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        borderColor: "var(--app-border)",
        backgroundColor: "var(--app-surface)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className="text-[11px] font-semibold uppercase leading-tight tracking-[0.18em]"
          style={{ color: "var(--app-text-muted)" }}
        >
          {title}
        </p>
        {Icon ? (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            <Icon className="h-4 w-4" style={{ color: accentColor }} aria-hidden />
          </div>
        ) : (
          <div
            className="mt-0.5 h-1.5 w-12 shrink-0 rounded-full"
            style={{ backgroundColor: accentColor, opacity: 0.7 }}
          />
        )}
      </div>
      <p
        className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl ${valueClassName || ""}`}
        style={valueClassName ? undefined : { color: "var(--app-text)" }}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-xs" style={{ color: "var(--app-text-muted)" }}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

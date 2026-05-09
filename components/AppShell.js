"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function NavLink({ href, label, pathname, accentColor, onNavigate }) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-white shadow-sm"
          : "hover:bg-white/80"
      }`}
      style={{
        color: isActive ? "var(--app-text)" : "var(--app-text-muted)",
        borderLeft: isActive ? `3px solid ${accentColor}` : undefined,
      }}
    >
      {label}
    </Link>
  );
}

function SidebarContent({ title, subtitle, accentColor, navItems, pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-5" style={{ borderColor: "var(--app-border)" }}>
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--app-text-muted)" }}>Inventory System</p>
        <h2 className="mt-2 text-xl font-semibold" style={{ color: "var(--app-text)" }}>{title}</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--app-text-muted)" }}>{subtitle}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            pathname={pathname}
            accentColor={accentColor}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t p-3" style={{ borderColor: "var(--app-border)" }}>
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center justify-center rounded-xl border bg-white px-3 py-2 text-sm font-medium transition hover:bg-zinc-100"
          style={{ borderColor: "var(--app-border)", color: "var(--app-text)" }}
        >
          Switch Company
        </Link>
      </div>
    </div>
  );
}

export function AppShell({ title, subtitle, accentColor, navItems, children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="border-b px-4 py-3 md:hidden" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-surface)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--app-text-muted)" }}>{title}</p>
            <p className="text-sm font-semibold" style={{ color: "var(--app-text)" }}>Navigation</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="rounded-lg border px-3 py-2 text-sm font-medium"
            style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-surface)", color: "var(--app-text)" }}
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <aside className="hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-hidden rounded-2xl border md:sticky md:top-4 md:block" style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-surface-muted)", boxShadow: "var(--app-shadow)" }}>
          <SidebarContent
            title={title}
            subtitle={subtitle}
            accentColor={accentColor}
            navItems={navItems}
            pathname={pathname}
          />
        </aside>

        {isOpen ? (
          <div className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" onClick={() => setIsOpen(false)}>
            <aside
              className="h-full w-72 overflow-hidden border-r"
              style={{ borderColor: "var(--app-border)", backgroundColor: "var(--app-surface-muted)" }}
              onClick={(event) => event.stopPropagation()}
            >
              <SidebarContent
                title={title}
                subtitle={subtitle}
                accentColor={accentColor}
                navItems={navItems}
                pathname={pathname}
                onNavigate={() => setIsOpen(false)}
              />
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

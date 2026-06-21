"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ChevronLeft,
  ClipboardList,
  Factory,
  LayoutDashboard,
  Layers,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  ShoppingCart,
  Factory,
  TrendingUp,
  Boxes,
  ClipboardList,
};

function NavItem({ item, pathname, brandColor, onNavigate }) {
  const Icon = ICON_MAP[item.icon] || LayoutDashboard;
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        isActive
          ? "text-white shadow-sm"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
      style={isActive ? { backgroundColor: brandColor } : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {item.label}
    </Link>
  );
}

export function Sidebar({ companyName, brandColor, navItems, backLink, onNavigate }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5 text-white" style={{ backgroundColor: brandColor }}>
        <div className="mb-1.5 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/20">
            <Layers className="h-3 w-3 text-white" aria-hidden />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/70">Inventory</p>
        </div>
        <h2 className="text-lg font-bold leading-tight">{companyName}</h2>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            pathname={pathname}
            brandColor={brandColor}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <Link
          href={backLink.href}
          onClick={onNavigate}
          className="flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-900"
        >
          {backLink.label}
        </Link>
      </div>
    </div>
  );
}

/** Compact top bar shown on mobile: back button + company name. */
export function MobileTopBar({ companyName, brandColor, backLink }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
      <Link
        href={backLink.href}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50"
        aria-label="Back to all companies"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </Link>
      <div className="flex items-center gap-2">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: `${brandColor}22` }}
        >
          <Layers className="h-3 w-3" style={{ color: brandColor }} aria-hidden />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase leading-none tracking-[0.22em] text-zinc-400">
            Inventory
          </p>
          <p className="text-sm font-bold leading-snug text-zinc-900">{companyName}</p>
        </div>
      </div>
    </div>
  );
}

/** Fixed bottom navigation bar shown on mobile. */
export function BottomNav({ navItems, brandColor }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 px-1 py-3 text-[10px] font-semibold transition-colors ${
                isActive ? "" : "text-zinc-400 hover:text-zinc-700"
              }`}
              style={isActive ? { color: brandColor } : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

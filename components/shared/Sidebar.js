"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ClipboardList, Factory, LayoutDashboard, Menu, ShoppingCart, TrendingUp } from "lucide-react";

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
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        isActive ? "text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">Inventory</p>
        <h2 className="mt-1 text-lg font-bold leading-tight">{companyName}</h2>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} brandColor={brandColor} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <Link
          href={backLink.href}
          onClick={onNavigate}
          className="flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
        >
          {backLink.label}
        </Link>
      </div>
    </div>
  );
}

export function MobileNavBar({ companyName, onOpenMenu }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{companyName}</p>
        <p className="text-sm font-semibold text-zinc-900">Menu</p>
      </div>
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800"
      >
        <Menu className="h-4 w-4" />
        Open
      </button>
    </div>
  );
}

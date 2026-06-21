"use client";

import { BottomNav, MobileTopBar, Sidebar } from "./shared/Sidebar";

export function AppShell({ companyName, brandColor, navItems, backLink, children }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--app-bg)" }}>
      {/* Mobile: compact sticky top bar with back button */}
      <MobileTopBar companyName={companyName} brandColor={brandColor} backLink={backLink} />

      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <Sidebar
              companyName={companyName}
              brandColor={brandColor}
              navItems={navItems}
              backLink={backLink}
            />
          </div>
        </aside>

        {/* Extra bottom padding on mobile so content isn't hidden behind the bottom nav */}
        <main className="min-w-0 flex-1 pb-24 md:pb-0">{children}</main>
      </div>

      {/* Mobile: fixed bottom navigation bar */}
      <BottomNav navItems={navItems} brandColor={brandColor} />
    </div>
  );
}

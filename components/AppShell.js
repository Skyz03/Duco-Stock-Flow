"use client";

import { useState } from "react";
import { MobileNavBar, Sidebar } from "./shared/Sidebar";

export function AppShell({ companyName, brandColor, navItems, backLink, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50">
      <MobileNavBar companyName={companyName} onOpenMenu={() => setIsOpen(true)} />

      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-6 md:px-6 md:py-8">
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

        {isOpen ? (
          <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setIsOpen(false)}>
            <aside
              className="h-full w-64 max-w-[85vw] overflow-y-auto border-r border-zinc-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                companyName={companyName}
                brandColor={brandColor}
                navItems={navItems}
                backLink={backLink}
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

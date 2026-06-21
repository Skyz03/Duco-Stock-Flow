"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export function SlideOver({ isOpen, onClose, title, children }) {
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      const node = panelRef.current;
      if (!node) return;
      const focusable = node.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      if (first && typeof first.focus === "function") first.focus();
    } else {
      if (triggerRef.current && typeof triggerRef.current.focus === "function") {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close panel"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-entry-panel relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-2xl md:h-full md:max-h-none md:max-w-md md:rounded-none"
      >
        <div className="relative flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 pb-4 pt-3 md:py-4">
          <div className="pointer-events-none absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-zinc-200 md:hidden" aria-hidden />
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto min-h-[44px] min-w-[44px] rounded-lg p-2.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}

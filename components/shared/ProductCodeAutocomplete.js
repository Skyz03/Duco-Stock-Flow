"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

export function ProductCodeAutocomplete({ value, onChange, onSelect, apiPath, disabled, placeholder }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebouncedValue(value, 300);
  const rootRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const q = debounced ?? "";
        const res = await fetch(`${apiPath}?q=${encodeURIComponent(q)}`, { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setItems(Array.isArray(json) ? json : []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [debounced, apiPath]);

  return (
    <div ref={rootRef} className="relative">
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || "Search product name…"}
        className="mt-2 min-h-[44px] w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-zinc-300"
      />

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-400">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-500" />
              Searching…
            </div>
          ) : !items.length ? (
            <div className="px-4 py-3 text-sm text-zinc-400">No products found</div>
          ) : (
            <>
              <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                {value ? "Matching products" : "All products"}
              </p>
              <ul className="max-h-60 overflow-auto py-1">
                {items.map((p) => (
                  <li key={p.product_code}>
                    <button
                      type="button"
                      onClick={() => { onSelect(p); setOpen(false); }}
                      className="flex min-h-[48px] w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-zinc-50 active:bg-zinc-100"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 overflow-hidden">
                        {p.product_pic ? (
                          <Image
                            src={p.product_pic}
                            alt={p.product_name || "Product"}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-zinc-400">
                            {(p.product_code || "?")[0].toUpperCase()}
                          </span>
                        )}
                      </span>
                      <span className="flex flex-col min-w-0">
                        <span className="truncate text-sm font-semibold text-zinc-800">{p.product_name}</span>
                        <span className="font-mono text-xs text-zinc-500">{p.product_code}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

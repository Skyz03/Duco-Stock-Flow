"use client";

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
      if (!debounced || debounced.length < 1) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${apiPath}?q=${encodeURIComponent(debounced)}`, { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(json) ? json : []);
          setOpen(true);
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [debounced, apiPath]);

  return (
    <div ref={rootRef} className="relative">
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => value && setOpen(true)}
        placeholder={placeholder || "Product code"}
        className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
      />
      {loading ? <p className="mt-1 text-xs text-zinc-500">Searching…</p> : null}
      {open && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-zinc-200 bg-white py-1 text-sm shadow-lg">
          {!items.length ? (
            <li className="px-3 py-2 text-zinc-500">No products found</li>
          ) : (
            items.map((p) => (
              <li key={p.product_code}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-zinc-50"
                  onClick={() => {
                    onSelect(p);
                    setOpen(false);
                  }}
                >
                  {p.product_pic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.product_pic} alt="" className="h-6 w-6 rounded object-cover" />
                  ) : (
                    <span className="h-6 w-6 rounded bg-zinc-100" />
                  )}
                  <span className="font-mono text-xs text-zinc-900">{p.product_code}</span>
                  <span className="truncate text-zinc-600">{p.product_name}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

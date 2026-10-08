"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCodeAutocomplete } from "./ProductCodeAutocomplete";

export function ProductQtyEditor({
  apiPath,
  autocompletePath,
  qtyField,
  qtyLabel,
  placeholder,
  accentColor,
}) {
  const [product, setProduct] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [qty, setQty] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    if (!product) {
      toast.error("Select a product first");
      return;
    }
    const n = Number(qty);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) {
      toast.error(`${qtyLabel} must be a positive whole number`);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_code: product.product_code, [qtyField]: n }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success(`${qtyLabel} saved`);
      setProduct({ ...product, [qtyField]: n });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const current = product?.[qtyField];

  return (
    <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <span className="text-sm font-medium text-zinc-800">Search product</span>
        <ProductCodeAutocomplete
          value={codeInput}
          onChange={(v) => {
            setCodeInput(v);
            setProduct(null);
          }}
          onSelect={(p) => {
            setProduct(p);
            setCodeInput(p.product_code);
            setQty(p[qtyField] != null ? String(p[qtyField]) : "");
          }}
          apiPath={autocompletePath}
          placeholder="Type product code or name…"
        />
      </div>

      {product ? (
        <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            {product.product_pic ? (
              <Image
                src={product.product_pic}
                alt={product.product_name || "Product"}
                width={48}
                height={48}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-zinc-400">
                {(product.product_code || "?")[0].toUpperCase()}
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-semibold text-zinc-800">{product.product_code}</p>
            <p className="truncate text-sm text-zinc-700">{product.product_name}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Current {qtyLabel.toLowerCase()}:{" "}
              <span className="font-semibold text-zinc-800">
                {current != null ? current : "not set"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <p className="rounded-xl bg-zinc-50 px-3 py-6 text-center text-xs text-zinc-400">
          Select a product above to edit its {qtyLabel.toLowerCase()}.
        </p>
      )}

      <label className="block text-sm">
        <span className="font-medium text-zinc-800">{qtyLabel}</span>
        <input
          type="text"
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder={placeholder || "e.g. 24"}
          disabled={!product || saving}
          className="mt-2 min-h-[44px] w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-zinc-300 disabled:bg-zinc-50 disabled:text-zinc-400"
        />
      </label>

      <button
        type="submit"
        disabled={!product || saving}
        className="min-h-[44px] w-full rounded-xl px-4 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: accentColor || "#18181b" }}
      >
        {saving ? "Saving…" : `Save ${qtyLabel.toLowerCase()}`}
      </button>
    </form>
  );
}

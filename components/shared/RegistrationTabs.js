"use client";

import { useState } from "react";
import { EntriesWorkbench } from "./EntriesWorkbench";
import { ProductQtyEditor } from "./ProductQtyEditor";

export function RegistrationTabs({
  accentColor,
  apiPath,
  autocompletePath,
  fields,
  columns,
  qtyField,
  qtyLabel,
  qtyPlaceholder,
}) {
  const [tab, setTab] = useState("entry");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">Product registration</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Add new products, then set {qtyLabel.toLowerCase()} from the Products tab.
        </p>
      </div>

      <div className="flex gap-1 border-b border-zinc-200">
        <TabBtn active={tab === "entry"} color={accentColor} onClick={() => setTab("entry")}>
          Product Entry
        </TabBtn>
        <TabBtn active={tab === "products"} color={accentColor} onClick={() => setTab("products")}>
          Products
        </TabBtn>
      </div>

      {tab === "entry" ? (
        <EntriesWorkbench
          title=""
          apiPath={apiPath}
          accentColor={accentColor}
          fields={fields}
          columns={columns}
        />
      ) : (
        <ProductQtyEditor
          apiPath={apiPath}
          autocompletePath={autocompletePath}
          qtyField={qtyField}
          qtyLabel={qtyLabel}
          placeholder={qtyPlaceholder}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}

function TabBtn({ active, color, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative -mb-px px-4 py-3 text-sm font-semibold transition"
      style={{ color: active ? color : "#71717a" }}
    >
      {children}
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full" style={{ backgroundColor: color }} />
      ) : null}
    </button>
  );
}

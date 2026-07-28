import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Purchase — Packmandu",
  description: "Log box purchases for Packmandu.",
};

const fields = [
  { name: "product_code", label: "Product code", type: "string", required: true, autocompletePath: "/api/pack/products" },
  { name: "product_name", label: "Product name", type: "string", required: true },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true },
  { name: "product_purchase_per_box", label: "Total box purchase", type: "integer", required: true, min: 0 },
  { name: "product_pcs_per_box", label: "Qty per box", type: "integer", required: true, min: 0 },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
  { key: "product_purchase_per_box", header: "Boxes", headerClassName: "text-right", className: "text-right tabular-nums" },
  { key: "product_pcs_per_box", header: "Qty/box", headerClassName: "text-right", className: "text-right tabular-nums", hideMobile: true },
];

export default function PackPurchasePage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Purchase entries"
        apiPath="/api/pack/purchase"
        exportPath="/api/pack/purchase/export"
        accentColor={THEME.pack.primary}
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

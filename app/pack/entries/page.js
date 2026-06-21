import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Inventory Entries — Packmandu",
  description: "Log and manage packaging inventory entries for Packmandu.",
};

const fields = [
  {
    name: "product_code",
    label: "Product code",
    type: "string",
    required: true,
    autocompletePath: "/api/pack/products",
  },
  { name: "product_name", label: "Product name", type: "string", required: true },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "product_purchase_per_box", label: "Purchase (boxes)", type: "integer", required: true, min: 0 },
  { name: "product_pcs_per_box", label: "Pieces / box", type: "integer", required: true, min: 0 },
  { name: "product_sales_per_box", label: "Sales (boxes)", type: "integer", required: true, min: 0 },
  { name: "product_damage_per_box", label: "Damage (boxes)", type: "integer", required: false, min: 0, defaultValue: 0 },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  {
    key: "product_purchase_per_box",
    header: "Purchase",
    headerClassName: "text-right",
    className: "text-right tabular-nums",
  },
  { key: "product_pcs_per_box", header: "Pcs/box", headerClassName: "text-right", className: "text-right tabular-nums", hideMobile: true },
  { key: "product_sales_per_box", header: "Sales", headerClassName: "text-right", className: "text-right tabular-nums" },
  { key: "product_damage_per_box", header: "Damage", headerClassName: "text-right", className: "text-right tabular-nums", hideMobile: true },
];

export default function PackEntriesPage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Inventory entries"
        apiPath="/api/pack/inventory"
        exportPath="/api/pack/inventory/export"
        accentColor={THEME.pack.primary}
        fields={fields}
        columns={columns}
        stockCheck={{
          apiPath: "/api/pack/stock/check",
          type: "sales",
          qtyField: "product_sales_per_box",
          purchaseField: "product_purchase_per_box",
        }}
        packWarning
      />
    </div>
  );
}

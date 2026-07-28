import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Sales — Packmandu",
  description: "Log box sales for Packmandu.",
};

const fields = [
  { name: "product_code", label: "Product code", type: "string", required: true, autocompletePath: "/api/pack/products", placeholder: "e.g. PM-001" },
  { name: "product_name", label: "Product name", type: "string", required: true, placeholder: "e.g. Premium Kraft Box" },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true, placeholder: "e.g. Nepal" },
  { name: "product_sales_per_box", label: "Total box sales", type: "integer", required: true, min: 0, placeholder: "e.g. 30" },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
  { key: "product_sales_per_box", header: "Boxes sold", headerClassName: "text-right", className: "text-right tabular-nums" },
];

export default function PackSalesPage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Sales entries"
        apiPath="/api/pack/sales"
        exportPath="/api/pack/sales/export"
        accentColor={THEME.pack.primary}
        fields={fields}
        columns={columns}
        stockCheck={{ apiPath: "/api/pack/stock/check", type: "sales", qtyField: "product_sales_per_box" }}
        packWarning
      />
    </div>
  );
}

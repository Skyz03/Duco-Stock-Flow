import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Sales Entries — Duco Cups",
  description: "Track outbound cup sales for Duco Cups.",
};

const fields = [
  { name: "product_code", label: "Product code", type: "string", required: true, autocompletePath: "/api/duco/products", placeholder: "e.g. DC-001" },
  { name: "product_name", label: "Product name", type: "string", required: true, placeholder: "e.g. Classic White Cup" },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true, placeholder: "e.g. Nepal" },
  { name: "product_pcs_qty", label: "Total pcs sold", type: "integer", required: true, min: 1, placeholder: "e.g. 2000" },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
  { key: "product_pcs_qty", header: "Pcs sold", headerClassName: "text-right", className: "text-right tabular-nums" },
];

export default function DucoSalesPage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Sales entries"
        apiPath="/api/duco/sales"
        accentColor={THEME.duco.primary}
        fields={fields}
        columns={columns}
        stockCheck={{
          apiPath: "/api/duco/stock/check",
          type: "sales",
          qtyField: "product_pcs_qty",
        }}
      />
    </div>
  );
}

import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Production Entries — Duco Cups",
  description: "Log production output and damage entries for Duco Cups.",
};

const fields = [
  { name: "product_code", label: "Product code", type: "string", required: true, autocompletePath: "/api/duco/products", placeholder: "e.g. DC-001" },
  { name: "product_name", label: "Product name", type: "string", required: true, placeholder: "e.g. Classic White Cup" },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true, placeholder: "e.g. Nepal" },
  { name: "product_box_used", label: "Cartons used", type: "integer", required: false, min: 0, defaultValue: 0, placeholder: "e.g. 10" },
  { name: "product_pcs_qty", label: "Qty produced (pcs)", type: "integer", required: true, min: 1, placeholder: "e.g. 1000" },
  { name: "product_damage_pcs", label: "Qty damage (pcs)", type: "integer", required: false, min: 0, defaultValue: 0, placeholder: "e.g. 0" },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
  { key: "product_box_used", header: "Cartons used", headerClassName: "text-right", className: "text-right tabular-nums", hideMobile: true },
  { key: "product_pcs_qty", header: "Produced (pcs)", headerClassName: "text-right", className: "text-right tabular-nums" },
  { key: "product_damage_pcs", header: "Damage (pcs)", headerClassName: "text-right", className: "text-right tabular-nums text-red-500", hideMobile: true },
];

export default function DucoProductionPage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Production entries"
        apiPath="/api/duco/production"
        exportPath="/api/duco/production/export"
        accentColor={THEME.duco.primary}
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

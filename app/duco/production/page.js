import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Production Entries — Duco Cups",
  description: "Log production output and damage entries for Duco Cups.",
};

const fields = [
  {
    name: "product_code",
    label: "Product code",
    type: "string",
    required: true,
    autocompletePath: "/api/duco/products",
  },
  { name: "product_name", label: "Product name", type: "string", required: true },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "product_pcs_qty", label: "Produced pieces", type: "integer", required: true, min: 1 },
  { name: "product_damage_pcs", label: "Damage pieces", type: "integer", required: false, min: 0, defaultValue: 0 },
  { name: "product_damage_boxes", label: "Damage boxes", type: "integer", required: false, min: 0, defaultValue: 0 },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "product_pcs_qty", header: "Pcs qty", headerClassName: "text-right", className: "text-right tabular-nums" },
  { key: "product_damage_pcs", header: "Damage pcs", headerClassName: "text-right", className: "text-right tabular-nums", hideMobile: true },
  { key: "product_damage_boxes", header: "Damage boxes", headerClassName: "text-right", className: "text-right tabular-nums", hideMobile: true },
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

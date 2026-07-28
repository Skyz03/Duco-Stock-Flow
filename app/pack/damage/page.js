import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Damage — Packmandu",
  description: "Log damaged boxes for Packmandu.",
};

const fields = [
  { name: "product_code", label: "Product code", type: "string", required: true, autocompletePath: "/api/pack/products" },
  { name: "product_name", label: "Product name", type: "string", required: true },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true },
  { name: "product_damage_per_box", label: "Boxes damaged", type: "integer", required: true, min: 0 },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
  { key: "product_damage_per_box", header: "Boxes damaged", headerClassName: "text-right", className: "text-right tabular-nums text-red-500" },
];

export default function PackDamagePage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Damage entries"
        apiPath="/api/pack/damage"
        exportPath="/api/pack/damage/export"
        accentColor={THEME.pack.primary}
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

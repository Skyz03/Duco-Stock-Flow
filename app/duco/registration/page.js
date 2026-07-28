import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Products — Duco Cups",
  description: "Register products before logging purchases, production, or sales.",
};

const fields = [
  { name: "product_code", label: "Product code (ID)", type: "string", required: true, placeholder: "e.g. DC-001" },
  { name: "product_name", label: "Product name", type: "string", required: true, placeholder: "e.g. Classic White Cup" },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true, placeholder: "e.g. Nepal" },
  { name: "cup_qty_per_box", label: "Cups per box", type: "integer", required: true, min: 1, placeholder: "e.g. 100" },
];

const columns = [
  { key: "product_code", header: "Code (ID)" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
  { key: "cup_qty_per_box", header: "Cups/box", headerClassName: "text-right", className: "text-right tabular-nums" },
];

export default function DucoRegistrationPage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Product registration"
        apiPath="/api/duco/registration"
        exportPath="/api/duco/registration/export"
        accentColor={THEME.duco.primary}
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

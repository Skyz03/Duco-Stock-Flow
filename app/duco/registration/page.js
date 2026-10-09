import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";
import { COUNTRY_SUGGESTIONS } from "../../../lib/countries";

export const metadata = {
  title: "Products — Duco Cups",
  description: "Register products for Duco Cups.",
};

const fields = [
  { name: "product_code", label: "Product code (ID)", type: "string", required: true, placeholder: "e.g. DC-001" },
  { name: "product_name", label: "Product name", type: "string", required: true, placeholder: "e.g. Classic White Cup" },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true, placeholder: "e.g. Nepal", suggestions: COUNTRY_SUGGESTIONS },
  { name: "cup_qty_per_box", label: "Fan per box", type: "integer", required: true, placeholder: "e.g. 100" },
];

const columns = [
  { key: "product_code", header: "Code (ID)" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
  { key: "cup_qty_per_box", header: "Fan/box", headerClassName: "text-right", className: "text-right tabular-nums" },
];

export default function DucoRegistrationPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">Product registration</h1>
        <p className="mt-1 text-sm text-zinc-600">Register new products including fan per box.</p>
      </div>
      <EntriesWorkbench
        title=""
        apiPath="/api/duco/registration"
        accentColor={THEME.duco.primary}
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

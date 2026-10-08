import { RegistrationTabs } from "../../../components/shared/RegistrationTabs";
import { THEME } from "../../../lib/theme";
import { COUNTRY_SUGGESTIONS } from "../../../lib/countries";

export const metadata = {
  title: "Products — Packmandu",
  description: "Register products, then set pcs per box from the Products tab.",
};

const fields = [
  { name: "product_code", label: "Product code (ID)", type: "string", required: true, placeholder: "e.g. PM-001" },
  { name: "product_name", label: "Product name", type: "string", required: true, placeholder: "e.g. Premium Kraft Box" },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true, placeholder: "e.g. Nepal", suggestions: COUNTRY_SUGGESTIONS },
];

const columns = [
  { key: "product_code", header: "Code (ID)" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
  { key: "pcs_per_box", header: "Pcs/box", headerClassName: "text-right", className: "text-right tabular-nums" },
];

export default function PackRegistrationPage() {
  return (
    <div className="max-w-6xl">
      <RegistrationTabs
        accentColor={THEME.pack.primary}
        apiPath="/api/pack/registration"
        autocompletePath="/api/pack/products"
        fields={fields}
        columns={columns}
        qtyField="pcs_per_box"
        qtyLabel="Pcs per box"
        qtyPlaceholder="e.g. 24"
      />
    </div>
  );
}

import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Products — Packmandu",
  description: "Register products before logging purchases, sales, or damage.",
};

const fields = [
  { name: "product_code", label: "Product code (ID)", type: "string", required: true },
  { name: "product_name", label: "Product name", type: "string", required: true },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "country_of_origin", label: "Country of origin", type: "string", required: true },
];

const columns = [
  { key: "product_code", header: "Code (ID)" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "country_of_origin", header: "Origin", hideMobile: true },
];

export default function PackRegistrationPage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Product registration"
        apiPath="/api/pack/registration"
        exportPath="/api/pack/registration/export"
        accentColor={THEME.pack.primary}
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

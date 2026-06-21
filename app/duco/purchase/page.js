import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";
import { THEME } from "../../../lib/theme";

export const metadata = {
  title: "Purchase Entries — Duco Cups",
  description: "Log and manage cup purchase entries for Duco Cups.",
};

const fields = [
  { name: "product_code", label: "Product code", type: "string", required: true },
  { name: "product_name", label: "Product name", type: "string", required: true },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "product_box_qty", label: "Box quantity", type: "integer", required: true, min: 1 },
  { name: "product_pcs_qty", label: "Pieces quantity", type: "integer", required: true, min: 1 },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image", hideMobile: true },
  { key: "product_box_qty", header: "Box qty", headerClassName: "text-right", className: "text-right tabular-nums", hideMobile: true },
  { key: "product_pcs_qty", header: "Pcs qty", headerClassName: "text-right", className: "text-right tabular-nums" },
];

export default function DucoPurchasePage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Purchase entries"
        apiPath="/api/duco/purchase"
        exportPath="/api/duco/purchase/export"
        accentColor={THEME.duco.primary}
        fields={fields}
        columns={columns}
      />
    </div>
  );
}

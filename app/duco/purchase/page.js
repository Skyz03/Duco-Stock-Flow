import { EntryManager } from "../../../components/EntryManager";

const fields = [
  { name: "product_code", label: "Product Code", type: "string", required: true },
  { name: "product_name", label: "Product Name", type: "string", required: true },
  { name: "product_pic", label: "Product Image URL", type: "image_url", required: false },
  { name: "product_box_qty", label: "Box Quantity", type: "integer", required: true },
  { name: "product_pcs_qty", label: "Pieces Quantity", type: "integer", required: true },
  { name: "date", label: "Date", type: "date", required: true },
];
const columns = ["product_code", "product_name", "product_box_qty", "product_pcs_qty", "date"];

export default function DucoPurchasePage() {
  return (
    <div className="max-w-6xl">
      <EntryManager title="Duco Purchase" apiBase="/api/duco/purchase" fields={fields} columns={columns} accentColor="#1D9E75" />
    </div>
  );
}

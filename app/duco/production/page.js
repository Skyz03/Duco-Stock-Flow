import { EntryManager } from "../../../components/EntryManager";

const fields = [
  { name: "product_code", label: "Product Code", type: "string", required: true },
  { name: "product_name", label: "Product Name", type: "string", required: true },
  { name: "product_pic", label: "Product Image URL", type: "image_url", required: false },
  { name: "product_pcs_qty", label: "Produced Pieces", type: "integer", required: true },
  { name: "product_damage_pcs", label: "Damage Pieces", type: "integer", required: false },
  { name: "product_damage_boxes", label: "Damage Boxes", type: "integer", required: false },
  { name: "date", label: "Date", type: "date", required: true },
];
const columns = ["product_code", "product_name", "product_pcs_qty", "product_damage_pcs", "product_damage_boxes", "date"];

export default function DucoProductionPage() {
  return (
    <div className="max-w-6xl">
      <EntryManager title="Duco Production" apiBase="/api/duco/production" fields={fields} columns={columns} accentColor="#1D9E75" />
    </div>
  );
}

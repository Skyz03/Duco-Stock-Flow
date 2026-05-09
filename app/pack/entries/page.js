import { EntryManager } from "../../../components/EntryManager";

const fields = [
  { name: "product_code", label: "Product Code", type: "string", required: true },
  { name: "product_name", label: "Product Name", type: "string", required: true },
  { name: "product_pic", label: "Product Image URL", type: "image_url", required: false },
  { name: "product_purchase_per_box", label: "Purchase Boxes", type: "integer", required: true },
  { name: "product_pcs_per_box", label: "Pieces per Box", type: "integer", required: true },
  { name: "product_sales_per_box", label: "Sales Boxes", type: "integer", required: true },
  { name: "product_damage_per_box", label: "Damage Boxes", type: "integer", required: false },
  { name: "date", label: "Date", type: "date", required: true },
];
const columns = ["product_code", "product_name", "product_purchase_per_box", "product_pcs_per_box", "product_sales_per_box", "product_damage_per_box", "date"];

export default function PackEntriesPage() {
  return (
    <div className="max-w-6xl">
      <EntryManager title="Packmandu Inventory" apiBase="/api/pack/inventory" fields={fields} columns={columns} accentColor="#185FA5" />
    </div>
  );
}

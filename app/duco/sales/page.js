import { EntryManager } from "../../../components/EntryManager";

const fields = [
  { name: "product_code", label: "Product Code", type: "string", required: true },
  { name: "product_name", label: "Product Name", type: "string", required: true },
  { name: "product_pic", label: "Product Image URL", type: "image_url", required: false },
  { name: "product_pcs_qty", label: "Sold Pieces", type: "integer", required: true },
  { name: "date", label: "Date", type: "date", required: true },
];
const columns = ["product_code", "product_name", "product_pcs_qty", "date"];

export default function DucoSalesPage() {
  return (
    <div className="max-w-6xl">
      <EntryManager title="Duco Sales" apiBase="/api/duco/sales" fields={fields} columns={columns} accentColor="#1D9E75" />
    </div>
  );
}

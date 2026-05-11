import { EntriesWorkbench } from "../../../components/shared/EntriesWorkbench";

const fields = [
  {
    name: "product_code",
    label: "Product code",
    type: "string",
    required: true,
    autocompletePath: "/api/duco/products",
  },
  { name: "product_name", label: "Product name", type: "string", required: true },
  { name: "product_pic", label: "Product image", type: "image_url", required: false },
  { name: "product_pcs_qty", label: "Sold pieces", type: "integer", required: true, min: 1 },
  { name: "date", label: "Date", type: "date", required: true },
];

const columns = [
  { key: "date", header: "Date" },
  { key: "product_code", header: "Code" },
  { key: "product_name", header: "Product" },
  { key: "product_pic", header: "Image" },
  { key: "product_pcs_qty", header: "Pcs qty", headerClassName: "text-right", className: "text-right tabular-nums" },
];

export default function DucoSalesPage() {
  return (
    <div className="max-w-6xl">
      <EntriesWorkbench
        title="Sales entries"
        apiPath="/api/duco/sales"
        exportPath="/api/duco/sales/export"
        accentColor="#1D9E75"
        fields={fields}
        columns={columns}
        stockCheck={{ apiPath: "/api/duco/stock/check", type: "sales", qtyField: "product_pcs_qty" }}
      />
    </div>
  );
}

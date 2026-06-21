import { PackStockClient } from "../../../components/PackStockClient";

export const metadata = {
  title: "Stock — Packmandu",
  description: "Net boxes per product code from all Packmandu inventory rows.",
};

export default function PackStockPage() {
  return <PackStockClient />;
}

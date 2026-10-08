import { DucoStockClient } from "../../../components/DucoStockClient";

export const metadata = {
  title: "Stock — Duco Cups",
  description: "Net fans per product code: purchased pcs − produced pcs + damaged pcs.",
};

export default function DucoStockPage() {
  return <DucoStockClient />;
}

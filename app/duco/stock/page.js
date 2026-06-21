import { DucoStockClient } from "../../../components/DucoStockClient";

export const metadata = {
  title: "Stock — Duco Cups",
  description: "Net pieces per product code, aggregated from purchases, production, sales, and damage.",
};

export default function DucoStockPage() {
  return <DucoStockClient />;
}

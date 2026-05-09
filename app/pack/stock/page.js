import { StockTable } from "../../../components/StockTable";
import { supabaseServer } from "../../../lib/supabaseServer";

async function getStock() {
  const { data, error } = await supabaseServer
    .from("pack_inventory")
    .select("product_code, product_purchase_per_box, product_sales_per_box, product_damage_per_box");

  if (error) return [];

  const totals = {};

  for (const item of data ?? []) {
    totals[item.product_code] = totals[item.product_code] || { product_code: item.product_code, purchase: 0, sales: 0, damage: 0 };
    totals[item.product_code].purchase += Number(item.product_purchase_per_box || 0);
    totals[item.product_code].sales += Number(item.product_sales_per_box || 0);
    totals[item.product_code].damage += Number(item.product_damage_per_box || 0);
  }

  return Object.values(totals).map((item) => ({
    product_code: item.product_code,
    net_stock: item.purchase - item.sales - item.damage,
  }));
}

export default async function PackStockPage() {
  const rows = await getStock();
  return (
    <div className="max-w-6xl">
      <StockTable rows={rows} columns={["product_code", "net_stock"]} accentColor="#185FA5" />
    </div>
  );
}

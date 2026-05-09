import { StockTable } from "../../../components/StockTable";
import { supabaseServer } from "../../../lib/supabaseServer";

async function getStock() {
  const [purchases, production, sales] = await Promise.all([
    supabaseServer.from("duco_purchase").select("product_code, product_pcs_qty"),
    supabaseServer.from("duco_production").select("product_code, product_pcs_qty, product_damage_pcs"),
    supabaseServer.from("duco_sales").select("product_code, product_pcs_qty"),
  ]);

  if (purchases.error || production.error || sales.error) {
    return [];
  }

  const totals = {};

  for (const item of purchases.data ?? []) {
    totals[item.product_code] = totals[item.product_code] || { product_code: item.product_code, purchase: 0, production: 0, sales: 0, damage: 0 };
    totals[item.product_code].purchase += Number(item.product_pcs_qty || 0);
  }
  for (const item of production.data ?? []) {
    totals[item.product_code] = totals[item.product_code] || { product_code: item.product_code, purchase: 0, production: 0, sales: 0, damage: 0 };
    totals[item.product_code].production += Number(item.product_pcs_qty || 0);
    totals[item.product_code].damage += Number(item.product_damage_pcs || 0);
  }
  for (const item of sales.data ?? []) {
    totals[item.product_code] = totals[item.product_code] || { product_code: item.product_code, purchase: 0, production: 0, sales: 0, damage: 0 };
    totals[item.product_code].sales += Number(item.product_pcs_qty || 0);
  }

  return Object.values(totals).map((item) => ({
    product_code: item.product_code,
    net_stock: item.purchase + item.production - item.sales - item.damage,
  }));
}

export default async function DucoStockPage() {
  const rows = await getStock();
  return (
    <div className="max-w-6xl">
      <StockTable rows={rows} columns={["product_code", "net_stock"]} accentColor="#1D9E75" />
    </div>
  );
}

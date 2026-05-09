import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  const [purchases, production, sales] = await Promise.all([
    supabaseServer.from("duco_purchase").select("product_code, product_pcs_qty"),
    supabaseServer.from("duco_production").select("product_code, product_pcs_qty, product_damage_pcs"),
    supabaseServer.from("duco_sales").select("product_code, product_pcs_qty"),
  ]);

  if (purchases.error || production.error || sales.error) {
    const message = purchases.error?.message || production.error?.message || sales.error?.message || "Unable to load stock.";
    return new Response(message, { status: 500 });
  }

  const totals = {};

  (purchases.data ?? []).forEach((item) => {
    totals[item.product_code] = totals[item.product_code] || { product_code: item.product_code, purchase: 0, production: 0, sales: 0, damage: 0 };
    totals[item.product_code].purchase += Number(item.product_pcs_qty || 0);
  });
  (production.data ?? []).forEach((item) => {
    totals[item.product_code] = totals[item.product_code] || { product_code: item.product_code, purchase: 0, production: 0, sales: 0, damage: 0 };
    totals[item.product_code].production += Number(item.product_pcs_qty || 0);
    totals[item.product_code].damage += Number(item.product_damage_pcs || 0);
  });
  (sales.data ?? []).forEach((item) => {
    totals[item.product_code] = totals[item.product_code] || { product_code: item.product_code, purchase: 0, production: 0, sales: 0, damage: 0 };
    totals[item.product_code].sales += Number(item.product_pcs_qty || 0);
  });

  const rows = Object.values(totals).map((item) => ({
    product_code: item.product_code,
    net_stock: item.purchase + item.production - item.sales - item.damage,
  }));

  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
}

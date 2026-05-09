import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseServer.from("pack_inventory").select("product_code, product_purchase_per_box, product_sales_per_box, product_damage_per_box");
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const totals = {};
  (data ?? []).forEach((item) => {
    totals[item.product_code] = totals[item.product_code] || { product_code: item.product_code, purchase: 0, sales: 0, damage: 0 };
    totals[item.product_code].purchase += Number(item.product_purchase_per_box || 0);
    totals[item.product_code].sales += Number(item.product_sales_per_box || 0);
    totals[item.product_code].damage += Number(item.product_damage_per_box || 0);
  });

  const rows = Object.values(totals).map((item) => ({
    product_code: item.product_code,
    net_stock: item.purchase - item.sales - item.damage,
  }));

  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
}

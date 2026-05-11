import { NextResponse } from "next/server";
import { sumRows } from "../../../../lib/sumColumn";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  try {
    const [purchases, production, sales] = await Promise.all([
      supabaseServer.from("duco_purchase").select("product_pcs_qty"),
      supabaseServer.from("duco_production").select("product_pcs_qty, product_damage_pcs"),
      supabaseServer.from("duco_sales").select("product_pcs_qty"),
    ]);

    if (purchases.error) throw new Error(purchases.error.message);
    if (production.error) throw new Error(production.error.message);
    if (sales.error) throw new Error(sales.error.message);

    const total_purchased_pcs = sumRows(purchases.data, "product_pcs_qty");
    const total_produced_pcs = sumRows(production.data, "product_pcs_qty");
    const total_damage_pcs = sumRows(production.data, "product_damage_pcs");
    const total_sold_pcs = sumRows(sales.data, "product_pcs_qty");

    const net_stock_pcs = total_purchased_pcs + total_produced_pcs - total_sold_pcs - total_damage_pcs;

    return NextResponse.json({
      total_purchased_pcs,
      total_produced_pcs,
      total_sold_pcs,
      total_damage_pcs,
      net_stock_pcs,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

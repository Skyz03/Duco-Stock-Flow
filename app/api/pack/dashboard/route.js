import { NextResponse } from "next/server";
import { sumRows } from "../../../../lib/sumColumn";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  try {
    const [purchaseRes, salesRes, damageRes] = await Promise.all([
      supabaseServer.from("pack_purchase").select("product_purchase_per_box"),
      supabaseServer.from("pack_sales").select("product_sales_per_box"),
      supabaseServer.from("pack_damage").select("product_damage_per_box"),
    ]);

    if (purchaseRes.error) throw new Error(purchaseRes.error.message);
    if (salesRes.error) throw new Error(salesRes.error.message);
    if (damageRes.error) throw new Error(damageRes.error.message);

    const total_purchased_boxes = sumRows(purchaseRes.data, "product_purchase_per_box");
    const total_sold_boxes = sumRows(salesRes.data, "product_sales_per_box");
    const total_damage_boxes = sumRows(damageRes.data, "product_damage_per_box");
    const net_stock_boxes = total_purchased_boxes - total_sold_boxes - total_damage_boxes;

    return NextResponse.json({
      total_purchased_boxes,
      total_sold_boxes,
      total_damage_boxes,
      net_stock_boxes,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

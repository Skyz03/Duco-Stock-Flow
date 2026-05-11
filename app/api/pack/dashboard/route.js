import { NextResponse } from "next/server";
import { sumRows } from "../../../../lib/sumColumn";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("pack_inventory")
      .select("product_purchase_per_box, product_sales_per_box, product_damage_per_box");

    if (error) throw new Error(error.message);

    const total_purchased_boxes = sumRows(data, "product_purchase_per_box");
    const total_sold_boxes = sumRows(data, "product_sales_per_box");
    const total_damage_boxes = sumRows(data, "product_damage_per_box");
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

import { NextResponse } from "next/server";
import { z } from "zod";
import { loadPackStockRows } from "../../../../../lib/packStockAggregate";
import { supabaseServer } from "../../../../../lib/supabaseServer";

const checkTypeSchema = z.enum(["sales", "production"]);

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const product_code = (url.searchParams.get("product_code") || "").trim();
    const qty = Number(url.searchParams.get("qty") || 0);
    // purchase_qty accounts for boxes being added in the same row as sales
    const purchase_qty = Math.max(0, Number(url.searchParams.get("purchase_qty") || 0));
    const typeParam = url.searchParams.get("type") || "sales";
    const typeParsed = checkTypeSchema.safeParse(typeParam);

    if (!product_code) {
      return NextResponse.json({ error: "product_code is required" }, { status: 400 });
    }
    if (!typeParsed.success) {
      return NextResponse.json({ error: "type must be one of: sales, production" }, { status: 400 });
    }
    const type = typeParsed.data;

    const { error, rows } = await loadPackStockRows(supabaseServer);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const row = rows.find((r) => r.product_code === product_code);
    const current_stock = row ? row.net_stock_boxes : 0;

    // For sales: net effect of this row is purchase_qty added minus sales qty.
    // A warning fires only if the row as a whole would push stock negative.
    let proposed_stock = current_stock;
    if (type === "sales") {
      proposed_stock = current_stock + purchase_qty - qty;
    }

    const is_warning = proposed_stock < 0;

    return NextResponse.json({
      current_stock,
      proposed_stock,
      is_warning,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

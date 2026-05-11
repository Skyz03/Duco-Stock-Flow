import { NextResponse } from "next/server";
import { loadDucoStockRows } from "../../../../../lib/ducoStockAggregate";
import { supabaseServer } from "../../../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const product_code = (url.searchParams.get("product_code") || "").trim();
    const qty = Number(url.searchParams.get("qty") || 0);
    const type = url.searchParams.get("type") || "sales";

    if (!product_code) {
      return NextResponse.json({ error: "product_code is required" }, { status: 400 });
    }

    const { error, rows } = await loadDucoStockRows(supabaseServer);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    const row = rows.find((r) => r.product_code === product_code);
    const current_stock = row ? row.net_stock_pcs : 0;

    let proposed_stock = current_stock;
    if (type === "sales") {
      proposed_stock = current_stock - qty;
    } else if (type === "production") {
      proposed_stock = current_stock;
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

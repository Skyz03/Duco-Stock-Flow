import { NextResponse } from "next/server";
import { loadDucoStockRows } from "../../../../../lib/ducoStockAggregate";
import { supabaseServer } from "../../../../../lib/supabaseServer";

export async function GET() {
  try {
    const { error, rows } = await loadDucoStockRows(supabaseServer);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    const sorted = [...rows].sort((a, b) => a.net_stock_pcs - b.net_stock_pcs);
    return NextResponse.json(sorted);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

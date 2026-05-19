import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();

    const buildQuery = (table) => {
      let ql = supabaseServer.from(table).select("product_code, product_name, product_pic, created_at").order("created_at", {
        ascending: false,
      });
      if (q) {
        ql = ql.or(`product_code.ilike.%${q}%,product_name.ilike.%${q}%`);
      }
      return ql.limit(100);
    };

    const [purchaseRes, productionRes, salesRes] = await Promise.all([
      buildQuery("duco_purchase"),
      buildQuery("duco_production"),
      buildQuery("duco_sales"),
    ]);

    const err = purchaseRes.error || productionRes.error || salesRes.error;
    if (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    const rows = [...(purchaseRes.data ?? []), ...(productionRes.data ?? []), ...(salesRes.data ?? [])];
    const map = new Map();
    for (const row of rows) {
      if (!row.product_code) continue;
      if (!map.has(row.product_code)) {
        map.set(row.product_code, {
          product_code: row.product_code,
          product_name: row.product_name,
          product_pic: row.product_pic,
        });
      }
    }

    const results = Array.from(map.values()).slice(0, 10);
    return NextResponse.json(results);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

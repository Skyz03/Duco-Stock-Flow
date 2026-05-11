import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();

    let query = supabaseServer
      .from("duco_purchase")
      .select("product_code, product_name, product_pic, created_at")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(`product_code.ilike.%${q}%,product_name.ilike.%${q}%`);
    }

    const { data, error } = await query.limit(100);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const map = new Map();
    for (const row of data ?? []) {
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

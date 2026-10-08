import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();

    let query = supabaseServer
      .from("pack_products")
      .select("product_code, product_name, product_pic, country_of_origin, pcs_per_box, created_at")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(`product_code.ilike.%${q}%,product_name.ilike.%${q}%`);
    }

    const { data, error } = await query.limit(10);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unexpected error" }, { status: 500 });
  }
}

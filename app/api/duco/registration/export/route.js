import { Parser } from "json2csv";
import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../../lib/supabaseServer";

const exportFields = ["id", "product_code", "product_name", "country_of_origin", "cup_qty_per_box", "created_at"];

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    let query = supabaseServer.from("duco_products").select("*").order("created_at", { ascending: false });
    if (search) query = query.or(`product_code.ilike.%${search}%,product_name.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const csv = new Parser({ fields: exportFields }).parse(data || []);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=duco_products.csv",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unexpected error" }, { status: 500 });
  }
}

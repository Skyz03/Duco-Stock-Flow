import { Parser } from "json2csv";
import { NextResponse } from "next/server";
import { entryExportQuery } from "../../../../../lib/entryExportQuery";
import { supabaseServer } from "../../../../../lib/supabaseServer";

const exportFields = [
  "id", "product_code", "product_name", "country_of_origin",
  "product_sales_per_box", "product_pcs_qty", "date", "created_at",
];

export async function GET(request) {
  try {
    const { data, error } = await entryExportQuery(supabaseServer, "pack_sales", request);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const csv = new Parser({ fields: exportFields }).parse(data || []);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=pack_sales.csv",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unexpected error" }, { status: 500 });
  }
}

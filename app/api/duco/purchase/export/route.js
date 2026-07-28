import { Parser } from "json2csv";
import { NextResponse } from "next/server";
import { entryExportQuery } from "../../../../../lib/entryExportQuery";
import { supabaseServer } from "../../../../../lib/supabaseServer";

const tableName = "duco_purchase";
const exportFields = ["id", "product_code", "product_name", "country_of_origin", "product_box_qty", "product_pcs_qty", "date", "created_at"];

export async function GET(request) {
  try {
    const query = entryExportQuery(supabaseServer, tableName, request);
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const parser = new Parser({ fields: exportFields });
    const csv = parser.parse(data || []);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=duco_purchase.csv",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

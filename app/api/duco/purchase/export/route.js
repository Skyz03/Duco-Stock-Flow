import { supabaseServer } from "../../../../../lib/supabaseServer";
import { Parser } from "json2csv";

const tableName = "duco_purchase";
const exportFields = ["id", "product_code", "product_name", "product_pic", "product_box_qty", "product_pcs_qty", "date", "created_at"];

export async function GET() {
  const { data, error } = await supabaseServer.from(tableName).select("*");
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const parser = new Parser({ fields: exportFields });
  const csv = parser.parse(data || []);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=duco_purchase.csv",
    },
  });
}

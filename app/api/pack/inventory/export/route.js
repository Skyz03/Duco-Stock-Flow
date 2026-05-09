import { supabaseServer } from "../../../../../lib/supabaseServer";
import { Parser } from "json2csv";

const tableName = "pack_inventory";
const exportFields = ["id", "product_code", "product_name", "product_pic", "product_purchase_per_box", "product_pcs_per_box", "product_sales_per_box", "product_damage_per_box", "date", "created_at"];

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
      "Content-Disposition": "attachment; filename=pack_inventory.csv",
    },
  });
}

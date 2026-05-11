/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} tableName
 * @param {Request} request
 */
export function entryExportQuery(supabase, tableName, request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  let query = supabase
    .from(tableName)
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`product_code.ilike.%${search}%,product_name.ilike.%${search}%`);
  }
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  return query;
}

import { NextResponse } from "next/server";
import { supabaseServer } from "../supabaseServer";

/**
 * Handles paginated GET for any entry table.
 * Supports search (product_code, product_name), date range (from/to), page, and limit.
 * @param {string} tableName
 * @param {Request} request
 */
export async function buildListResponse(tableName, request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 20)));
  const offset = (page - 1) * limit;

  let query = supabaseServer
    .from(tableName)
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`product_code.ilike.%${search}%,product_name.ilike.%${search}%`);
  }
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count ?? 0;
  return NextResponse.json({
    data: data ?? [],
    count: total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

/**
 * Handles DELETE by id for any entry table.
 * @param {string} tableName
 * @param {Request} request
 */
export async function handleDeleteById(tableName, request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Single round trip: delete and select the deleted row in one query.
  const { data, error } = await supabaseServer
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

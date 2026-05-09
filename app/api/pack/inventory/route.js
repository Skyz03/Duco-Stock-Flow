import { supabaseServer } from "../../../../lib/supabaseServer";

const tableName = "pack_inventory";

function defaultDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const page = Number(url.searchParams.get("page") || 1);
  const limit = Number(url.searchParams.get("limit") || 20);
  const offset = (page - 1) * limit;

  let query = supabaseServer.from(tableName).select("*", { count: "exact" }).order("date", { ascending: false }).range(offset, offset + limit - 1);
  if (search) {
    query = query.or(`product_code.ilike.%${search}%,product_name.ilike.%${search}%`);
  }
  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);

  const { data, count, error } = await query;
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify({ data: data ?? [], count: count ?? 0 }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const body = await request.json();
  const payload = {
    ...body,
    date: body.date || defaultDate(),
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseServer.from(tableName).insert([payload]).select().single();
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { headers: { "Content-Type": "application/json" } });
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const { data, error } = await supabaseServer.from(tableName).delete().eq("id", id).select().single();
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify({ data }), { headers: { "Content-Type": "application/json" } });
}

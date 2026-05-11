import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "../../../../lib/supabaseServer";

const tableName = "duco_sales";

function defaultDate() {
  return new Date().toISOString().slice(0, 10);
}

const postSchema = z.object({
  product_code: z.string().min(1),
  product_name: z.string().min(1),
  product_pic: z.union([z.string().url(), z.literal("")]).optional(),
  product_pcs_qty: z.coerce.number().int().positive(),
  date: z.string().min(1),
});

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limit = Math.max(1, Number(url.searchParams.get("limit") || 20));
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
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      data: data ?? [],
      count: total,
      page,
      totalPages,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
    }

    const { product_pic, ...rest } = parsed.data;
    const payload = {
      ...rest,
      date: parsed.data.date || defaultDate(),
      product_pic: product_pic && product_pic !== "" ? product_pic : null,
    };

    const { data, error } = await supabaseServer.from(tableName).insert([payload]).select().single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { data: existing, error: findErr } = await supabaseServer.from(tableName).select("id").eq("id", id).maybeSingle();
    if (findErr) {
      return NextResponse.json({ error: findErr.message }, { status: 500 });
    }
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { error } = await supabaseServer.from(tableName).delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

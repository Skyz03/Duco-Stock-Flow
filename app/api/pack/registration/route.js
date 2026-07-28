import { NextResponse } from "next/server";
import { z } from "zod";
import { handleDeleteById } from "../../../../lib/api/entryRouteHelpers";
import { supabaseServer } from "../../../../lib/supabaseServer";

const tableName = "pack_products";

const postSchema = z.object({
  product_code: z.string().min(1),
  product_name: z.string().min(1),
  product_pic: z.union([z.string().url(), z.literal("")]).optional(),
  country_of_origin: z.string().min(1),
});

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 20)));
    const offset = (page - 1) * limit;

    let query = supabaseServer
      .from(tableName)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`product_code.ilike.%${search}%,product_name.ilike.%${search}%`);
    }

    const { data, count, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const total = count ?? 0;
    return NextResponse.json({
      data: data ?? [],
      count: total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unexpected error" }, { status: 500 });
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
    const payload = { ...rest, product_pic: product_pic && product_pic !== "" ? product_pic : null };

    const { data, error } = await supabaseServer.from(tableName).insert([payload]).select().single();
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: `Product code "${parsed.data.product_code}" is already registered.` },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    return await handleDeleteById(tableName, request);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unexpected error" }, { status: 500 });
  }
}

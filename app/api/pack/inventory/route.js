import { NextResponse } from "next/server";
import { z } from "zod";
import { buildListResponse, handleDeleteById } from "../../../../lib/api/entryRouteHelpers";
import { supabaseServer } from "../../../../lib/supabaseServer";

const tableName = "pack_inventory";

const postSchema = z.object({
  product_code: z.string().min(1),
  product_name: z.string().min(1),
  product_pic: z.union([z.string().url(), z.literal("")]).optional(),
  product_purchase_per_box: z.coerce.number().int().nonnegative(),
  product_pcs_per_box: z.coerce.number().int().nonnegative(),
  product_sales_per_box: z.coerce.number().int().nonnegative(),
  product_damage_per_box: z.coerce.number().int().nonnegative().optional().default(0),
  date: z.string().min(1),
});

export async function GET(request) {
  try {
    return await buildListResponse(tableName, request);
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
    return await handleDeleteById(tableName, request);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

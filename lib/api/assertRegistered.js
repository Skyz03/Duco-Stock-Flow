import { NextResponse } from "next/server";

/**
 * Checks that product_code exists in the given registration table.
 * Returns a NextResponse error if not found, or null if OK.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {"duco_products"|"pack_products"} table
 * @param {string} productCode
 * @returns {Promise<NextResponse|null>}
 */
export async function assertRegistered(supabase, table, productCode) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("product_code", productCode)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: `Product "${productCode}" is not registered. Register it under Products first.` },
      { status: 400 }
    );
  }
  return null;
}

/**
 * Looks up cup_qty_per_box for a duco product. Returns 1 if not found (safe fallback).
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} productCode
 * @returns {Promise<number>}
 */
export async function getDucoCupQtyPerBox(supabase, productCode) {
  const { data } = await supabase
    .from("duco_products")
    .select("cup_qty_per_box")
    .eq("product_code", productCode)
    .maybeSingle();
  return data?.cup_qty_per_box ?? 1;
}

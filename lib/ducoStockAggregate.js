/**
 * Pure aggregation for Duco net stock (pcs) per product_code.
 * Formula: purchase + production - sales - damage_pcs
 */
export function aggregateDucoStockFromRows(purchases, production, sales) {
  const stockMap = new Map();

  for (const r of purchases ?? []) {
    const code = r.product_code;
    if (!code) continue;
    const entry =
      stockMap.get(code) ||
      {
        product_code: code,
        product_name: r.product_name ?? "",
        product_pic: r.product_pic ?? null,
        total_purchased_pcs: 0,
        total_produced_pcs: 0,
        total_sold_pcs: 0,
        total_damage_pcs: 0,
      };
    entry.total_purchased_pcs += Number(r.product_pcs_qty || 0);
    if (r.product_name) entry.product_name = r.product_name;
    if (r.product_pic) entry.product_pic = r.product_pic;
    stockMap.set(code, entry);
  }

  for (const r of production ?? []) {
    const code = r.product_code;
    if (!code) continue;
    const entry =
      stockMap.get(code) ||
      {
        product_code: code,
        product_name: r.product_name ?? "",
        product_pic: r.product_pic ?? null,
        total_purchased_pcs: 0,
        total_produced_pcs: 0,
        total_sold_pcs: 0,
        total_damage_pcs: 0,
      };
    entry.total_produced_pcs += Number(r.product_pcs_qty || 0);
    entry.total_damage_pcs += Number(r.product_damage_pcs || 0);
    if (r.product_name) entry.product_name = r.product_name;
    if (r.product_pic) entry.product_pic = r.product_pic;
    stockMap.set(code, entry);
  }

  for (const r of sales ?? []) {
    const code = r.product_code;
    if (!code) continue;
    const entry =
      stockMap.get(code) ||
      {
        product_code: code,
        product_name: "",
        product_pic: null,
        total_purchased_pcs: 0,
        total_produced_pcs: 0,
        total_sold_pcs: 0,
        total_damage_pcs: 0,
      };
    entry.total_sold_pcs += Number(r.product_pcs_qty || 0);
    stockMap.set(code, entry);
  }

  const rows = Array.from(stockMap.values()).map((entry) => {
    const net_stock_pcs =
      entry.total_purchased_pcs + entry.total_produced_pcs - entry.total_sold_pcs - entry.total_damage_pcs;
    return {
      product_code: entry.product_code,
      product_name: entry.product_name,
      product_pic: entry.product_pic,
      total_purchased_pcs: entry.total_purchased_pcs,
      total_produced_pcs: entry.total_produced_pcs,
      total_sold_pcs: entry.total_sold_pcs,
      total_damage_pcs: entry.total_damage_pcs,
      net_stock_pcs,
      is_low_stock: net_stock_pcs <= 0,
    };
  });

  rows.sort((a, b) => a.product_code.localeCompare(b.product_code));
  return rows;
}

export async function loadDucoStockRows(supabase) {
  const [purchases, production, sales] = await Promise.all([
    supabase
      .from("duco_purchase")
      .select("product_code, product_name, product_pic, product_pcs_qty"),
    supabase
      .from("duco_production")
      .select("product_code, product_name, product_pic, product_pcs_qty, product_damage_pcs"),
    supabase.from("duco_sales").select("product_code, product_pcs_qty"),
  ]);

  const err = purchases.error || production.error || sales.error;
  if (err) {
    return { error: err.message, rows: [] };
  }

  return {
    error: null,
    rows: aggregateDucoStockFromRows(purchases.data, production.data, sales.data),
  };
}

export function getDucoNetForCode(rows, productCode) {
  const row = rows.find((r) => r.product_code === productCode);
  return row ? row.net_stock_pcs : 0;
}

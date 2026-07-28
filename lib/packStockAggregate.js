export function aggregatePackStockFromRows(purchases, sales, damage) {
  const map = new Map();

  const addEntry = (map, code, name, pic) => {
    if (!map.has(code)) {
      map.set(code, {
        product_code: code,
        product_name: name ?? "",
        product_pic: pic ?? null,
        total_purchased_boxes: 0,
        total_sold_boxes: 0,
        total_damage_boxes: 0,
      });
    }
    return map.get(code);
  };

  for (const r of purchases ?? []) {
    if (!r.product_code) continue;
    const entry = addEntry(map, r.product_code, r.product_name, r.product_pic);
    entry.total_purchased_boxes += Number(r.product_purchase_per_box || 0);
    if (r.product_name) entry.product_name = r.product_name;
    if (r.product_pic) entry.product_pic = r.product_pic;
  }

  for (const r of sales ?? []) {
    if (!r.product_code) continue;
    const entry = addEntry(map, r.product_code, r.product_name, r.product_pic);
    entry.total_sold_boxes += Number(r.product_sales_per_box || 0);
    if (r.product_name) entry.product_name = r.product_name;
    if (r.product_pic) entry.product_pic = r.product_pic;
  }

  for (const r of damage ?? []) {
    if (!r.product_code) continue;
    const entry = addEntry(map, r.product_code, r.product_name, r.product_pic);
    entry.total_damage_boxes += Number(r.product_damage_per_box || 0);
    if (r.product_name) entry.product_name = r.product_name;
    if (r.product_pic) entry.product_pic = r.product_pic;
  }

  const rows = Array.from(map.values()).map((entry) => {
    const net_stock_boxes = entry.total_purchased_boxes - entry.total_sold_boxes - entry.total_damage_boxes;
    return {
      product_code: entry.product_code,
      product_name: entry.product_name,
      product_pic: entry.product_pic,
      total_purchased_boxes: entry.total_purchased_boxes,
      total_sold_boxes: entry.total_sold_boxes,
      total_damage_boxes: entry.total_damage_boxes,
      net_stock_boxes,
      is_low_stock: net_stock_boxes <= 0,
    };
  });

  rows.sort((a, b) => a.product_code.localeCompare(b.product_code));
  return rows;
}

export async function loadPackStockRows(supabase) {
  const [purchases, sales, damage] = await Promise.all([
    supabase.from("pack_purchase").select("product_code, product_name, product_pic, product_purchase_per_box"),
    supabase.from("pack_sales").select("product_code, product_name, product_pic, product_sales_per_box"),
    supabase.from("pack_damage").select("product_code, product_name, product_pic, product_damage_per_box"),
  ]);

  const err = purchases.error || sales.error || damage.error;
  if (err) {
    return { error: err.message, rows: [] };
  }

  return { error: null, rows: aggregatePackStockFromRows(purchases.data, sales.data, damage.data) };
}

export function getPackNetForCode(rows, productCode) {
  const row = rows.find((r) => r.product_code === productCode);
  return row ? row.net_stock_boxes : 0;
}

export function aggregatePackStockFromRows(inventoryRows) {
  const map = new Map();

  for (const r of inventoryRows ?? []) {
    const code = r.product_code;
    if (!code) continue;
    const entry =
      map.get(code) ||
      {
        product_code: code,
        product_name: r.product_name ?? "",
        product_pic: r.product_pic ?? null,
        total_purchased_boxes: 0,
        total_sold_boxes: 0,
        total_damage_boxes: 0,
      };
    entry.total_purchased_boxes += Number(r.product_purchase_per_box || 0);
    entry.total_sold_boxes += Number(r.product_sales_per_box || 0);
    entry.total_damage_boxes += Number(r.product_damage_per_box || 0);
    if (r.product_name) entry.product_name = r.product_name;
    if (r.product_pic) entry.product_pic = r.product_pic;
    map.set(code, entry);
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
  const { data, error } = await supabase
    .from("pack_inventory")
    .select(
      "product_code, product_name, product_pic, product_purchase_per_box, product_sales_per_box, product_damage_per_box"
    );

  if (error) {
    return { error: error.message, rows: [] };
  }

  return { error: null, rows: aggregatePackStockFromRows(data) };
}

export function getPackNetForCode(rows, productCode) {
  const row = rows.find((r) => r.product_code === productCode);
  return row ? row.net_stock_boxes : 0;
}

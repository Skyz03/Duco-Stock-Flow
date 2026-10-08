-- ============================================================
-- Pack pcs_per_box — run in Supabase SQL Editor
-- ============================================================

-- 1. Add pcs_per_box to the product registration table
ALTER TABLE pack_products
  ADD COLUMN IF NOT EXISTS pcs_per_box integer NOT NULL DEFAULT 1
  CHECK (pcs_per_box > 0);

-- 2. Add computed pcs total to each transaction table
ALTER TABLE pack_purchase
  ADD COLUMN IF NOT EXISTS product_pcs_qty integer NOT NULL DEFAULT 0;

ALTER TABLE pack_sales
  ADD COLUMN IF NOT EXISTS product_pcs_qty integer NOT NULL DEFAULT 0;

ALTER TABLE pack_damage
  ADD COLUMN IF NOT EXISTS product_pcs_qty integer NOT NULL DEFAULT 0;

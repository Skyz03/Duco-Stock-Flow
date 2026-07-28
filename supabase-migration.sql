-- ============================================================
-- Stock Flow Data Model Migration
-- Run in Supabase SQL Editor (dashboard.supabase.com)
-- ============================================================

-- ── 1. DUCO PRODUCT REGISTRATION ────────────────────────────
CREATE TABLE IF NOT EXISTS duco_products (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code      text NOT NULL,
  product_name      text NOT NULL,
  product_pic       text,
  country_of_origin text NOT NULL,
  cup_qty_per_box   integer NOT NULL CHECK (cup_qty_per_box > 0),
  created_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT duco_products_code_unique UNIQUE (product_code)
);

-- ── 2. PACK PRODUCT REGISTRATION ────────────────────────────
CREATE TABLE IF NOT EXISTS pack_products (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code      text NOT NULL,
  product_name      text NOT NULL,
  product_pic       text,
  country_of_origin text NOT NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pack_products_code_unique UNIQUE (product_code)
);

-- ── 3. ADD COLUMNS TO EXISTING DUCO TABLES ──────────────────

-- duco_purchase: add country_of_origin
ALTER TABLE duco_purchase
  ADD COLUMN IF NOT EXISTS country_of_origin text NOT NULL DEFAULT '';

-- duco_production: add country_of_origin + product_box_used (cartons used)
ALTER TABLE duco_production
  ADD COLUMN IF NOT EXISTS country_of_origin  text    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS product_box_used   integer NOT NULL DEFAULT 0;

-- duco_sales: add country_of_origin + product_box_qty (boxes sold)
-- product_pcs_qty stays — it is now server-derived from boxes × cup_qty_per_box
ALTER TABLE duco_sales
  ADD COLUMN IF NOT EXISTS country_of_origin text    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS product_box_qty   integer NOT NULL DEFAULT 0;

-- ── 4. NEW PACKMANDU TRANSACTION TABLES ─────────────────────

CREATE TABLE IF NOT EXISTS pack_purchase (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code           text    NOT NULL,
  product_name           text    NOT NULL,
  product_pic            text,
  country_of_origin      text    NOT NULL,
  product_purchase_per_box integer NOT NULL CHECK (product_purchase_per_box >= 0),
  product_pcs_per_box    integer NOT NULL CHECK (product_pcs_per_box >= 0),
  date                   date    NOT NULL,
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pack_sales (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code         text    NOT NULL,
  product_name         text    NOT NULL,
  product_pic          text,
  country_of_origin    text    NOT NULL,
  product_sales_per_box integer NOT NULL CHECK (product_sales_per_box >= 0),
  date                 date    NOT NULL,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pack_damage (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code           text    NOT NULL,
  product_name           text    NOT NULL,
  product_pic            text,
  country_of_origin      text    NOT NULL,
  product_damage_per_box integer NOT NULL CHECK (product_damage_per_box >= 0),
  date                   date    NOT NULL,
  created_at             timestamptz NOT NULL DEFAULT now()
);

-- ── 5. OPTIONAL: migrate existing pack_inventory data ────────
-- Run this only if you want to keep historical pack_inventory rows.
-- Uncomment and execute AFTER the tables above are created.

-- INSERT INTO pack_purchase (product_code, product_name, product_pic, country_of_origin,
--   product_purchase_per_box, product_pcs_per_box, date, created_at)
-- SELECT product_code, product_name, product_pic, '',
--   product_purchase_per_box, product_pcs_per_box, date, created_at
-- FROM pack_inventory;

-- INSERT INTO pack_sales (product_code, product_name, product_pic, country_of_origin,
--   product_sales_per_box, date, created_at)
-- SELECT product_code, product_name, product_pic, '',
--   product_sales_per_box, date, created_at
-- FROM pack_inventory WHERE product_sales_per_box > 0;

-- INSERT INTO pack_damage (product_code, product_name, product_pic, country_of_origin,
--   product_damage_per_box, date, created_at)
-- SELECT product_code, product_name, product_pic, '',
--   product_damage_per_box, date, created_at
-- FROM pack_inventory WHERE product_damage_per_box > 0;

-- ── 6. DROP old pack_inventory (AFTER migration confirmed) ───
-- DROP TABLE IF EXISTS pack_inventory;

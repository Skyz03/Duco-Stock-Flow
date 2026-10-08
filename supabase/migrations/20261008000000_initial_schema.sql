-- =====================
-- DUCO CUPS
-- =====================

create table if not exists duco_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text unique not null,
  product_name text not null,
  product_pic text,
  country_of_origin text not null,
  cup_qty_per_box integer not null
);

create table if not exists duco_purchase (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text not null,
  product_name text not null,
  product_pic text,
  country_of_origin text not null,
  product_box_qty integer not null,
  product_pcs_qty integer not null,
  date text not null
);

create table if not exists duco_production (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text not null,
  product_name text not null,
  product_pic text,
  country_of_origin text not null,
  product_box_used integer not null default 0,
  product_pcs_qty integer not null,
  product_damage_pcs integer not null default 0,
  date text not null
);

create table if not exists duco_sales (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text not null,
  product_name text not null,
  product_pic text,
  country_of_origin text not null,
  product_pcs_qty integer not null,
  date text not null
);

-- =====================
-- PACKMANDU
-- =====================

create table if not exists pack_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text unique not null,
  product_name text not null,
  product_pic text,
  country_of_origin text not null
);

create table if not exists pack_purchase (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text not null,
  product_name text not null,
  product_pic text,
  country_of_origin text not null,
  product_purchase_per_box integer not null,
  product_pcs_per_box integer not null,
  date text not null
);

create table if not exists pack_sales (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text not null,
  product_name text not null,
  product_pic text,
  country_of_origin text not null,
  product_sales_per_box integer not null,
  date text not null
);

create table if not exists pack_damage (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text not null,
  product_name text not null,
  product_pic text,
  country_of_origin text not null,
  product_damage_per_box integer not null,
  date text not null
);

create table if not exists pack_inventory (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_code text not null,
  product_name text not null,
  product_pic text,
  product_purchase_per_box integer not null,
  product_pcs_per_box integer not null,
  product_sales_per_box integer not null,
  product_damage_per_box integer not null default 0,
  date text not null
);

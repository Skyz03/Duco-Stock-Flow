-- ============================================================
-- Sample Data — Stock Flow App
-- Run AFTER supabase-migration.sql
-- ============================================================

-- ─────────────────────────────────────────────
-- DUCO CUPS
-- ─────────────────────────────────────────────

-- 1. Product Registration
INSERT INTO duco_products (product_code, product_name, country_of_origin, cup_qty_per_box) VALUES
  ('DC-001', 'Paper Cup 200ml',   'China',   50),
  ('DC-002', 'Paper Cup 350ml',   'Vietnam', 40),
  ('DC-003', 'Plastic Cup 150ml', 'China',   100);

-- 2. Purchase (cartons bought)
INSERT INTO duco_purchase (product_code, product_name, country_of_origin, product_box_qty, product_pcs_qty, date) VALUES
  ('DC-001', 'Paper Cup 200ml',   'China',   20, 1000, '2026-07-01'),
  ('DC-001', 'Paper Cup 200ml',   'China',   10,  500, '2026-07-10'),
  ('DC-002', 'Paper Cup 350ml',   'Vietnam', 15,  600, '2026-07-05'),
  ('DC-003', 'Plastic Cup 150ml', 'China',   25, 2500, '2026-07-08');

-- 3. Production (cartons used → cups produced, some damage)
INSERT INTO duco_production (product_code, product_name, country_of_origin, product_box_used, product_pcs_qty, product_damage_pcs, date) VALUES
  ('DC-001', 'Paper Cup 200ml',   'China',    8,  380, 20, '2026-07-03'),
  ('DC-001', 'Paper Cup 200ml',   'China',   12,  570, 30, '2026-07-12'),
  ('DC-002', 'Paper Cup 350ml',   'Vietnam', 10,  390, 10, '2026-07-07'),
  ('DC-003', 'Plastic Cup 150ml', 'China',   15, 1470, 30, '2026-07-10');

-- 4. Sales (boxes sold → pcs = boxes × cup_qty_per_box)
--    product_pcs_qty = product_box_qty × cup_qty_per_box (computed here manually for sample)
INSERT INTO duco_sales (product_code, product_name, country_of_origin, product_box_qty, product_pcs_qty, date) VALUES
  ('DC-001', 'Paper Cup 200ml',   'China',    4, 200, '2026-07-05'),
  ('DC-001', 'Paper Cup 200ml',   'China',    6, 300, '2026-07-15'),
  ('DC-002', 'Paper Cup 350ml',   'Vietnam',  5, 200, '2026-07-09'),
  ('DC-003', 'Plastic Cup 150ml', 'China',    8, 800, '2026-07-14');


-- ─────────────────────────────────────────────
-- PACKMANDU
-- ─────────────────────────────────────────────

-- 1. Product Registration
INSERT INTO pack_products (product_code, product_name, country_of_origin) VALUES
  ('PM-001', 'Bubble Wrap Roll (50m)',   'China'),
  ('PM-002', 'Corrugated Box Large',     'Nepal'),
  ('PM-003', 'Brown Tape Roll',          'India');

-- 2. Purchase (boxes bought)
INSERT INTO pack_purchase (product_code, product_name, country_of_origin, product_purchase_per_box, product_pcs_per_box, date) VALUES
  ('PM-001', 'Bubble Wrap Roll (50m)', 'China',  30, 1, '2026-07-02'),
  ('PM-001', 'Bubble Wrap Roll (50m)', 'China',  20, 1, '2026-07-18'),
  ('PM-002', 'Corrugated Box Large',   'Nepal',  50, 1, '2026-07-04'),
  ('PM-003', 'Brown Tape Roll',        'India',  60, 6, '2026-07-06');

-- 3. Sales (boxes sold)
INSERT INTO pack_sales (product_code, product_name, country_of_origin, product_sales_per_box, date) VALUES
  ('PM-001', 'Bubble Wrap Roll (50m)', 'China',  10, '2026-07-05'),
  ('PM-001', 'Bubble Wrap Roll (50m)', 'China',  15, '2026-07-20'),
  ('PM-002', 'Corrugated Box Large',   'Nepal',  20, '2026-07-08'),
  ('PM-003', 'Brown Tape Roll',        'India',  25, '2026-07-10');

-- 4. Damage (boxes damaged)
INSERT INTO pack_damage (product_code, product_name, country_of_origin, product_damage_per_box, date) VALUES
  ('PM-001', 'Bubble Wrap Roll (50m)', 'China',  2, '2026-07-07'),
  ('PM-002', 'Corrugated Box Large',   'Nepal',  3, '2026-07-09'),
  ('PM-003', 'Brown Tape Roll',        'India',  1, '2026-07-12');


-- ─────────────────────────────────────────────
-- EXPECTED STOCK AFTER SAMPLE DATA
-- ─────────────────────────────────────────────
--
-- DUCO CUPS (net_stock_pcs = purchased_pcs + produced_pcs - sold_pcs - damage_pcs)
-- DC-001: (1000+500) + (380+570) - (200+300) - (20+30) = 1500 + 950 - 500 - 50 = 1900 pcs
-- DC-002: 600         + 390      - 200       - 10       = 780 pcs
-- DC-003: 2500        + 1470     - 800       - 30       = 3140 pcs
--
-- DUCO CARTONS (net_carton_stock = carton_purchased - carton_used)
-- DC-001: (20+10) - (8+12) = 30 - 20 = 10 cartons left
-- DC-002: 15      - 10     = 5  cartons left
-- DC-003: 25      - 15     = 10 cartons left
--
-- PACKMANDU (net_stock_boxes = purchased - sold - damage)
-- PM-001: (30+20) - (10+15) - 2 = 50 - 25 - 2 = 23 boxes
-- PM-002: 50      - 20      - 3 = 27 boxes
-- PM-003: 60      - 25      - 1 = 34 boxes

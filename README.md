# Duco Stock Flow

Inventory and stock management system for two companies — **Duco Cups** and **Packmandu** — built with Next.js, Supabase, and Tailwind CSS.

---

## Features

- **Dashboard** — summary stat cards (purchased, produced, sold, damage, net stock) with click-to-filter by individual product
- **Purchase, Production & Sales entries** — paginated tables with search, date range filter, and CSV export
- **Live stock warnings** — alerts before submitting a sale or production entry that would cause negative stock
- **Product autocomplete** — type a product code to auto-fill the product name
- **Image uploads** — product images stored via Cloudinary
- **Two-company support** — Duco Cups (`/duco`) and Packmandu (`/pack`) with separate data and branding

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Images | Cloudinary |
| Forms | react-hook-form + Zod v4 |
| Icons | lucide-react |
| Toasts | sonner |
| CSV export | json2csv |

---

## Project Structure

```
app/
  duco/           # Duco Cups pages (dashboard, purchase, production, sales, stock)
  pack/           # Packmandu pages (dashboard, purchase, sales, damage, stock)
  api/
    duco/         # Duco API routes
    pack/         # Pack API routes
    upload/       # Cloudinary image upload route
components/
  shared/         # Reusable components (EntriesWorkbench, EntryForm, DataTable, etc.)
  DucoDashboardClient.js
  PackDashboardClient.js
hooks/            # Data-fetching hooks (useDashboard, useBreakdown, useStock, useEntries)
lib/
  ducoStockAggregate.js   # Per-product stock calculation for Duco
  packStockAggregate.js   # Per-product stock calculation for Pack
  supabaseClient.js       # Browser Supabase client
  supabaseServer.js       # Server-only Supabase client (service role)
```

---

## Two-Company Structure

| | Duco Cups | Packmandu |
|---|---|---|
| Route prefix | `/duco` | `/pack` |
| Brand color | `#1D9E75` | `#185FA5` |
| Tables | `duco_purchase`, `duco_production`, `duco_sales` | `pack_inventory` |
| Net stock formula (dashboard) | `purchased − produced − damage` | `purchased − sold − damage` |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a file named `env` (no dot prefix) in the project root:

```env
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=stock-flow
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server (after build)
npm run lint     # ESLint check
```

---

## Stock Calculation

Stock is computed at read time — there is no stored stock value.

**Duco Cups** (per product):
```
net_stock_pcs = total_purchased_pcs + total_produced_pcs − total_sold_pcs − total_damage_pcs
```

**Duco Dashboard total stat card:**
```
net_stock_pcs = total_purchased_pcs − total_produced_pcs − total_damage_pcs
```

**Packmandu** (per product and dashboard):
```
net_stock_boxes = total_purchased_boxes − total_sold_boxes − total_damage_boxes
```

A product is flagged as low stock (`is_low_stock: true`) when its net stock is ≤ 0.

---

## Deployment

Deploy to [Vercel](https://vercel.com) by connecting the repository. Add all environment variables from the `env` file into Vercel's project settings.

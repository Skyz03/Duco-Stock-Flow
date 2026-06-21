# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Start production server (after build)
```

There are no tests in this project.

## Environment Variables

The app reads from a root file named `env` (no dot prefix) in addition to standard `.env*` files — this is handled in `next.config.mjs`. Required variables:

| Variable | Used by |
|---|---|
| `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` | Both clients (aliased in `next.config.mjs`) |
| `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser client (aliased in `next.config.mjs`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only API routes |
| `CLOUDINARY_CLOUD_NAME` | Image upload route |
| `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` | Signed Cloudinary uploads |
| `CLOUDINARY_UPLOAD_PRESET` | Unsigned Cloudinary uploads (alternative to key+secret) |
| `CLOUDINARY_FOLDER` | Cloudinary folder (defaults to `"stock-flow"`) |

## Architecture

### Two-company structure

The app manages inventory for two separate companies, each with its own URL namespace, brand color, and Supabase tables:

| Company | Route prefix | Brand color | Tables |
|---|---|---|---|
| Duco Cups | `/duco` | `#1D9E75` | `duco_purchase`, `duco_production`, `duco_sales` |
| Packmandu | `/pack` | `#185FA5` | `pack_inventory` |

Each company has a `layout.js` that wraps its pages in `AppShell` with that company's nav items and brand color. `AppShell` renders a responsive sidebar (`components/shared/Sidebar.js`) that accepts `navItems[]` and `brandColor` as props.

### Supabase client split

- **Browser components** (`"use client"` files): import `supabase` from `lib/supabaseClient.js` → `lib/supabase/client.js`. Uses `createClientComponentClient` from `@supabase/auth-helpers-nextjs` (anon key).
- **API routes / server code**: import `supabaseServer` from `lib/supabaseServer.js` → `lib/supabase/server.js`. Uses the service-role key via `createClient` directly. Never expose this to the browser.

### `EntriesWorkbench` — the core CRUD pattern

Every data-entry page (purchase, production, sales, pack inventory) renders `components/shared/EntriesWorkbench.js`. It is configured entirely through props:

- `apiPath` — the API route prefix used for GET (list), POST (create), and DELETE (`?id=`) operations
- `exportPath` — GET endpoint that returns a CSV file
- `fields[]` — descriptor objects that drive both form rendering and Zod schema generation in `EntryForm`
- `columns[]` — descriptor objects that drive `DataTable` column rendering
- `stockCheck` — optional `{ apiPath, type, qtyField }` that wires live stock-warning checks into `EntryForm`
- `packWarning` — boolean flag that changes the warning unit label from "pcs" to "boxes"

To add a new entry type, create an API route and a page that renders `EntriesWorkbench` with the appropriate `fields` and `columns` arrays. No new component code is required.

#### Field descriptor types

`EntryForm` builds its Zod schema dynamically from the `fields[]` array. Supported `type` values:
- `"string"` — text input
- `"integer"` — number input, coerced with `z.preprocess`
- `"date"` — date input, defaults to today
- `"image_url"` — delegates to `ImageUpload` component, which POSTs to `/api/upload` and stores the returned Cloudinary URL

Setting `autocompletePath` on a `product_code` field enables `ProductCodeAutocomplete`, which fetches suggestions and auto-populates `product_name` and `product_pic` on selection.

### Stock calculation

**There is no stored stock value.** Stock is computed at read time by aggregating across all raw transaction rows:

- **Duco** (`lib/ducoStockAggregate.js`): `net_stock_pcs = purchased_pcs + produced_pcs - sold_pcs - damage_pcs`. Sources all three tables in parallel.
- **Pack** (`lib/packStockAggregate.js`): `net_stock_boxes = purchased_boxes - sold_boxes - damage_boxes`. Single `pack_inventory` table where each row contains all three fields per entry.

`is_low_stock: true` when `net_stock <= 0`. The `/stock/check` endpoints use the same aggregate functions to warn users before submitting a sale that would cause negative stock.

### Data-fetching hooks

All hooks in `hooks/` accept an `apiPath` string and are fully reusable across both companies:

- `useEntries(apiPath)` — paginated list with debounced search and date range filter (20 items/page)
- `useStock(apiPath)` — fetches the full aggregated stock array
- `useDashboard(apiPath)` — fetches summary stats object
- `useBreakdown(apiPath)` — fetches per-product breakdown rows

### API route conventions

API routes follow REST conventions on a single URL:
- `GET` — paginated list with `page`, `limit`, `search`, `from`, `to` query params
- `POST` — create (body validated with Zod via `postSchema`)
- `DELETE ?id=<uuid>` — delete by primary key

Export routes (`/export`) accept the same `search`, `from`, `to` params and return `text/csv` via `json2csv`. The shared `entryExportQuery(supabase, tableName, request)` helper in `lib/entryExportQuery.js` builds the filtered query for reuse across export routes.

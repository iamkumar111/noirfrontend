# NOIR & OAK — Medusa Fix and Safe Connection Report

## Outcome

The storefront no longer exposes raw Medusa catalog data. Medusa's default T-shirt, shorts, sweatpants, sweatshirt, Shirts, Pants, and Merch content is rejected before it can enter frontend state. The existing NOIR & OAK black-and-gold UI now renders the restored dry-fruit catalog while retaining the Store API connection for future branded products and real carts.

Work was performed on the requested safety branch:

```text
fix-medusa-noir-integration
```

The folders on this machine use different capitalization/spelling from the requested paths:

- Frontend: `/home/gaurav/Documents/NiorandOAKwebsite`
- Medusa monorepo: `/home/gaurav/Documents/noir`
- Medusa backend package: `/home/gaurav/Documents/noir/apps/backend`

## What was reverted or restored

- Removed raw Medusa titles, categories, and generic catalog copy from the UI data path.
- Restored the six original branded products with their luxury descriptions, batch codes, finish, texture, packaging, weight, sensory copy, storage, pairing, and local images.
- Restored the homepage lead product to The Curated Collection Box and its original side-product selection.
- Restored the gifting and member-dashboard product selections to their original branded IDs.
- Removed the integration-added product variant selector from the product page, returning the established product-detail composition.
- Restored the luxury unavailable message for a product outside the current release.
- Kept the Collection filters unchanged: All, Coated Almonds, Makhana Tins, Gift Boxes, Corporate, and Member Preview.
- Preserved the existing ProductCard, cart drawer, checkout, header, footer, typography, theme, welcome intro, route transitions, animation timing, and responsive class structure.

No theme, global styling, layout, header/footer, welcome intro, or transition code was reverted or redesigned because the audit showed that the catalog adapter—not those presentation systems—caused the visible regression.

## Restored fallback products

The safe local catalog is defined in `src/lib/noir-products/fallback-products.ts` and contains:

1. Dark Chocolate Coated Almonds (`DC-001`)
2. Milk Chocolate Coated Almonds (`MC-001`)
3. Parmesan Cheese Makhana (`PM-001`)
4. Himalayan Pink Salt Makhana (`HM-001`)
5. The Curated Collection Box (`GB-001`)
6. The Signature Almond Duo (`AD-001`)

Fallback products are explicitly preview-only and do not contain fake Medusa IDs or variant IDs.

## Safe integration files

- `src/lib/medusa/client.ts` — reusable Store SDK client configured only with public storefront environment variables.
- `src/lib/medusa/products.ts` — filtered catalog queries and fallback selection.
- `src/lib/medusa/mappers.ts` — strict Medusa-to-`NoirProduct` validation and mapping.
- `src/lib/medusa/cart.ts` — persisted Store API cart operations.
- `src/lib/medusa/regions.ts` — default region resolution.
- `src/lib/medusa/types.ts` — internal `NoirProduct`, cart, and checkout contracts.
- `src/lib/noir-products/fallback-products.ts` — complete branded fallback catalog.
- `src/store/useStore.ts` — holds only adapted `NoirProduct` objects, never raw Medusa product objects.
- `next.config.ts` — allows backend images and permits local-IP optimization only when the configured Medusa URL is localhost/127.0.0.1 (required by Next.js 16 development security defaults).

## Product acceptance rules

A Medusa product is allowed only when it is not a known seed product and at least one of these conditions is true:

- `metadata.brand === "NOIR & OAK"`
- `metadata.noirOak === true`
- its collection title contains `NOIR`
- its handle is in the explicit NOIR & OAK handle allow-list

Known Medusa seed handles and titles are also explicitly denied as a second safety layer.

If the filtered list is empty, the frontend returns the full fallback catalog and logs:

```text
No NOIR & OAK products found in Medusa. Using fallback product data.
```

The warning is developer-only and is not rendered in the public UI.

## Current backend catalog status

The active Medusa backend now contains all six storefront products as published, branded products with real variants:

- valid NOIR & OAK products in Medusa: **6**
- frontend catalog source while the backend is online: **Medusa Store API**
- fallback catalog available if the backend is offline: **yes**
- Medusa seed products visible in frontend: **no**

Each product has INR pricing, sales-channel availability, stock-managed inventory, backend-hosted imagery, category and Lot 1 collection relationships, and complete luxury metadata. The original Medusa seed records were left in the database for safety, but the strict storefront adapter continues to reject them.

## Cart integration status

Real Medusa cart operations remain implemented:

- `getOrCreateCart()`
- `retrieveCart()`
- `addToCart()` / `addLineItem()`
- `updateCartItem()` / `updateLineItem()`
- `removeCartItem()` / `removeLineItem()`
- local cart ID persistence under `noir_oak_medusa_cart_id`
- stale cart recovery
- automatic reset of any previously persisted cart containing non-NOIR seed items

The established cart drawer design is unchanged. A product reaches Store API cart creation only when the adapted product has a real Medusa `variantId`. A fallback-only product shows:

```text
This item is preview-only until it is added to the release inventory.
```

No fake line item is added and the UI does not crash.

## Checkout status

The luxury checkout UI remains connected to a real Medusa cart when one exists. It retains:

- `Pre-paid access only`
- `COD unavailable for Lot 1`
- real cart subtotal, tax, shipping, and total values
- non-crashing payment-provider fallback behavior

The six live catalog products now have valid Medusa variant IDs and can create real cart lines. Fallback catalog products still cannot create an artificial checkout cart if the backend becomes unavailable.

## Backend commerce setup

The idempotent backend setup is implemented in:

- `apps/backend/src/scripts/setup-noir-oak.ts`
- `apps/backend/static/noir-oak/` (six product images)

It provisions or reuses:

- India region (`IN`) with INR currency
- India tax region
- NOIR & OAK India warehouse
- stock-managed inventory for every product variant
- India fulfillment zone and complimentary delivery option
- Coated Almonds, Makhana Tins, and Gift Boxes categories
- `NOIR & OAK — Lot 1` collection
- all product metadata consumed by the frontend adapter

It is safe to rerun after a database reset or catalog update:

```bash
cd /home/gaurav/Documents/noir/apps/backend
npm run seed:noir-oak
```

Remaining external setup: replace the default system payment provider with the intended production payment gateway and production credentials before accepting live payments.

## Environment

Frontend `.env.local`:

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=in
```

The publishable key is read only from environment configuration. No Admin API key or Admin API call exists in browser code.

## QA completed

- `/`, `/collection`, `/product/dark-chocolate-coated-almonds`, `/product/t-shirt`, and `/checkout`: HTTP 200.
- `/collection`: all six expected NOIR & OAK products rendered.
- No Medusa T-Shirt, Shorts, Sweatpants, Sweatshirt, Shirts, Pants, or Merch text rendered.
- Valid branded detail page rendered its original finish/copy and had no integration-added variant selector.
- `/product/t-shirt` rendered `This collection is not available in the current release.` and did not render the seed title.
- Backend `/health`: HTTP 200.
- Store CORS accepts `http://localhost:3000`.
- Active publishable key exists and the Store API returns products.
- Store API returns all six accepted NOIR & OAK products with calculated INR prices from ₹549 to ₹2,499.
- All six backend image URLs return HTTP 200 and are consumed through Next Image without layout changes.
- Disposable cart QA passed: create, add line, retrieve, update quantity, set India shipping address, list complimentary shipping, and remove line.
- The backend setup script completed successfully twice without duplicating products.
- Medusa backend production build passed with no TypeScript or lint errors.
- Headless browser QA rendered all six branded cards from Medusa, no default merch, and no hydration/console errors.
- TypeScript check passed.
- ESLint passed.
- Next.js production build passed for all 19 routes.

## Run commands

Backend package directly:

```bash
cd /home/gaurav/Documents/noir/apps/backend
npm run seed:noir-oak # required once per fresh database
npm run dev
```

Or from the backend monorepo:

```bash
cd /home/gaurav/Documents/noir
npm run backend:dev
```

Frontend:

```bash
cd /home/gaurav/Documents/NiorandOAKwebsite
npm run dev
```

Open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:9000/health`
- Medusa Admin: `http://localhost:9000/app`

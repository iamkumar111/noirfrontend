# NOIR & OAK Medusa v2 Integration Report

> Superseded by `MEDUSA_FIX_AND_CONNECT_REPORT.md`, which documents the strict branded adapter and restored fallback catalog.

## Project paths

The paths on this machine differ slightly from the requested paths:

- Frontend: `/home/gaurav/Documents/NiorandOAKwebsite`
- Medusa monorepo: `/home/gaurav/Documents/noir`
- Medusa backend package: `/home/gaurav/Documents/noir/apps/backend`
- Store API: `http://localhost:9000`
- Medusa Admin: `http://localhost:9000/app`
- Next.js storefront: `http://localhost:3000`

## Files changed

- `package.json` and `package-lock.json`: added `@medusajs/js-sdk` and `@medusajs/types`.
- `.env.example`: documented the required public storefront variables.
- `.env.local`: configured the local backend, active publishable key, and `in` country code (ignored by Git).
- `.gitignore`: permits the safe `.env.example` template to be committed.
- `next.config.ts`: allows local Medusa and S3-hosted product images.
- `src/lib/medusa/client.ts`: reusable SSR-safe Store SDK client.
- `src/lib/medusa/products.ts`: product, collection, and category queries plus luxury product mapping.
- `src/lib/medusa/regions.ts`: default-country region resolution with safe fallback warnings.
- `src/lib/medusa/cart.ts`: cart creation, retrieval, line-item updates/removal, and cart ID persistence.
- `src/lib/medusa/customer.ts`: optional Medusa customer login, registration, retrieval, and logout helpers.
- `src/lib/medusa/checkout.ts`: cart contact/address updates, shipping selection, and payment-session preparation.
- `src/lib/medusa/types.ts`: shared storefront, cart, and checkout types.
- `src/store/useStore.ts`: replaced the mock cart/catalog state with Medusa-backed asynchronous state.
- `src/components/Providers.tsx`: initializes the catalog and persisted Medusa cart without changing transition/intro composition.
- `src/components/ProductCard.tsx`: uses mapped Medusa data and calculated prices.
- `src/components/CartDrawer.tsx`: uses live cart items/totals and Store API quantity/remove actions.
- `src/app/page.tsx`, `collection/page.tsx`, `product/[slug]/page.tsx`: use the Medusa catalog with luxury loading/error states and variant selection.
- `src/app/checkout/page.tsx`: uses live cart totals and prepares Medusa checkout state.
- `src/app/gifting/page.tsx`, `dashboard/page.tsx`, `wishlist/page.tsx`, `admin/page.tsx`: removed direct mock product imports while retaining their current designs and mock-only non-commerce behavior.
- `src/app/vip-access/page.tsx`: documented the future lead integration boundary.
- `src/data/mockData.ts`: removed; storefront commerce data now comes from Medusa.
- Backend `apps/backend/.env`: added the required localhost/127.0.0.1 Store, Admin, and Auth CORS origins.

## Required frontend environment variables

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=in
```

Use a Medusa publishable Store API key. Never put an Admin API secret in a `NEXT_PUBLIC_` variable.

## Integration status

### Products

Complete. Product lists, handles, IDs, collections, and categories use the Medusa Store API. Product metadata keys are mapped into the existing NOIR & OAK presentation shape with customer-safe fallback copy. Medusa thumbnails/images are used first and the existing luxury product asset is retained as the missing-image fallback. Calculated variant prices are formatted using the cart/product currency; unavailable prices show `Price revealed inside member preview`.

### Regions

Integrated with a safe fallback. `NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=in` is preferred. The current backend database contains one `Europe` region and no country `IN`, so the storefront currently warns in development and falls back to Europe rather than crashing. Create an India/IN region with INR pricing in Medusa Admin before production launch.

### Cart

Complete. Cart creation/retrieval, add, quantity update, removal, drawer totals, stale-cart recovery, refresh persistence, and reset are connected to Medusa. The cart ID is stored under `noir_oak_medusa_cart_id`; cart contents are not duplicated into the persisted Zustand session.

### Checkout

Integrated through the payment preparation boundary. The existing UI reads Medusa items/subtotal/tax/shipping/total, writes email and shipping address to the cart, selects the first available shipping option, and initializes the first configured payment provider. It retains the cart and shows luxury error/fallback copy when shipping or payment is not configured. COD remains unavailable and the existing pre-paid language is preserved.

### Customers and demo areas

Medusa customer helper functions are present, but the presentation demo login remains active so protected demo pages are unchanged. VIP and gifting forms remain local/mock with TODO boundaries. The frontend admin page remains mock-only and never calls the Admin API; real Medusa Admin is at `http://localhost:9000/app`.

## Known limitations

- The current Medusa database contains the default starter apparel catalog rather than NOIR & OAK dry-fruit products. Add or import the production catalog and the documented luxury metadata in Medusa Admin.
- The backend currently has only a Europe/EUR region. India/IN, INR prices, India tax settings, and India shipping options must be configured in Medusa Admin.
- The default system payment provider can prepare a payment session but is not a customer-facing production gateway. Configure Razorpay, Cashfree, Stripe, or another Medusa-compatible provider and add its redirect/confirmation step before accepting payment.
- Demo login, demo reservations/orders, VIP leads, gifting requests, and the frontend admin presentation remain intentionally mock-only.
- `npm audit` reports two moderate dependency advisories; no forced breaking dependency upgrade was applied as part of this integration.

## Verification completed

- Backend health: HTTP 200 at `/health`.
- Medusa Admin: HTTP 200 at `/app`.
- Publishable Store API key: active and accepted.
- Store products: four products returned by the current backend.
- Region: one region returned (Europe; India remains to be configured).
- CORS: both `http://localhost:3000` and `http://127.0.0.1:3000` are allowed after backend restart.
- SDK/API cart flow: create, add, retrieve, update quantity to 2, and remove all succeeded; live subtotal/total recalculated.
- Frontend routes `/`, `/collection`, `/product/t-shirt`, and `/checkout`: HTTP 200.
- Browser-rendered collection: Medusa product names, images, metadata fallbacks, and product handles rendered successfully.
- `npm run lint`: passed.
- `npm run build`: passed; all 19 App Router routes generated with no TypeScript/build errors.
- No hydration or runtime errors were recorded during the live collection render. The expected development warning concerns the missing India region.

## Run locally

Backend package directly:

```bash
cd /home/gaurav/Documents/noir/apps/backend
npm run dev
```

Or from the Medusa monorepo:

```bash
cd /home/gaurav/Documents/noir
npm run backend:dev
```

Frontend:

```bash
cd /home/gaurav/Documents/NiorandOAKwebsite
npm run dev
```

Then open `http://localhost:3000`. The backend must be running on port 9000 before catalog/cart requests can succeed.

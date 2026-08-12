# NOIR & OAK — Final Polish Report

Report date: 16 July 2026

## Pages and systems changed

- **Home:** Preserved the cinematic poster hero and rebuilt the supporting page as a shorter Lot 1 note, asymmetric collection preview, packaging-object feature, sensory craft ledger, and gifting service invitation.
- **Collection:** Clarified public Collection versus authenticated Vault, added all requested filters, retained horizontal mobile filtering, and replaced generic collection copy with actual batch and pack language.
- **Product detail:** Preserved member pricing, cart, wishlist, quantity and sticky mobile reserve behavior. Replaced fake blurred gallery thumbnails with product and packaging captions, made practical facts public, and added finish, texture, ingredient, storage, gifting, batch, pairing, reservation, and five-sense notes.
- **Gifting:** Replaced the repeated card-grid/manifesto formula with an intent ledger, packaging specification, request process, full concierge form, and accessible inline confirmation.
- **VIP Access:** Reframed the page as a practical member-preview request with clear benefits and retained temporary preview authentication.
- **Login:** Removed the decorative dot texture and panel hover aura, added persistent labels, distinguished login from access request, and demoted demo credentials.
- **The Vault:** Replaced KPI and quick-action bento grids with a membership card, featured Lot 1 product, batch preview ledger, reservation ledger, and grounded member assistance.
- **Cart:** Renamed the drawer Private Selection, added real product imagery and product facts, improved accessible controls, tightened mobile spacing, and clarified the Lot 1 payment rule.
- **Checkout:** Renamed the flow Reserve Lot 1, added visible delivery labels, UPI/Card/Razorpay/Cashfree choices, real product imagery, pre-paid/COD guidance, an empty-selection state, and clearer confirmation language.
- **Origin:** Replaced placeholder material squares and generic luxury copy with a product-led craft story and material record.
- **Contact:** Replaced the centered generic form card with a split concierge page, enquiry routing, visible labels, and inline success feedback.
- **Footer:** Consolidated repeated navigation, added Premium Dry Fruits as the descriptor, added a member release-note field, surfaced Contact/Privacy/Terms, and reduced height.
- **Desktop and mobile navigation:** Clarified Collection versus The Vault, simplified the mobile drawer to a restrained editorial index, reduced tracking and dividers, and retained account/cart behavior.
- **Shared system:** Extended product data, standardized cart payloads, strengthened muted text contrast, reduced point particles, kept reduced-motion support, and fixed persisted-session route guards.

## What was preserved

- Existing black, warm-black, graphite, charcoal, antique-gold, champagne-gold, and ivory color tokens.
- Cormorant Garamond and Inter typography families.
- Welcome intro concept, film assets, skip behavior, and session rule.
- Cinematic tree/logo atmosphere, smoke, slow shimmer, and gold glow language.
- Velvet route-passage concept and navigation direction.
- Current product categories, product imagery, private Vault concept, and Lot 1 positioning.
- Existing routes, Zustand/localStorage cart and login state, protected pages, wishlist, quantity controls, checkout clearing, and success route.

## Removed or reduced because it felt AI-generated

- Repeated centered eyebrow/headline/paragraph/card compositions.
- Duplicate “Not Sold. Reserved.” manifesto blocks.
- Generic gifting feature cards, dashboard statistic cards, and quick-action bento grids.
- Literal decorative dot texture on Login.
- Excess visible logo-aura and route-transition point particles while retaining the motion concept.
- Fake blurred product thumbnails and unsupported gallery views.
- Decorative product corner brackets, unnecessary hover lifts, and panel-wide hover glows.
- Vague phrases including “uncompromising material quality,” “definitive experience,” “designed to impress,” and “crafted for universal appeal.”
- Repeated substitutes for ordinary commerce language across cart and checkout.
- Footer slogan repetition and overlapping navigation columns.
- Dot and bullet separator glyphs; the final source scan found none of `·`, `•`, or `●`.

## Product-data improvements

Every product now exposes concrete values for:

- Batch code and batch number
- Finish and texture
- Pack and weight
- Storage and pairing
- Gifting use
- Availability and reserve status
- Ingredient note
- Sight, touch, aroma, sound, and taste

The Lot 1 mock collection now includes Dark Chocolate Coated Almonds, Milk Chocolate Coated Almonds, Parmesan Cheese Makhana, Himalayan Pink Salt Makhana, The Curated Collection Box, and The Signature Almond Duo.

## Responsive and browser QA

Automated real-browser layout checks were run at:

- 320px
- 360px
- 375px
- 390px
- 414px
- 430px
- 768px
- 1440px desktop

The main regression sweep covered Home, Collection, Product Detail, Gifting, VIP Access, Login, The Vault, and Checkout across the seven required mobile/tablet widths: 56 route/width checks. Origin and Contact received a further 16 checks across all listed widths including desktop.

Verified:

- No document-level horizontal overflow.
- No page title hidden beneath the fixed header.
- No protected-page redirect before persisted state hydration.
- No broken product images.
- Mobile filters remain a deliberate horizontal scroller without widening the page.
- Product image precedes details on mobile.
- Gifting image precedes specifications on mobile.
- Cart drawer and mobile menu are truly fixed, scrollable, and viewport-width safe.
- Checkout fields remain usable at narrow widths without iOS focus zoom.
- No runtime exceptions or console errors in the tested route sweep.
- ESLint passes without warnings.
- Next.js 16 production build succeeds for all 19 routes.

## Technical fixes

- Added an explicit persisted-store hydration state so Dashboard, Checkout, Orders, Wishlist, Profile, Success, and Admin do not redirect valid members before localStorage rehydrates.
- Removed React 19 effect patterns that triggered current ESLint errors in Providers, IntroGate, Header, WelcomeIntro, and Success.
- Fixed `.noise-bg` overriding Tailwind `fixed`; this restored correct fixed positioning for CartDrawer and MobileMenu while retaining grain.
- Kept `next/image` sizing on responsive product and packaging assets.
- Added accessible names to cart quantity, remove, close, menu, and reserve controls.
- Replaced alert-only gifting confirmation with an inline live status.

## Remaining issues

- Authentication, VIP approval, gifting/contact submission, order history, and payment processing remain mock frontend flows. Production APIs, secure server validation, email delivery, and live Razorpay/Cashfree integrations are still required for transactional launch.
- Parmesan Cheese Makhana currently uses the existing makhana product render as a visual stand-in. A dedicated PM-001 render should replace it before campaign photography is finalized.
- Product ingredients, weights, storage guidance, fulfilment timing, prices, legal terms, and claims should receive final operations/legal approval before accepting payment.
- Demo credentials should be hidden or removed in a production environment.

## Launch readiness

**Visual and frontend experience: ready for brand review and production content sign-off.**  
**Live commerce operations: not ready until the remaining authentication, form, inventory, payment, and fulfilment integrations are connected and verified.**

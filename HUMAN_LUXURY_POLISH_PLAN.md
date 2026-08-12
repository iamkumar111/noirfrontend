# NOIR & OAK — Human Luxury Polish Plan

This plan follows the audit and preserves all existing brand tokens, typography families, intro assets, route-transition concept, and core ecommerce state. Implementation will proceed page by page with lint/build checks after shared-system changes and responsive visual checks after the page pass.

## 1. Product data foundation

- Extend every mock product with explicit `batchCode`, `finish`, `texture`, `pack`, `weight`, `storage`, `pairing`, `giftingUse`, `availability`, `reserveStatus`, `ingredientNote`, and sensory notes.
- Retain compatibility with current cart, route, image, stock, and member-price behavior.
- Replace vague descriptions with concrete coatings, seasoning, pack, and serving language.
- Add the requested Parmesan Cheese Makhana as a real Lot 1 entry using the available makhana render until a dedicated render is supplied.

## 2. Shared commerce and navigation

- Rework ProductCard into a restrained product dossier: strong image/name, then a compact facts ledger and explicit member-price state.
- Update cart items to retain image, batch, pack, and weight while keeping persisted state backward-compatible.
- Polish CartDrawer with real thumbnails, accessible controls, tighter mobile padding, and “Private Selection / Continue to Reserve Lot 1” language.
- Clarify desktop and mobile navigation: Collection is product discovery; The Vault routes signed-in members to the dashboard and guests to login.
- Simplify the mobile menu into a left-aligned editorial index with one divider and compact account actions.
- Consolidate Footer navigation and add a compact email field for first-release notes.
- Preserve button forms, but reduce excessive tracking on mobile and strengthen practical text contrast globally.

## 3. Home

- Preserve the welcome intro, cinematic tree hero, hero scrim, and existing animation language.
- Tighten hero microcopy and CTA labels without adding effects.
- Replace the long three-row manifesto with a shorter editorial Lot 1 note.
- Change the collection preview from a uniform three-card row into an image-led featured product plus two quieter dossiers.
- Keep the packaging object section but simplify stamps/corners and add the full real packaging specification.
- Add “The Finish Is The Experience” as horizontal editorial sensory rows on desktop and stacked ruled rows on mobile.
- Add a concise Gifting Vault service preview and finish with one controlled member-preview invitation.

## 4. Collection

- Rename the public page heading to “The Collection” while retaining `/collection`.
- Add the complete filters: All, Coated Almonds, Makhana Tins, Gift Boxes, Corporate, Member Preview.
- Keep filters horizontally scrollable on mobile with no wrapping.
- Use a left-weighted introduction and an editorial lead product to break the default grid rhythm.
- Keep product route links and filtering state intact; reduce scale-heavy filter transitions.

## 5. Product detail

- Preserve the main render, member lock, wishlist, quantity, cart, and mobile sticky reserve behavior.
- Remove decorative fake thumbnails and use one main object frame with product/pack captions.
- Keep product information visible to all users; gate price and reservation action only.
- Add overview, finish, texture, ingredient note, packaging, storage, gifting use, batch, pairing, and reservation sections.
- Present See, Touch, Aroma, Sound, and Taste as an editorial sensory ledger, not five cards.
- Replace the star character with an accessible saved-selection text control.

## 6. Gifting

- Preserve the gifting vault render and packaging-led opening.
- Replace the four-card grid with a ruled intent index: Corporate Gifts, Festive Gifting, Private Tables, and Client Thank-You Boxes.
- Remove the duplicated “Not Sold. Reserved.” manifesto.
- Add a quantity/service process section and “what happens next” sequence.
- Expand the consultation form with Name, Company, Email, WhatsApp, City, Occasion, Quantity Range, Preferred Collection, Delivery Timeline, and Message.
- Replace `alert()` with an inline, accessible confirmation using the approved message.

## 7. VIP Access

- Keep the mock member grant and preview navigation.
- Use a split editorial composition on desktop and a simple stack on mobile.
- Explain the three practical benefits: member price preview, first release note, and pre-paid reservation access.
- Replace authentication theatre with clear request copy and retain restrained success feedback.

## 8. Login

- Preserve credential logic and redirect behavior.
- Remove the literal decorative dot background and panel-wide hover aura.
- Add persistent labels, distinguish login from VIP request, and demote demo credentials to a quiet development note.
- Keep “Enter The Vault” as the single login action.

## 9. The Vault member room

- Preserve access guard, membership card, role/member number, reservations, and concierge links.
- Remove generic KPI and quick-action card grids.
- Lead with one featured Lot 1 product preview and a compact batch ledger.
- Keep member status and fulfilment information grounded; remove unsupported fake scarcity and future-drop theatre.

## 10. Checkout

- Preserve authentication, cart calculations, form submission, cart clearing, and success redirect.
- Rename the flow “Reserve Lot 1” and use “Pre-paid access only / COD unavailable for Lot 1.”
- Add UPI, Card, Razorpay, and Cashfree choices without overcomplicating the mock flow.
- Use real product thumbnails and persisted item facts in the summary.
- Add an intentional empty-selection state and accessible payment labels.

## 11. Motion discipline

- Preserve the welcome intro, tree aura, smoke, shimmer, page reveals, and velvet route-passage direction.
- Reduce decorative point particles in content backgrounds and route overlay.
- Remove hover lifts or glows where they compete with product facts.
- Shorten or soften secondary animations while retaining the slow luxury cadence.
- Keep reduced-motion behavior intact and ensure no reading content is hidden behind motion.

## 12. QA and launch report

- Run ESLint and a production build; resolve console, type, image, hydration, and accessibility issues found.
- Start the production/dev site and inspect Home, Collection, one product page, Gifting, VIP, Login, Vault/member room, Cart, and Checkout.
- Test responsive rendering at 320, 360, 375, 390, 414, 430, and 768px, plus representative desktop widths.
- Check horizontal overflow, navbar offsets, sticky controls, form sizing, hero crop, route scroll reset, and footer height.
- Record delivered changes, preserved systems, removals, tested breakpoints, remaining limitations, and launch status in `FINAL_POLISH_REPORT.md`.

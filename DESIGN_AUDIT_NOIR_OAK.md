# NOIR & OAK — AI-Generated Design Audit

Audit date: 16 July 2026  
Scope: Current App Router pages, shared commerce components, motion layers, responsive rules, and mock product data.  
Constraint: Preserve the existing black, graphite, antique-gold, champagne-gold, and ivory palette; Cormorant Garamond and Inter typography; cinematic tree/intro; route transition; and slow atmospheric motion language.

## System-wide findings

### What already feels premium

- The matte-black and warm-graphite palette is coherent and should remain unchanged.
- Cormorant Garamond display type, restrained Inter body type, fine rules, and antique-gold accents establish the correct luxury register.
- The welcome film, cinematic tree background, local scrims, route passage, and reduced-motion support form a distinctive brand language.
- Existing product renders are strong enough to support product-led layouts.
- The code already reserves space for images with `next/image`, uses safe-area helpers, prevents global horizontal overflow, and maintains cart/login state through Zustand persistence.

### What creates an AI-generated impression

- The same centered eyebrow, oversized serif headline, muted paragraph, bordered card, and gold CTA composition recurs on Collection, Gifting, VIP, Login, and ancillary pages.
- Wide letter spacing is applied to too many utility labels and practical controls, making ordinary ecommerce information feel staged rather than useful.
- Generic bordered card grids are used for products, gifting occasions, dashboard statistics, quick actions, and related products.
- “Private,” “Vault,” “Reserved,” “Access,” and “Lot 1” are repeated without always adding new information.
- Several phrases are abstract or performative: “uncompromising material quality,” “definitive experience,” “designed to impress,” “crafted for universal appeal,” and “luxurious indulgence.”
- Decorative corner brackets, stamps, glows, particles, and hover lifts accumulate around product content. The literal SVG dot field on Login is especially synthetic.
- Useful facts exist inconsistently and under legacy names (`batchNumber`, nested `notes`) instead of a complete product-world model.
- Low-opacity text at 28–50% is used for labels, descriptions, legal copy, and checkout details, reducing confidence on dark surfaces.

## Home

### Premium now

- The poster hero, tree film, localized text scrim, intro gate, and restrained black-gold palette should stay.
- The product renders and large packaging plate give the page real branded assets.
- The left-weighted manifesto and editorial ledger already move away from a default centered landing page.

### AI-generated signs

- The manifesto is too long and self-conscious for the first section after the hero; “not sold, reserved” is repeated again on Gifting.
- Three numbered philosophy rows read like generated brand pillars and delay product discovery.
- Featured products fall back to a conventional three-card grid.
- Decorative stamps and four image-corner accents over-art-direct the packaging plate.
- The final centered CTA repeats the hero’s access language and repeats the same headline/paragraph/button stack.

### Misplaced or missing

- Concrete collection discovery should precede the long access philosophy.
- There is no dedicated sensory craft chapter despite product texture being central to the offer.
- Packaging details are present but omit a clear numbered insert, outer sleeve, and optional corporate note card.
- Gifting is only a button inside packaging; it needs a distinct service preview.

### Spacing and copy corrections

- Reduce post-hero manifesto height and move practical Lot 1 facts into a compact editorial note.
- Use less centered spacing after the hero and avoid repeated `py-36` rhythms.
- Replace “private dry-fruits experience” and “nothing is incidental” with specific product and pack statements.

### Keep untouched

- Welcome intro concept and assets.
- Cinematic hero background/tree atmosphere.
- Hero’s dark local scrim and concise two-action structure.
- Existing color and type tokens and route reveal.

## The Vault (authenticated member room at `/dashboard`)

### Premium now

- The membership card is a credible private-room device.
- Reservation history, member identity, and concierge information are appropriate to an unlocked area.

### AI-generated signs

- Four generic statistic cards and four generic quick-action cards create a dashboard/SaaS bento pattern.
- Fake statistics and “Lot 2 — Autumn Edition” produce unsupported scarcity and roadmap theatre.
- Multiple panels share identical borders, glows, labels, and hover behavior.

### Misplaced or missing

- The primary content should be a featured Lot 1 preview and the member’s reserved selection, not KPI tiles.
- Batch cards should carry product, finish, pack, and reserve information.
- Membership status should be subdued after it is established once.

### Spacing and copy corrections

- Remove symmetrical dashboard grids and use one dominant product story with a quieter reservation ledger.
- Replace “Private Lounge” repetitions with “Member Preview,” “Lot 1,” and concrete fulfilment notes.

### Keep untouched

- Authentication guard, member identity, role display, reservation links, and member-card visual language.

## Collection (`/collection`)

### Premium now

- Horizontal mobile filters, product imagery, and the subdued atmospheric logo are aligned with the brand.
- The page has a simple discovery goal and restrained palette.

### AI-generated signs

- The route is called “The Vault,” blurring public collection discovery with the authenticated member room.
- A perfectly centered hero and uniform three-column grid make the page template-like.
- Filter labels are incomplete and do not match the stated offer architecture.
- Filter transitions scale every card, making filtering more theatrical than useful.

### Misplaced or missing

- Required categories are missing: Makhana Tins, Gift Boxes, Corporate, and Member Preview.
- The page lacks an editorial feature or category explanation to break the default grid.
- Cards omit texture and packaging in the visible scan and do not expose member price behavior clearly.

### Spacing and copy corrections

- Left-align the introduction and reduce the large centered top gap.
- Keep mobile filters to one horizontal row with shorter tracking and 44px targets.
- Replace “micro-batch artisan finishings” with named products and release details.

### Keep untouched

- Existing filter state behavior, product routes, product imagery, and atmospheric background.

## Product detail

### Premium now

- Large product render, member price lock, quantity/reserve behavior, wishlist, and mobile sticky reserve bar form a solid commerce base.
- The product facts ledger is more credible than generic marketing cards.

### AI-generated signs

- Two blurred duplicates of the same product image pretend to be a gallery.
- Decorative image corner accents, hover scale, badge plate, stamp language, and blurred thumbnails add visual noise without product evidence.
- Product copy includes generic claims such as “ultimate,” “definitive,” “designed to impress,” and “artisan touch.”
- The star character used for wishlist feels generic and visually disconnected from the system.

### Misplaced or missing

- Required information is incomplete: overview, ingredient note, gifting use, reservation note, and explicit batch information.
- Sensory details are compressed into “Finish” and “Texture” instead of restrained See, Touch, Aroma, Sound, and Taste notes.
- Facts are hidden entirely inside the member lock even though product understanding should remain public; only price/reserve access needs gating.
- Product note values can overflow the side-by-side mobile ledger.

### Spacing and copy corrections

- Collapse fake thumbnails into an object-detail caption and one packaging view using the real render.
- Use stacked fact rows on narrow widths and increase low-opacity text.
- Reduce large `mb-32` gaps and keep the mobile sticky bar clear of content and safe areas.

### Keep untouched

- Product route, member lock logic, cart/wishlist functions, main image, quantity control, reserve action, and sticky mobile purchase concept.

## Gifting

### Premium now

- The large collection-box render and packaging specification list communicate premium intent.
- Corporate, festive, and private-table use cases are the right foundation.

### AI-generated signs

- The page repeats a centered hero, a two-column feature, a four-card grid, another centered manifesto, and a centered form card.
- “Gifting That Feels Allocated,” “White Glove,” “Uncompromising Material Quality,” and repeated “Request Gifting Access” sound generated.
- The homepage “Not Sold. Reserved.” manifesto is duplicated with no new purpose.
- Four identical gifting cards feel like a generated feature grid.

### Misplaced or missing

- Client thank-you boxes are missing as an explicit intent.
- Required concierge fields are incomplete: WhatsApp, city, quantity range, preferred collection, and delivery timeline.
- There is no “what happens after request” explanation.
- The current `alert()` confirmation is generic and inaccessible as the only response.

### Spacing and copy corrections

- Turn gifting intents into an editorial service index instead of cards.
- Keep packaging image first on mobile and simplify decorative corners.
- Use an inline success state with the supplied confirmation language.

### Keep untouched

- Gifting route, main product render, packaging-led focus, black/gold surfaces, and concierge positioning.

## VIP Access

### Premium now

- Controlled entry, single-column scale, and the temporary member preview flow suit the private-vault idea.
- Form controls already have strong dark surfaces and visible gold focus states.

### AI-generated signs

- The perfectly centered page and bordered form card repeat Login and Gifting.
- “Authenticate your access,” “Unlock Preview,” and “vault is sealed” make a simple access request sound artificial.
- Excessive label tracking and repeated access words reduce clarity.

### Misplaced or missing

- The page does not state what members receive in grounded terms: price preview, first release note, and pre-paid reservation access.
- The form lacks a brief privacy/use explanation in normal sentence case.

### Spacing and copy corrections

- Use an asymmetric editorial intro beside the form on desktop and stack cleanly on mobile.
- Change submit language to “Request VIP Access” and success action to “View Member Preview.”

### Keep untouched

- Current mock access grant, login state, navigation behavior, and controlled-access concept.

## Login

### Premium now

- “Enter The Vault,” compact dark panel, and credential-based demo flow match a member lounge.
- Error and success states are already functional.

### AI-generated signs

- The base64 SVG particle field is made entirely of decorative dots and contains malformed SVG positioning.
- The hover glow across the whole panel is ornamental and distracts from entry.
- “Private Access” repeats the VIP page; demo credentials dominate the luxury surface.
- Placeholder-only fields are less refined and less usable than persistent labels.

### Misplaced or missing

- Login needs a clear distinction from requesting VIP access.
- Demo credentials should be a subdued development note, not the main secondary module.

### Spacing and copy corrections

- Remove the decorative particle texture and panel hover aura.
- Add visible labels, raise muted text contrast, and compact the mobile vertical rhythm.

### Keep untouched

- Authentication credentials, redirects, session store, forgot-password placeholder action, and lounge language.

## Cart drawer

### Premium now

- Drawer behavior, backdrop, quantity controls, subtotal, complimentary shipping, and Lot 1 payment note are suitable.

### AI-generated signs

- “Reserved Cart,” “Private Selection,” “Enter The Vault,” “Lot 1 Rules,” and “Private Checkout” stack too many branded substitutes for familiar commerce terms.
- Cart products show gradient placeholders rather than their real product images.
- The large isolated rules card and multiple glow layers make a simple cart feel over-designed.

### Misplaced or missing

- Product batch, pack, and weight are not visible.
- The close, quantity, and delete buttons need explicit accessible names.

### Spacing and copy corrections

- Title the drawer “Private Selection,” use real thumbnails, shorten the payment note, and use “Continue to Reserve Lot 1.”
- Tighten padding at 320–390px while preserving 44px controls.

### Keep untouched

- Drawer animation direction, cart state, quantity/update/remove behavior, login redirect, and summary logic.

## Checkout

### Premium now

- Two-column form/summary structure, pre-paid acknowledgement, complimentary shipping, and COD restriction are appropriate.
- Authentication guard and success redirect work.

### AI-generated signs

- “Private Checkout,” “Payment Mock,” empty black image blocks, and generic input styling make the page feel unfinished.
- Repeated wide uppercase labels reduce form readability.
- Hover shimmer on the final action is stronger than needed for a trust-critical control.

### Misplaced or missing

- Required payment choices Razorpay and Cashfree are absent.
- Order rows lack actual images and product details.
- Empty-cart handling returns a disabled page rather than a useful route back.
- No concise delivery/pre-paid trust note sits beside the final total.

### Spacing and copy corrections

- Rename page “Reserve Lot 1,” section “Delivery,” and payment heading “Pre-paid access only.”
- Reduce the desktop gap, improve muted contrast, and keep action/summary visible without crowding mobile.

### Keep untouched

- Checkout route, auth guard, shipping fields, cart clearing, mock payment timing, and success route.

## Footer

### Premium now

- The footer uses the correct brand typography, fine top border, and grounded product sentence.

### AI-generated signs

- Three overlapping navigation columns repeat Vault, Gifting, Access, Lounge, and Reservations.
- “Strictly Private Collection” is another unsupported slogan.
- Legal content is nested under an “Access” column, making the structure feel generated rather than conventional.

### Misplaced or missing

- No newsletter input despite the requested compact first-release note signup.
- Contact is indirect (“Private Concierge”) rather than a clear contact destination.
- “Premium Dry Fruits” is not used as the simple brand descriptor.

### Spacing and copy corrections

- Consolidate into Brand, Shop/Service, Contact/Legal, and a compact newsletter form.
- Remove duplicated routes and reduce mobile height.

### Keep untouched

- Brand wordmark, current year, top border, dark background, and readable legal links.

## Mobile navigation

### Premium now

- Full-height dark drawer, body scroll lock, Escape handling, route-close behavior, safe-area support, and large touch controls are strong.

### AI-generated signs

- Oversized italic centered links with a gold divider after every item feel ceremonial rather than navigational.
- Wide tracking and a second cluster of centered links create excessive vertical height on 320px devices.
- The interface title “MENU” is more prominent than the brand context.

### Misplaced or missing

- Collection and The Vault/member room are not clearly differentiated for signed-in users.
- The current menu can crowd short viewports once member links are added.

### Spacing and copy corrections

- Use a quieter left-aligned index, one structural rule, restrained serif sizing, and compact account actions.
- Preserve overflow scrolling, safe area, cart access, and 44px controls.

### Keep untouched

- Drawer direction/concept, black translucent background, cart control, close interaction, and authenticated route behavior.

## Component-level findings

- **Button:** Preserve foil and quiet variants, but reduce tracking on narrow screens and remove one-off duplicate shimmer buttons.
- **Card:** Avoid a universal bordered/glowing container; use rules, ledgers, and image-led modules according to purpose.
- **ProductCard:** Add category, batch code, finish, texture, pack, weight, availability, locked/unlocked price, and a clear reserve/preview action without overloading the image.
- **SectionHeading:** No shared component exists, but pages imitate one. Deliberately vary alignment and hierarchy by content purpose.
- **Footer:** Consolidate repeated navigation and add the requested release-note input.
- **Navbar/MobileMenu:** Clarify Collection versus member Vault, reduce ceremonial dividers, preserve header behavior.
- **ProductGallery:** Replace fake blurred thumbnails with real descriptive object/packaging information.
- **VIPForm:** Ground the request and explain benefits; keep current state flow.
- **GiftingForm:** Add all service fields and inline confirmation.
- **CheckoutForm:** Add named payment providers, real order imagery, and clearer reservation language.
- **CartDrawer:** Use real images and grounded item data; add aria labels.
- **RouteTransition:** Preserve the velvet passage; reduce particle count and label drama so navigation remains fast and secondary.
- **WelcomeIntro:** Preserve the concept and film; verify crop and skip control at target widths.
- **AnimatedLogoAura:** Preserve tree/smoke/shimmer concept; reduce visible point particles and canopy glows when used behind reading content.

## Priority conclusion

The site does not need a new visual identity. It needs subtraction, clearer route roles, product-specific data, restrained copy, varied editorial compositions, and practical commerce detail. The strongest existing assets—the cinematic tree, black-gold surfaces, serif typography, product renders, and vault transition—should become quieter frames for products rather than additional content competing with them.

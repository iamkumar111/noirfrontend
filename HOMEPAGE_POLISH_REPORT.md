# NOIR & OAK Homepage Polish Report

## Files changed

- `src/app/page.tsx`
- `src/components/LuxuryPosterHero.tsx`
- `src/app/globals.css`
- `HOMEPAGE_POLISH_REPORT.md`

## Hero text changes

- Small label: `LOT 1 PRE-PAID ONLY`
- Headline: `ARTISAN CONFECTIONERY HOUSE`
- Editorial line: `where finish becomes the experience.`
- Supporting copy, calls to action, and batch note updated to the supplied final copy.
- The foreground text container now has responsive sizing, a desktop balance constraint, and a deliberate mobile lockup of `ARTISAN` / `CONFECTIONERY HOUSE` without word splitting.

## Hero background confirmation

`HeroCinematicBackground.tsx` was not changed. No hero video, tree, particle, glitter, smoke, spotlight, gradient, overlay, z-index, height, timing, canvas, or atmospheric layer was edited. The only hero component edited was the foreground text layer in `LuxuryPosterHero.tsx`.

## Homepage sections improved

1. First release — catalogue-note composition with one baseline rule and readable release metadata.
2. Collection preview — dominant featured release, live Medusa-aware price display, and linked editorial supporting products.
3. Packaging object study — enlarged existing asset, clear material rows, and gifting details action.
4. Sensory craft — responsive five-part material record: five columns at wide widths, two columns at medium widths, and a single column below that.
5. Gifting vault — stronger service composition using the existing collection-box asset, consultation action, and confirmation note.
6. Closing house statement — strengthened final invitation with clear paired actions.

## Responsive checks

Chrome layout checks completed at: `320`, `360`, `375`, `390`, `414`, `430`, `768`, `1024`, `1280`, `1440`, and `1920` pixels wide.

- No horizontal overflow found.
- Hero headline bounds remained within the viewport at every checked width.
- The mobile `CONFECTIONERY HOUSE` line remained whole and within the text container.
- The desktop headline remains centred, uses the 1100px editorial measure through standard desktop widths, and can expand to 1500px only at very wide viewports.

## Functionality preserved

- Medusa product data remains the homepage source; no seed merchandise was introduced.
- Product, collection, VIP, and gifting links retain `LuxuryLink` route transitions.
- The featured product shows a price only when Medusa supplies one.
- Navigation, cart, checkout, welcome intro, footer, newsletter, responsive menu, and existing route transitions were not edited.

## Verification

- `npm run lint` — passed
- `npx tsc --noEmit` — passed
- `npm run build` — passed (Next.js 16.2.9 production build)

# NOIR & OAK Transition Quality Report

## Files changed

- `src/components/transitions/LuxuryRouteTransition.tsx`
- `src/components/transitions/PageReveal.tsx`
- `src/app/globals.css`
- `TRANSITION_QUALITY_REPORT.md`

## Existing animation values preserved

The Golden Vault Passage sequence, route-navigation state machine, directions, durations, delays, and easing remain unchanged:

- Curtain close: `0.42s`; hold: `0.08s`; curtain part: `0.46s`
- Passage easing: `[0.22, 1, 0.36, 1]`
- Atmosphere fade, smoke drifts, particle paths, centre fade, gold-line draw, label entrance, and progress-line timing are unchanged.
- The centre emblem retains its existing scale-in concept and exact timing. Its scale range was narrowed from `0.9 → 1` to `0.985 → 1` solely to prevent compositor raster softness; it finishes at exact scale `1`.

## Rendering corrections

- The full incoming page no longer animates through `filter: blur(6px)`. Its existing opacity and upward reveal are preserved, but native page text and imagery remain sharp throughout.
- The overlay now explicitly separates velvet panels/background (`z-index: 0`), smoke/glow/particles (`z-index: 1`), and sharp centre content (`z-index: 3`).
- The monogram, gold line, and transition label are isolated in `transition-sharp-content`; none is inside a blurred or backdrop-filtered parent.
- The monogram text shadow was removed so the live `N&O` mark does not bloom into soft glyphs. Its existing ring glow and the existing atmospheric gold glow remain.
- Sharp elements use paint containment, flat transform rendering, hidden backfaces, font smoothing, and geometric text rendering. The label uses a native HTML `<p>`.
- Smoke remains in its own blurred CSS-gradient layer; no blur is applied to the root overlay, centre mark, label, gold line, old page, or new page.

## Canvas and assets

- No `<canvas>` is used by the route transition, so no DPR canvas correction was required.
- No raster logo, glow, smoke, or particle texture is used by the route transition. The gold glow, smoke, dust, panels, and gold lines are native CSS gradients or DOM vector-like elements, so there is no low-resolution transition asset to upscale.
- The luxury fonts are loaded with `next/font` in `src/app/layout.tsx`, avoiding a runtime third-party font fetch during the transition.

## Responsive and behavior checks

- The overlay is fixed to `100dvw × 100dvh`, isolated, and has no root transform, filter, or backdrop filter.
- The fixed viewport construction and sharp-layer bounds were inspected through the headless browser pipeline at `320×568`, `360×800`, `390×844`, `414×896`, `768×1024`, `1366×768`, `1440×900`, and `1920×1080`.
- Browser history route restoration was checked between product and collection paths (back and forward).
- The transition’s navigation code, `LuxuryLink`, route labels, reduced-motion path, and curtain phases were not changed.

## Verification

- `npm run lint` — passed
- `npx tsc --noEmit` — passed
- `npm run build` — passed

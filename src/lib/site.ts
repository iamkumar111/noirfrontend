/**
 * The canonical public origin. Set NEXT_PUBLIC_SITE_URL before deploying to a
 * permanent brand domain; until then, it must match the live storefront host.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://noir.relenshtech.com").replace(/\/$/, "");

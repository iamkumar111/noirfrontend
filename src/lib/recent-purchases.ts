import { createHmac } from "node:crypto"
import { getDemoPurchaseProfiles } from "@/lib/demo-social-proof"

export type PublicRecentPurchase = {
  id: string
  firstName: string
  state: string
  productName: string
  productImage?: string
  /** Hour-bucketed for freshness checks; the client only presents “Recent”. */
  purchasedAt: string
}

export type RecentPurchasesResponse = {
  purchases: PublicRecentPurchase[]
  mode: "production" | "demo"
  displayIntervalMin: number
  displayIntervalMax: number
}

type MedusaOrder = {
  id?: unknown
  created_at?: unknown
  payment_status?: unknown
  customer?: { first_name?: unknown } | null
  shipping_address?: { first_name?: unknown; province?: unknown; state?: unknown } | null
  items?: Array<{ title?: unknown; thumbnail?: unknown }> | null
}

const MAX_PURCHASE_AGE_MS = 36 * 60 * 60 * 1000
const MIN_PRIVACY_DELAY_MS = 2 * 60 * 1000
const MAX_PRIVACY_DELAY_MS = 10 * 60 * 1000

function boundedNumber(value: string | undefined, fallback: number, minimum: number, maximum: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, Math.round(parsed))) : fallback
}

function displayPacing() {
  const min = boundedNumber(process.env.PURCHASE_NOTIFICATION_INTERVAL_MIN, 8000, 2500, 60_000)
  const max = boundedNumber(process.env.PURCHASE_NOTIFICATION_INTERVAL_MAX, 12_000, min, 60_000)
  return { min, max }
}

function privacyDelayMs() {
  const configuredMinutes = Number(process.env.PURCHASE_NOTIFICATION_PRIVACY_DELAY_MINUTES)
  return boundedNumber(
    Number.isFinite(configuredMinutes) ? String(configuredMinutes * 60 * 1000) : undefined,
    5 * 60 * 1000,
    MIN_PRIVACY_DELAY_MS,
    MAX_PRIVACY_DELAY_MS,
  )
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function isVerifiedPaid(paymentStatus: unknown) {
  // Medusa reports captured for a completed payment. “paid” supports a
  // verified custom provider that uses that explicit terminal status.
  return ["captured", "paid"].includes(text(paymentStatus).toLowerCase())
}

function publicId(orderId: string, productName: string) {
  const secret = process.env.PURCHASE_NOTIFICATION_PUBLIC_ID_SECRET || process.env.MEDUSA_ADMIN_API_KEY
  if (!secret) return ""
  return createHmac("sha256", secret).update(`${orderId}:${productName}`).digest("base64url").slice(0, 24)
}

function roundedPurchasedAt(date: Date) {
  return new Date(Math.floor(date.getTime() / 3_600_000) * 3_600_000).toISOString()
}

function sanitiseOrders(orders: MedusaOrder[]): PublicRecentPurchase[] {
  const now = Date.now()
  const earliest = now - MAX_PURCHASE_AGE_MS
  const latest = now - privacyDelayMs()
  const purchases: PublicRecentPurchase[] = []

  for (const order of orders) {
    if (!isVerifiedPaid(order.payment_status)) continue
    const createdAt = new Date(text(order.created_at))
    const orderId = text(order.id)
    const firstName = text(order.shipping_address?.first_name) || text(order.customer?.first_name)
    const state = text(order.shipping_address?.province) || text(order.shipping_address?.state)
    if (!orderId || !firstName || !state || !Number.isFinite(createdAt.getTime())) continue
    if (createdAt.getTime() < earliest || createdAt.getTime() > latest) continue

    for (const item of order.items || []) {
      const productName = text(item.title)
      const id = publicId(orderId, productName)
      if (!productName || !id || purchases.length >= 20) continue
      const productImage = text(item.thumbnail)
      purchases.push({
        id,
        firstName,
        state,
        productName,
        ...(productImage ? { productImage } : {}),
        purchasedAt: roundedPurchasedAt(createdAt),
      })
    }
    if (purchases.length >= 20) break
  }
  return purchases
}

function demoModeEnabled() {
  // This hard gate means a production deployment stays empty even if somebody
  // accidentally sets the demo switch there.
  return process.env.NODE_ENV === "development" && process.env.DEMO_PURCHASE_NOTIFICATIONS === "true"
}

export async function getRecentPurchases(): Promise<RecentPurchasesResponse> {
  const pacing = displayPacing()
  if (demoModeEnabled()) {
    // Keep demo data eligible for the browser scheduler without pretending that
    // these were production transactions at a particular moment in time.
    const purchases = getDemoPurchaseProfiles().map((purchase, index) => ({
      id: purchase.id,
      firstName: purchase.firstName,
      state: purchase.state,
      productName: purchase.productName,
      productImage: purchase.productImage,
      purchasedAt: new Date(Date.now() - (index + 1) * 3_600_000).toISOString(),
    }))
    return { purchases, mode: "demo", displayIntervalMin: pacing.min, displayIntervalMax: pacing.max }
  }

  const backendUrl = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const adminKey = process.env.MEDUSA_ADMIN_API_KEY
  if (!backendUrl || !adminKey) {
    return { purchases: [], mode: "production", displayIntervalMin: pacing.min, displayIntervalMax: pacing.max }
  }

  try {
    const url = new URL("/admin/orders", backendUrl)
    url.searchParams.set("limit", "20")
    url.searchParams.set("order", "-created_at")
    url.searchParams.set("fields", "id,created_at,payment_status,customer.first_name,shipping_address.first_name,shipping_address.province,shipping_address.state,items.title,items.thumbnail")
    const response = await fetch(url, {
      // Medusa v2 secret API keys use HTTP Basic auth. This key is server-only
      // and is never sent to the browser or returned by this route.
      headers: { Authorization: `Basic ${adminKey}` },
      cache: "no-store",
    })
    if (!response.ok) return { purchases: [], mode: "production", displayIntervalMin: pacing.min, displayIntervalMax: pacing.max }
    const body = await response.json() as { orders?: unknown }
    const orders = Array.isArray(body.orders) ? body.orders as MedusaOrder[] : []
    return { purchases: sanitiseOrders(orders), mode: "production", displayIntervalMin: pacing.min, displayIntervalMax: pacing.max }
  } catch {
    // No feed is safer than exposing stale or guessed customer data.
    return { purchases: [], mode: "production", displayIntervalMin: pacing.min, displayIntervalMax: pacing.max }
  }
}

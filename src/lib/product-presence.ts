import { fallbackProducts } from "@/lib/noir-products/fallback-products"
import { getDemoViewingProducts } from "@/lib/demo-social-proof"

type PresenceRecord = { productId: string; expiresAt: number }

export type PublicProductPresence = {
  productId: string
  productName: string
  productImage?: string
  viewerCount: number
  states: Array<{ state: string; count: number }>
}

type PresenceStore = { records: Map<string, PresenceRecord> }

const STORE_KEY = "__noirOakProductPresence"
const MAX_SESSIONS = 5_000

function store(): PresenceStore {
  const root = globalThis as typeof globalThis & { [STORE_KEY]?: PresenceStore }
  if (!root[STORE_KEY]) root[STORE_KEY] = { records: new Map() }
  return root[STORE_KEY]
}

function ttlMs() {
  const seconds = Number(process.env.PRODUCT_PRESENCE_TTL_SECONDS)
  return (Number.isFinite(seconds) ? Math.max(75, Math.min(120, seconds)) : 105) * 1000
}

function demoEnabled() {
  return process.env.NODE_ENV === "development" && process.env.DEMO_VIEWING_NOTIFICATIONS === "true"
}

function cleanup(now = Date.now()) {
  const records = store().records
  for (const [sessionId, record] of records) if (record.expiresAt <= now) records.delete(sessionId)
  while (records.size >= MAX_SESSIONS) records.delete(records.keys().next().value as string)
}

export function recordProductPresence(sessionId: string, productId: string) {
  if (!/^[a-f0-9-]{36}$/i.test(sessionId)) return false
  if (!fallbackProducts.some((product) => product.slug === productId)) return false
  cleanup()
  store().records.set(sessionId, { productId, expiresAt: Date.now() + ttlMs() })
  return true
}

export function getActiveProductPresence(): PublicProductPresence[] {
  if (demoEnabled()) return getDemoViewingProducts()
  cleanup()
  const counts = new Map<string, number>()
  for (const record of store().records.values()) counts.set(record.productId, (counts.get(record.productId) || 0) + 1)
  return [...counts.entries()].flatMap(([productId, viewerCount]) => {
    const product = fallbackProducts.find((item) => item.slug === productId)
    return product ? [{ productId, productName: product.name, productImage: product.images[0], viewerCount, states: [] }] : []
  }).sort((left, right) => right.viewerCount - left.viewerCount)
}

export function productPresenceMode() {
  return demoEnabled() ? "demo" as const : "production" as const
}

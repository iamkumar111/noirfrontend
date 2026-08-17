import { getRecentPurchases } from "@/lib/recent-purchases"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Public, intentionally minimised social-proof feed. The server reads only
 * verified paid orders and never returns an order ID, email, phone, city,
 * address, payment method, or monetary amount.
 */
export async function GET() {
  const payload = await getRecentPurchases()
  return Response.json(payload, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
    },
  })
}

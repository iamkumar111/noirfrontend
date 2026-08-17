import { getActiveProductPresence, productPresenceMode, recordProductPresence } from "@/lib/product-presence"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json({ products: getActiveProductPresence(), mode: productPresenceMode() }, { headers: { "Cache-Control": "private, no-store, max-age=0" } })
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { sessionId?: unknown; productId?: unknown }
    const accepted = typeof body.sessionId === "string" && typeof body.productId === "string" && recordProductPresence(body.sessionId, body.productId)
    return new Response(null, { status: accepted ? 204 : 400, headers: { "Cache-Control": "no-store" } })
  } catch {
    return new Response(null, { status: 400, headers: { "Cache-Control": "no-store" } })
  }
}

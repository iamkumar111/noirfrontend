"use client"

import { useEffect } from "react"

const SESSION_KEY = "noir_oak_product_presence_session"
const HEARTBEAT_MS = 30_000

function sessionId() {
  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const value = crypto.randomUUID()
  window.sessionStorage.setItem(SESSION_KEY, value)
  return value
}

/** Sends one anonymous, visible-tab heartbeat for the active product only. */
export default function ProductPresence({ productId }: { productId: string }) {
  useEffect(() => {
    const id = sessionId()
    let timer: number | undefined
    let disposed = false

    const beat = () => {
      if (disposed || document.visibilityState !== "visible") return
      void fetch("/api/product-presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id, productId }),
        keepalive: true,
      }).catch(() => {})
      timer = window.setTimeout(beat, HEARTBEAT_MS)
    }

    const onVisibilityChange = () => {
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
      if (document.visibilityState === "visible") beat()
    }

    beat()
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      disposed = true
      if (timer !== undefined) window.clearTimeout(timer)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [productId])

  return null
}

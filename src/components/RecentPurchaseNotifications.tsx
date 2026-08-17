"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion"
import { usePathname } from "next/navigation"
import { useLuxuryNavigation } from "@/hooks/useLuxuryNavigation"
import { useStore } from "@/store/useStore"

type PurchaseEvent = { type: "purchase"; id: string; firstName: string; state: string; productName: string; productImage?: string; purchasedAt: string }
type ViewingEvent = { type: "viewing"; id: string; productId: string; productName: string; productImage?: string; viewerCount: number; state?: string; stateCount?: number }
type SocialEvent = PurchaseEvent | ViewingEvent
type PurchaseResponse = { purchases?: Omit<PurchaseEvent, "type">[] }
type PresenceResponse = { products?: Array<{ productId: string; productName: string; productImage?: string; viewerCount: number; states?: Array<{ state: string; count: number }> }> }

const POLL_MS = 25_000
const HOLD_MS = 3_400
const EXIT_MS = 220
const ROTATION_MIN_MS = 7_000
const ROTATION_MAX_MS = 8_000
const MAX_QUEUE_SIZE = 20
const MAX_HISTORY = 200

function randomBetween(min: number, max: number) {
  return min + Math.round(Math.random() * Math.max(0, max - min))
}

function eventKey(event: SocialEvent) {
  if (event.type === "purchase") return `purchase:${event.id}`
  const bucket = Math.max(1, Math.ceil((event.stateCount || event.viewerCount) / 2) * 2)
  return `viewing:${event.productId}:${event.state || "anonymous"}:${bucket}`
}

/** The single, root-level scheduler for verified purchases and anonymous viewing. */
export default function RecentPurchaseNotifications() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const { isTransitioning } = useLuxuryNavigation()
  const isIntroSeen = useStore((state) => state.isIntroSeen)
  const isCartOpen = useStore((state) => state.isCartOpen)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visible, setVisible] = useState<SocialEvent | null>(null)
  const purchaseQueue = useRef<PurchaseEvent[]>([])
  const viewingQueue = useRef<ViewingEvent[]>([])
  const shown = useRef(new Set<string>())
  const shownOrder = useRef<string[]>([])
  const recentTypes = useRef<Array<SocialEvent["type"]>>([])
  const newPurchasePriority = useRef(false)
  const dismissRef = useRef<() => void>(() => {})

  useEffect(() => {
    const read = () => setMobileMenuOpen(document.body.dataset.mobileMenuOpen === "true")
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-mobile-menu-open"] })
    return () => observer.disconnect()
  }, [])

  const currentProductId = pathname.startsWith("/product/") ? decodeURIComponent(pathname.slice("/product/".length)) : null
  const hiddenByRoute = pathname === "/checkout" || pathname === "/success" || pathname === "/login"
  const paused = !isIntroSeen || isTransitioning || isCartOpen || mobileMenuOpen || hiddenByRoute
  const cardMotion: Variants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.16 } }, exit: { opacity: 0, transition: { duration: 0.16 } } }
    : {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const } },
        exit: { opacity: 0, y: 6, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const } },
      }

  useEffect(() => {
    let disposed = false
    let displayTimer: number | undefined
    let pollTimer: number | undefined
    let current: SocialEvent | null = null

    const clearTimer = (timer: number | undefined) => { if (timer !== undefined) window.clearTimeout(timer) }
    const remember = (event: SocialEvent) => {
      const key = eventKey(event)
      shown.current.add(key)
      shownOrder.current.push(key)
      if (shownOrder.current.length > MAX_HISTORY) shown.current.delete(shownOrder.current.shift() || "")
      recentTypes.current = [...recentTypes.current.slice(-4), event.type]
    }
    const enqueue = <T extends SocialEvent>(queue: T[], additions: T[]) => {
      const queued = new Set(queue.map(eventKey))
      queue.push(...additions.filter((event) => !shown.current.has(eventKey(event)) && !queued.has(eventKey(event))))
      queue.splice(MAX_QUEUE_SIZE)
    }
    const capQueues = () => {
      while (purchaseQueue.current.length + viewingQueue.current.length > MAX_QUEUE_SIZE) {
        if (viewingQueue.current.length >= purchaseQueue.current.length) viewingQueue.current.pop()
        else purchaseQueue.current.pop()
      }
    }
    const next = (): SocialEvent | null => {
      const preferredViewing = currentProductId ? viewingQueue.current.findIndex((event) => event.productId === currentProductId) : -1
      if (newPurchasePriority.current && purchaseQueue.current.length) {
        newPurchasePriority.current = false
        return purchaseQueue.current.shift() || null
      }
      const purchases = purchaseQueue.current.length
      const viewings = viewingQueue.current.length
      if (!purchases && !viewings) return null
      if (preferredViewing >= 0 && (recentTypes.current.at(-1) !== "viewing" || !purchases)) return viewingQueue.current.splice(preferredViewing, 1)[0]
      const purchaseRate = recentTypes.current.filter((type) => type === "purchase").length / Math.max(1, recentTypes.current.length)
      const choosePurchase = purchases > 0 && (viewings === 0 || (purchaseRate < 0.4 && Math.random() < 0.72))
      return choosePurchase ? purchaseQueue.current.shift() || null : viewingQueue.current.shift() || purchaseQueue.current.shift() || null
    }
    const schedule = () => {
      clearTimer(displayTimer)
      if (disposed || paused) return
      const fullRotation = randomBetween(ROTATION_MIN_MS, ROTATION_MAX_MS)
      displayTimer = window.setTimeout(showNext, Math.max(300, fullRotation - HOLD_MS - EXIT_MS))
    }
    const showNext = () => {
      displayTimer = undefined
      if (disposed || paused || current) return
      const event = next()
      if (!event) {
        // Keep this one scheduler alive between polling responses; it never
        // fabricates an event and still displays only one card at a time.
        schedule()
        return
      }
      current = event
      remember(event)
      setVisible(event)
      displayTimer = window.setTimeout(() => {
        current = null
        setVisible(null)
        schedule()
      }, HOLD_MS)
    }
    dismissRef.current = () => {
      if (!current) return
      clearTimer(displayTimer)
      current = null
      setVisible(null)
      schedule()
    }
    const poll = async () => {
      const [purchaseResult, presenceResult] = await Promise.allSettled([
        fetch("/api/recent-purchases", { cache: "no-store" }),
        fetch("/api/product-presence", { cache: "no-store" }),
      ])
      if (disposed) return
      if (purchaseResult.status === "fulfilled" && purchaseResult.value.ok) {
        try {
          const payload = await purchaseResult.value.json() as PurchaseResponse
          const additions = (payload.purchases || []).map((purchase) => ({ ...purchase, type: "purchase" as const }))
          if (additions.some((event) => !shown.current.has(eventKey(event)))) newPurchasePriority.current = true
          enqueue(purchaseQueue.current, additions)
          capQueues()
        } catch {}
      }
      if (presenceResult.status === "fulfilled" && presenceResult.value.ok) {
        try {
          const payload = await presenceResult.value.json() as PresenceResponse
          const additions = (payload.products || []).flatMap((product) => {
            if (!product.viewerCount) return []
            const state = [...(product.states || [])].sort((left, right) => right.count - left.count)[0]
            return [{
              type: "viewing" as const,
              id: `viewing:${product.productId}:${state?.state || "anonymous"}:${product.viewerCount}`,
              productId: product.productId,
              productName: product.productName,
              productImage: product.productImage,
              viewerCount: product.viewerCount,
              ...(state ? { state: state.state, stateCount: state.count } : {}),
            }]
          })
          enqueue(viewingQueue.current, additions)
          capQueues()
        } catch {}
      }
      if (!current && displayTimer === undefined && (purchaseQueue.current.length || viewingQueue.current.length)) schedule()
      if (!disposed && !paused) pollTimer = window.setTimeout(() => void poll(), POLL_MS)
    }
    if (!paused) {
      void poll()
      if (purchaseQueue.current.length || viewingQueue.current.length) schedule()
    } else {
      displayTimer = window.setTimeout(() => setVisible(null), 0)
    }
    return () => {
      disposed = true
      clearTimer(displayTimer)
      clearTimer(pollTimer)
      dismissRef.current = () => {}
    }
  }, [currentProductId, paused])

  const label = visible?.type === "purchase" ? "Recent selection" : "Viewing now"
  return <AnimatePresence>{visible && !paused && (
    <motion.aside key={eventKey(visible)} aria-live="polite" aria-label="Social proof notification" variants={cardMotion} initial="hidden" animate="visible" exit="exit" className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-4 z-50 w-[calc(100vw-2rem)] max-w-[350px] overflow-hidden rounded-[14px] border border-[rgba(201,164,92,0.28)] bg-[rgba(8,7,5,0.96)] p-3.5 shadow-[0_16px_38px_rgba(0,0,0,0.34)] md:bottom-6 md:left-6 md:w-[340px]">
      <span className="absolute inset-x-7 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(226,193,118,0.62),transparent)]" />
      <button type="button" aria-label="Dismiss purchase notification" onClick={() => dismissRef.current()} className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center text-base font-light leading-none text-[rgba(241,232,216,0.42)] transition-colors hover:text-[#E2C176]">×</button>
      <div className="flex gap-3">{visible.productImage && <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[7px] border border-[rgba(201,164,92,0.18)] bg-[#0d0b09]"><Image src={visible.productImage} alt="" fill sizes="48px" className="object-cover" /></div>}<div className="min-w-0 pr-7"><p className="text-[8px] uppercase tracking-[0.17em] text-[#C9A45C]">{label}</p>{visible.type === "purchase" ? <><p className="mt-1.5 font-serif text-[1.06rem] leading-tight text-[#E2C176]">{visible.firstName} from {visible.state}</p><p className="mt-1 text-xs leading-snug text-[rgba(241,232,216,0.82)]">selected <span className="text-[#F1E8D8]">{visible.productName}</span></p></> : <><p className="mt-1.5 font-serif text-[1.06rem] leading-tight text-[#E2C176]">{visible.state ? (visible.stateCount === 1 ? `Someone from ${visible.state}` : `${visible.stateCount || visible.viewerCount} visitors from ${visible.state}`) : `${visible.viewerCount} ${visible.viewerCount === 1 ? "visitor" : "visitors"}`}</p><p className="mt-1 text-xs leading-snug text-[rgba(241,232,216,0.82)]">{visible.viewerCount === 1 ? "is viewing" : "are exploring"} <span className="text-[#F1E8D8]">{visible.productName}</span></p></>}<p className="mt-1.5 text-[8px] uppercase tracking-[0.14em] text-[rgba(241,232,216,0.46)]">Recent</p></div></div>
    </motion.aside>
  )}</AnimatePresence>
}

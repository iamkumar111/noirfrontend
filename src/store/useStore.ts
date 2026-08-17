import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  addLineItem,
  clearCart as clearCartStorage,
  getOrCreateCart,
  getStoredCartId,
  removeLineItem,
  retrieveCart,
  updateLineItem,
} from "@/lib/medusa/cart"
import { listProducts } from "@/lib/medusa/products"
import { NOIR_PRODUCT_HANDLES } from "@/lib/medusa/mappers"
import type { CartItem, MedusaCart, Product } from "@/lib/medusa/types"

const quantityTimers = new Map<string, number>()
const quantityVersions = new Map<string, number>()

export type Role = "guest" | "vip" | "premium" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  city?: string
  phone?: string
}

type LoadStatus = "idle" | "loading" | "ready" | "error"
type CartMode = "medusa" | "demo" | null

interface StoreState {
  hasHydrated: boolean
  user: User | null
  role: Role
  isCartOpen: boolean
  cart: CartItem[]
  cartMode: CartMode
  medusaCart: MedusaCart | null
  cartStatus: LoadStatus
  cartError: string | null
  products: Product[]
  catalogStatus: LoadStatus
  catalogError: string | null
  wishlist: string[]
  isIntroSeen: boolean
  login: (user: User) => void
  logout: () => void
  setCartOpen: (isOpen: boolean) => void
  initializeMedusa: () => Promise<void>
  loadCatalog: () => Promise<void>
  loadCart: () => Promise<void>
  addToCart: (variantId: string, quantity: number) => Promise<void>
  addDemoProduct: (product: Product, quantity: number) => void
  removeFromCart: (lineId: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  toggleWishlist: (id: string) => void
  clearCart: () => void
  setIntroSeen: (seen: boolean) => void
  setHasHydrated: (hydrated: boolean) => void
}

function readableError(error: unknown, fallback: string) {
  if (error instanceof Error && /NEXT_PUBLIC_MEDUSA/.test(error.message)) return error.message
  return fallback
}

function mapCart(cart: MedusaCart): CartItem[] {
  return (cart.items || []).flatMap((item) => {
    const product = item.product as (typeof item.product & {
      handle?: string
      metadata?: Record<string, unknown>
      collection?: { title?: string }
    }) | undefined
    const metadata = product?.metadata
    const brand = typeof metadata?.brand === "string" ? metadata.brand.trim().toUpperCase() : ""
    const isNoirProduct = Boolean(
      brand === "NOIR & OAK" ||
      metadata?.noirOak === true ||
      product?.collection?.title?.toUpperCase().includes("NOIR") ||
      (product?.handle && NOIR_PRODUCT_HANDLES.has(product.handle))
    )
    if (!isNoirProduct) return []
    const value = (key: string, fallback: string) =>
      typeof metadata?.[key] === "string" && metadata[key] ? String(metadata[key]) : fallback

    const variant = item.variant as (typeof item.variant & { inventory_quantity?: number; manage_inventory?: boolean }) | undefined
    const inventory = typeof variant?.inventory_quantity === "number" ? variant.inventory_quantity : null
    return [{
      id: item.id,
      variantId: item.variant_id || item.variant?.id || "",
      productId: item.product_id || product?.id,
      name: item.product_title || item.title || "NOIR & OAK Selection",
      variantTitle: item.variant_title || item.variant?.title || undefined,
      price: item.unit_price || 0,
      quantity: item.quantity,
      image: item.thumbnail || product?.thumbnail || undefined,
      imagePlaceholder: "linear-gradient(to bottom right, #171512, #050403)",
      batchCode: value("batchCode", "LOT 1"),
      packaging: value("packaging", "NOIR & OAK presentation packaging"),
      weight: value("weight", "Presentation weight confirmed on selection"),
      maxQuantity: inventory !== null && inventory >= 0 ? inventory : null,
    }]
  })
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      user: null,
      role: "guest",
      isCartOpen: false,
      cart: [],
      cartMode: null,
      medusaCart: null,
      cartStatus: "idle",
      cartError: null,
      products: [],
      catalogStatus: "idle",
      catalogError: null,
      wishlist: [],
      isIntroSeen: false,
      login: (user) => set({ user, role: user.role }),
      logout: () => set({ user: null, role: "guest", wishlist: [] }),
      setCartOpen: (isCartOpen) => set({ isCartOpen }),
      initializeMedusa: async () => {
        await Promise.allSettled([get().loadCatalog(), get().loadCart()])
      },
      loadCatalog: async () => {
        if (get().catalogStatus === "loading") return
        set({ catalogStatus: "loading", catalogError: null })
        try {
          const products = await listProducts()
          set({
            products,
            catalogStatus: "ready",
            catalogError: products.length ? null : "No products found in the Medusa collection.",
          })
        } catch (error) {
          set({
            products: [],
            catalogStatus: "error",
            catalogError: readableError(error, "The private collection is temporarily unavailable. Please try again shortly."),
          })
        }
      },
      loadCart: async () => {
        if (typeof window === "undefined" || get().cartStatus === "loading") return
        if (get().cartMode === "demo") {
          set({ cartStatus: "ready", cartError: null })
          return
        }
        const cartId = getStoredCartId()
        if (!cartId) {
          set({ cart: [], medusaCart: null, cartStatus: "ready", cartError: null })
          return
        }
        set({ cartStatus: "loading", cartError: null })
        try {
          const medusaCart = await retrieveCart(cartId)
          const cart = mapCart(medusaCart)
          if ((medusaCart.items?.length || 0) !== cart.length) {
            clearCartStorage()
            set({ cart: [], medusaCart: null, cartStatus: "ready", cartError: null })
            return
          }
          set({ cart, cartMode: "medusa", medusaCart, cartStatus: "ready" })
        } catch {
          clearCartStorage()
          set({ cart: [], medusaCart: null, cartStatus: "ready", cartError: null })
        }
      },
      addToCart: async (variantId, quantity) => {
        set({ cartStatus: "loading", cartError: null })
        try {
          if (get().cartMode === "demo") clearCartStorage()
          const existingCart = get().medusaCart || (await getOrCreateCart())
          const medusaCart = await addLineItem(existingCart.id, variantId, quantity)
          set({ cart: mapCart(medusaCart), cartMode: "medusa", medusaCart, cartStatus: "ready" })
        } catch (error) {
          set({
            cartStatus: "error",
            cartError: readableError(error, "This piece could not be added to your private selection."),
          })
          throw error
        }
      },
      addDemoProduct: (product, quantity) => {
        const unitPrice = Number((product.price || "0").replace(/[^\d.]/g, "")) || 0
        const lineId = `demo:${product.id}`
        clearCartStorage()
        set((state) => {
          const existing = state.cartMode === "demo" ? state.cart.find((item) => item.id === lineId) : undefined
          const cart = state.cartMode === "demo" ? state.cart : []
          return {
            cart: existing
              ? cart.map((item) => item.id === lineId ? { ...item, quantity: item.quantity + quantity } : item)
              : [...cart, {
                id: lineId,
                variantId: lineId,
                productId: product.id,
                name: product.name,
                price: unitPrice,
                quantity,
                image: product.images[0],
                imagePlaceholder: product.imagePlaceholder,
                batchCode: product.batchCode,
                packaging: product.packaging,
                weight: product.weight,
                maxQuantity: null,
              }],
            cartMode: "demo" as const,
            medusaCart: null,
            cartStatus: "ready" as const,
            cartError: null,
          }
        })
      },
      removeFromCart: async (lineId) => {
        if (get().cartMode === "demo") {
          set((state) => {
            const cart = state.cart.filter((item) => item.id !== lineId)
            return { cart, cartMode: cart.length ? "demo" as const : null, cartError: null }
          })
          return
        }
        const cart = get().medusaCart
        if (!cart) return
        const timer = quantityTimers.get(lineId)
        if (timer) window.clearTimeout(timer)
        quantityTimers.delete(lineId)
        quantityVersions.set(lineId, (quantityVersions.get(lineId) || 0) + 1)
        set({ cartStatus: "loading", cartError: null })
        try {
          const medusaCart = await removeLineItem(cart.id, lineId)
          set({ cart: mapCart(medusaCart), medusaCart, cartStatus: "ready" })
        } catch (error) {
          set({ cartStatus: "error", cartError: readableError(error, "This piece could not be removed.") })
        }
      },
      updateQuantity: async (lineId, quantity) => {
        if (get().cartMode === "demo") {
          set((state) => ({
            cart: state.cart.map((item) => item.id === lineId ? { ...item, quantity: Math.max(1, quantity) } : item),
            cartError: null,
          }))
          return
        }
        const cart = get().medusaCart
        const currentItem = get().cart.find((item) => item.id === lineId)
        if (!cart || !currentItem) return
        const max = currentItem.maxQuantity ?? Number.POSITIVE_INFINITY
        const nextQuantity = Math.max(1, Math.min(quantity, max))
        if (nextQuantity === currentItem.quantity) return

        // UI state is authoritative. Remote persistence is deliberately delayed
        // so a run of taps produces one request and never blocks the selector.
        const version = (quantityVersions.get(lineId) || 0) + 1
        quantityVersions.set(lineId, version)
        const existingTimer = quantityTimers.get(lineId)
        if (existingTimer) window.clearTimeout(existingTimer)
        set((state) => ({
          cartError: null,
          cart: state.cart.map((item) => item.id === lineId ? { ...item, quantity: nextQuantity } : item),
        }))

        const timer = window.setTimeout(async () => {
          quantityTimers.delete(lineId)
          try {
            const medusaCart = await updateLineItem(cart.id, lineId, nextQuantity)
            if (quantityVersions.get(lineId) !== version) return
            set({ cart: mapCart(medusaCart), medusaCart, cartStatus: "ready", cartError: null })
          } catch (error) {
            // Keep the latest optimistic value visible; a stale response may not
            // overwrite a more recent local action.
            if (quantityVersions.get(lineId) !== version) return
            set({ cartError: readableError(error, "The quantity could not be saved. Please try again.") })
          }
        }, 320)
        quantityTimers.set(lineId, timer)
      },
      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((wishlistId) => wishlistId !== id)
            : [...state.wishlist, id],
        })),
      clearCart: () => {
        quantityTimers.forEach((timer) => window.clearTimeout(timer))
        quantityTimers.clear()
        quantityVersions.clear()
        clearCartStorage()
        set({ cart: [], cartMode: null, medusaCart: null, cartStatus: "ready", cartError: null })
      },
      setIntroSeen: (isIntroSeen) => set({ isIntroSeen }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "noir_oak_session",
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        wishlist: state.wishlist,
        cart: state.cartMode === "demo" ? state.cart : [],
        cartMode: state.cartMode === "demo" ? "demo" : null,
      }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
)

export type { CartItem, Product }

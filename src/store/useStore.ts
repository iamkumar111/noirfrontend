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

interface StoreState {
  hasHydrated: boolean
  user: User | null
  role: Role
  isCartOpen: boolean
  cart: CartItem[]
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
          set({ cart, medusaCart, cartStatus: "ready" })
        } catch {
          clearCartStorage()
          set({ cart: [], medusaCart: null, cartStatus: "ready", cartError: null })
        }
      },
      addToCart: async (variantId, quantity) => {
        set({ cartStatus: "loading", cartError: null })
        try {
          const existingCart = get().medusaCart || (await getOrCreateCart())
          const medusaCart = await addLineItem(existingCart.id, variantId, quantity)
          set({ cart: mapCart(medusaCart), medusaCart, cartStatus: "ready" })
        } catch (error) {
          set({
            cartStatus: "error",
            cartError: readableError(error, "This piece could not be added to your private selection."),
          })
          throw error
        }
      },
      removeFromCart: async (lineId) => {
        const cart = get().medusaCart
        if (!cart) return
        set({ cartStatus: "loading", cartError: null })
        try {
          const medusaCart = await removeLineItem(cart.id, lineId)
          set({ cart: mapCart(medusaCart), medusaCart, cartStatus: "ready" })
        } catch (error) {
          set({ cartStatus: "error", cartError: readableError(error, "This piece could not be removed.") })
        }
      },
      updateQuantity: async (lineId, quantity) => {
        const cart = get().medusaCart
        if (!cart || quantity < 1) return
        set({ cartStatus: "loading", cartError: null })
        try {
          const medusaCart = await updateLineItem(cart.id, lineId, quantity)
          set({ cart: mapCart(medusaCart), medusaCart, cartStatus: "ready" })
        } catch (error) {
          set({ cartStatus: "error", cartError: readableError(error, "The quantity could not be updated.") })
        }
      },
      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((wishlistId) => wishlistId !== id)
            : [...state.wishlist, id],
        })),
      clearCart: () => {
        clearCartStorage()
        set({ cart: [], medusaCart: null, cartStatus: "ready", cartError: null })
      },
      setIntroSeen: (isIntroSeen) => set({ isIntroSeen }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "noir_oak_session",
      partialize: (state) => ({ user: state.user, role: state.role, wishlist: state.wishlist }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
)

export type { CartItem, Product }

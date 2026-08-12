import type { HttpTypes } from "@medusajs/types"

export const CART_STORAGE_KEY = "noir_oak_medusa_cart_id"
export const PRICE_PREVIEW_MESSAGE = "Price revealed inside member preview"

export type NoirProductSource = "medusa" | "fallback"

export type NoirProduct = {
  id: string
  medusaId?: string
  variantId?: string
  slug: string
  name: string
  category: string
  badge?: string
  batchCode: string
  finish: string
  texture: string
  packaging: string
  weight: string
  status: string
  shortDescription: string
  longDescription?: string
  price?: string
  images: string[]
  availableForSale: boolean
  source: NoirProductSource

  // Existing NOIR & OAK presentation fields. These remain part of the internal
  // adapter contract so the established product-detail design and copy do not
  // depend on raw Medusa objects.
  lockedPrice: string
  imagePlaceholder: string
  batchNumber: string
  storage: string
  pairing: string
  giftingUse: string
  reserveStatus: string
  releaseStatus: string
  ingredientNote: string
  sensory: {
    see: string
    touch: string
    aroma: string
    sound: string
    taste: string
  }
  stock: number | null
  isPrivate: boolean
  isFeatured: boolean
}

export interface CartItem {
  id: string
  variantId: string
  productId?: string
  name: string
  variantTitle?: string
  price: number
  quantity: number
  imagePlaceholder: string
  image?: string
  batchCode?: string
  packaging?: string
  weight?: string
}

export type MedusaCart = HttpTypes.StoreCart
export type MedusaRegion = HttpTypes.StoreRegion

export interface CheckoutAddress {
  first_name: string
  last_name: string
  address_1: string
  city: string
  postal_code: string
  country_code: string
  phone: string
}

export interface CheckoutPreparation {
  cart: MedusaCart
  paymentConfigured: boolean
  paymentProviderId?: string
}

export type Product = NoirProduct


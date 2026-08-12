import { medusa } from "./client"
import { getDefaultRegion, NO_REGION_WARNING } from "./regions"
import { CART_STORAGE_KEY, type MedusaCart } from "./types"

const cartFields =
  "id,email,region_id,currency_code,*items,*items.variant,*items.product,*items.product.collection,*shipping_address,*shipping_methods,subtotal,item_total,tax_total,shipping_total,discount_total,total"

export function getStoredCartId() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(CART_STORAGE_KEY)
}

export function storeCartId(cartId: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(CART_STORAGE_KEY, cartId)
}

export function clearStoredCartId() {
  if (typeof window !== "undefined") window.localStorage.removeItem(CART_STORAGE_KEY)
}

export async function createCart(region_id: string): Promise<MedusaCart> {
  const { cart } = await medusa.store.cart.create({ region_id }, { fields: cartFields })
  storeCartId(cart.id)
  return cart
}

export async function retrieveCart(cart_id: string): Promise<MedusaCart> {
  const { cart } = await medusa.store.cart.retrieve(cart_id, { fields: cartFields })
  return cart
}

export async function getOrCreateCart(): Promise<MedusaCart> {
  const storedId = getStoredCartId()
  if (storedId) {
    try {
      return await retrieveCart(storedId)
    } catch {
      clearStoredCartId()
    }
  }

  const region = await getDefaultRegion()
  if (!region) throw new Error(NO_REGION_WARNING)
  return createCart(region.id)
}

export async function addLineItem(cart_id: string, variant_id: string, quantity: number) {
  const { cart } = await medusa.store.cart.createLineItem(
    cart_id,
    { variant_id, quantity },
    { fields: cartFields }
  )
  return cart
}

export const addToCart = addLineItem

export async function updateLineItem(cart_id: string, line_id: string, quantity: number) {
  const { cart } = await medusa.store.cart.updateLineItem(
    cart_id,
    line_id,
    { quantity },
    { fields: cartFields }
  )
  return cart
}

export const updateCartItem = updateLineItem

export async function removeLineItem(cart_id: string, line_id: string) {
  const { parent } = await medusa.store.cart.deleteLineItem(cart_id, line_id, { fields: cartFields })
  return parent || retrieveCart(cart_id)
}

export const removeCartItem = removeLineItem

export function clearCart() {
  clearStoredCartId()
}

import { medusa } from "./client"
import type { CheckoutAddress, CheckoutPreparation, ConfirmedOrder, MedusaCart } from "./types"

const NON_CHECKOUT_PAYMENT_PROVIDERS = new Set(["pp_system_default"])

export async function setCheckoutDetails(
  cartId: string,
  email: string,
  shippingAddress: CheckoutAddress
): Promise<MedusaCart> {
  const { cart } = await medusa.store.cart.update(cartId, {
    email,
    shipping_address: shippingAddress,
  })
  return cart
}

export async function selectFirstShippingMethod(cartId: string): Promise<MedusaCart> {
  const { shipping_options } = await medusa.store.fulfillment.listCartOptions({ cart_id: cartId })
  if (!shipping_options.length) return (await medusa.store.cart.retrieve(cartId)).cart
  return (await medusa.store.cart.addShippingMethod(cartId, { option_id: shipping_options[0].id })).cart
}

export async function prepareCheckout(cart: MedusaCart, idempotencyKey?: string): Promise<CheckoutPreparation> {
  if (!cart.region_id) return { cart, paymentConfigured: false }
  const { payment_providers } = await medusa.store.payment.listPaymentProviders({
    region_id: cart.region_id,
  })
  // Medusa's system provider is a development placeholder. It cannot collect a
  // customer payment or open a hosted checkout, so never present it as secure.
  const provider = payment_providers.find(
    (paymentProvider) => !NON_CHECKOUT_PAYMENT_PROVIDERS.has(paymentProvider.id)
  )
  if (!provider) return { cart, paymentConfigured: false }

  const { payment_collection } = await medusa.store.payment.initiatePaymentSession(
    cart,
    { provider_id: provider.id },
    undefined,
    idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
  )
  const session = payment_collection.payment_sessions?.find((candidate) => candidate.provider_id === provider.id)
  const sessionData = session?.data || {}
  // A hosted provider may expose its redirect only through its Medusa session
  // data. We use it when present, without guessing at provider-specific fields.
  const possibleUrl = [sessionData.session_url, sessionData.checkout_url, sessionData.url]
    .find((value): value is string => typeof value === "string" && /^https:\/\//.test(value))
  return { cart, paymentConfigured: true, paymentProviderId: provider.id, hostedPaymentUrl: possibleUrl }
}

/** Medusa completes only after its server-side payment state is authorized. */
export async function completeVerifiedCheckout(cartId: string, idempotencyKey?: string): Promise<ConfirmedOrder> {
  const result = await medusa.store.cart.complete(cartId, {
    fields: "id,display_id,email,total,currency_code,items.*,shipping_address.*",
  }, idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined)
  if (result.type !== "order") throw new Error(result.error.message || "Payment is not authorized yet.")
  return result.order
}

export async function retrieveVerifiedOrder(orderId: string): Promise<ConfirmedOrder> {
  const { order } = await medusa.store.order.retrieve(orderId, {
    fields: "id,display_id,email,total,currency_code,items.*,shipping_address.*",
  })
  return order
}

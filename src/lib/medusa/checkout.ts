import { medusa } from "./client"
import type { CheckoutAddress, CheckoutPreparation, MedusaCart } from "./types"

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

export async function prepareCheckout(cart: MedusaCart): Promise<CheckoutPreparation> {
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

  await medusa.store.payment.initiatePaymentSession(cart, { provider_id: provider.id })
  return { cart, paymentConfigured: true, paymentProviderId: provider.id }
}

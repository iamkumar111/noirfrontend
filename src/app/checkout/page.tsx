'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from '@/components/transitions/LuxuryLink';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/lib/medusa/products';
import { prepareCheckout, selectFirstShippingMethod, setCheckoutDetails } from '@/lib/medusa/checkout';

const PAYMENT_OPTIONS = [
  ['upi', 'UPI', 'Pay with a verified UPI app'],
  ['card', 'Card', 'Credit or debit card'],
  ['razorpay', 'Razorpay', 'Secure gateway checkout'],
  ['cashfree', 'Cashfree', 'Secure gateway checkout'],
];

export default function CheckoutPage() {
  const { user, cart, medusaCart, loadCart, cartStatus, hasHydrated } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState('');

  useEffect(() => {
    if (hasHydrated && !user) router.replace('/login?redirect=/checkout');
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;
  const subtotal = medusaCart?.subtotal ?? cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = medusaCart?.shipping_total ?? 0;
  const taxes = medusaCart?.tax_total ?? 0;
  const total = medusaCart?.total ?? subtotal;
  const currencyCode = medusaCart?.currency_code || null;

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!medusaCart) {
      setCheckoutNotice('Your private selection could not be retrieved. Please reopen the cart.');
      return;
    }
    setLoading(true);
    setCheckoutNotice('');
    const data = new FormData(event.currentTarget);
    try {
      let updatedCart = await setCheckoutDetails(
        medusaCart.id,
        String(data.get('email') || ''),
        {
          first_name: String(data.get('firstName') || ''),
          last_name: String(data.get('lastName') || ''),
          address_1: String(data.get('address') || ''),
          city: String(data.get('city') || ''),
          postal_code: String(data.get('postalCode') || ''),
          country_code: (process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || 'in').toLowerCase(),
          phone: String(data.get('phone') || ''),
        }
      );
      updatedCart = await selectFirstShippingMethod(updatedCart.id);
      const preparation = await prepareCheckout(updatedCart);
      await loadCart();
      setCheckoutNotice(preparation.paymentConfigured
        ? 'Payment session prepared. Continue with the configured secure provider to complete this reservation.'
        : 'Payment provider is not configured yet. Reservation preview is ready.');
    } catch {
      setCheckoutNotice('Checkout is not configured for this selection yet. Your cart has been kept safely.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    if (cartStatus === 'loading') return <div className="section-top flex min-h-screen items-center justify-center bg-[#050403] px-5"><div className="text-center"><p className="eyebrow text-[#D9B86C]">Preparing reservation</p><div className="mx-auto mt-6 h-px w-36 animate-pulse bg-[#D9B86C]/40" /></div></div>;
    return (
      <div className="section-top flex min-h-screen items-center bg-[#050403] px-5 pb-24">
        <div className="mx-auto max-w-lg text-center"><p className="eyebrow mb-4 text-[#D9B86C]">Private Selection</p><h1 className="font-serif text-4xl text-[#F1E8D8]">There is nothing to reserve yet.</h1><p className="mt-5 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">Choose a Lot 1 piece before returning to the reservation flow.</p><Link href="/collection" className="btn-foil mt-8"><span className="btn-label">View the collection</span></Link></div>
      </div>
    );
  }

  return (
    <div className="section-top relative z-10 min-h-screen bg-transparent px-5 pb-24 md:px-6 md:pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_70%_0%,rgba(26,21,17,0.7)_0%,#050403_62%)]" />
      <div className="relative z-20 mx-auto max-w-7xl">
        <header className="mb-10 border-b border-[rgba(200,164,93,0.2)] pb-9 md:mb-14 md:pb-12">
          <p className="eyebrow mb-4 text-[#D9B86C]">Pre-paid access only</p>
          <h1 className="font-serif text-[2.75rem] leading-tight text-[#F1E8D8] md:text-6xl">Reserve Lot 1</h1>
          <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">Confirm delivery and choose a secure payment route. Cash on Delivery is unavailable for Lot 1.</p>
        </header>

        <form onSubmit={handlePayment} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-12 lg:col-span-7">
            <section>
              <div className="mb-6 flex items-end justify-between border-b border-[rgba(241,232,216,0.08)] pb-4"><h2 className="font-serif text-2xl text-[#F1E8D8]">Delivery</h2><span className="text-[9px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.58)]">India delivery</span></div>
              <div className="grid gap-6 sm:grid-cols-2">
                <CheckoutField id="first-name" label="First Name" name="firstName" autoComplete="given-name" defaultValue={user.name.split(' ')[0]} />
                <CheckoutField id="last-name" label="Last Name" name="lastName" autoComplete="family-name" defaultValue={user.name.split(' ').slice(1).join(' ')} />
                <div className="sm:col-span-2"><CheckoutField id="address" label="Address" name="address" autoComplete="street-address" /></div>
                <CheckoutField id="city" label="City" name="city" autoComplete="address-level2" />
                <CheckoutField id="postal-code" label="Postal Code" name="postalCode" autoComplete="postal-code" inputMode="numeric" />
                <CheckoutField id="checkout-phone" label="WhatsApp" name="phone" type="tel" autoComplete="tel" />
                <CheckoutField id="checkout-email" label="Email" name="email" type="email" autoComplete="email" defaultValue={user.email} />
              </div>
            </section>

            <fieldset>
              <legend className="mb-6 w-full border-b border-[rgba(241,232,216,0.08)] pb-4 font-serif text-2xl text-[#F1E8D8]">Payment</legend>
              <p className="mb-5 text-sm font-light text-[rgba(241,232,216,0.7)]">Choose one pre-paid payment option.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map(([value, title, note], index) => (
                  <label key={value} className="flex min-h-20 items-start gap-4 border border-[rgba(200,164,93,0.18)] bg-[#0D0B09] p-4 has-[:checked]:border-[#D9B86C]/65 has-[:checked]:bg-[rgba(200,164,93,0.08)]">
                    <input type="radio" name="payment" value={value} required defaultChecked={index === 0} className="mt-1 accent-[#D9B86C]" />
                    <span><span className="block text-sm text-[#F1E8D8]">{title}</span><span className="mt-1 block text-xs font-light text-[rgba(241,232,216,0.6)]">{note}</span></span>
                  </label>
                ))}
              </div>
              <p className="mt-4 border-l border-[#D9B86C]/35 pl-4 text-xs font-light leading-relaxed text-[rgba(241,232,216,0.68)]">COD unavailable for Lot 1. A secure payment route becomes active after a production payment provider is configured in Medusa.</p>
            </fieldset>

            <label className="flex items-start gap-4 border-t border-[rgba(241,232,216,0.08)] pt-6">
              <input type="checkbox" required className="mt-1 accent-[#D9B86C]" />
              <span className="text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">I understand that Lot 1 uses pre-paid reservation and that availability is confirmed after successful payment.</span>
            </label>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-[rgba(200,164,93,0.2)] bg-[#0D0B09] p-6 lg:sticky lg:top-32 md:p-8">
              <h2 className="border-b border-[rgba(241,232,216,0.08)] pb-4 font-serif text-2xl text-[#F1E8D8]">Private Selection</h2>
              <div className="divide-y divide-[rgba(241,232,216,0.08)]">
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-[4.5rem_1fr_auto] gap-4 py-5">
                    <div className="relative h-20 border border-[rgba(200,164,93,0.15)] bg-[#050403]">{item.image ? <Image src={item.image} alt="" fill sizes="72px" className="object-contain p-1.5" /> : <div className="absolute inset-0 opacity-35" style={{ background: item.imagePlaceholder }} />}</div>
                    <div><h3 className="font-serif text-lg leading-tight text-[#F1E8D8]">{item.name}</h3><p className="mt-2 text-[9px] uppercase tracking-[0.1em] text-[rgba(241,232,216,0.58)]">{item.batchCode || 'Lot 1'} / Qty {item.quantity}</p>{item.weight && <p className="mt-1 text-xs text-[rgba(241,232,216,0.58)]">{item.weight}</p>}</div>
                    <p className="text-sm text-[#D9B86C]">{formatPrice(item.price * item.quantity, currencyCode)}</p>
                  </div>
                ))}
              </div>
              <dl className="space-y-3 border-t border-[rgba(241,232,216,0.08)] pt-5 text-sm">
                <div className="flex justify-between text-[rgba(241,232,216,0.7)]"><dt>Subtotal</dt><dd>{formatPrice(subtotal, currencyCode)}</dd></div>
                <div className="flex justify-between text-[rgba(241,232,216,0.7)]"><dt>Taxes</dt><dd>{formatPrice(taxes, currencyCode)}</dd></div>
                <div className="flex justify-between text-[rgba(241,232,216,0.7)]"><dt>Shipping</dt><dd className="text-[#D9B86C]">{shipping ? formatPrice(shipping, currencyCode) : 'Calculated at confirmation'}</dd></div>
                <div className="flex justify-between border-t border-[rgba(241,232,216,0.08)] pt-5 font-serif text-2xl text-[#F1E8D8]"><dt>Total</dt><dd className="text-[#D9B86C]">{formatPrice(total, currencyCode)}</dd></div>
              </dl>
              <button type="submit" disabled={loading} className="btn-foil mt-7 w-full disabled:opacity-55"><span className="btn-label">{loading ? 'Recording reservation' : 'Confirm pre-paid reservation'}</span></button>
              {checkoutNotice && <p role="status" className="mt-4 border-l border-[#D9B86C]/40 pl-4 text-xs font-light leading-relaxed text-[rgba(241,232,216,0.72)]">{checkoutNotice}</p>}
              <p className="mt-4 text-center text-xs font-light leading-relaxed text-[rgba(241,232,216,0.58)]">Delivery timing is confirmed with the reservation note.</p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function CheckoutField({ id, label, ...props }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div><label htmlFor={id} className="form-label">{label} *</label><input id={id} required className="luxury-input" {...props} /></div>;
}

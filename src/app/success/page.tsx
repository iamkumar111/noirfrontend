"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Link from "@/components/transitions/LuxuryLink";
import { useStore } from "@/store/useStore";
import { retrieveVerifiedOrder } from "@/lib/medusa/checkout";
import { formatPrice } from "@/lib/medusa/products";
import type { ConfirmedOrder } from "@/lib/medusa/types";
import { formatReservationTotal, getReservationById } from "@/lib/reservations";

function SuccessContent() {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);
  const [state, setState] = useState<"verifying" | "confirmed" | "unavailable">("verifying");
  const orderId = searchParams.get("order_id");
  const reservationId = searchParams.get("reservation_id");
  const demoReservation = reservationId ? getReservationById(reservationId) : null;
  const unavailable = !orderId;

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    retrieveVerifiedOrder(orderId)
      .then((verifiedOrder) => {
        if (!active || verifiedOrder.id !== orderId) return;
        setOrder(verifiedOrder);
        setState("confirmed");
      })
      .catch(() => { if (active) setState("unavailable"); });
    return () => { active = false; };
  }, [orderId]);

  if (!hasHydrated) return null;
  if (demoReservation) {
    return (
      <div className="section-top relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#020202] px-5 pb-24 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(126,95,39,.19),transparent_32%),radial-gradient(circle_at_center,#111_0%,#020202_70%)]" />
        <motion.section initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? .12 : .32 }} className="relative z-10 w-full max-w-2xl border border-[#C9A45C]/25 bg-[#090806] p-7 text-center md:p-12">
          <motion.div className="mx-auto mb-7 h-px w-28 bg-[#C9A45C]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? .1 : .55 }} />
          <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-full border border-[#C9A45C]/45 text-[#D9B86C]"><svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor"><path d="m5 12 4 4L19 7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <p className="eyebrow text-[#D9B86C]">NOIR &amp; OAK</p>
          <h1 className="mt-4 font-serif text-4xl text-[#F1E8D8] md:text-5xl">Your Order Is Confirmed</h1>
          <p className="mt-4 text-sm font-light text-[rgba(241,232,216,.74)]">This demo order has been saved locally. No payment was collected.</p>
          <dl className="mt-9 border-y border-[rgba(200,164,93,.2)] text-left">
            <div className="flex justify-between gap-6 py-4"><dt className="text-[10px] uppercase tracking-[.14em] text-[rgba(241,232,216,.58)]">Order ID</dt><dd className="font-mono text-sm text-[#E0C17A]">{demoReservation.id}</dd></div>
            {demoReservation.items.map((item) => <div key={item.name} className="flex justify-between gap-6 border-t border-[rgba(241,232,216,.08)] py-4 text-sm"><dt className="font-light text-[#F1E8D8]">{item.name} <span className="text-[rgba(241,232,216,.55)]">× {item.quantity}</span></dt><dd className="text-[#D9B86C]">{formatReservationTotal(item.unitPrice * item.quantity)}</dd></div>)}
            <div className="flex justify-between gap-6 border-t border-[rgba(241,232,216,.08)] py-5 font-serif text-xl text-[#F1E8D8]"><dt>Demo total</dt><dd className="text-[#D9B86C]">{formatReservationTotal(demoReservation.total)}</dd></div>
          </dl>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href={`/orders/${demoReservation.id}`} className="btn-foil"><span className="btn-label">View Order</span></Link><Link href="/collection" className="btn-quiet">Continue Shopping</Link></div>
        </motion.section>
      </div>
    );
  }
  if (state !== "confirmed" || !order) {
    const isVerifying = !unavailable && state === "verifying";
    return <div className="section-top flex min-h-[100svh] items-center justify-center bg-[#020202] px-5 text-center"><div className="max-w-md"><p className="eyebrow text-[#D9B86C]">{isVerifying ? "Verifying payment" : "Order confirmation unavailable"}</p><h1 className="mt-5 font-serif text-4xl text-[#F1E8D8]">{isVerifying ? "Securing your selection." : "We could not verify this order."}</h1><p className="mt-5 text-sm font-light leading-relaxed text-[rgba(241,232,216,.7)]">{isVerifying ? "We are confirming your payment with the secure order service." : "Your cart has not been altered. Return to checkout to review your payment status."}</p><Link href="/checkout" className="btn-quiet mt-8">Return to checkout</Link></div></div>;
  }

  const address = order.shipping_address;
  return (
    <div className="section-top relative z-10 flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#020202] px-5 pb-24 md:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(126,95,39,.19),transparent_32%),radial-gradient(circle_at_center,#111_0%,#020202_70%)]" />
      <motion.section initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? .12 : .32 }} className="relative z-10 w-full max-w-2xl border border-[#C9A45C]/25 bg-[#090806] p-7 text-center md:p-12">
        <motion.div className="mx-auto mb-7 h-px w-28 bg-[#C9A45C]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? .1 : .55 }} />
        <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-full border border-[#C9A45C]/45 text-[#D9B86C]"><svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor"><path d="m5 12 4 4L19 7" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <p className="eyebrow text-[#D9B86C]">NOIR &amp; OAK</p>
        <h1 className="mt-4 font-serif text-4xl text-[#F1E8D8] md:text-5xl">Your Order Is Confirmed</h1>
        <p className="mt-4 text-sm font-light text-[rgba(241,232,216,.74)]">Thank you. Your order has been placed successfully.</p>
        <dl className="mt-9 border-y border-[rgba(200,164,93,.2)] text-left">
          <div className="flex justify-between gap-6 py-4"><dt className="text-[10px] uppercase tracking-[.14em] text-[rgba(241,232,216,.58)]">Order ID</dt><dd className="font-mono text-sm text-[#E0C17A]">{order.display_id || order.id}</dd></div>
          {(order.items || []).map((item) => <div key={item.id} className="flex justify-between gap-6 border-t border-[rgba(241,232,216,.08)] py-4 text-sm"><dt className="font-light text-[#F1E8D8]">{item.title} <span className="text-[rgba(241,232,216,.55)]">× {item.quantity}</span></dt><dd className="text-[#D9B86C]">{formatPrice(item.total || 0, order.currency_code || null)}</dd></div>)}
          <div className="flex justify-between gap-6 border-t border-[rgba(241,232,216,.08)] py-5 font-serif text-xl text-[#F1E8D8]"><dt>Total paid</dt><dd className="text-[#D9B86C]">{formatPrice(order.total || 0, order.currency_code || null)}</dd></div>
        </dl>
        {address && <p className="mt-5 text-xs font-light leading-relaxed text-[rgba(241,232,216,.62)]">Delivery to {address.city}{address.postal_code ? ` · ${address.postal_code}` : ""}</p>}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href={`/orders/${order.id}`} className="btn-foil"><span className="btn-label">View Order</span></Link><Link href="/collection" className="btn-quiet">Continue Shopping</Link></div>
      </motion.section>
    </div>
  );
}

export default function SuccessPage() { return <Suspense fallback={null}><SuccessContent /></Suspense>; }

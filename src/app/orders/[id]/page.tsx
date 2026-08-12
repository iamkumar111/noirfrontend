"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "@/components/transitions/LuxuryLink"
import { useStore } from "@/store/useStore"
import {
  formatReservationTotal,
  getReservationById,
  type ReservationStatus,
} from "@/lib/reservations"

function statusClass(status: ReservationStatus) {
  if (status === "Payment Pending") {
    return "border-[rgba(184,138,59,0.3)] bg-[rgba(184,138,59,0.06)] text-[rgba(241,232,216,0.72)]"
  }
  if (status === "Preparing" || status === "Dispatched") {
    return "border-[rgba(200,164,93,0.34)] bg-[rgba(200,164,93,0.08)] text-[#D9B86C]"
  }
  return "border-[rgba(224,193,122,0.42)] bg-[rgba(224,193,122,0.06)] text-[#E0C17A]"
}

function DetailNotFound() {
  return (
    <div className="section-top flex min-h-screen items-center bg-[#050403] px-5 pb-24 md:px-6">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow text-[#D9B86C]">Member History</p>
        <h1 className="mt-5 font-serif text-4xl text-[#F1E8D8] md:text-5xl">Reservation Not Found</h1>
        <p className="mt-5 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">
          This reservation could not be found in your member history.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/orders" className="btn-quiet min-h-12">Back to reservations</Link>
          <Link href="/collection" className="btn-foil min-h-12"><span className="btn-label">Return to collection</span></Link>
        </div>
      </div>
    </div>
  )
}

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, hasHydrated } = useStore()
  const router = useRouter()
  const reservation = getReservationById(id)

  useEffect(() => {
    if (hasHydrated && !user) router.replace(`/login?redirect=/orders/${id}`)
  }, [hasHydrated, id, router, user])

  if (!hasHydrated || !user) return null
  if (!reservation) return <DetailNotFound />

  return (
    <div className="section-top relative z-10 min-h-screen overflow-hidden bg-[#050403] px-5 pb-24 md:px-6 md:pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_58%_at_72%_0%,rgba(45,31,18,0.55)_0%,#050403_62%)]" />

      <main className="relative z-20 mx-auto max-w-6xl">
        <header className="border-b border-[rgba(200,164,93,0.22)] pb-9 md:pb-12">
          <Link href="/orders" className="reservation-details-link mb-7" aria-label="Back to reservations">
            <span>Back to reservations</span>
          </Link>
          <p className="eyebrow text-[#D9B86C]">Member History</p>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl text-[#F1E8D8] md:text-6xl">Reservation Details</h1>
              <p className="mt-4 font-mono text-sm tracking-[0.16em] text-[rgba(241,232,216,0.72)]">{reservation.id}</p>
            </div>
            <span className={`w-fit border px-3 py-2 text-[9px] uppercase tracking-[0.14em] ${statusClass(reservation.status)}`}>
              {reservation.status}
            </span>
          </div>
        </header>

        <div className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
          <section className="lg:col-span-7" aria-labelledby="reservation-items-title">
            <div className="border-t border-[rgba(200,164,93,0.3)]">
              <div className="flex items-baseline justify-between gap-6 border-b border-[rgba(241,232,216,0.09)] py-4">
                <h2 id="reservation-items-title" className="font-serif text-3xl text-[#F1E8D8]">Private Selection</h2>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[rgba(241,232,216,0.58)]">{reservation.date}</p>
              </div>
              {reservation.items.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_auto] gap-6 border-b border-[rgba(241,232,216,0.09)] py-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#F1E8D8]">{item.name}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[rgba(241,232,216,0.58)]">Quantity {item.quantity}</p>
                  </div>
                  <p className="self-center text-base text-[#D9B86C]">{formatReservationTotal(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>

            <section className="mt-12" aria-labelledby="timeline-title">
              <p className="eyebrow text-[#D9B86C]">Reservation Timeline</p>
              <h2 id="timeline-title" className="mt-4 font-serif text-3xl text-[#F1E8D8]">Release progress</h2>
              <ol className="mt-7 border-t border-[rgba(200,164,93,0.25)]">
                {reservation.timeline.map((entry) => (
                  <li key={`${entry.label}-${entry.date}`} className="grid gap-2 border-b border-[rgba(241,232,216,0.09)] py-5 sm:grid-cols-[10rem_1fr] sm:gap-7">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#D9B86C]">{entry.date}</p>
                    <div><h3 className="text-sm text-[#F1E8D8]">{entry.label}</h3><p className="mt-2 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.7)]">{entry.note}</p></div>
                  </li>
                ))}
              </ol>
            </section>
          </section>

          <aside className="space-y-8 lg:col-span-5" aria-label="Reservation summary">
            <section className="border border-[rgba(200,164,93,0.22)] bg-[rgba(13,11,9,0.78)] p-6 md:p-8">
              <h2 className="border-b border-[rgba(241,232,216,0.09)] pb-4 font-serif text-3xl text-[#F1E8D8]">Reservation Summary</h2>
              <dl className="space-y-4 pt-6 text-sm">
                <div className="flex justify-between gap-5 text-[rgba(241,232,216,0.72)]"><dt>Subtotal</dt><dd>{formatReservationTotal(reservation.subtotal)}</dd></div>
                <div className="flex justify-between gap-5 text-[rgba(241,232,216,0.72)]"><dt>Shipping</dt><dd>{reservation.shipping ? formatReservationTotal(reservation.shipping) : "Complimentary"}</dd></div>
                <div className="flex justify-between gap-5 text-[rgba(241,232,216,0.72)]"><dt>Tax</dt><dd>{formatReservationTotal(reservation.tax)}</dd></div>
                <div className="flex justify-between gap-5 border-t border-[rgba(241,232,216,0.09)] pt-5 font-serif text-2xl text-[#F1E8D8]"><dt>Total</dt><dd className="text-[#D9B86C]">{formatReservationTotal(reservation.total)}</dd></div>
              </dl>
            </section>

            <section className="border-t border-[rgba(200,164,93,0.26)] pt-6">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#D9B86C]">Payment</p>
              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1">
                <div><p className="text-[rgba(241,232,216,0.56)]">Status</p><p className="mt-1 text-[#F1E8D8]">{reservation.paymentStatus}</p></div>
                <div><p className="text-[rgba(241,232,216,0.56)]">Method</p><p className="mt-1 text-[#F1E8D8]">{reservation.paymentMethod}</p></div>
              </div>
            </section>

            {reservation.deliveryAddress && (
              <section className="border-t border-[rgba(200,164,93,0.26)] pt-6">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#D9B86C]">Delivery Address</p>
                <address className="mt-4 not-italic text-sm font-light leading-relaxed text-[rgba(241,232,216,0.74)]">
                  {reservation.deliveryAddress.map((line) => <span key={line} className="block">{line}</span>)}
                </address>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}

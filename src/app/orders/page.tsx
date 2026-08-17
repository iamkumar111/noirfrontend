"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Link from '@/components/transitions/LuxuryLink';
import { formatReservationTotal, getReservations } from '@/lib/reservations';

export default function OrdersPage() {
  const { user, hasHydrated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push('/login');
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;
  const reservations = getReservations();

  return (
    <div className="min-h-screen bg-[#020202] section-top pb-24 md:pb-40 px-5 md:px-6 relative noise-bg z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1a1511_0%,_#020202_40%)] opacity-50 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-20">
        <div className="mb-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] block mb-4">Member History</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E8E1D5] mb-4 tracking-tight">Your Reservations</h1>
        </div>

        <div className="space-y-8">
          {reservations.map((order) => (
            <div key={order.id} className="reservation-card bg-[#050505] p-8 md:p-10 metallic-border flex flex-col md:flex-row justify-between gap-8 md:items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-lg text-[#E8E1D5] tracking-widest">{order.id}</span>
                  <span className="text-[8px] uppercase tracking-[0.2em] px-2 py-1 bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20">{order.status}</span>
                </div>
                <div className="text-xs text-[#E8E1D5]/40 font-light tracking-wide mb-6">{order.date}</div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.name} className="text-sm text-[#E8E1D5]/70 font-light tracking-wide">{item.name}</div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:items-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C]/60 mb-2">Total</span>
                <span className="text-2xl font-serif text-[#C9A45C] mb-3">{formatReservationTotal(order.total)}</span>
                <Link
                  href={`/orders/${order.id}`}
                  className="reservation-details-link"
                  aria-label={`View details for reservation ${order.id}`}
                >
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function AdminPage() {
  // Frontend admin demo is mock-only. Real Medusa admin is available at /app in backend.
  const { user, hasHydrated, products } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user || user.role !== 'admin') return null;

  const waitlist = [
    { name: 'A Sharma', city: 'Delhi', collection: 'Curated Gift Box' },
    { name: 'R Mehta', city: 'Jaipur', collection: 'Coated Almonds' },
    { name: 'K Verma', city: 'Mumbai', collection: 'Corporate Gifting' },
    { name: 'S Khan', city: 'Lucknow', collection: 'Makhana Tins' }
  ];

  const reservations = [
    { id: 'NOIR-OAK-001', user: 'Premium User', product: 'Curated Collection Box', status: 'Reservation Confirmed' },
    { id: 'NOIR-OAK-002', user: 'VIP User', product: 'Dark Chocolate Coated Almonds', status: 'Payment Pending' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] section-top pb-24 md:pb-40 px-5 md:px-6 relative noise-bg z-10">
      <div className="max-w-7xl mx-auto relative z-20">
        
        <div className="mb-20 flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] block mb-4">Admin Area</span>
            <h1 className="text-4xl font-serif text-[#E8E1D5] tracking-tight">Reservation Control</h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#E8E1D5]/40 font-light tracking-wide uppercase">Lot 1 Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Total VIP Leads', value: '4' },
            { label: 'Reservations', value: '2' },
            { label: 'Mock Revenue', value: '₹3,398' },
            { label: 'Top Request', value: 'Gift Box' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#050505] p-8 metallic-border">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#C9A45C]/60 block mb-4">{stat.label}</span>
              <span className="text-3xl font-serif text-[#E8E1D5]">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Waitlist */}
          <div className="bg-[#050505] p-10 metallic-border">
             <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] mb-8 border-b border-white/5 pb-4">VIP Waitlist</h3>
             <div className="space-y-4">
               {waitlist.map((w, i) => (
                 <div key={i} className="flex justify-between items-center text-sm font-light border-b border-white/5 pb-4">
                   <div className="text-[#E8E1D5]">{w.name} <span className="text-[#E8E1D5]/40 ml-2">({w.city})</span></div>
                   <div className="text-[#C9A45C] text-xs">{w.collection}</div>
                 </div>
               ))}
             </div>
          </div>

          {/* Reservations */}
          <div className="bg-[#050505] p-10 metallic-border">
             <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] mb-8 border-b border-white/5 pb-4">Reservations</h3>
             <div className="space-y-4">
               {reservations.map((r, i) => (
                 <div key={i} className="flex flex-col gap-2 border-b border-white/5 pb-4">
                   <div className="flex justify-between items-center text-sm font-light">
                     <span className="text-[#E8E1D5] tracking-widest">{r.id}</span>
                     <span className={`text-[8px] uppercase tracking-[0.2em] px-2 py-1 ${r.status === 'Reservation Confirmed' ? 'bg-[#C9A45C]/10 text-[#C9A45C]' : 'bg-white/5 text-[#E8E1D5]/50'}`}>{r.status}</span>
                   </div>
                   <div className="flex justify-between text-xs text-[#E8E1D5]/50">
                     <span>{r.user}</span>
                     <span>{r.product}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-[#050505] p-10 metallic-border overflow-x-auto">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] mb-8 border-b border-white/5 pb-4">Inventory Mock</h3>
          <table className="w-full text-left text-sm font-light border-collapse">
            <thead>
              <tr className="text-[#E8E1D5]/40 text-[9px] uppercase tracking-[0.3em] border-b border-white/5">
                <th className="pb-4 font-normal">Product</th>
                <th className="pb-4 font-normal">Status</th>
                <th className="pb-4 font-normal text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-white/5 group">
                  <td className="py-4 text-[#E8E1D5]">{p.name}</td>
                  <td className="py-4 text-[#C9A45C] text-[10px] uppercase tracking-[0.2em]">{p.status}</td>
                  <td className="py-4 text-[#E8E1D5]/50 text-right">{p.stock ?? 'Managed in Medusa'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

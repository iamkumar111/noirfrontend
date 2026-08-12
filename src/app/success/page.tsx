"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

export default function SuccessPage() {
  const { user, hasHydrated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push('/login');
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;
  const reservationId = `NOIR-OAK-${user.id.slice(-6).toUpperCase().padStart(6, '0')}`;

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center section-top px-5 md:px-6 pb-24 md:pb-32 relative noise-bg z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#020202_70%)] pointer-events-none opacity-80"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-lg bg-[#050505] p-10 md:p-14 relative z-20 shadow-[0_0_80px_rgba(0,0,0,1)] metallic-border text-center"
      >
        <div className="w-20 h-20 border border-[#C9A45C]/30 rounded-full mx-auto mb-10 flex items-center justify-center bg-[#0A0A0A] metallic-border relative overflow-hidden group">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
           >
             <svg className="w-8 h-8 text-[#C9A45C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
             </svg>
           </motion.div>
        </div>

        <h1 className="text-3xl font-serif text-[#C9A45C] mb-4 tracking-tight">Reservation Confirmed</h1>
        <p className="text-sm text-[#E8E1D5]/50 leading-relaxed font-light tracking-wide mb-10">
          Your NOIR & OAK Lot 1 reservation has been successfully recorded. You will receive a member update shortly.
        </p>

        <div className="bg-[#020202] border border-[#C9A45C]/10 p-6 mb-10">
          <span className="text-[8px] uppercase tracking-[0.3em] text-[#C9A45C]/60 block mb-2">Reservation ID</span>
          <span className="font-mono text-[#E8E1D5] tracking-widest text-lg">{reservationId}</span>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/dashboard" className="w-full group relative px-10 py-5 bg-[#0A0A0A] overflow-hidden metallic-border block">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A45C]/0 via-[#C9A45C]/10 to-[#C9A45C]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10 uppercase tracking-[0.3em] text-[10px] font-medium text-[#C9A45C] group-hover:text-[#FDF5E6] transition-colors duration-500">
              View Dashboard
            </span>
          </Link>
          <Link href="/collection" className="text-[9px] uppercase tracking-[0.3em] text-[#E8E1D5]/40 hover:text-[#C9A45C] transition-colors mt-4 inline-block">
            Continue Exploring
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

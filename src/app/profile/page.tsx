"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, hasHydrated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) router.push('/login');
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;

  return (
    <div className="min-h-screen bg-[#030303] section-top pb-24 md:pb-40 px-5 md:px-6 relative noise-bg z-10 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,21,17,0.85) 0%, #030303 60%)' }}
      />
      
      <div className="w-full max-w-4xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-12 border-b border-[rgba(201,164,92,0.12)] pb-10 flex items-end justify-between"
        >
          <div>
            <span className="text-[9px] uppercase tracking-[0.5em] text-[#C9A45C]/60 block mb-5">Identity</span>
            <h1 className="text-4xl md:text-5xl font-serif text-[#F5EBDD] tracking-tight">Member <span className="italic font-light text-[#C9A45C]">Profile</span></h1>
          </div>
          <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.3em] text-[rgba(245,235,221,0.55)] hover:text-[#C9A45C] transition-colors border-b border-transparent hover:border-[#C9A45C] pb-1">
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
           {/* Details Card */}
           <div className="md:col-span-2 p-10 relative overflow-hidden" style={{ background: 'rgba(14,14,14,0.92)', border: '1px solid rgba(201,164,92,0.14)' }}>
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-8 border-b border-[rgba(255,255,255,0.05)] pb-4">Personal Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] uppercase tracking-[0.35em] text-[rgba(245,235,221,0.40)] block mb-1">Full Name</label>
                  <div className="text-lg text-[#F5EBDD] font-light tracking-wide">{user.name}</div>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-[0.35em] text-[rgba(245,235,221,0.40)] block mb-1">Email Address</label>
                  <div className="text-lg text-[#F5EBDD] font-light tracking-wide">{user.email}</div>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-[0.35em] text-[rgba(245,235,221,0.40)] block mb-1">Access Tier</label>
                  <div className="text-sm text-[#C9A45C] font-serif uppercase tracking-widest mt-1">{user.role}</div>
                </div>
              </div>
           </div>

           {/* Settings Placeholder */}
           <div className="p-10 relative overflow-hidden flex flex-col items-center justify-center text-center" style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(201,164,92,0.14)' }}>
              <h3 className="text-sm font-serif text-[#F5EBDD] tracking-wide mb-3">Profile Management</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[rgba(245,235,221,0.40)] leading-relaxed">
                Direct profile edits are currently restricted. Please contact your concierge to update your details or shipping addresses.
              </p>
           </div>
        </motion.div>
      </div>
    </div>
  );
}

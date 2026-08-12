'use client';

import { Lock } from 'lucide-react';
import Link from '@/components/transitions/LuxuryLink';

export default function LockedOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[290px] overflow-hidden border border-[rgba(200,164,93,0.18)] bg-[#0D0B09] p-7 md:p-9">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none opacity-[0.08] blur-lg">{children}</div>
      <div className="relative z-10 flex min-h-[230px] flex-col justify-between">
        <Lock className="text-[#D9B86C]" size={20} strokeWidth={1.25} />
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-[#D9B86C]">Member Preview</p>
          <h2 className="mt-3 font-serif text-3xl text-[#F1E8D8]">Price and reserve access</h2>
          <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-[rgba(241,232,216,0.74)]">Enter The Vault to view the Lot 1 price and place a pre-paid reservation.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/login" className="btn-foil"><span className="btn-label">Enter The Vault</span></Link>
            <Link href="/vip-access" className="btn-quiet">Request VIP Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

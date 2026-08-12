'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useLuxuryNavigation } from '@/hooks/useLuxuryNavigation';

const BENEFITS = [
  ['Member price preview', 'View Lot 1 prices before placing a reservation.'],
  ['First release note', 'Receive the confirmed opening date and product list.'],
  ['Reserved collection', 'Use pre-paid access for available Lot 1 pieces.'],
];

export default function VIPAccessPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const login = useStore((state) => state.login);
  const { navigate } = useLuxuryNavigation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // TODO: connect VIP leads to Medusa custom module or external CRM.
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus('submitting');
    window.setTimeout(() => {
      login({
        id: `temp-${Date.now()}`,
        name: String(data.get('name') || 'Preview Guest'),
        email: String(data.get('email') || 'preview@noiroak.com'),
        role: 'vip',
        city: String(data.get('city') || ''),
        phone: String(data.get('phone') || ''),
      });
      setStatus('success');
    }, 1100);
  };

  return (
    <div className="section-top relative z-10 min-h-screen overflow-hidden bg-transparent px-5 pb-24 md:px-6 md:pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(26,21,17,0.78)_0%,#050403_62%)]" />
      <div className="relative z-20 mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-16">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }} className="md:col-span-5 md:pt-12">
          <p className="eyebrow mb-5 text-[#D9B86C]">Lot 1 member preview</p>
          <h1 className="font-serif text-[2.8rem] leading-[1.04] text-[#F1E8D8] md:text-6xl">Request VIP <span className="font-light italic text-[#D9B86C]">Access</span></h1>
          <p className="mt-6 text-base font-light leading-relaxed text-[rgba(241,232,216,0.8)]">Join the first-release list for coated almonds, makhana tins and curated gifting boxes. This is a preview request, not a newsletter subscription.</p>

          <dl className="mt-10 border-t border-[rgba(200,164,93,0.28)]">
            {BENEFITS.map(([title, description], index) => (
              <div key={title} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-[rgba(241,232,216,0.08)] py-5">
                <dt className="font-serif text-lg text-[#D9B86C]">0{index + 1}</dt>
                <dd><h2 className="font-serif text-xl text-[#F1E8D8]">{title}</h2><p className="mt-1 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.7)]">{description}</p></dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.64)]">Lot 1 is pre-paid only. Cash on Delivery is unavailable for member reservations.</p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.08 }} className="border border-[rgba(200,164,93,0.22)] bg-[#171512]/95 p-6 md:col-span-7 md:p-10 lg:p-12">
          {status === 'success' ? (
            <div role="status" className="flex min-h-[520px] flex-col justify-center">
              <p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Request received</p>
              <h2 className="mt-4 font-serif text-4xl text-[#F1E8D8]">Member Preview is ready.</h2>
              <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-[rgba(241,232,216,0.76)]">Your request has been recorded and temporary preview access is active for this session.</p>
              <button type="button" onClick={() => navigate('/collection')} className="btn-foil mt-8 w-fit"><span className="btn-label">View Member Preview</span></button>
            </div>
          ) : (
            <>
              <p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Access details</p>
              <h2 className="mt-3 font-serif text-3xl text-[#F1E8D8]">Tell us where to send the release note.</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div><label htmlFor="vip-name" className="form-label">Name *</label><input id="vip-name" name="name" required autoComplete="name" className="luxury-input" /></div>
                  <div><label htmlFor="vip-email" className="form-label">Email *</label><input id="vip-email" name="email" required type="email" autoComplete="email" className="luxury-input" /></div>
                  <div><label htmlFor="vip-phone" className="form-label">WhatsApp *</label><input id="vip-phone" name="phone" required type="tel" autoComplete="tel" className="luxury-input" /></div>
                  <div><label htmlFor="vip-city" className="form-label">City *</label><input id="vip-city" name="city" required autoComplete="address-level2" className="luxury-input" /></div>
                </div>
                <div><label htmlFor="vip-collection" className="form-label">Preferred Collection</label><select id="vip-collection" name="collection" defaultValue="" className="luxury-select"><option value="">No preference</option><option>Coated Almonds</option><option>Makhana Tins</option><option>Curated Gift Boxes</option><option>Corporate Gifting</option></select></div>
                <div><label htmlFor="vip-message" className="form-label">Message</label><textarea id="vip-message" name="message" rows={3} className="luxury-input resize-none" placeholder="Optional gifting or collection note" /></div>
                <button type="submit" disabled={status === 'submitting'} className="btn-foil w-full disabled:opacity-55"><span className="btn-label">{status === 'submitting' ? 'Recording request' : 'Request VIP Access'}</span></button>
                <p className="text-xs font-light leading-relaxed text-[rgba(241,232,216,0.62)]">We use these details only for your access request and NOIR &amp; OAK release notes.</p>
              </form>
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}

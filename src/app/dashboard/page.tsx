'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from '@/components/transitions/LuxuryLink';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/store/useStore';

export default function DashboardPage() {
  const { user, hasHydrated, products } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) router.replace('/login?redirect=/dashboard');
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;

  const memberNumber = `NOA-${user.id.slice(-4).padStart(4, '0')}-${user.role.toUpperCase().slice(0, 1)}`;
  const memberTier = user.role === 'admin' ? 'House Access' : user.role === 'premium' ? 'Premium Member' : 'VIP Member';
  const featured = products.find((product) => product.id === 'curated-collection-box') || products[0];
  const preview = products.filter((product) => ['dark-chocolate-almonds', 'parmesan-makhana', 'pink-salt-makhana'].includes(product.id));

  return (
    <div className="section-top relative z-10 min-h-screen overflow-hidden bg-transparent px-5 pb-24 md:px-6 md:pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(26,21,17,0.78)_0%,#050403_58%)]" />
      <div className="relative z-20 mx-auto max-w-7xl">
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }} className="grid gap-8 border-b border-[rgba(200,164,93,0.2)] pb-10 md:grid-cols-12 md:items-end md:pb-14">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5 text-[#D9B86C]">Member Preview</p>
            <h1 className="font-serif text-[2.8rem] leading-[1.04] text-[#F1E8D8] md:text-7xl">The <span className="font-light italic text-[#D9B86C]">Vault</span></h1>
            <p className="mt-5 text-base font-light text-[rgba(241,232,216,0.74)]">Welcome back, {user.name}. Lot 1 pricing and pre-paid reservations are available in this session.</p>
          </div>
          <div className="md:col-span-5">
            <div className="relative overflow-hidden border border-[rgba(200,164,93,0.25)] bg-[linear-gradient(135deg,#0F0E0C_0%,#1A120B_52%,#090806_100%)] p-6">
              <p className="font-serif text-lg tracking-[0.12em] text-[#D9B86C]">NOIR &amp; OAK</p>
              <div className="mt-8 flex items-end justify-between gap-4">
                <div><p className="text-[9px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.58)]">Member</p><p className="mt-1 font-serif text-xl text-[#F1E8D8]">{user.name}</p><p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.55)]">{memberNumber}</p></div>
                <p className="border border-[rgba(200,164,93,0.24)] px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-[#D9B86C]">{memberTier}</p>
              </div>
            </div>
          </div>
        </motion.header>

        <section className="py-16 md:py-24">
          <div className="mb-10 grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7"><p className="eyebrow mb-4 text-[#D9B86C]">Featured Lot 1 piece</p><h2 className="font-serif text-4xl text-[#F1E8D8] md:text-5xl">The numbered gifting vault.</h2></div>
            <p className="text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)] md:col-span-4 md:col-start-9">A mixed tasting selection with a fitted insert and numbered batch card.</p>
          </div>
          <div className="grid gap-9 lg:grid-cols-12">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-7">{featured ? <ProductCard product={featured} /> : <div className="h-96 animate-pulse border border-[rgba(200,164,93,0.18)] bg-[#0D0B09]" />}</motion.div>
            <div className="lg:col-span-5">
              <div className="border-t border-[rgba(200,164,93,0.28)]">
                {preview.map((product) => (
                  <Link key={product.id} href={`/product/${product.slug}`} className="block border-b border-[rgba(241,232,216,0.08)] py-6">
                    <div className="flex items-baseline justify-between gap-5"><h3 className="font-serif text-xl text-[#F1E8D8]">{product.name}</h3><span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-[#D9B86C]">{product.batchCode}</span></div>
                    <p className="mt-3 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">{product.finish}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[rgba(241,232,216,0.58)]"><span>{product.weight}</span><span>{product.packaging}</span></div>
                  </Link>
                ))}
              </div>
              <Link href="/collection" className="btn-quiet mt-7">View full Member Preview</Link>
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-y border-[rgba(200,164,93,0.2)] py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <p className="eyebrow mb-4 text-[#D9B86C]">Reservation ledger</p>
            <h2 className="font-serif text-4xl text-[#F1E8D8]">Current status</h2>
            <p className="mt-5 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.68)]">Demo reservations are shown here until a live order service is connected.</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            {[
              ['Dark Chocolate Coated Almonds', 'DC-001', 'Confirmed', 'Fulfilment within 3–5 working days'],
              ['The Curated Collection Box', 'GB-001', 'Preparing', 'Numbered batch card being assigned'],
            ].map(([name, batch, status, note]) => (
              <div key={batch} className="grid gap-3 border-b border-[rgba(241,232,216,0.08)] py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div><h3 className="font-serif text-xl text-[#F1E8D8]">{name}</h3><p className="mt-2 text-xs text-[rgba(241,232,216,0.62)]">{batch} / {note}</p></div>
                <span className="w-fit border border-[rgba(200,164,93,0.24)] px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-[#D9B86C]">{status}</span>
              </div>
            ))}
            <Link href="/orders" className="mt-6 inline-block border-b border-[#D9B86C]/35 pb-1 text-[10px] uppercase tracking-[0.12em] text-[#D9B86C]">View reservations</Link>
          </div>
        </section>

        <section className="grid gap-8 py-14 md:grid-cols-12 md:items-center md:py-20">
          <div className="md:col-span-7"><p className="eyebrow mb-4 text-[#D9B86C]">Member assistance</p><h2 className="font-serif text-4xl text-[#F1E8D8]">Need a gifting quantity or delivery check?</h2><p className="mt-4 text-sm font-light text-[rgba(241,232,216,0.7)]">Share the occasion, city and preferred collection with the gifting team.</p></div>
          <div className="flex flex-wrap gap-4 md:col-span-4 md:col-start-9"><Link href="/gifting" className="btn-foil"><span className="btn-label">Gifting request</span></Link><Link href="/contact" className="btn-quiet">Contact</Link></div>
        </section>
      </div>
    </div>
  );
}

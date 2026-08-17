'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import AnimatedLogoAura from '@/components/AnimatedLogoAura';
import { useStore } from '@/store/useStore';

const FILTERS = ['All', 'Coated Almonds', 'Makhana Tins', 'Gift Boxes', 'Corporate', 'Member Preview'] as const;
type Filter = (typeof FILTERS)[number];

export default function CollectionPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const products = useStore((state) => state.products);
  const catalogStatus = useStore((state) => state.catalogStatus);
  const catalogError = useStore((state) => state.catalogError);

  const filteredProducts = useMemo(() => {
    if (filter === 'All') return products;
    if (filter === 'Corporate') return products.filter((product) => product.giftingUse.toLowerCase().includes('corporate') || product.giftingUse.toLowerCase().includes('client'));
    if (filter === 'Member Preview') return products.filter((product) => product.isPrivate || product.status === 'Member Preview');
    return products.filter((product) => product.category === filter);
  }, [filter, products]);

  return (
    <div className="section-top relative z-10 min-h-screen overflow-hidden bg-transparent px-5 pb-24 md:px-6 md:pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_65%_0%,rgba(26,21,17,0.72)_0%,#050403_62%)]" />
      <AnimatedLogoAura position="right" opacity={0.045} />

      <div className="relative z-20 mx-auto max-w-7xl">
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }} className="grid gap-7 border-b border-[rgba(200,164,93,0.2)] pb-9 md:grid-cols-12 md:items-end md:pb-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5 text-[#D9B86C]">Lot 1 collection</p>
            <h1 className="font-serif text-[2.8rem] leading-[1.05] text-[#F1E8D8] md:text-7xl">The <span className="font-light italic text-[#D9B86C]">Collection</span></h1>
          </div>
          <div className="md:col-span-5 md:pb-1">
            <p className="max-w-xl text-sm font-light leading-relaxed text-[rgba(241,232,216,0.8)] md:text-base">Gold-sealed makhana tins, pure couverture coated almonds and gift-ready boxes prepared for the first member preview.</p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-[rgba(241,232,216,0.58)]">Prices unlock inside the member preview</p>
          </div>
        </motion.header>

        <div className="-mx-5 overflow-x-auto px-5 hide-scrollbar md:mx-0 md:px-0">
          <div role="toolbar" aria-label="Filter collection" className="flex min-w-max gap-2 py-7 md:gap-3 md:py-9">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={`min-h-11 shrink-0 border px-4 text-[10px] uppercase tracking-[0.12em] transition-colors ${filter === item ? 'border-[#D9B86C] bg-[rgba(200,164,93,0.09)] text-[#E0C17A]' : 'border-[rgba(200,164,93,0.2)] text-[rgba(241,232,216,0.7)] hover:border-[#D9B86C]/55 hover:text-[#F1E8D8]'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between border-b border-[rgba(241,232,216,0.08)] pb-4">
          <p className="font-serif text-2xl text-[#F1E8D8]">{filter}</p>
          <p aria-live="polite" className="text-[10px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.58)]">{filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}</p>
        </div>

        {catalogStatus === 'loading' && products.length === 0 && (
          <div aria-label="Loading private collection" className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-[560px] animate-pulse border border-[rgba(200,164,93,0.14)] bg-[linear-gradient(180deg,#171512_0%,#0D0C0A_100%)]">
                <div className="h-2/3 bg-[radial-gradient(ellipse_at_50%_45%,rgba(200,164,93,0.08)_0%,transparent_68%)]" />
                <div className="mx-6 mt-7 h-px bg-[rgba(200,164,93,0.18)]" />
              </div>
            ))}
          </div>
        )}

        {catalogError && catalogStatus !== 'loading' && (
          <div role="status" className="mb-8 border-l border-[#D9B86C]/45 bg-[#0D0B09] px-5 py-4 text-sm font-light text-[rgba(241,232,216,0.76)]">
            {catalogError}
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {catalogStatus === 'ready' && filteredProducts.length === 0 && (
          <div className="border-t border-[rgba(200,164,93,0.2)] py-16">
            <p className="font-serif text-2xl text-[#F1E8D8]">No Lot 1 pieces match this view.</p>
            <button type="button" onClick={() => setFilter('All')} className="mt-5 border-b border-[#D9B86C]/35 pb-1 text-[10px] uppercase tracking-[0.14em] text-[#D9B86C]">View all pieces</button>
          </div>
        )}
      </div>
    </div>
  );
}

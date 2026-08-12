"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { user, wishlist, hasHydrated, products } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) router.push('/login');
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  const suggestedProducts = products.filter(p => !wishlist.includes(p.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#030303] section-top pb-24 md:pb-40 px-5 md:px-6 relative noise-bg z-10 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(26,21,17,0.75) 0%, #030303 55%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-16 border-b border-[rgba(201,164,92,0.12)] pb-10"
        >
          <span className="text-[9px] uppercase tracking-[0.5em] text-[#C9A45C]/60 block mb-5">Private Selection</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#F5EBDD] tracking-tight">Your Private <span className="italic font-light text-[#C9A45C]">Wishlist</span></h1>
        </motion.div>

        {wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1 }}
          >
            {/* Empty state */}
            <div
              className="text-center py-24 mb-24 relative overflow-hidden"
              style={{ background: 'rgba(14,14,14,0.88)', border: '1px solid rgba(201,164,92,0.16)' }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,164,92,0.08) 0%, transparent 70%)' }}
              />
              {/* Decorative vault icon */}
              <div className="w-16 h-20 mx-auto mb-10 flex items-center justify-center relative" style={{ border: '1px solid rgba(201,164,92,0.22)' }}>
                <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-[#C9A45C]/50 to-transparent" />
                <div
                  className="absolute bottom-0 w-full h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,92,0.40), transparent)' }}
                />
              </div>
              <p className="text-2xl font-serif text-[#F5EBDD] italic font-light mb-4 relative z-10">
                Your private selection awaits.
              </p>
              <p className="text-sm text-[rgba(245,235,221,0.45)] font-light tracking-wide max-w-md mx-auto mb-10 leading-relaxed relative z-10">
                Browse the vault and save your preferred pieces here. Your wishlist is visible only to you.
              </p>
              <Link
                href="/collection"
                className="group relative inline-flex items-center gap-3 px-10 py-5 overflow-hidden"
                style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(201,164,92,0.32)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#C9A45C]/0 via-[#C9A45C]/10 to-[#C9A45C]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 uppercase tracking-[0.3em] text-[10px] font-medium text-[#C9A45C] group-hover:text-[#FDF5E6] transition-colors duration-400">
                  Explore The Vault
                </span>
                <span className="relative z-10 text-[#C9A45C] text-xs">&#8594;</span>
              </Link>
            </div>

            {/* Suggested collections */}
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] w-6 bg-[#C9A45C]/40" />
                <span className="text-[9px] uppercase tracking-[0.5em] text-[#C9A45C]/60">Suggested From The Vault</span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[rgba(201,164,92,0.20)] to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suggestedProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.8 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

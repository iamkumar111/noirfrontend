"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center section-top px-5 md:px-6 pb-24 relative noise-bg overflow-hidden">
      {/* Ambient BG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,164,92,0.04) 0%, #030303 70%)' }}
      />
      {/* Large faded text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-serif text-[30vw] font-light leading-none tracking-tighter"
          style={{ color: 'rgba(201,164,92,0.025)' }}
        >
          404
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="text-center relative z-10 max-w-lg mx-auto"
      >
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-12 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,92,0.50))' }} />
          <span className="text-[9px] uppercase tracking-[0.6em] text-[#C9A45C]/60">Lost In The Vault</span>
          <div className="w-12 h-[1px]" style={{ background: 'linear-gradient(90deg, rgba(201,164,92,0.50), transparent)' }} />
        </div>

        {/* Vault icon */}
        <div className="w-16 h-20 mx-auto mb-12 flex items-center justify-center relative"
          style={{ border: '1px solid rgba(201,164,92,0.25)' }}
        >
          <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-[#C9A45C]/60 to-transparent" />
          <div className="absolute top-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,92,0.50), transparent)' }} />
          <div className="absolute bottom-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,164,92,0.50), transparent)' }} />
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-[#F5EBDD] mb-6 leading-[1.15] tracking-tight">
          This Room Is <span className="italic font-light text-[#C9A45C]">Sealed.</span>
        </h1>
        <p className="text-[rgba(245,235,221,0.52)] text-base font-light leading-relaxed tracking-wide mb-14">
          The page you are looking for has been moved, restricted, or does not exist within the private vault. You may still access the collection below.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            href="/"
            className="group relative px-10 py-5 overflow-hidden inline-block"
            style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(201,164,92,0.35)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C9A45C]/0 via-[#C9A45C]/10 to-[#C9A45C]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 uppercase tracking-[0.3em] text-[10px] font-medium text-[#C9A45C] group-hover:text-[#FDF5E6] transition-colors duration-400">
              Return Home
            </span>
          </Link>
          <Link
            href="/collection"
            className="group relative px-10 py-5 overflow-hidden inline-block"
            style={{ border: '1px solid rgba(201,164,92,0.18)' }}
          >
            <span className="uppercase tracking-[0.3em] text-[10px] font-medium text-[rgba(245,235,221,0.55)] group-hover:text-[#C9A45C] transition-colors duration-400">
              Browse The Vault
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

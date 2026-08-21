"use client";

import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import type { CartItem } from '@/lib/medusa/types';
import { useLuxuryNavigation } from '@/hooks/useLuxuryNavigation';
import { formatPrice } from '@/lib/medusa/products';

export default function CartDrawer() {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const cart = useStore((state) => state.cart);
  const medusaCart = useStore((state) => state.medusaCart);
  const cartMode = useStore((state) => state.cartMode);
  const cartStatus = useStore((state) => state.cartStatus);
  const cartError = useStore((state) => state.cartError);
  const user = useStore((state) => state.user);
  const { navigate } = useLuxuryNavigation();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;
  const currencyCode = medusaCart?.currency_code || (cartMode === 'demo' ? 'inr' : null);

  const handleCheckout = () => {
    setCartOpen(false);
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="cart-backdrop fixed inset-0 bg-[#020202]/80 z-[70]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] border-l border-[#C9A45C]/10 z-[80] flex flex-col noise-bg shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            <div className="flex justify-between items-center p-5 sm:p-8 border-b border-white/5 relative z-10">
              <div>
                <span className="block text-xl font-serif tracking-[0.08em] text-[#C9A45C] font-light">Your Cart</span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-[rgba(241,232,216,0.58)]">Review your items before checkout</span>
              </div>
              <button aria-label="Close cart" onClick={() => setCartOpen(false)} className="h-11 w-11 flex items-center justify-center text-[#E8E1D5]/65 hover:text-[#C9A45C] transition-colors">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-8 relative z-10 hide-scrollbar">
              {cartStatus === 'loading' && cart.length === 0 ? (
                <div aria-label="Loading cart" className="space-y-7 pt-4">
                  {[0, 1].map((item) => <div key={item} className="h-28 animate-pulse border border-[rgba(200,164,93,0.12)] bg-[linear-gradient(90deg,#0D0B09,#171512,#0D0B09)]" />)}
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-[rgba(241,232,216,0.58)] mb-5 tracking-[0.14em] text-[10px] uppercase">Your cart is empty</span>
                  <p className="text-xl font-serif text-[rgba(241,232,216,0.72)] font-light">Something exceptional may still be waiting.</p>
                  <button 
                    onClick={() => { setCartOpen(false); navigate('/collection'); }}
                    className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] border-b border-[#C9A45C]/30 pb-1 hover:border-[#C9A45C] transition-colors"
                  >
                    Shop products
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => <CartLine key={item.id} item={item} currencyCode={currencyCode} />)}
                </div>
              )}

              {cartError && <p role="status" className="mt-6 border-l border-[#D9B86C]/40 pl-4 text-xs font-light leading-relaxed text-[rgba(241,232,216,0.72)]">{cartError}</p>}

              {cart.length > 0 && <p className="mt-10 border-l border-[#D9B86C]/35 pl-5 text-xs font-light leading-relaxed text-[rgba(217,208,192,0.68)]">Secure payment is available at checkout.</p>}
            </div>

            {cart.length > 0 && (
              <div className="p-5 sm:p-8 border-t border-white/5 bg-[#0D0B09] relative z-10">
                <div className="flex justify-between mb-3 text-sm text-[rgba(241,232,216,0.72)] font-light tracking-wider">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currencyCode)}</span>
                </div>
                <div className="flex justify-between mb-8 text-sm text-[rgba(241,232,216,0.72)] font-light tracking-wider border-b border-white/5 pb-6">
                  <span>Shipping</span>
                  <span className="text-[#D9B86C]">Calculated at checkout</span>
                </div>
                <div className="flex justify-between mb-8 text-2xl font-serif text-[#F1E8D8] tracking-wide">
                  <span>Total</span>
                  <span className="text-[#D9B86C]">{formatPrice(total, currencyCode)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full group relative px-10 py-5 bg-[#0A0A0A] overflow-hidden metallic-border block"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C9A45C]/0 via-[#C9A45C]/10 to-[#C9A45C]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative z-10 uppercase tracking-[0.3em] text-[10px] font-medium text-[#C9A45C] group-hover:text-[#FDF5E6] transition-colors duration-500 text-center w-full block">
                    Checkout
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const CartLine = memo(function CartLine({ item, currencyCode }: { item: CartItem; currencyCode: string | null }) {
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const max = item.maxQuantity ?? Number.POSITIVE_INFINITY;
  const change = useCallback((delta: number) => void updateQuantity(item.id, item.quantity + delta), [item.id, item.quantity, updateQuantity]);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }} className="flex gap-6 items-center">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-[rgba(200,164,93,0.16)] bg-[#0a0a0a] shadow-lg">
        {item.image ? <Image src={item.image} alt="" fill sizes="80px" className="object-contain p-2" /> : <div className="absolute inset-0 opacity-40" style={{ background: item.imagePlaceholder }} />}
      </div>
      <div className="flex-1">
        <h4 className="mb-1 font-serif text-lg leading-tight font-light text-[#E8E1D5]">{item.name}</h4>
        <p className="mb-1 text-[9px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.58)]">{item.batchCode || 'Lot 1'} {item.weight ? ` / ${item.weight}` : ''}</p>
        {item.packaging && <p className="mb-3 text-[11px] leading-snug text-[rgba(241,232,216,0.68)]">{item.packaging}</p>}
        <p className="mb-4 text-sm font-light text-[#C9A45C]">{formatPrice(item.price, currencyCode)}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border border-white/10 px-1">
            <button type="button" disabled={item.quantity <= 1} aria-label={`Decrease quantity of ${item.name}`} onClick={() => change(-1)} className="h-11 w-11 touch-manipulation text-[#E8E1D5]/65 hover:text-[#C9A45C] disabled:opacity-30"><Minus size={12} className="mx-auto" /></button>
            <span aria-live="polite" className="w-5 text-center text-xs text-[#E8E1D5]">{item.quantity}</span>
            <button type="button" disabled={item.quantity >= max} aria-label={`Increase quantity of ${item.name}`} onClick={() => change(1)} className="h-11 w-11 touch-manipulation text-[#E8E1D5]/65 hover:text-[#C9A45C] disabled:opacity-30"><Plus size={12} className="mx-auto" /></button>
          </div>
          <button type="button" aria-label={`Remove ${item.name}`} onClick={() => void removeFromCart(item.id)} className="ml-auto h-11 w-11 touch-manipulation text-[#E8E1D5]/55 transition-colors hover:text-red-300"><Trash2 size={14} className="mx-auto" strokeWidth={1.5} /></button>
        </div>
      </div>
    </motion.div>
  );
});

"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { useLuxuryNavigation } from '@/hooks/useLuxuryNavigation';
import { formatPrice } from '@/lib/medusa/products';

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cart, medusaCart, cartStatus, cartError, removeFromCart, updateQuantity, user } = useStore();
  const { navigate } = useLuxuryNavigation();

  const subtotal = medusaCart?.subtotal ?? cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = medusaCart?.total ?? subtotal;
  const currencyCode = medusaCart?.currency_code || null;

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
            className="fixed inset-0 bg-[#020202]/80 backdrop-blur-md z-[70]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] border-l border-[#C9A45C]/10 z-[80] flex flex-col noise-bg shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            <div className="flex justify-between items-center p-5 sm:p-8 border-b border-white/5 relative z-10">
              <div>
                <span className="block text-xl font-serif tracking-[0.08em] text-[#C9A45C] font-light">Private Selection</span>
                <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-[rgba(241,232,216,0.58)]">Lot 1 pre-paid reservation</span>
              </div>
              <button aria-label="Close private selection" onClick={() => setCartOpen(false)} className="h-11 w-11 flex items-center justify-center text-[#E8E1D5]/65 hover:text-[#C9A45C] transition-colors">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-8 relative z-10 hide-scrollbar">
              {cartStatus === 'loading' && cart.length === 0 ? (
                <div aria-label="Loading private selection" className="space-y-7 pt-4">
                  {[0, 1].map((item) => <div key={item} className="h-28 animate-pulse border border-[rgba(200,164,93,0.12)] bg-[linear-gradient(90deg,#0D0B09,#171512,#0D0B09)]" />)}
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-[rgba(241,232,216,0.58)] mb-5 tracking-[0.14em] text-[10px] uppercase">No pieces selected</span>
                  <p className="text-xl font-serif text-[rgba(241,232,216,0.72)] font-light">Lot 1 products can be added from the collection.</p>
                  <button 
                    onClick={() => { setCartOpen(false); navigate('/collection'); }}
                    className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] border-b border-[#C9A45C]/30 pb-1 hover:border-[#C9A45C] transition-colors"
                  >
                    View The Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      key={item.id} 
                      className="flex gap-6 items-center"
                    >
                      <div className="w-20 h-24 border border-[rgba(200,164,93,0.16)] bg-[#0a0a0a] shadow-lg relative overflow-hidden shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt="" fill sizes="80px" className="object-contain p-2" />
                        ) : (
                          <div className="absolute inset-0 opacity-40" style={{ background: item.imagePlaceholder }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg leading-tight mb-1 text-[#E8E1D5] font-light">{item.name}</h4>
                        <p className="mb-1 text-[9px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.58)]">{item.batchCode || 'Lot 1'} {item.weight ? ` / ${item.weight}` : ''}</p>
                        {item.packaging && <p className="mb-3 text-[11px] leading-snug text-[rgba(241,232,216,0.68)]">{item.packaging}</p>}
                        <p className="text-[#C9A45C] font-light text-sm mb-4">{formatPrice(item.price, currencyCode)}</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 border border-white/10 px-3 py-1">
                            <button disabled={cartStatus === 'loading'} aria-label={`Decrease quantity of ${item.name}`} onClick={() => void updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="h-7 w-7 flex items-center justify-center text-[#E8E1D5]/65 hover:text-[#C9A45C] disabled:opacity-40">
                              <Minus size={10} />
                            </button>
                            <span className="text-xs text-[#E8E1D5] w-4 text-center">{item.quantity}</span>
                            <button disabled={cartStatus === 'loading'} aria-label={`Increase quantity of ${item.name}`} onClick={() => void updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 flex items-center justify-center text-[#E8E1D5]/65 hover:text-[#C9A45C] disabled:opacity-40">
                              <Plus size={10} />
                            </button>
                          </div>
                          <button disabled={cartStatus === 'loading'} aria-label={`Remove ${item.name}`} onClick={() => void removeFromCart(item.id)} className="h-9 w-9 flex items-center justify-center text-[#E8E1D5]/55 hover:text-red-300 transition-colors ml-auto disabled:opacity-40">
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {cartError && <p role="status" className="mt-6 border-l border-[#D9B86C]/40 pl-4 text-xs font-light leading-relaxed text-[rgba(241,232,216,0.72)]">{cartError}</p>}

              {cart.length > 0 && (
                <div className="mt-10 border-l border-[#D9B86C]/35 pl-5 relative">
                  <div className="flex items-center gap-3 mb-3 text-[#D9B86C] relative z-10">
                    <Lock size={12} strokeWidth={1.5} />
                    <span className="text-[9px] uppercase tracking-[0.16em] font-medium">Reservation note</span>
                  </div>
                  <p className="text-xs text-[rgba(217,208,192,0.68)] leading-relaxed font-light tracking-wide relative z-10">
                    Pre-paid access only. Cash on Delivery is unavailable for Lot 1.
                  </p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 sm:p-8 border-t border-white/5 bg-[#0D0B09] relative z-10">
                <div className="flex justify-between mb-3 text-sm text-[rgba(241,232,216,0.72)] font-light tracking-wider">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currencyCode)}</span>
                </div>
                <div className="flex justify-between mb-8 text-sm text-[rgba(241,232,216,0.72)] font-light tracking-wider border-b border-white/5 pb-6">
                  <span>Shipping</span>
                  <span className="text-[#D9B86C]">Complimentary</span>
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
                    Continue To Reserve Lot 1
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

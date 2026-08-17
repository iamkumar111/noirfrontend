'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from '@/components/transitions/LuxuryLink';
import LockedOverlay from '@/components/LockedOverlay';
import { useStore } from '@/store/useStore';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const user = useStore((state) => state.user);
  const products = useStore((state) => state.products);
  const catalogStatus = useStore((state) => state.catalogStatus);
  const catalogError = useStore((state) => state.catalogError);
  const addToCart = useStore((state) => state.addToCart);
  const addDemoProduct = useStore((state) => state.addDemoProduct);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const wishlist = useStore((state) => state.wishlist);
  const product = products.find((item) => item.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => () => { if (noticeTimer.current) window.clearTimeout(noticeTimer.current); }, []);

  const showNotice = useCallback((message: string) => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2600);
  }, []);

  if (!product) {
    return (
      <div className="section-top flex min-h-screen flex-col items-center justify-center gap-7 bg-[#030303] px-5 text-center">
        <h1 className="font-serif text-3xl font-light text-[#F1E8D8]">{catalogStatus === 'loading' || catalogStatus === 'idle' ? 'Preparing this private piece…' : catalogError || 'This collection is not available in the current release.'}</h1>
        {(catalogStatus === 'loading' || catalogStatus === 'idle') && <div className="h-px w-32 animate-pulse bg-[#D9B86C]/40" />}
        <Link href="/collection" className="border-b border-[#C9A45C]/35 pb-1 text-[10px] uppercase tracking-[0.14em] text-[#C9A45C]">View the collection</Link>
      </div>
    );
  }

  const isSaved = wishlist.includes(product.id);
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 2);
  const facts = [
    ['Finish', product.finish],
    ['Texture', product.texture],
    ['Ingredient note', product.ingredientNote],
    ['Packaging', product.packaging],
    ['Storage', product.storage],
    ['Gifting use', product.giftingUse],
    ['Batch information', `${product.batchNumber}; ${product.releaseStatus}`],
    ['Pairing', product.pairing],
    ['Reservation note', `${product.reserveStatus}; Cash on Delivery unavailable for Lot 1`],
  ];
  const senses = Object.entries(product.sensory) as [keyof typeof product.sensory, string][];

  const handleReserve = async () => {
    if (isReserving) return;
    if (product.source === 'fallback') {
      addDemoProduct(product, quantity);
      showNotice('Added to your demo selection. Continue to the reservation steps.');
      setCartOpen(true);
      return;
    }
    if (!product.variantId || !product.availableForSale) {
      showNotice('This item is preview-only until it is added to the release inventory.');
      return;
    }
    try {
      setIsReserving(true);
      await addToCart(product.variantId, quantity);
      showNotice('Added to private selection.');
      setCartOpen(true);
    } catch {
      showNotice('This piece could not be added to your private selection.');
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="section-top relative z-10 min-h-screen overflow-hidden bg-transparent pb-32 md:pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(26,21,17,0.72)_0%,#050403_58%)]" />

      {notice && (
        <motion.div role="status" aria-live="polite" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 border border-[rgba(200,164,93,0.3)] bg-[#171512] px-5 py-4 text-center text-xs text-[#E0C17A] shadow-2xl lg:bottom-8">
          {notice}
        </motion.div>
      )}

      <div className="relative z-20 mx-auto max-w-7xl px-5 md:px-6">
        <div className="mb-8 flex items-center justify-between border-b border-[rgba(241,232,216,0.08)] pb-4 md:mb-12">
          <Link href="/collection" className="text-[10px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.68)] hover:text-[#D9B86C]">Back to collection</Link>
          <span className="text-[10px] uppercase tracking-[0.12em] text-[#D9B86C]">{product.category}</span>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20 md:mb-28">
          <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85 }}>
            <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(200,164,93,0.18)] bg-[#0D0B09]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,164,92,0.08)_0%,transparent_66%)]" />
              <Image src={product.images[0]} alt={`${product.name} product and packaging`} fill priority sizes="(max-width: 1024px) 92vw, 46vw" className="object-contain p-7 md:p-10" style={{ filter: 'brightness(1.1) contrast(1.04) drop-shadow(0 20px 58px rgba(0,0,0,0.8))' }} />
              <span className="stamp absolute left-4 top-4 z-10 md:left-6 md:top-6">{product.batchCode}</span>
            </div>
            <div className="grid border-x border-b border-[rgba(200,164,93,0.18)] sm:grid-cols-2">
              <div className="p-5 sm:border-r sm:border-[rgba(200,164,93,0.18)]">
                <p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Object</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.76)]">{product.packaging}</p>
              </div>
              <div className="border-t border-[rgba(200,164,93,0.18)] p-5 sm:border-t-0">
                <p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Contents</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.76)]">{product.weight}; batch card included</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85, delay: 0.08 }} className="flex flex-col lg:pt-4">
            <p className="mb-4 text-[10px] uppercase tracking-[0.16em] text-[#D9B86C]">{product.badge}</p>
            <h1 className="font-serif text-[2.75rem] leading-[1.04] text-[#F1E8D8] md:text-6xl">{product.name}</h1>
            <p className="mt-6 text-base font-light leading-[1.8] text-[rgba(241,232,216,0.78)]">{product.longDescription}</p>

            <dl className="mt-8 grid grid-cols-2 border-y border-[rgba(200,164,93,0.18)]">
              <div className="border-r border-[rgba(200,164,93,0.18)] py-4 pr-4"><dt className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Batch</dt><dd className="mt-2 text-sm text-[rgba(241,232,216,0.78)]">{product.batchNumber}</dd></div>
              <div className="py-4 pl-4"><dt className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Availability</dt><dd className="mt-2 text-sm text-[rgba(241,232,216,0.78)]">{product.status}</dd></div>
            </dl>

            <div className="mt-8">
              {user ? (
                <div className="border border-[rgba(200,164,93,0.18)] bg-[#0D0B09] p-6 md:p-7">
                  <div className="flex items-end justify-between gap-5 border-b border-[rgba(241,232,216,0.08)] pb-5">
                    <div><p className="text-[9px] uppercase tracking-[0.14em] text-[rgba(241,232,216,0.6)]">Member price</p><p className="mt-1 font-serif text-3xl text-[#D9B86C]">{product.price || product.lockedPrice}</p></div>
                    <p className="max-w-36 text-right text-xs leading-relaxed text-[rgba(241,232,216,0.62)]">Pre-paid access only</p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-end gap-3">
                    <div>
                      <label htmlFor="quantity" className="mb-2 block text-[9px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.62)]">Quantity</label>
                      <div id="quantity" className="flex h-12 items-center border border-[rgba(200,164,93,0.22)]">
                        <button type="button" disabled={quantity <= 1} aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="h-12 w-11 touch-manipulation text-[#D9B86C] disabled:opacity-30">−</button>
                        <span className="w-8 text-center text-sm text-[#F1E8D8]">{quantity}</span>
                        <button type="button" disabled={product.stock !== null && quantity >= product.stock} aria-label="Increase quantity" onClick={() => setQuantity((current) => Math.min(product.stock ?? Number.POSITIVE_INFINITY, current + 1))} className="h-12 w-11 touch-manipulation text-[#D9B86C] disabled:opacity-30">+</button>
                      </div>
                    </div>
                    <button type="button" onClick={() => void handleReserve()} disabled={isReserving} className="btn-foil hidden h-12 flex-1 disabled:opacity-55 lg:inline-flex"><span className="btn-label">{isReserving ? 'Preparing selection' : 'Reserve Lot 1'}</span></button>
                  </div>
                </div>
              ) : (
                <LockedOverlay><p>{product.lockedPrice}</p></LockedOverlay>
              )}
            </div>

            <button
              type="button"
              aria-pressed={isSaved}
              onClick={() => { toggleWishlist(product.id); showNotice(isSaved ? 'Removed from saved selection.' : 'Saved for your next visit.'); }}
              className="mt-5 w-fit border-b border-[rgba(200,164,93,0.3)] pb-1 text-[10px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.7)] hover:text-[#D9B86C]"
            >
              {isSaved ? 'Remove from saved selection' : 'Save this piece'}
            </button>
          </motion.div>
        </div>

        <section className="mb-20 md:mb-28">
          <div className="mb-8 grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7"><p className="eyebrow mb-4 text-[#D9B86C]">Product overview</p><h2 className="font-serif text-4xl text-[#F1E8D8] md:text-5xl">What arrives in the Lot 1 pack.</h2></div>
            <p className="text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)] md:col-span-4 md:col-start-9">Practical product, storage and reservation information for this batch.</p>
          </div>
          <dl className="border-t border-[rgba(200,164,93,0.28)]">
            {facts.map(([label, value]) => (
              <div key={label} className="grid gap-2 border-b border-[rgba(241,232,216,0.08)] py-4 sm:grid-cols-[10rem_1fr] sm:gap-8">
                <dt className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">{label}</dt>
                <dd className="max-w-3xl text-sm font-light leading-relaxed text-[rgba(241,232,216,0.78)]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-20 md:mb-28">
          <p className="eyebrow mb-4 text-[#D9B86C]">The finish</p>
          <h2 className="mb-9 font-serif text-4xl text-[#F1E8D8] md:text-5xl">Read the product through the senses.</h2>
          <div className="border-t border-[rgba(200,164,93,0.28)] md:grid md:grid-cols-5">
            {senses.map(([sense, value]) => (
              <div key={sense} className="grid grid-cols-[5rem_1fr] gap-4 border-b border-[rgba(200,164,93,0.18)] py-5 md:block md:border-r md:px-5 md:py-7 last:md:border-r-0">
                <h3 className="font-serif text-xl capitalize text-[#D9B86C] md:mb-5">{sense}</h3>
                <p className="text-sm font-light leading-relaxed text-[rgba(241,232,216,0.76)]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-[rgba(200,164,93,0.2)] pt-10">
            <h2 className="font-serif text-3xl text-[#F1E8D8]">Continue through {product.category.toLowerCase()}</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {related.map((item) => (
                <Link key={item.id} href={`/product/${item.slug}`} className="grid grid-cols-[6rem_1fr] gap-5 border-b border-[rgba(200,164,93,0.2)] py-5">
                  <div className="relative h-24 bg-[#0D0B09]"><Image src={item.images[0]} alt="" fill sizes="96px" className="object-contain p-2" /></div>
                  <div className="self-center"><p className="text-[9px] uppercase tracking-[0.12em] text-[#D9B86C]">{item.batchCode}</p><h3 className="mt-2 font-serif text-xl text-[#F1E8D8]">{item.name}</h3><p className="mt-2 text-xs text-[rgba(241,232,216,0.64)]">{item.finish}</p></div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {user && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#C9A45C]/20 bg-[#050505] pb-[env(safe-area-inset-bottom)] lg:hidden">
          <div className="flex items-center gap-4 px-5 py-3"><div><span className="block font-serif text-lg text-[#C9A45C]">{product.price || product.lockedPrice}</span><span className="text-[8px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.58)]">{product.batchCode}</span></div><button type="button" onClick={() => void handleReserve()} disabled={isReserving} className="btn-foil h-12 flex-1 !py-0 disabled:opacity-55"><span className="btn-label">{isReserving ? 'Preparing selection' : 'Reserve Lot 1'}</span></button></div>
        </div>
      )}
    </div>
  );
}

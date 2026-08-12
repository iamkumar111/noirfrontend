'use client';

import Image from 'next/image';
import Link from '@/components/transitions/LuxuryLink';
import type { Product } from '@/lib/medusa/types';
import { useStore } from '@/store/useStore';

export default function ProductCard({ product }: { product: Product }) {
  const user = useStore((state) => state.user);
  const detailRows = [
    ['Finish', product.finish],
    ['Texture', product.texture],
    ['Pack', product.packaging],
    ['Weight', product.weight],
  ];

  return (
    <article className="group relative flex h-full flex-col border border-[rgba(200,164,93,0.18)] bg-[linear-gradient(180deg,#171512_0%,#0D0C0A_100%)]">
      <Link href={`/product/${product.slug}`} className="flex h-full flex-col">
        <div className="relative h-[260px] w-full overflow-hidden bg-[linear-gradient(180deg,#171512_0%,#1A120B_100%)] p-6 md:h-[340px] md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(200,164,93,0.11)_0%,transparent_68%)]" />
          <Image
            src={product.images[0]}
            alt={`${product.name} in NOIR & OAK packaging`}
            fill
            sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.02] md:p-8"
            style={{ filter: 'brightness(1.08) contrast(1.04) saturate(0.96) drop-shadow(0 14px 36px rgba(0,0,0,0.72))' }}
          />
          <span className="stamp absolute left-4 top-4 z-10 md:left-5 md:top-5">{product.batchCode}</span>
          <span className="absolute bottom-4 left-5 z-10 text-[9px] uppercase tracking-[0.18em] text-[rgba(241,232,216,0.72)]">
            {product.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-7">
          <div className="mb-5 flex items-start justify-between gap-5">
            <div>
              <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-[#D9B86C]">{product.status}</p>
              <h2 className="font-serif text-[1.35rem] font-light leading-tight text-[#F1E8D8] transition-colors duration-500 group-hover:text-[#E0C17A]">
                {product.name}
              </h2>
            </div>
            <span className="shrink-0 text-right text-[9px] uppercase tracking-[0.16em] text-[rgba(241,232,216,0.62)]">
              {product.badge}
            </span>
          </div>

          <dl className="mb-6 border-t border-[rgba(200,164,93,0.16)]">
            {detailRows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[4.25rem_1fr] gap-3 border-b border-[rgba(241,232,216,0.07)] py-2.5">
                <dt className="text-[9px] uppercase tracking-[0.14em] text-[rgba(241,232,216,0.58)]">{label}</dt>
                <dd className="text-[12px] font-light leading-snug text-[rgba(241,232,216,0.78)]">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto flex items-end justify-between gap-5">
            <div>
              <span className="block text-[9px] uppercase tracking-[0.16em] text-[rgba(241,232,216,0.58)]">{product.reserveStatus}</span>
              <span className="mt-1 block font-serif text-lg text-[#D9B86C]">
                {user ? product.price || product.lockedPrice : product.lockedPrice}
              </span>
            </div>
            <span className="shrink-0 border-b border-[#D9B86C]/35 pb-1 text-[10px] uppercase tracking-[0.18em] text-[#E0C17A]">
              {user ? 'Reserve Lot 1' : 'Member Preview'}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

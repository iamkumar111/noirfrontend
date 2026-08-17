'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from '@/components/transitions/LuxuryLink';
import LuxuryPosterHero from '@/components/LuxuryPosterHero';
import { useStore } from '@/store/useStore';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-56px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
});

const SENSES = [
  ['SIGHT', 'Gold seals, satin cocoa and matte-black packaging.'],
  ['TOUCH', 'A rigid vault box, fitted interior and polished chocolate shell.'],
  ['AROMA', 'Roasted almond, dark cocoa and warm makhana seasoning.'],
  ['SOUND', 'A clean opening, crisp bite and chocolate-shell snap.'],
  ['TASTE', 'Pure couverture, milk chocolate, parmesan and pink salt.'],
];

const PACKAGING = [
  ['CONSTRUCTION', 'Magnetic rigid box'],
  ['INTERIOR', 'Velvet-inspired fitted insert'],
  ['BATCH RECORD', 'Gold-sealed numbered batch record'],
  ['PRESENTATION', 'Gift-ready outer sleeve'],
  ['SERVICE', 'Optional note card and batch reference'],
];

export default function Home() {
  const isIntroSeen = useStore((state) => state.isIntroSeen);
  const products = useStore((state) => state.products);
  const catalogStatus = useStore((state) => state.catalogStatus);
  const catalogError = useStore((state) => state.catalogError);
  const leadProduct = products.find((product) => product.id === 'curated-collection-box') || products[0];
  const sideProducts = products.filter((product) => ['dark-chocolate-almonds', 'parmesan-makhana'].includes(product.id));

  if (!leadProduct) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1 }}>
        <LuxuryPosterHero canPlay={isIntroSeen} />
        <section className="relative z-20 border-t border-[rgba(200,164,93,0.18)] bg-[#0D0B09] px-5 py-24 text-center md:px-6 md:py-32">
          <p className="eyebrow mb-5 text-[#D9B86C]">Collection preview</p>
          <p role="status" className="mx-auto max-w-xl font-serif text-2xl font-light text-[rgba(241,232,216,0.76)]">
            {catalogStatus === 'loading' || catalogStatus === 'idle' ? 'Preparing the private collection…' : catalogError || 'No products found in the Medusa collection.'}
          </p>
        </section>
      </motion.div>
    );
  }

  const showMedusaPrice = leadProduct.source === 'medusa' && Boolean(leadProduct.price);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1 }}>
      <LuxuryPosterHero canPlay={isIntroSeen} />

      <section className="relative z-20 border-t border-[rgba(200,164,93,0.18)] bg-[#0A0907] px-5 py-20 md:px-6 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12 md:items-end md:gap-12">
          <motion.div {...fadeUp()} className="md:col-span-7">
            <p className="eyebrow mb-5 text-[#D9B86C]">The first release</p>
            <h2 className="section-heading max-w-3xl text-[#F1E8D8]">
              Lot 1, prepared for the <span className="font-light italic text-[#D9B86C]">member table.</span>
            </h2>
          </motion.div>
          <motion.div {...fadeUp(0.08)} className="border-t border-[rgba(200,164,93,0.28)] pt-7 md:col-span-5 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <p className="body-copy max-w-xl text-[rgba(241,232,216,0.84)]">
              Pure couverture coated almonds and gold-sealed makhana tins are finished in small batches, then placed in rigid packaging designed to remain on the table.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 border-t border-[rgba(241,232,216,0.1)] pt-5">
              <div>
                <dt className="metadata-label text-[#D9B86C]">Release</dt>
                <dd className="mt-2 text-[15px] text-[rgba(241,232,216,0.84)]">Numbered Lot 1</dd>
              </div>
              <div>
                <dt className="metadata-label text-[#D9B86C]">Reservation</dt>
                <dd className="mt-2 text-[15px] text-[rgba(241,232,216,0.84)]">Pre-paid access</dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 border-t border-[rgba(200,164,93,0.18)] bg-[#0E0C0A] px-5 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between md:mb-16">
            <motion.div {...fadeUp()}>
              <p className="eyebrow mb-5 text-[#D9B86C]">Collection preview</p>
              <h2 className="section-heading text-[#F1E8D8]">Coated, roasted and packed for Lot 1.</h2>
            </motion.div>
            <Link href="/collection" className="text-link w-fit">View the collection</Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.article {...fadeUp(0.04)} className="group lg:col-span-7">
              <Link href={`/product/${leadProduct.slug}`} className="block border border-[rgba(200,164,93,0.22)] bg-[linear-gradient(150deg,#181411_0%,#0E0C0A_70%)]">
                <figure className="relative h-[320px] overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,rgba(200,164,93,0.15),transparent_62%)] p-8 sm:h-[430px] md:h-[500px]">
                  <Image
                    src={leadProduct.images[0]}
                    alt={`${leadProduct.name} in NOIR & OAK packaging`}
                    fill
                    sizes="(max-width: 1024px) 90vw, 55vw"
                    className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-[1.02] md:p-10"
                    style={{ filter: 'brightness(1.1) contrast(1.03) saturate(0.96) drop-shadow(0 20px 46px rgba(0,0,0,0.72))' }}
                  />
                  <figcaption className="absolute bottom-5 left-6 metadata-label text-[rgba(241,232,216,0.74)]">{leadProduct.batchCode} / Featured release</figcaption>
                </figure>
                <div className="p-6 md:p-9">
                  <p className="metadata-label text-[#D9B86C]">{leadProduct.category}</p>
                  <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <h3 className="font-serif text-[2rem] leading-[1.02] text-[#F1E8D8] transition-colors duration-500 group-hover:text-[#E0C17A] md:text-[2.8rem]">{leadProduct.name}</h3>
                    <span className="text-[15px] text-[rgba(241,232,216,0.74)]">{leadProduct.batchCode}</span>
                  </div>
                  <dl className="mt-7 grid gap-x-10 border-t border-[rgba(200,164,93,0.2)] pt-5 sm:grid-cols-2">
                    <div className="detail-row"><dt>Finish</dt><dd>{leadProduct.finish}</dd></div>
                    <div className="detail-row"><dt>Pack</dt><dd>{leadProduct.packaging}</dd></div>
                    <div className="detail-row"><dt>Weight</dt><dd>{leadProduct.weight}</dd></div>
                    <div className="detail-row"><dt>Reservation</dt><dd>{leadProduct.reserveStatus}</dd></div>
                  </dl>
                  <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
                    <div>
                      <p className="metadata-label text-[rgba(241,232,216,0.58)]">{leadProduct.status}</p>
                      {showMedusaPrice && <p className="mt-2 font-serif text-2xl text-[#D9B86C]">{leadProduct.price}</p>}
                    </div>
                    <span className="text-link">{leadProduct.availableForSale ? 'Reserve Lot 1' : 'Preview the piece'}</span>
                  </div>
                </div>
              </Link>
            </motion.article>

            <div className="flex flex-col divide-y divide-[rgba(200,164,93,0.2)] border-y border-[rgba(200,164,93,0.2)] lg:col-span-5">
              {sideProducts.map((product, index) => (
                <motion.article key={product.id} {...fadeUp(0.1 + index * 0.08)} className="group flex flex-1 py-7 first:pt-7 last:pb-7 sm:py-9">
                  <Link href={`/product/${product.slug}`} className="grid w-full grid-cols-[8.25rem_minmax(0,1fr)] gap-5 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-7">
                    <figure className="relative min-h-40 overflow-hidden bg-[#17130F] sm:min-h-48">
                      <Image src={product.images[0]} alt="" fill sizes="168px" className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.03] sm:p-4" />
                    </figure>
                    <div className="flex min-w-0 flex-col justify-center">
                      <p className="metadata-label text-[#D9B86C]">{product.category}</p>
                      <h3 className="mt-2 font-serif text-[1.6rem] leading-[1.04] text-[#F1E8D8] transition-colors duration-500 group-hover:text-[#E0C17A] sm:text-[2rem]">{product.name}</h3>
                      <p className="mt-3 text-[15px] leading-[1.55] text-[rgba(241,232,216,0.78)]">{product.finish}</p>
                      <p className="mt-3 text-[13px] text-[rgba(241,232,216,0.65)]">{product.weight} · {product.batchCode}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 overflow-hidden border-t border-[rgba(200,164,93,0.18)] bg-[linear-gradient(112deg,#090806_0%,#16100B_50%,#0A0806_100%)] px-5 py-24 md:px-6 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-20">
          <motion.figure {...fadeUp()} className="relative aspect-[5/6] overflow-hidden border border-[rgba(200,164,93,0.24)] bg-[#16120E] md:aspect-[4/5]">
            <Image src={leadProduct.images[0]} alt="The Curated Collection Box packaging" fill sizes="(max-width: 1024px) 90vw, 54vw" className="object-contain p-7 md:p-12" style={{ filter: 'brightness(1.08) contrast(1.04)' }} />
            <figcaption className="absolute bottom-5 left-5 right-5 border-t border-[rgba(200,164,93,0.25)] pt-3 metadata-label text-[rgba(241,232,216,0.72)]">{leadProduct.batchCode} / Matte-black magnetic gifting vault</figcaption>
          </motion.figure>
          <motion.div {...fadeUp(0.08)}>
            <p className="eyebrow mb-5 text-[#D9B86C]">Packaging as an object</p>
            <h2 className="section-heading text-[#F1E8D8]">Built to arrive gift-ready and remain on the table.</h2>
            <p className="body-copy mt-7 max-w-xl text-[rgba(241,232,216,0.82)]">Each release is placed inside a matte-black rigid vault with a fitted interior and a numbered batch record.</p>
            <dl className="mt-9 border-t border-[rgba(200,164,93,0.3)]">
              {PACKAGING.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-5 border-b border-[rgba(241,232,216,0.1)] py-4 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
                  <dt className="metadata-label text-[#D9B86C]">{label}</dt>
                  <dd className="text-[15.5px] leading-relaxed text-[rgba(241,232,216,0.84)]">{value}</dd>
                </div>
              ))}
            </dl>
            <Link href="/gifting" className="btn-quiet mt-9">View gifting details</Link>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 border-t border-[rgba(200,164,93,0.18)] bg-[#090806] px-5 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp()} className="mb-12 grid gap-7 md:grid-cols-12 md:items-end md:gap-10">
            <div className="md:col-span-7">
              <p className="eyebrow mb-5 text-[#D9B86C]">Sensory craft</p>
              <h2 className="section-heading text-[#F1E8D8]">The Finish Is The Experience.</h2>
            </div>
            <p className="body-copy md:col-span-4 md:col-start-9 text-[rgba(241,232,216,0.78)]">A product should explain itself through finish, texture and the way its packaging opens.</p>
          </motion.div>
          <div className="grid border-t border-[rgba(200,164,93,0.3)] sm:grid-cols-2 xl:grid-cols-5">
            {SENSES.map(([sense, detail], index) => (
              <motion.div key={sense} {...fadeUp(index * 0.045)} className="group border-b border-[rgba(200,164,93,0.18)] py-7 sm:px-6 sm:py-9 sm:odd:border-r sm:even:border-r-0 xl:border-r xl:px-5 xl:last:border-r-0">
                <h3 className="font-serif text-[1.65rem] text-[rgba(241,232,216,0.8)] transition-colors duration-500 group-hover:text-[#D9B86C]">{sense}</h3>
                <span className="mt-4 block h-px w-0 bg-[#D9B86C]/65 transition-[width] duration-500 group-hover:w-10" />
                <p className="mt-4 text-[15px] leading-[1.65] text-[rgba(241,232,216,0.72)] transition-colors duration-500 group-hover:text-[rgba(241,232,216,0.9)]">{detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 overflow-hidden border-t border-[rgba(200,164,93,0.18)] bg-[radial-gradient(ellipse_at_82%_40%,rgba(88,55,20,0.2),transparent_42%),#0E0B08] px-5 py-24 md:px-6 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12 md:items-center md:gap-12">
          <motion.figure {...fadeUp()} className="relative aspect-[4/3] overflow-hidden border border-[rgba(200,164,93,0.18)] bg-[#17130F] md:col-span-4">
            <Image src={leadProduct.images[0]} alt="NOIR & OAK gifting vault" fill sizes="(max-width: 768px) 90vw, 32vw" className="object-contain p-6 md:p-8" style={{ filter: 'brightness(1.04) contrast(1.04)' }} />
          </motion.figure>
          <motion.div {...fadeUp(0.07)} className="md:col-span-5">
            <p className="eyebrow mb-5 text-[#D9B86C]">The gifting vault</p>
            <h2 className="section-heading text-[#F1E8D8]">Corporate boxes, festive gifting and private-table service.</h2>
            <p className="body-copy mt-7 text-[rgba(241,232,216,0.82)]">Share the occasion, quantity and delivery window. The team will confirm collection availability before preparing the final gifting proposal.</p>
          </motion.div>
          <motion.div {...fadeUp(0.13)} className="flex flex-col items-start gap-5 md:col-span-3">
            <Link href="/gifting" className="btn-foil w-full sm:w-auto"><span className="btn-label">Request a gifting consultation</span></Link>
            <p className="max-w-[16rem] text-[15px] leading-relaxed text-[rgba(241,232,216,0.68)]">Requests reviewed before confirmation.</p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-20 border-t border-[rgba(200,164,93,0.18)] bg-[radial-gradient(ellipse_at_50%_25%,rgba(96,60,19,0.18),transparent_48%),#090806] px-5 py-24 text-center md:px-6 md:py-32">
        <motion.div {...fadeUp()} className="mx-auto max-w-4xl">
          <p className="eyebrow mb-5 text-[#D9B86C]">NOIR & OAK House</p>
          <h2 className="section-heading text-[#F1E8D8]">A Private Collection, Finished For Gifting.</h2>
          <p className="body-copy mx-auto mt-7 max-w-2xl text-[rgba(241,232,216,0.82)]">Pure couverture coated almonds, gold-sealed makhana tins and rigid gifting vaults prepared in limited releases.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/vip-access" className="btn-foil"><span className="btn-label">Request VIP access</span></Link>
            <Link href="/collection" className="btn-quiet">Explore the collection</Link>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}

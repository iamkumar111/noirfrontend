"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Link from "@/components/transitions/LuxuryLink";

const MATERIALS = [
  {
    number: "01",
    name: "Almond",
    description: "Jumbo almonds selected for an even roast and clean centre.",
    detail: "Roast profile, centre crispness, surface consistency",
    image: "/images/products/dark-chocolate-almonds.png",
  },
  {
    number: "02",
    name: "Couverture",
    description: "Pure couverture used for a defined shell and a clean finish.",
    detail: "Cocoa profile, shell thickness, satin gloss",
    image: "/images/products/milk-chocolate-almonds.png",
  },
  {
    number: "03",
    name: "Makhana",
    description: "Jumbo makhana slow-roasted before the final seasoning is applied.",
    detail: "Expansion, crispness, seasoning adherence",
    image: "/images/products/chocolate-makhana.png",
  },
  {
    number: "04",
    name: "Pack",
    description: "Rigid black and gold boxes sealed with a numbered Lot 1 batch card.",
    detail: "Protection, opening ritual, gifting presence",
    image: "/images/products/curated-collection-box.png",
  },
];

const RITUALS = [
  {
    stage: "Selection",
    copy: "Each ingredient is assessed for consistency, structure, and suitability for the intended finish.",
    image: "/images/products/dark-chocolate-almonds.png",
  },
  {
    stage: "Roasting",
    copy: "The roast is controlled to protect texture and allow the coating or seasoning to remain clear.",
    image: "/images/products/pink-salt-makhana.png",
  },
  {
    stage: "Finishing",
    copy: "Couverture, salt, or savoury seasoning is applied in small production runs.",
    image: "/images/products/milk-chocolate-almonds.png",
  },
  {
    stage: "Packing",
    copy: "The product is placed inside the final vessel only after its texture and finish are approved.",
    image: "/images/products/curated-collection-box.png",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function OurStoryPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="section-top relative z-10 overflow-hidden bg-[#050403] px-5 md:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_72%_34%_at_70%_3%,rgba(83,56,25,0.28),transparent_70%)]" />

      <main className="relative z-10 mx-auto max-w-[1240px]">
        <section className="origin-section grid min-h-[76svh] items-center gap-12 pb-20 pt-8 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(2px)" }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative z-10 lg:col-span-6"
          >
            <p className="eyebrow mb-6 text-[#D9B86C]">The Origin</p>
            <h1 className="max-w-3xl font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.86] text-[#F1E8D8]">
              Built Around <span className="italic text-[#D9B86C]">The Finish.</span>
            </h1>
            <motion.div
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={reduceMotion ? undefined : { scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
              className="mt-9 h-px w-28 origin-left bg-[linear-gradient(90deg,#D9B86C,transparent)]"
            />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-8 max-w-xl space-y-5 text-[16px] font-light leading-[1.75] text-[rgba(241,232,216,0.76)] md:text-[18px]"
            >
              <p>NOIR &amp; OAK began with a simple belief: premium dry fruits should be considered with the same attention given to fine chocolate, gifting objects, and collectible packaging.</p>
              <p className="text-[rgba(241,232,216,0.62)]">Every release begins with the product itself—its texture, coating, seasoning, weight, and presentation. The theatre comes later.</p>
            </motion.div>
          </motion.div>

          <motion.figure
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1.15, delay: 0.12, ease: EASE }}
            className="origin-figure origin-product-figure relative isolate flex min-h-[430px] flex-col sm:min-h-[540px] lg:col-span-6 lg:min-h-[650px]"
          >
            <div className="pointer-events-none absolute inset-[5%_-8%_4%_0] rounded-full bg-[radial-gradient(circle_at_55%_42%,rgba(200,164,93,0.24),rgba(80,48,16,0.08)_38%,transparent_68%)] blur-2xl" />
            <div className="origin-image-frame origin-product-image relative min-h-0 flex-1" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 78%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 78%, transparent 100%)" }}>
              <Image src="/images/products/dark-chocolate-almonds.png" alt="Dark chocolate coated almonds prepared for a NOIR & OAK release" fill priority sizes="(max-width: 1024px) 92vw, 52vw" className="object-contain object-center" />
            </div>
            <figcaption className="origin-image-caption origin-product-caption"><span className="origin-product-caption-line" aria-hidden="true" /><span>DC-001 / Pure couverture dark cocoa glaze</span></figcaption>
          </motion.figure>
        </section>

        <section className="origin-section py-[88px] md:py-[140px]">
          <Reveal className="max-w-5xl">
            <p className="eyebrow mb-7 text-[#D9B86C]">The Founding Belief</p>
            <h2 className="max-w-5xl font-serif text-[clamp(2.7rem,5.3vw,5.8rem)] leading-[0.93] text-[#F1E8D8]">The product comes before the theatre.</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <Reveal className="max-w-3xl text-[16px] font-light leading-[1.78] text-[rgba(241,232,216,0.74)] md:text-[18px] lg:col-span-7">
              <p>Almonds are roasted for a clean centre before they meet couverture. Makhana is slow-roasted before seasoning is applied. Packaging is developed around the product—not the other way around.</p>
              <p className="mt-8 max-w-2xl font-serif text-[clamp(2rem,3.2vw,3.5rem)] leading-[1.04] text-[#D9B86C]">If the finish is not right, the release does not leave the house.</p>
            </Reveal>
            <Reveal delay={0.12} className="border-l border-[#D9B86C]/45 pl-6 pb-1 lg:col-span-4 lg:col-start-9">
              <p className="eyebrow text-[#D9B86C]">Production note / lot 1</p>
              <p className="mt-4 max-w-xs text-[16px] font-light leading-[1.7] text-[rgba(241,232,216,0.7)]">A release is checked for texture, finish, storage, and pack integrity before it is named, photographed, or offered.</p>
            </Reveal>
          </div>
        </section>

        <section className="origin-section grid gap-12 py-[88px] md:py-[140px] lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-7">
            <figure className="origin-figure origin-product-figure relative flex min-h-[480px] flex-col sm:min-h-[620px]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(100,66,28,0.2),transparent_66%)]" />
              <div className="origin-image-frame origin-product-image relative min-h-0 flex-1" style={{ maskImage: "linear-gradient(105deg, transparent 0%, black 14%, black 86%, transparent 100%)", WebkitMaskImage: "linear-gradient(105deg, transparent 0%, black 14%, black 86%, transparent 100%)" }}>
              <Image src="/images/products/signature-almond-duo.png" alt="NOIR & OAK signature almond duo showing the coated finish" fill sizes="(max-width: 1024px) 92vw, 58vw" className="object-contain" />
              </div>
              <figcaption className="origin-image-caption origin-product-caption"><span className="origin-product-caption-line" aria-hidden="true" /><span>Batch Review / Finish First</span></figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="eyebrow mb-5 text-[#D9B86C]">Product before theatre</p>
            <h2 className="font-serif text-[clamp(2.5rem,4.2vw,4.7rem)] leading-[0.92] text-[#F1E8D8]">The product comes first.</h2>
            <div className="mt-7 space-y-5 text-[16px] font-light leading-[1.78] text-[rgba(241,232,216,0.74)] md:text-[17px]">
              <p>Before photography, packaging, or presentation, every release is judged by its finish.</p>
              <p>The almond must hold its crisp centre beneath the couverture shell. The makhana must remain light after roasting and retain its structure beneath the seasoning.</p>
              <p>Only when the product is right does the rest of the experience begin.</p>
            </div>
            <div className="mt-9 border-l border-[#D9B86C]/45 pl-4">
              <p className="text-[10px] uppercase tracking-[0.17em] text-[#D9B86C]">Batch review</p>
              <p className="mt-2 text-[15px] leading-relaxed text-[rgba(241,232,216,0.62)]">Texture, coating, seasoning, storage and pack integrity</p>
            </div>
          </Reveal>
        </section>

        <section className="origin-section material-record-section py-[88px] md:py-[140px]">
          <Reveal className="material-record-container material-record-header">
            <div><p className="eyebrow mb-5 text-[#D9B86C]">Material record</p><h2 className="material-record-title font-serif text-[#F1E8D8]">Four parts of every release.</h2></div>
            <p className="material-record-intro font-light">Each release is built from four decisions. None is decorative. Each affects how the product is received, stored, opened, and remembered.</p>
          </Reveal>
          <div className="material-record-container material-record-list mt-14">
            {MATERIALS.map((material, index) => (
              <Reveal key={material.name} delay={index * 0.04}>
                <article className="material-row">
                  <span className="material-number font-serif text-3xl text-[#D9B86C]">{material.number}</span>
                  <h3 className="material-title font-serif">{material.name}</h3>
                  <div className="material-content"><p className="material-description font-light">{material.description}</p><p className="material-technical">{material.detail}</p></div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="origin-section py-[88px] md:py-[140px]">
          <Reveal className="max-w-2xl"><p className="eyebrow mb-5 text-[#D9B86C]">The making ritual</p><h2 className="font-serif text-[clamp(2.5rem,4.5vw,4.8rem)] leading-[0.92] text-[#F1E8D8]">The Making Ritual</h2></Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-7">
            {RITUALS.map((ritual, index) => (
              <Reveal key={ritual.stage} delay={index * 0.07}>
                <article className="group">
                  <div className="relative min-h-[320px] overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(100,66,28,0.14),transparent_68%)] sm:min-h-[390px]">
                    <Image src={ritual.image} alt={`${ritual.stage} in the NOIR & OAK making ritual`} fill sizes="(max-width: 640px) 92vw, (max-width: 1280px) 45vw, 24vw" className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(transparent,#050403)]" />
                  </div>
                  <div className="mt-5 border-l border-[#D9B86C]/45 pl-4"><p className="font-serif text-3xl text-[#F1E8D8]">{ritual.stage}</p><p className="mt-3 text-[16px] font-light leading-[1.72] text-[rgba(241,232,216,0.68)]">{ritual.copy}</p></div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="origin-section grid gap-12 py-[88px] md:py-[140px] lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-5 text-[#D9B86C]">The object</p>
            <h2 className="font-serif text-[clamp(2.5rem,4.3vw,4.6rem)] leading-[0.92] text-[#F1E8D8]">The box is not an afterthought.</h2>
            <p className="mt-7 text-[16px] font-light leading-[1.78] text-[rgba(241,232,216,0.74)] md:text-[18px]">The rigid vault, velvet-inspired insert, gold seal, batch card, and opening sequence are considered as part of the product itself. The packaging should protect the finish while creating a restrained gifting experience.</p>
            <ul className="mt-9 space-y-3 border-l border-[#D9B86C]/40 pl-5 text-[15px] leading-relaxed text-[rgba(241,232,216,0.7)]"><li>Magnetic rigid construction</li><li>Matte black exterior and velvet-inspired insert</li><li>Gold-sealed batch card and numbered release detail</li><li>Gift-ready outer presentation</li></ul>
          </Reveal>
          <Reveal delay={0.1} className="origin-packaging-study relative min-h-[640px] lg:col-span-6 lg:col-start-7">
            <figure className="origin-figure origin-pack-primary"><div className="origin-image-frame" style={{ maskImage: "linear-gradient(135deg, transparent 0%, black 12%, black 88%, transparent 100%)", WebkitMaskImage: "linear-gradient(135deg, transparent 0%, black 12%, black 88%, transparent 100%)" }}><Image src="/images/products/curated-collection-box.png" alt="NOIR & OAK rigid collection box" fill sizes="(max-width: 1024px) 76vw, 39vw" className="object-contain" /></div><figcaption className="origin-image-caption">Magnetic closure</figcaption></figure>
            <figure className="origin-figure origin-pack-detail-top"><div className="origin-image-frame bg-[#0D0B09]"><Image src="/images/products/signature-almond-duo.png" alt="Gold-sealed insert detail" fill sizes="(max-width: 1024px) 42vw, 22vw" className="object-contain p-3" /></div><figcaption className="origin-image-caption">Gold-sealed insert</figcaption></figure>
            <figure className="origin-figure origin-pack-detail-bottom"><div className="origin-image-frame bg-[#0D0B09]"><Image src="/images/products/dark-chocolate-almonds.png" alt="Numbered release card detail" fill sizes="(max-width: 1024px) 36vw, 18vw" className="object-contain p-3" /></div><figcaption className="origin-image-caption">Numbered release card</figcaption></figure>
          </Reveal>
        </section>

        <section className="origin-section relative isolate my-[72px] py-[110px] text-center md:my-[120px] md:py-[165px]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(184,138,59,0.18),rgba(35,23,12,0.08)_42%,transparent_72%)]" />
          <Image src="/images/logo/noir-oak-tree-mark.png" alt="" aria-hidden="true" fill sizes="100vw" className="pointer-events-none -z-10 object-contain opacity-[0.08]" />
          <Reveal className="mx-auto max-w-4xl"><h2 className="font-serif text-[clamp(3rem,6.2vw,6.8rem)] leading-[0.9] text-[#F1E8D8]">Made To Be Opened Slowly.</h2><p className="mx-auto mt-8 max-w-2xl text-[16px] font-light leading-[1.78] text-[rgba(241,232,216,0.75)] md:text-[18px]">NOIR &amp; OAK releases are built for the table, the gift, and the moment before the box is opened. Each product is selected, finished, and packed to feel considered—not excessive.</p></Reveal>
        </section>

        <section className="origin-section border-y border-[rgba(200,164,93,0.28)] py-[96px] md:py-[130px]">
          <Reveal className="mx-auto max-w-4xl text-center"><p className="eyebrow mb-6 text-[#D9B86C]">Lot 1</p><h2 className="font-serif text-[clamp(2.8rem,5.2vw,5.8rem)] leading-[0.92] text-[#F1E8D8]">See The First Finished Collection.</h2><p className="mx-auto mt-7 max-w-2xl text-[16px] font-light leading-[1.75] text-[rgba(241,232,216,0.72)] md:text-[18px]">Explore coated almonds, gold-sealed makhana tins, and rigid gifting vaults prepared for the current release.</p><div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"><Link href="/collection" className="btn-foil"><span className="btn-label">View the collection</span></Link><Link href="/vip-access" className="btn-quiet">Request VIP access</Link></div></Reveal>
        </section>
      </main>
    </div>
  );
}

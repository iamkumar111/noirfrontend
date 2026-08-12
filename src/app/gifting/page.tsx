'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay },
});

const INTENTS = [
  ['Corporate Gifts', 'Boardroom, partner and executive boxes with an optional company note card.'],
  ['Festive Gifting', 'Numbered seasonal boxes for Diwali, Eid and year-end gifting.'],
  ['Private Tables', 'Host gifts and table pieces prepared for dinners, events and hospitality.'],
  ['Client Thank-You Boxes', 'Gift-ready coated almond and makhana selections for considered follow-ups.'],
];

const PACKAGING = [
  ['Box', 'Matte black magnetic rigid vault'],
  ['Interior', 'Velvet-inspired fitted insert'],
  ['Batch card', 'Gold-sealed and numbered for Lot 1'],
  ['Outer finish', 'Gift-ready protective sleeve'],
  ['Corporate option', 'Printed note card supplied with an approved message'],
];

export default function GiftingPage() {
  const [submitted, setSubmitted] = useState(false);
  const products = useStore((state) => state.products);
  const giftBox = products.find((product) => product.id === 'curated-collection-box') || products[0];

  return (
    <div className="section-top relative z-10 min-h-screen overflow-hidden bg-transparent px-5 pb-24 md:px-6 md:pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_70%_0%,rgba(26,21,17,0.76)_0%,#050403_62%)]" />
      <div className="relative z-20 mx-auto max-w-7xl">
        <motion.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }} className="grid gap-8 border-b border-[rgba(200,164,93,0.2)] pb-10 md:grid-cols-12 md:items-end md:pb-14">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5 text-[#D9B86C]">Gifting consultation</p>
            <h1 className="font-serif text-[2.75rem] leading-[1.04] text-[#F1E8D8] md:text-7xl">The Gifting <span className="font-light italic text-[#D9B86C]">Vault</span></h1>
          </div>
          <p className="max-w-xl text-base font-light leading-relaxed text-[rgba(241,232,216,0.8)] md:col-span-5">Corporate, festive and private-table boxes built around coated almonds, makhana tins and a gift-ready rigid presentation.</p>
        </motion.header>

        <section className="grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-20">
          <motion.div {...fadeUp()} className="relative aspect-[4/5] border border-[rgba(200,164,93,0.2)] bg-[#0D0B09]">
            <Image src={giftBox?.images[0] || '/images/products/curated-collection-box.png'} alt="NOIR & OAK Curated Collection Box" fill priority sizes="(max-width: 1024px) 92vw, 46vw" className="object-contain p-7 md:p-11" />
            <p className="absolute bottom-5 left-5 right-5 border-t border-[rgba(200,164,93,0.22)] pt-3 text-[9px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.64)]">GB-001 / Numbered Lot 1 presentation</p>
          </motion.div>
          <motion.div {...fadeUp(0.08)}>
            <p className="eyebrow mb-4 text-[#D9B86C]">The presentation</p>
            <h2 className="font-serif text-4xl leading-tight text-[#F1E8D8] md:text-5xl">Packaging specified with the same care as the contents.</h2>
            <p className="mt-5 text-base font-light leading-relaxed text-[rgba(241,232,216,0.74)]">Each box is prepared for handover without secondary wrapping. Quantity and custom note-card availability are confirmed before payment.</p>
            <dl className="mt-8 border-t border-[rgba(200,164,93,0.25)]">
              {PACKAGING.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[7rem_1fr] gap-5 border-b border-[rgba(241,232,216,0.08)] py-4">
                  <dt className="text-[9px] uppercase tracking-[0.12em] text-[#D9B86C]">{label}</dt>
                  <dd className="text-sm font-light leading-relaxed text-[rgba(241,232,216,0.8)]">{value}</dd>
                </div>
              ))}
            </dl>
            <a href="#gifting-request" className="btn-foil mt-8"><span className="btn-label">Start a gifting request</span></a>
          </motion.div>
        </section>

        <section className="border-t border-[rgba(200,164,93,0.2)] py-16 md:py-24">
          <motion.div {...fadeUp()} className="mb-9 grid gap-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7"><p className="eyebrow mb-4 text-[#D9B86C]">Gifting by intent</p><h2 className="font-serif text-4xl text-[#F1E8D8] md:text-5xl">Choose the service, then shape the box.</h2></div>
            <p className="text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)] md:col-span-4 md:col-start-9">Collections and quantities are proposed against your occasion, delivery window and recipient profile.</p>
          </motion.div>
          <div className="border-t border-[rgba(200,164,93,0.28)]">
            {INTENTS.map(([title, description], index) => (
              <motion.div key={title} {...fadeUp(index * 0.05)} className="grid gap-3 border-b border-[rgba(241,232,216,0.08)] py-6 md:grid-cols-12 md:items-center">
                <span className="font-serif text-xl text-[#D9B86C] md:col-span-1">0{index + 1}</span>
                <h3 className="font-serif text-2xl text-[#F1E8D8] md:col-span-4">{title}</h3>
                <p className="max-w-2xl text-sm font-light leading-relaxed text-[rgba(241,232,216,0.76)] md:col-span-6">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-y border-[rgba(200,164,93,0.2)] py-14 md:grid-cols-12 md:items-start md:py-20">
          <motion.div {...fadeUp()} className="md:col-span-5">
            <p className="eyebrow mb-4 text-[#D9B86C]">After your request</p>
            <h2 className="font-serif text-4xl leading-tight text-[#F1E8D8]">A proposal before a reservation.</h2>
          </motion.div>
          <ol className="space-y-0 md:col-span-6 md:col-start-7">
            {[
              ['Review', 'We review the occasion, quantity, city and delivery timeline.'],
              ['Collection', 'Available products, pack format and note-card options are proposed.'],
              ['Confirmation', 'Final quantity, delivery and pre-paid reservation details are confirmed.'],
            ].map(([title, copy], index) => (
              <li key={title} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-[rgba(241,232,216,0.08)] py-4 first:pt-0"><span className="font-serif text-[#D9B86C]">{index + 1}</span><div><h3 className="font-serif text-xl text-[#F1E8D8]">{title}</h3><p className="mt-2 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">{copy}</p></div></li>
            ))}
          </ol>
        </section>

        <section id="gifting-request" className="grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <motion.div {...fadeUp()} className="md:col-span-4">
            <p className="eyebrow mb-4 text-[#D9B86C]">Quantity request</p>
            <h2 className="font-serif text-4xl leading-tight text-[#F1E8D8] md:text-5xl">Tell us what the gift needs to do.</h2>
            <p className="mt-5 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">Submitting this form does not place an order. The team confirms availability and the suitable pack before sharing reservation details.</p>
          </motion.div>

          <motion.div {...fadeUp(0.08)} className="border border-[rgba(200,164,93,0.2)] bg-[#0D0B09] p-6 md:col-span-7 md:col-start-6 md:p-10">
            {submitted ? (
              <div role="status" className="flex min-h-[420px] flex-col justify-center">
                <p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Request received</p>
                <h3 className="mt-4 font-serif text-3xl text-[#F1E8D8]">Thank you for the brief.</h3>
                <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-[rgba(241,232,216,0.76)]">Your gifting request has been received. The NOIR &amp; OAK team will review the quantity, occasion, and preferred collection before confirming availability.</p>
                <button type="button" onClick={() => setSubmitted(false)} className="mt-8 w-fit border-b border-[#D9B86C]/35 pb-1 text-[10px] uppercase tracking-[0.14em] text-[#D9B86C]">Submit another request</button>
              </div>
            ) : (
              <>
              {/* TODO: connect gifting requests to Medusa custom module or email service. */}
              <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="gift-name" label="Name" name="name" autoComplete="name" required />
                  <Field id="gift-company" label="Company" name="company" autoComplete="organization" />
                  <Field id="gift-email" label="Email" name="email" type="email" autoComplete="email" required />
                  <Field id="gift-whatsapp" label="WhatsApp" name="whatsapp" type="tel" autoComplete="tel" required />
                  <Field id="gift-city" label="City" name="city" autoComplete="address-level2" required />
                  <SelectField id="gift-occasion" label="Occasion" name="occasion" options={['Corporate Gifts', 'Festive Gifting', 'Private Tables', 'Client Thank-You Boxes', 'Host Gift']} />
                  <SelectField id="gift-quantity" label="Quantity Range" name="quantity" options={['10–24 boxes', '25–49 boxes', '50–99 boxes', '100+ boxes']} />
                  <SelectField id="gift-collection" label="Preferred Collection" name="collection" options={['Coated Almonds', 'Makhana Tins', 'Curated Gift Boxes', 'A mixed proposal']} />
                  <Field id="gift-timeline" label="Delivery Timeline" name="timeline" placeholder="Preferred date or week" required />
                </div>
                <div><label htmlFor="gift-message" className="form-label">Message</label><textarea id="gift-message" name="message" rows={4} className="luxury-input resize-none" placeholder="Recipient profile, note-card request, delivery locations, or other details" /></div>
                <button type="submit" className="btn-foil w-full"><span className="btn-label">Send gifting request</span></button>
                <p className="text-xs font-light leading-relaxed text-[rgba(241,232,216,0.62)]">Your details are used only to review and respond to this gifting request.</p>
              </form>
              </>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function Field({ id, label, ...props }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div><label htmlFor={id} className="form-label">{label}{props.required ? ' *' : ''}</label><input id={id} className="luxury-input" {...props} /></div>;
}

function SelectField({ id, label, name, options }: { id: string; label: string; name: string; options: string[] }) {
  return <div><label htmlFor={id} className="form-label">{label} *</label><select id={id} name={name} required defaultValue="" className="luxury-select"><option value="" disabled>Select {label.toLowerCase()}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>;
}

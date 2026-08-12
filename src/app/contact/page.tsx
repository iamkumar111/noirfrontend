'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="section-top relative z-10 min-h-screen overflow-hidden bg-transparent px-5 pb-24 md:px-6 md:pb-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_58%_at_68%_0%,rgba(26,21,17,0.75)_0%,#050403_64%)]" />
      <div className="relative z-20 mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-16">
        <section className="md:col-span-5 md:pt-10">
          <p className="eyebrow mb-5 text-[#D9B86C]">Contact</p>
          <h1 className="font-serif text-[2.8rem] leading-[1.04] text-[#F1E8D8] md:text-6xl">NOIR &amp; OAK <span className="font-light italic text-[#D9B86C]">Concierge</span></h1>
          <p className="mt-6 text-base font-light leading-relaxed text-[rgba(241,232,216,0.78)]">For product, reservation and delivery questions. Gifting quantities should use the dedicated gifting consultation.</p>
          <dl className="mt-9 border-t border-[rgba(200,164,93,0.28)]">
            {[['Hours', 'Monday–Saturday, 10:00–19:00 IST'], ['Email', 'concierge@noiroak.com'], ['Location', 'Mumbai, India'], ['Response', 'Within four business hours']].map(([label, value]) => <div key={label} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-[rgba(241,232,216,0.08)] py-4"><dt className="text-[9px] uppercase tracking-[0.12em] text-[#D9B86C]">{label}</dt><dd className="text-sm font-light text-[rgba(241,232,216,0.74)]">{value}</dd></div>)}
          </dl>
        </section>

        <section className="border border-[rgba(200,164,93,0.22)] bg-[#171512] p-6 md:col-span-7 md:p-10 lg:p-12">
          {submitted ? (
            <div role="status" className="flex min-h-[440px] flex-col justify-center"><p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Message received</p><h2 className="mt-4 font-serif text-4xl text-[#F1E8D8]">The concierge will review your note.</h2><p className="mt-5 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">A response will be sent to the email address supplied.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-8 w-fit border-b border-[#D9B86C]/35 pb-1 text-[10px] uppercase tracking-[0.12em] text-[#D9B86C]">Send another message</button></div>
          ) : (
            <><p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Direct enquiry</p><h2 className="mt-3 font-serif text-3xl text-[#F1E8D8]">How can the team help?</h2><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="mt-8 space-y-6"><div><label htmlFor="contact-name" className="form-label">Name *</label><input id="contact-name" name="name" required autoComplete="name" className="luxury-input" /></div><div className="grid gap-6 sm:grid-cols-2"><div><label htmlFor="contact-email" className="form-label">Email *</label><input id="contact-email" name="email" required type="email" autoComplete="email" className="luxury-input" /></div><div><label htmlFor="contact-phone" className="form-label">WhatsApp</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" className="luxury-input" /></div></div><div><label htmlFor="contact-topic" className="form-label">Enquiry</label><select id="contact-topic" name="topic" className="luxury-select"><option>Product detail</option><option>Existing reservation</option><option>Delivery</option><option>Member access</option><option>Other</option></select></div><div><label htmlFor="contact-message" className="form-label">Message *</label><textarea id="contact-message" name="message" required rows={5} className="luxury-input resize-none" /></div><button type="submit" className="btn-foil w-full"><span className="btn-label">Send to concierge</span></button><p className="text-xs font-light text-[rgba(241,232,216,0.6)]">Your details are used only to respond to this enquiry.</p></form></>
          )}
        </section>
      </div>
    </div>
  );
}

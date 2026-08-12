"use client";

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030303] section-top pb-24 md:pb-40 px-5 md:px-6 relative noise-bg z-10 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,21,17,0.85) 0%, #030303 60%)' }}
      />
      
      <div className="w-full max-w-4xl mx-auto relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-16 border-b border-[rgba(201,164,92,0.12)] pb-10 text-center"
        >
          <span className="text-[9px] uppercase tracking-[0.5em] text-[#C9A45C]/60 block mb-5">Legal & Policy</span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#F5EBDD] tracking-tight mb-4">Terms of <span className="italic font-light text-[#C9A45C]">Access</span></h1>
          <p className="text-[rgba(245,235,221,0.55)] text-sm font-light tracking-wide max-w-lg mx-auto">
             Private access terms, conditions of use, and fulfilment policy.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.1 }}
          className="space-y-12 text-[rgba(245,235,221,0.72)] font-light tracking-wide leading-relaxed"
        >
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">1. Private Access & Membership</h2>
            <p className="text-sm">
              NOIR & OAK operates as a private gifting house. Access to our collections, pricing, and reservation slots is restricted to authenticated members. We reserve the right to review, approve, or revoke access at our discretion to maintain the exclusivity and service quality of our private releases.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">2. Reservations & Availability</h2>
            <p className="text-sm">
              All products are produced in micro-batches and are strictly subject to availability. Joining the VIP list or holding an active account does not guarantee a reservation. Reservations are confirmed only upon successful payment. We do not restock specific lots once a release is complete.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">3. Pricing & Payments</h2>
            <p className="text-sm">
              Prices are revealed exclusively to logged-in members and are subject to change between lots. All reservations require full upfront payment. Corporate gifting invoices are subject to separate payment terms as negotiated by your dedicated concierge.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">4. Shipping & Fulfilment</h2>
            <p className="text-sm">
              We employ specialized temperature-controlled shipping where necessary to ensure product integrity. Fulfilment timelines are estimated and may vary based on micro-batch production schedules. NOIR & OAK is not liable for delays caused by external logistics partners, but we will provide concierge support throughout the transit process.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">5. Returns & Quality Assurance</h2>
            <p className="text-sm">
              Due to the perishable nature of our luxury dry fruits and chocolates, all reservations are final and non-returnable. If an item arrives damaged or fails to meet our stringent quality standards, please contact your concierge within 24 hours of receipt with photographic evidence, and we will initiate a priority replacement.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

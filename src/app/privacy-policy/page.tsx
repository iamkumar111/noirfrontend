"use client";

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl md:text-5xl font-serif text-[#F5EBDD] tracking-tight mb-4">Privacy <span className="italic font-light text-[#C9A45C]">Policy</span></h1>
          <p className="text-[rgba(245,235,221,0.55)] text-sm font-light tracking-wide max-w-lg mx-auto">
             How NOIR & OAK handles member data with absolute discretion.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.1 }}
          className="space-y-12 text-[rgba(245,235,221,0.72)] font-light tracking-wide leading-relaxed"
        >
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">1. Discretion & Data Collection</h2>
            <p className="text-sm">
              As a private gifting house, we hold member privacy in the highest regard. We collect only the information necessary to facilitate your access, curate your profile, and deliver your reservations. This includes contact details, gifting preferences, and transaction history.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">2. Use of Information</h2>
            <p className="text-sm">
              Your data is utilized strictly to provide our concierge services, notify you of upcoming private drops, and manage your reservations. We do not sell, rent, or lease your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">3. Data Security</h2>
            <p className="text-sm">
              We employ industry-standard encryption and security protocols to protect your personal and payment information. Access to member profiles is strictly limited to authenticated users and authorized concierge personnel.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">4. Cookies & Analytics</h2>
            <p className="text-sm">
              Our vault utilizes minimal cookies to maintain your session and ensure the seamless functioning of the private lounge. We may use anonymized analytics to improve the user experience, but your personal browsing habits remain confidential.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#C9A45C] mb-4">5. Your Rights</h2>
            <p className="text-sm">
              You maintain the right to request access to, modification of, or deletion of your personal data held within our vault. To exercise these rights or to permanently close your account and forfeit member access, please contact your concierge.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

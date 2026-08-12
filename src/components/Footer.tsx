'use client';

import { useState } from 'react';
import Link from '@/components/transitions/LuxuryLink';

const collectionLinks = [
  { label: 'Coated Almonds', href: '/collection' },
  { label: 'Makhana Tins', href: '/collection' },
  { label: 'Gift Boxes', href: '/collection' },
  { label: 'Gifting', href: '/gifting' },
];

const houseLinks = [
  { label: 'Origin', href: '/our-story' },
  { label: 'The Vault', href: '/login' },
  { label: 'VIP Access', href: '/vip-access' },
  { label: 'Contact', href: '/contact' },
];

const careLinks = [
  { label: 'Shipping', href: '/contact' },
  { label: 'Privacy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Refund Policy', href: '/terms' },
];

function FooterLinks({
  title,
  links,
  label,
}: {
  title: string;
  links: { label: string; href: string }[];
  label: string;
}) {
  return (
    <nav aria-label={label} className="footer-navigation-group min-w-0">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#D9B86C]">{title}</h2>
      <ul className="footer-link-list mt-6">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="footer-link text-[15px] font-light md:text-base">
              <span className="footer-link-label">{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  return (
    <footer
      className="noise-bg velvet-vignette relative z-20 overflow-hidden border-t border-[rgba(200,164,93,0.32)] bg-[radial-gradient(circle_at_18%_20%,rgba(184,138,59,0.10),transparent_30%),radial-gradient(circle_at_82%_35%,rgba(200,164,93,0.06),transparent_28%),linear-gradient(180deg,#0D0B09_0%,#070604_100%)]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_54%_at_52%_100%,rgba(73,48,27,0.16),transparent_72%)]" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12 xl:px-[72px]">
        <section className="border-b border-[rgba(200,164,93,0.34)] py-20 text-left md:py-24 lg:py-[112px]" aria-labelledby="footer-closing-title">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D9B86C] max-md:text-center">NOIR &amp; OAK HOUSE</p>
          <h2 id="footer-closing-title" className="mt-6 max-w-[760px] font-serif text-[clamp(42px,5vw,76px)] font-light leading-[0.98] tracking-[-0.025em] text-[#F1E8D8] max-md:mx-auto max-md:text-center">
            A Private Collection, <span className="text-[#D9B86C]">Finished For Gifting.</span>
          </h2>
          <p className="mt-7 max-w-[640px] text-[15px] font-light leading-[1.7] text-[rgba(241,232,216,0.82)] md:text-[17px] max-md:mx-auto max-md:text-center">
            Pure couverture coated almonds, gold-sealed makhana tins, and rigid gifting vaults prepared in limited releases.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center max-md:mx-auto max-md:max-w-md">
            <Link href="/vip-access" className="btn-foil min-h-14 max-md:w-full">
              <span className="btn-label">Request VIP Access</span>
            </Link>
            <Link href="/collection" className="btn-quiet min-h-14 max-md:w-full">
              Explore the collection
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-y-14 py-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16 md:py-20 lg:grid-cols-[1fr_2.55fr_2.35fr] lg:gap-x-12 lg:gap-y-0 xl:gap-x-16 xl:py-24" aria-label="NOIR & OAK navigation and member access">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block font-serif text-[clamp(30px,3vw,42px)] font-light tracking-[0.09em] text-[#E0C17A]">
              NOIR &amp; OAK
            </Link>
            <p className="mt-4 text-[15px] font-medium text-[#F1E8D8]">Premium Dry Fruits</p>
            <p className="mt-5 max-w-[310px] text-[15px] font-light leading-[1.7] text-[rgba(241,232,216,0.8)] md:text-base">
              Pure couverture coated almonds, gold-sealed makhana tins, and gift-ready rigid vaults.
            </p>
          </div>

          <div className="footer-navigation min-w-0 md:col-span-2 lg:col-span-1">
            <FooterLinks title="Collection" links={collectionLinks} label="Collection navigation" />
            <FooterLinks title="House" links={houseLinks} label="House navigation" />
            <FooterLinks title="Client Care" links={careLinks} label="Client care navigation" />
          </div>

          <div className="min-w-0 border-t border-[rgba(200,164,93,0.22)] pt-10 md:col-span-2 lg:col-span-1 lg:border-t-0 lg:pt-0">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#D9B86C]">Member Release Notes</h2>
            <p className="mt-6 max-w-sm text-[15px] font-light leading-[1.7] text-[rgba(241,232,216,0.82)] md:text-base">
              Receive new collection notes, gifting updates, and early access to future releases.
            </p>

            {newsletterSubmitted ? (
              <p role="status" className="footer-newsletter-success" aria-live="polite">
                Access request received.
              </p>
            ) : (
              <form
                className="footer-newsletter-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  // TODO: connect member release notes to Medusa custom module or external CRM.
                  setNewsletterSubmitted(true);
                }}
              >
                <label htmlFor="footer-email" className="footer-newsletter-label">
                  Email address
                </label>
                <div className="footer-newsletter-row">
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Your email address"
                    aria-label="Email address"
                    className="footer-newsletter-input"
                  />
                  <button type="submit" className="footer-newsletter-button">
                    Request Access
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 border-t border-[rgba(200,164,93,0.25)] py-8 text-center text-[12px] font-light tracking-[0.03em] text-[rgba(241,232,216,0.72)] md:grid-cols-3 md:items-center md:py-9 md:text-left">
          <p>© 2026 NOIR &amp; OAK</p>
          <p className="md:text-center">Premium Dry Fruits</p>
          <p className="md:text-right">Pre-paid releases only</p>
        </div>
      </div>
    </footer>
  );
}

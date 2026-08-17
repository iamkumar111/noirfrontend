"use client";

import { useState, useEffect, useRef } from 'react';
import Link from '@/components/transitions/LuxuryLink';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

// ─── style constants ──────────────────────────────────────────────────────────
const NAV_LINK_BASE   = `nav-link text-[13px] tracking-[0.06em] font-[450] transition-colors duration-300`;
const NAV_LINK_IDLE   = `text-[rgba(245,235,221,0.70)]`;
const NAV_LINK_ACTIVE = `text-[#C9A45C] [text-shadow:0_0_14px_rgba(201,164,92,0.30)]`;
const NAV_LINK_HOVER  = `hover:text-[#E2C176] hover:[text-shadow:0_0_16px_rgba(201,164,92,0.28)]`;

function navLinkClass(isActive: boolean) {
  return `${NAV_LINK_BASE} ${NAV_LINK_HOVER} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}`;
}

export default function Header() {
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const pathname = usePathname();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const setCartOpen = useStore((state) => state.setCartOpen);
  const cart = useStore((state) => state.cart);
  const headerRef = useRef<HTMLElement>(null);
  const scrollPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 50;
      setIsScrolled((current) => current === next ? current : next);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile drawer whenever the route changes (belt-and-braces alongside
  // the per-link onClick, so a hardware back button or interceptor never leaves it open).
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMobileMenuOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  // While the full-screen drawer is open: lock body scroll and close on Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    scrollPosition.current = window.scrollY;
    const bodyStyle = document.body.style;
    const previous = { position: bodyStyle.position, top: bodyStyle.top, width: bodyStyle.width, overflow: bodyStyle.overflow };
    bodyStyle.position = 'fixed';
    bodyStyle.top = `-${scrollPosition.current}px`;
    bodyStyle.width = '100%';
    bodyStyle.overflow = 'hidden';
    const headerElement = headerRef.current;
    headerElement?.setAttribute('inert', '');
    document.querySelector('main')?.setAttribute('inert', '');
    document.querySelector('footer')?.setAttribute('inert', '');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      bodyStyle.position = previous.position;
      bodyStyle.top = previous.top;
      bodyStyle.width = previous.width;
      bodyStyle.overflow = previous.overflow;
      headerElement?.removeAttribute('inert');
      document.querySelector('main')?.removeAttribute('inert');
      document.querySelector('footer')?.removeAttribute('inert');
      window.scrollTo(0, scrollPosition.current);
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Origin',    path: '/our-story'  },
    { name: 'Collection', path: '/collection' },
    { name: 'Gifting',   path: '/gifting'    },
  ];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ── Navbar background: always present, stronger when scrolled ──────────────
  const headerBg = isScrolled
    ? 'bg-[#020202]/92 md:backdrop-blur-xl border-b border-[#C9A45C]/40 shadow-[0_12px_40px_rgba(0,0,0,0.55)] py-3 md:py-5'
    : 'md:backdrop-blur-[6px] border-b border-[#C9A45C]/25 shadow-[0_12px_40px_rgba(0,0,0,0.38)] py-3 md:py-7';

  const headerGradient = isScrolled
    ? {}
    : {
        background:
          'linear-gradient(180deg, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.72) 58%, rgba(3,3,3,0.00) 100%)',
      };

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header fixed top-0 w-full z-[20] transition-[background-color,border-color,padding,box-shadow] duration-300 ${headerBg}`}
        style={headerGradient}
      >
        <div className="max-w-[90rem] mx-auto px-6 md:px-16 flex justify-between items-center">

          {/* Mobile-only left spacer — mirrors the right-hand controls so the
              brand sits dead-centre on phones (desktop uses the real left nav). */}
          <div className="md:hidden w-1/3" aria-hidden="true" />

          {/* ── Left nav ────────────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-10 w-1/3">
            {navLinks.slice(0, 2).map((link) => (
              <div key={link.name} className="relative flex flex-col items-center gap-[5px]">
                <Link href={link.path} className={navLinkClass(pathname === link.path)}>
                  {link.name}
                </Link>
                {/* Active underline */}
                {pathname === link.path && (
                  <motion.span
                    layoutId="nav-underline"
                    className="h-[1px] w-5 bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent"
                  />
                )}
              </div>
            ))}
          </nav>

          {/* ── Brand centre ────────────────────────────────────────────────── */}
          <div className="w-1/3 flex justify-center">
            <Link
              href="/"
              className="font-serif tracking-[0.20em] md:tracking-[0.24em] text-[#E2C176] text-[1.15rem] md:text-[1.6rem]
                         hover:opacity-85 transition-opacity duration-500 flex flex-col items-center gap-1.5 md:gap-2 whitespace-nowrap"
              style={{ textShadow: '0 0 24px rgba(201,164,92,0.24)' }}
            >
              NOIR &amp; OAK
              <div
                className={`h-[1px] bg-gradient-to-r from-transparent via-[#C9A45C]/50 to-transparent
                             w-full origin-center transition-[transform,opacity] duration-300 ${isScrolled ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
              />
            </Link>
          </div>

          {/* ── Right nav ───────────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center justify-end gap-10 w-1/3">
            <div className="relative flex flex-col items-center gap-[5px]">
              <Link href="/gifting" className={navLinkClass(pathname === '/gifting')}>
                Gifting
              </Link>
              {pathname === '/gifting' && (
                <motion.span
                  layoutId="nav-underline"
                  className="h-[1px] w-5 bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent"
                />
              )}
            </div>

            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-[#C9A45C] hover:text-[#FDF5E6] transition-colors duration-500"
                >
                  <div className="w-6 h-6 rounded-full border border-[#C9A45C]/50 flex items-center justify-center text-[8px] bg-[#0A0A0A]">
                    {user.name.substring(0, 2).toUpperCase()}
                  </div>
                </Link>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full pt-4 w-48"
                    >
                      <div className="bg-[#050505] metallic-border p-4 flex flex-col gap-4 text-left shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
                        <Link href="/dashboard" className="text-[rgba(245,235,221,0.78)] hover:text-[#C9A45C] transition-colors text-[11px] tracking-[0.12em] uppercase">The Vault</Link>
                        <Link href="/wishlist"  className="text-[rgba(245,235,221,0.78)] hover:text-[#C9A45C] transition-colors text-[11px] tracking-[0.12em] uppercase">Saved Selection</Link>
                        <Link href="/orders"    className="text-[rgba(245,235,221,0.78)] hover:text-[#C9A45C] transition-colors text-[11px] tracking-[0.12em] uppercase">Reservations</Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="text-[#C9A45C] hover:text-[#FDF5E6] transition-colors text-[11px] tracking-[0.18em] uppercase">Admin Area</Link>
                        )}
                        <button
                          onClick={logout}
                          className="text-[rgba(245,235,221,0.40)] hover:text-[#E8E1D5] transition-colors text-left border-t border-white/5 pt-4 mt-2 text-[11px] tracking-[0.18em] uppercase"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <div className="relative flex flex-col items-center gap-[5px]">
                  <Link href="/vip-access" className={`${NAV_LINK_BASE} ${NAV_LINK_HOVER} ${pathname === '/vip-access' ? NAV_LINK_ACTIVE : 'text-[#C9A45C]'}`}>
                    VIP Access
                  </Link>
                  {pathname === '/vip-access' && (
                    <motion.span
                      layoutId="nav-underline"
                      className="h-[1px] w-5 bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent"
                    />
                  )}
                </div>
                <div className="relative flex flex-col items-center gap-[5px]">
                  <Link href="/login" className={navLinkClass(pathname === '/login')}>
                    Login
                  </Link>
                  {pathname === '/login' && (
                    <motion.span
                      layoutId="nav-underline"
                      className="h-[1px] w-5 bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent"
                    />
                  )}
                </div>
              </>
            )}

            {/* Cart / Reserve button */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 relative transition-colors duration-300
                         text-[rgba(245,235,221,0.70)] hover:text-[#C9A45C]
                         text-[11px] uppercase tracking-[0.2em] font-[500]
                         hover:[text-shadow:0_0_16px_rgba(201,164,92,0.28)]"
            >
              <span>Selection</span>
              <ShoppingBag
                size={15}
                strokeWidth={1.6}
                className="transition-colors duration-300"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 w-4 h-4 bg-[#C9A45C] text-[#050505] rounded-full flex items-center justify-center text-[8px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* ── Mobile controls ─────────────────────────────────────────────── */}
          <div className="md:hidden flex items-center justify-end gap-1.5 w-1/3">
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Open reserved cart${cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
              className="h-10 w-10 flex items-center justify-center text-[rgba(245,235,221,0.82)] hover:text-[#C9A45C] transition-colors relative"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A45C] text-[#050505] rounded-full flex items-center justify-center text-[8px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="h-10 w-10 flex items-center justify-center text-[rgba(245,235,221,0.82)] hover:text-[#C9A45C] transition-colors"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Menu Drawer ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[60] min-h-[100dvh] bg-[#020202] flex flex-col noise-bg overflow-y-auto"
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-[#C9A45C]/15">
              <span className="font-serif text-lg tracking-[0.18em] text-[#C9A45C]">NOIR &amp; OAK</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="h-11 w-11 flex items-center justify-center -mr-2 text-[rgba(245,235,221,0.82)] hover:text-[#C9A45C] transition-colors"
              >
                <X size={26} strokeWidth={1} />
              </button>
            </div>

            <nav className="flex flex-col px-7 py-8 gap-0 items-start justify-center flex-1 pb-safe">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="w-full border-b border-[rgba(200,164,93,0.14)]"
                >
                  <Link
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full py-4 font-serif text-[1.85rem] font-light tracking-[0.04em]
                      ${pathname === link.path ? 'text-[#C9A45C]' : 'text-[rgba(245,235,221,0.88)]'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <div className="my-6 text-[9px] uppercase tracking-[0.18em] text-[rgba(241,232,216,0.54)]">Member services</div>

              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-[12px] uppercase tracking-[0.14em] text-[rgba(245,235,221,0.84)] hover:text-[#C9A45C] transition-colors">The Vault</Link>
                  <Link href="/wishlist"  onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-[12px] uppercase tracking-[0.14em] text-[rgba(245,235,221,0.84)] hover:text-[#C9A45C] transition-colors">Saved Selection</Link>
                  <Link href="/orders"    onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-[12px] uppercase tracking-[0.14em] text-[rgba(245,235,221,0.84)] hover:text-[#C9A45C] transition-colors">Reservations</Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="mt-5 text-[11px] uppercase tracking-[0.14em] text-[rgba(245,235,221,0.58)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-[12px] uppercase tracking-[0.14em] text-[rgba(245,235,221,0.84)] hover:text-[#C9A45C] transition-colors">
                    Enter The Vault
                  </Link>
                  <Link
                    href="/vip-access"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-4 border border-[#C9A45C]/30 px-6 py-3 text-[12px] uppercase tracking-[0.14em] text-[#C9A45C] hover:bg-[#C9A45C]/10 transition-colors"
                  >
                    VIP Access
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from '@/components/transitions/LuxuryLink';
import { useStore } from '@/store/useStore';
import { useLuxuryNavigation } from '@/hooks/useLuxuryNavigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useStore((state) => state.login);
  const { navigate } = useLuxuryNavigation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    const accounts = {
      'vip@noiroak.com': { password: 'NoirVip@001', user: { id: '1', name: 'VIP Customer', email, role: 'vip' as const } },
      'premium@noiroak.com': { password: 'NoirPremium@001', user: { id: '2', name: 'Premium Member', email, role: 'premium' as const } },
      'admin@noiroak.com': { password: 'NoirAdmin@001', user: { id: '3', name: 'Admin Demo', email, role: 'admin' as const } },
    };
    const account = accounts[email as keyof typeof accounts];
    if (!account || account.password !== password) {
      setError('Access could not be verified. Check the email and password and try again.');
      setIsSubmitting(false);
      return;
    }
    const destination = account.user.role === 'admin' ? '/admin' : redirect;
    router.prefetch(destination);
    login(account.user);
    setSuccess(true);
    navigate(destination);
  };

  if (success) {
    return (
      <div role="status" className="flex min-h-[380px] flex-col justify-center">
        <p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Member verified</p>
        <h1 className="mt-4 font-serif text-4xl text-[#F1E8D8]">The Vault is opening.</h1>
        <p className="mt-4 text-sm font-light text-[rgba(241,232,216,0.72)]">Preparing your member preview and reservations.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-[9px] uppercase tracking-[0.14em] text-[#D9B86C]">Member login</p>
      <h1 className="mt-4 font-serif text-4xl text-[#F1E8D8]">Enter The Vault</h1>
      <p className="mt-4 text-sm font-light leading-relaxed text-[rgba(241,232,216,0.72)]">For members returning to view prices, saved pieces and Lot 1 reservations.</p>

      <form onSubmit={handleLogin} className="mt-8 space-y-6">
        {error && <div role="alert" className="border-l border-red-300/55 bg-red-950/15 px-4 py-3 text-sm text-red-100/80">{error}</div>}
        <div><label htmlFor="login-email" className="form-label">Email</label><input disabled={isSubmitting} id="login-email" required type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="luxury-input" /></div>
        <div><label htmlFor="login-password" className="form-label">Password</label><input disabled={isSubmitting} id="login-password" required type="password" name="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="luxury-input" /></div>
        <div className="flex items-center justify-between gap-4 text-xs text-[rgba(241,232,216,0.68)]">
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="accent-[#D9B86C]" />Remember me</label>
          <button type="button" className="min-h-11 border-b border-transparent hover:border-[#D9B86C]/35 hover:text-[#D9B86C]">Forgot password?</button>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-foil w-full disabled:opacity-55"><span className="btn-label">{isSubmitting ? 'Verifying access' : 'Enter The Vault'}</span></button>
      </form>

      <div className="mt-8 border-t border-[rgba(200,164,93,0.18)] pt-6">
        <p className="text-sm text-[rgba(241,232,216,0.68)]">Not yet a member? <Link href="/vip-access" className="border-b border-[#D9B86C]/35 text-[#D9B86C]">Request VIP Access</Link></p>
        <details className="mt-5 text-xs text-[rgba(241,232,216,0.62)]">
          <summary className="min-h-11 py-3 text-[10px] uppercase tracking-[0.12em] text-[rgba(241,232,216,0.58)]">Development demo credentials</summary>
          <div className="space-y-2 border-l border-[rgba(200,164,93,0.22)] pl-4 font-mono leading-relaxed">
            <p>vip@noiroak.com / NoirVip@001</p>
            <p>premium@noiroak.com / NoirPremium@001</p>
            <p>admin@noiroak.com / NoirAdmin@001</p>
          </div>
        </details>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="section-top relative z-10 flex min-h-screen items-center overflow-hidden bg-transparent px-5 pb-24 md:px-6 md:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_68%_35%,rgba(26,21,17,0.74)_0%,#050403_68%)]" />
      <div className="relative z-20 mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-12 md:items-center">
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85 }} className="hidden md:col-span-5 md:block">
          <p className="eyebrow mb-5 text-[#D9B86C]">Reserved collection</p>
          <h2 className="font-serif text-5xl leading-tight text-[#F1E8D8]">Return to your member preview.</h2>
          <dl className="mt-9 border-t border-[rgba(200,164,93,0.25)]">
            {[['Prices', 'View member pricing'], ['Selection', 'Return to saved pieces'], ['Reservations', 'Review Lot 1 status']].map(([label, value]) => <div key={label} className="grid grid-cols-[7rem_1fr] border-b border-[rgba(241,232,216,0.08)] py-4"><dt className="text-[9px] uppercase tracking-[0.12em] text-[#D9B86C]">{label}</dt><dd className="text-sm text-[rgba(241,232,216,0.72)]">{value}</dd></div>)}
          </dl>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.06 }} className="border border-[rgba(200,164,93,0.22)] bg-[#171512] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.58)] md:col-span-6 md:col-start-7 md:p-10 lg:p-12">
          <Suspense fallback={<p className="text-sm text-[#D9B86C]">Preparing member entry…</p>}><LoginForm /></Suspense>
        </motion.div>
      </div>
    </div>
  );
}

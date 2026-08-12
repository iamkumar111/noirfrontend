"use client";

import Link from 'next/link';
import { forwardRef } from 'react';
import { useLuxuryNavigation } from '@/hooks/useLuxuryNavigation';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface LuxuryLinkProps extends AnchorProps {
  href: string;
  replace?: boolean;
  /** Opt a single link out of the luxury transition. */
  noTransition?: boolean;
  children: React.ReactNode;
}

function isExternal(href: string) {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  );
}

/**
 * Drop-in replacement for next/link that plays the Golden Vault Passage
 * transition for internal navigations. External links, new-tab links, and
 * modified clicks behave exactly like a normal anchor.
 */
const LuxuryLink = forwardRef<HTMLAnchorElement, LuxuryLinkProps>(function LuxuryLink(
  { href, replace, noTransition, onClick, target, children, ...rest },
  ref,
) {
  const { navigate } = useLuxuryNavigation();
  const external = isExternal(href);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Let the browser handle these natively.
    if (noTransition || external) return;
    if (target && target !== '_self') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    e.preventDefault();
    navigate(href, { replace });
  };

  if (external) {
    return (
      <a ref={ref} href={href} target={target} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      target={target}
      replace={replace}
      onClick={handleClick}
      data-lux=""
      {...rest}
    >
      {children}
    </Link>
  );
});

export default LuxuryLink;

"use client";

import Link from "next/link";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function NavLink({ href, children, className = "", onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative font-display text-sm uppercase tracking-wider text-rusty-cream/90 ${className}`}
    >
      {children}
      <span
        className="absolute -bottom-1 left-0 h-0.5 w-full origin-right scale-x-0 bg-rusty-orange transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:origin-left group-hover:scale-x-100"
        aria-hidden
      />
    </Link>
  );
}

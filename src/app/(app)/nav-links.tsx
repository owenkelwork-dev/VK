"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" },
  { href: "/leads", label: "Leads", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
}

// Top menu on computers.
export function NavLinks() {
  const isActive = useIsActive();
  return (
    <nav className="hidden gap-1 md:flex">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            isActive(link.href) ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

// Bottom tab bar on phones — easy to reach with your thumb.
export function BottomNav() {
  const isActive = useIsActive();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
            isActive(link.href) ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
          </svg>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

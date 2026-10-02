"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Dashboard" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto">
      {LINKS.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap ${
              active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";

import { navigation } from "@/content/navigation";

export function Navbar() {
  return (
    <nav className="flex items-center gap-7">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-[15px] font-medium text-[#1a365d]/80 transition hover:text-secondary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

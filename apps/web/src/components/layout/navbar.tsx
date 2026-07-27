"use client";

import Link from "next/link";

import { navigation } from "@/content/navigation";

export function Navbar() {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="
            text-[15px]
            font-medium
            text-slate-700
            transition-all
            duration-300
            hover:text-primary
            hover:-translate-y-0.5
          "
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
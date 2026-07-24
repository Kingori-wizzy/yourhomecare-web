"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { Container } from "./container";

import { Navbar } from "./navbar";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <Container className="flex h-20 items-center justify-between">

        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <Navbar />

        {/* Desktop CTA + Mobile Menu */}
        <div className="flex items-center gap-4">
  
          <Link href="/appointments">
            <Button
              className="
                hidden
                lg:inline-flex
                h-11
                rounded-xl
                bg-black
                px-7
                font-semibold
                text-white
                shadow-md
                transition-all
                duration-300
                hover:bg-slate-800
                hover:shadow-lg
              "
            >
              Book Appointment
            </Button>
          </Link>

          {/* Mobile Menu */}
          <MobileMenu />

        </div>

      </Container>
    </header>
  );
}
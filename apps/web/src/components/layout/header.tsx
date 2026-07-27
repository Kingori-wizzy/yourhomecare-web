"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "./container";

import { Logo } from "@/components/common/logo";
import { Navbar } from "./navbar";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <Container className="flex h-[72px] items-center justify-between">

        <Logo />

        <Navbar />

        <div className="flex items-center gap-4">

          <Link href="/contact#assessment">
            <Button
              className="
                hidden
                rounded-xl
                bg-black
                px-6
                py-6
                text-sm
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:bg-slate-800
                hover:shadow-xl
                lg:inline-flex
              "
            >
              Book Assessment
            </Button>
          </Link>

          <MobileMenu />

        </div>

      </Container>
    </header>
  );
}
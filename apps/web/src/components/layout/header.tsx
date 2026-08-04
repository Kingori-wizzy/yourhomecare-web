"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "./container";
import { Logo } from "@/components/common/logo";
import { Navbar } from "./navbar";
import { MobileMenu } from "./mobile-menu";

interface HeaderProps {
  branding?: {
    name?: string;
    tagline?: string;
    logoUrl?: string;
  };
}

export function Header({ branding }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <Container className="relative flex h-[108px] items-center justify-between gap-4">
        <div className="z-10 shrink-0">
          <Logo logoUrl={branding?.logoUrl} name={branding?.name} />
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <Navbar />
        </div>

        <div className="z-10 flex items-center gap-3">
          <Link href="/appointments" className="hidden sm:block">
            <Button
              size="lg"
              className="h-11 rounded-[8px] bg-secondary px-5 text-sm font-semibold text-white hover:bg-secondary/90"
            >
              Book Assessment
            </Button>
          </Link>

          <Link
            href="/portal/login"
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#eff4ff] text-primary transition hover:border-secondary hover:text-secondary"
          >
            <UserRound className="h-4 w-4" />
          </Link>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}

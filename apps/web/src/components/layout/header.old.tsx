"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/common/logo";
import { Container } from "./container";

import { navigation } from "@/config/navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden gap-8 lg:flex">
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button className="hidden lg:flex">
            Book Care
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
          >
            <Menu size={22} />
          </Button>
        </div>
      </Container>
    </header>
  );
}
"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MobileMenu() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      aria-label="Open Menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation } from "@/content/navigation";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open Menu"
          />
        }
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full max-w-xs flex-col">
        <SheetHeader>
          <SheetTitle>YourHomeCare</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 px-4">
          {navigation.map((item) => (
            <SheetClose
              key={item.href}
              render={
                <Link
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-primary/10 hover:text-primary"
                  onClick={() => setOpen(false)}
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <SheetClose
            render={
              <Link
                href="/contact#assessment"
                className="block"
                onClick={() => setOpen(false)}
              />
            }
          >
            <Button className="w-full rounded-xl bg-black py-6 text-sm font-semibold text-white hover:bg-slate-800">
              Book Assessment
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

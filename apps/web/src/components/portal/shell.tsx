"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { HeartPulse, LogOut, Menu, Settings, User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import { getPortalPageTitle, PortalSidebarNav } from "@/components/portal/sidebar";
import { siteConfig } from "@/config/site";

export interface PortalUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  administrator: "Administrator",
  operations: "Operations",
  hr: "HR",
  marketing: "Marketing",
  content_manager: "Content Manager",
  read_only: "Read Only",
  admin: "Administrator",
  care_manager: "Operations",
  staff: "Staff",
};

function initials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

function SidebarBrand() {
  return (
    <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-4">
      <span className="flex size-9 items-center justify-center rounded-lg bg-[#0F6CBD] text-white">
        <HeartPulse className="size-5" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-bold text-slate-900">{siteConfig.name}</p>
        <p className="text-xs text-slate-500">Staff Portal</p>
      </div>
    </div>
  );
}

export function PortalShell({ user, children }: { user: PortalUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const title = getPortalPageTitle(pathname);
  const roleLabel = ROLE_LABELS[user.role ?? ""] ?? "Staff";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <SidebarBrand />
        <PortalSidebarNav role={user.role} />
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarBrand />
          <PortalSidebarNav role={user.role} onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:inline-flex">
              {roleLabel}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none">
                <Avatar size="sm">
                  <AvatarFallback className="bg-[#0F6CBD]/10 text-[#0F6CBD]">
                    {initials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-medium text-slate-900">{user.name ?? "Staff member"}</p>
                  <p className="truncate text-xs font-normal text-slate-500">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href="/portal/settings" />}
                >
                  <Settings className="size-4" />
                  Website settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/portal/users" />}>
                  <UserIcon className="size-4" />
                  Manage users
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: "/portal/login" })}
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FileBarChart,
  Users,
  HeartHandshake,
  CalendarClock,
  ClipboardCheck,
  Share2,
  MessageSquare,
  Briefcase,
  ListChecks,
  Newspaper,
  Handshake,
  Quote,
  Star,
  UsersRound,
  Wrench,
  Layers,
  HelpCircle,
  Mail,
  ImageIcon,
  FileStack,
  Search,
  Settings,
  Bell,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

import { canAccessModule, type AppRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  module: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/portal", module: "dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/portal/analytics", module: "analytics", icon: BarChart3 },
      { label: "Reports", href: "/portal/reports", module: "reports", icon: FileBarChart },
    ],
  },
  {
    label: "Care operations",
    items: [
      { label: "Patients", href: "/portal/patients", module: "patients", icon: HeartHandshake },
      { label: "Appointments", href: "/portal/appointments", module: "appointments", icon: CalendarClock },
      { label: "Assessments", href: "/portal/assessments", module: "assessments", icon: ClipboardCheck },
      { label: "Referrals", href: "/portal/referrals", module: "referrals", icon: Share2 },
      { label: "Contacts", href: "/portal/contacts", module: "contacts", icon: MessageSquare },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Users", href: "/portal/users", module: "users", icon: Users },
      { label: "Careers", href: "/portal/careers", module: "careers", icon: Briefcase },
      { label: "Jobs", href: "/portal/jobs", module: "jobs", icon: ListChecks },
      { label: "Team Management", href: "/portal/team", module: "team", icon: UsersRound },
    ],
  },
  {
    label: "Content & marketing",
    items: [
      { label: "Blog", href: "/portal/blog", module: "blog", icon: Newspaper },
      { label: "Partners", href: "/portal/partners", module: "partners", icon: Handshake },
      { label: "Testimonials", href: "/portal/testimonials", module: "testimonials", icon: Quote },
      { label: "Reviews", href: "/portal/reviews", module: "reviews", icon: Star },
      { label: "Services", href: "/portal/services", module: "services", icon: Wrench },
      { label: "Solutions", href: "/portal/solutions", module: "solutions", icon: Layers },
      { label: "FAQ", href: "/portal/faq", module: "faq", icon: HelpCircle },
      { label: "Newsletters", href: "/portal/newsletters", module: "newsletters", icon: Mail },
    ],
  },
  {
    label: "Website",
    items: [
      { label: "Media library", href: "/portal/media", module: "media", icon: ImageIcon },
      { label: "CMS pages", href: "/portal/cms", module: "cms", icon: FileStack },
      { label: "SEO", href: "/portal/seo", module: "seo", icon: Search },
      { label: "Website settings", href: "/portal/settings", module: "settings", icon: Settings },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Notifications", href: "/portal/notifications", module: "notifications", icon: Bell },
      { label: "System logs", href: "/portal/logs", module: "logs", icon: ScrollText },
    ],
  },
];

export function getPortalPageTitle(pathname: string): string {
  if (pathname === "/portal") return "Dashboard";

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href !== "/portal" && pathname.startsWith(item.href)) {
        return item.label;
      }
    }
  }

  return "Portal";
}

export function PortalSidebarNav({ role, onNavigate }: { role: AppRole | string | undefined; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => {
        const items = group.items.filter((item) => canAccessModule(role, item.module));
        if (items.length === 0) return null;

        return (
          <div key={group.label}>
            <p className="mb-1.5 px-2.5 text-[0.7rem] font-semibold tracking-wider text-slate-400 uppercase">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {items.map((item) => {
                const isActive =
                  item.href === "/portal" ? pathname === "/portal" : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#0F6CBD] text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

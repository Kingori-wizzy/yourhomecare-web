import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { Star, UsersRound } from "lucide-react";

import { Container } from "./container";

import { socials as officialSocials } from "@/content/socials";
import { routes } from "@/constants/routes";
import { getSiteSettings } from "@/server/cms";

const icons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
};

const footerGroups = [
  {
    title: "Company",
    links: [
      { href: routes.about, label: "About Us" },
      { href: routes.aboutTeam, label: "Meet the Team", icon: UsersRound },
      { href: routes.reviews, label: "Reviews", icon: Star },
      { href: routes.careers, label: "Careers" },
      { href: routes.partners, label: "Partners" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: routes.services, label: "Services" },
      { href: "/technology", label: "Tech" },
      { href: "/solutions", label: "Solutions" },
      { href: routes.blog, label: "Blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: routes.contact, label: "Contact Us" },
      { href: routes.appointments, label: "Book Assessment" },
      { href: routes.faq, label: "FAQs" },
      { href: routes.testimonials, label: "Testimonials" },
    ],
  },
] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();
  const socialLinks = settings.socials?.length ? settings.socials : officialSocials;

  return (
    <footer className="bg-primary text-white">
      <Container className="py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_auto] lg:items-start lg:gap-10">
          <div className="max-w-xs">
            <p className="text-base font-bold text-white">{settings.branding.name}</p>
            <p className="mt-1 text-xs text-white/65">{settings.branding.tagline}</p>
            <p className="mt-3 text-xs leading-5 text-white/60">
              {settings.contact.phone}
              <br />
              {settings.contact.email}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  {group.title}
                </p>
                <ul className="space-y-2">
                  {group.links.map((item) => {
                    const Icon = "icon" in item ? item.icon : undefined;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 text-sm text-white/85 transition hover:text-secondary"
                        >
                          {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:pt-7">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Social
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {socialLinks.map((social) => {
                const Icon = icons[social.icon as keyof typeof icons];
                if (!Icon) return null;

                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-secondary"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/50">
            &copy; {year} {settings.branding.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] text-white/50 transition hover:text-white/80"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

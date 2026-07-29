import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

import { FaTiktok } from "react-icons/fa6";

import { Container } from "./container";

import { navigation } from "@/content/navigation";
import { socials as officialSocials } from "@/content/socials";
import { getSiteSettings } from "@/server/cms";

const icons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
};

const extraPages = [
  { href: "/appointments", label: "Appointments" },
  { href: "/careers", label: "Careers" },
  { href: "/partners", label: "Partners" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();
  const socialLinks = settings.socials?.length ? settings.socials : officialSocials;

  const pageLinks = [
    ...navigation,
    ...extraPages.filter((page) => !navigation.some((nav) => nav.href === page.href)),
  ];

  return (
    <footer className="bg-primary text-white">
      <Container className="py-6 lg:py-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <p className="text-base font-bold text-white">{settings.branding.name}</p>
            <p className="mt-1 text-xs text-white/65">{settings.branding.tagline}</p>
            <p className="mt-3 text-xs leading-5 text-white/60">
              {settings.contact.phone}
              <br />
              {settings.contact.email}
            </p>
          </div>

          <div className="flex-1 lg:max-w-3xl lg:pl-8">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Pages
            </p>
            <div className="flex flex-wrap gap-2">
              {pageLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-8 items-center rounded-[8px] border border-white/15 bg-white/10 px-3 text-xs font-medium text-white/90 transition hover:border-secondary hover:bg-secondary hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 lg:pt-6">
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

        <p className="mt-5 border-t border-white/10 pt-4 text-[11px] text-white/50">
          &copy; {year} {settings.branding.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

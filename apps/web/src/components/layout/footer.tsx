import Image from "next/image";
import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import { Container } from "./container";

import { navigation } from "@/content/navigation";
import { getPublishedServices, getSiteSettings } from "@/server/cms";

const icons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
  twitter: FaXTwitter,
};

export async function Footer() {
  const [settings, services] = await Promise.all([getSiteSettings(), getPublishedServices()]);
  const year = new Date().getFullYear();
  const footerServices = services.slice(0, 6);

  return (
    <footer className="bg-slate-950 text-slate-300">
      <Container className="py-20">

        <div className="grid gap-14 lg:grid-cols-4">

          {/* Company */}

          <div>

            <Link
              href="/"
              className="flex items-center gap-4"
            >
              <Image
                src={settings.branding.logoUrl}
                alt={settings.branding.name}
                width={60}
                height={60}
                priority
              />

              <div>

                <h3 className="text-2xl font-bold text-white">
                  {settings.branding.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {settings.branding.tagline}
                </p>

              </div>

            </Link>

            <p className="mt-8 leading-7 text-slate-400">
              Delivering compassionate, technology-enabled healthcare wherever
              patients call home.
            </p>

          </div>

          {/* Navigation */}

          <div>

            <h4 className="mb-6 text-lg font-semibold text-white">
              Navigation
            </h4>

            <div className="space-y-3">

              {navigation.map((item) => (

                <Link
                  key={item.href}
                  href={item.href}
                  className="block transition duration-300 hover:text-primary"
                >
                  {item.label}
                </Link>

              ))}

            </div>

          </div>

          {/* Services */}

          <div>

            <h4 className="mb-6 text-lg font-semibold text-white">
              Our Services
            </h4>

            <div className="space-y-3 text-slate-400">

              {footerServices.map((service) => (
                <Link
                  key={service.id}
                  href="/services"
                  className="block transition duration-300 hover:text-primary"
                >
                  {service.name}
                </Link>
              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <h4 className="mb-6 text-lg font-semibold text-white">
              Contact Us
            </h4>

            <div className="space-y-3 text-slate-400">

              <p>{settings.contact.phone}</p>

              <p>{settings.contact.email}</p>

              <p>{settings.contact.address}</p>

            </div>

            <div className="mt-8 flex flex-wrap gap-3">

              {settings.socials.map((social) => {
                const Icon =
                  icons[social.icon as keyof typeof icons];

                if (!Icon) return null;

                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    aria-label={social.name}
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-800
                      text-slate-300
                      transition-all
                      duration-300
                      hover:bg-primary
                      hover:text-white
                      hover:scale-110
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-20 border-t border-slate-800 pt-8">

          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-slate-500 lg:flex-row">

            <p>
              &copy; {year} {settings.branding.name}. All rights reserved.
            </p>

            <p>
              Healthcare Beyond Hospital Walls
            </p>

          </div>

        </div>

      </Container>
    </footer>
  );
}

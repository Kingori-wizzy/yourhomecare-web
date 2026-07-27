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

import { company } from "@/content/company";
import { navigation } from "@/content/navigation";
import { socials } from "@/content/socials";

const icons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
  twitter: FaXTwitter,
};

export function Footer() {
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
                src="/branding/logo.png"
                alt="YourHomeCare"
                width={60}
                height={60}
                priority
              />

              <div>

                <h3 className="text-2xl font-bold text-white">
                  {company.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {company.tagline}
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

              <p>Home Nursing</p>

              <p>Palliative Care</p>

              <p>Elderly Care</p>

              <p>Caregiver Services</p>

              <p>Healthcare Staffing</p>

              <p>Rehabilitation Support</p>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h4 className="mb-6 text-lg font-semibold text-white">
              Contact Us
            </h4>

            <div className="space-y-3 text-slate-400">

              <p>{company.phone}</p>

              <p>{company.email}</p>

              <p>{company.address}</p>

            </div>

            <div className="mt-8 flex flex-wrap gap-3">

              {socials.map((social) => {
                const Icon =
                  icons[social.icon as keyof typeof icons];

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
              {company.copyright}
            </p>

            <p>
              Powered by{" "}
              <span className="font-semibold text-primary">
                TaskEase
              </span>
            </p>

          </div>

        </div>

      </Container>
    </footer>
  );
}
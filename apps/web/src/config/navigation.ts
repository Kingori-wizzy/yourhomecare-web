import { routes } from "@/constants/routes";

export const navigation = [
  {
    label: "Home",
    href: routes.home,
  },
  {
    label: "About",
    href: routes.about,
  },
  {
    label: "Services",
    href: routes.services,
  },
  {
    label: "Partners",
    href: routes.partners,
  },
  {
    label: "Testimonials",
    href: routes.testimonials,
  },
  {
    label: "Blog",
    href: routes.blog,
  },
  {
    label: "Careers",
    href: routes.careers,
  },
  {
    label: "FAQs",
    href: routes.faq,
  },
  {
    label: "Contact",
    href: routes.contact,
  },
] as const;
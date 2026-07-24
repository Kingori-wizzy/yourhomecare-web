import { company } from "@/content/company";

export const siteConfig = {
  name: company.name,

  description: company.description,

  url: "https://yourhomecare.co.ke",

  locale: "en-KE",

  email: "info@yourhomecare.co.ke",

  phone: "+254700000000",

  whatsapp: "+254700000000",

  logo: "/images/logo.svg",

  ogImage: "/images/og-image.jpg",
} as const;
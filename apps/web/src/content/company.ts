export const company = {
  name: "YourHomeCare",

  slogan: "Dignity • Compassion • Home.",

  tagline: "Compassionate Care. Right at Home.",

  description:
    "Bringing professional home healthcare services to individuals and families with dignity, compassion, and excellence.",

  founded: 2016,

  location: {
    city: "Nairobi",
    country: "Kenya",
  },

  hero: {
    title: "Professional Home Healthcare Services",

    subtitle:
      "Receive compassionate, high-quality care from experienced professionals in the comfort and familiarity of your own home.",

    primaryCTA: "Book a Consultation",

    secondaryCTA: "Explore Our Services",
  },

  mission:
    "To improve the quality of life for every client by delivering compassionate, personalized healthcare services in the comfort of their homes.",

  vision:
    "To become East Africa's most trusted provider of professional home healthcare services.",

  values: [
    "Compassion",
    "Respect",
    "Integrity",
    "Professionalism",
    "Excellence",
    "Patient-Centered Care",
  ],
} as const;

export type Company = typeof company;
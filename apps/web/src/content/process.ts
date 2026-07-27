import {
  PhoneCall,
  ClipboardCheck,
  House,
  HeartHandshake,
} from "lucide-react";

export const processContent = {
  badge: "Our Care Process",

  title: "Simple, Coordinated & Patient-Centred",

  description:
    "We make receiving professional healthcare at home straightforward. Our coordinated process ensures every patient receives safe, personalised and continuous care.",

  steps: [
    {
      number: "01",
      title: "Initial Consultation",
      description:
        "Speak with our care team to discuss the patient's needs, medical history and recovery goals.",
      icon: PhoneCall,
    },

    {
      number: "02",
      title: "Care Assessment & Planning",
      description:
        "Our clinicians create a personalised care plan and coordinate the right healthcare professionals.",
      icon: ClipboardCheck,
    },

    {
      number: "03",
      title: "Home Care Delivery",
      description:
        "Qualified nurses and caregivers provide professional healthcare services in the comfort of home.",
      icon: House,
    },

    {
      number: "04",
      title: "Continuous Monitoring & Support",
      description:
        "We monitor progress, communicate with families and healthcare partners, and adjust care when required.",
      icon: HeartHandshake,
    },
  ],
};
export interface ContactRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  category: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface AssessmentRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  patientName: string;
  patientAge: string;
  location: string;
  service: string;
  preferredDate?: string;
  preferredTime?: string;
  notes: string;
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  organisation: string;
  referrerName: string;
  patientName: string;
  phone: string;
  email: string;
  service: string;
  diagnosis: string;
  notes: string;
  createdAt: string;
}

export interface CareerRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  message: string;
  createdAt: string;
}

export interface NewsletterRecord {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
}

export interface PartnerRecord {
  id: string;
  name: string;
  category: string;
}

export interface TestimonialRecord {
  id: string;
  author: string;
  role: string;
  quote: string;
}

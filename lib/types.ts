export type PuppyBreed =
  | "Maltipoo"
  | "Pomeranian"
  | "Poodle"
  | "Cavapoo"
  | "Shih Tzu";

export type PuppyOrigin = "local" | "imported";
export type PuppyGender = "boy" | "girl";
export type PuppyStatus = "available" | "gone-home";

export interface Puppy {
  id: string;
  slug: string;
  name: string;
  breed: PuppyBreed;
  gender: PuppyGender;
  ageMonths: number;
  origin: PuppyOrigin;
  status: PuppyStatus;
  hasVideo: boolean;
  color: string;
  expectedWeightKg: number;
  microchipped: boolean;
  vaccinated: boolean;
  passportReady: boolean;
  priceAed: number;
  featured: boolean;
  images: string[];
  personality: string[];
  description: string;
  doorTheme?: "caramel" | "dark" | "warm";
}

export interface Testimonial {
  id: string;
  puppyName: string;
  breed: string;
  family: string;
  location: string;
  quote: string;
  photoUrl: string;
  caption: string;
  emoji: string;
  year: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "health" | "process" | "delivery" | "general";
}

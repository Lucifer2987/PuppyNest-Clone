export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappPrefillMessage: string;
  email: string;
  address: {
    street: string;
    city: string;
    country: string;
    display: string;
    mapUrl: string;
  };
  showroomHours: string;
  socials: {
    instagram: string;
    tiktok: string;
    youtube: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "PuppyNest",
  tagline: "every puppy is family",
  description:
    "Premium teacup puppies in Dubai. Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.",
  phone: "+971500000000",
  phoneDisplay: "+971 50 000 0000",
  whatsapp: "+971500000000",
  whatsappDisplay: "+971 50 000 0000",
  whatsappPrefillMessage: "Hi PuppyNest! I'd love to know more about your available teacup puppies.",
  email: "hello@example.com",
  address: {
    street: "Downtown Dubai Boulevard, Residence Suite 4B",
    city: "Dubai",
    country: "United Arab Emirates",
    display: "Downtown Dubai, UAE",
    mapUrl: "https://maps.google.com/?q=Downtown+Dubai+UAE",
  },
  showroomHours: "Mon - Sun: 10:00 AM - 9:00 PM (By Private Appointment)",
  socials: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
  },
};

export function getWhatsAppUrl(customMessage?: string): string {
  const cleanNumber = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(customMessage || siteConfig.whatsappPrefillMessage);
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

export function getPuppyWhatsAppUrl(puppyName: string, breed: string, slug: string): string {
  const msg = `Hi PuppyNest! I'm interested in ${puppyName} (the ${breed}). Is this puppy still available to visit or reserve? (Ref: /puppies/${slug})`;
  return getWhatsAppUrl(msg);
}

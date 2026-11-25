import React from "react";
import type { Metadata } from "next";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { siteConfig, getWhatsAppUrl } from "@/lib/config";
import { ChunkyButton } from "@/components/ChunkyButton";
import { ShowroomCard } from "@/components/contact/ShowroomCard";
import { LetterFormCard } from "@/components/contact/LetterFormCard";

export const metadata: Metadata = {
  title: "Visit Our Showroom & Contact Us | PuppyNest Dubai",
  description:
    "Visit our boutique puppy showroom in Downtown Dubai or write to our concierges. Schedule private cuddle sessions, ask about available breeds, or arrange VIP delivery across the UAE and worldwide.",
  alternates: {
    canonical: "https://puppynest.ae/contact",
  },
  openGraph: {
    title: "Visit Our Showroom & Contact Us | PuppyNest Dubai",
    description:
      "Get in touch with PuppyNest Dubai: Downtown showroom appointments, WhatsApp consultations, and adoption enquiry letters.",
    url: "https://puppynest.ae/contact",
    siteName: "PuppyNest",
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: "https://puppynest.ae/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PuppyNest Showroom & Contact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visit Our Showroom & Contact Us | PuppyNest Dubai",
    description: "Connect with PuppyNest: showroom visits and teacup puppy enquiries in Dubai.",
    images: ["https://puppynest.ae/og-image.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main className="w-full relative min-h-screen bg-gradient-to-b from-[#FFF7E6] via-[#FFF0D4] to-[#F6D79A] text-[#2A1A12] overflow-x-clip">
      {/* Faint Argyle Diamond Overlay on the top section */}
      <div
        className="absolute top-0 left-0 right-0 h-[650px] pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #2A1A12 0, #2A1A12 1px, transparent 0, transparent 50%),
                            repeating-linear-gradient(-45deg, #2A1A12 0, #2A1A12 1px, transparent 0, transparent 50%)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20 sm:pb-28">
        {/* Main 2-Column Responsive Layout (~40% Left / ~60% Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading, Contacts, and Showroom Awning Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Huge Heading in Two Lines */}
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.98] tracking-tight text-[#2A1A12]">
              <span className="block">Get in touch</span>
              <span className="block">with us</span>
            </h1>

            {/* Green WhatsApp Action Button */}
            <div>
              <ChunkyButton
                href={getWhatsAppUrl()}
                variant="whatsapp"
                size="md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 fill-current stroke-none" />
                <span>WhatsApp us {siteConfig.whatsappDisplay}</span>
              </ChunkyButton>
            </div>

            {/* Small Contact Rows: Call & Email */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-1 text-sm text-[#5A4030]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FFFDF8] border border-[#2A1A12]/30 flex items-center justify-center text-[#9A4F28] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block text-[#2A1A12]/60">
                    Call us
                  </span>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="font-bold text-[#2A1A12] hover:text-[#9A4F28] transition-colors"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#FFFDF8] border border-[#2A1A12]/30 flex items-center justify-center text-[#9A4F28] shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block text-[#2A1A12]/60">
                    Email
                  </span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="font-bold text-[#2A1A12] hover:text-[#9A4F28] transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Showroom Awning Card */}
            <div className="pt-4">
              <ShowroomCard />
            </div>
          </div>

          {/* Right Column: Intro Paragraph & Letter Form Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Intro paragraph aligned to right of heading */}
            <p className="font-body text-base sm:text-lg text-[#5A4030] leading-relaxed max-w-xl">
              Have questions about our puppies or adoption process? Fill out the form, and our team
              will get back to you promptly. Whether ready to adopt or just seeking info, we&apos;d love
              to hear from you!
            </p>

            {/* Letter Form Card with envelope flight animation and mascot */}
            <LetterFormCard />
          </div>
        </div>
      </div>

      {/* Soft Wavy Bottom Edge Transition into Dark Night Footer */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          className="relative block w-full h-8 sm:h-12 md:h-16 text-[#22120A]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </main>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NightSky } from "@/components/NightSky";
import { Mascot } from "@/components/Mascot";
import { ChunkyButton } from "@/components/ChunkyButton";
import { siteConfig, getWhatsAppUrl } from "@/lib/config";

const SLEEP_SPEECHES = [
  "sweet puppy dreams...",
  "dreaming of cuddles...",
  "home, at last ✨",
  "snoozing peacefully...",
];

export function Footer() {
  const [speechIndex, setSpeechIndex] = useState(0);

  // Rotate small speech bubble every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeechIndex((prev) => (prev + 1) % SLEEP_SPEECHES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const exploreLinks = [
    { label: "Available puppies", href: "/puppies" },
    { label: "Gone home", href: "/gone-home" },
    { label: "Happy families", href: "/happy-families" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Delivery & collection", href: "/how-it-works#delivery" },
    { label: "FAQ", href: "/faq" },
    { label: "Visit & contact", href: "/contact" },
  ];

  return (
    <footer
      data-mascot="footer"
      className="relative w-full bg-[#1A0E08] text-[#FFF3D9] border-t-2 border-[#FFF3D9]/20 pt-16 pb-20 sm:pb-16 overflow-hidden"
    >
      {/* Night Sky with Twinkling Stars & Glowing Crescent Moon Top-Right */}
      <NightSky showMoon={true} starCount={40} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* TOP SECTION: Heading "Home, at last." + Blurb + Sleeping Mascot in Basket */}
        <div className="border-b border-[#FFF3D9]/15 pb-12 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Heading & Brand Message */}
          <div className="lg:col-span-7">
            <span className="font-handwriting text-2xl text-[#F0B955] font-bold">
              the journey ends in warmth
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FFF3D9] tracking-tight mt-1 mb-4">
              Home, at last.
            </h2>
            <p className="text-sm sm:text-base text-[#D4C3B3] leading-relaxed max-w-xl">
              Dubai&apos;s premier boutique puppy nursery. Bringing healthy, certified teacup companions from trusted world-class breeders into loving palaces.
            </p>

            {/* Announcement information */}
            <div className="mt-4 inline-flex flex-wrap items-center gap-2 text-xs text-[#E9B965] bg-[#2A1A12] border border-[#E9B965]/25 rounded-full px-3.5 py-1.5 select-none">
              <span className="w-2 h-2 rounded-full bg-[#3A7D54] animate-pulse" />
              <span>Downtown Dubai Showroom open daily • Private appointments available</span>
              <span className="opacity-60 hidden sm:inline">|</span>
              <span className="opacity-90 hidden sm:inline">Worldwide VIP Nanny Delivery</span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <ChunkyButton href={getWhatsAppUrl()} variant="whatsapp" size="md">
                <MessageCircle className="w-4 h-4 fill-current stroke-none" />
                <span>Chat on WhatsApp</span>
              </ChunkyButton>
            </div>
          </div>

          {/* Right: Mascot sleeping in woven basket with floating ZZZ + speech bubble */}
          <div
            id="footer-mascot-basket"
            data-mascot-basket="true"
            className="lg:col-span-5 flex flex-col items-center sm:items-end justify-center relative"
          >
            {/* Small speech bubble appearing periodically */}
            <div className="relative mb-2 mr-6 sm:mr-10">
              <div className="bg-[#FFFDF8] text-[#2A1A12] border-2 border-[#2A1A12] px-3 py-1 rounded-2xl font-handwriting text-xs font-bold shadow-sticker tracking-wide speech-bubble-bottom animate-bounce">
                {SLEEP_SPEECHES[speechIndex]}
              </div>
            </div>

            {/* Sleeping Mascot in Woven Basket */}
            <div className="relative">
              <Mascot pose="sleep" size={175} />
            </div>
          </div>
        </div>

        {/* 3 COLUMNS: Links, Contacts, Social Pill Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          {/* Col 1: Explore Links (Gold column title) */}
          <div className="lg:col-span-4">
            <h3 className="font-display font-black text-lg text-[#F0B955] mb-4 uppercase tracking-wider">
              Explore PuppyNest
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D4C3B3]">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#F0B955] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Say Hello Contacts (Gold column title) */}
          <div className="lg:col-span-4">
            <h3 className="font-display font-black text-lg text-[#F0B955] mb-4 uppercase tracking-wider">
              Say Hello
            </h3>
            <ul className="space-y-3 text-sm text-[#D4C3B3]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F0B955] shrink-0 mt-0.5" />
                <span>{siteConfig.address.street}, {siteConfig.address.display}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F0B955] shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:underline">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F0B955] shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-xs text-[#E0A868] font-medium pt-1">
                {siteConfig.showroomHours}
              </li>
            </ul>
          </div>

          {/* Col 3: Outlined Pill Buttons for Socials */}
          <div className="lg:col-span-4">
            <h3 className="font-display font-black text-lg text-[#F0B955] mb-4 uppercase tracking-wider">
              Connect With Us
            </h3>
            <div className="flex flex-col gap-2.5">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2 rounded-full border-2 border-[#FFF3D9]/40 bg-[#FFFDF8]/5 text-xs font-bold text-[#FFF3D9] hover:bg-[#FFFDF8]/15 hover:border-[#F0B955] transition-all"
              >
                <span>Instagram @puppynest.dubai</span>
                <span className="text-sm">↗</span>
              </a>

              <a
                href={siteConfig.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2 rounded-full border-2 border-[#FFF3D9]/40 bg-[#FFFDF8]/5 text-xs font-bold text-[#FFF3D9] hover:bg-[#FFFDF8]/15 hover:border-[#F0B955] transition-all"
              >
                <span>TikTok @puppynest.ae</span>
                <span className="text-sm">↗</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between px-4 py-2 rounded-full border-2 border-[#FFF3D9]/40 bg-[#FFFDF8]/5 text-xs font-bold text-[#FFF3D9] hover:bg-[#FFFDF8]/15 hover:border-[#F0B955] transition-all"
              >
                <span>Facebook Community</span>
                <span className="text-sm">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM: Round Logo + Copyright + Thin Line + Gold handwritten quote */}
        <div className="pt-6 border-t border-[#FFF3D9]/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#D4C3B3]">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>© 2026 PuppyNest Dubai. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/faq" className="hover:underline">Health Guarantee</Link>
            <Link href="/how-it-works#delivery" className="hover:underline">VIP Travel</Link>
            <Link href="/contact" className="hover:underline">Showroom Policy</Link>
          </div>

          <div className="font-handwriting text-base sm:text-lg text-[#F0B955] font-bold tracking-wide select-none">
            every puppy is family
          </div>
        </div>
      </div>
    </footer>
  );
}

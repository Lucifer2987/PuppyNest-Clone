"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NightSky } from "@/components/NightSky";
import { Mascot } from "@/components/Mascot";
import { ChunkyButton } from "@/components/ChunkyButton";
import { siteConfig, getWhatsAppUrl } from "@/lib/config";
import {
  getGlobalFooterSleeping,
  subscribeFooterSleeping,
} from "@/hooks/useMascotPosition";

const SLEEP_SPEECHES = [
  "dreaming of cuddles...",
  "sweet puppy dreams...",
  "home, at last ✨",
  "snoozing peacefully...",
];

export function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const [isSleeping, setIsSleeping] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(1); // starts on "dreaming of cuddles..." (index 0)
  const [nudgeBubble, setNudgeBubble] = useState(false);
  const [squishKey, setSquishKey] = useState(0);

  useEffect(() => {
    setSpeechIndex(0);
    setIsSleeping(getGlobalFooterSleeping());
    return subscribeFooterSleeping((sleeping) => {
      setIsSleeping((prev) => {
        if (!prev && sleeping) {
          setSquishKey((k) => k + 1);
        }
        return sleeping;
      });
    });
  }, []);

  // Rotate speech bubble while sleeping
  useEffect(() => {
    if (!isSleeping) return;
    const timer = setInterval(() => {
      setSpeechIndex((prev) => (prev + 1) % SLEEP_SPEECHES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isSleeping]);

  const handleReducedMotionTap = () => {
    if (!isSleeping) return;
    setNudgeBubble(true);
    setTimeout(() => setNudgeBubble(false), 2000);
  };

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
      <NightSky showMoon={true} starCount={40} moonGlow={isSleeping} />

      {/* Note: no z-index on this wrapper so EmptyBasketBack (z-15) < FollowMascot (z-20) < EmptyBasketFront (z-25) share the root stacking context */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP SECTION: Heading "Home, at last." + Blurb + Empty Basket Target */}
        <div className="relative border-b border-[#FFF3D9]/15 pb-12 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Heading & Brand Message */}
          <div className="relative z-[5] lg:col-span-7">
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

          {/* Right: Empty Woven Basket (FollowMascot walks, hops in, and sleeps here) */}
          <div
            id="footer-mascot-basket"
            data-mascot-basket="true"
            className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center relative pt-6 lg:pt-4"
          >
            <div className="relative w-[140px] h-[112px] sm:w-[190px] sm:h-[152px] flex items-center justify-center">
              {/* Speech Bubble — hidden until puppy is settled & asleep in the basket */}
              <AnimatePresence>
                {isSleeping && (
                  <motion.div
                    key="footer-sleep-bubble"
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                    className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 z-[30] pointer-events-none"
                  >
                    <div className="bg-[#FFFDF8] text-[#2A1A12] border-2 border-[#2A1A12] px-3 py-1 rounded-2xl font-handwriting text-xs font-bold shadow-sticker tracking-wide speech-bubble-bottom whitespace-nowrap">
                      {nudgeBubble ? "5 more minutes..." : SLEEP_SPEECHES[speechIndex]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating "z z z" particles — hidden until puppy is asleep (fewer on mobile) */}
              <AnimatePresence>
                {isSleeping && !prefersReducedMotion && (
                  <motion.div
                    key="footer-zzz"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -top-5 right-3 sm:right-5 z-[30] pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    <div className="font-handwriting font-black text-base sm:text-xl text-[#F0B955] zzz-1">
                      z
                    </div>
                    <div className="hidden sm:block absolute -top-5 -right-3 font-handwriting font-black text-2xl text-[#C98B4D] zzz-2">
                      Z
                    </div>
                    <div className="absolute -top-7 sm:-top-10 -right-5 font-handwriting font-black text-xl sm:text-3xl text-[#FFF3D9] zzz-3">
                      z
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Squish wrapper on landing/settle */}
              <motion.div
                key={squishKey}
                initial={squishKey > 0 && !prefersReducedMotion ? { scaleY: 0.92, scaleX: 1.04 } : false}
                animate={{ scaleY: 1, scaleX: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
                className="relative w-full h-full"
              >
                {/* LAYER 1 (Back, z-15): Shadow + Back Basket Rim + Soft Cream Cushion */}
                <svg
                  viewBox="0 0 180 144"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full overflow-visible z-[15] pointer-events-none"
                  aria-hidden="true"
                >
                  {/* Ground shadow */}
                  <ellipse cx="90" cy="134" rx="68" ry="9" fill="#120904" opacity="0.55" />

                  {/* Inner dark basket back rim */}
                  <ellipse cx="90" cy="84" rx="62" ry="22" fill="#5A3516" stroke="#2A1A12" strokeWidth="3" />

                  {/* Soft Cream Cushion Pillow inside */}
                  <ellipse cx="90" cy="88" rx="54" ry="18" fill="#FFF1D0" stroke="#2A1A12" strokeWidth="2.5" />
                  <ellipse cx="90" cy="89" rx="42" ry="12" fill="#FBE5B6" opacity="0.7" />
                </svg>

                {/* Invisible Anchor at Center of Cushion for FollowMascot */}
                <div
                  data-mascot-anchor="footer-basket"
                  className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Reduced-motion fallback: fade sleeping puppy directly inside basket */}
                {prefersReducedMotion && isSleeping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    onClick={handleReducedMotionTap}
                    data-mascot-visible="true"
                    className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-[20] cursor-pointer"
                  >
                    <Mascot
                      pose="sleep"
                      peekOneEye={nudgeBubble}
                      isExcited={nudgeBubble}
                      size={112}
                    />
                  </motion.div>
                )}

                {/* LAYER 3 (Front, z-25): Woven Basket Front Body & Front Rim (overlaps puppy) */}
                <svg
                  viewBox="0 0 180 144"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full overflow-visible z-[25] pointer-events-none"
                  aria-hidden="true"
                >
                  {/* Woven Basket Front Bowl */}
                  <path
                    d="M28 84 C24 114, 36 132, 90 132 C144 132, 156 114, 152 84 C135 96, 114 100, 90 100 C66 100, 45 96, 28 84 Z"
                    fill="#8B5226"
                    stroke="#2A1A12"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  {/* Basket weave criss-cross texture */}
                  <g stroke="#5A3516" strokeWidth="1.8" opacity="0.65">
                    <path d="M44 91 L58 128 M72 98 L86 131 M102 98 L116 130 M130 92 L140 120" />
                    <path d="M136 91 L122 128 M108 98 L94 131 M78 98 L64 130 M50 92 L40 120" />
                  </g>
                  {/* Front Basket Thick Rim */}
                  <path
                    d="M25 83 C43 97, 65 101, 90 101 C115 101, 137 97, 155 83"
                    stroke="#2A1A12"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M27 86 C45 99, 66 103, 90 103 C114 103, 135 99, 153 86"
                    stroke="#C98B4D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.5"
                    fill="none"
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 3 COLUMNS: Links, Contacts, Social Pill Buttons */}
        <div className="relative z-[5] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
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
        <div className="relative z-[5] pt-6 border-t border-[#FFF3D9]/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#D4C3B3]">
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

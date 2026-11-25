"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Heart,
  Calendar,
  Truck,
  Sparkles,
  Plane,
  FileCheck2,
  Home,
  CheckCircle2,
} from "lucide-react";
import { Mascot } from "@/components/Mascot";
import {
  claimMascotOwnership,
  releaseMascotOwnership,
  triggerExcitedMascot,
} from "@/hooks/useMascotPosition";
import { cn } from "@/lib/utils";

export function TwoWaysHomeSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial tab from query param ?way=dubai or ?way=imported
  const initialWay = searchParams.get("way") === "imported" ? "imported" : "dubai";
  const [activeWay, setActiveWay] = useState<"dubai" | "imported">(initialWay);
  const [isHopping, setIsHopping] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  // Claim mascot ownership for the interactive toggle only when in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (visible) {
          claimMascotOwnership("how-it-works-toggle");
        } else {
          releaseMascotOwnership("how-it-works-toggle");
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      releaseMascotOwnership("how-it-works-toggle");
    };
  }, []);

  // Sync state if URL query changes
  useEffect(() => {
    const way = searchParams.get("way");
    if (way === "imported" || way === "dubai") {
      setActiveWay(way);
    }
  }, [searchParams]);

  const handleToggle = (way: "dubai" | "imported") => {
    if (activeWay === way) return;
    setIsHopping(true);
    setActiveWay(way);
    triggerExcitedMascot();

    // Mirror in URL without scroll jump
    const url = new URL(window.location.href);
    url.searchParams.set("way", way);
    window.history.replaceState({}, "", url.toString());

    setTimeout(() => setIsHopping(false), 450);
  };

  const stepsDubai = [
    {
      num: 1,
      title: "Explore our puppies",
      desc: "Browse our website to view available puppies. Each listing includes photos, breed details, age, and health information.",
      icon: Compass,
      badgeColor: "bg-[#FFE8DC] text-[#B85C28]", // Peach
    },
    {
      num: 2,
      title: "Choose your puppy",
      desc: "Once you find a puppy you love, open their profile for more information or reach out directly to our team.",
      icon: Heart,
      badgeColor: "bg-[#FDE2EC] text-[#B83262]", // Pink
    },
    {
      num: 3,
      title: "Meet before you choose",
      desc: "Spend time cuddling and bonding in our Downtown Dubai showroom private lounge before finalizing your choice.",
      icon: Sparkles,
      badgeColor: "bg-[#EAE4FD] text-[#6339B8]", // Lavender
    },
    {
      num: 4,
      title: "Pick-up or delivery",
      desc: "Pick up your puppy from our showroom or have them brought to your door via our safe, climate-controlled pet taxi.",
      icon: Truck,
      badgeColor: "bg-[#E1F6ED] text-[#288258]", // Mint
    },
  ];

  const stepsImported = [
    {
      num: 1,
      title: "Tell us your dream breed",
      desc: "Share your desired breed, coat color, size, and personality with our dedicated concierge consultants.",
      icon: Compass,
      badgeColor: "bg-[#FFE8DC] text-[#B85C28]",
    },
    {
      num: 2,
      title: "Photos and health details",
      desc: "Receive unfiltered 4K video clips, international veterinarian inspection reports, and parental lineage confirmation.",
      icon: FileCheck2,
      badgeColor: "bg-[#FDE2EC] text-[#B83262]",
    },
    {
      num: 3,
      title: "Reserve and travel prep",
      desc: "Secure your puppy while we finalize temperature-controlled cabin reservations, export permits, and passport documentation.",
      icon: Plane,
      badgeColor: "bg-[#EAE4FD] text-[#6339B8]",
    },
    {
      num: 4,
      title: "Safe arrival in Dubai",
      desc: "Welcome your puppy at DXB airport with our VIP pet nanny or at our showroom after health clearance.",
      icon: Home,
      badgeColor: "bg-[#E1F6ED] text-[#288258]",
    },
  ];

  const activeSteps = activeWay === "dubai" ? stepsDubai : stepsImported;

  return (
    <section id="ways" ref={sectionRef} className="w-full py-12 sm:py-16 md:py-20 select-none">
      {/* 1. Header with Label, Heading & Segmented Toggle on Right */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div>
          <span className="font-handwriting text-lg sm:text-xl text-[#9A4F28] font-bold tracking-wide block mb-1">
            choose your way
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight">
            Two ways home
          </h2>
        </div>

        {/* Big Segmented Toggle with Mascot sitting on top */}
        <div className="relative pt-12 self-start md:self-auto">
          {/* Mascot Sitting on Top of Toggle with "psst" speech bubble */}
          {isInView && (
            <motion.div
              animate={{
                x: activeWay === "dubai" ? 18 : 142,
                y: isHopping ? -16 : 0,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="absolute top-0 left-0 flex flex-col items-center pointer-events-none z-20"
            >
              {/* Small speech bubble "psst" */}
              <div className="hidden sm:block mb-0.5 px-2 py-0.5 rounded-full bg-[#FFFDF8] border border-[#2A1A12] text-[10px] font-handwriting font-bold text-[#2A1A12] shadow-xs">
                psst! 🐾
              </div>
              {/* Cute Sitting Mascot */}
              <Mascot pose="sit" size={54} />
            </motion.div>
          )}

          {/* Segmented Toggle Box */}
          <div
            role="tablist"
            aria-label="Adoption channels"
            className="relative h-14 p-1.5 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] shadow-[4px_4px_0_#2A1A12] flex items-center gap-1.5"
          >
            {/* Option 1: In Dubai */}
            <button
              type="button"
              role="tab"
              aria-selected={activeWay === "dubai"}
              onClick={() => handleToggle("dubai")}
              className={cn(
                "h-full px-5 sm:px-6 rounded-full flex flex-col items-center justify-center transition-all select-none focus:outline-none",
                activeWay === "dubai"
                  ? "bg-[#9A4F28] text-white shadow-xs font-bold"
                  : "text-[#2A1A12] hover:bg-[#2A1A12]/5 font-semibold"
              )}
            >
              <span className="text-xs sm:text-sm leading-none font-body font-bold">
                In Dubai
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight mt-0.5",
                  activeWay === "dubai" ? "text-[#FFE8DC]" : "text-[#7A6355]"
                )}
              >
                visit in person
              </span>
            </button>

            {/* Option 2: Imported */}
            <button
              type="button"
              role="tab"
              aria-selected={activeWay === "imported"}
              onClick={() => handleToggle("imported")}
              className={cn(
                "h-full px-5 sm:px-6 rounded-full flex flex-col items-center justify-center transition-all select-none focus:outline-none",
                activeWay === "imported"
                  ? "bg-[#9A4F28] text-white shadow-xs font-bold"
                  : "text-[#2A1A12] hover:bg-[#2A1A12]/5 font-semibold"
              )}
            >
              <span className="text-xs sm:text-sm leading-none font-body font-bold">
                Imported
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium leading-tight mt-0.5",
                  activeWay === "imported" ? "text-[#FFE8DC]" : "text-[#7A6355]"
                )}
              >
                order upon request
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Content Area (Swaps with smooth cross-fade & slide 0.4s) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWay}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col gap-10"
        >
          {/* Top Row: Description on Left / Framed Illustration Card on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Description */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#2A1A12] tracking-tight">
                {activeWay === "dubai" ? "Meet your puppy in person" : "Imported for you"}
              </h3>

              <p className="font-body text-sm sm:text-base text-[#5A4030] leading-relaxed">
                {activeWay === "dubai"
                  ? "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks."
                  : "Order upon request from premier international breeders in Seoul and worldwide. We handle all travel logistics, private veterinary clearances, temperature-controlled transit, and safe VIP handover directly into your home."}
              </p>
            </div>

            {/* Right: Framed Illustration Card (2.5px outline, 22px radius, cream fill, hard shadow) */}
            <div className="lg:col-span-6">
              <div className="relative w-full h-[220px] sm:h-[260px] rounded-[22px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[5px_5px_0_#2A1A12] overflow-hidden p-4 flex flex-col justify-between">
                {/* Top Label */}
                <div className="relative z-10">
                  <span className="font-handwriting text-xs sm:text-sm text-[#7A6355] font-bold">
                    {activeWay === "dubai" ? "Downtown, Dubai" : "Seoul → Dubai VIP Route"}
                  </span>
                </div>

                {/* ORIGINAL SVG ILLUSTRATION */}
                {activeWay === "dubai" ? (
                  /* Original Dubai Skyline with Rising Sun */
                  <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                    {/* Glowing Sun Circle */}
                    <div className="absolute top-8 right-16 w-20 h-20 rounded-full bg-[#FCE7BE] border-2 border-[#2A1A12]/30 shadow-xs" />

                    {/* Architectural Line-Art Skyline */}
                    <svg
                      viewBox="0 0 600 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-auto max-h-[160px] opacity-85"
                    >
                      {/* Burj-Style Spire */}
                      <path
                        d="M290 200 V70 L297 30 L300 10 L303 30 L310 70 V200"
                        stroke="#2A1A12"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <line x1="295" y1="70" x2="305" y2="70" stroke="#2A1A12" strokeWidth="2" />
                      <line x1="297" y1="110" x2="303" y2="110" stroke="#2A1A12" strokeWidth="2" />

                      {/* Surrounding Tower 1 */}
                      <rect x="220" y="90" width="45" height="110" rx="3" stroke="#2A1A12" strokeWidth="2.2" fill="#FFFDF8" />
                      <line x1="230" y1="105" x2="255" y2="105" stroke="#2A1A12" strokeWidth="1.5" />
                      <line x1="230" y1="125" x2="255" y2="125" stroke="#2A1A12" strokeWidth="1.5" />
                      <line x1="230" y1="145" x2="255" y2="145" stroke="#2A1A12" strokeWidth="1.5" />

                      {/* Surrounding Tower 2 */}
                      <rect x="335" y="80" width="40" height="120" rx="3" stroke="#2A1A12" strokeWidth="2.2" fill="#FFFDF8" />
                      <path d="M335 80 L355 55 L375 80" stroke="#2A1A12" strokeWidth="2" />

                      {/* Low-rise modern villas & palms */}
                      <rect x="150" y="130" width="50" height="70" rx="2" stroke="#2A1A12" strokeWidth="2" fill="#FFFDF8" />
                      <rect x="395" y="120" width="55" height="80" rx="2" stroke="#2A1A12" strokeWidth="2" fill="#FFFDF8" />
                      <line x1="40" y1="200" x2="560" y2="200" stroke="#2A1A12" strokeWidth="3" />
                    </svg>
                  </div>
                ) : (
                  /* Original Flight Path: Korea to Dubai */
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                      viewBox="0 0 600 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full p-4"
                    >
                      {/* Origin Dot: Korea */}
                      <circle cx="80" cy="140" r="7" fill="#9A4F28" stroke="#2A1A12" strokeWidth="2" />
                      <text x="80" y="170" fill="#2A1A12" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        Korea
                      </text>

                      {/* Destination Dot: Dubai */}
                      <circle cx="520" cy="140" r="7" fill="#3A7D54" stroke="#2A1A12" strokeWidth="2" />
                      <text x="520" y="170" fill="#2A1A12" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                        Dubai
                      </text>

                      {/* Dashed Flight Arc */}
                      <path
                        d="M80 140 Q300 20 520 140"
                        stroke="#2A1A12"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                      />

                      {/* Flying Airplane along the arc */}
                      <g transform="translate(300, 75) rotate(10)">
                        <path
                          d="M-20 -5 L15 -5 L25 0 L15 5 L-20 5 L-26 12 L-22 0 L-26 -12 Z"
                          fill="#FFFDF8"
                          stroke="#2A1A12"
                          strokeWidth="2.5"
                        />
                        <path d="M-5 -5 L5 -18 L12 -5" fill="#FFFDF8" stroke="#2A1A12" strokeWidth="2" />
                        <path d="M-5 5 L5 18 L12 5" fill="#FFFDF8" stroke="#2A1A12" strokeWidth="2" />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4 Step Cards in a Row (Desktop connected by dotted line / Mobile stacked) */}
          <div className="relative">
            {/* Desktop Dotted Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 border-t-2 border-dashed border-[#C98B4D]/50 -translate-y-1/2 z-0 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
              {activeSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.num}
                    className="relative bg-[#FFFDF8] rounded-[16px] border-2 border-[#2A1A12] p-5 shadow-[3px_3px_0_#2A1A12] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_#2A1A12] group"
                  >
                    <div>
                      {/* Top Row: Colored Icon Badge & Step Number */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full border border-[#2A1A12] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105",
                            step.badgeColor
                          )}
                        >
                          <IconComponent className="w-4 h-4 stroke-[2.4]" />
                        </div>

                        <span className="font-handwriting text-xs text-[#7A6355] font-bold">
                          Step {step.num}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-body font-bold text-sm sm:text-[15px] text-[#2A1A12] leading-snug mb-1.5">
                        {step.title}
                      </h4>

                      {/* Description */}
                      <p className="font-body text-xs text-[#5A4030] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

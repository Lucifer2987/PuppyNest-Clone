"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import { Heart, Plane, MessageCircle, Globe, ShieldCheck, Sun } from "lucide-react";
import { WavyUnderline } from "@/components/WavyUnderline";
import { ScrollRevealText, ScrollFadeUp } from "@/components/ScrollRevealText";
import { PawIcon } from "@/components/PawTrail";
import { cn } from "@/lib/utils";

const STAMPS = [
  {
    id: 1,
    title: "Vet-checked & healthy",
    caption: "Full multi-panel veterinary check, core vaccines, microchip registered with Dubai municipality.",
    icon: Heart,
    shape: "round",
    color: "border-[#9A4F28] text-[#9A4F28]",
    stampCode: "HEALTH • PASSED",
    rot: -4,
  },
  {
    id: 2,
    title: "Korea to Dubai, safely",
    caption: "In-cabin pressurized travel with dedicated flight nanny. Never in commercial luggage holds.",
    icon: Plane,
    shape: "rect",
    color: "border-[#3A7D54] text-[#3A7D54]",
    stampCode: "VIP CABIN • SEOUL-DXB",
    rot: 5,
  },
  {
    id: 3,
    title: "Support 24/7",
    caption: "Lifelong post-adoption care guidance from pediatric veterinary specialists and trainers.",
    icon: MessageCircle,
    shape: "round",
    color: "border-[#C8502A] text-[#C8502A]",
    stampCode: "CARE 24/7 • LIFETIME",
    rot: -6,
  },
  {
    id: 4,
    title: "Trusted by families worldwide",
    caption: "Over 500+ healthy, happy teacup puppies welcomed into loving homes across the GCC.",
    icon: Globe,
    shape: "dotted-round",
    color: "border-[#2A1A12] text-[#2A1A12]",
    stampCode: "OFFICIAL • VERIFIED",
    rot: 3,
  },
];

export function PassportBook() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(bookRef, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Setting sun and skyline rising from bottom as background goes darker
  const sunY = useTransform(scrollYProgress, [0.3, 0.85], [80, 0]);
  const skylineY = useTransform(scrollYProgress, [0.3, 0.85], [60, 0]);

  return (
    <section
      ref={sectionRef}
      data-mascot="passport"
      className="relative w-full py-20 sm:py-28 overflow-hidden bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* THE OPEN PASSPORT BOOK */}
        <div
          ref={bookRef}
          className="relative rounded-[36px] border-[4px] border-[#2A1A12] bg-[#55392B] p-2.5 sm:p-4 shadow-chunky-lg"
        >
          {/* Leather Brown Outer Border Spine */}
          <div className="relative rounded-[28px] bg-[#FFF8EA] border-2 border-[#2A1A12] overflow-hidden grid grid-cols-1 md:grid-cols-2">
            {/* Center Spine Crease Shadow on Desktop */}
            <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/15 via-black/30 to-black/15 z-20 pointer-events-none" />

            {/* LEFT PAGE: Passport Title, Seal, Intro */}
            <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r border-[#2A1A12]/20 relative bg-[#FFFDF8]">
              {/* Security Watermark Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-wrap gap-8 p-6 select-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <PawIcon key={i} size={32} fill="#2A1A12" />
                ))}
              </div>

              <div className="relative z-10">
                <div className="inline-flex flex-col items-start mb-3">
                  <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
                    puppy passport
                  </span>
                  <WavyUnderline className="w-36 mt-0.5" />
                </div>

                <ScrollRevealText
                  as="h2"
                  className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#2A1A12] tracking-tight leading-tight"
                >
                  {"Why families\ntrust PuppyNest"}
                </ScrollRevealText>

                <p className="mt-4 text-sm sm:text-base text-[#5A4030] leading-relaxed">
                  Every puppy is issued an official certified health passport. We guarantee supreme genetic lineage, complete health testing, and an unbreakable standard of animal ethics.
                </p>
              </div>

              {/* Gold foil passport emblem */}
              <div className="mt-8 pt-6 border-t border-[#2A1A12]/15 flex items-center justify-between text-xs text-[#2A1A12] font-semibold relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F0B955] border-2 border-[#2A1A12] flex items-center justify-center text-[#2A1A12] font-black">
                    ★
                  </div>
                  <div>
                    <span className="block font-bold">Official Entry Visa</span>
                    <span className="text-[10px] text-gray-500 font-mono">DXB-MUNICIPALITY-REG</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[#9A4F28]">DOC: PN-2026</span>
              </div>
            </div>

            {/* RIGHT PAGE: 4 Slamming Stamps */}
            <div className="p-6 sm:p-10 md:p-12 bg-[#FFF8EA] relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {STAMPS.map((stamp, idx) => {
                  const Icon = stamp.icon;

                  return (
                    <motion.div
                      key={stamp.id}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 1.5, rotate: -15 }
                      }
                      animate={
                        isInView
                          ? { opacity: 1, scale: 1, rotate: stamp.rot }
                          : prefersReducedMotion
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 1.5, rotate: -15 }
                      }
                      transition={{
                        duration: 0.45,
                        ease: [0.175, 0.885, 0.32, 1.275], // Punchy stamp slam with bounce
                        delay: 0.15 + idx * 0.14,
                      }}
                      className="rounded-2xl border-2 border-dashed border-[#2A1A12]/30 bg-[#FFFDF8] p-4 flex flex-col justify-between shadow-sm relative group hover:scale-105 transition-transform"
                    >
                      {/* Stamp badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFF8EA] border-2 border-[#2A1A12] flex items-center justify-center text-[#9A4F28]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={cn(
                            "font-handwriting text-[10px] sm:text-[11px] font-black uppercase px-2 py-0.5 border-2 rounded-md tracking-wider transform select-none",
                            stamp.color
                          )}
                        >
                          {stamp.stampCode}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display font-black text-sm sm:text-base text-[#2A1A12] leading-snug">
                          {stamp.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-[#5A4030] leading-relaxed">
                          {stamp.caption}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-dashed border-[#2A1A12]/15 flex justify-end">
                        <PawIcon size={12} fill="#9A4F28" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Setting Sun & Line-art Dubai Skyline Silhouette rising from bottom */}
        <div className="relative w-full mt-12 overflow-hidden h-36 flex items-end justify-center pointer-events-none select-none">
          {/* Setting Sun */}
          <motion.div
            style={{ y: prefersReducedMotion ? 0 : sunY }}
            className="absolute bottom-6 w-28 h-28 rounded-full bg-gradient-to-t from-[#E07A4A] to-[#F0B955] opacity-60 blur-xs"
          />

          {/* Dubai Skyline Silhouette line art */}
          <motion.div
            style={{ y: prefersReducedMotion ? 0 : skylineY }}
            className="w-full max-w-4xl h-24 text-[#2A1A12] opacity-25"
          >
            <svg viewBox="0 0 800 120" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              {/* Spire Burj Khalifa */}
              <path d="M400 5V120 M396 30H404 M392 60H408 M385 85H415 M375 110H425" />
              {/* Adjacent highrises */}
              <path d="M300 45V120 M280 65V120 M330 55V120 M470 50V120 M500 70V120 M530 40V120" />
              {/* Ground horizon */}
              <path d="M0 118H800" strokeWidth="3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

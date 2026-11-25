"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageCircle,
  CheckCheck,
  Send,
  Search,
  FileCheck2,
  ShieldCheck,
  Home,
  MapPin,
  Sparkles,
} from "lucide-react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { ScrollRevealText, ScrollFadeUp } from "@/components/ScrollRevealText";
import { Mascot } from "@/components/Mascot";
import { PawIcon } from "@/components/PawTrail";
import { getWhatsAppUrl } from "@/lib/config";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    num: "01",
    title: "Choose your breed",
    desc: "Browse our handpicked teacup Maltipoos, Pomeranians, Poodles, and Cavapoos online or ask our concierge for personalized recommendations tailored to your home and lifestyle.",
    icon: Search,
  },
  {
    num: "02",
    title: "Get photos & details",
    desc: "Receive unfiltered 4K video clips, international veterinary health certificates, microchip confirmation, and behavioral assessments directly on WhatsApp within minutes.",
    icon: FileCheck2,
  },
  {
    num: "03",
    title: "Secure & safe delivery",
    desc: "Visit our Downtown Dubai showroom for an unhurried cuddle session, or enjoy door-to-door temperature-controlled delivery with a starter luxury kit and 24/7 care guidance.",
    icon: ShieldCheck,
  },
];

const BREED_CHIPS = ["Maltipoo", "Pomeranian", "Poodle", "Cavapoo", "Shih Tzu"];

export function JourneyChatPhone() {
  const sectionRef = useRef<HTMLElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Track scroll position to set active step 1, 2, or 3
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest < 0.42) {
        setActiveStep(1);
      } else if (latest < 0.68) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      data-mascot="journey"
      className="relative w-full py-20 sm:py-28 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              from our arms to yours
            </span>
            <WavyUnderline className="w-40 mt-0.5" />
          </div>
          <ScrollRevealText
            as="h2"
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2A1A12] tracking-tight"
          >
            Your puppy journey
          </ScrollRevealText>
          <ScrollFadeUp
            delay={0.15}
            className="mt-3 text-base sm:text-lg text-[#5A4030]"
          >
            Three effortless steps designed with utmost care, hygiene, and transparency.
          </ScrollFadeUp>
        </div>

        {/* 2 Column Layout: Left Steps + Right Sticky Phone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* LEFT COLUMN: Vertical list of 3 steps */}
          <div className="lg:col-span-6 space-y-8 sm:space-y-12">
            {STEPS.map((step, idx) => {
              const stepNumber = idx + 1;
              const isActive = activeStep === stepNumber;

              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(stepNumber)}
                  className={cn(
                    "cursor-pointer rounded-3xl border-[2.5px] border-[#2A1A12] p-6 sm:p-8 transition-all duration-300 shadow-chunky flex items-start gap-5",
                    isActive
                      ? "bg-[#FFFDF8] opacity-100 scale-[1.02] shadow-chunky-lg"
                      : "bg-[#FFF8EA]/70 opacity-45 hover:opacity-75 scale-100"
                  )}
                >
                  {/* Step Number Circle */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl border-2 border-[#2A1A12] flex items-center justify-center font-display font-black text-2xl shrink-0 transition-colors shadow-sm",
                      isActive
                        ? "bg-[#C8502A] text-white"
                        : "bg-[#FFFDF8] text-[#9A4F28]"
                    )}
                  >
                    {step.num}
                  </div>

                  <div>
                    <h3 className="font-display font-black text-xl sm:text-2xl text-[#2A1A12]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-[#5A4030] leading-relaxed">
                      {step.desc}
                    </p>

                    {isActive && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#9A4F28]">
                        <PawIcon size={14} fill="currentColor" />
                        <span>Current step in journey</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <ChunkyButton href="/how-it-works" variant="outline" size="md">
                See the full process & delivery guide
              </ChunkyButton>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY Phone Mockup */}
          <div className="lg:col-span-6 flex justify-center lg:sticky lg:top-28">
            <div className="relative w-full max-w-[370px] sm:max-w-[400px] rounded-[42px] border-[4px] border-[#2A1A12] bg-[#EFEAE2] shadow-chunky-lg overflow-hidden">
              {/* Phone Header */}
              <div className="bg-[#2B5E3F] px-4 py-3 text-white flex items-center justify-between border-b-2 border-[#1E432D]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#2A1A12] flex items-center justify-center p-1">
                    <Mascot pose="idle" size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm tracking-wide">
                      PuppyNest Online
                    </h4>
                    <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                      <span>Active Concierge</span>
                    </p>
                  </div>
                </div>
                <div className="text-[11px] bg-emerald-900/50 px-2.5 py-0.5 rounded-full text-emerald-100 font-semibold">
                  Step {activeStep} of 3
                </div>
              </div>

              {/* Chat Body with Paw Wallpaper Pattern */}
              <div className="p-4 space-y-3 min-h-[360px] relative overflow-hidden bg-[#E8E1D5]">
                {/* Background faint paw prints pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-wrap gap-6 p-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <PawIcon key={i} size={24} fill="#2A1A12" />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* STEP 1: Customer Message + Breed Chips */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-3 relative z-10"
                    >
                      {/* Customer Message */}
                      <div className="flex justify-end">
                        <div className="bg-[#E7FFDB] text-[#111B21] rounded-2xl rounded-tr-none px-3.5 py-2 text-xs sm:text-[13px] max-w-[85%] shadow-sm border border-[#2A1A12]/10">
                          <p>Hi PuppyNest! I&apos;d love to know more about your available puppies.</p>
                          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-500">
                            <span>10:42 AM</span>
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                        </div>
                      </div>

                      {/* Bot Reply */}
                      <div className="flex justify-start">
                        <div className="bg-white text-[#111B21] rounded-2xl rounded-tl-none p-3 text-xs sm:text-[13px] max-w-[90%] shadow-sm border border-[#2A1A12]/10 space-y-2">
                          <p className="font-semibold text-[#2A1A12]">
                            Welcome to PuppyNest Dubai! 🐾 Which teacup breed captures your heart?
                          </p>

                          {/* Breed Chips Popping in */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {BREED_CHIPS.map((chip, i) => (
                              <motion.span
                                key={chip}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.15 + i * 0.08 }}
                                className="px-2.5 py-1 rounded-full bg-[#FFF8EA] border border-[#2A1A12] text-[11px] font-bold text-[#2A1A12]"
                              >
                                {chip}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Typing Indicator + Photo & Health Details */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-3 relative z-10"
                    >
                      {/* Concierge Message with Photo & Records */}
                      <div className="bg-white text-[#111B21] rounded-2xl rounded-tl-none p-2.5 text-xs shadow-sm border border-[#2A1A12]/10 space-y-2 max-w-[95%]">
                        <p className="font-bold text-[#2A1A12] px-1">
                          Here is Max playing just 10 mins ago! 🎥
                        </p>

                        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#2A1A12]/20">
                          <Image
                            src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80"
                            alt="Puppy video message"
                            fill
                            sizes="300px"
                            className="object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            ▶ 4K Unfiltered Play Clip
                          </div>
                        </div>

                        {/* Health passport card */}
                        <div className="bg-[#FFF8EA] border border-[#2A1A12]/20 rounded-xl p-2 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#3A7D54]">
                            ✓ Dubai Municipality Microchip Verified
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">10:45 AM</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Map Card with Dotted Route toward House */}
                  {activeStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-3 relative z-10"
                    >
                      <div className="bg-white text-[#111B21] rounded-2xl rounded-tl-none p-3 text-xs shadow-sm border border-[#2A1A12]/10 space-y-2">
                        <div className="flex items-center gap-1.5 text-[#3A7D54] font-bold">
                          <Sparkles className="w-4 h-4" />
                          <span>VIP Delivery Tracker Active</span>
                        </div>

                        {/* Animated Map Graphic */}
                        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#2A1A12]/20 bg-[#E6EBE0] p-3 flex flex-col justify-between">
                          <div className="flex justify-between items-center text-[10px] font-bold text-[#2A1A12]">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#C8502A]" /> Showroom
                            </span>
                            <span className="flex items-center gap-1">
                              <Home className="w-3.5 h-3.5 text-[#3A7D54]" /> Your Home
                            </span>
                          </div>

                          {/* Dotted path route */}
                          <svg viewBox="0 0 280 40" fill="none" className="w-full h-8">
                            <path
                              d="M 20 20 Q 140 5 260 20"
                              stroke="#C8502A"
                              strokeWidth="3"
                              strokeDasharray="5 5"
                            />
                            <circle cx="20" cy="20" r="5" fill="#C8502A" />
                            <circle cx="260" cy="20" r="5" fill="#3A7D54" />
                          </svg>

                          <div className="bg-white/90 rounded-lg p-1.5 text-center text-[10px] font-bold text-[#2A1A12]">
                            Climate-Controlled Luxury Van • Arriving Today
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Input Bar with Green Button */}
              <div className="p-3 bg-[#F0F2F5] border-t border-gray-200 flex flex-col gap-2">
                <ChunkyButton
                  href={getWhatsAppUrl(`Hi PuppyNest! I'm on journey step ${activeStep}. Could you assist me?`)}
                  variant="whatsapp"
                  size="sm"
                  className="w-full text-center py-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current stroke-none" />
                  <span>Say hello on WhatsApp</span>
                </ChunkyButton>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}

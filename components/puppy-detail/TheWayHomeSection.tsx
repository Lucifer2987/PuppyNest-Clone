"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TheWayHomeSectionProps {
  origin: "imported" | "local";
  className?: string;
}

export function TheWayHomeSection({ origin, className }: TheWayHomeSectionProps) {
  const isImported = origin === "imported";

  const steps = isImported
    ? [
        {
          num: 1,
          title: "Reserve your puppy",
          desc: "Tell us which puppy has captured your heart and secure your reservation.",
        },
        {
          num: 2,
          title: "Personalised consultation",
          desc: "We finalize details with you and share regular video updates on your puppy's journey.",
        },
        {
          num: 3,
          title: "Import and arrival",
          desc: "We manage health checks, temperature-controlled travel, and customs clearance.",
        },
        {
          num: 4,
          title: "Welcome home",
          desc: "We deliver via VIP Nanny or welcome you to our showroom to meet your new best friend.",
        },
      ]
    : [
        {
          num: 1,
          title: "Choose your puppy",
          desc: "Select your favorite pup online or reserve a private showroom viewing.",
        },
        {
          num: 2,
          title: "Personalised meet & greet",
          desc: "Spend quality cuddle time in our private lounge to feel the bond in person.",
        },
        {
          num: 3,
          title: "Health check & paperwork",
          desc: "Final vet certification, microchip registration, and official UAE pet passport.",
        },
        {
          num: 4,
          title: "Welcome home",
          desc: "Take your new baby home with our puppy starter pack and 24/7 care support.",
        },
      ];

  return (
    <section className={cn("w-full py-8 sm:py-12 select-none", className)}>
      {/* Numbered label badge "2" + handwritten "the way home" */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] font-body text-xs font-black flex items-center justify-center shadow-xs">
          2
        </span>
        <span className="font-handwriting text-base sm:text-lg text-[#9A4F28] font-bold tracking-wide">
          the way home
        </span>
      </div>

      {/* Heading */}
      <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#2A1A12] tracking-tight leading-tight mb-8 sm:mb-10">
        {isImported ? "Coming home from abroad" : "Coming home with you"}
      </h2>

      {/* 4 Steps Row (Desktop horizontal with dotted line / Mobile vertical with dotted line) */}
      <div className="relative">
        {/* Horizontal Dotted Line on Desktop (hidden on mobile) */}
        <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 border-t-2 border-dashed border-[#C98B4D]/60 -z-0 pointer-events-none" />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative flex md:flex-col items-start gap-4 md:gap-3 group"
            >
              {/* Vertical connecting line for mobile only */}
              {idx < steps.length - 1 && (
                <div className="md:hidden absolute left-5 top-10 bottom-0 w-0.5 border-l-2 border-dashed border-[#C98B4D]/60 -z-0 pointer-events-none" />
              )}

              {/* Numbered Circle (40px, dark outline, cream fill) */}
              <div className="w-10 h-10 rounded-full bg-[#FFFDF8] border-2 border-[#2A1A12] text-[#2A1A12] font-display font-black text-base flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105 group-hover:border-[#9A4F28] group-hover:text-[#9A4F28]">
                {step.num}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 md:pt-0">
                <h3 className="font-body font-bold text-sm sm:text-base text-[#2A1A12] leading-snug mb-1">
                  {step.title}
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-[#5A4030] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

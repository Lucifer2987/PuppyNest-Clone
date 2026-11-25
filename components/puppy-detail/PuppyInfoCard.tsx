"use client";

import React from "react";
import { Check, MessageCircle, ArrowDown } from "lucide-react";
import { Puppy } from "@/lib/types";
import { Mascot } from "@/components/Mascot";
import { ArgylePattern } from "@/components/ArgylePattern";
import { triggerExcitedMascot } from "@/hooks/useMascotPosition";
import { getPuppyWhatsAppUrl } from "@/lib/config";
import { cn } from "@/lib/utils";

interface PuppyInfoCardProps {
  puppy: Puppy;
  className?: string;
}

export function PuppyInfoCard({ puppy, className }: PuppyInfoCardProps) {
  const isAvailable = puppy.status === "available";
  const isImported = puppy.origin === "imported";

  // WhatsApp prefilled message
  const whatsappUrl = isAvailable
    ? getPuppyWhatsAppUrl(puppy.name, puppy.breed, puppy.slug)
    : `https://wa.me/971500000000?text=${encodeURIComponent(
        `Hi PuppyNest! I saw that ${puppy.name} (${puppy.breed}) has gone home, but I would love to enquire about a similar puppy.`
      )}`;

  // Smooth scroll to #enquire
  const handleScrollToEnquire = (e: React.MouseEvent) => {
    e.preventDefault();
    const enquireEl = document.getElementById("enquire");
    if (enquireEl) {
      enquireEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={cn("flex flex-col gap-5 select-none", className)}>
      {/* ============================================================
          1. TOP MAIN INFO CARD (with pin & mascot badge)
          ============================================================ */}
      <div className="relative w-full rounded-[20px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[6px_6px_0_#2A1A12] p-6 sm:p-7 overflow-visible">
        {/* Dashed inner border (inset 8px) */}
        <div className="absolute inset-2 rounded-[14px] border-2 border-dashed border-[#C98B4D]/60 pointer-events-none" />

        {/* Small round metallic pin at top-left corner */}
        <div className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFF9EE] via-[#E2D5C3] to-[#B5A48F] border-2 border-[#2A1A12] shadow-sm flex items-center justify-center pointer-events-none z-10">
          <div className="w-1 h-1 rounded-full bg-white/90 -translate-x-0.5 -translate-y-0.5" />
        </div>

        {/* Mascot Head Badge at top-right corner (overlapping border) */}
        <div className="absolute -top-4 -right-3 z-20 pointer-events-none">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFF9EE] border-2 border-[#2A1A12] shadow-sm flex items-center justify-center overflow-hidden">
            <Mascot pose="peek" size={44} className="translate-y-1.5" />
          </div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 flex flex-col gap-4">
          {/* Status Pill Tag */}
          <div className="flex items-center">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7EE] border border-[#3A7D54]/30 text-[#2B603D] font-body text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#3A7D54] animate-pulse" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EDE6] border border-[#7A6355]/30 text-[#5A4030] font-body text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#7A6355]" />
                Gone home
              </span>
            )}
          </div>

          {/* Puppy Title & Breed */}
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2A1A12] tracking-tight leading-none mb-1">
              {puppy.name}
            </h1>
            <p className="font-body font-semibold text-sm sm:text-base text-[#9A4F28]">
              {puppy.breed}
            </p>
          </div>

          {/* 2x2 Details Grid */}
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 pt-2 border-t border-[#2A1A12]/10">
            <div>
              <span className="block font-body text-[11px] font-bold uppercase tracking-wider text-[#7A6355]/85 mb-0.5">
                Breed
              </span>
              <span className="font-body font-bold text-sm text-[#2A1A12]">
                {puppy.breed}
              </span>
            </div>

            <div>
              <span className="block font-body text-[11px] font-bold uppercase tracking-wider text-[#7A6355]/85 mb-0.5">
                Boy or girl
              </span>
              <span className="font-body font-bold text-sm text-[#2A1A12] capitalize">
                {puppy.gender}
              </span>
            </div>

            <div>
              <span className="block font-body text-[11px] font-bold uppercase tracking-wider text-[#7A6355]/85 mb-0.5">
                Age
              </span>
              <span className="font-body font-bold text-sm text-[#2A1A12]">
                {puppy.ageMonths} months
              </span>
            </div>

            <div>
              <span className="block font-body text-[11px] font-bold uppercase tracking-wider text-[#7A6355]/85 mb-0.5">
                Where
              </span>
              <span className="font-body font-bold text-sm text-[#2A1A12]">
                {isImported ? "Imported for you" : "In our showroom"}
              </span>
            </div>
          </div>

          {/* Stacked Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            {/* WhatsApp Green Chunky Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => triggerExcitedMascot()}
              className="w-full h-12 rounded-[14px] bg-[#3A7D54] text-white border-2 border-[#2A1A12] font-body font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#214730] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_#214730] active:translate-y-0.5 active:shadow-[0_1px_0_#214730] focus:outline-none focus:ring-2 focus:ring-[#3A7D54]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>
                {isAvailable ? `Ask about ${puppy.name} on WhatsApp` : "Ask for a similar puppy"}
              </span>
            </a>

            {/* Send an Enquiry Outline Button */}
            <button
              type="button"
              onClick={handleScrollToEnquire}
              className="w-full h-11 rounded-[14px] bg-[#FFFDF8] text-[#2A1A12] border-2 border-[#2A1A12] font-body font-bold text-sm flex items-center justify-center gap-1.5 shadow-[0_3px_0_#2A1A12] transition-all hover:bg-[#FFF3D9] hover:-translate-y-0.5 hover:shadow-[0_4px_0_#2A1A12] active:translate-y-0.5 active:shadow-[0_1px_0_#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
            >
              <span>Send an enquiry</span>
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          2. BOTTOM CHECKLIST CARD ("what comes with {name}")
          ============================================================ */}
      <div className="relative w-full rounded-[18px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[4px_4px_0_#2A1A12] p-5 sm:p-6 overflow-hidden">
        {/* Subtle Argyle pattern in background */}
        <ArgylePattern opacity={0.06} size={36} />

        {/* Dashed inner border */}
        <div className="absolute inset-2 rounded-[12px] border-2 border-dashed border-[#C98B4D]/50 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          {/* Label: small badge + handwritten text */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#FFF3D9] border-1.5 border-[#2A1A12] text-[#2A1A12] text-[11px] font-bold flex items-center justify-center shadow-xs">
              ✦
            </span>
            <span className="font-handwriting text-sm text-[#9A4F28] font-bold tracking-wide">
              what comes with {puppy.name}
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display font-black text-lg sm:text-xl text-[#2A1A12] leading-tight">
            Every PuppyNest pup comes
          </h2>

          {/* Checklist with round check icons */}
          <ul className="flex flex-col gap-2 pt-1 font-body text-xs sm:text-sm text-[#382318] font-medium">
            <li className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#EBF7EE] border border-[#3A7D54] text-[#3A7D54] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>Vaccinated</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#EBF7EE] border border-[#3A7D54] text-[#3A7D54] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>Dewormed</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#EBF7EE] border border-[#3A7D54] text-[#3A7D54] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>Verified health certificate from licensed vets</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#EBF7EE] border border-[#3A7D54] text-[#3A7D54] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span>Thoroughly checked before joining your family</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

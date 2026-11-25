"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Mascot } from "@/components/Mascot";
import { ChunkyButton } from "@/components/ChunkyButton";
import { getWhatsAppUrl } from "@/lib/config";
import { triggerExcitedMascot } from "@/hooks/useMascotPosition";
import { cn } from "@/lib/utils";

interface HappyFamiliesCTAProps {
  className?: string;
}

export function HappyFamiliesCTA({ className }: HappyFamiliesCTAProps) {
  const whatsappUrl = getWhatsAppUrl(
    "Hi PuppyNest! I loved looking at your happy families wall and would love to enquire about adopting a puppy."
  );

  return (
    <div className={cn("w-full mt-16 sm:mt-24 mb-6 select-none", className)}>
      <div className="relative w-full rounded-[24px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[6px_6px_0_#2A1A12] p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Dashed inner border inset 8px */}
        <div className="absolute inset-2.5 rounded-[18px] border-2 border-dashed border-[#C98B4D]/50 pointer-events-none" />

        {/* Left Content */}
        <div className="relative z-10 max-w-lg text-center md:text-left">
          <span className="font-handwriting text-lg sm:text-xl text-[#9A4F28] font-bold tracking-wide block mb-1">
            your story starts here...
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#2A1A12] tracking-tight mb-3">
            Ready to be our next happy family?
          </h2>

          <p className="font-body text-sm sm:text-base text-[#5A4030] leading-relaxed mb-6">
            Join hundreds of delighted families across Dubai and the Emirates. Discover our vetted,
            healthy teacup companions or message our puppy concierges directly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
            {/* WhatsApp Green Chunky Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => triggerExcitedMascot()}
              className="w-full sm:w-auto h-12 px-6 rounded-full bg-[#3A7D54] text-white border-2 border-[#2A1A12] font-body font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#214730] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_#214730] active:translate-y-0.5 active:shadow-[0_2px_0_#214730]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Ask us on WhatsApp</span>
            </a>

            {/* See Available Puppies Button */}
            <Link
              href="/puppies"
              className="w-full sm:w-auto h-12 px-6 rounded-full bg-[#FFFDF8] text-[#2A1A12] border-2 border-[#2A1A12] font-body font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#2A1A12] transition-all hover:bg-[#FFF3D9] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#2A1A12] active:translate-y-0.5 active:shadow-[0_2px_0_#2A1A12]"
            >
              <span>See available puppies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Mascot Illustration */}
        <div className="relative z-10 shrink-0">
          <Mascot pose="idle" isExcited={true} size={135} />
        </div>
      </div>
    </div>
  );
}

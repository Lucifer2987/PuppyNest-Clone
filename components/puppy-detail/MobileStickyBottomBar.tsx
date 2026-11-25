"use client";

import React from "react";
import { MessageCircle, ArrowDown } from "lucide-react";
import { Puppy } from "@/lib/types";
import { getPuppyWhatsAppUrl } from "@/lib/config";
import { triggerExcitedMascot } from "@/hooks/useMascotPosition";

interface MobileStickyBottomBarProps {
  puppy: Puppy;
}

export function MobileStickyBottomBar({ puppy }: MobileStickyBottomBarProps) {
  const isAvailable = puppy.status === "available";
  const whatsappUrl = isAvailable
    ? getPuppyWhatsAppUrl(puppy.name, puppy.breed, puppy.slug)
    : `https://wa.me/971500000000?text=${encodeURIComponent(
        `Hi PuppyNest! I'm interested in a puppy similar to ${puppy.name} (${puppy.breed}).`
      )}`;

  const handleScrollToEnquire = () => {
    const el = document.getElementById("enquire");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-t-2 border-[#2A1A12] px-4 py-2.5 shadow-[0_-4px_12px_rgba(42,26,18,0.08)] pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2.5">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerExcitedMascot()}
          className="flex-1 h-11 rounded-full bg-[#3A7D54] text-white border-2 border-[#2A1A12] font-body font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_3px_0_#214730] active:translate-y-0.5 active:shadow-[0_1px_0_#214730]"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp us</span>
        </a>

        {/* Enquire Button */}
        <button
          type="button"
          onClick={handleScrollToEnquire}
          className="flex-1 h-11 rounded-full bg-[#9A4F28] text-white border-2 border-[#2A1A12] font-body font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_3px_0_#1A0E08] active:translate-y-0.5 active:shadow-[0_1px_0_#1A0E08]"
        >
          <span>Enquire now</span>
          <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

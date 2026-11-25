"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "ways", label: "Two ways home" },
  { id: "promise", label: "Our premium puppy promise" },
  { id: "delivery", label: "Delivery & collection" },
  { id: "why", label: "Why choose us" },
];

export function HowItWorksHero() {
  const [activeSection, setActiveSection] = useState("ways");

  // Scroll-spy observer for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full pt-4 pb-10 sm:pb-14 select-none">
      {/* Top 2-Column: Left huge heading / Right description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-8 sm:mb-10">
        <div className="lg:col-span-7">
          <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[88px] text-[#2A1A12] tracking-tight leading-[0.98]">
            How it works
          </h1>
        </div>

        <div className="lg:col-span-5 pb-2">
          <p className="font-body text-base sm:text-lg text-[#5A4030] leading-relaxed max-w-md">
            Whether you choose to visit us locally or order a premium breed from overseas, PuppyNest
            is here to make the experience unforgettable.
          </p>
        </div>
      </div>

      {/* Row of 4 Outlined Pill Links with Scroll-Spy Highlighting */}
      <nav aria-label="Section shortcuts" className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleScrollTo(sec.id)}
              className={cn(
                "h-8 sm:h-9 px-3.5 sm:px-4 rounded-full text-xs sm:text-[13px] font-body font-bold border-2 transition-all select-none focus:outline-none focus:ring-2 focus:ring-[#9A4F28]",
                isActive
                  ? "bg-[#2A1A12] text-white border-[#2A1A12] shadow-xs scale-102"
                  : "bg-[#FFFDF8] text-[#2A1A12] border-[#2A1A12] hover:bg-[#FFF3D9]"
              )}
            >
              {sec.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

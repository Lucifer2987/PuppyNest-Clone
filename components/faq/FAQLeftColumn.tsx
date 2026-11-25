"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ChunkyButton } from "@/components/ChunkyButton";
import { Mascot } from "@/components/Mascot";
import { getWhatsAppUrl } from "@/lib/config";
import { claimMascotOwnership, releaseMascotOwnership } from "@/hooks/useMascotPosition";

interface FAQLeftColumnProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  count: number;
}

export function FAQLeftColumn({ searchQuery, onSearchChange, count }: FAQLeftColumnProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isExcited, setIsExcited] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Single-mascot owner lifecycle using IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (visible) {
          claimMascotOwnership("faq-mascot");
        } else {
          releaseMascotOwnership("faq-mascot");
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      releaseMascotOwnership("faq-mascot");
    };
  }, []);

  return (
    <div ref={sectionRef} className="w-full lg:sticky lg:top-28 space-y-6 select-none">
      {/* Giant 2-Line Heading with Outline & Hard Shadow */}
      <div className="space-y-1">
        <h1
          className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.98] tracking-tight text-[#FFF3D9]"
          style={{
            WebkitTextStroke: "2.5px #2A1A12",
            textShadow: "4px 4px 0 #2A1A12",
          }}
        >
          <span className="block">Questions</span>
          <span className="block">& answers</span>
        </h1>
      </div>

      {/* Intro Description */}
      <p className="font-body text-base sm:text-lg text-[#FFF3D9]/90 max-w-sm leading-relaxed">
        Can&apos;t find what you&apos;re looking for? Message us on WhatsApp &mdash; our team is available 24/7.
      </p>

      {/* Search Section */}
      <div className="space-y-2 pt-2">
        <label
          htmlFor="faq-search"
          className="block font-handwriting text-lg text-[#FFF3D9]/90 font-bold tracking-wide"
        >
          sort out a question
        </label>

        {/* Pill Search Input */}
        <div className="relative max-w-md">
          <input
            id="faq-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setIsExcited(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setIsExcited(false);
            }}
            placeholder="Delivery, health, vaccinated..."
            className="w-full h-12 pl-11 pr-4 rounded-full border-2 border-[#2A1A12] bg-[#FFFDF8] text-[#2A1A12] placeholder:text-[#5A4030]/60 placeholder:font-handwriting placeholder:text-base focus:outline-none focus:ring-2 focus:ring-[#FFF3D9] shadow-sm text-sm font-medium transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1A12]/60 stroke-[2.5]" />
        </div>

        {/* Dynamic Notes Count Label */}
        <div className="text-xs sm:text-sm font-body text-[#FFF3D9]/80 pt-1 font-medium">
          {count > 0 ? (
            <span>{count} {count === 1 ? "note" : "notes"} on the board</span>
          ) : (
            <span className="text-[#FFD285] font-bold">0 notes, try another word</span>
          )}
        </div>
      </div>

      {/* Mascot perched with Speech Bubble */}
      <div className="pt-2 pb-1 flex items-end gap-3">
        {isInView && (
          <motion.div
            animate={{
              rotate: isFocused ? 14 : 0,
              y: isExcited ? [-2, 2, -2] : 0,
            }}
            transition={{
              rotate: { type: "spring", stiffness: 320, damping: 18 },
              y: { repeat: Infinity, duration: 0.35 },
            }}
            className="relative cursor-pointer select-none"
            onClick={() => {
              setIsExcited(true);
              setTimeout(() => setIsExcited(false), 1200);
            }}
          >
            {/* Speech bubble "psst?" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-7 left-6 bg-[#FFFDF8] border-2 border-[#2A1A12] rounded-full px-2.5 py-0.5 shadow-sm text-[11px] font-handwriting font-bold text-[#2A1A12] whitespace-nowrap z-20"
            >
              {count === 0 ? "hmm? 🐾" : "psst?"}
              <span className="absolute -bottom-1 left-2 w-2 h-2 bg-[#FFFDF8] border-r-2 border-b-2 border-[#2A1A12] rotate-45" />
            </motion.div>

            {/* Mascot sitting facing right */}
            <Mascot
              pose={count === 0 ? "idle" : "sit"}
              facing="right"
              size={88}
              isExcited={isExcited}
            />
          </motion.div>
        )}
      </div>

      {/* Green WhatsApp Action Button */}
      <div className="pt-1">
        <ChunkyButton
          href={getWhatsAppUrl("Hello PuppyNest, I have a question not listed in the FAQ.")}
          variant="whatsapp"
          size="md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="w-4 h-4 fill-current stroke-none" />
          <span>Ask your own question</span>
        </ChunkyButton>
      </div>
    </div>
  );
}

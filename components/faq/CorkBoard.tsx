"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQ {
  id: number;
  slug: string;
  question: string;
  answer: string;
  pinColor: string;
}

interface CorkBoardProps {
  faqs: FAQ[];
  openSlug: string | null;
  onToggle: (slug: string) => void;
  searchQuery: string;
}

/**
 * Push pin SVG with metallic shine and realistic head
 */
function PushPin({ color, isPushed }: { color: string; isPushed: boolean }) {
  return (
    <motion.div
      animate={{
        scale: isPushed ? 0.9 : 1,
        y: isPushed ? 2 : 0,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-sm"
    >
      <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pin Needle Shadow */}
        <ellipse cx="12" cy="24" rx="4" ry="1.5" fill="#1E0F0A" fillOpacity="0.3" />
        {/* Pin Point Tip */}
        <path d="M12 18 L12 24" stroke="#71717A" strokeWidth="2" strokeLinecap="round" />
        {/* Pin Head */}
        <circle cx="12" cy="11" r="9" fill={color} stroke="#2A1A12" strokeWidth="1.8" />
        {/* Inner Ring */}
        <circle cx="12" cy="11" r="5" fill="#FFFDF8" fillOpacity="0.25" />
        {/* Specular Highlight */}
        <circle cx="9.5" cy="8.5" r="2.5" fill="white" fillOpacity="0.75" />
      </svg>
    </motion.div>
  );
}

/**
 * Text highlight helper for search matches
 */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-[#FFE58F] text-[#2A1A12] px-0.5 rounded font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// Stable deterministic tilt angles per question index
const TILT_ANGLES = [-1.4, 1.2, -0.9, 1.5, -1.2, 0.8, -1.5, 1.1, -0.7, 1.3];

export function CorkBoard({ faqs, openSlug, onToggle, searchQuery }: CorkBoardProps) {
  return (
    <div className="w-full relative">
      {/* Outer Wooden Frame */}
      <div className="relative rounded-[28px] sm:rounded-[36px] border-[2.5px] border-[#2A1A12] bg-[#55392B] p-3 sm:p-4 md:p-[14px] shadow-[6px_6px_0_#1E0F0A] overflow-hidden">
        {/* Inner Bevel Border */}
        <div className="relative rounded-2xl sm:rounded-3xl border-2 border-[#8D5B3A] p-1.5 sm:p-2 bg-[#754E35]/40 shadow-inner">
          {/* Cork Surface with Tan Color and Speckle Noise Pattern */}
          <div
            className="relative rounded-xl sm:rounded-2xl bg-[#C79A62] p-4 sm:p-7 md:p-9 min-h-[560px] flex flex-col justify-start"
            style={{
              backgroundImage: `radial-gradient(#9E6F3A 12%, transparent 12%), radial-gradient(#B8874E 8%, transparent 8%)`,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          >
            {/* Cork Surface Shadow overlay for depth */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#2A1A12]/15 via-transparent to-[#2A1A12]/20 pointer-events-none" />

            {/* List of Pinned Notes */}
            <div className="relative z-10 space-y-5 sm:space-y-6">
              <AnimatePresence initial={false}>
                {faqs.map((faq, index) => {
                  const isOpen = openSlug === faq.slug;
                  const isEven = index % 2 === 1;
                  const baseTilt = TILT_ANGLES[index % TILT_ANGLES.length];
                  const currentTilt = isOpen ? 0 : baseTilt;

                  return (
                    <motion.div
                      key={faq.slug}
                      layout
                      initial={{ opacity: 0, y: -24, rotate: baseTilt * 1.5 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotate: currentTilt,
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.04,
                        type: "spring",
                        stiffness: 280,
                        damping: 22,
                      }}
                      whileHover={
                        !isOpen
                          ? {
                              rotate: baseTilt > 0 ? baseTilt + 1.2 : baseTilt - 1.2,
                              transition: { duration: 0.2 },
                            }
                          : undefined
                      }
                      className={cn(
                        "relative w-full max-w-[94%] transition-all",
                        isEven ? "ml-auto" : "mr-auto"
                      )}
                    >
                      {/* Push Pin */}
                      <PushPin color={faq.pinColor} isPushed={isOpen} />

                      {/* Paper Note Card */}
                      <div
                        id={faq.slug}
                        className={cn(
                          "relative rounded-lg border-2 border-[#2A1A12] bg-[#FFFDF8] shadow-[3px_3px_0_rgba(42,26,18,0.22)] transition-shadow duration-200",
                          isOpen ? "shadow-[4px_5px_0_rgba(42,26,18,0.3)] bg-white" : "hover:shadow-[4px_4px_0_rgba(42,26,18,0.28)]"
                        )}
                      >
                        {/* Note Header Button (Accordion Trigger) */}
                        <button
                          type="button"
                          onClick={() => onToggle(faq.slug)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${faq.slug}`}
                          className="w-full text-left pt-5 pb-4 px-4 sm:px-6 flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A4F28] rounded-lg"
                        >
                          <span className="font-display font-extrabold text-[15px] sm:text-[17px] text-[#2A1A12] leading-snug">
                            <HighlightText text={faq.question} query={searchQuery} />
                          </span>

                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[#2A1A12]/80 hover:text-[#2A1A12]"
                          >
                            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                          </motion.div>
                        </button>

                        {/* Collapsible Answer Body */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={`faq-answer-${faq.slug}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 sm:px-6 pb-5 pt-1 text-sm sm:text-[15px] text-[#5A4030] font-body leading-relaxed border-t border-[#2A1A12]/10 mt-1">
                                <HighlightText text={faq.answer} query={searchQuery} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

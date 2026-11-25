"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import faqsData from "@/data/faqs.json";

export function FAQTeaser() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Take first 3 FAQs for the home teaser
  const teaserFaqs = faqsData.slice(0, 3);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#FFF3D9] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              got questions?
            </span>
            <WavyUnderline className="w-32 mt-0.5" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-base text-[#5A4030]">
            Everything you need to know about our health certifications, showroom visits, and puppy care.
          </p>
        </div>

        {/* Animated Accordion List */}
        <div className="space-y-4">
          {teaserFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-chunky overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-black text-base sm:text-lg text-[#2A1A12]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-[#2A1A12] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#F0B955]" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-[#5A4030] leading-relaxed border-t border-[#2A1A12]/10 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Link to full FAQ page */}
        <div className="mt-10 text-center">
          <ChunkyButton href="/faq" variant="outline" size="md">
            Read all frequently asked questions
          </ChunkyButton>
        </div>
      </div>
    </section>
  );
}

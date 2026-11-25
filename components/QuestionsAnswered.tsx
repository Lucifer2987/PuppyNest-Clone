"use client";

import React from "react";
import Link from "next/link";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { ScrollRevealText, ScrollFadeUp } from "@/components/ScrollRevealText";
import { NightSky } from "@/components/NightSky";
import faqsData from "@/data/faqs.json";

export function QuestionsAnswered() {
  // 3 primary Q&As shown expanded by default
  const questions = faqsData.slice(0, 3);

  return (
    <section
      data-mascot="faq"
      className="relative w-full py-20 sm:py-28 overflow-hidden bg-transparent text-[#FFF3D9]"
    >
      {/* Night Sky with Twinkling Stars */}
      <NightSky showMoon={false} starCount={32} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: Heading + Button + Mascot sitting & looking up */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex flex-col items-start mb-2">
                <span className="font-handwriting text-2xl text-[#F0B955] font-bold">
                  peace of mind
                </span>
                <WavyUnderline className="w-36 mt-0.5" color="#F0B955" />
              </div>

              <ScrollRevealText
                as="h2"
                className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#FFF3D9] tracking-tight leading-tight"
              >
                {"Questions,\nanswered"}
              </ScrollRevealText>

              <ScrollFadeUp
                delay={0.15}
                className="mt-4 text-base text-[#D4C3B3] leading-relaxed max-w-md"
              >
                Everything you need to know about our international veterinary checks, private showroom cuddle sessions, and Dubai municipality registration.
              </ScrollFadeUp>
            </div>

            {/* Button */}
            <div className="mt-8 sm:mt-12 flex items-end gap-6">
              <ChunkyButton href="/faq" variant="outline" size="md">
                Read all questions
              </ChunkyButton>
            </div>
          </div>

          {/* RIGHT: Three Q&A blocks shown expanded by default */}
          <div className="lg:col-span-7 space-y-5">
            {questions.map((faq, idx) => (
              <ScrollFadeUp
                key={faq.question}
                delay={0.1 + idx * 0.1}
                className="rounded-3xl border-2 border-[#FFF3D9]/25 bg-[#1F120B]/80 backdrop-blur-sm p-6 sm:p-7 shadow-chunky transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display font-black text-lg sm:text-xl text-[#FFF3D9] mb-2 leading-snug">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-[#D4C3B3] leading-relaxed">
                  {faq.answer}
                </p>
              </ScrollFadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

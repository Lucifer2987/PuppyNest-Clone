"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { Mascot } from "@/components/Mascot";
import { getWhatsAppUrl } from "@/lib/config";
import { claimMascotOwnership, releaseMascotOwnership } from "@/hooks/useMascotPosition";

export function HowItWorksCTA() {
  const [headTilt, setHeadTilt] = useState(0);
  const [isExcited, setIsExcited] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Strictly enforce single-mascot rule using IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (visible) {
          claimMascotOwnership("cta");
        } else {
          releaseMascotOwnership("cta");
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      releaseMascotOwnership("cta");
    };
  }, []);

  const handleButtonEnter = () => {
    setHeadTilt(-12);
    setIsExcited(true);
  };

  const handleButtonLeave = () => {
    setHeadTilt(0);
    setIsExcited(false);
  };

  return (
    <section ref={sectionRef} className="w-full pt-6 pb-20 sm:pb-28 select-none">
      <div className="relative rounded-[28px] sm:rounded-[36px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[4px_4px_0_#2A1A12] p-8 sm:p-12 md:p-16 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Middle: Title, Guidance text, and Action buttons */}
          <div className="lg:col-span-8 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0D4] border border-[#2A1A12]/20 text-xs font-bold text-[#9A4F28] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#9A4F28]" />
              <span>Ready for puppy cuddles?</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight leading-[1.08] mb-4">
              Unique and high quality puppies
            </h2>

            <p className="font-body text-sm sm:text-base text-[#5A4030] leading-relaxed max-w-xl mb-8">
              Ready to welcome a sweet teacup puppy into your life? Our puppy concierges are on
              standby to share videos, answer questions, and arrange showroom visits.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex items-center gap-4 flex-wrap"
              onMouseEnter={handleButtonEnter}
              onMouseLeave={handleButtonLeave}
            >
              <ChunkyButton
                href={getWhatsAppUrl("Hello PuppyNest, I have questions after reading How it works.")}
                variant="whatsapp"
                size="md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 fill-current stroke-none" />
                <span>Ask us on WhatsApp</span>
              </ChunkyButton>

              <ChunkyButton href="/puppies" variant="outline" size="md">
                <span>See available puppies</span>
                <ArrowRight className="w-4 h-4" />
              </ChunkyButton>
            </div>
          </div>

          {/* Right Column: Mascot perched on the right edge looking at buttons */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end relative">
            {isInView && (
              <motion.div
                animate={{
                  rotate: headTilt,
                  y: isExcited ? [-2, 2, -2] : [0, -3, 0],
                }}
                transition={{
                  rotate: { type: "spring", stiffness: 300, damping: 15 },
                  y: { repeat: Infinity, duration: isExcited ? 0.3 : 2.5, ease: "easeInOut" },
                }}
                className="relative -mb-4 lg:-mb-10 cursor-pointer select-none"
                onClick={() => {
                  setHeadTilt(-18);
                  setIsExcited(true);
                  setTimeout(() => {
                    setHeadTilt(0);
                    setIsExcited(false);
                  }, 1200);
                }}
              >
                {/* Speech bubble */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-10 -left-6 bg-white border-2 border-[#2A1A12] rounded-full px-3 py-1 shadow-sm text-[11px] font-bold text-[#2A1A12] whitespace-nowrap z-20"
                >
                  cuddle me!
                  <span className="absolute -bottom-1.5 left-4 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-[#2A1A12] rotate-45" />
                </motion.div>

                {/* Mascot sitting facing left towards the buttons */}
                <Mascot
                  pose="sit"
                  facing="left"
                  size={140}
                  isExcited={isExcited}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

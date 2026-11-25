"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, CheckCheck, Send } from "lucide-react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { Mascot } from "@/components/Mascot";
import { getWhatsAppUrl } from "@/lib/config";

const BREED_CHIPS = [
  { label: "Maltipoo", href: "/puppies?breed=Maltipoo" },
  { label: "Pomeranian", href: "/puppies?breed=Pomeranian" },
  { label: "Poodle", href: "/puppies?breed=Poodle" },
  { label: "Cavapoo", href: "/puppies?breed=Cavapoo" },
  { label: "Shih Tzu", href: "/puppies?breed=Shih+Tzu" },
];

export function ChatPreview() {
  const [activeChip, setActiveChip] = useState("Maltipoo");

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#FFF8EA] border-t-2 border-[#2A1A12]/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="inline-flex flex-col items-center lg:items-start mb-2">
              <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
                instant concierge
              </span>
              <WavyUnderline className="w-36 mt-0.5" />
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight leading-tight">
              Real videos, zero wait. Chat with us directly.
            </h2>

            <p className="mt-4 text-base text-[#5A4030] leading-relaxed">
              Skip the email delay. Our puppy nannies are online right now on WhatsApp to answer health queries, share live 4K play clips, and schedule showroom visits.
            </p>

            {/* Quick reply breed chips */}
            <div className="mt-6">
              <p className="text-xs font-bold text-[#2A1A12] uppercase tracking-wider mb-2.5">
                Popular inquiries:
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {BREED_CHIPS.map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    onClick={() => setActiveChip(chip.label)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 border-[#2A1A12] transition-transform shadow-sm hover:scale-105 active:scale-95 ${
                      activeChip === chip.label
                        ? "bg-[#9A4F28] text-white"
                        : "bg-[#FFFDF8] text-[#2A1A12] hover:bg-[#FFF3D9]"
                    }`}
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <ChunkyButton
                href={getWhatsAppUrl(`Hi PuppyNest! I would love to see available ${activeChip} puppies.`)}
                variant="whatsapp"
                size="lg"
                className="w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 fill-current stroke-none" />
                <span>Say hello on WhatsApp</span>
              </ChunkyButton>
            </div>
          </div>

          {/* Right Phone Mockup Column */}
          <div className="lg:col-span-7 flex justify-center">
            {/* Phone shell */}
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] rounded-[40px] border-[4px] border-[#2A1A12] bg-[#EFEAE2] shadow-chunky-lg overflow-hidden">
              {/* Phone Header */}
              <div className="bg-[#2B5E3F] px-4 py-3 text-white flex items-center justify-between border-b-2 border-[#1E432D]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#2A1A12] flex items-center justify-center p-1">
                    <Mascot variant="standing" width={32} height={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide">PuppyNest Dubai</h4>
                    <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                      <span>Online now</span>
                    </p>
                  </div>
                </div>
                <div className="text-xs bg-emerald-900/40 px-2.5 py-1 rounded-full text-emerald-100 font-semibold">
                  Official Concierge
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="p-4 space-y-3.5 text-xs sm:text-sm">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-[#E7FFDB] text-[#111B21] rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[82%] shadow-sm border border-[#2A1A12]/10">
                    <p>Hi PuppyNest! I&apos;d love to know more about your available {activeChip} puppies in Dubai.</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-500">
                      <span>12:34 PM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Concierge Reply with Puppy Video/Photo Slot */}
                <div className="flex justify-start">
                  <div className="bg-white text-[#111B21] rounded-2xl rounded-tl-none p-2.5 max-w-[90%] shadow-sm border border-[#2A1A12]/10 space-y-2">
                    <p className="px-1 text-xs sm:text-[13px] leading-relaxed">
                      Hello! 🐾 Max and Mimi are currently awake and playing in our Dubai lounge! Here is a clip taken just 10 minutes ago:
                    </p>

                    {/* Media Slot */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#2A1A12]/20">
                      <Image
                        src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80"
                        alt="Puppy video preview"
                        fill
                        sizes="350px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-white/90 text-[#2A1A12] flex items-center justify-center shadow-md">
                          <span className="translate-x-0.5 font-bold">▶</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        0:15 • 4K Unfiltered
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 text-[10px] text-gray-500 pt-1">
                      <span className="text-[#3A7D54] font-bold">Verified Medical Passport Ready</span>
                      <span>12:35 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#F0F2F5] border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="Message PuppyNest Concierge..."
                  className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-xs text-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Send message"
                  className="w-8 h-8 rounded-full bg-[#3A7D54] text-white flex items-center justify-center shadow-sm"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

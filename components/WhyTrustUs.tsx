import React from "react";
import { ShieldCheck, Plane, HeartPulse, Award } from "lucide-react";
import { WavyUnderline } from "@/components/WavyUnderline";
import { PawIcon } from "@/components/PawTrail";

const PASSPORT_ITEMS = [
  {
    stamp: "CERTIFIED 100%",
    title: "Vet-checked & healthy",
    desc: "Comprehensive multi-panel health check, complete deworming, vaccines up-to-date, and international microchip registered with Dubai municipality.",
    icon: ShieldCheck,
    stampColor: "border-[#9A4F28] text-[#9A4F28]",
  },
  {
    stamp: "VIP CABIN",
    title: "Korea to Dubai, safely",
    desc: "Traveling exclusively in pressurized first-class airplane cabins with a certified pet nanny. Never in commercial luggage holds.",
    icon: Plane,
    stampColor: "border-[#3A7D54] text-[#3A7D54]",
  },
  {
    stamp: "LIFETIME CARE",
    title: "Support 24/7",
    desc: "Our veterinary nutritionists and certified trainers are available around the clock to guide your puppy’s feeding, teething, and potty habits.",
    icon: HeartPulse,
    stampColor: "border-[#C98B4D] text-[#C98B4D]",
  },
  {
    stamp: "500+ FAMILIES",
    title: "Trusted by families worldwide",
    desc: "Proudly bringing warmth and pure happiness to loving homes across Dubai, Abu Dhabi, and the GCC for over five wonderful years.",
    icon: Award,
    stampColor: "border-[#2A1A12] text-[#2A1A12]",
  },
];

export function WhyTrustUs() {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#FFF3D9] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              the puppynest standard
            </span>
            <WavyUnderline className="w-44 mt-0.5" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight">
            Why families trust PuppyNest
          </h2>
          <p className="mt-3 text-base text-[#5A4030]">
            Every puppy comes with an official health passport, DNA heritage, and our unbreakable commitment to animal welfare.
          </p>
        </div>

        {/* 4 Passport-Styled Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PASSPORT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="relative rounded-2xl border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] p-6 shadow-chunky flex flex-col justify-between group hover:-translate-y-1.5 transition-transform"
              >
                {/* Passport Official Stamp in top right */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFF8EA] border-2 border-[#2A1A12] flex items-center justify-center text-[#9A4F28]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div
                    className={`font-handwriting text-[11px] font-black uppercase px-2 py-0.5 border-2 rounded-md tracking-wider transform rotate-3 select-none ${item.stampColor}`}
                  >
                    {item.stamp}
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-black text-lg text-[#2A1A12] leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#5A4030] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom decorative passport watermarks */}
                <div className="mt-6 pt-3 border-t border-dashed border-[#2A1A12]/20 flex items-center justify-between text-[10px] text-[#9A4F28] font-mono">
                  <span>DOC: PN-DXB</span>
                  <PawIcon size={12} fill="currentColor" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

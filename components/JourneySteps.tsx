import React from "react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { PawIcon } from "@/components/PawTrail";
import { Search, HeartHandshake, ShieldCheck } from "lucide-react";

export function JourneySteps() {
  const steps = [
    {
      num: "01",
      title: "Choose your breed",
      desc: "Browse our handpicked teacup Maltipoos, Pomeranians, Poodles, and Cavapoos online or ask our concierge for personalized recommendations.",
      icon: Search,
    },
    {
      num: "02",
      title: "Get photos & details",
      desc: "Receive unfiltered 4K video clips, veterinary certificates, microchip records, and temperament assessments directly on WhatsApp.",
      icon: HeartHandshake,
    },
    {
      num: "03",
      title: "Secure & safe delivery",
      desc: "Visit our Downtown showroom for an unhurried cuddle session, or enjoy door-to-door climate-controlled delivery with a starter luxury kit.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#FFF3D9] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              from our arms to yours
            </span>
            <WavyUnderline className="w-40 mt-0.5" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight">
            Your puppy journey
          </h2>
          <p className="mt-3 text-base text-[#5A4030]">
            Three effortless steps designed with utmost care, hygiene, and transparency.
          </p>
        </div>

        {/* Steps Grid connected by dotted path */}
        <div className="relative">
          {/* Dotted connecting line on desktop */}
          <div
            className="hidden md:block absolute top-20 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-[#2A1A12]/30 pointer-events-none z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative rounded-3xl border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] p-6 sm:p-7 shadow-chunky flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
                >
                  {/* Step Number Circle */}
                  <div className="w-14 h-14 rounded-full bg-[#FFF8EA] border-2 border-[#2A1A12] flex items-center justify-center font-display font-black text-xl text-[#9A4F28] shadow-sm mb-4 group-hover:bg-[#F0B955] group-hover:text-[#2A1A12] transition-colors">
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div className="text-[#9A4F28] mb-3">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#2A1A12]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#5A4030] leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Walking paw indicator */}
                  <div className="mt-5 text-[#9A4F28]/40 group-hover:text-[#9A4F28] transition-colors">
                    <PawIcon size={16} fill="currentColor" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Action Button */}
        <div className="mt-12 text-center">
          <ChunkyButton href="/how-it-works" variant="primary" size="lg">
            See the full process & delivery guide
          </ChunkyButton>
        </div>
      </div>
    </section>
  );
}

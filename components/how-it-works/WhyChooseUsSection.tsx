"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plane, Headphones, ShieldCheck } from "lucide-react";

export function WhyChooseUsSection() {
  const features = [
    {
      id: "cargo",
      title: "International cargo",
      desc: "We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.",
      icon: Plane,
      badgeBg: "bg-[#FFE8D6]",
      badgeColor: "text-[#9A4F28]",
    },
    {
      id: "support",
      title: "Support 24/7",
      desc: "Our team is available 24/7 to answer your questions and assist you through every step of the adoption process. From choosing your puppy to post-delivery support — we're just a message away.",
      icon: Headphones,
      badgeBg: "bg-[#FFF0D4]",
      badgeColor: "text-[#A8641E]",
    },
    {
      id: "guarantee",
      title: "Health guarantee",
      desc: "Every puppy comes with comprehensive health checks, up-to-date vaccinations, microchip registration, and an official 1-year health guarantee for your complete peace of mind.",
      icon: ShieldCheck,
      badgeBg: "bg-[#E6F4EA]",
      badgeColor: "text-[#2D6A4F]",
    },
  ];

  return (
    <section id="why" className="w-full pt-16 sm:pt-24 pb-16 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Heading and Narrative Paragraph */}
        <div className="lg:col-span-5">
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#2A1A12] tracking-tight leading-[1.05] mb-6">
            Why choose us
          </h2>
          <p className="font-body text-base sm:text-lg text-[#5A4030] leading-relaxed">
            We&apos;re here to help you find a new family member. From the moment you visit our site to
            the joyful day your puppy arrives at your door, we&apos;re with you every step of the way.
            Our mission is to make the entire adoption process smooth, transparent, and full of joy.
          </p>
        </div>

        {/* Right Column: 3 Sliding Feature Cards */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.12,
                  type: "spring",
                  stiffness: 160,
                  damping: 18,
                }}
                className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FFFDF8]/70 border-[2px] border-[#2A1A12]/15 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Round Badge Icon */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-[#2A1A12] flex items-center justify-center shrink-0 shadow-sm ${feature.badgeBg} ${feature.badgeColor}`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display font-black text-lg sm:text-xl text-[#2A1A12] mb-1.5 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#5A4030] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

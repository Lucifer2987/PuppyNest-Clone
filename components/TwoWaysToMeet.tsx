import React from "react";
import Image from "next/image";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { Sparkles, MapPin, Plane } from "lucide-react";

export function TwoWaysToMeet() {
  return (
    <section className="relative w-full py-16 sm:py-20 bg-[#FFF8EA] border-y-2 border-[#2A1A12]/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              simple & transparent
            </span>
            <WavyUnderline className="w-36 mt-0.5" />
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2A1A12] tracking-tight">
            Two ways to meet your puppy
          </h2>
          <p className="mt-3 text-base text-[#5A4030]">
            Whether you want to cuddle today in Downtown Dubai or reserve a rare teacup lineage from Seoul, we ensure complete comfort.
          </p>
        </div>

        {/* 2 Big Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Puppies in Dubai */}
          <div className="relative rounded-3xl border-[3px] border-[#2A1A12] bg-[#FFFDF8] p-6 sm:p-8 shadow-chunky flex flex-col justify-between group transition-transform hover:-translate-y-1">
            {/* Tag Badge */}
            <div className="absolute -top-3.5 left-6 bg-[#2A1A12] text-white px-3.5 py-1 rounded-full font-handwriting text-sm font-bold shadow-sticker tracking-wide flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F0B955]" />
              <span>In our showroom</span>
            </div>

            <div>
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#2A1A12] mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80"
                  alt="Puppies in Dubai showroom"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#2A1A12]">
                Puppies in Dubai
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#5A4030] leading-relaxed">
                Meet our charming puppies already thriving in Dubai. Visit our boutique showroom for a private, relaxing cuddle session, view all medical records in person, and take your new baby home the very same day.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2A1A12]/10 flex items-center justify-between">
              <span className="text-xs font-bold text-[#9A4F28] uppercase tracking-wider">
                Same-Day Welcome
              </span>
              <ChunkyButton href="/puppies?origin=local" variant="primary" size="md">
                Meet local puppies
              </ChunkyButton>
            </div>
          </div>

          {/* Card 2: Imported for You */}
          <div className="relative rounded-3xl border-[3px] border-[#2A1A12] bg-[#FFFDF8] p-6 sm:p-8 shadow-chunky flex flex-col justify-between group transition-transform hover:-translate-y-1">
            {/* Tag Badge */}
            <div className="absolute -top-3.5 left-6 bg-[#9A4F28] text-white px-3.5 py-1 rounded-full font-handwriting text-sm font-bold shadow-sticker tracking-wide flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-[#FCE7BE]" />
              <span>Korea to Dubai</span>
            </div>

            <div>
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#2A1A12] mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
                  alt="Korean imported teacup puppies"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#2A1A12]">
                Imported for you
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#5A4030] leading-relaxed">
                Directly from elite ethical breeders in Seoul, South Korea. Known worldwide for true micro teacup sizing, teddy-bear facial genetics, and pristine hypoallergenic coats. Accompanied by a dedicated pet nanny in-cabin.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2A1A12]/10 flex items-center justify-between">
              <span className="text-xs font-bold text-[#9A4F28] uppercase tracking-wider">
                VIP Nanny Travel
              </span>
              <ChunkyButton href="/puppies?origin=imported" variant="dark" size="md">
                See imported puppies
              </ChunkyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

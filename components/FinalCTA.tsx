import React from "react";
import Image from "next/image";
import { MessageCircle, MapPin } from "lucide-react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { getWhatsAppUrl } from "@/lib/config";

export function FinalCTA() {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 bg-[#FFF8EA] border-t-2 border-[#2A1A12]/10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[36px] border-[3px] border-[#2A1A12] bg-[#FFFDF8] p-8 sm:p-12 md:p-16 shadow-chunky-lg text-center overflow-hidden">
          {/* Peeking puppy arched frame in top center */}
          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-32 sm:w-36 sm:h-40 rounded-t-[70px] border-[2.5px] border-[#2A1A12] overflow-hidden bg-[#EFE1C9] shadow-sm animate-float">
              <Image
                src="https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=400&q=80"
                alt="Teacup puppy welcoming home"
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Handwritten welcome home tag */}
          <div className="inline-flex flex-col items-center mb-3">
            <span className="font-handwriting text-2xl sm:text-3xl text-[#9A4F28] font-bold">
              welcome home
            </span>
            <WavyUnderline className="w-36 mt-0.5" />
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2A1A12] tracking-tight leading-tight max-w-2xl mx-auto">
            Ready to meet your new best friend?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#5A4030] max-w-xl mx-auto leading-relaxed">
            Visit our private Downtown Dubai showroom for a private cuddle session, or chat with our puppy nannies directly on WhatsApp.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <ChunkyButton
              href={getWhatsAppUrl("Hi PuppyNest! I'm ready to meet available puppies.")}
              variant="whatsapp"
              size="lg"
              className="w-full sm:w-auto min-w-[220px]"
            >
              <MessageCircle className="w-5 h-5 fill-current stroke-none" />
              <span>Enquire on WhatsApp</span>
            </ChunkyButton>

            <ChunkyButton
              href="/contact"
              variant="dark"
              size="lg"
              className="w-full sm:w-auto min-w-[220px]"
            >
              <MapPin className="w-5 h-5" />
              <span>Visit & contact showroom</span>
            </ChunkyButton>
          </div>
        </div>
      </div>
    </section>
  );
}

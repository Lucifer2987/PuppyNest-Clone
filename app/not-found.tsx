import React from "react";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FFF3D9] text-center">
      <div className="max-w-md mx-auto">
        {/* Mascot */}
        <div className="mb-6 flex justify-center animate-bob">
          <Mascot pose="idle" size={170} />
        </div>

        <div className="inline-flex flex-col items-center mb-2">
          <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
            paws and reflect
          </span>
          <WavyUnderline className="w-36 mt-0.5" />
        </div>

        <h1 className="font-display font-black text-4xl sm:text-5xl text-[#2A1A12] tracking-tight">
          Page Not Found (404)
        </h1>

        <p className="mt-3 text-base text-[#5A4030]">
          Oops! Looks like this puppy took a little detour into another garden. Let&apos;s lead you safely back home.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <ChunkyButton href="/" variant="primary" size="md">
            Return to Home
          </ChunkyButton>
          <ChunkyButton href="/puppies" variant="outline" size="md">
            Browse Available Puppies
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DoorCard } from "@/components/DoorCard";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { Puppy, PuppyBreed, PuppyOrigin, PuppyGender } from "@/lib/types";
import { Filter, RotateCcw, Search, Sparkles } from "lucide-react";

interface PuppiesClientProps {
  puppies: Puppy[];
}

const BREEDS: (PuppyBreed | "all")[] = [
  "all",
  "Maltipoo",
  "Pomeranian",
  "Poodle",
  "Cavapoo",
  "Shih Tzu",
];

export function PuppiesClient({ puppies }: PuppiesClientProps) {
  const searchParams = useSearchParams();
  const initialBreed = searchParams.get("breed") || "all";
  const initialOrigin = searchParams.get("origin") || "all";

  const [selectedBreed, setSelectedBreed] = useState<string>(initialBreed);
  const [selectedOrigin, setSelectedOrigin] = useState<string>(initialOrigin);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Only show available puppies on /puppies (gone-home puppies go to /gone-home)
  const availablePuppies = useMemo(
    () => puppies.filter((p) => p.status === "available"),
    [puppies]
  );

  const filteredPuppies = useMemo(() => {
    return availablePuppies.filter((pup) => {
      // Breed filter
      if (selectedBreed !== "all" && pup.breed.toLowerCase() !== selectedBreed.toLowerCase()) {
        return false;
      }
      // Origin filter
      if (selectedOrigin !== "all" && pup.origin !== selectedOrigin) {
        return false;
      }
      // Gender filter
      if (selectedGender !== "all" && pup.gender !== selectedGender) {
        return false;
      }
      // Search query (name, color, personality)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = pup.name.toLowerCase().includes(query);
        const matchesBreed = pup.breed.toLowerCase().includes(query);
        const matchesColor = pup.color.toLowerCase().includes(query);
        const matchesDesc = pup.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBreed && !matchesColor && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [availablePuppies, selectedBreed, selectedOrigin, selectedGender, searchQuery]);

  const resetFilters = () => {
    setSelectedBreed("all");
    setSelectedOrigin("all");
    setSelectedGender("all");
    setSearchQuery("");
  };

  const doorThemes: ("warm" | "dark" | "caramel")[] = ["warm", "dark", "caramel"];

  return (
    <div className="w-full py-10 sm:py-14 md:py-16 bg-[#FFF3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
              find your forever friend
            </span>
            <WavyUnderline className="w-44 mt-0.5" />
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#2A1A12] tracking-tight">
            Available Teacup Puppies
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#5A4030]">
            Every puppy is vet-certified, microchipped, and raised with gentle love in Dubai or Korea. Knock to peek inside!
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-[#FFFDF8] rounded-3xl border-[2.5px] border-[#2A1A12] p-5 sm:p-6 shadow-chunky mb-12">
          {/* Top Row: Search + Origin + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-5">
            {/* Search Bar */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                placeholder="Search by puppy name, breed, or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-sm text-[#2A1A12] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Origin Dropdown */}
            <div className="sm:col-span-3">
              <select
                aria-label="Filter by origin"
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-sm font-semibold text-[#2A1A12] focus:outline-none"
              >
                <option value="all">All Locations</option>
                <option value="local">Dubai Showroom (Local)</option>
                <option value="imported">Korea to Dubai (Imported)</option>
              </select>
            </div>

            {/* Gender Dropdown */}
            <div className="sm:col-span-3">
              <select
                aria-label="Filter by gender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-sm font-semibold text-[#2A1A12] focus:outline-none"
              >
                <option value="all">All Genders</option>
                <option value="boy">Boys</option>
                <option value="girl">Girls</option>
              </select>
            </div>
          </div>

          {/* Breed Chips Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2A1A12]/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#2A1A12] uppercase tracking-wider mr-1">
                Breed:
              </span>
              {BREEDS.map((breed) => {
                const isActive =
                  selectedBreed.toLowerCase() === breed.toLowerCase();
                return (
                  <button
                    key={breed}
                    type="button"
                    onClick={() => setSelectedBreed(breed)}
                    className={`px-3.5 py-1 rounded-full text-xs font-bold border-2 border-[#2A1A12] transition-all shadow-sm ${
                      isActive
                        ? "bg-[#9A4F28] text-white shadow-chunky-sm"
                        : "bg-[#FFF8EA] text-[#2A1A12] hover:bg-white"
                    }`}
                  >
                    {breed === "all" ? "All Breeds" : breed}
                  </button>
                );
              })}
            </div>

            {/* Reset Filters button */}
            {(selectedBreed !== "all" ||
              selectedOrigin !== "all" ||
              selectedGender !== "all" ||
              searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A4F28] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8 text-sm font-bold text-[#2A1A12]">
          <span>
            Showing {filteredPuppies.length} available{" "}
            {filteredPuppies.length === 1 ? "puppy" : "puppies"}
          </span>
          <span className="text-xs text-[#9A4F28]">
            Hover or tap any door to see photos
          </span>
        </div>

        {/* Puppies Grid */}
        {filteredPuppies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 justify-items-center">
            {filteredPuppies.map((pup, index) => {
              const theme = doorThemes[index % doorThemes.length];
              return (
                <DoorCard
                  key={pup.id}
                  puppy={pup}
                  colorScheme={theme}
                  className="w-full max-w-[300px]"
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-[#FFFDF8] rounded-3xl border-2 border-dashed border-[#2A1A12]/30 p-8 max-w-xl mx-auto shadow-sm">
            <span className="font-handwriting text-3xl text-[#9A4F28] font-bold">
              no puppies match that filter!
            </span>
            <p className="mt-3 text-sm text-[#5A4030]">
              We frequently welcome new litters from our trusted partner breeders. Tell our concierge your dream puppy breed on WhatsApp!
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <ChunkyButton onClick={resetFilters} variant="outline" size="md">
                Reset all filters
              </ChunkyButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

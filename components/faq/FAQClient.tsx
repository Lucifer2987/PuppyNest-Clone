"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CorkBoard, FAQ } from "./CorkBoard";
import { FAQLeftColumn } from "./FAQLeftColumn";
import { ChunkyButton } from "@/components/ChunkyButton";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/config";

interface FAQClientProps {
  initialFaqs: FAQ[];
}

export function FAQClient({ initialFaqs }: FAQClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Sync open item with window.location.hash on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && initialFaqs.some((f) => f.slug === hash)) {
        setOpenSlug(hash);
      }
    }
  }, [initialFaqs]);

  // Filter notes live based on search query matching question or answer
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return initialFaqs;
    const q = searchQuery.toLowerCase().trim();
    return initialFaqs.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    );
  }, [initialFaqs, searchQuery]);

  const handleToggle = (slug: string) => {
    if (openSlug === slug) {
      setOpenSlug(null);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else {
      setOpenSlug(slug);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${slug}`);
      }
    }
  };

  return (
    <div className="w-full">
      {/* 2-Column Responsive Layout: ~30% Left / ~70% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column (Sticky on desktop) */}
        <div className="lg:col-span-4 xl:col-span-4">
          <FAQLeftColumn
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            count={filteredFaqs.length}
          />
        </div>

        {/* Right Column (Cork Board with Pinned Paper Notes) */}
        <div className="lg:col-span-8 xl:col-span-8">
          <CorkBoard
            faqs={filteredFaqs}
            openSlug={openSlug}
            onToggle={handleToggle}
            searchQuery={searchQuery}
          />

          {/* Closing Line Below Cork Board */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFFDF8]/15 border border-[#FFFDF8]/20 backdrop-blur-xs text-center sm:text-left">
            <p className="font-body text-sm text-[#FFF3D9]/90 font-medium">
              Still curious? Say hello to our concierge team directly.
            </p>
            <ChunkyButton
              href={getWhatsAppUrl("Hi PuppyNest! I'd love to chat with a concierge.")}
              variant="white"
              size="sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 fill-[#2A1A12] stroke-none" />
              <span>Say hello on WhatsApp</span>
            </ChunkyButton>
          </div>
        </div>
      </div>
    </div>
  );
}

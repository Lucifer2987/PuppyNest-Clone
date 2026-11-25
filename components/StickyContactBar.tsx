"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { getWhatsAppUrl, siteConfig } from "@/lib/config";
import { ChunkyButton } from "@/components/ChunkyButton";

export function StickyContactBar() {
  const [showDesktopFloat, setShowDesktopFloat] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowDesktopFloat(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Sticky Bottom Bar (Visible on mobile screens < 640px) */}
      <aside
        data-mascot-avoid="true"
        aria-label="Quick contact"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF3D9]/95 backdrop-blur-md border-t-2 border-[#2A1A12] px-3 py-2 flex items-center justify-between gap-2 shadow-lg"
      >
        <ChunkyButton
          href={`tel:${siteConfig.phone}`}
          variant="outline"
          size="sm"
          className="flex-1 py-2"
          ariaLabel="Call us"
        >
          <Phone className="w-4 h-4 text-[#9A4F28]" />
          <span>Call Showroom</span>
        </ChunkyButton>

        <ChunkyButton
          href={getWhatsAppUrl()}
          variant="whatsapp"
          size="sm"
          className="flex-1 py-2"
          ariaLabel="WhatsApp us"
        >
          <MessageCircle className="w-4 h-4 fill-current stroke-none" />
          <span>WhatsApp</span>
        </ChunkyButton>
      </aside>

      {/* Desktop Floating WhatsApp Pill (Visible on screens >= 640px when scrolled down) */}
      <aside
        data-mascot-avoid="true"
        aria-label="Floating WhatsApp"
        className={`hidden sm:block fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          showDesktopFloat
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ChunkyButton
          href={getWhatsAppUrl()}
          variant="whatsapp"
          size="md"
          className="shadow-chunky-lg hover:scale-105 transition-transform"
          ariaLabel="Chat with PuppyNest Concierge on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current stroke-none" />
          <span className="font-bold">Chat with Concierge</span>
        </ChunkyButton>
      </aside>
    </>
  );
}

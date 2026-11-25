"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Phone, MapPin, X } from "lucide-react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { WavyUnderline } from "@/components/WavyUnderline";
import { Mascot } from "@/components/Mascot";
import { PawIcon } from "@/components/PawTrail";
import { getWhatsAppUrl, siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  currentPath: string;
}

export function MobileMenu({ isOpen, onClose, links, currentPath }: MobileMenuProps) {
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 bg-[#FFF3D9] flex flex-col justify-between overflow-y-auto px-6 py-6 animate-in fade-in duration-200"
    >
      {/* Top bar with Mascot & Close button */}
      <div className="flex items-center justify-between border-b-2 border-[#2A1A12]/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF8EA] border-2 border-[#2A1A12] flex items-center justify-center p-1">
            <Mascot pose="idle" size={32} />
          </div>
          <span className="font-display font-black text-xl text-[#2A1A12]">PuppyNest</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full border-2 border-[#2A1A12] bg-[#FFF8EA] text-[#2A1A12] shadow-chunky-sm active:translate-y-[2px] active:shadow-none"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Center content */}
      <div className="my-auto py-8 text-center flex flex-col items-center">
        {/* Handwritten eyebrow heading */}
        <div className="inline-block mb-6">
          <span className="font-handwriting text-2xl text-[#9A4F28] font-bold">
            where to, friend?
          </span>
          <WavyUnderline className="w-36 mx-auto mt-0.5" />
        </div>

        {/* Links list */}
        <nav className="flex flex-col items-center gap-4 w-full">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "font-display text-2xl sm:text-3xl font-black tracking-tight py-1.5 transition-transform hover:scale-105 flex items-center gap-2",
                  isActive ? "text-[#9A4F28]" : "text-[#2A1A12]"
                )}
              >
                {isActive && <PawIcon size={16} fill="#9A4F28" />}
                <span>{link.label}</span>
                {isActive && <PawIcon size={16} fill="#9A4F28" />}
              </Link>
            );
          })}
        </nav>

        {/* Big WhatsApp CTA Button */}
        <div className="mt-8 w-full max-w-xs">
          <ChunkyButton
            href={getWhatsAppUrl()}
            variant="whatsapp"
            size="lg"
            className="w-full text-center"
            onClick={onClose}
          >
            <MessageCircle className="w-5 h-5 fill-current stroke-none" />
            <span>Chat on WhatsApp</span>
          </ChunkyButton>
        </div>
      </div>

      {/* Bottom details info */}
      <div className="border-t-2 border-[#2A1A12]/15 pt-5 text-center text-xs text-[#5A4030] space-y-2">
        <p className="flex items-center justify-center gap-1.5 font-semibold text-[#2A1A12]">
          <MapPin className="w-3.5 h-3.5 text-[#9A4F28]" />
          <span>{siteConfig.address.display}</span>
        </p>
        <p className="flex items-center justify-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#9A4F28]" />
          <a href={`tel:${siteConfig.phone}`} className="hover:underline">
            {siteConfig.phoneDisplay}
          </a>
        </p>
        <p className="font-handwriting text-sm text-[#9A4F28] font-bold">
          © 2026 PuppyNest Dubai • Pure Joy Guaranteed
        </p>
      </div>
    </div>
  );
}

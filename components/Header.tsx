"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PawIcon } from "@/components/PawTrail";
import { ScallopDivider } from "@/components/ScallopDivider";
import { getWhatsAppUrl } from "@/lib/config";
import { MobileMenu } from "@/components/MobileMenu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/puppies", label: "Puppies" },
  { href: "/happy-families", label: "Happy families" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit & contact" },
];

export function Header() {
  const pathname = usePathname();
  const hasScallopedBottom =
    (pathname.startsWith("/puppies/") && pathname !== "/puppies") ||
    pathname === "/happy-families" ||
    pathname === "/faq";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 1. Plain 3px solid #2A1A12 line at the very top of the page */}
      <div className="w-full h-[3px] bg-[#2A1A12] z-50 shrink-0" />

      {/* 2. Main sticky header (84px on desktop, 64px on mobile) */}
      <header
        data-mascot-avoid="true"
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          hasScallopedBottom || scrolled
            ? "bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#2A1A12]/[0.08] shadow-sm"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-[1920px] mx-auto h-[64px] md:h-[84px] px-5 sm:px-8 lg:px-[56px] flex items-center justify-between">
          {/* Left Column: Brand Logo & Wordmark (Logo left edge ~56px from screen edge) */}
          <div className="flex-1 flex items-center justify-start">
            <Logo size="md" />
          </div>

          {/* Center Column: Perfectly Centered Desktop Nav */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-[38px] justify-center"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative font-body text-[16px] font-semibold transition-colors duration-150 py-1 flex flex-col items-center group select-none",
                    isActive
                      ? "text-[#9A4F28]"
                      : "text-[#2A1A12] hover:text-[#9A4F28]"
                  )}
                >
                  <span>{link.label}</span>

                  {/* Tiny 12px rust paw icon centered 6px under active text */}
                  {isActive ? (
                    <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 text-[#9A4F28] pointer-events-none">
                      <PawIcon size={12} fill="currentColor" />
                    </span>
                  ) : (
                    <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 text-[#9A4F28] transition-opacity pointer-events-none">
                      <PawIcon size={10} fill="currentColor" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Column: WhatsApp Button (~56px from right edge) + Mobile Hamburger */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <a
              href={getWhatsAppUrl("Hi PuppyNest! I'd like to chat about your available puppies.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center h-[46px] px-[21px] font-body font-bold text-[16px] text-white bg-[#3A7D54] rounded-full shadow-[0_4px_0_#24543A] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#24543A] active:translate-y-0.5 active:shadow-[0_2px_0_#24543A] select-none"
              aria-label="WhatsApp us"
            >
              WhatsApp us
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#2A1A12] hover:bg-[#2A1A12]/5 rounded-xl transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Wavy Scalloped Bottom Edge for Detail Page & Happy Families */}
        {hasScallopedBottom && (
          <div className="absolute -bottom-[21px] inset-x-0 w-full overflow-hidden leading-none pointer-events-none select-none z-30">
            <ScallopDivider fillColor="#FFFDF8" strokeColor="#2A1A12" className="h-[22px]" />
          </div>
        )}
      </header>

      {/* Mobile navigation drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={NAV_LINKS}
        currentPath={pathname}
      />
    </>
  );
}

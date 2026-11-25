"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
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

/** Soft scalloped edge — cream bumps with a barely visible stroke + gentle shadow.
 *  Each bump ≈ 36 × 14 px (desktop) or 28 × 11 px (mobile).
 */
function SoftScallopEdge() {
  return (
    <div
      className="absolute -bottom-[13px] inset-x-0 w-full pointer-events-none select-none overflow-visible"
      style={{ height: 14, filter: "drop-shadow(0 2px 2px rgba(42,26,18,0.10))" }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full block"
        preserveAspectRatio="none"
        viewBox="0 0 1440 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="soft-scallop"
            x="0"
            y="0"
            width="36"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            {/* Filled bump hanging down */}
            <path d="M0 0 A18 12.5 0 0 0 36 0 Z" fill="#FFFDF8" />
            {/* Barely visible stroke on the curve only */}
            <path
              d="M0 0 A18 12.5 0 0 0 36 0"
              fill="none"
              stroke="#2A1A12"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1440" height="14" fill="url(#soft-scallop)" />
      </svg>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // Dark-hero pages keep the cream scallops with a 2.5px dark outline
  const hasDarkOutlineScallops = pathname === "/happy-families" || pathname === "/faq";
  // Puppy detail pages also get the dark outline
  const hasPuppyDetailScallops =
    pathname.startsWith("/puppies/") && pathname !== "/puppies";

  const useDarkScallops = hasDarkOutlineScallops || hasPuppyDetailScallops;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
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
          "sticky top-0 z-40 w-full transition-colors duration-200 relative",
          scrolled
            ? "bg-[#FFFDF8]/[0.94] backdrop-blur-[8px]"
            : "bg-[#FFFDF8]"
        )}
      >
        <div className="relative z-10 max-w-[1920px] mx-auto h-[64px] md:h-[84px] px-[20px] md:px-[56px] flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* Left Column: Brand Logo & Wordmark */}
          <div className="flex items-center justify-start">
            <Logo size="md" />
          </div>

          {/* Center Column: Centered Desktop Nav */}
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
                    "relative font-body text-[16px] font-semibold leading-none transition-colors duration-200 flex items-center justify-center group select-none whitespace-nowrap",
                    isActive
                      ? "text-[#9A4F28]"
                      : "text-[#2A1A12] hover:text-[#9A4F28]"
                  )}
                >
                  <span>{link.label}</span>

                  {/* 12px rust paw icon centered 14px below text baseline */}
                  {isActive ? (
                    <motion.span
                      key={pathname}
                      initial={
                        prefersReducedMotion
                          ? false
                          : { y: -4, scale: 0.75, opacity: 0 }
                      }
                      animate={{ y: 0, scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 18,
                      }}
                      className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 text-[#9A4F28] pointer-events-none"
                    >
                      <PawIcon size={12} fill="currentColor" />
                    </motion.span>
                  ) : (
                    <span className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 text-[#9A4F28] transition-opacity duration-200 pointer-events-none">
                      <PawIcon size={10} fill="currentColor" />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Column: WhatsApp Button + Mobile Hamburger */}
          <div className="flex items-center justify-end gap-3">
            <a
              href={getWhatsAppUrl("Hi PuppyNest! I'd like to chat about your available puppies.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center justify-center h-[48px] px-[22px] font-body font-bold text-[16px] text-white bg-[#3A7D54] border-2 border-[#1F4A32] rounded-full shadow-[0_5px_0_#1F4A32] transition-all duration-150 hover:-translate-y-[2px] hover:shadow-[0_7px_0_#1F4A32] active:translate-y-[3px] active:shadow-[0_2px_0_#1F4A32] select-none whitespace-nowrap"
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

        {/* ========== Scalloped Bottom Edge ========== */}
        {useDarkScallops ? (
          /* Dark-outlined cream scallops for /happy-families, /faq, /puppies/[slug] */
          <div className="absolute -bottom-[21px] inset-x-0 w-full overflow-hidden leading-none pointer-events-none select-none z-[1]">
            <ScallopDivider fillColor="#FFFDF8" strokeColor="#2A1A12" className="h-[22px]" />
          </div>
        ) : (
          /* Soft scallops for all other pages (homepage, /puppies, /how-it-works, /contact, etc.) */
          <SoftScallopEdge />
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

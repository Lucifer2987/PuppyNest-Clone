"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { z } from "zod";
import { CheckCircle2, MessageCircle, AlertCircle, Sparkles } from "lucide-react";
import { ChunkyButton } from "@/components/ChunkyButton";
import { Mascot } from "@/components/Mascot";
import { getWhatsAppUrl } from "@/lib/config";
import { claimMascotOwnership, releaseMascotOwnership } from "@/hooks/useMascotPosition";

// Client-side Zod Schema
const ContactLetterSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name (at least 2 letters)"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone or WhatsApp number")
    .regex(/^[+0-9\s\-()]+$/, "Phone number can only contain digits and symbols (+, -, ())"),
  email: z.string().trim().email("Please enter a valid email address").optional().or(z.literal("")),
  area: z.string().trim().max(100).optional(),
  topic: z.string().trim().max(100).optional(),
  message: z.string().trim().max(1000).optional(),
  honeypot: z.string().optional(),
});

type FormData = z.infer<typeof ContactLetterSchema>;

export function LetterFormCard() {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    area: "",
    topic: "",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [envelopeFlight, setEnvelopeFlight] = useState(false);
  const [isExcited, setIsExcited] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for strictly ONE active mascot
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (visible) {
          claimMascotOwnership("contact-mascot");
        } else {
          releaseMascotOwnership("contact-mascot");
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      releaseMascotOwnership("contact-mascot");
    };
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot spam trap
    if (formData.honeypot) {
      setIsSuccess(true);
      return;
    }

    const validation = ContactLetterSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0]?.toString() || "form";
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "contact",
          puppySlug: "showroom-visit",
          puppyName: formData.topic || "Showroom & Adoption Letter",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrors({ form: data.error || "Unable to send your letter. Please try WhatsApp." });
        setIsSubmitting(false);
        return;
      }

      // Trigger folding & envelope flight animation
      setIsExcited(true);
      if (prefersReducedMotion) {
        setIsSuccess(true);
      } else {
        setEnvelopeFlight(true);
        setTimeout(() => {
          setIsSuccess(true);
        }, 950);
      }
    } catch {
      setErrors({ form: "Network error occurred. Please try WhatsApp directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={cardRef} className="w-full relative select-none">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="letter-card"
            initial={{ opacity: 0, y: 20 }}
            animate={
              envelopeFlight
                ? {
                    scale: [1, 0.75, 0.45],
                    rotate: [0, 8, 24],
                    x: [0, 80, 480],
                    y: [0, -40, -380],
                    opacity: [1, 0.9, 0],
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  }
                : { opacity: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative rounded-[24px] sm:rounded-[32px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[4px_4px_0_#2A1A12] p-6 sm:p-10 md:p-12 overflow-visible"
          >
            {/* Square Postage Stamp with Paw in Top-Right Corner */}
            <div className="absolute top-4 right-5 sm:top-6 sm:right-7 z-20 rotate-[8deg] drop-shadow-sm select-none pointer-events-none">
              <div className="w-12 h-14 sm:w-14 sm:h-16 rounded border-2 border-dashed border-[#9A4F28] bg-[#FFF5E6] p-1 flex flex-col items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-[#9A4F28]">
                  AIR MAIL
                </span>
                {/* Paw Print Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#9A4F28">
                  <ellipse cx="12" cy="15" rx="5" ry="4" />
                  <circle cx="6" cy="9" r="2.5" />
                  <circle cx="10" cy="6" r="2.5" />
                  <circle cx="14" cy="6" r="2.5" />
                  <circle cx="18" cy="9" r="2.5" />
                </svg>
                <span className="text-[7px] font-bold text-[#2A1A12]/70 font-mono">
                  DXB · 2026
                </span>
              </div>
            </div>

            {/* Dashed Inner Passport Frame */}
            <div className="relative rounded-2xl border-2 border-dashed border-[#2A1A12]/20 p-5 sm:p-8">
              {/* Salutation */}
              <div className="mb-6">
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#2A1A12]">
                  Dear PuppyNest,
                </h3>
              </div>

              {/* General Form Error Alert */}
              {errors.form && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Letter Sentences with Inline Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-6 text-[#2A1A12] font-body text-base sm:text-lg leading-loose">
                {/* Honeypot field (hidden from screen, catches bots) */}
                <input
                  type="text"
                  name="user_note_hp"
                  value={formData.honeypot}
                  onChange={(e) => handleChange("honeypot", e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Sentence 1: Name, Phone, Email */}
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3">
                  <span>My name is</span>
                  <div className="relative inline-block min-w-[160px] sm:min-w-[200px]">
                    <input
                      type="text"
                      aria-label="Your full name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="your full name *"
                      className="w-full bg-transparent border-b-2 border-dashed border-[#C98B4D] focus:border-solid focus:border-[#9A4F28] focus:outline-none px-2 py-0.5 text-base sm:text-lg text-[#2A1A12] font-bold placeholder:font-handwriting placeholder:text-[#5A4030]/50 placeholder:font-normal"
                    />
                    {errors.name && (
                      <span className="block text-[11px] text-red-600 font-semibold mt-0.5" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <span>, and you can reach me on</span>
                  <div className="relative inline-block min-w-[170px] sm:min-w-[210px]">
                    <input
                      type="tel"
                      aria-label="Your phone or WhatsApp number"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+971 50 123 4567 *"
                      className="w-full bg-transparent border-b-2 border-dashed border-[#C98B4D] focus:border-solid focus:border-[#9A4F28] focus:outline-none px-2 py-0.5 text-base sm:text-lg text-[#2A1A12] font-bold placeholder:font-handwriting placeholder:text-[#5A4030]/50 placeholder:font-normal"
                    />
                    {errors.phone && (
                      <span className="block text-[11px] text-red-600 font-semibold mt-0.5" role="alert">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  <span>or by email at</span>
                  <div className="relative inline-block min-w-[170px] sm:min-w-[210px]">
                    <input
                      type="email"
                      aria-label="Your email address (optional)"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="email (optional)"
                      className="w-full bg-transparent border-b-2 border-dashed border-[#C98B4D] focus:border-solid focus:border-[#9A4F28] focus:outline-none px-2 py-0.5 text-base sm:text-lg text-[#2A1A12] font-medium placeholder:font-handwriting placeholder:text-[#5A4030]/50 placeholder:font-normal"
                    />
                    {errors.email && (
                      <span className="block text-[11px] text-red-600 font-semibold mt-0.5" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <span>.</span>
                </div>

                {/* Sentence 2: Location and Topic */}
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 pt-1">
                  <span>I live in</span>
                  <div className="relative inline-block min-w-[150px] sm:min-w-[180px]">
                    <input
                      type="text"
                      aria-label="Your neighborhood or city"
                      value={formData.area}
                      onChange={(e) => handleChange("area", e.target.value)}
                      placeholder="e.g. Dubai Marina"
                      className="w-full bg-transparent border-b-2 border-dashed border-[#C98B4D] focus:border-solid focus:border-[#9A4F28] focus:outline-none px-2 py-0.5 text-base sm:text-lg text-[#2A1A12] font-medium placeholder:font-handwriting placeholder:text-[#5A4030]/50 placeholder:font-normal"
                    />
                  </div>

                  <span>, and I&apos;m curious about</span>
                  <div className="relative inline-block min-w-[180px] sm:min-w-[230px]">
                    <input
                      type="text"
                      aria-label="Puppy or topic of interest"
                      value={formData.topic}
                      onChange={(e) => handleChange("topic", e.target.value)}
                      placeholder="e.g. a teacup Maltipoo boy"
                      className="w-full bg-transparent border-b-2 border-dashed border-[#C98B4D] focus:border-solid focus:border-[#9A4F28] focus:outline-none px-2 py-0.5 text-base sm:text-lg text-[#2A1A12] font-medium placeholder:font-handwriting placeholder:text-[#5A4030]/50 placeholder:font-normal"
                    />
                  </div>
                  <span>.</span>
                </div>

                {/* Ruled Notebook Textarea */}
                <div className="pt-3">
                  <textarea
                    aria-label="Additional message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Anything else you'd like to tell us..."
                    className="w-full bg-transparent border-2 border-dashed border-[#C98B4D]/60 rounded-xl p-3 focus:border-solid focus:border-[#9A4F28] focus:outline-none text-base text-[#2A1A12] placeholder:font-handwriting placeholder:text-[#5A4030]/60 resize-none"
                  />
                </div>

                {/* Sign-off & Submit Button Row */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="font-handwriting text-xl sm:text-2xl text-[#9A4F28] font-bold">
                    with love, a future puppy parent
                  </span>

                  <ChunkyButton
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">🐾</span>
                        <span>Posting letter...</span>
                      </span>
                    ) : (
                      <span>Post my letter</span>
                    )}
                  </ChunkyButton>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          /* SUCCESS STATE: Card replaced with posted confirmation */
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative rounded-[24px] sm:rounded-[32px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[4px_4px_0_#2A1A12] p-8 sm:p-12 text-center"
          >
            {/* Wax Seal Stamp Icon */}
            <div className="w-16 h-16 rounded-full bg-[#9A4F28] border-2 border-[#2A1A12] mx-auto flex items-center justify-center text-[#FFFDF8] shadow-md mb-5">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl text-[#2A1A12] mb-3">
              Letter posted!
            </h3>

            <p className="font-body text-base sm:text-lg text-[#5A4030] max-w-md mx-auto mb-8 leading-relaxed">
              We&apos;ve received your note and will write back to you promptly. You can also chat with us on WhatsApp right away!
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <ChunkyButton
                href={getWhatsAppUrl(`Hi PuppyNest, I just submitted an adoption letter from ${formData.name || "a future parent"}!`)}
                variant="whatsapp"
                size="md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 fill-current stroke-none" />
                <span>Chat on WhatsApp now</span>
              </ChunkyButton>

              <ChunkyButton
                onClick={() => {
                  setIsSuccess(false);
                  setEnvelopeFlight(false);
                  setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    area: "",
                    topic: "",
                    message: "",
                    honeypot: "",
                  });
                }}
                variant="outline"
                size="md"
              >
                <span>Write another letter</span>
              </ChunkyButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Sitting at the Bottom-Right Corner outside the card */}
      <div className="absolute -bottom-8 -right-4 sm:-bottom-10 sm:-right-6 z-30 pointer-events-none">
        {isInView && (
          <motion.div
            animate={{
              y: isExcited ? [-4, 4, -4] : [0, -3, 0],
              rotate: isExcited ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              repeat: isExcited ? 3 : Infinity,
              duration: isExcited ? 0.3 : 3,
              ease: "easeInOut",
            }}
          >
            <Mascot
              pose="sit"
              facing="left"
              size={105}
              isExcited={isExcited}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

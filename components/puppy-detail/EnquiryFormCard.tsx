"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Send, CheckCircle2, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import { Puppy } from "@/lib/types";
import { Mascot } from "@/components/Mascot";
import { PawIcon } from "@/components/PawTrail";
import { triggerExcitedMascot } from "@/hooks/useMascotPosition";
import { getPuppyWhatsAppUrl } from "@/lib/config";
import { cn } from "@/lib/utils";

// Client-side Zod validation schema
const ClientEnquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters)"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone or WhatsApp number")
    .regex(/^[+0-9\s\-()]+$/, "Phone number can only contain digits, spaces, +, -, and ()"),
  email: z.string().trim().email("Please enter a valid email address").optional().or(z.literal("")),
  area: z.string().trim().optional(),
  message: z.string().trim().optional(),
  honeypot: z.string().optional(),
});

interface EnquiryFormCardProps {
  puppy: Puppy;
  className?: string;
}

export function EnquiryFormCard({ puppy, className }: EnquiryFormCardProps) {
  const isAvailable = puppy.status === "available";

  const defaultMessage = isAvailable
    ? `Hi! I'd love to know more about ${puppy.name} (${puppy.breed}).`
    : `Hi! I noticed ${puppy.name} (${puppy.breed}) has found a home, but I'd love to know when a similar puppy becomes available.`;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    area: "",
    message: defaultMessage,
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // 1. Client-side Zod validation
    const parsed = ClientEnquirySchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString() || "form";
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // 2. Submit to /api/enquiry
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          puppySlug: puppy.slug,
          puppyName: puppy.name,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setServerError(result.error || "Could not submit enquiry. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      // 3. Success state
      setIsSubmitting(false);
      setIsSuccess(true);
      triggerExcitedMascot();
    } catch (err) {
      console.error("Enquiry submission failed:", err);
      setServerError("Network error. Please check your internet connection or message on WhatsApp.");
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl = getPuppyWhatsAppUrl(puppy.name, puppy.breed, puppy.slug);

  return (
    <section id="enquire" className={cn("w-full py-8 sm:py-12 select-none", className)}>
      <div className="relative w-full rounded-[22px] border-[2.5px] border-[#2A1A12] bg-[#FFFDF8] shadow-[6px_6px_0_#2A1A12] p-6 sm:p-8 md:p-10 overflow-hidden">
        {/* Dashed inner border inset 8px */}
        <div className="absolute inset-2 sm:inset-3 rounded-[16px] border-2 border-dashed border-[#C98B4D]/60 pointer-events-none" />

        {/* Tape / Paw sticker at top-right corner (~8deg tilt) */}
        <div className="absolute top-4 right-5 sm:right-7 z-20 rotate-8 pointer-events-none">
          <div className="px-3 py-1 bg-[#F5DEB3]/90 border border-[#2A1A12]/40 rounded-sm shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
            <PawIcon size={14} className="text-[#9A4F28]" fill="currentColor" />
            <span className="font-handwriting text-[11px] text-[#2A1A12] font-bold tracking-wider uppercase">
              PuppyNest Note
            </span>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {isSuccess ? (
          <div
            className="relative z-10 flex flex-col items-center text-center py-8 sm:py-12 px-4 max-w-lg mx-auto"
            aria-live="polite"
          >
            {/* Mascot in Excited Wag Pose */}
            <div className="mb-4">
              <Mascot pose="idle" isExcited={true} size={110} />
            </div>

            <div className="inline-flex items-center gap-2 mb-2 text-[#3A7D54]">
              <CheckCircle2 className="w-5 h-5 fill-current text-white stroke-[#3A7D54]" />
              <span className="font-handwriting text-base font-bold tracking-wide">
                Enquiry received!
              </span>
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-[#2A1A12] tracking-tight mb-2">
              Thanks, we&apos;ll be in touch!
            </h3>

            <p className="font-body text-sm sm:text-base text-[#5A4030] leading-relaxed mb-6">
              Our team has received your enquiry for <strong>{puppy.name}</strong> and will get back
              to you promptly with photos, video updates, and next steps.
            </p>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3A7D54] text-white border-2 border-[#2A1A12] font-body font-bold text-sm sm:text-base shadow-[0_4px_0_#214730] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#214730] transition-all active:translate-y-0.5 active:shadow-[0_2px_0_#214730]"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Continue on WhatsApp for instant reply</span>
            </a>
          </div>
        ) : (
          /* FORM STATE */
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Numbered Badge, Title & Description */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFF3D9] border-2 border-[#2A1A12] text-[#2A1A12] font-body text-xs font-black flex items-center justify-center shadow-xs">
                  3
                </span>
                <span className="font-handwriting text-base sm:text-lg text-[#9A4F28] font-bold tracking-wide">
                  say hello to PuppyNest...
                </span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-[#2A1A12] tracking-tight leading-tight">
                {isAvailable ? `Ask about ${puppy.name}` : `Ask for a puppy like ${puppy.name}`}
              </h2>

              <p className="font-body text-sm sm:text-base text-[#5A4030] leading-relaxed pt-1">
                Leave your details and our team will get back to you promptly, or message us on
                WhatsApp for the quickest reply.
              </p>

              {/* Direct WhatsApp Callout Pill */}
              <div className="mt-2 p-3.5 rounded-[14px] bg-[#FFF9EE] border border-[#C98B4D]/40 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EBF7EE] border border-[#3A7D54] text-[#3A7D54] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div className="text-xs text-[#5A4030]">
                  <span className="font-bold text-[#2A1A12] block">Prefer instant messaging?</span>
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9A4F28] font-bold hover:underline"
                  >
                    Chat directly with our Dubai team →
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Form Inputs Grid */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-4">
              {serverError && (
                <div
                  className="p-3 rounded-xl bg-red-50 border-2 border-red-300 text-red-800 text-xs sm:text-sm font-semibold"
                  role="alert"
                >
                  {serverError}
                </div>
              )}

              {/* Hidden Honeypot Field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Leave this field blank</label>
                <input
                  type="text"
                  id="website"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Name */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="font-body text-xs font-bold text-[#2A1A12]">
                    Your name <span className="text-[#9A4F28]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Al Mansoori"
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={cn(
                      "w-full h-11 px-3.5 rounded-[12px] bg-[#FFFEFA] border-2 text-[#2A1A12] text-sm font-medium placeholder:text-[#5A4030]/40 transition-all focus:outline-none focus:ring-2",
                      errors.name
                        ? "border-red-500 focus:ring-red-400"
                        : "border-[#2A1A12] focus:ring-[#9A4F28]"
                    )}
                  />
                  {errors.name && (
                    <span id="name-error" className="text-xs text-red-600 font-bold" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* 2. Phone or WhatsApp */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="phone" className="font-body text-xs font-bold text-[#2A1A12]">
                    Phone or WhatsApp <span className="text-[#9A4F28]">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+971 50 000 0000"
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
                    className={cn(
                      "w-full h-11 px-3.5 rounded-[12px] bg-[#FFFEFA] border-2 text-[#2A1A12] text-sm font-medium placeholder:text-[#5A4030]/40 transition-all focus:outline-none focus:ring-2",
                      errors.phone
                        ? "border-red-500 focus:ring-red-400"
                        : "border-[#2A1A12] focus:ring-[#9A4F28]"
                    )}
                  />
                  {errors.phone ? (
                    <span id="phone-error" className="text-xs text-red-600 font-bold" role="alert">
                      {errors.phone}
                    </span>
                  ) : (
                    <span id="phone-hint" className="text-[11px] text-[#5A4030]/75">
                      WhatsApp number with country code
                    </span>
                  )}
                </div>

                {/* 3. Email (optional) */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-body text-xs font-bold text-[#2A1A12]">
                    Email <span className="text-[#5A4030]/60 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sarah@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={cn(
                      "w-full h-11 px-3.5 rounded-[12px] bg-[#FFFEFA] border-2 text-[#2A1A12] text-sm font-medium placeholder:text-[#5A4030]/40 transition-all focus:outline-none focus:ring-2",
                      errors.email
                        ? "border-red-500 focus:ring-red-400"
                        : "border-[#2A1A12] focus:ring-[#9A4F28]"
                    )}
                  />
                  {errors.email && (
                    <span id="email-error" className="text-xs text-red-600 font-bold" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* 4. Your area (optional) */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="area" className="font-body text-xs font-bold text-[#2A1A12]">
                    Your area <span className="text-[#5A4030]/60 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Dubai Marina, Downtown"
                    className="w-full h-11 px-3.5 rounded-[12px] bg-[#FFFEFA] border-2 border-[#2A1A12] text-[#2A1A12] text-sm font-medium placeholder:text-[#5A4030]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
                  />
                </div>
              </div>

              {/* 5. Message (optional textarea) */}
              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="font-body text-xs font-bold text-[#2A1A12]">
                  Message <span className="text-[#5A4030]/60 font-normal">(optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-[12px] bg-[#FFFEFA] border-2 border-[#2A1A12] text-[#2A1A12] text-sm font-medium placeholder:text-[#5A4030]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#9A4F28] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 rounded-full bg-[#9A4F28] text-white border-2 border-[#2A1A12] font-body font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#1A0E08] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_#1A0E08] active:translate-y-0.5 active:shadow-[0_2px_0_#1A0E08] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#9A4F28]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>{isAvailable ? "Send enquiry" : "Ask for a similar puppy"}</span>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

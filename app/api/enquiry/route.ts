import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// In-memory rate limiting map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Server-side Zod validation schema
const EnquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name (at least 2 characters)").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone or WhatsApp number")
    .max(30)
    .regex(/^[+0-9\s\-()]+$/, "Phone number can only contain digits, spaces, +, -, and ()"),
  email: z.string().trim().email("Please enter a valid email address").optional().or(z.literal("")),
  area: z.string().trim().max(100).optional().or(z.literal("")),
  topic: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  puppySlug: z.string().trim().optional().default("general"),
  puppyName: z.string().trim().optional().default("General Enquiry"),
  source: z.string().trim().optional().default("detail"),
  // Honeypot field for bot spam prevention
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Basic IP-based Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many enquiries sent. Please wait a minute or message us directly on WhatsApp.",
        },
        { status: 429 }
      );
    }
    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);

    // 2. Parse & Validate Payload
    const body = await req.json();
    const parsed = EnquirySchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString() || "form";
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      return NextResponse.json(
        { success: false, errors: fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 3. Honeypot check (bot submission)
    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.warn("[PuppyNest Bot Filter] Honeypot field filled. Rejecting submission silently.");
      return NextResponse.json({ success: true, message: "Enquiry received." });
    }

    const enquiryRecord = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      area: data.area || null,
      message: data.message || null,
      puppySlug: data.puppySlug,
      puppyName: data.puppyName,
      ip,
    };

    // 4. Log to console for dev visibility
    console.log("[PuppyNest Enquiry Received]", enquiryRecord);

    // 5. In development: append record to /data/enquiries.json
    try {
      const dataFilePath = path.join(process.cwd(), "data", "enquiries.json");
      let existingEnquiries: any[] = [];
      try {
        const fileContent = await fs.readFile(dataFilePath, "utf-8");
        existingEnquiries = JSON.parse(fileContent);
      } catch {
        existingEnquiries = [];
      }
      existingEnquiries.push(enquiryRecord);
      await fs.writeFile(dataFilePath, JSON.stringify(existingEnquiries, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("[PuppyNest Enquiry Storage Warning] Could not write to data/enquiries.json:", fsErr);
    }

    // =========================================================================
    // TODO: Connect external Email / CRM provider in production:
    // Examples:
    // - Resend / SendGrid / Postmark for immediate team email notification
    // - HubSpot / Zoho CRM / Pipedrive webhook for lead capture
    // - WhatsApp Business Cloud API notification webhook
    // =========================================================================

    return NextResponse.json({
      success: true,
      message: "Thank you! We've received your enquiry and will be in touch promptly.",
      enquiryId: enquiryRecord.id,
    });
  } catch (error: any) {
    console.error("[PuppyNest Enquiry Server Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your enquiry. Please try again or reach out on WhatsApp.",
      },
      { status: 500 }
    );
  }
}

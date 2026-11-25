# 🐾 PuppyNest

**A premium teacup puppy boutique — built as a fully animated, storytelling-driven e-commerce experience.**

PuppyNest is a modern, pixel-perfect web application for a Dubai-based puppy boutique. It goes far beyond a typical listing site: every page is a crafted narrative with scroll-driven animations, an interactive SVG mascot that follows the user through the entire experience, and micro-interactions that bring the brand to life.

> **Live-ready** · 29 statically generated pages · Lighthouse-optimized · Fully responsive · Accessible

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Pages & Routes](#pages--routes)
- [Design System](#design-system)
- [Mascot System](#mascot-system)
- [Animation Architecture](#animation-architecture)
- [Data Layer](#data-layer)
- [SEO & Performance](#seo--performance)
- [Configuration](#configuration)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | SSG, file-based routing, React Server Components |
| **Language** | TypeScript 5.6 | End-to-end type safety |
| **Styling** | Tailwind CSS 3.4 | Utility-first with a custom brand design system |
| **Animation** | Framer Motion 11 | Layout animations, scroll-driven transitions, gesture handling |
| **Icons** | Lucide React | Consistent, tree-shakable icon set |
| **Validation** | Zod 4 | Runtime schema validation for form data (enquiry API) |
| **Utilities** | clsx + tailwind-merge | Conditional class composition without conflicts |

**Zero external UI libraries.** Every component — buttons, cards, modals, galleries, the entire mascot — is hand-built.

---

## Key Features

### 🎭 Interactive SVG Mascot System
A fluffy poodle mascot rendered entirely in SVG with **8 articulated poses** (idle, walk, run, sit, sleep, peek, happy, wave). The mascot follows the user's scroll position across the entire site, changing behavior per section — running alongside puppy cards, sitting at the FAQ, sleeping in the footer basket. Smooth pose transitions, ear twitches, blinking, and CSS-driven tail wag animations.

### 🚪 Scroll-Driven Door Reveal
The homepage "Meet the Pups" section uses a pinned scroll container where puppy doors slide in and open as the user scrolls. Each door card reveals the puppy photo inside an arch frame, with a speech bubble, breed tag, and "Available" badge. Clicking an open door navigates to the puppy's detail page.

### 🌅 Day-to-Night Background Transition
The homepage background smoothly transitions from warm cream → tan → caramel → deep brown → night sky as the user scrolls, unifying all eight homepage sections into a single continuous narrative.

### 📱 Fully Responsive
Every component adapts from 320px mobile to 2560px ultrawide. The mascot scales, the door grid reflows, the polaroid masonry restructures, and the FAQ cork board stacks — all with fluid `clamp()` typography and container-aware layouts.

### ♿ Accessibility
- Skip-to-content link
- Semantic HTML landmarks (`<main>`, `<nav>`, `<section>`)
- `aria-live` regions for dynamic content (FAQ filter count, testimonial rotation)
- `prefers-reduced-motion` respected — all animations gracefully degrade to simple fades or static states
- Keyboard-navigable doors (Enter/Space to open/navigate)
- Focus-visible outlines on all interactive elements

### 🐾 Custom Paw Cursor
On desktop, the system cursor is replaced with an animated paw SVG that leaves a fading trail of paw prints as the user moves the mouse.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Root Layout                          │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐  │
│  │ Header  │ │  Footer  │ │ PawCursor │ │FollowMascot│ │
│  └────┬────┘ └────┬─────┘ └───────────┘ └─────┬──────┘  │
│       │           │                           │          │
│  Global persistent shell — renders on every page         │
├──────────────────────┬──────────────────────────────────┤
│                      │                                   │
│              Page Content (children)                     │
│                                                          │
│  Homepage: Hero → PupsRun → TwoWaysSignpost →           │
│            JourneyChatPhone → PassportBook →             │
│            PolaroidWall → QuestionsAnswered → DoorScene  │
│                                                          │
│  Detail:   Gallery → InfoCard → TheWayHome → Enquiry     │
│  Families: HeroSection → PolaroidWall masonry → CTA      │
│  HowItWorks: TwoWaysHome → PuppyPromise → Delivery →    │
│              WhyChooseUs → CTA                           │
│  FAQ:      CorkBoard with pinned notes + search filter   │
│  Contact:  LetterForm + ShowroomCard                     │
└──────────────────────────────────────────────────────────┘
```

**Data flow for the mascot:**

```
useMascotPosition (Zustand-style store)
  ├── mascotOwner: string        → which section "owns" the mascot
  ├── heroProgress: number       → 0-1 scroll progress in hero
  ├── floorMode: boolean         → whether mascot walks on floor track
  └── excitedTrigger: number     → timestamp to trigger excited wag

FollowMascot reads the store + scroll position →
  computes target (x, y, pose, facing) per section →
  animates with spring physics (Framer Motion)
```

---

## Project Structure

```
PuppyNest-Clone/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Header, Footer, Mascot, PawCursor)
│   ├── page.tsx                  # Homepage — 8-section storytelling scroll
│   ├── globals.css               # Tailwind directives + custom CSS keyframes
│   ├── not-found.tsx             # Custom 404 page
│   ├── robots.ts                 # Dynamic robots.txt generation
│   ├── sitemap.ts                # Dynamic XML sitemap (all routes)
│   ├── puppies/
│   │   ├── page.tsx              # Listings grid (/puppies)
│   │   ├── PuppiesClient.tsx     # Client-side filtering & grid
│   │   └── [slug]/page.tsx       # Detail page with SSG (generateStaticParams)
│   ├── happy-families/page.tsx   # Polaroid masonry + testimonials
│   ├── how-it-works/page.tsx     # Multi-section guide with tab toggle
│   ├── faq/page.tsx              # Cork board with search + pinned notes
│   ├── contact/page.tsx          # Letter-style form + showroom card
│   ├── gone-home/page.tsx        # "Gone Home" adopted puppies
│   └── api/enquiry/route.ts      # POST handler with Zod validation
│
├── components/                   # All UI components
│   ├── Mascot.tsx                # Core SVG mascot — 8 poses, tail wag, blinking
│   ├── FollowMascot.tsx          # Scroll-following mascot controller (~900 lines)
│   ├── Hero.tsx                  # Homepage hero with arch frames + mascot peek
│   ├── DoorScene.tsx             # Final CTA with opening door animation
│   ├── DayToNightBackground.tsx  # Scroll-driven gradient wrapper
│   ├── Header.tsx                # Sticky nav with scallop edge, mobile menu
│   ├── Footer.tsx                # Dark footer with sleeping mascot in basket
│   ├── ChunkyButton.tsx          # Reusable button with offset shadow
│   ├── ScallopDivider.tsx        # Wavy scalloped edge SVG divider
│   ├── PawCursor.tsx             # Custom cursor with paw trail
│   ├── PawTrail.tsx              # Fading paw print trail effect
│   ├── ArchFrame.tsx             # Arch-shaped image container
│   ├── ArgylePattern.tsx         # Decorative argyle background pattern
│   ├── NightSky.tsx              # Animated starfield background
│   ├── ScrollRevealText.tsx      # Text reveal on scroll intersection
│   ├── PolaroidWall.tsx          # Homepage polaroid section
│   ├── PassportBook.tsx          # Trust stamps in passport book
│   ├── QuestionsAnswered.tsx     # Homepage FAQ preview (3 questions)
│   ├── TwoWaysSignpost.tsx       # Tall signpost (local vs. imported)
│   ├── JourneyChatPhone.tsx      # WhatsApp chat phone mockup
│   ├── StickyContactBar.tsx      # Mobile bottom bar + desktop WhatsApp pill
│   ├── MobileMenu.tsx            # Full-screen mobile navigation
│   ├── Logo.tsx                  # Brand logo component
│   ├── WavyUnderline.tsx         # Animated SVG underline decoration
│   │
│   ├── sections/                 # Homepage scroll-pinned sections
│   │   ├── PupsRun.tsx           # Main pinned puppy-running section
│   │   ├── FloorTrack.tsx        # Floor track for mascot walking
│   │   ├── DoorGate.tsx          # Individual door gate with open/close
│   │   └── MeetThemAllGate.tsx   # Final "see all puppies" gate
│   │
│   ├── puppy-detail/             # Puppy detail page components
│   │   ├── PuppyDetailContent.tsx# Main layout orchestrator
│   │   ├── PuppyGallery.tsx      # Image gallery with prev/next + counter
│   │   ├── PuppyInfoCard.tsx     # Breed, age, gender, status card
│   │   ├── EnquiryFormCard.tsx   # "Ask about {name}" letter-style form
│   │   ├── TheWayHomeSection.tsx # "Coming home from abroad" steps
│   │   ├── PrevNextPuppyNav.tsx  # Previous/next puppy navigation
│   │   └── MobileStickyBottomBar.tsx # Mobile CTA bar
│   │
│   ├── happy-families/           # Happy Families page components
│   │   ├── HappyFamiliesHero.tsx # Hero with count-up + testimonial card
│   │   ├── PolaroidCard.tsx      # Individual polaroid with tape + tilt
│   │   ├── PolaroidWall.tsx      # Masonry grid of polaroids
│   │   └── HappyFamiliesCTA.tsx  # Bottom call-to-action
│   │
│   ├── how-it-works/             # How It Works page components
│   │   ├── HowItWorksHero.tsx    # Hero with tab toggle (In Dubai / Imported)
│   │   ├── TwoWaysHomeSection.tsx# Two-column local vs. import comparison
│   │   ├── PuppyPromiseSection.tsx# "Our premium puppy promise" passport
│   │   ├── DeliveryCollectionSection.tsx # Delivery methods + Dubai skyline
│   │   ├── WhyChooseUsSection.tsx# Trust points grid
│   │   └── HowItWorksCTA.tsx     # Bottom call-to-action
│   │
│   ├── faq/                      # FAQ page components
│   │   ├── FAQClient.tsx         # Client wrapper with search state
│   │   ├── FAQLeftColumn.tsx     # Heading, search input, mascot
│   │   └── CorkBoard.tsx         # Cork board with pinned expandable notes
│   │
│   └── contact/                  # Contact page components
│       ├── LetterFormCard.tsx     # "Dear PuppyNest" letter-style form
│       └── ShowroomCard.tsx      # Showroom info + map link
│
├── hooks/                        # Custom React hooks
│   ├── useMascotPosition.ts      # Global mascot state store (owner, pose, triggers)
│   ├── usePinnedProgress.ts      # Scroll progress for pinned/sticky sections
│   ├── useScrollVelocity.ts      # Scroll position, velocity, direction tracking
│   └── useScrollActivity.ts      # Debounced scroll activity detection
│
├── lib/                          # Shared utilities & configuration
│   ├── config.ts                 # Site-wide config (name, contact, socials, URLs)
│   ├── types.ts                  # TypeScript interfaces (Puppy, Testimonial, FAQItem)
│   └── utils.ts                  # cn() — clsx + tailwind-merge utility
│
├── data/                         # Static JSON data (acts as CMS)
│   ├── puppies.json              # 15 puppies with full breed/health/pricing schema
│   ├── families.json             # 64 family moments for Happy Families
│   ├── faq.json                  # 9 FAQs with categories and pin colors
│   └── testimonials.json         # 8 testimonials for homepage polaroid section
│
├── public/
│   └── images/families/          # Placeholder SVGs for family photos
│
├── tailwind.config.ts            # Brand design tokens (colors, fonts, shadows)
├── next.config.mjs               # Next.js config (strict mode, image optimization)
├── tsconfig.json                 # TypeScript configuration
└── postcss.config.js             # PostCSS with Tailwind + Autoprefixer
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9 (or pnpm / yarn)

### Install & Run

```bash
# Clone the repository
git clone https://github.com/<your-username>/PuppyNest-Clone.git
cd PuppyNest-Clone

# Install dependencies
npm install

# Start the development server
npm run dev
# → http://localhost:3000

# Production build
npm run build

# Start the production server
npm start
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (Turbopack) |
| `npm run build` | Generate optimized production build (29 static pages) |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the codebase |

---

## Pages & Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | SSG | Homepage — 8-section storytelling scroll with day-to-night transition |
| `/puppies` | SSG | Listings grid with breed/status/origin filtering |
| `/puppies/[slug]` | SSG (15 paths) | Puppy detail — gallery, info card, enquiry form, prev/next nav |
| `/happy-families` | SSG | Masonry polaroid wall with 64+ family moments |
| `/how-it-works` | SSG | In Dubai / Imported tab toggle, 4-step guide, delivery info |
| `/faq` | SSG | Cork board with 9 pinned notes, live search filter |
| `/contact` | SSG | "Dear PuppyNest" letter-style form + showroom card |
| `/gone-home` | SSG | Adopted puppies archive |
| `/api/enquiry` | API Route | POST endpoint with Zod validation |
| `/robots.txt` | Dynamic | Generated robots.txt |
| `/sitemap.xml` | Dynamic | XML sitemap with all routes |

All puppy detail pages are statically generated at build time using `generateStaticParams()` from `data/puppies.json`. Each page includes `generateMetadata()` for dynamic SEO (title, description, OG image).

---

## Design System

### Typography

| Token | Font | Usage |
|-------|------|-------|
| `font-display` | **Fraunces** (700, 800, 900) | Headings, hero text, section titles |
| `font-body` | **Figtree** (400–800) | Body text, buttons, form labels |
| `font-handwriting` | **Patrick Hand** (400) | Eyebrow labels, decorative quotes, taglines |

All fonts are loaded via `next/font/google` with `display: "swap"` for zero layout shift.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `cream-200` | `#FFF3D9` | Base background, card fills |
| `cream-100` | `#FFF8EA` | Lighter backgrounds, hover states |
| `brand-dark` | `#2A1A12` | Headings, outlines, dark UI |
| `brand-body` | `#5A4030` | Body text |
| `brand-primary` | `#9A4F28` | Primary brown, active nav, links |
| `brand-gold` | `#F0B955` | Accents, door knobs, selection highlight |
| `brand-whatsapp` | `#3A7D54` | WhatsApp CTA buttons |

### Shadows

| Token | Style | Usage |
|-------|-------|-------|
| `shadow-chunky` | `0 4px 0 #1A0E08` | Primary buttons, cards |
| `shadow-chunky-lg` | `0 6px 0 #1A0E08` | Hero buttons, gallery images |
| `shadow-chunky-green` | `0 4px 0 #214730` | WhatsApp buttons |
| `shadow-sticker` | Soft double shadow | Polaroid cards, sticker elements |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-arch` | `160px 160px 0 0` | Door arches, puppy frames |
| `rounded-arch-sm` | `120px 120px 0 0` | Smaller arch elements |

---

## Mascot System

The mascot is the signature feature of PuppyNest — a fluffy poodle that lives across the entire site as a persistent, context-aware companion.

### Component Architecture

```
Mascot.tsx (Presentational)
├── Pure SVG renderer — accepts pose, size, facing, className
├── 8 poses: idle, walk, run, sit, sleep, peek, happy, wave
├── CSS keyframe animations: tail wag, ear twitch, blinking
└── prefers-reduced-motion: static fallback

FollowMascot.tsx (Behavioral Controller, ~900 lines)
├── Reads scroll position, velocity, direction
├── Queries useMascotPosition store for section ownership
├── Computes target (x, y) with spring physics
├── Selects pose based on section context:
│   ├── Hero: "peek" (parked behind scallops, pops out at 40px)
│   ├── PupsRun: "run" (follows floor track, matches scroll speed)
│   ├── FAQ: "sit" (sits beside the left column)
│   ├── Footer: "sleep" (sleeps in woven basket)
│   └── Default: "walk" (follows scroll with idle transitions)
├── Excited trigger: tail wag burst when doors open / user hovers
└── Only renders when section owner matches or no owner is set
```

### Ownership Model

Only **one mascot instance** is ever visible. The `useMascotPosition` store acts as a mutex:

```typescript
// Any section can claim the mascot:
setMascotOwner("pupsrun");   // PupsRun section owns it
setMascotOwner("faq");       // FAQ page owns it
setMascotOwner(null);        // FollowMascot takes over (default)
```

### Tail Wag Animation States

| State | Rotation | Speed | Trigger |
|-------|----------|-------|---------|
| Idle | ±12° | 0.5s | Default standing |
| Walk/Run | ±18° | 0.22s | Scroll movement |
| Sit | ±10° | 0.7s | FAQ, detail pages |
| Excited | ±25° | 0.12s (1.2s burst) | Door opens, hover, tap |
| Sleep | None | — | Footer basket |

---

## Animation Architecture

### Scroll-Driven Animations

The site uses scroll position as the primary animation driver — no autoplay timers, everything is scrubbable and reversible.

| Technique | Component | Purpose |
|-----------|-----------|---------|
| `usePinnedProgress` | PupsRun | Maps scroll range to 0–1 progress for the pinned door section |
| `useScrollVelocity` | FollowMascot | Tracks speed and direction for mascot walk/run pose selection |
| Intersection Observer | ScrollRevealText, sections | Triggers fade-in/slide-up when elements enter viewport |
| Framer Motion `useScroll` | DayToNightBackground | Drives the background color gradient transition |
| CSS `scroll-behavior` | Hero frames | Pop-down/up of arch frames tied to hero scroll progress |

### Motion Hierarchy

```
prefers-reduced-motion: reduce
├── All transform animations → disabled
├── Opacity fades → preserved (0.2s)
├── Tail wag → static
├── Paw cursor → hidden (system cursor restored)
├── Polaroid tilt → 0deg
└── Door open/close → instant state change
```

### Key Animation Patterns

1. **Spring physics** — Mascot movement uses Framer Motion springs (`stiffness: 120, damping: 20`) for natural, non-mechanical motion.
2. **Layout animations** — `layoutId` props enable shared-element transitions between door cards and detail pages.
3. **Staggered reveals** — Section content fades in with 60ms stagger delays using `variants` and `staggerChildren`.
4. **CSS keyframes** — Tail wag, ear twitch, blinking, and heartbeat use pure CSS for GPU-accelerated performance (no JS animation loop).

---

## Data Layer

The app uses static JSON files as its data source, designed to be easily swappable with a headless CMS.

### `data/puppies.json` — 15 entries

```typescript
interface Puppy {
  id: string;              // Unique identifier
  slug: string;            // URL-safe name ("max", "coco")
  name: string;            // Display name
  breed: PuppyBreed;       // "Maltipoo" | "Pomeranian" | "Poodle" | "Cavapoo" | "Shih Tzu"
  gender: "boy" | "girl";
  ageMonths: number;
  origin: "local" | "imported";
  status: "available" | "gone-home";
  hasVideo: boolean;
  color: string;           // "Apricot", "Cream & White", etc.
  expectedWeightKg: number;
  microchipped: boolean;
  vaccinated: boolean;
  passportReady: boolean;
  priceAed: number;
  featured: boolean;       // Shown in homepage doors
  images: string[];        // Unsplash/Pexels URLs
  personality: string[];   // ["Playful", "Gentle", "Curious"]
  description: string;     // Rich text description
  doorTheme?: string;      // Visual theme for door card
}
```

### `data/families.json` — 64 entries
Family moments with photo, caption, emoji, and family name. Used by the Happy Families masonry wall.

### `data/faq.json` — 9 entries
Questions and answers with categories (`health`, `process`, `delivery`, `general`) and pin colors for the cork board.

### `data/testimonials.json` — 8 entries
Customer testimonials with puppy name, breed, family info, and photo. Used by the homepage polaroid section.

---

## SEO & Performance

### Static Generation
- **29 pages** generated at build time (zero server runtime)
- `generateStaticParams` pre-renders all 15 puppy detail pages
- `generateMetadata` produces unique title, description, and OG tags per page

### Image Optimization
- Next.js `<Image>` with automatic AVIF/WebP conversion
- Remote patterns configured for Unsplash and Pexels
- Lazy loading with blur placeholders

### SEO Tags
- Dynamic `<title>` with template: `"{Page} | PuppyNest Dubai"`
- Open Graph tags (type, locale, images) on every page
- Twitter card metadata
- Canonical URLs
- Dynamic `robots.txt` and `sitemap.xml` generation
- Structured breadcrumbs on detail pages

### Accessibility
- WCAG landmark structure
- Skip-to-content link
- `aria-live` regions for dynamic updates
- `prefers-reduced-motion` media query support
- Keyboard navigation for all interactive elements
- Minimum touch target sizes (48px) on mobile

---

## Configuration

All site-wide configuration lives in [`lib/config.ts`](lib/config.ts):

```typescript
export const siteConfig = {
  name: "PuppyNest",
  tagline: "every puppy is family",
  phone: "+971500000000",        // ← Update before launch
  email: "hello@example.com",    // ← Update before launch
  address: { ... },
  socials: {
    instagram: "https://instagram.com",  // ← Add real URLs
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
  },
};
```

Update these values before deploying to production.

---

## Deployment

The app is optimized for static hosting. Recommended platforms:

### Vercel (recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: .next
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Notes
- No environment variables required — all config is in `lib/config.ts`
- No database — data lives in static JSON files
- No authentication — public-facing site
- The `/api/enquiry` route writes to a local JSON file; for production, replace with an email service (SendGrid, Resend) or a CMS webhook

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |
| Mobile Safari | 15+ |
| Chrome Android | 90+ |

---

<p align="center">
  <sub>Built with Next.js, Tailwind CSS, Framer Motion, and a lot of 🐾</sub>
</p>

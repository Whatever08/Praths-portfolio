/**
 * ─────────────────────────────────────────────────────────
 * PORTFOLIO TYPE SCALE
 * Instrument Sans  (loaded globally via Next.js font)
 * Base tracking:   -0.05em  (set on <body> in globals.css)
 * ─────────────────────────────────────────────────────────
 *
 * USAGE:
 *   import { type } from "@/lib/typography";
 *   <h1 className={type.heroDisplay}> … </h1>
 *   <p  className={type.body}> … </p>
 * ─────────────────────────────────────────────────────────
 */

export const type = {

  // ── DISPLAY / HERO ──────────────────────────────────────
  // Used for: homepage marquee name
  heroMarquee:
    "text-[22vw] md:text-[17vw] font-black tracking-tighter leading-none",

  // Used for: full-screen section hero titles (projects page "Selected Work")
  heroDisplay:
    "text-[clamp(72px,10vw,150px)] font-black tracking-[-0.03em] leading-[.88]",

  // Used for: project case-study title inside a full-screen parallax card
  projectTitle:
    "text-[clamp(48px,6.5vw,96px)] font-black tracking-[-0.03em] leading-[.92]",

  // ── SECTION HEADINGS ────────────────────────────────────
  // Used for: "Projects", "About Me", "Stack", "Case Study" section headers
  sectionHeading:
    "text-[28px] md:text-[32px] font-semibold tracking-tight leading-tight",

  // Used for: dual-column intro headings inside white content sections
  sectionTitle:
    "text-[28px] md:text-[40px] lg:text-[48px] font-bold leading-[1.1] tracking-tight",

  // Used for: card / article titles
  cardTitle:
    "text-xl md:text-2xl lg:text-3xl font-black tracking-tighter leading-[0.95]",

  // ── SUB-HEADINGS ────────────────────────────────────────
  subheading:
    "text-base md:text-lg lg:text-xl font-semibold leading-snug",

  // Used for: "Collaborators" type labels inside cards
  subLabel:
    "text-xs font-black uppercase tracking-[0.2em] text-black/40",

  // ── BODY COPY ───────────────────────────────────────────
  // Primary paragraphs
  body:
    "text-sm md:text-base lg:text-lg font-normal leading-relaxed",

  // Secondary / description copy (slightly muted weight)
  bodyMuted:
    "text-sm md:text-base font-light leading-[1.85]",

  // Small fine print
  bodySmall:
    "text-xs font-medium leading-relaxed",

  // ── LABELS / OVERLINES ──────────────────────────────────
  // Nav links, tags, meta labels
  navLink:
    "text-[13px] font-medium leading-none",

  label:
    "text-[10px] font-bold uppercase tracking-[0.2em]",

  labelLg:
    "text-[11px] font-medium uppercase tracking-[0.15em]",

  // Eyebrow above hero titles
  eyebrow:
    "text-[10px] font-medium uppercase tracking-[0.25em]",

  // ── BUTTONS ─────────────────────────────────────────────
  button:
    "text-[10px] md:text-xs font-bold uppercase tracking-widest",

  // ── UTILITY ─────────────────────────────────────────────
  // Ghost big decorative number (parallax sections)
  ghostNumber:
    "font-black text-[clamp(100px,14vw,220px)] leading-none tracking-[-0.04em]",
} as const;

export type TypeKey = keyof typeof type;

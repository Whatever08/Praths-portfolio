"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { VortexGallery } from "@/components/ui/VortexGallery";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import SvgSteppedReveal from "@/components/ui/SvgSteppedReveal";

export default function PlaygroundPage() {
  const [showReveal, setShowReveal] = useState(true);
  const [showRevealIn, setShowRevealIn] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  // Refs for the intro sequence
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const titleLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Generate particle positions once on mount
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }))
  );

  const setTitleRef = useCallback((el: HTMLSpanElement | null, index: number) => {
    titleLineRefs.current[index] = el;
  }, []);

  // Run the cinematic intro after the SVG reveal completes
  const handleRevealComplete = useCallback(() => {
    setShowReveal(false);

    const introTL = gsap.timeline({
      onComplete: () => {
        setIntroComplete(true);
      },
    });

    // Phase 1: Grid lines draw in
    introTL.fromTo(
      gridLinesRef.current?.querySelectorAll(".grid-line-h") ?? [],
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.inOut",
      },
      0.1
    );

    introTL.fromTo(
      gridLinesRef.current?.querySelectorAll(".grid-line-v") ?? [],
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.inOut",
      },
      0.1
    );

    // Phase 2: Title lines reveal
    introTL.fromTo(
      titleLineRefs.current.filter(Boolean),
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 1.0,
        stagger: 0.12,
        ease: "power4.out",
      },
      0.5
    );

    // Phase 3: Subtitle + scanline
    introTL.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
      1.2
    );

    introTL.fromTo(
      scanlineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: "power3.inOut" },
      1.0
    );

    // Phase 4: Pulse ring expands from center
    introTL.fromTo(
      pulseRingRef.current,
      { scale: 0, opacity: 0.8 },
      {
        scale: 8,
        opacity: 0,
        duration: 1.4,
        ease: "power2.out",
      },
      2.0
    );

    // Phase 5: Particles scatter outward
    introTL.fromTo(
      particlesRef.current?.querySelectorAll(".intro-particle") ?? [],
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        duration: 0.8,
        stagger: { each: 0.02, from: "random" },
        ease: "power2.out",
      },
      2.0
    );

    // Phase 6: The whole intro overlay fractures and scales away
    introTL.to(
      introOverlayRef.current,
      {
        scale: 1.5,
        opacity: 0,
        duration: 1.0,
        ease: "power3.in",
      },
      2.4
    );

    // Phase 7: Nav + status indicators appear
    introTL.fromTo(
      navRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      3.0
    );

    introTL.fromTo(
      statusRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      3.2
    );

    return () => {
      introTL.kill();
    };
  }, []);

  return (
    <>
      {/* SVG Stepped Reveal — page entry */}
      {showReveal && (
        <SvgSteppedReveal
          variant="uncover"
          direction="left"
          onComplete={handleRevealComplete}
        />
      )}

      {/* SVG Stepped Reveal — page exit */}
      {showRevealIn && (
        <SvgSteppedReveal variant="cover" direction="right" />
      )}

      <main className="relative w-full h-screen bg-[#030303] text-white selection:bg-white/20 overflow-hidden">

        {/* ═══════════════════════════════════════════
            VORTEX GALLERY — renders behind the overlay
            The gallery uses position:fixed internally,
            so it must NOT be wrapped in a transformed parent.
            ═══════════════════════════════════════════ */}
        <VortexGallery />

        {/* ═══════════════════════════════════════════
            CINEMATIC INTRO OVERLAY
            Sits on top of the gallery (z-200),
            animates away to reveal the gallery beneath.
            ═══════════════════════════════════════════ */}
        {!introComplete && (
          <div
            ref={introOverlayRef}
            className="fixed inset-0 z-[200] bg-[#030303] flex items-center justify-center"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Animated grid lines */}
            <div ref={gridLinesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Horizontal lines */}
              {[20, 40, 60, 80].map((pos) => (
                <div
                  key={`h-${pos}`}
                  className="grid-line-h absolute left-0 right-0 h-px bg-white/[0.06]"
                  style={{
                    top: `${pos}%`,
                    transformOrigin: "left center",
                    transform: "scaleX(0)",
                  }}
                />
              ))}
              {/* Vertical lines */}
              {[20, 40, 60, 80].map((pos) => (
                <div
                  key={`v-${pos}`}
                  className="grid-line-v absolute top-0 bottom-0 w-px bg-white/[0.06]"
                  style={{
                    left: `${pos}%`,
                    transformOrigin: "center top",
                    transform: "scaleY(0)",
                  }}
                />
              ))}
            </div>

            {/* Pulse ring */}
            <div
              ref={pulseRingRef}
              className="absolute w-24 h-24 rounded-full border border-white/20 pointer-events-none"
              style={{
                transform: "scale(0)",
                willChange: "transform, opacity",
              }}
            />

            {/* Scatter particles */}
            <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="intro-particle absolute rounded-full bg-white/40"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    transform: "scale(0)",
                  }}
                />
              ))}
            </div>

            {/* Center title block */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              {/* Scanline accent */}
              <div
                ref={scanlineRef}
                className="w-16 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mb-8"
                style={{ transform: "scaleX(0)", transformOrigin: "center" }}
              />

              {/* Title */}
              <h1 className="text-[clamp(48px,10vw,140px)] font-black leading-[0.88] tracking-[-0.04em] uppercase overflow-hidden">
                <span className="block overflow-hidden">
                  <span
                    ref={(el) => setTitleRef(el, 0)}
                    className="block"
                    style={{ transform: "translateY(110%)", opacity: 0 }}
                  >
                    Play
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    ref={(el) => setTitleRef(el, 1)}
                    className="block text-white/30"
                    style={{ transform: "translateY(110%)", opacity: 0 }}
                  >
                    ground
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <div
                ref={subtitleRef}
                className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium"
                style={{ opacity: 0 }}
              >
                <span className="w-6 h-px bg-white/20" />
                Interactive 3D Experience
                <span className="w-6 h-px bg-white/20" />
              </div>
            </div>

            {/* Corner coordinates — cinematic detail */}
            <div className="absolute top-8 left-8 text-[9px] tracking-[0.2em] text-white/15 uppercase font-mono">
              Lat 19.0760° N
            </div>
            <div className="absolute top-8 right-8 text-[9px] tracking-[0.2em] text-white/15 uppercase font-mono">
              Lng 72.8777° E
            </div>
            <div className="absolute bottom-8 left-8 text-[9px] tracking-[0.2em] text-white/15 uppercase font-mono">
              WebGL · Three.js
            </div>
            <div className="absolute bottom-8 right-8 text-[9px] tracking-[0.2em] text-white/15 uppercase font-mono">
              PT / 2025
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            NAVIGATION (fades in after intro)
            ═══════════════════════════════════════════ */}
        <nav
          ref={navRef}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 md:py-8 bg-transparent pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={() => {
                setShowRevealIn(true);
                setTimeout(() => {
                  window.location.href = "/";
                }, 1000);
              }}
              className="text-[10px] md:text-xs font-bold tracking-widest uppercase hover:opacity-60 transition-opacity flex items-center gap-2 font-sans cursor-pointer"
            >
              <Icon icon="solar:arrow-left-linear" className="text-sm" />
              <span>Back</span>
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center flex-col pointer-events-none">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/50 mb-1">
              Playground
            </h2>
            <div className="w-8 h-[1px] bg-white/20" />
          </div>

          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">
              Scroll to Explore
            </div>
          </div>
        </nav>

        {/* ═══════════════════════════════════════════
            STATUS INDICATORS (bottom)
            ═══════════════════════════════════════════ */}
        <div
          ref={statusRef}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none text-center"
          style={{ opacity: 0 }}
        >
          <div className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/30 mb-2">
            Interactive 3D Environment
          </div>
          <div className="flex justify-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-white opacity-20" />
            <div className="w-1 h-1 rounded-full bg-white opacity-40 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-white opacity-20" />
          </div>
        </div>
      </main>
    </>
  );
}

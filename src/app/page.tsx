"use client";

import { CircularGallery } from "@/components/ui/CircularGallery";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { TextRevealSection } from "@/components/ui/TextRevealSection";
import StackSection from "@/components/ui/StackSection";
import { CaseStudiesSection } from "@/components/ui/CaseStudiesSection";
import ServicesSection from "@/components/ui/ServicesSection";
import { ReactLenis } from "lenis/react";
import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SvgSteppedReveal from "@/components/ui/SvgSteppedReveal";
import { DynamicFooter } from "@/components/ui/DynamicFooter";
import { Navbar } from "@/components/ui/Navbar";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GALLERY_ITEMS = [
  { image: "/Nebula2.png", text: "Nebula", link: "/projects/nebula" },
  { image: "/Xtep2.png", text: "Xtep", link: "/projects/xtep" },
  { image: "/Exsavvy2.png", text: "Exsavvy", link: "/projects/exsavvy" },
  { image: "/MCL2.png", text: "McLaren Racing", link: "/projects/mclaren-racing" },
  { image: "/flytbase2.png", text: "Flytbase", link: "/projects/flytbase" },
  { image: "/VFX2.png", text: "Envision VFX", link: "/projects/envision-vfx" },
  { image: "/Aksharaevents2.png", text: "Akshara Events", link: "/projects/akshara-events" }
];

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const isNavigating = useRef(false); // Track if user is scrolling via header click

  const [showReveal, setShowReveal] = useState(true);
  const [showRevealIn, setShowRevealIn] = useState(false);

  // Helper trigger to suppress GSAP scroll swallow during programmatic scroll
  const handleNavClick = () => {
    isNavigating.current = true;
    setTimeout(() => {
      isNavigating.current = false;
    }, 1200); // Resume scroll detection after 1.2s smooth scroll completes
  };

  useEffect(() => {
    let animationFrameId: number;

    const animateCursor = () => {
      cursorPos.current.x += (targetPos.current.x - cursorPos.current.x) * 0.12;
      cursorPos.current.y += (targetPos.current.y - cursorPos.current.y) * 0.12;

      dotPos.current.x += (targetPos.current.x - dotPos.current.x) * 0.3;
      dotPos.current.y += (targetPos.current.y - dotPos.current.y) * 0.3;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 24}px, ${cursorPos.current.y - 24}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      }

      animationFrameId = requestAnimationFrame(animateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    animateCursor();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useGSAP(() => {
    // Hero Text Parallax Fade Out as you scroll
    gsap.to(heroContentRef.current, {
      y: -100,
      opacity: 0,
      scale: 0.9,
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top top",
        end: "300px top", // Fades out completely after 300px of fast scrolling
        scrub: 0.5, // Faster, tighter scrub
      },
    });

    // Gallery Slide Up Fade In
    gsap.fromTo(
      gallerySectionRef.current,
      { opacity: 0, y: 150 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: gallerySectionRef.current,
          start: "top bottom",
          end: "top center",
          scrub: 0.5, // Crisp, quick lock-in
        },
      }
    );

    // Marquee loop
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 25,
        ease: "linear",
      });
    }

    // Wrapped 3D Cylinder Scroll Effect
    const curvedSections = gsap.utils.toArray('.curved-section') as HTMLElement[];
    curvedSections.forEach((section: HTMLElement) => {
      // Perspective needs to be set on parent or element for 3D transforms
      gsap.set(section, { transformPerspective: 1200, transformOrigin: 'center center' });

      // As section leaves towards top: Handle the curve-away
      gsap.to(section, {
        rotateX: -15,
        z: -100,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top top-=10%', // Start fading when top edge is 10% past top
          end: 'bottom top',
          scrub: true,
        }
      });

      // As section enters from bottom: Only handle curve-in (No opacity fade in)
      gsap.from(section, {
        rotateX: 15,
        z: -100,
        opacity: 1, // Keep visible
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top center',
          scrub: true,
        }
      });
    });

  }, { scope: mainRef });

  // Removed hero hover handlers as cursor is now global

  return (
    <ReactLenis root>
      <main ref={mainRef} className="min-h-screen relative overflow-clip bg-transparent cursor-none">
        {showReveal && (
          <SvgSteppedReveal
            variant="uncover"
            direction="right"
            onComplete={() => setShowReveal(false)}
          />
        )}
        {showRevealIn && (
          <SvgSteppedReveal
            variant="cover"
            direction="left"
          />
        )}

        {/* Background with wrapper */}
        <LiquidBackground>
          {/* Custom Cursor — desktop only */}
          <div
            ref={cursorRef}
            className="hidden md:block fixed top-0 left-0 w-12 h-12 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{ willChange: "transform" }}
          />
          <div
            ref={dotRef}
            className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-[#ff3b30] rounded-full pointer-events-none z-[10000]"
            style={{ willChange: "transform" }}
          />

          {/* Navigation */}
          <Navbar 
            leftContent={
              <div className="flex items-center nav-left-items">
                <a onClick={handleNavClick} href="/#recent-works" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px]">Recent Works</a>
                <a onClick={handleNavClick} href="/#about" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px] ml-4 lg:ml-8">About</a>
              </div>
            }
            rightContent={
              <div className="flex items-center nav-right-items">
                <a onClick={handleNavClick} href="/#case-studies" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px] mr-4 lg:mr-8">Case Studies</a>
                <Link href="/playground" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px]">Playground</Link>
              </div>
            }
          />

          {/* ── HERO SECTION ── */}
          <section
            id="hero-section"
            className="sticky top-0 h-screen min-h-[45rem] flex flex-col items-center justify-center overflow-hidden bg-transparent cursor-none z-0"
          >
            <div ref={heroContentRef} className="relative z-10 w-full h-full pointer-events-none">

              {/* ── SUBTITLE (top center on mobile / top-right on desktop) ── */}
              {/* Edit: top-[30%] = mobile vertical position | md:top-40 = desktop position (+8% down) */}
              <div className="absolute top-[30%] md:top-40 lg:top-48 left-0 right-0 flex justify-center md:justify-end px-6 md:px-12 z-20 pointer-events-auto scale-[1.10] origin-top md:origin-top-right">
                <div className="text-center md:text-right lg:pr-10">
                  <p className="text-lg md:text-3xl font-bold text-white tracking-wide">Designer. Vibe Coder.</p>
                  <p className="text-base md:text-2xl text-white/80 italic font-serif mt-1">Creative Thinker</p>
                </div>
              </div>

              {/* ── MARQUEE NAME (centered, full width) ── */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] overflow-hidden z-10 cursor-pointer pointer-events-auto"
              >
                <div ref={marqueeRef} className="flex whitespace-nowrap w-fit" style={{ willChange: "transform" }}>
                  <div className="flex shrink-0 items-center">
                    <h1 className="text-[22vw] md:text-[17vw] font-black tracking-tighter text-white leading-none pr-[10vw] md:pr-[14vw]">
                      Prathamesh Tipnis
                    </h1>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <h1 className="text-[22vw] md:text-[17vw] font-black tracking-tighter text-white leading-none pr-[10vw] md:pr-[14vw]">
                      Prathamesh Tipnis
                    </h1>
                  </div>
                </div>
              </div>

              {/* ── DESCRIPTION TEXT ── */}
              {/* Edit: top-[62%] = mobile position | md:bottom-[calc(10rem+0vh)] = desktop position */}
              <div className="absolute top-[62%] md:top-auto md:bottom-[calc(10rem+0vh)] lg:bottom-[calc(11rem+0vh)] left-1/2 md:left-12 -translate-x-1/2 md:translate-x-0 w-full max-w-[90%] md:max-w-md lg:max-w-xl text-center md:text-left z-20 pointer-events-auto px-6 md:px-0">
                <h2 className="text-sm md:text-xl lg:text-3xl font-medium text-white tracking-tight leading-snug scale-[1.13] md:origin-left origin-center w-full">
                  cookin&apos; up fresh interactions while still on the hunt for that creative spark.
                </h2>
              </div>

              {/* ── CTA BUTTONS ── */}
              {/* Edit: top-[77%] = mobile position | md:bottom-[calc(3rem+2vh)] = desktop position */}
              <div className="absolute top-[77%] md:top-auto md:bottom-[calc(3rem+2vh)] left-1/2 md:left-12 -translate-x-1/2 md:translate-x-0 flex items-center gap-3 z-20 pointer-events-auto scale-[1.08] md:origin-left origin-center">
                <button className="px-5 py-3 md:px-8 md:py-4 rounded-full border border-white/60 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-pointer whitespace-nowrap">
                  Let&apos;s Work Together
                </button>
                <button className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full border border-white/60 text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                  <Icon icon="solar:arrow-right-up-linear" className="text-xl" />
                </button>
              </div>

              {/* ── SOCIAL ICONS — MOBILE ONLY (hidden on desktop) ── */}
              {/* Edit: bottom-[calc(1.5rem+10vh)] = distance from bottom | gap-10 = spacing between icons */}
              <div className="md:hidden absolute bottom-[calc(1.5rem+10vh)] left-0 right-0 flex justify-center items-center gap-10 z-20 pointer-events-auto scale-[1.08] origin-center">
                <a href="#" title="LinkedIn" className="text-white/80 hover:text-white transition-colors">
                  <Icon icon="line-md:linkedin" className="text-2xl" />
                </a>
                <a href="#" title="Instagram" className="text-white/80 hover:text-white transition-colors">
                  <Icon icon="line-md:instagram" className="text-2xl" />
                </a>
                <a href="#" title="Behance" className="text-white/80 hover:text-white transition-colors">
                  <Icon icon="fa6-brands:behance" className="text-2xl" />
                </a>
                <a href="mailto:tprathamesh8@gmail.com" title="Email" className="text-white/80 hover:text-white transition-colors">
                  <Icon icon="line-md:email-opened" className="text-2xl" />
                </a>
              </div>

              {/* ── SOCIAL TEXT LINKS — DESKTOP ONLY (hidden on mobile) ── */}
              {/* Edit: md:bottom-[calc(3rem+2vh)] = desktop position */}
              <div className="hidden md:flex absolute md:bottom-[calc(3rem+2vh)] right-12 items-center gap-8 z-20 pointer-events-auto scale-[1.08] origin-right">
                <a href="#" className="text-white/80 hover:text-white uppercase text-xs font-bold tracking-widest border-b border-white/30 hover:border-white pb-1 transition-colors">LinkedIn ↗</a>
                <a href="#" className="text-white/80 hover:text-white uppercase text-xs font-bold tracking-widest border-b border-white/30 hover:border-white pb-1 transition-colors">Instagram ↗</a>
                <a href="#" className="text-white/80 hover:text-white uppercase text-xs font-bold tracking-widest border-b border-white/30 hover:border-white pb-1 transition-colors">Behance ↗</a>
                <a href="mailto:tprathamesh8@gmail.com" className="text-white/80 hover:text-white uppercase text-xs font-bold tracking-widest border-b border-white/30 hover:border-white pb-1 transition-colors">tprathamesh8@gmail.com ↗</a>
              </div>

            </div>
          </section>

          {/* Circular Gallery Section */}
          <section id="recent-works" ref={gallerySectionRef} className="relative min-h-screen py-24 bg-transparent overflow-hidden z-20 pointer-events-auto flex flex-col items-center justify-center">
            <div className="max-w-[85rem] mx-auto px-6 mb-4 flex flex-col items-center justify-center text-center drop-shadow-lg">
              <h2 className="text-[30px] font-semibold tracking-tight text-white">Recent Works</h2>
            </div>

            <div className="w-full relative px-6 md:px-0 flex justify-center">
              <div className="relative h-[600px] w-full max-w-[100vw] rounded-lg">
                <CircularGallery
                  items={GALLERY_ITEMS}
                  onItemClick={(item) => {
                    setShowRevealIn(true);
                    setTimeout(() => {
                      window.location.href = item.link || "/projects";
                    }, 1000);
                  }}
                />
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-6 flex justify-center items-center">
              <button
                onClick={() => {
                  setShowRevealIn(true);
                  setTimeout(() => {
                    window.location.href = "/projects";
                  }, 1000);
                }}
                className="px-10 py-4 rounded-full border border-white/60 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                View All Projects
              </button>
            </div>
          </section>

          {/* Text Reveal About Section */}
          <div id="about"><TextRevealSection /></div>

          {/* Services Section */}
          <div id="services"><ServicesSection /></div>

          {/* Case Studies Section */}
          <div id="case-studies"><CaseStudiesSection /></div>

          {/* Playground / Stack Section */}
          <div id="playground"><StackSection /></div>

          {/* Contact / Footer Section */}
          <div id="contact"><DynamicFooter /></div>

        </LiquidBackground>
      </main>
    </ReactLenis >
  );
}

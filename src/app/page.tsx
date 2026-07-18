"use client";

import { CircularGallery } from "@/components/ui/CircularGallery";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { TextRevealSection } from "@/components/ui/TextRevealSection";
import StackSection from "@/components/ui/StackSection";
import { ShippedWorkSection } from "@/components/ui/ShippedWorkSection";
import ServicesSection from "@/components/ui/ServicesSection";
import ProcessSection from "@/components/ui/ProcessSection";
import { ReactLenis } from "lenis/react";
import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SvgSteppedReveal from "@/components/ui/SvgSteppedReveal";
import { DynamicFooter } from "@/components/ui/DynamicFooter";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GALLERY_ITEMS = [
  { image: "/Nebula2.png", text: "Nebula", link: "/projects/nebula" },
  { image: "/Xtep2.png", text: "Xtep", link: "/projects/xtep" },
  { image: "/Pramaan2.png", text: "Pramaan", link: "/projects/pramaan" },
  { image: "/flytbase2.png", text: "Flytbase (Coming Soon)", link: "#" },
  { image: "/VFX2.png", text: "Envision VFX", link: "https://envisionvfx.in" }
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Helper trigger to suppress GSAP scroll swallow during programmatic scroll and center target element
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    isNavigating.current = true;
    setTimeout(() => {
      isNavigating.current = false;
    }, 1200); // Resume scroll detection after 1.2s smooth scroll completes

    const element = document.getElementById(targetId);
    if (element) {
      let targetElement = element;

      // If we are centering the projects section, center the gallery container specifically
      if (targetId === "projects") {
        const galleryContainer = document.getElementById("gallery-container");
        if (galleryContainer) {
          targetElement = galleryContainer;
        }
      }

      const elementRect = targetElement.getBoundingClientRect();
      // Query the current GSAP y-translation of the parent section to subtract it from getBoundingClientRect
      const currentY = (gsap.getProperty(element, "y") as number) || 0;
      const absoluteElementTop = elementRect.top + window.scrollY - currentY;
      const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

      window.history.pushState(null, "", `#${targetId}`);
      window.scrollTo({
        top: middle,
        behavior: "smooth"
      });
    }
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

    // ── NAVIGATION SMART REVEAL & LOGO SWALLOWING ──
    // Animations removed for minimal layout
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

          {/* ── MINIMAL TOP BAR ── */}
          <div className="absolute top-0 left-0 right-0 px-6 py-8 md:px-12 md:py-12 flex justify-between items-start text-[10px] md:text-xs font-medium uppercase tracking-widest pointer-events-auto z-30">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white">Based in</span>
              <span className="text-white/60">India / Global</span>
            </div>
            <div className="hidden md:flex flex-col gap-1">
              <span className="font-bold text-white">Currently at</span>
              <span className="text-white/60">Independent</span>
            </div>
            <div className="hidden md:flex flex-col gap-1">
              <span className="font-bold text-white">Freelance</span>
              <span className="text-white/60">Available Now</span>
            </div>
            <div>
              <a href="mailto:tprathamesh8@gmail.com" className="bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-white/90 transition-colors tracking-widest text-[10px]">
                Get in touch
              </a>
            </div>
          </div>

          {/* ── HERO SECTION ── */}
          <section
            id="hero-section"
            className="sticky top-0 h-screen min-h-[45rem] flex flex-col items-center justify-center overflow-hidden bg-transparent cursor-none z-0"
          >
            <div ref={heroContentRef} className="relative z-10 w-full h-full pointer-events-none">

              {/* ── SUBTITLE (top center on mobile / top-right on desktop) ── */}
              {/* Edit: top-[32%] = mobile vertical position | md:top-46 = desktop position (slightly away from marquee) */}
              <div className="absolute top-[32%] md:top-46 lg:top-54 left-0 right-0 flex justify-center md:justify-end px-6 md:px-12 z-20 pointer-events-auto scale-[1.10] origin-top md:origin-top-right">
                <div className="text-center md:text-right lg:pr-10">
                  <p className="text-base md:text-[27px] font-bold text-white tracking-wide">Designer. Problem Solver. Vibe coder</p>
                  <p className="text-sm md:text-[22px] text-white/80 italic font-serif mt-1">Creative Thinker</p>
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
              {/* Edit: top-[60%] = mobile position | md:bottom-[calc(11.5rem+0vh)] = desktop position */}
              <div className="absolute top-[60%] md:top-auto md:bottom-[calc(11.5rem+0vh)] lg:bottom-[calc(12.5rem+0vh)] left-1/2 md:left-12 -translate-x-1/2 md:translate-x-0 w-full max-w-[90%] md:max-w-[70vw] text-center md:text-left z-20 pointer-events-auto px-6 md:px-0">
                <h2 className="text-sm md:text-xl lg:text-3xl font-medium text-white tracking-tight leading-snug scale-[1.02] md:origin-left origin-center w-full">
                  I'm someone who approaches design with curiosity.<br />
                  I love experimenting, whether it's creating a new dish or<br />
                  designing a product, because both are about understanding people
                </h2>
              </div>

              {/* ── SCROLL TO EXPLORE INDICATOR REMOVED ── */}

              {/* ── SOCIAL ICONS — MOBILE ONLY (hidden on desktop) ── */}
              <div className="md:hidden absolute bottom-8 left-0 right-0 flex justify-center items-center gap-10 z-20 pointer-events-auto scale-[1.08] origin-center">
                <a href="https://www.linkedin.com/in/prathamesh-tipnis-653b00142/" title="LinkedIn" className="text-white/80 hover:text-white transition-colors">
                  <Icon icon="line-md:linkedin" className="text-2xl" />
                </a>
                <a href="https://www.behance.net/tprathameshUXD1" title="Behance" className="text-white/80 hover:text-white transition-colors">
                  <Icon icon="fa6-brands:behance" className="text-2xl" />
                </a>
                <a href="mailto:tprathamesh8@gmail.com" title="Email" className="text-white/80 hover:text-white transition-colors">
                  <Icon icon="line-md:email-opened" className="text-2xl" />
                </a>
              </div>
            </div>
          </section>


          {/* Circular Gallery Section */}
          <section id="projects" ref={gallerySectionRef} className="relative min-h-screen py-24 bg-transparent overflow-hidden z-20 pointer-events-auto flex flex-col items-center justify-center">
            <div className="max-w-[85rem] mx-auto px-6 mb-4 flex flex-col items-center justify-center text-center drop-shadow-lg">
              <h2 className="text-[30px] font-semibold tracking-tight text-white">Projects</h2>
            </div>

            <div className="w-full relative px-6 md:px-0 flex justify-center">
              <div id="gallery-container" className="relative h-[600px] w-full max-w-[100vw] rounded-lg">
                <CircularGallery
                  items={GALLERY_ITEMS}
                  onItemClick={(item) => {
                    if (item.link === "#") return;
                    if (item.link?.startsWith("http")) {
                      window.open(item.link, "_blank");
                    } else {
                      setShowRevealIn(true);
                      setTimeout(() => {
                        window.location.href = item.link || "/projects";
                      }, 1000);
                    }
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

          {/* Text Reveal About Section + Services Section + Process Section — unified background */}
          <div className="relative z-30" style={{ backgroundColor: "#0A0A09" }}>
            <div id="about"><TextRevealSection /></div>
            <div id="services"><ServicesSection /></div>
            <div id="process"><ProcessSection /></div>
          </div>

          {/* Shipped Work Section */}
          <div id="case-studies"><ShippedWorkSection /></div>

          {/* Playground / Stack Section */}
          <div id="playground"><StackSection /></div>

          {/* Contact / Footer Section */}
          <div id="contact"><DynamicFooter /></div>



        </LiquidBackground>
      </main>
    </ReactLenis >
  );
}

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
  { image: "/MCL2.png", text: "MCL Racing (Coming Soon)", link: "#" },
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
      
      // If we are centering the recent works, center the gallery container specifically
      if (targetId === "recent-works") {
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
    const smartNavTl = gsap.timeline({ paused: true });

    // Left items move right into logo
    smartNavTl.to(".nav-left-items", {
      x: 60,
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power3.inOut"
    }, 0);

    // Right items move left into logo
    smartNavTl.to(".nav-right-items", {
      x: -60,
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power3.inOut"
    }, 0);

    // Global ScrollTrigger for Directional Reveal
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        // ALWAYS show links when at the very top (first 100px)
        if (self.scroll() < 100) {
          smartNavTl.reverse();
          gsap.to("nav", {
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            borderBottom: "1px solid rgba(255,255,255,0)",
            duration: 0.4
          });
          return;
        }

        // Suppress scrolling animation if user clicked an anchor link
        if (isNavigating.current) {
          smartNavTl.reverse();
          gsap.to("nav", {
            backgroundColor: "transparent",
            backdropFilter: "blur(15px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            duration: 0.4
          });
          return;
        }

        // SCROLL DOWN: Swallow links
        if (self.direction === 1) {
          smartNavTl.play();
          gsap.to("nav", {
            backgroundColor: "transparent",
            backdropFilter: "blur(15px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            duration: 0.4
          });
        }
        // SCROLL UP: Reveal links
        else {
          smartNavTl.reverse();
          gsap.to("nav", {
            backgroundColor: "transparent",
            backdropFilter: "blur(15px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            duration: 0.4
          });
        }
      }
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

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl transition-all duration-500 ease-in-out flex flex-col justify-between p-8 ${
            isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          {/* Header inside overlay */}
          <div className="flex justify-between items-center w-full">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="relative h-7 flex items-center">
              <img
                src="/logo.png"
                alt="TP Logo"
                className="h-full w-auto object-contain"
              />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white p-2 hover:rotate-90 transition-transform duration-300"
            >
              <Icon icon="solar:close-circle-linear" className="text-4xl" />
            </button>
          </div>
          
          {/* Main Links */}
          <div className="flex flex-col items-start justify-center gap-6 my-auto pl-4">
            <div className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-2">Navigation</div>
            
            <a 
              href="#recent-works" 
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleNavClick(e, "recent-works");
              }} 
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase"
            >
              Recent Works
            </a>
            
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setShowRevealIn(true);
                setTimeout(() => {
                  window.location.href = "/projects";
                }, 1000);
              }}
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase text-left cursor-pointer"
            >
              View All Projects
            </button>
            
            <a 
              href="#about" 
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleNavClick(e, "about");
              }} 
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase"
            >
              About
            </a>
            
            <a 
              href="#services" 
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleNavClick(e, "services");
              }} 
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase"
            >
              What I do
            </a>

            <a 
              href="#case-studies" 
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleNavClick(e, "case-studies");
              }} 
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase"
            >
              Case Studies
            </a>

            <a 
              href="#contact" 
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleNavClick(e, "contact");
              }} 
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase"
            >
              Contact
            </a>
            
            <Link 
              href="/playground" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase"
            >
              Playground
            </Link>
          </div>

          {/* Footer inside overlay */}
          <div className="flex justify-between items-center w-full pt-6 border-t border-white/10 pl-4">
            <div className="flex gap-6">
              <a href="https://www.linkedin.com/in/prathamesh-tipnis-653b00142/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-xs uppercase tracking-widest font-bold">LinkedIn</a>
              <a href="https://www.behance.net/tprathameshUXD1" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-xs uppercase tracking-widest font-bold">Behance</a>
            </div>
            <span className="text-white/20 text-xs font-mono">© 2026</span>
          </div>
        </div>

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
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-transparent pointer-events-auto">
            {/* Left: Logo on Mobile / Spacer on Desktop */}
            <div className="w-1/2 md:w-1/4 flex justify-start md:block">
              <Link href="/" className="md:hidden relative h-7 flex items-center opacity-100 drop-shadow-md cursor-pointer">
                <img
                  src="/logo.png"
                  alt="TP Logo"
                  className="h-full w-auto object-contain opacity-100 brightness-100 drop-shadow-lg"
                />
              </Link>
            </div>

            {/* Center: Links & Logo (Desktop) — FULLY RESTORED */}
            <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 text-[13px] font-medium text-white pointer-events-auto w-2/4">
              <div className="flex-1 flex justify-end items-center nav-left-items">
                <a onClick={(e) => handleNavClick(e, "recent-works")} href="/#recent-works" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px]">Recent Works</a>
                <a onClick={(e) => handleNavClick(e, "about")} href="/#about" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px] ml-4 lg:ml-8">About</a>
                <a onClick={(e) => handleNavClick(e, "services")} href="/#services" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px] ml-4 lg:ml-8">What I do</a>
              </div>

              {/* Logo */}
              <Link href="/" className="nav-logo relative h-8 mx-4 lg:mx-8 flex items-center opacity-100 cursor-pointer z-10">
                <img
                  src="/logo.png"
                  alt="TP Logo"
                  className="h-full w-auto object-contain opacity-100 brightness-100"
                />
              </Link>

              <div className="flex-1 flex justify-start items-center nav-right-items">
                <a onClick={(e) => handleNavClick(e, "case-studies")} href="/#case-studies" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px] mr-4 lg:mr-8">Case Studies</a>
                <a onClick={(e) => handleNavClick(e, "contact")} href="/#contact" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px] mr-4 lg:mr-8">Contact</a>
                <Link href="/playground" className="hover:text-white/60 transition-colors duration-300 cursor-pointer whitespace-nowrap uppercase tracking-widest text-[10px]">Playground</Link>
              </div>
            </div>

            {/* Right: Menu Icon for Mobile — Functional */}
            <div className="w-1/2 md:w-1/4 flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-white drop-shadow-md p-2"
              >
                <Icon icon="solar:hamburger-menu-linear" className="text-2xl" />
              </button>
            </div>
          </nav>

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

              {/* ── SCROLL TO EXPLORE INDICATOR ── */}
              {/* Edit: top-[72%] = mobile position | md:bottom-[calc(3rem+2vh)] = desktop position */}
              <div 
                onClick={(e) => handleNavClick(e, "recent-works")}
                className="absolute top-[72%] md:top-auto md:bottom-[calc(3rem+2vh)] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2.5 z-20 pointer-events-auto scale-[1.08] origin-center cursor-pointer group transition-all duration-300"
              >
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors duration-300">
                  Scroll to begin experience
                </span>
                <div className="w-[20px] h-[34px] rounded-full border border-white/30 group-hover:border-white/60 flex justify-center py-1.5 transition-colors duration-300">
                  <div className="w-[3px] h-[6px] rounded-full bg-white/70 animate-scroll-wheel" />
                </div>
              </div>

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

              {/* ── SOCIAL TEXT LINKS — DESKTOP ONLY (hidden on mobile) ── */}
              {/* Edit: md:bottom-[calc(3rem+2vh)] = desktop position */}
              <div className="hidden md:flex absolute md:bottom-[calc(3rem+2vh)] right-12 items-center gap-8 z-20 pointer-events-auto scale-[1.08] origin-right">
                <a href="https://www.linkedin.com/in/prathamesh-tipnis-653b00142/" className="text-white/80 hover:text-white uppercase text-xs font-bold tracking-widest border-b border-white/30 hover:border-white pb-1 transition-colors">LinkedIn ↗</a>
                <a href="https://www.behance.net/tprathameshUXD1" className="text-white/80 hover:text-white uppercase text-xs font-bold tracking-widest border-b border-white/30 hover:border-white pb-1 transition-colors">Behance ↗</a>
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

          {/* Text Reveal About Section + Services Section — unified background */}
          <div className="bg-black/90 relative z-30">
            <div id="about"><TextRevealSection /></div>
            <div id="services"><ServicesSection /></div>
          </div>

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

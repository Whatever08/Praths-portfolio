"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DynamicFooter } from "@/components/ui/DynamicFooter";
import { Navbar } from "@/components/ui/Navbar";
import { useGSAP } from "@gsap/react";
import { ProjectLiquidBackground } from "@/components/ui/ProjectLiquidBackground";
import { ReactLenis } from "lenis/react";
import SvgSteppedReveal from "@/components/ui/SvgSteppedReveal";
import { Icon } from "@iconify/react";
import { type } from "@/lib/typography";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Project {
  title: string;
  year: string;
  role: string;
  desc: string;
  img: string;
  link: string;
  liveLink?: string;
  isLight?: boolean;
}

const PROJECTS: Project[] = [
  {
    title: "Nebula",
    year: "2025",
    role: "Brand Identity · Web Design",
    desc: "A next-generation SaaS platform identity built around exploration and depth. Dark-mode-first design language with a cosmic motion system.",
    img: "/Nebula.png",
    link: "/project-page",
  },
  {
    title: "Xtep",
    year: "2023",
    role: "E-commerce · Web Design",
    desc: "A premium digital retail experience for a global sportswear brand. Performance-first UX with bold visual storytelling and seamless checkout.",
    img: "/Xtep.png",
    link: "/project-page",
    isLight: true,
  },
  {
    title: "Exsavvy",
    year: "2025",
    role: "Product Design",
    desc: "A brief description of this new project will go here. Coming soon.",
    img: "/Exsavvy.png",
    link: "/project-page",
  },
  {
    title: "McLaren Racing",
    year: "2024",
    role: "UI Design · Interaction Design",
    desc: "Crafting high-performance fan-facing digital experiences that mirror the precision and speed of the McLaren brand on and off the track.",
    img: "/MCl.png",
    link: "/project-page",
  },
  {
    title: "Flytbase",
    year: "2025",
    role: "Product Design · UX Research",
    desc: "Designing the command and control interface for autonomous drone fleets. A mission-critical platform demanding precision, clarity and real-time situational awareness.",
    img: "/flytbase.png",
    link: "/project-page",
  },
  {
    title: "Envision VFX",
    year: "2023",
    role: "Brand Identity · Motion · Web",
    desc: "Identity and portfolio site for a boutique VFX studio. Cinematic dark aesthetic with real-time WebGL transitions that mirror the studio's visual output.",
    img: "/VFX.png",
    link: "/project-page",
    liveLink: "https://envisionvfx.in",
  },
  {
    title: "Akshara Events",
    year: "2023",
    role: "Branding · Print · Web",
    desc: "Premium event management brand for high-end weddings and corporate gatherings. Elegant typographic identity with a bespoke booking and showcase website.",
    img: "/Aksharaevents.png",
    link: "/project-page",
    liveLink: "https://aaksharaevents.com",
  },
];

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navIdxRef = useRef<HTMLSpanElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const [showReveal, setShowReveal] = useState(true);
  const [showRevealIn, setShowRevealIn] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // Cursor refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });

  // Custom cursor animation
  useEffect(() => {
    let raf: number;
    const animate = () => {
      cursorPos.current.x += (targetPos.current.x - cursorPos.current.x) * 0.12;
      cursorPos.current.y += (targetPos.current.y - cursorPos.current.y) * 0.12;
      dotPos.current.x += (targetPos.current.x - dotPos.current.x) * 0.3;
      dotPos.current.y += (targetPos.current.y - dotPos.current.y) * 0.3;
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 24}px, ${cursorPos.current.y - 24}px)`;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      raf = requestAnimationFrame(animate);
    };
    const onMove = (e: MouseEvent) => { targetPos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);

  // Progress bar
  useEffect(() => {
    const bar = document.getElementById("projects-progress-bar");
    if (!bar) return;
    const onScroll = () => {
      const h = document.body.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(() => {
    // Hero line reveal
    const heroLines = gsap.utils.toArray<HTMLElement>(".projects-hero .line-inner");
    const heroEye = document.querySelector<HTMLElement>(".projects-hero .hero-eyebrow");

    gsap.timeline({ delay: 0.1 })
      .to(heroLines, { y: "0%", duration: 1.3, stagger: 0.14, ease: "power4.out" })
      .from(heroEye, { y: 20, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.1);


    // Each project section
    const sections = gsap.utils.toArray<HTMLElement>(".project-section");
    sections.forEach((sec, i) => {
      const img = sec.querySelector<HTMLElement>(".proj-img");
      const indexLbl = sec.querySelector<HTMLElement>(".proj-index-label");
      const rule = sec.querySelector<HTMLElement>(".proj-rule");
      const lineIn = sec.querySelectorAll<HTMLElement>(".line-inner");
      const meta = sec.querySelector<HTMLElement>(".proj-meta-row");
      const desc = sec.querySelector<HTMLElement>(".proj-desc");
      const bigNum = sec.querySelector<HTMLElement>(".proj-big-num");
      const cta = sec.querySelector<HTMLElement>(".proj-cta");

      // Parallax image
      if (img) {
        gsap.fromTo(img,
          { yPercent: -20 },
          {
            yPercent: 20, ease: "none",
            scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }

      // Content reveal
      const revealTL = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top 85%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
      });

      revealTL
        .to(indexLbl, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.out" })
        .to(rule, { width: 52, duration: 0.6, ease: "power3.out" }, "-=.4")
        .to(lineIn, { y: "0%", duration: 1.0, stagger: 0.1, ease: "power4.out" }, "-=.45")
        .to(meta, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=.6")
        .to(desc, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=.5")
        .to(cta, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=.4");

      // Active state updater
      ScrollTrigger.create({
        trigger: sec,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        }
      });
    });

    function setActive(i: number) {
      setActiveIdx(i);
      if (navIdxRef.current) {
        navIdxRef.current.textContent = `${String(i + 1).padStart(2, "0")} / ${PROJECTS.length}`;
      }

      // Roll the ghost number
      gsap.to(".rolling-strip", {
        y: `-${(i / PROJECTS.length) * 100}%`,
        duration: 0.8,
        ease: "power4.inOut"
      });
    }

    // Master Visibility for the Rolling Index (Show only during project banners)
    if (sections.length > 0) {
      gsap.fromTo(".rolling-index-container",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: sections[0], // First section
            start: "top 80%",
            endTrigger: sections[sections.length - 1], // Last section
            end: "bottom 95%", // Hard stop before footer
            toggleActions: "play reverse play reverse"
          }
        }
      );
    }

    ScrollTrigger.refresh();
  });


  const handleProjectClick = (link: string) => {
    setShowRevealIn(true);
    setTimeout(() => { window.location.href = link; }, 1000);
  };

  return (
    <>
      <ProjectLiquidBackground>
        {/* Curtain */}
        <div
          id="projects-curtain"
          className="fixed inset-0 z-[500] pointer-events-none grid"
          style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
          aria-hidden="true"
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="curtain-strip bg-black"
              style={{ transform: "scaleY(0)", transformOrigin: "top center", willChange: "transform" }}
            />
          ))}
        </div>

        {/* SVG Stepped Reveal Transitions */}
        {showReveal && (
          <SvgSteppedReveal variant="uncover" direction="left" onComplete={() => setShowReveal(false)} />
        )}
        {showRevealIn && (
          <SvgSteppedReveal variant="cover" direction="right" />
        )}

        {/* Custom Cursor */}
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

        {/* Progress Bar */}
        <div
          id="projects-progress-bar"
          className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left"
          style={{ transform: "scaleX(0)", background: "linear-gradient(90deg, #ffffff, #aaaaaa)" }}
          aria-hidden="true"
        />

        <Navbar
          leftContent={
            <button
              onClick={() => {
                setShowRevealIn(true);
                setTimeout(() => { window.location.href = "/"; }, 1000);
              }}
              className="flex items-center gap-2 text-inherit hover:opacity-60 transition-opacity uppercase tracking-widest text-[10px] group"
            >
              <Icon icon="solar:arrow-left-linear" className="text-sm group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>
          }
          rightContent={
            <div className="flex items-center gap-6">
              <span className="uppercase tracking-widest text-[10px] text-inherit/45 hidden sm:block">
                Selected Work
              </span>
              <span ref={navIdxRef} className="uppercase tracking-widest text-[10px] font-bold min-w-[40px] text-right text-inherit">
                01 / {PROJECTS.length}
              </span>
            </div>
          }
        />

        <div ref={containerRef} className="relative text-white cursor-none selection:bg-white/20">
          <ReactLenis root options={{ duration: 1.4, lerp: 0.08, smoothWheel: true }}>

            {/* ── HERO ── */}
            <section
              className="projects-hero relative h-screen min-h-[700px] flex flex-col justify-center px-10 overflow-hidden"
              id="projects-hero"
            >
              {/* Subtle radial accent blobs — no grid */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background: `
                  radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,59,48,.06), transparent),
                  radial-gradient(ellipse 50% 60% at 15% 85%, rgba(255,107,48,.04), transparent)
                `
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 -translate-y-12">
                <p className={`hero-eyebrow flex items-center gap-4 ${type.eyebrow} text-white/45 mb-5`}>
                  <span className="block w-8 h-px bg-white/40" />
                  Folio — 2025
                </p>
                {/* Hero title — matches home page marquee proportions */}
                <h1
                  className="text-[clamp(64px,9vw,120px)] leading-[.88] tracking-[-0.03em] font-black overflow-hidden"
                  aria-label="Selected Work"
                >
                  <span className="line-wrap overflow-hidden block">
                    <span className="line-inner block" style={{ transform: "translateY(110%)" }}>Selected</span>
                  </span>
                  <span className="line-wrap overflow-hidden block">
                    <span className="line-inner block text-white" style={{ transform: "translateY(110%)" }}>Work</span>
                  </span>
                </h1>
              </div>


            </section>



            {/* ── PROJECTS ── */}
            <div>
              {PROJECTS.map((p, i) => (
                <section
                  key={i}
                  className="project-section relative flex items-center overflow-hidden"
                  data-theme={p.isLight ? "light" : "dark"}
                  style={{ height: "100vh", minHeight: 700 }}
                  ref={(el) => { if (el) sectionsRef.current[i] = el; }}
                  aria-label={p.title}
                >
                  {/* Parallax image */}
                  <div className="absolute inset-0 overflow-hidden z-0" style={{ top: "-18%", bottom: "-18%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="proj-img w-full h-full object-cover will-change-transform"
                      src={p.img}
                      alt={p.title}
                      loading={i < 2 ? "eager" : "lazy"}
                      draggable={false}
                    />
                  </div>

                  {/* Gradient veil - significantly lightened for 100% banner intensity */}
                  <div
                    className="absolute inset-0 z-[1] pointer-events-none"
                    style={{
                      background: "linear-gradient(110deg, rgba(0,0,0,.6) 0%, rgba(0,0,0,0) 60%)",
                    }}
                    aria-hidden="true"
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,.4) 0%, transparent 30%)" }}
                    />
                  </div>

                  {/* Rotated side tag */}
                  <span
                    className="hidden md:block absolute right-20 top-1/2 z-[2] text-[9px] tracking-[.3em] uppercase text-white/35 whitespace-nowrap pointer-events-none"
                    style={{ transform: "translateY(-50%) rotate(90deg)" }}
                    aria-hidden="true"
                  >
                    PT / {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div className="proj-body relative z-[2] px-8 md:px-16 lg:px-20 max-w-[950px] w-full">
                    {/* Index label */}
                    <div
                      className={`proj-index-label ${type.eyebrow} text-white mb-4`}
                      style={{ clipPath: "inset(0 100% 0 0)", willChange: "clip-path" }}
                    >
                      {String(i + 1).padStart(2, "0")} — {PROJECTS.length}
                    </div>

                    {/* Animated rule */}
                    <div
                      className="proj-rule h-px mb-6"
                      style={{
                        width: 0,
                        background: "linear-gradient(90deg, #ffffff, #666666)",
                        willChange: "width"
                      }}
                    />

                    {/* Project title — split by word for multi-line support */}
                    <h2
                      className={`proj-title ${type.projectTitle} mb-8 overflow-hidden`}
                    >
                      {p.title.split(" ").map((word, wordIdx) => (
                        <span key={wordIdx} className="line-wrap overflow-hidden block pb-2">
                          <span className="line-inner block" style={{ transform: "translateY(110%)" }}>
                            {word}
                          </span>
                        </span>
                      ))}
                    </h2>

                    {/* Meta: year + role */}
                    <div
                      className="proj-meta-row flex gap-10 flex-wrap mb-6"
                      style={{ opacity: 0, transform: "translateY(16px)", willChange: "opacity, transform" }}
                    >
                      <div className="flex flex-col gap-1.5">
                        <span className={`${type.eyebrow} text-white/45`}>Year</span>
                        <span className={`${type.labelLg} text-white`}>{p.year}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className={`${type.eyebrow} text-white/45`}>Role</span>
                        <span className={`${type.labelLg} text-white`}>{p.role}</span>
                      </div>
                    </div>

                    {/* Description body copy */}
                    <p
                      className={`proj-desc ${type.bodyMuted} text-white/70 max-w-[420px] mb-8`}
                      style={{ opacity: 0, transform: "translateY(14px)", willChange: "opacity, transform" }}
                    >
                      {p.desc}
                    </p>

                    {/* CTA buttons */}
                    {(p.link || p.liveLink) && (
                      <div
                        className="proj-cta flex flex-wrap gap-4"
                        style={{ opacity: 0, transform: "translateY(12px)", willChange: "opacity, transform" }}
                      >
                        {p.link && (
                          <button
                            className={`px-7 py-3 rounded-full border border-white/20 text-white ${type.button} hover:bg-white hover:text-black transition-all duration-300 cursor-none`}
                            onClick={() => handleProjectClick(p.link!)}
                          >
                            View Project
                          </button>
                        )}
                        {p.liveLink && (
                          <button
                            className={`px-7 py-3 rounded-full border border-white/20 text-white ${type.button} hover:bg-white hover:text-black transition-all duration-300 cursor-none`}
                            onClick={() => window.open(p.liveLink, "_blank")}
                          >
                            Live Website
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <DynamicFooter />
          </ReactLenis>
        </div>
      </ProjectLiquidBackground>

      {/* Scroll pulse keyframe */}
      <style>{`
      @keyframes scrollpulse {
        0%, 100% { transform: scaleY(0); transform-origin: top; }
        50% { transform: scaleY(1); transform-origin: top; }
      }
      ::-webkit-scrollbar { display: none; }
    `}</style>

      {/* Sticky Rolling Ghost Number — Root level for perfect contrast blending */}
      <div
        className="rolling-index-container fixed right-16 bottom-16 z-[9999] hidden md:block overflow-hidden pointer-events-none select-none invisible"
        style={{
          height: "1em",
          fontSize: "clamp(90px, 12.5vw, 200px)",
          lineHeight: "1"
        }}
      >
        <div className="rolling-strip flex flex-col items-center">
          {PROJECTS.map((_, i) => (
            <div
              key={i}
              className={`${type.ghostNumber}`}
              style={{
                height: "1em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: PROJECTS[activeIdx]?.isLight ? "#000000" : "#ffffff",
                transition: "color 0.4s ease-out"
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

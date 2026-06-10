"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { HeroScrollVideo } from "@/components/ui/scroll-animated-video";
import { Icon } from "@iconify/react";
import { ReactLenis } from "lenis/react";
import SvgSteppedReveal from "@/components/ui/SvgSteppedReveal";
import { DynamicFooter } from "@/components/ui/DynamicFooter";
import { Navbar } from "@/components/ui/Navbar";
import Link from "next/link";
import "./nebula.css";
import NebulaLogo from "./NebulaLogo.png";

gsap.registerPlugin(ScrollTrigger);

// Nebula brand colours — deep purple-plum palette
const PAGE_COLORS = {
  uColor1: [0.32, 0.08, 0.68],  // royal purple
  uColor2: [0.22, 0.04, 0.54],  // deep indigo-violet
  uColor3: [0.42, 0.12, 0.62],  // bright violet-plum
  uColor4: [0.03, 0.02, 0.08],  // deep plum-tinted black
  uColor5: [0.32, 0.08, 0.68],
  uColor6: [0.22, 0.04, 0.54],
};

// Showcase screen map
const screenMap = {
  onboarding: { src: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop", alt: "Wallet Connection" },
  creator: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", alt: "DAO Creator Flow" },
  member: { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", alt: "DAO Member Flow" },
  tasks: { src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop", alt: "Tasks Board" },
  voting: { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop", alt: "Voting Hub" },
  treasury: { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070&auto=format&fit=crop", alt: "DAO Treasury" },
  subdaos: { src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2070&auto=format&fit=crop", alt: "SubDAOs Management" },
  feed: { src: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop", alt: "Feed & Collaboration" },
  explore: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", alt: "Explore DAOs & NFTs" },
  edge: { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", alt: "Designing Edge Cases" },
};

const wireframeCards = [
  { id: 1, src: "/l1.png", alt: "Wireframe Screen 1" },
  { id: 2, src: "/l2.png", alt: "Wireframe Screen 2" },
  { id: 3, src: "/l3.png", alt: "Wireframe Screen 3" },
  { id: 4, src: "/l4.png", alt: "Wireframe Screen 4" },
  { id: 5, src: "/l5.png", alt: "Wireframe Screen 5" },
  { id: 6, src: "/l6.png", alt: "Wireframe Screen 6" },
  { id: 7, src: "/l7.png", alt: "Wireframe Screen 7" },
  { id: 8, src: "/l8.png", alt: "Wireframe Screen 8" },
  { id: 9, src: "/l9.png", alt: "Wireframe Screen 9" },
];

export default function NebulaPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);
  const [showReveal, setShowReveal] = useState(true);
  const [showRevealIn, setShowRevealIn] = useState(false);

  // Nebula carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = 5;

  // Nebula showcase tab state
  const [activeScreen, setActiveScreen] = useState<keyof typeof screenMap>("onboarding");
  const [fadeClass, setFadeClass] = useState("");

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".scroll-reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Carousel autoplay
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % slidesCount), 6000);
    return () => clearInterval(t);
  }, []);

  const handleTabClick = (key: keyof typeof screenMap) => {
    if (key === activeScreen) return;
    setFadeClass("fade-out");
    setTimeout(() => { setActiveScreen(key); setFadeClass(""); }, 150);
  };

  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
      gsap.from(section.querySelectorAll(".reveal-item"), {
        y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "back.out(1.7)", clearProps: "all",
        scrollTrigger: { trigger: section, start: "top 88%", toggleActions: "play none none none" },
      });
    });

    // ── Pin carousel & drive horizontal scroll through all 5 cards ──
    const carouselSection = containerRef.current?.querySelector(".dv-research-carousel-section") as HTMLElement | null;
    const carousel = carouselSection?.querySelector(".dv-dark-cards-carousel") as HTMLElement | null;
    const track = carouselSection?.querySelector(".dv-dark-cards-track") as HTMLElement | null;

    if (carouselSection && carousel && track) {
      gsap.to(track, {
        x: () => -(track.scrollWidth - carousel.clientWidth + 48),
        ease: "none",
        scrollTrigger: {
          trigger: carouselSection,
          start: "center center",
          end: () => `+=${track.scrollWidth - carousel.clientWidth + 48}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <>
      <LiquidBackground colors={PAGE_COLORS}>
        <>
          {showReveal && (
            <SvgSteppedReveal variant="uncover" direction="left" onComplete={() => setShowReveal(false)} />
          )}
          {showRevealIn && (
            <SvgSteppedReveal variant="cover" direction="right" />
          )}

          <div ref={containerRef} className="relative z-10 w-full text-white selection:bg-white/20">
            <Navbar
              leftContent={
                <button
                  onClick={() => { setShowRevealIn(true); setTimeout(() => { window.location.href = "/"; }, 1000); }}
                  className="text-[10px] md:text-xs font-bold tracking-widest uppercase hover:opacity-60 transition-opacity flex items-center gap-2 font-sans cursor-pointer text-inherit"
                >
                  <Icon icon="solar:arrow-left-linear" className="text-sm" />
                  <span className="hidden xs:inline">Back</span>
                </button>
              }
              rightContent={
                <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 text-[13px] font-medium text-inherit pointer-events-auto">
                  <button className="hover:opacity-60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap text-[10px] uppercase tracking-widest">Process</button>
                  <button className="hover:opacity-60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap text-[10px] uppercase tracking-widest">Contact</button>
                </div>
              }
            />

            <ReactLenis
              root
              ref={lenisRef}
              options={{
                autoRaf: false,
                duration: 1.4,
                lerp: 0.05,
                wheelMultiplier: 1.1,
                gestureOrientation: "vertical",
                smoothWheel: true,
              }}
            >
              <main ref={mainContentRef}>

                {/* ── HERO SCROLL VIDEO ─────────────────────────────── */}
                <div data-theme="dark">
                  <HeroScrollVideo
                    title={<>Nebula: Designing the<br />Ai-Powered Social Media<br />Mgmt Platform</>}
                    titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                    description={
                      <>
                        <span className="hidden md:inline">
                          This Concept project aims to create a next-generation social media management platform designed to empower Indian influencers, creators, and small businesses to manage their online presence more effectively. By focusing on the unique needs, cultural nuances, and growth challenges faced by Indian talent, the platform will provide intuitive tools for campaign tracking, audience engagement, content performance insights, and brand-building strategies.
                        </span>
                        <span className="inline md:hidden text-white/80">
                          A next-generation platform designed to empower Indian creators and small businesses. It provides intuitive tools for campaign tracking, audience engagement, and content performance insights.
                        </span>
                      </>
                    }
                    scopeOfWork={["Product Strategy", "UI/UX Design", "Data Visualisation", "System Design"]}
                    media="/Scene-2.mp4"
                    mediaType="video"
                    loop={true}
                    muted={true}
                    autoPlay={true}
                    initialMediaScale={1.0}
                    objectFit="contain"
                    videoScale={1.08}
                    scrollHeightVh={140}
                    smoothScroll={false}
                    targetSize="fullscreen"
                    overlay={{
                      caption: "CONTEXT",
                      heading: "Predictive. Strategic. Creator-Led.",
                      paragraphs: [
                        "The creator economy rewards those who move early, but most analytics tools only explain what has already happened. Creators spend hours tracking trends across platforms, yet still struggle to identify what will resonate with their audience next.",
                        "Research revealed that creators often rely on intuition rather than actionable insights, leading to inconsistent growth and missed opportunities.",

                      ],
                    }}
                  />
                </div>

                {/* ── PROJECT DETAILS SECTION (dark) ───────────────── */}
                <div className="w-full relative">
                  <div className="absolute inset-0 bg-black/[0.15] pointer-events-none" />
                  <section
                    className="w-full relative z-10 text-[#e5e5e5] py-20 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto font-sans"
                    data-theme="dark"
                  >
                    {/* Role & Timeline row */}
                    <div className="flex flex-col md:flex-row justify-between w-full mb-16 md:mb-24">
                      <div className="w-full md:w-[30%]">
                        <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Timeline</h3>
                        <p className="text-sm md:text-base font-medium text-white">4 Months</p>
                      </div>
                    </div>

                    {/* Main 2-col grid */}
                    <div className="flex flex-col md:flex-row justify-between w-full">
                      {/* Left column */}
                      <div className="w-full md:w-[65%] flex flex-col gap-12 md:gap-16 pr-0 md:pr-12">
                        <div>
                          <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Overview</h3>
                          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                            Nebula is a predictive social media analytics platform designed for creators, influencers, and social media managers. It combines trend forecasting, audience intelligence, and performance analytics into a unified workspace, helping users make informed content decisions before publishing rather than relying on historical data alone.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                            Design an intuitive platform that transforms complex social media analytics into actionable insights, enabling creators to discover trends early, predict content performance, and build sustainable growth strategies with confidence.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                          <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                            <li>Converting analytics into actionable recommendations</li>
                            <li>Simplifying complex performance metrics</li>
                            <li>Balancing AI assistance with creator control</li>
                            <li>Making trend discovery faster and more intuitive</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                            Created a predictive analytics ecosystem that helps creators identify emerging trends, understand audience behavior, and make data-driven content decisions. The final solution shifted content planning from reactive reporting to proactive strategy, improving clarity, efficiency, and creative confidence.
                          </p>
                        </div>
                      </div>

                      {/* Right column */}
                      <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                          <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                            <li>Secondary Research</li>
                            <li>Primary Research</li>
                            <li>Competitor Analysis</li>
                            <li>UI/UX Design</li>
                            <li>Feature Prioritisation</li>
                            <li>Interactive Prototyping</li>
                            <li>Information Architecture</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools &amp; Technologies</h3>
                          <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                            <li>Figma</li>
                            <li>FigJam</li>
                            <li>Miro</li>
                            <li>Notion</li>
                          </ul>
                        </div>

                      </div>
                    </div>
                  </section>
                </div>

                {/* ── WHITE CANVAS: Nebula case-study sections ───── */}
                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                  <div className="white-canvas-content w-full bg-white transition-colors duration-300 ease-out shadow-2xl origin-center" data-theme="light">

                    {/* All Nebula sections wrapped in .dv-embed for scoped CSS */}
                    <div className="dv-embed">

                      {/* ── PROBLEM STATEMENT ── */}
                      <section className="dv-section dv-problem-section" style={{ textAlign: 'left', padding: '80px 0' }}>
                        <div className="dv-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#5c6bc0', borderRadius: '2px' }}></div>
                            <span style={{ color: '#7a829a', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>PROBLEM STATEMENT</span>
                          </div>

                          <h2 className="dv-mixed-heading dv-left" style={{ fontWeight: 600, color: '#3b3b58', marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                            Understanding the Problem
                          </h2>

                          <p className="dv-body" style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                            <strong>Indian influencers, creators, and small businesses struggle to manage their growing online presence across multiple platforms. They face a unique set of challenges:</strong>
                          </p>

                          <ol style={{ paddingLeft: '0', listStyleType: 'none', color: '#6b7280', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '32px' }}>
                            <li>1. Tracking campaign performance across fragmented platforms</li>
                            <li>2. Understanding audience sentiment and engagement patterns</li>
                            <li>3. Identifying trends before they peak</li>
                            <li>4. Generating culturally relevant content at scale</li>
                            <li>5. Building brand identity without enterprise-level tools</li>
                            <li>6. Translating complex analytics into actionable decisions</li>
                          </ol>


                        </div>
                      </section>

                      {/* ── RESEARCH & STRATEGY (Carousel) ── */}
                      <section className="dv-section dv-research-carousel-section">
                        <div className="dv-container">
                          <h2 className="dv-mixed-heading">
                            <span className="dv-heading-bold">Research</span>{" "}
                            <em className="dv-heading-italic">&amp; Strategy</em>
                          </h2>
                          <p className="dv-subheading">
                            Through <strong>interviews, surveys, and secondary research</strong> with Indian creators, I uncovered critical gaps in the existing tools:
                          </p>

                          {/* 5 dark cards — track scrolls horizontally via GSAP */}
                          <div className="dv-dark-cards-carousel dv-mt-24">
                            <div className="dv-dark-cards-track">
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">No India-First<br />Analytics Tool</h3>
                                <p className="dv-dark-card-body">
                                  Existing platforms like Hootsuite and Sprout Social are built for Western markets. They miss regional languages, Tier-2 audiences, and Indian platform behaviors.
                                </p>
                              </div>
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">Trend Discovery<br />Is Manual &amp; Slow</h3>
                                <p className="dv-dark-card-body">
                                  Creators spend hours scrolling Reels and Twitter/X to spot trends. By the time they act, the moment has already passed.
                                </p>
                              </div>
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">Creators Want<br />Predictive Guidance</h3>
                                <p className="dv-dark-card-body">
                                  Analytics tools only show what happened. Creators need AI-powered forecasts for what to create next to maximize reach.
                                </p>
                              </div>
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">Data Overwhelm<br />Kills Action</h3>
                                <p className="dv-dark-card-body">
                                  Dashboards flood creators with raw metrics. Without clear, actionable insights, most data goes unused or misunderstood.
                                </p>
                              </div>
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">Brand Deals Are<br />Hard to Manage</h3>
                                <p className="dv-dark-card-body">
                                  Small creators juggle brand collaborations across WhatsApp and Google Sheets with no unified space to track deliverables, deadlines, and payments.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* ── RESEARCH METHODS ── */}
                      <section className="dv-section dv-research-methods-section" style={{ paddingTop: '0' }}>
                        <div className="dv-container">
                          {/* Secondary para */}
                          <p className="dv-subheading dv-left">
                            To design a platform built for Indian creators, I explored competitors, ran interviews with 5-10 influencers, and crafted personas based on real growth pain points across niches: fashion, gaming, food, and finance.
                          </p>

                          {/* 3 method cards */}
                          <div className="dv-method-cards-grid dv-mt-40">
                            <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                              <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Research Synthesis</h5>
                              <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Analyzed interviews, affinity maps, and creator workflows to identify recurring pain points around trend discovery, content planning, and performance evaluation.</p>
                              <a href="https://www.figma.com/board/NrbWpHQSTvYw6RCFaupT9a/Data-analytics?node-id=1639-16524&t=e8O9W62OJe08ib4M-4" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 mt-6 rounded-full border border-black/30 text-black text-sm hover:bg-black hover:text-white transition-colors font-medium inline-flex items-center justify-center gap-2 w-fit">
                                View Analysis <span className="text-lg leading-none">→</span>
                              </a>
                            </div>
                            <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                              <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Personas & Journey Map</h5>
                              <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Created creator personas and mapped their end-to-end workflows to uncover motivations, pain points, decision-making patterns, and opportunities for intervention.</p>
                              <a href="https://www.figma.com/board/NrbWpHQSTvYw6RCFaupT9a/Data-analytics?node-id=1639-16999&t=e8O9W62OJe08ib4M-4" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 mt-6 rounded-full border border-black/30 text-black text-sm hover:bg-black hover:text-white transition-colors font-medium inline-flex items-center justify-center gap-2 w-fit">
                                View Personas <span className="text-lg leading-none">→</span>
                              </a>
                            </div>
                            <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                              <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Feature Prioritisation</h5>
                              <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Evaluated over 50 potential features using MoSCoW prioritisation to define an MVP focused on trend intelligence, forecasting, and actionable analytics..</p>
                              <a href="https://www.figma.com/board/NrbWpHQSTvYw6RCFaupT9a/Data-analytics?node-id=1639-15123&t=e8O9W62OJe08ib4M-4" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 mt-6 rounded-full border border-black/30 text-black text-sm hover:bg-black hover:text-white transition-colors font-medium inline-flex items-center justify-center gap-2 w-fit">
                                View Features <span className="text-lg leading-none">→</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* ── SKETCH & WIREFRAMES ── */}
                      <section className="dv-section dv-wireframes-section" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
                        <div className="dv-container">
                          <div className="dv-edge-cases-block dv-feature-light-gray dv-mb-24">
                            <div className="dv-edge-text dv-text-center">
                              <h3 className="dv-mixed-heading" style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                                <span className="dv-heading-bold">Sketch</span>{" "}
                                <em className="dv-heading-italic">&amp; Wireframes</em>
                              </h3>
                              <p className="dv-subheading">
                                Sketched low-fidelity wireframes to validate core ideas including the dashboard layout, campaign tracking flow, and content calendar before moving into high-fidelity visual design.
                              </p>
                            </div>
                            <div className="dv-marquee dv-mt-40">
                              <div className="dv-marquee-track">
                                {wireframeCards.map((card) => (
                                  <div key={`track1-${card.id}`} className="dv-marquee-card">
                                    <img src={card.src} alt={card.alt} className="dv-marquee-img" loading="lazy" />
                                  </div>
                                ))}
                              </div>
                              <div className="dv-marquee-track" aria-hidden="true">
                                {wireframeCards.map((card) => (
                                  <div key={`track2-${card.id}`} className="dv-marquee-card">
                                    <img src={card.src} alt={card.alt} className="dv-marquee-img" loading="lazy" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* ── DESIGN ARCHITECTURE FIGMA EMBED ── */}
                      <section className="dv-section dv-architecture-section" style={{ paddingBottom: '40px' }}>
                        <div className="dv-container dv-text-center">
                          <h2 className="dv-mixed-heading dv-mb-40">
                            <span className="dv-heading-bold">Information</span>{" "}
                            <em className="dv-heading-italic">Architecture</em>
                          </h2>

                          {/* Premium Device Window Mockup Wrapper */}
                          <div className="dv-prototype-window-wrapper">
                            <div className="dv-prototype-window-header">
                              <div className="dv-window-dots">
                                <span className="dv-dot-red"></span>
                                <span className="dv-dot-yellow"></span>
                                <span className="dv-dot-green"></span>
                              </div>
                              <div className="dv-window-title">
                                <Icon icon="solar:figma-bold-duotone" className="text-[#F24E1E] text-sm" />
                                <span className="font-sans font-medium text-xs tracking-wider">FIGMA BOARD</span>
                              </div>
                              <div className="dv-window-spacer"></div>
                            </div>
                            <div className="dv-prototype-embed-container">
                              <iframe
                                className="dv-prototype-iframe"
                                src="https://embed.figma.com/design/DSBKMu5b9w7FOs5EkQKAol/Data-Analytics-Project?node-id=1132-13335&t=ahg3kYmic4LqAEfy-4&embed-host=share"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* ── TYPOGRAPHY & COLOR PALETTE SECTION ── */}
                      <section className="dv-section bg-white border-b border-[#E4DFD7] py-24 md:py-32 relative overflow-hidden" id="branding-assets">
                        <div className="dv-container max-w-[1200px] mx-auto px-6 md:px-12">
                          
                          {/* Section Header */}
                          <div className="text-center mb-16 md:mb-20">
                            <h2 className="dv-mixed-heading">
                              <span className="dv-heading-bold">Brand Identity</span> <em className="dv-heading-italic">and Visual Identity</em>
                            </h2>
                          </div>

                          {/* Brand Logo Card (Feature Card style, full width) */}
                          <div className="dv-feature-card border border-[#E4DFD7] shadow-lg mb-16 rounded-[40px] overflow-hidden bg-white">
                            <div className="dv-feature-text dv-feature-light-gray">
                              <span className="text-[10px] tracking-[0.2em] font-mono text-[#7a829a] uppercase block mb-3 font-semibold text-left">BRANDMARK</span>
                              <h3 className="dv-feature-heading dv-left">
                                The Nebula Logo
                              </h3>
                              <p className="dv-subheading dv-left">
                                The Nebula logo represents navigation and creator discovery. The customized letter <strong>'N'</strong> features a sharp, celestial star flare, symbolizing AI-driven guidance and creative growth, while the modern geometric logotype conveys high-tech platform metrics and clean alignment.
                              </p>
                            </div>
                            <div className="dv-feature-visual bg-white border-t border-[#E4DFD7] md:border-t-0 md:border-l md:border-[#E4DFD7] p-12 md:p-16 flex items-center justify-center aspect-square">
                              <img src={NebulaLogo.src} alt="Nebula Logo" className="w-[60%] md:w-[64%] max-w-[250px] md:max-w-[300px] object-contain select-none pointer-events-none transition-transform duration-300 hover:scale-[1.03]" />
                            </div>
                          </div>

                          {/* 2 Column Grid for Typography & Colors */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                              
                              {/* Column 1: Typography */}
                              <div className="flex flex-col gap-6">
                                {/* Typography Showcase Card */}
                                <div className="bg-[#6E50E9] rounded-3xl p-8 flex flex-col justify-between aspect-auto min-h-[340px] lg:aspect-[16/10] overflow-hidden relative shadow-lg text-white group hover:scale-[1.01] transition-transform duration-300 select-none">
                                  <div className="absolute top-0 right-0 p-8 opacity-10 text-white font-inter font-bold text-[150px] leading-none pointer-events-none select-none">
                                    Aa
                                  </div>
                                  
                                  <div className="flex justify-between items-start z-10 w-full">
                                    <div className="text-left">
                                      <div className="text-[11px] tracking-widest font-mono text-white/75 uppercase font-bold mb-1">Type Specimen</div>
                                      <div className="text-2xl font-inter font-bold tracking-tight">Inter</div>
                                    </div>
                                    <div className="text-right font-mono text-[9px] text-white/70 tracking-widest uppercase">
                                      SANS-SERIF
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-2 z-10 text-left mt-auto">
                                    <div className="border-b border-white/20 pb-1.5">
                                      <span className="font-inter font-bold text-lg">Bold</span>
                                    </div>
                                    <div className="border-b border-white/20 pb-1.5">
                                      <span className="font-inter font-semibold text-lg">SemiBold</span>
                                    </div>
                                    <div className="border-b border-white/20 pb-1.5">
                                      <span className="font-inter font-medium text-lg">Medium</span>
                                    </div>
                                    <div className="pb-1">
                                      <span className="font-inter font-normal text-lg">Regular</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Typography Text Info */}
                                <div className="text-left mt-2">
                                  <h3 className="text-xl md:text-2xl font-bold font-inter text-[#3b3b58] mb-3">Inter Typography</h3>
                                  <p className="text-sm md:text-base text-[#6b7280] leading-relaxed font-inter">
                                    We selected the highly legible, geometric neo-grotesque typeface <strong>Inter</strong> for the Nebula digital creator dashboard. Designed specifically for display screens, Inter's high x-height and clear contours ensure outstanding readability across complex numerical tables, timeline views, and predictive charts.
                                  </p>
                                </div>
                              </div>

                              {/* Column 2: Color Palette */}
                              <div className="flex flex-col gap-6">
                                {/* Color Palette Specimen Card */}
                                <div className="bg-white rounded-3xl p-8 flex flex-col justify-between aspect-auto min-h-[340px] lg:aspect-[16/10] overflow-hidden relative shadow-lg border border-[#E4DFD7] hover:scale-[1.01] transition-transform duration-300">

                                  <div className="flex justify-between items-start z-10 w-full mb-6">
                                    <div className="text-left">
                                      <div className="text-[11px] tracking-widest font-mono text-[#7a829a] uppercase font-bold mb-1">Color Palette</div>
                                      <div className="text-lg font-inter font-bold text-[#3b3b58] tracking-tight">Active Colors</div>
                                    </div>
                                    <div className="text-right font-mono text-[8px] text-[#7a829a]/70 tracking-widest uppercase">
                                      HOVER FOR HEX
                                    </div>
                                  </div>

                                  {/* Interactive Swatches Bar Style */}
                                  <div className="flex h-32 md:h-40 w-full rounded-xl overflow-hidden border border-[#E4DFD7] shadow-sm bg-[#FAFAF9] mt-auto">
                                    {[
                                      { hex: "#6E50E9", label: "Indigo Violet", darkText: false },
                                      { hex: "#1B2431", label: "Deep Space Blue", darkText: false },
                                      { hex: "#273142", label: "Charcoal Navy", darkText: false },
                                      { hex: "#0F0F12", label: "Deep Black", darkText: false },
                                      { hex: "#19062F", label: "Midnight Purple", darkText: false },
                                      { hex: "#3B00D6", label: "Electric Indigo", darkText: false },
                                      { hex: "#9500E8", label: "Neon Violet", darkText: false },
                                      { hex: "#FFFFFF", label: "Neutral White", darkText: true, border: true }
                                    ].map((color) => (
                                      <div
                                        key={color.hex}
                                        className="flex-1 h-full relative group transition-all duration-500 hover:flex-[2.2] cursor-default"
                                        style={{ 
                                          backgroundColor: color.hex,
                                          borderLeft: color.border ? '1px solid #E4DFD7' : 'none',
                                          borderRight: color.border ? '1px solid #E4DFD7' : 'none'
                                        }}
                                      >
                                        <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[7px] font-bold tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${color.darkText ? 'text-black/80' : 'text-white/90'}`}>
                                          {color.hex}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Color Palette Text Info */}
                                <div className="text-left mt-2">
                                  <h3 className="text-xl md:text-2xl font-bold font-inter text-[#3b3b58] mb-3">Colour Style</h3>
                                  <p className="text-sm md:text-base text-[#6b7280] leading-relaxed font-inter">
                                    We carefully selected a color style that incorporates the unique colors of each product into their respective pages. This approach allowed us to effectively communicate the story behind each product and showcase the individuality of each brand.
                                  </p>
                                </div>
                              </div>

                          </div>
                        </div>
                      </section>

                      {/* ── INTRODUCING ── */}
                      <section className="dv-section dv-intro-section">
                        <div className="dv-container dv-text-center">
                          <h2 className="dv-mixed-heading">
                            <span className="dv-heading-bold">Introducing</span>{" "}
                            <em className="dv-heading-italic">the Platform</em>
                          </h2>
                          <p className="dv-subheading">
                            After research, persona development, and wireframing, I designed a dashboard that turns complex analytics into simple, culturally relevant insights. It combines sentiment analysis, trend forecasting, and AI-powered content generation tailored for Indian creators.
                          </p>
                        </div>
                      </section>

                      {/* ── HIGH FIDELITY SCREENS SECTION ── */}
                      <section className="dv-section dv-screens-section" style={{ paddingTop: '120px' }}>
                        <div className="dv-container">

                          <h2 className="dv-mixed-heading dv-text-center dv-mb-64">
                            <span className="dv-heading-bold">Features</span>
                          </h2>

                          {/* 1. Easy Onboarding */}
                          <div className="dv-feature-card dv-mb-40">
                            <div className="dv-feature-text dv-feature-light-gray">
                              <h3 className="dv-feature-heading dv-left">
                                The Onboarding Experience.
                              </h3>
                              <p className="dv-subheading dv-left">
                                Before accessing Nebula's analytics and trend intelligence tools, creators are guided through a personalized onboarding journey. The experience connects social accounts, captures creator goals, identifies content niches, and tailors insights to each user's unique audience and growth strategy.
                              </p>
                            </div>
                            <div className="dv-feature-visual dv-feature-purple-bg">
                              <div className="dv-video-wrapper" style={{ aspectRatio: '2102 / 1500' }}>
                                <video src="/onboarding.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
                              </div>
                            </div>
                          </div>

                          {/* 2. Onboarding Owner / Member */}
                          <div className="dv-screens-2grid dv-mb-40">
                            <div className="dv-screen-card dv-feature-purple-bg">
                              <div className="dv-screen-card-text dv-text-center">
                                <h4 className="dv-screen-title text-white">Unified Creator Dashboard</h4>
                                <p className="dv-screen-desc text-white-80">A centralized workspace that brings together analytics, trend forecasting, audience intelligence, and content planning into a single source of truth.</p>
                              </div>
                              <div className="dv-screen-card-visual">
                                <div className="dv-video-wrapper" style={{ aspectRatio: '1864 / 1426' }}>
                                  <video src="/vid1.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
                                </div>
                              </div>
                            </div>
                            <div className="dv-screen-card dv-feature-purple-bg">
                              <div className="dv-screen-card-text dv-text-center">
                                <h4 className="dv-screen-title text-white">Trend Intelligence Hub</h4>
                                <p className="dv-screen-desc text-white-80">An AI-powered discovery engine that helps creators identify emerging trends, viral formats, and content opportunities before they become mainstream.</p>
                              </div>
                              <div className="dv-screen-card-visual">
                                <div className="dv-video-wrapper" style={{ aspectRatio: '1864 / 1426' }}>
                                  <video src="/vid2.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Tasks Board / Voting Hub */}
                          <div className="dv-screens-2grid dv-mb-24">
                            <div className="dv-screen-card dv-feature-purple-bg">
                              <div className="dv-screen-card-text dv-text-center">
                                <h4 className="dv-screen-title text-white">Virality Breakdown</h4>
                                <p className="dv-screen-desc text-white-80">A contextual analytics tool that explains why content succeeds by decoding engagement patterns, audience behavior, and trend alignment.</p>
                              </div>
                              <div className="dv-screen-card-visual">
                                <div className="dv-video-wrapper" style={{ aspectRatio: '1864 / 1426' }}>
                                  <video src="/vid3.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
                                </div>
                              </div>
                            </div>
                            <div className="dv-screen-card dv-feature-purple-bg">
                              <div className="dv-screen-card-text dv-text-center">
                                <h4 className="dv-screen-title text-white">AI Content <em className="dv-heading-italic text-white">Generator</em></h4>
                                <p className="dv-screen-desc text-white-80">Generate culturally resonant captions, hooks, and hashtag sets tailored to Indian audiences and trends.</p>
                              </div>
                              <div className="dv-screen-card-visual">
                                <div className="dv-video-wrapper" style={{ aspectRatio: '2106 / 1510' }}>
                                  <video src="/trend-tools.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
                                </div>
                              </div>
                            </div>
                          </div>


                        </div>
                      </section>

                      {/* ── PRODUCT PROTOTYPE (MVP) ── */}
                      <section className="dv-section dv-prototype-section">
                        <div className="dv-container dv-text-center">
                          <h2 className="dv-mixed-heading dv-mb-40">
                            <span className="dv-heading-bold">Experience</span>{" "}
                            <em className="dv-heading-italic">the Flow</em>
                          </h2>

                          {/* Premium Device Window Mockup Wrapper */}
                          <div className="dv-prototype-window-wrapper">
                            <div className="dv-prototype-window-header">
                              <div className="dv-window-dots">
                                <span className="dv-dot-red"></span>
                                <span className="dv-dot-yellow"></span>
                                <span className="dv-dot-green"></span>
                              </div>
                              <div className="dv-window-title">
                                <Icon icon="solar:figma-bold-duotone" className="text-[#F24E1E] text-sm" />
                                <span className="font-sans font-medium text-xs tracking-wider">INTERACTIVE PROTOTYPE</span>
                              </div>
                              <div className="dv-window-spacer"></div>
                            </div>
                            <div className="dv-prototype-embed-container">
                              <iframe
                                className="dv-prototype-iframe"
                                src="https://embed.figma.com/proto/DSBKMu5b9w7FOs5EkQKAol/Data-Analytics-Project?node-id=323-2905&viewport=-1260%2C-100%2C0.16&scaling=scale-down&content-scaling=fixed&starting-point-node-id=323%3A2905&page-id=0%3A1&embed-host=share"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* ── POSSIBLE IMPACT ── */}
                      <section className="dv-section dv-impact-section">
                        <div className="dv-container dv-text-center">
                          <h2 className="dv-mixed-heading">
                            <span className="dv-heading-bold">Possible</span>{" "}
                            <em className="dv-heading-italic">Impact</em>
                          </h2>
                          <p className="dv-subheading">
                            Designed to solve the real challenges Indian creators face every day, turning complexity into clarity:
                          </p>

                          <div className="dv-impact-grid dv-mt-40">
                            <div className="dv-impact-card">
                              <h4 className="dv-impact-title">Reduce Trend Discovery Time</h4>
                              <p className="dv-impact-text">Creators often spend hours manually browsing Instagram, YouTube, and other platforms to identify trends. Nebula centralizes trend discovery and analysis, reducing research effort and accelerating content planning.</p>
                            </div>
                            <div className="dv-impact-card">
                              <h4 className="dv-impact-title">Better Trend-to-Audience Fit</h4>
                              <p className="dv-impact-text">While many Indian creators adopt global trends, not every trend resonates with local audiences. Nebula helps creators evaluate whether a trend aligns with their niche, audience preferences, and content style before investing time in production.</p>
                            </div>
                            <div className="dv-impact-card">
                              <h4 className="dv-impact-title">More Data-Driven Content Decisions</h4>
                              <p className="dv-impact-text">Instead of relying on intuition or copying competitors, creators can use performance insights, audience intelligence, and trend forecasts to make informed content decisions.</p>
                            </div>
                          </div>
                        </div>
                      </section>

                    </div>{/* end .dv-embed */}

                    {/* ── Next / Previous Projects ── */}
                    <div data-theme="light" className="w-full bg-white border-t border-black/10 flex flex-col sm:flex-row">
                      <Link
                        href="/projects/flytbase"
                        className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 border-b sm:border-b-0 sm:border-r border-black/10 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500"
                      >
                        <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                        <div className="flex items-center gap-4 md:gap-6">
                          <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Flytbase</h3>
                        </div>
                      </Link>
                      <Link
                        href="/projects/xtep"
                        className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col items-end justify-center group hover:bg-black/5 transition-colors duration-500"
                      >
                        <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Next Project</span>
                        <div className="flex items-center gap-4 md:gap-6">
                          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:translate-x-2 transition-all duration-500 leading-none pb-1">Xtep</h3>
                          <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:translate-x-4 transition-all duration-500">&rarr;</span>
                        </div>
                      </Link>
                    </div>

                  </div>
                </div>

                <div data-theme="dark">
                  <DynamicFooter />
                </div>

              </main>
            </ReactLenis>
          </div>
        </>
      </LiquidBackground>
    </>
  );
}

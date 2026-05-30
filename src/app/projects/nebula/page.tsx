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
import "./daoverse.css";

gsap.registerPlugin(ScrollTrigger);

// Nebula brand colours — deep blue-purple-teal palette
const PAGE_COLORS = {
  uColor1: [0.18, 0.08, 0.72],  // deep indigo
  uColor2: [0.04, 0.28, 0.68],  // electric blue
  uColor3: [0.0,  0.55, 0.78],  // teal/cyan
  uColor4: [0.02, 0.02, 0.08],  // near-black
  uColor5: [0.18, 0.08, 0.72],
  uColor6: [0.04, 0.28, 0.68],
};

// Showcase screen map (DAOverse screens)
const screenMap = {
  onboarding: { src: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop", alt: "Wallet Connection" },
  creator:    { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",  alt: "DAO Creator Flow" },
  member:     { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", alt: "DAO Member Flow" },
  tasks:      { src: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop", alt: "Tasks Board" },
  voting:     { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",  alt: "Voting Hub" },
  treasury:   { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070&auto=format&fit=crop", alt: "DAO Treasury" },
  subdaos:    { src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2070&auto=format&fit=crop",  alt: "SubDAOs Management" },
  feed:       { src: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop", alt: "Feed & Collaboration" },
  explore:    { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",  alt: "Explore DAOs & NFTs" },
  edge:       { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", alt: "Designing Edge Cases" },
};

export default function NebulaPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);
  const [showReveal, setShowReveal] = useState(true);
  const [showRevealIn, setShowRevealIn] = useState(false);

  // DAOverse carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = 5;

  // DAOverse showcase tab state
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

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
      gsap.from(section.querySelectorAll(".reveal-item"), {
        y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, ease: "back.out(1.7)", clearProps: "all",
        scrollTrigger: { trigger: section, start: "top 88%", toggleActions: "play none none none" },
      });
    });

    // ── Pin carousel & drive horizontal scroll through all 5 cards ──
    const carouselSection = containerRef.current?.querySelector(".dv-research-carousel-section") as HTMLElement | null;
    const carousel        = carouselSection?.querySelector(".dv-dark-cards-carousel") as HTMLElement | null;
    const track           = carouselSection?.querySelector(".dv-dark-cards-track") as HTMLElement | null;

    if (carouselSection && carousel && track) {
      gsap.to(track, {
        x: () => -(track.scrollWidth - carousel.clientWidth + 48),
        ease: "none",
        scrollTrigger: {
          trigger: carouselSection,
          start: "center center",
          end: () => `+=${track.scrollWidth - carousel.clientWidth + 48}`,
          pin: true,
          pinType: "transform",
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
                  <Link href="/playground" className="hover:opacity-60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap text-[10px] uppercase tracking-widest">Playground</Link>
                </div>
              }
            />

            <ReactLenis root options={{ duration: 1.4, lerp: 0.05, wheelMultiplier: 1.1, gestureOrientation: "vertical", smoothWheel: true }}>
              <main ref={mainContentRef}>

                {/* ── HERO SCROLL VIDEO ─────────────────────────────── */}
                <div data-theme="dark">
                  <HeroScrollVideo
                    title={<>Nebula: Designing the<br />Future of Decentralized<br />Cloud Computing</>}
                    titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                    description="Nebula is a cutting-edge platform designed to revolutionize how developers access and manage cloud resources. By leveraging decentralized infrastructure, Nebula provides unparalleled security, scalability, and cost-efficiency for modern web applications."
                    scopeOfWork={["Product Strategy", "UI/UX Design", "Custom 3D Assets", "Frontend Architecture"]}
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
                      caption: "/01 BRIEF",
                      heading: "Decentralised. Scalable. Human.",
                      paragraphs: [
                        "Nebula needed an interface that could tame the complexity of distributed node management without alienating developers. The existing tooling was powerful but inaccessible.",
                        "Our approach centred on progressive disclosure — surfacing only what matters at each stage of a developer's journey, with real-time feedback that builds confidence.",
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
                      <div className="w-full md:w-[65%] mb-8 md:mb-0">
                        <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Role</h3>
                        <p className="text-sm md:text-base font-medium text-white">Lead Product Designer</p>
                      </div>
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
                            Nebula provides a unified dashboard for managing distributed node clusters across the globe, allowing developers to deploy applications in seconds without worrying about underlying infrastructure hardware into an integrated digital solution.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                            Create a seamless onboarding flow and resource management system that hides the complexity of decentralised protocols while maintaining full transparency.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                          <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                            <li>Simplifying decentralised resource allocation</li>
                            <li>Ensuring real-time latency feedback for node health</li>
                            <li>Designing for technical power-users</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                            Delivered a production-ready design system and interactive prototype that reduced developer onboarding time by an estimated 60%, receiving top marks from stakeholders for its clarity and visual polish.
                          </p>
                        </div>
                      </div>

                      {/* Right column */}
                      <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                          <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                            <li>Secondary Research</li>
                            <li>Technical Architecture Mapping</li>
                            <li>UI/UX Design</li>
                            <li>Interactive Prototyping</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools &amp; Technologies</h3>
                          <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                            <li>Figma</li>
                            <li>Spline (3D)</li>
                            <li>After Effects</li>
                            <li>Framer</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">View Website</h3>
                          <button className="px-8 py-2.5 rounded-full border border-white/40 text-white text-sm hover:bg-white hover:text-black transition-colors font-medium">
                            View Live
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* ── WHITE CANVAS: DAOverse case-study sections ───── */}
                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                  <div className="white-canvas-content w-full bg-white transition-all duration-300 ease-out rounded-[40px] md:rounded-[80px] shadow-2xl origin-center" data-theme="light">

                    {/* All DAOverse sections wrapped in .dv-embed for scoped CSS */}
                    <div className="dv-embed">

{/* ── PROBLEM STATEMENT ── */}
                      <section className="dv-section dv-problem-section" style={{ textAlign: 'left', padding: '80px 0' }}>
                        <div className="dv-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#5c6bc0', borderRadius: '2px' }}></div>
                            <span style={{ color: '#7a829a', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>PROBLEM STATEMENT</span>
                          </div>
                          
                          <h2 className="dv-left" style={{ fontSize: '3.5rem', fontWeight: 600, color: '#3b3b58', marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                            Understanding the Problem
                          </h2>

                          <p className="dv-body" style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                            Indian influencers, creators, and small businesses struggle to manage their growing online presence across multiple platforms. They face a unique set of challenges:
                          </p>

                          <ol style={{ paddingLeft: '0', listStyleType: 'none', color: '#6b7280', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '32px' }}>
                            <li>1. Tracking campaign performance across fragmented platforms</li>
                            <li>2. Understanding audience sentiment and engagement patterns</li>
                            <li>3. Identifying trends before they peak</li>
                            <li>4. Generating culturally relevant content at scale</li>
                            <li>5. Building brand identity without enterprise-level tools</li>
                            <li>6. Translating complex analytics into actionable decisions</li>
                          </ol>

                          <p className="dv-body" style={{ fontSize: '1.15rem', color: '#6b7280', lineHeight: '1.6' }}>
                            Existing tools are <strong style={{ color: '#3b3b58', fontWeight: 600 }}>built for the West</strong> — they ignore the cultural nuances, regional languages, and growth patterns unique to Indian talent. The result: creators are either flying blind or drowning in data they can't act on.
                          </p>
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
                                <h3 className="dv-dark-card-title">No India-First<br/>Analytics Tool</h3>
                                <p className="dv-dark-card-body">
                                  Existing platforms like Hootsuite and Sprout Social are built for Western markets — they miss regional languages, Tier-2 audiences, and Indian platform behaviors.
                                </p>
                              </div>
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">Trend Discovery<br/>Is Manual &amp; Slow</h3>
                                <p className="dv-dark-card-body">
                                  Creators spend hours scrolling Reels and Twitter/X to spot trends — by the time they act, the moment has passed.
                                </p>
                              </div>
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">Creators Want<br/>Predictive Guidance</h3>
                                <p className="dv-dark-card-body">
                                  Analytics tools show what happened — creators need AI-powered forecasts for what to create next to maximize reach.
                                </p>
                              </div>
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">Data Overwhelm<br/>Kills Action</h3>
                                <p className="dv-dark-card-body">
                                  Dashboards flood creators with raw metrics. Without clear, actionable insights, most data goes unused or misunderstood.
                                </p>
                              </div>
                              <div className="dv-dark-card">
                                <h3 className="dv-dark-card-title">Brand Deals Are<br/>Hard to Manage</h3>
                                <p className="dv-dark-card-body">
                                  Small creators juggle brand collaborations in WhatsApp and Google Sheets — there's no unified space to track deliverables, deadlines, and payments.
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
                            To design a platform built for Indian creators, I explored competitors, ran interviews with 20+ influencers, and crafted personas based on real growth pain points across niches — fashion, gaming, food, and finance.
                          </p>

                          {/* 3 method cards */}
                          <div className="dv-method-cards-grid dv-mt-40">
                            <div className="dv-method-card" style={{ padding: '24px' }}>
                              <h5 className="dv-method-title dv-left" style={{fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem'}}>Competitive Analysis</h5>
                              <p className="dv-method-desc" style={{color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1}}>Studied platforms including Hootsuite, Sprout Social, Creator.co, and Indian alternatives like Qoruz and Winkl to identify gaps for Indian creators.</p>
                              <a href="#" className="px-6 py-2.5 mt-4 rounded-full border border-black/30 text-black text-sm hover:bg-black hover:text-white transition-colors font-medium inline-flex items-center justify-center gap-2 w-fit">
                                View Analysis <span className="text-lg leading-none">→</span>
                              </a>
                            </div>
                            <div className="dv-method-card" style={{ padding: '24px' }}>
                              <h5 className="dv-method-title dv-left" style={{fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem'}}>Personas</h5>
                              <p className="dv-method-desc" style={{color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1}}>Defined two core personas: an emerging Indian creator (10K–500K followers) and a small business owner using influencer marketing to grow their brand.</p>
                              <a href="#" className="px-6 py-2.5 mt-4 rounded-full border border-black/30 text-black text-sm hover:bg-black hover:text-white transition-colors font-medium inline-flex items-center justify-center gap-2 w-fit">
                                View Personas <span className="text-lg leading-none">→</span>
                              </a>
                            </div>
                            <div className="dv-method-card" style={{ padding: '24px' }}>
                              <h5 className="dv-method-title dv-left" style={{fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem'}}>User Journey Map</h5>
                              <p className="dv-method-desc" style={{color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1}}>Mapped the creator's journey from idea generation to publishing and brand deal management — uncovering drop-off points and moments of frustration.</p>
                              <a href="#" className="px-6 py-2.5 mt-4 rounded-full border border-black/30 text-black text-sm hover:bg-black hover:text-white transition-colors font-medium inline-flex items-center justify-center gap-2 w-fit">
                                View Journey <span className="text-lg leading-none">→</span>
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
                              <h3 className="dv-mixed-heading" style={{fontSize: '2.5rem', letterSpacing: '-0.02em', lineHeight: '1.1'}}>
                                <span className="dv-heading-bold">Sketch</span>{" "}
                                <em className="dv-heading-italic">&amp; Wireframes</em>
                              </h3>
                              <p className="dv-subheading">
                                Sketched low-fidelity wireframes to validate core ideas — the dashboard layout, campaign tracking flow, and content calendar — before moving into high-fidelity visual design.
                              </p>
                            </div>
                            <div className="dv-edge-phones-row dv-mt-40">
                              <img src="https://images.unsplash.com/photo-1618788372246-ce5f4e18fce1?q=80&w=2070&auto=format&fit=crop" alt="Wireframe" className="dv-edge-phone" />
                              <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" alt="Wireframe" className="dv-edge-phone" />
                              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" alt="Wireframe" className="dv-edge-phone" />
                              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Wireframe" className="dv-edge-phone" />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* ── INTRODUCING DAOVERSE ── */}
                      <section className="dv-section dv-intro-section">
                        <div className="dv-container dv-text-center">
                          <h2 className="dv-mixed-heading">
                            <span className="dv-heading-bold">Introducing</span>{" "}
                            <em className="dv-heading-italic">the Platform</em>
                          </h2>
                          <p className="dv-subheading">
                            After research, persona development, and wireframing, I designed a dashboard that turns complex analytics into simple, culturally relevant insights — combining sentiment analysis, trend forecasting, and AI-powered content generation tailored for Indian creators.
                          </p>
                        </div>

                        {/* Bento grid */}
                        <div className="dv-container dv-mt-40">
                          <div className="dv-bento-grid">
                            {/* Card 1 (Top Left) */}
                            <div className="dv-bento-card" style={{ padding: 0 }}>
                              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="Placeholder 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            {/* Card 2 (Bottom Left) */}
                            <div className="dv-bento-card" style={{ padding: 0 }}>
                              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" alt="Placeholder 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            
                            {/* Card 3 (Top Mid) */}
                            <div className="dv-bento-card" style={{ padding: 0 }}>
                              <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop" alt="Placeholder 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            {/* Card 4 (Bottom Mid) */}
                            <div className="dv-bento-card" style={{ padding: 0 }}>
                              <img src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop" alt="Placeholder 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>

                            {/* Card 5 (Right Tall) */}
                            <div className="dv-bento-card dv-bento-tall" style={{ padding: 0 }}>
                              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070&auto=format&fit=crop" alt="Placeholder 5" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          </div>
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
                                Smart Analytics<br />
                                <em className="dv-heading-italic" style={{fontSize:"1.8rem"}}>
                                  &amp; Trend Forecasting
                                </em>
                              </h3>
                              <p className="dv-subheading dv-left">
                                AI-powered trend forecasting surfaces emerging content opportunities before they peak — so Indian creators can act fast, stay relevant, and grow their audience with data-backed confidence.
                              </p>
                            </div>
                            <div className="dv-feature-visual dv-feature-purple-bg">
                              <div className="dv-video-wrapper">
                                <video src="/vid1.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
                              </div>
                            </div>
                          </div>

                          {/* 2. Onboarding Owner / Member */}
                          <div className="dv-screens-2grid dv-mb-40">
                            <div className="dv-screen-card dv-feature-purple-bg">
                              <div className="dv-screen-card-text dv-text-center">
                                <h4 className="dv-screen-title text-white">Campaign Tracker</h4>
                                <p className="dv-screen-desc text-white-80">Track brand deal deliverables, deadlines, and performance metrics in one unified view.</p>
                              </div>
                              <div className="dv-screen-card-visual">
                                <div className="dv-video-wrapper">
                                  <video src="/vid1.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
                                </div>
                              </div>
                            </div>
                            <div className="dv-screen-card dv-feature-purple-bg">
                              <div className="dv-screen-card-text dv-text-center">
                                <h4 className="dv-screen-title text-white">Audience Insights</h4>
                                <p className="dv-screen-desc text-white-80">Understand follower sentiment, peak engagement windows, and audience demographics at a glance.</p>
                              </div>
                              <div className="dv-screen-card-visual">
                                <div className="dv-video-wrapper">
                                  <video src="/vid2.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Tasks Board / Voting Hub */}
                          <div className="dv-screens-2grid dv-mb-24">
                            <div className="dv-screen-card dv-feature-purple-bg">
                              <div className="dv-screen-card-text dv-text-center">
                                <h4 className="dv-screen-title text-white">Content <em className="dv-heading-italic text-white">Calendar</em></h4>
                                <p className="dv-screen-desc text-white-80">Plan, schedule, and publish content across platforms with an AI-suggested posting rhythm.</p>
                              </div>
                              <div className="dv-screen-card-visual">
                                <div className="dv-video-wrapper">
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
                                <div className="dv-video-wrapper">
                                  <video src="/vid1.mp4" className="dv-screen-media" autoPlay loop muted playsInline />
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
                            Designed to solve the real challenges Indian creators face every day — turning complexity into clarity:
                          </p>

                          <div className="dv-impact-grid dv-mt-40">
                            <div className="dv-impact-card">
                              <p className="dv-impact-text">Help creators discover and act on trends before they peak — reducing content planning time by up to 60%.</p>
                            </div>
                            <div className="dv-impact-card">
                              <p className="dv-impact-text">Simplify brand deal management with a unified campaign tracker built for solo creators, not agencies.</p>
                            </div>
                            <div className="dv-impact-card">
                              <p className="dv-impact-text">Empower Indian creators with AI tools that understand regional context, languages, and audience behaviour.</p>
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

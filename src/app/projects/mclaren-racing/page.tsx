"use client";

import { useRef } from "react";
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
import { HorizontalScrollGallery } from "@/components/ui/HorizontalScrollGallery";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./../nebula/nebula.css";

gsap.registerPlugin(ScrollTrigger);

// Custom Background Colors for McLaren Racing
const PAGE_COLORS = {
    uColor1: [1.0, 0.5, 0.0],     // Papaya Orange
    uColor2: [0.1, 0.1, 0.1],     // Dark Carbon
    uColor3: [1.0, 0.6, 0.1],     // Bright Orange
    uColor4: [1.0, 1.0, 1.0],     // White accents
    uColor5: [1.0, 0.5, 0.0],
    uColor6: [0.1, 0.1, 0.1]
};

const projectImages = [
    "/generated/mclaren_vision.png",
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c15d?q=80&w=1200",
    "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200",
];

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

export default function McLarenRacingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLElement>(null);
    const lenisRef = useRef<any>(null);
    const [showReveal, setShowReveal] = useState(true);
    const [showRevealIn, setShowRevealIn] = useState(false);

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
        // Section header reveal animations
        gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
            gsap.from(section.querySelectorAll(".reveal-item"), {
                y: 30,
                autoAlpha: 0,
                duration: 1,
                stagger: 0.1,
                ease: "back.out(1.7)",
                clearProps: "all",
                scrollTrigger: {
                    trigger: section,
                    start: "top 88%",
                    toggleActions: "play none none none"
                }
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

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

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
                                    onClick={() => {
                                        setShowRevealIn(true);
                                        setTimeout(() => {
                                            window.location.href = "/";
                                        }, 1000);
                                    }}
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

                        <ReactLenis root ref={lenisRef} options={{
                            autoRaf: false,
                            duration: 1.4,
                            lerp: 0.05,
                            wheelMultiplier: 1.1,
                            gestureOrientation: "vertical",
                            smoothWheel: true
                        }}>
                            <main ref={mainContentRef}>
                                <div data-theme="dark">
                                    <HeroScrollVideo
                                        title={<>McLaren Racing: Speed &<br />Precision in the Digital<br />Fast Lane</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="Partnering with McLaren Racing to design a high-performance fan engagement platform that brings the thrill of F1 to life through real-time data and immersive storytelling."
                                        scopeOfWork={["Experience Design", "Fan Engagement Strategy", "Interactive Data", "UI Architecture"]}
                                        media={projectImages[0]}
                                        mediaType="image"
                                        scrollHeightVh={140}
                                        smoothScroll={false}
                                        targetSize="fullscreen"
                                        overlay={{
                                            caption: "/01 BRIEF",
                                            heading: "Driven by Data",
                                            paragraphs: [
                                                "F1 is as much about data as it is about racing. McLaren needed a way to present complex track telemetry to fans in a way that was instantly understandable and emotionally resonant.",
                                                "We developed a design system inspired by the precision of engineering and the raw adrenaline of the race track, using high-contrast typography and fluid animations."
                                            ]
                                        }}
                                    />
                                </div>

                                {/* Project Details Reference Section */}
                                <div className="w-full relative">
                                    <div className="absolute inset-0 bg-black/[0.15] pointer-events-none" />
                                    <section className="w-full relative z-10 text-[#e5e5e5] py-20 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto font-sans" data-theme="dark">
                                        <div className="flex flex-col md:flex-row justify-between w-full mb-16 md:mb-24">
                                            <div className="w-full md:w-[65%] mb-8 md:mb-0">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Role</h3>
                                                <p className="text-sm md:text-base font-medium text-white">Experience Designer</p>
                                            </div>
                                            <div className="w-full md:w-[30%]">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Timeline</h3>
                                                <p className="text-sm md:text-base font-medium text-white">6 Months</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between w-full">
                                            <div className="w-full md:w-[65%] flex flex-col gap-12 md:gap-16 pr-0 md:pr-12">
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Overview</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        A digital transformation project focused on bridging the gap between the pit wall and the fan's living room melalui live data visualization and high-fidelity interactive content.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        Create a truly immersive fan platform that enhances the race-day experience through real-time telemetry and behind-the-scenes access.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                                                        <li>Managing high-velocity data streams during live events</li>
                                                        <li>Creating a visual language that feels as fast as an F1 car</li>
                                                        <li>Ensuring cross-platform performance for millions of fans</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                                                        Launched the new McLaren Plus platform, resulting in a 50% increase in fan registrations and record-breaking race weekend traffic.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Fan Journey Mapping</li>
                                                        <li>Telemetry Visualization</li>
                                                        <li>UI Performance Audit</li>
                                                        <li>Live Event Testing</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools & Technologies</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Figma</li>
                                                        <li>WebSockets</li>
                                                        <li>React</li>
                                                        <li>GSAP</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">View Website</h3>
                                                    <button className="px-8 py-2.5 rounded-full border border-white/40 text-white text-sm hover:bg-white hover:text-black transition-colors font-medium">
                                                        Visit Platform
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                                    <div className="white-canvas-content w-full bg-white transition-colors duration-300 ease-out shadow-2xl origin-center" data-theme="light">
                                        <div className="dv-embed">
                                            {/* ── PROBLEM STATEMENT ── */}
                                            <section className="dv-section dv-problem-section" style={{ textAlign: 'left', padding: '80px 0' }}>
                                                <div className="dv-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                                        <div style={{ width: '8px', height: '8px', backgroundColor: '#ff8000', borderRadius: '2px' }}></div>
                                                        <span style={{ color: '#7a829a', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>THE BRIEF</span>
                                                    </div>

                                                    <h2 className="dv-left" style={{ fontSize: '3.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                                                        Driven by Data
                                                    </h2>

                                                    <p className="dv-body" style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                                                        <strong>F1 is as much about data as it is about racing. McLaren needed a way to present complex track telemetry to fans in a way that was instantly understandable and emotionally resonant. Key challenges included:</strong>
                                                    </p>

                                                    <ol style={{ paddingLeft: '0', listStyleType: 'none', color: '#6b7280', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '32px' }}>
                                                        <li>1. Managing high-velocity telemetry data streams during live Grand Prix events</li>
                                                        <li>2. Designing a visual language that matches the speed and aerodynamics of an F1 car</li>
                                                        <li>3. Ensuring stable, high-performance rendering on varied mobile devices globally</li>
                                                        <li>4. Designing engaging, gamified elements that reward active fan participation in real-time</li>
                                                        <li>5. Displaying complex timing loops and historical speed traces without cluttering screens</li>
                                                    </ol>
                                                </div>
                                            </section>

                                            {/* ── VISUAL DIRECTION ── */}
                                            <section className="dv-section dv-research-carousel-section">
                                                <div className="dv-container">
                                                    <h2 className="dv-mixed-heading">
                                                        <span className="dv-heading-bold">Product</span>{" "}
                                                        <em className="dv-heading-italic">Direction</em>
                                                    </h2>
                                                    <p className="dv-subheading">
                                                        Just like an F1 car, every element of our design was optimized for performance, weight, and speed:
                                                    </p>

                                                    <div className="dv-dark-cards-carousel dv-mt-24">
                                                        <div className="dv-dark-cards-track">
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Aero Design</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Fluid UI components that follow the aerodynamic lines of the MCL60 race car.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Telemetry Hub</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Bridging the gap between pure engineering stats and interactive fan engagement.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Live Interaction</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Real-time updates that keep fans connected with the pit wall timing screens.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Brand Speed</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Micro-animations and transitions designed to mirror the speed of F1 racing.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Final Lap</h3>
                                                                <p className="dv-dark-card-body">
                                                                    A robust, high-performance platform delivered for a global fan base.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── PROCESS & STRATEGY ── */}
                                            <section className="dv-section dv-research-methods-section" style={{ paddingTop: '0' }}>
                                                <div className="dv-container">
                                                    <p className="dv-subheading dv-left">
                                                        Through detailed fan journey mapping, telemetry UI testing, and rigorous performance audits, we built an engaging interface for race weekend spectators.
                                                    </p>

                                                    <div className="dv-method-cards-grid dv-mt-40">
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Fan Journey Mapping</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Mapping user touchpoints during live race weekends, identifying key moments of engagement and content consumption.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Telemetry UI Testing</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Testing abstract data charts versus literal speed dials to find the layout that helps casual fans understand strategy best.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>UI Performance Audit</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Optimizing SVG rendering paths and layout reflows to run smoothly on lower-end mobile devices during traffic peaks.</p>
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
                                                                <span className="dv-heading-bold">Telemetry</span>{" "}
                                                                <em className="dv-heading-italic">&amp; Sketches</em>
                                                            </h3>
                                                            <p className="dv-subheading">
                                                                Designed low-fidelity drafts for high-velocity race telemetry graphs, driver timing comparison selectors, and interactive 3D track maps.
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
                                                        <span className="dv-heading-bold">Data</span>{" "}
                                                        <em className="dv-heading-italic">Flow Architecture</em>
                                                    </h2>

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

                                            {/* ── THE CANVAS SHOWCASE ── */}
                                            <section className="dv-section dv-intro-section">
                                                <div className="dv-container dv-text-center">
                                                    <h2 className="dv-mixed-heading">
                                                        <span className="dv-heading-bold">Introducing</span>{" "}
                                                        <em className="dv-heading-italic">the Experience</em>
                                                    </h2>
                                                    <p className="dv-subheading">
                                                        A digital translation of the racetrack, bridging the gap between the pit wall and the fan's living room.
                                                    </p>
                                                </div>

                                                <div className="dv-container dv-mt-40">
                                                    <div className="dv-bento-grid">
                                                        {/* Card 1 (Top Left) */}
                                                        <div className="dv-bento-card" style={{ padding: 0 }}>
                                                            <img src="/MCl.png" alt="McLaren Telemetry Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        {/* Card 2 (Bottom Left) */}
                                                        <div className="dv-bento-card" style={{ padding: 0 }}>
                                                            <img src="/MCL2.png" alt="McLaren Fan Application" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>

                                                        {/* Card 3 (Top Mid) */}
                                                        <div className="dv-bento-card" style={{ padding: 0 }}>
                                                            <img src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200" alt="McLaren Front Angle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        {/* Card 4 (Bottom Mid) */}
                                                        <div className="dv-bento-card" style={{ padding: 0 }}>
                                                            <img src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200" alt="McLaren Interior Badge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>

                                                        {/* Card 5 (Right Tall) */}
                                                        <div className="dv-bento-card dv-bento-tall" style={{ padding: 0 }}>
                                                            <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200" alt="McLaren Side Angle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── DETAILED PORTFOLIO SECTIONS ── */}
                                            <section className="dv-section dv-screens-section" style={{ paddingTop: '120px' }}>
                                                <div className="dv-container">
                                                    <h2 className="dv-mixed-heading dv-text-center dv-mb-64">
                                                        <span className="dv-heading-bold">Features</span>{" "}
                                                        <em className="dv-heading-italic">Showcase</em>
                                                    </h2>

                                                    {/* Feature 1 */}
                                                    <div className="dv-feature-card dv-mb-40">
                                                        <div className="dv-feature-text dv-feature-light-gray">
                                                            <h3 className="dv-feature-heading dv-left">Aero Design</h3>
                                                            <p className="dv-subheading dv-left">Fluid UI components that follow the aerodynamic lines of the MCL60, utilizing sleek carbon fiber textures and brand aesthetics.</p>
                                                        </div>
                                                        <div className="dv-feature-visual dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)' }}>
                                                            <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c15d?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 2 & 3 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-40">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Telemetry Hub</h4>
                                                                <p className="dv-screen-desc text-white-80">Bridging the gap between pure engineering stats and interactive fan engagement through telemetry indicators.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Live Interaction</h4>
                                                                <p className="dv-screen-desc text-white-80">Real-time socket updates that keep millions of active fans synced directly with pit-wall timing screens.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1504244723920-80436d4003c2?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 4 & 5 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-24">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Brand Speed</h4>
                                                                <p className="dv-screen-desc text-white-80">Micro-animations and transitions designed to mirror the speed and engineering precision of F1 racing.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1533130061792-64b345e4e837?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f1103 0%, #2e1a06 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Fan Rewards</h4>
                                                                <p className="dv-screen-desc text-white-80">Interactive tokens and exclusive digital rewards that fans unlock during live qualifying sessions.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1502640134017-9195b8665099?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
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
                                                        <span className="dv-heading-bold">Feel</span>{" "}
                                                        <em className="dv-heading-italic">the Velocity</em>
                                                    </h2>

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
                                                        Fueling fan growth and race weekend interaction at speed:
                                                    </p>

                                                    <div className="dv-impact-grid dv-mt-40">
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Fan Registrations</h4>
                                                            <p className="dv-impact-text">Launched the new McLaren Plus platform, resulting in a 50% increase in active fan registrations.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Weekend Engagement</h4>
                                                            <p className="dv-impact-text">Real-time interactive telemetry and predictions generated record-breaking race-day engagement.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">App Store Rating</h4>
                                                            <p className="dv-impact-text">Re-engineered UI architecture and sub-100ms timing updates drove app ratings up by 1.2 stars.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Next/Previous Projects Section */}
                                        <div data-theme="light" className="w-full bg-white border-t border-black/10 flex flex-col sm:flex-row">
                                            <Link href="/projects/xtep" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 border-b sm:border-b-0 sm:border-r border-black/10 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Xtep</h3>
                                                </div>
                                            </Link>

                                            <Link href="/projects/flytbase" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col items-end justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Next Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:translate-x-2 transition-all duration-500 leading-none pb-1">Flytbase</h3>
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

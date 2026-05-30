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
import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import "./../nebula/nebula.css";

gsap.registerPlugin(ScrollTrigger);

// Custom Background Colors for Akshara Events
const PAGE_COLORS = {
    uColor1: [0.9, 0.8, 0.6],     // Gold
    uColor2: [0.1, 0.1, 0.1],     // Dark contrast
    uColor3: [0.95, 0.9, 0.8],    // Cream / Silk
    uColor4: [0.4, 0.3, 0.2],     // Earthy Bronze
    uColor5: [0.9, 0.8, 0.6],
    uColor6: [0.1, 0.1, 0.1]
};

const projectImages = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200",
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200",
];

export default function AksharaEventsPage() {
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
                                        title={<>Akshara Events: Designing<br />Moments into Everlasting<br />Memories</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="Akshara Events is a luxury event management company specializing in high-end weddings, corporate galas, and bespoke celebrations."
                                        scopeOfWork={["Identity Design", "Digital Portfolio", "Social Strategy", "Brand Positioning"]}
                                        media={projectImages[0]}
                                        mediaType="image"
                                        scrollHeightVh={140}
                                        smoothScroll={false}
                                        targetSize="fullscreen"
                                        overlay={{
                                            caption: "/01 BRIEF",
                                            heading: "The Art of Celebration",
                                            paragraphs: [
                                                "Akshara needed a brand repositioning to attract a high-net-worth clientele. Their previous digital presence felt too traditional and lacked the 'editorial' feel found in top luxury magazines.",
                                                "We crafted a visual identity that balances timeless elegance with contemporary sophistication, using a curated silk-inspired color palette and minimalist typography."
                                            ]
                                        }}
                                    />
                                </div>

                                {/* Project Details Reference Section */}
                                <div className="w-full relative">
                                    <div className="absolute inset-0 bg-black/[0.15] pointer-events-none" />
                                    <section className="w-full relative z-10 text-[#e5e5e5] py-20 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto font-sans" data-theme="dark">
                                        {/* Top Row: Role & Timeline */}
                                        <div className="flex flex-col md:flex-row justify-between w-full mb-16 md:mb-24">
                                            <div className="w-full md:w-[65%] mb-8 md:mb-0">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Role</h3>
                                                <p className="text-sm md:text-base font-medium text-white">Lead Experience Designer</p>
                                            </div>
                                            <div className="w-full md:w-[30%]">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Timeline</h3>
                                                <p className="text-sm md:text-base font-medium text-white">3 Months</p>
                                            </div>
                                        </div>

                                        {/* Main Details 2-Col Grid */}
                                        <div className="flex flex-col md:flex-row justify-between w-full">
                                            {/* Left Column */}
                                            <div className="w-full md:w-[65%] flex flex-col gap-12 md:gap-16 pr-0 md:pr-12">
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Overview</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        A premium digital portfolio that serves as a high-end editorial showcase for the company's most prestigious event productions.
                                                     </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        Position Akshara as the premier choice for luxury celebrations through a refined visual language and a seamless storytelling experience.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                                                        <li>Balancing high-end imagery with rapid page load speeds</li>
                                                        <li>Creating a typography stack that feels both luxury and modern</li>
                                                        <li>Designing a subtle, elegant motion system for transitions</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                                                        Successfully repositioned the brand, leading to a 40% increase in high-value wedding inquiries in the first quarter post-launch.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Competitor Audit</li>
                                                        <li>Visual Identity Strategy</li>
                                                        <li>Editorial Layout Design</li>
                                                        <li>GSAP Interaction Build</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools & Technologies</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Figma</li>
                                                        <li>Adobe InDesign</li>
                                                        <li>Swell</li>
                                                        <li>Next.js</li>
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

                                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                                    <div className="white-canvas-content w-full bg-white transition-colors duration-300 ease-out rounded-[40px] md:rounded-[80px] shadow-2xl origin-center" data-theme="light">
                                        <div className="dv-embed">
                                            {/* ── PROBLEM STATEMENT ── */}
                                            <section className="dv-section dv-problem-section" style={{ textAlign: 'left', padding: '80px 0' }}>
                                                <div className="dv-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                                        <div style={{ width: '8px', height: '8px', backgroundColor: '#d4af37', borderRadius: '2px' }}></div>
                                                        <span style={{ color: '#7a829a', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>THE BRIEF</span>
                                                    </div>

                                                    <h2 className="dv-left" style={{ fontSize: '3.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                                                        The Art of Celebration
                                                    </h2>

                                                    <p className="dv-body" style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                                                        <strong>Akshara needed a brand repositioning to attract a high-net-worth clientele. Their previous digital presence felt too traditional and lacked the 'editorial' feel found in top luxury magazines:</strong>
                                                    </p>

                                                    <ol style={{ paddingLeft: '0', listStyleType: 'none', color: '#6b7280', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '32px' }}>
                                                        <li>1. Balancing high-end imagery with rapid page load speeds</li>
                                                        <li>2. Creating a typography stack that feels both luxury and modern</li>
                                                        <li>3. Designing a subtle, elegant motion system for transitions</li>
                                                        <li>4. Editorial layouts highlighting prestigious event productions</li>
                                                        <li>5. Establishing clear brand positioning for bespoke celebrations</li>
                                                    </ol>
                                                </div>
                                            </section>

                                            {/* ── VISUAL DIRECTION ── */}
                                            <section className="dv-section dv-research-carousel-section">
                                                <div className="dv-container">
                                                    <h2 className="dv-mixed-heading">
                                                        <span className="dv-heading-bold">Editorial</span>{" "}
                                                        <em className="dv-heading-italic">Direction</em>
                                                    </h2>
                                                    <p className="dv-subheading">
                                                        We took an editorial approach to the design, treating every pixel as if it were a high-end print publication:
                                                    </p>

                                                    <div className="dv-dark-cards-carousel dv-mt-24">
                                                        <div className="dv-dark-cards-track">
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Editorial Intent</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Curating the story through a high-fashion, minimalist lens. Focus on narrative flow and large scale imagery.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Color Palette</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Curated silk-inspired gold and cream tones that convey luxury, warmth, and prestige.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Typography</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Bespoke serif pairings that feel both timeless, high-fashion and modern at the same time.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Visual Rhythm</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Creating a sense of flow and editorial pacing through deliberate, generous use of white space.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Final Review</h3>
                                                                <p className="dv-dark-card-body">
                                                                    A polished, high-fidelity experience built to appeal to high-net-worth individuals and corporate partners.
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
                                                        Through structured audits, design iteration, and motion studies, we designed a digital portal to serve as Akshara's premium flag-bearer.
                                                    </p>

                                                    <div className="dv-method-cards-grid dv-mt-40">
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Competitor Audit</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Analyzed the digital portfolios of luxury global hospitality and event firms to outline design expectations and target benchmarks.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Editorial Strategy</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Crafted layout guidelines inspired by top print magazines, focusing on asymmetrical alignments and strong typography hierarchies.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>GSAP Interaction Build</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Implemented smooth web scrolling, parallax panels, and liquid transitions to match the grace of live luxury celebrations.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── THE CANVAS SHOWCASE ── */}
                                            <section className="dv-section dv-intro-section">
                                                <div className="dv-container dv-text-center">
                                                    <h2 className="dv-mixed-heading">
                                                        <span className="dv-heading-bold">Introducing</span>{" "}
                                                        <em className="dv-heading-italic">the Digital Space</em>
                                                    </h2>
                                                    <p className="dv-subheading">
                                                        The resulting portfolio balances beautiful photography with rapid load speeds and editorial motion transitions.
                                                    </p>
                                                </div>

                                                <div className="dv-container dv-mt-40">
                                                    <div className="dv-bento-grid">
                                                        <div className="dv-bento-card" style={{ padding: 0, gridColumn: 'span 2', gridRow: 'span 2' }}>
                                                            <img src="/Aksharaevents.png" alt="Akshara Events Presentation Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <div className="dv-bento-card" style={{ padding: 0, gridColumn: 'span 1', gridRow: 'span 2' }}>
                                                            <img src="/Aksharaevents2.png" alt="Akshara Mobile Layout Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── DETAILED PORTFOLIO SECTIONS ── */}
                                            <section className="dv-section dv-screens-section" style={{ paddingTop: '120px' }}>
                                                <div className="dv-container">
                                                    <h2 className="dv-mixed-heading dv-text-center dv-mb-64">
                                                        <span className="dv-heading-bold">Production</span>{" "}
                                                        <em className="dv-heading-italic">Showcase</em>
                                                    </h2>

                                                    {/* Feature 1 */}
                                                    <div className="dv-feature-card dv-mb-40">
                                                        <div className="dv-feature-text dv-feature-light-gray">
                                                            <h3 className="dv-feature-heading dv-left">Silk Reflections</h3>
                                                            <p className="dv-subheading dv-left">Soft textures and warm lighting define the visual foundation of Akshara. Every design detail was crafted to communicate luxury, authenticity, and refined grace.</p>
                                                        </div>
                                                        <div className="dv-feature-visual dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}>
                                                            <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 2 & 3 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-40">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Grand Galas</h4>
                                                                <p className="dv-screen-desc text-white-80">Showcasing the massive scale, choreography, and artistic ambition of Akshara's event productions.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Intimate Settings</h4>
                                                                <p className="dv-screen-desc text-white-80">Capturing the subtle floral arrangements, custom placements, and warm detail elements that make celebrations unforgettable.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 4 & 5 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-24">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Modern Luxury</h4>
                                                                <p className="dv-screen-desc text-white-80">Using high-performance web interactions and smooth layout shifts to elevate the brand's digital story.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Everlasting Memory</h4>
                                                                <p className="dv-screen-desc text-white-80">A robust, scalable digital gallery built to reflect a legacy of bespoke event curation.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1532417344469-368f9ae6d187?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
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
                                                        Designed to establish clear market authority and attract high-value clients:
                                                    </p>

                                                    <div className="dv-impact-grid dv-mt-40">
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Editorial Authority</h4>
                                                            <p className="dv-impact-text">Repositioning the brand's visual identity to resemble a high-end publication commands immediate respect and sets them apart from mid-tier competitors.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Increased Booking Value</h4>
                                                            <p className="dv-impact-text">By shifting the digital focus to bespoke, luxury celebrations, the platform attracts premium clientele, helping to increase booking inquiries.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Editorial Conversion</h4>
                                                            <p className="dv-impact-text">Replacing traditional booking forms with structured narrative stories builds emotional trust, leading to better conversion of inquiries.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Next/Previous Projects Section */}
                                        <div data-theme="light" className="w-full bg-white border-t border-black/10 flex flex-col sm:flex-row">
                                            <Link href="/projects/envision-vfx" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 border-b sm:border-b-0 sm:border-r border-black/10 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Envision</h3>
                                                </div>
                                            </Link>

                                            <Link href="/projects/nebula" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col items-end justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Next Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:translate-x-2 transition-all duration-500 leading-none pb-1">Nebula</h3>
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

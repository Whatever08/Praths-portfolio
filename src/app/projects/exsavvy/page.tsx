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
import ComingSoonGuard from "@/components/ui/ComingSoonGuard";

gsap.registerPlugin(ScrollTrigger);

// Custom Background Colors for Exsavvy
const PAGE_COLORS = {
    uColor1: [0.0, 0.8, 0.6],     // Teal / Mint
    uColor2: [0.1, 0.2, 0.5],     // Deep Ocean Blue
    uColor3: [0.4, 1.0, 0.8],     // Bright Cyan
    uColor4: [0.05, 0.05, 0.05],  // Dark charcoal
    uColor5: [0.0, 0.8, 0.6],
    uColor6: [0.1, 0.2, 0.5]
};

const projectImages = [
    "/generated/exsavvy_vision.png",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
];

export default function ExsavvyPage() {
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
            <ComingSoonGuard />
            <LiquidBackground colors={PAGE_COLORS}>
                <>
                    {showReveal && (
                        <SvgSteppedReveal
                            variant="uncover"
                            direction="left"
                            onComplete={() => setShowReveal(false)}
                        />
                    )}
                    {showRevealIn && (
                        <SvgSteppedReveal
                            variant="cover"
                            direction="right"
                        />
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
                                        title={<>Exsavvy: Intelligent Data<br />Visualization for Modern<br />Enterprises</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="Exsavvy is a data analytics platform that helps businesses turn complex raw data into actionable insights through beautifully crafted, interactive dashboards."
                                        scopeOfWork={["Dashboard Design", "Data Viz", "SaaS Strategy", "Enterprise UX"]}
                                        media={projectImages[0]}
                                        mediaType="image"
                                        scrollHeightVh={140}
                                        smoothScroll={false}
                                        targetSize="fullscreen"
                                        overlay={{
                                            caption: "/01 BRIEF",
                                            heading: "Seeing the Unseen",
                                            paragraphs: [
                                                "Modern companies are drowning in data but starving for insights. Exsavvy's mission was to simplify the complex and make data exploration an effortless experience.",
                                                "We designed a system that prioritizes clarity over clutter, using intelligent filtering and predictive charting to guide users to what matters most."
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
                                                <p className="text-sm md:text-base font-medium text-white">Full-Stack Designer</p>
                                            </div>
                                            <div className="w-full md:w-[30%]">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Timeline</h3>
                                                <p className="text-sm md:text-base font-medium text-white">5 Months</p>
                                            </div>
                                        </div>

                                        {/* Main Details 2-Col Grid */}
                                        <div className="flex flex-col md:flex-row justify-between w-full">
                                            {/* Left Column */}
                                            <div className="w-full md:w-[65%] flex flex-col gap-12 md:gap-16 pr-0 md:pr-12">
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Overview</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        A robust enterprise platform designed to handle multi-layered datasets while maintaining a minimalist, high-performance interface.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        Enable executive teams to make data-driven decisions through real-time visualization and collaborative reporting tools.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                                                        <li>Displaying large-scale data without overwhelming the user</li>
                                                        <li>Ensuring high performance with real-time SVG rendering</li>
                                                        <li>Designing flexible widgets for varied data types</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                                                        Delivered a comprehensive design system that reduced reporting time by 60% for enterprise clients.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>User Flow Mapping</li>
                                                        <li>Data Architecture Audit</li>
                                                        <li>High-Fidelity Prototyping</li>
                                                        <li>System Testing</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools & Technologies</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Figma</li>
                                                        <li>D3.js</li>
                                                        <li>React</li>
                                                        <li>Tailwind CSS</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">View Website</h3>
                                                    <button className="px-8 py-2.5 rounded-full border border-white/40 text-white text-sm hover:bg-white hover:text-black transition-colors font-medium">
                                                        Launch App
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
                                                        <div style={{ width: '8px', height: '8px', backgroundColor: '#00cc99', borderRadius: '2px' }}></div>
                                                        <span style={{ color: '#7a829a', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>THE BRIEF</span>
                                                    </div>

                                                    <h2 className="dv-left" style={{ fontSize: '3.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                                                        Seeing the Unseen
                                                    </h2>

                                                    <p className="dv-body" style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                                                        <strong>Modern companies are drowning in data but starving for insights. Exsavvy's mission was to simplify the complex and make data exploration effortless. They face key challenges:</strong>
                                                    </p>

                                                    <ol style={{ paddingLeft: '0', listStyleType: 'none', color: '#6b7280', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '32px' }}>
                                                        <li>1. Displaying large-scale multi-layered data without overwhelming the user</li>
                                                        <li>2. Ensuring high performance with real-time SVG charting and rendering</li>
                                                        <li>3. Designing flexible, modular widgets for varied database schemas</li>
                                                        <li>4. Facilitating real-time collaboration and annotation between teams</li>
                                                        <li>5. Preserving data integrity and hierarchy across mobile viewports</li>
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
                                                        Designing for SaaS requires a delicate balance of feature density and white space. We found the sweet spot for Exsavvy:
                                                    </p>

                                                    <div className="dv-dark-cards-carousel dv-mt-24">
                                                        <div className="dv-dark-cards-track">
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)' }}>
                                                                <h3 className="dv-dark-card-title">UX Audit</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Streamlining the workflow from raw data import to customized report generation for fast operations.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Data Viz</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Interactive charts designed for maximum legibility, clear trendlines, and granular depth.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Collaboration</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Real-time annotation and sharing tools designed for distributed enterprise teams.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Mobile Dash</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Adaptive layouts that preserve heavy data integrity on smaller touch devices.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Design System</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Building a library of reusable widgets, color rules, and data components for scale.
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
                                                        Through structured audits, design iteration, and system tests, we designed a dashboard that turns complex analytics into simple insights.
                                                    </p>

                                                    <div className="dv-method-cards-grid dv-mt-40">
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>User Flow Mapping</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Designing paths for standard and power users to query databases and generate complex formulas intuitively.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Data Architecture</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Analyzing enterprise dataset shapes to design flexible charting modules and responsive widget containers.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>System Testing</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Stress-testing SVG and Canvas charting rendering performance under high concurrent data streams.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── THE CANVAS SHOWCASE ── */}
                                            <section className="dv-section dv-intro-section">
                                                <div className="dv-container dv-text-center">
                                                    <h2 className="dv-mixed-heading">
                                                        <span className="dv-heading-bold">Introducing</span>{" "}
                                                        <em className="dv-heading-italic">the Workspace</em>
                                                    </h2>
                                                    <p className="dv-subheading">
                                                        A robust enterprise platform designed to handle multi-layered datasets while maintaining a minimalist interface.
                                                    </p>
                                                </div>

                                                <div className="dv-container dv-mt-40">
                                                    <div className="dv-bento-grid">
                                                        <div className="dv-bento-card" style={{ padding: 0, gridColumn: 'span 2', gridRow: 'span 2' }}>
                                                            <img src="/Exsavvy.png" alt="Exsavvy Presentation Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <div className="dv-bento-card" style={{ padding: 0, gridColumn: 'span 1', gridRow: 'span 2' }}>
                                                            <img src="/Exsavvy2.png" alt="Exsavvy Mobile Layout Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                                            <h3 className="dv-feature-heading dv-left">Abstracted Data</h3>
                                                            <p className="dv-subheading dv-left">Finding the balance between raw database information and meaningful visual narratives. Making high-density charts accessible.</p>
                                                        </div>
                                                        <div className="dv-feature-visual dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)' }}>
                                                            <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 2 & 3 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-40">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Precision UX</h4>
                                                                <p className="dv-screen-desc text-white-80">Every pixel served a purpose—helping users filter, query, and navigate mountains of enterprise metrics with ease.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Enterprise Logic</h4>
                                                                <p className="dv-screen-desc text-white-80">Designing the underlying UX architecture for complex permission levels, multi-tenant roles, and security logs.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1504868584819-f8e905b6dc79?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 4 & 5 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-24">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Team Workflows</h4>
                                                                <p className="dv-screen-desc text-white-80">Enabling analysts and project managers to communicate directly inside dashboard widgets with live annotations.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1454165833267-020583d0469b?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #021a14 0%, #052636 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Final Build</h4>
                                                                <p className="dv-screen-desc text-white-80">A high-performance SaaS analytics ecosystem delivered with full interactive component libraries.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
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
                                                        Designed to drive decision velocity and workflow efficiency:
                                                    </p>

                                                    <div className="dv-impact-grid dv-mt-40">
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Reporting Time Saved</h4>
                                                            <p className="dv-impact-text">Delivered a comprehensive design system that reduced weekly reporting time by 60% for enterprise clients.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Increased Active Users</h4>
                                                            <p className="dv-impact-text">Clear visual hierarchies and interactive widgets led to a 45% increase in daily active user engagement within three months.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Decision Velocity</h4>
                                                            <p className="dv-impact-text">Enables executive teams to align and make complex data-driven decisions faster through real-time team collaboration.</p>
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

                                            <Link href="/projects/mclaren-racing" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col items-end justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Next Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:translate-x-2 transition-all duration-500 leading-none pb-1">McLaren</h3>
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

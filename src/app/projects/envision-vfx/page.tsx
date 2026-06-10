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

// Custom Background Colors for Envision VFX
const PAGE_COLORS = {
    uColor1: [0.5, 0.0, 0.8],     // Cinema Purple
    uColor2: [0.0, 0.0, 0.0],     // Deep Black
    uColor3: [0.8, 0.4, 0.1],     // Gold / Sunset
    uColor4: [0.1, 0.1, 0.2],     // Midnight Blue
    uColor5: [0.5, 0.0, 0.8],
    uColor6: [0.0, 0.0, 0.0]
};

const projectImages = [
    "/generated/envision_vfx_vision.png",
    "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e53acb?q=80&w=1200",
];

export default function EnvisionVFXPage() {
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
                                        title={<>Envision VFX: Redefining<br />Visual Storytelling through<br />Immersive CGI</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="Envision VFX is a premier visual effects studio that brings cinematic dreams to life through world-class CGI, motion graphics, and post-production."
                                        scopeOfWork={["Website Design", "Showreel Integration", "Art Direction", "Motion Systems"]}
                                        media={projectImages[0]}
                                        mediaType="image"
                                        scrollHeightVh={140}
                                        smoothScroll={false}
                                        targetSize="fullscreen"
                                        overlay={{
                                            caption: "/01 BRIEF",
                                            heading: "Beyond the Screen",
                                            paragraphs: [
                                                "VFX studios are visual powerhouses, but their own digital presence often fails to showcase the depth of their technical craft.",
                                                "We built a website that acts as a canvas for Envision—utilizing large-scale cinematic reveals and subtle parallax effects to mirror the magic they create for the big screen."
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
                                                <p className="text-sm md:text-base font-medium text-white">Lead Designer / Developer</p>
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
                                                        A cinematic portfolio experience designed to showcase high-fidelity VFX work through seamless video transitions and interactive showreels.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        Create a distinctive digital identity that positions Envision as a leader in high-end CGI and motion storytelling.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                                                        <li>Integrating high-bitrate video assets without sacrificing speed</li>
                                                        <li>Creating a dark-mode first design that feels cinematic</li>
                                                        <li>Designing for high-resolution displays used by industry pros</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                                                        Delivered a premium digital presence that successfully increased inbound inquiries from major production houses by 35%.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Visual Research</li>
                                                        <li>Showreel Curation</li>
                                                        <li>Interactive Prototyping</li>
                                                        <li>High-Fidelity Build</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools & Technologies</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Figma</li>
                                                        <li>After Effects</li>
                                                        <li>Cinema 4D</li>
                                                        <li>WebGL / Next.js</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">View Website</h3>
                                                    <button className="px-8 py-2.5 rounded-full border border-white/40 text-white text-sm hover:bg-white hover:text-black transition-colors font-medium">
                                                        View Showreel
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
                                                        <div style={{ width: '8px', height: '8px', backgroundColor: '#8000ff', borderRadius: '2px' }}></div>
                                                        <span style={{ color: '#7a829a', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>THE BRIEF</span>
                                                    </div>

                                                    <h2 className="dv-left" style={{ fontSize: '3.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                                                        Beyond the Screen
                                                    </h2>

                                                    <p className="dv-body" style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                                                        <strong>VFX studios are visual powerhouses, but their own digital presence often fails to showcase the depth of their technical craft. They face key challenges:</strong>
                                                    </p>

                                                    <ol style={{ paddingLeft: '0', listStyleType: 'none', color: '#6b7280', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '32px' }}>
                                                        <li>1. Integrating high-bitrate showreel assets without losing performance</li>
                                                        <li>2. Designing a dark-mode first interface that feels cinematic</li>
                                                        <li>3. High-resolution responsiveness for industry professionals</li>
                                                        <li>4. Blending raw CGI wireframes with refined typography layout</li>
                                                        <li>5. Delivering smooth motion transitions that mirror camera paths</li>
                                                    </ol>
                                                </div>
                                            </section>

                                            {/* ── VISUAL DIRECTION ── */}
                                            <section className="dv-section dv-research-carousel-section">
                                                <div className="dv-container">
                                                    <h2 className="dv-mixed-heading">
                                                        <span className="dv-heading-bold">Cinematic</span>{" "}
                                                        <em className="dv-heading-italic">Direction</em>
                                                    </h2>
                                                    <p className="dv-subheading">
                                                        We approached the Envision project with the same level of detail expected in a Hollywood blockbuster:
                                                    </p>

                                                    <div className="dv-dark-cards-carousel dv-mt-24">
                                                        <div className="dv-dark-cards-track">
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Visual Research</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Exploring textures, lighting, and composition for the digital stage to create maximum emotional resonance.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Art Direction</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Crafting a moody, high-contrast aesthetic that puts the visual work center stage without distractions.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)' }}>
                                                                <h3 className="dv-dark-card-title">CGI Integration</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Blending raw technical renders with a refined, minimalist user interface that highlights the craft.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Motion Library</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Custom interface transitions that mirror physical cinematic camera movements and focal changes.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Final Handover</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Delivering a high-performance, robust portfolio ready for any screen size, compressed with WebM.
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
                                                        Through close visual audits, showreel compression pipelines, and WebGL integrations, we elevated Envision's portfolio layout.
                                                    </p>

                                                    <div className="dv-method-cards-grid dv-mt-40">
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Visual Research</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Curating moodboards and tone palettes to mirror cinematic film grades and post-processing styles.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Showreel Curation</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Compiling and optimizing high-fidelity 4K video clips to load in under a second on mobile platforms.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>WebGL Prototyping</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Developing smooth three-dimensional viewport transitions to guide users seamlessly through their projects.</p>
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
                                                        The resulting site functions as a canvas—utilizing large cinematic reveals and fluid parallax effects.
                                                    </p>
                                                </div>

                                                <div className="dv-container dv-mt-40">
                                                    <div className="dv-bento-grid">
                                                        <div className="dv-bento-card" style={{ padding: 0, gridColumn: 'span 2', gridRow: 'span 2' }}>
                                                            <img src="/VFX.png" alt="Envision VFX Presentation Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        <div className="dv-bento-card" style={{ padding: 0, gridColumn: 'span 1', gridRow: 'span 2' }}>
                                                            <img src="/VFX2.png" alt="Envision VFX Mobile Layout Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                                            <h3 className="dv-feature-heading dv-left">Cinematic Flow</h3>
                                                            <p className="dv-subheading dv-left">High-contrast visuals designed to make colors pop and shadows feel deep and meaningful. Perfect showcase for modern film production.</p>
                                                        </div>
                                                        <div className="dv-feature-visual dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)' }}>
                                                            <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                <img src="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 2 & 3 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-40">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">CGI Mastery</h4>
                                                                <p className="dv-screen-desc text-white-80">Showcasing the technical complexity and wireframe structures behind every frame of Envision's CGI work.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e53acb?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Visual Depth</h4>
                                                                <p className="dv-screen-desc text-white-80">Using selective focus and depth-of-field effects to direct user focus on key scene objects.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 4 & 5 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-24">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Motion Craft</h4>
                                                                <p className="dv-screen-desc text-white-80">Creating dynamic moments of interaction through smooth camera transitions on the web browser.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #090016 0%, #15002b 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Live Production</h4>
                                                                <p className="dv-screen-desc text-white-80">A high-performance digital gallery built as a staging ground for Envision's global cinematic releases.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1535016120720-40c646bebbdc?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
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
                                                        Designed to establish visual authority and drive production partnerships:
                                                    </p>

                                                    <div className="dv-impact-grid dv-mt-40">
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Production Inquiries</h4>
                                                            <p className="dv-impact-text">Delivering a premium digital presence that successfully increased inbound inquiries from major production houses by 35%.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Brand Authority</h4>
                                                            <p className="dv-impact-text">Positioned the studio as a high-fidelity CGI leader, elevating their credibility in global advertising and cinema markets.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Media Performance</h4>
                                                            <p className="dv-impact-text">Optimized web pipelines ensure heavy cinematic reels play fluidly with minimal buffering or browser load delays.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Next/Previous Projects Section */}
                                        <div data-theme="light" className="w-full bg-white border-t border-black/10 flex flex-col sm:flex-row">
                                            <Link href="/projects/flytbase" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 border-b sm:border-b-0 sm:border-r border-black/10 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Flytbase</h3>
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

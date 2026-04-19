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
import Link from "next/link";

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
    const [showReveal, setShowReveal] = useState(true);
    const [showRevealIn, setShowRevealIn] = useState(false);

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

        // Parallax scroll for stacked image panels
        gsap.utils.toArray<HTMLElement>(".parallax-panel").forEach((panel, i) => {
            const imgWrap = panel.querySelector(`[class*='parallax-img-${i}']`) as HTMLElement;
            if (!imgWrap) return;
            gsap.to(imgWrap, {
                y: "20%",
                ease: "none",
                scrollTrigger: {
                    trigger: panel,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            });
        });

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

                        <ReactLenis root options={{
                            duration: 1.4,
                            lerp: 0.05,
                            wheelMultiplier: 1.1,
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

                                <div className="white-canvas-container w-full overflow-visible relative z-20">
                                    <div className="white-canvas-content w-full bg-white transition-all duration-300 ease-out rounded-[40px] md:rounded-[80px] shadow-2xl origin-center">

                                        {/* Carousel Slider — HorizontalScrollGallery */}
                                        <div data-theme="light" className="w-full bg-white">
                                            <HorizontalScrollGallery
                                                heading={<>Crafting luxury experiences.</>}
                                                description="We took an editorial approach to the design, treating every pixel as if it were a high-end print publication."
                                                items={[
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200', alt: 'Akshara 1', title: 'Editorial Intent', description: 'Curating the story through a high-fashion, minimalist lens.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200', alt: 'Akshara 2', title: 'Color Palette', description: 'Curated silk-inspired tones that convey luxury and warmth.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200', alt: 'Akshara 3', title: 'Typography', description: 'Bespoke serif pairings that feel both timeless and modern.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200', alt: 'Akshara 4', title: 'Visual Rhythm', description: 'Creating a sense of flow through deliberate use of white space.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1532417344469-368f9ae6d187?q=80&w=1200', alt: 'Akshara 5', title: 'Final Review', description: 'A polished, high-fidelity experience ready for the global stage.' },
                                                ]}
                                            />
                                        </div>

                                        {/* ── STACKED PARALLAX IMAGE GALLERY ─────────────────── */}
                                        <div data-theme="light" className="w-full">
                                            {[
                                                {
                                                    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600",
                                                    label: "Silk Reflections",
                                                    caption: "01 / Identity",
                                                    body: "Soft textures and warm lighting define the visual foundation of Akshara."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600",
                                                    label: "Grand Galas",
                                                    caption: "02 / Portfolio",
                                                    body: "Showcasing the scale and ambition of Akshara's event productions."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600",
                                                    label: "Intimate Settings",
                                                    caption: "03 / Detail",
                                                    body: "Capturing the subtle moments that make an event truly unforgettable."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600",
                                                    label: "Modern Luxury",
                                                    caption: "04 / Motion",
                                                    body: "Using high-performance interactions to elevate the brand's digital story."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1532417344469-368f9ae6d187?q=80&w=1600",
                                                    label: "Everlasting Memory",
                                                    caption: "05 / Legacy",
                                                    body: "A robust digital home built to reflect a legacy of celebration."
                                                },
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="parallax-panel relative w-full overflow-hidden"
                                                    style={{ height: "100vh" }}
                                                >
                                                    <div
                                                        className={`parallax-img-${i} absolute inset-0 w-full`}
                                                        style={{ height: "130%", top: "-15%" }}
                                                    >
                                                        <img
                                                            src={item.src}
                                                            alt={item.label}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/60" />
                                                    </div>

                                                    <div className="absolute top-16 md:top-24 left-0 w-full z-10 flex flex-col items-center text-center px-6 md:px-12 text-white">
                                                        <div className="max-w-4xl">
                                                            <div className="text-[11px] md:text-sm uppercase tracking-[0.25em] font-medium text-white/70 mb-3">
                                                                {item.caption}
                                                            </div>
                                                            <div className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
                                                                {item.label}
                                                            </div>
                                                            <p className="text-sm md:text-lg text-white/80 leading-relaxed font-medium">
                                                                {item.body}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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

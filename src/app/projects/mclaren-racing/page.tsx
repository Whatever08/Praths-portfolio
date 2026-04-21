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

export default function McLarenPage() {
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

                        <ReactLenis root options={{
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
                                        {/* Top Row: Role & Timeline */}
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

                                        {/* Main Details 2-Col Grid */}
                                        <div className="flex flex-col md:flex-row justify-between w-full">
                                            {/* Left Column */}
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

                                            {/* Right Column */}
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

                                <div className="white-canvas-container w-full overflow-visible relative z-20">
                                    <div className="white-canvas-content w-full bg-white transition-all duration-300 ease-out rounded-[40px] md:rounded-[80px] shadow-2xl origin-center">

                                        {/* Carousel Slider — HorizontalScrollGallery */}
                                        <div data-theme="light" className="w-full bg-white">
                                            <HorizontalScrollGallery
                                                heading={<>Precision at every turn.</>}
                                                description="Just like an F1 car, every element of our design was optimized for performance, weight, and speed."
                                                items={[
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c15d?q=80&w=1200', alt: 'McLaren 1', title: 'Data Viz', description: 'Turning millions of data points into intuitive fan telemetry.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1200', alt: 'McLaren 2', title: 'Pit Wall UI', description: 'Bringing the strategy room experience to the fan platform.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1504244723920-80436d4003c2?q=80&w=1200', alt: 'McLaren 3', title: 'Interactive Track', description: 'Explore race statistics through a 3D interactive map.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1533130061792-64b345e4e837?q=80&w=1200', alt: 'McLaren 4', title: 'Fan Hub', description: 'A personalized space for fans to engage with the team.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1502640134017-9195b8665099?q=80&w=1200', alt: 'McLaren 5', title: 'Carbon System', description: 'A dark-mode design system inspired by carbon fiber textures.' },
                                                ]}
                                            />
                                        </div>

                                        {/* ── STACKED PARALLAX IMAGE GALLERY ─────────────────── */}
                                        <div data-theme="dark" className="w-full">
                                            {[
                                                {
                                                    src: "https://images.unsplash.com/photo-1541899481282-d53bffe3c15d?q=80&w=1600",
                                                    label: "Aero Design",
                                                    caption: "01 / Visuals",
                                                    body: "Fluid UI components that follow the aerodynamic lines of the MCL60."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1600",
                                                    label: "Telemetry Hub",
                                                    caption: "02 / Strategy",
                                                    body: "Bridging the gap between pure engineering and fan excitement."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1504244723920-80436d4003c2?q=80&w=1600",
                                                    label: "Live Interaction",
                                                    caption: "03 / Engagement",
                                                    body: "Real-time updates that keep fans at the center of the action."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1533130061792-64b345e4e837?q=80&w=1600",
                                                    label: "Brand Speed",
                                                    caption: "04 / Motion",
                                                    body: "Animations carefully clocked to match the high-speed nature of F1."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1502640134017-9195b8665099?q=80&w=1600",
                                                    label: "Final Lap",
                                                    caption: "05 / Delivery",
                                                    body: "A robust, high-performance platform delivered for a global fan base."
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
                                            <Link href="/projects/exsavvy" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 border-b sm:border-b-0 sm:border-r border-black/10 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Exsavvy</h3>
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

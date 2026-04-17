"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { HeroScrollVideo } from "@/components/ui/scroll-animated-video";
import { Icon } from "@iconify/react";

gsap.registerPlugin(ScrollTrigger);

const projectImages = [
    "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
];

export default function ProjectPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const themeSections = gsap.utils.toArray<HTMLElement>("[data-theme]");

        // Logo & Nav inversion logic based on section theme
        const updateHeaderTheme = (theme: string | null) => {
            const isLight = theme === "light";
            gsap.to([".project-logo", ".nav-link"], {
                filter: isLight ? "brightness(0)" : "brightness(1)",
                color: isLight ? "#000000" : "#ffffff",
                duration: 0.4,
                ease: "power2.inOut",
                overwrite: true
            });
        };

        // International header sync
        const initHeader = () => {
            ScrollTrigger.refresh();
        };

        // Create triggers for every themed section
        themeSections.forEach((section) => {
            const theme = section.getAttribute("data-theme");
            ScrollTrigger.create({
                trigger: section,
                start: "top 80px",
                end: "bottom 80px",
                onToggle: (self) => {
                    if (self.isActive) updateHeaderTheme(theme);
                },
                onRefresh: (self) => {
                    if (self.isActive) updateHeaderTheme(theme);
                }
            });
        });

        // Background transition from black to white (Liquid to Solid White)
        gsap.to(".project-bg-overlay", {
            opacity: 1,
            scrollTrigger: {
                trigger: ".reveal-grid-section",
                start: "top bottom",
                end: "top 20%",
                scrub: true,
            }
        });

        // Section header reveal animations
        gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
            gsap.from(section.querySelectorAll(".reveal-item"), {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Final refresh and sync once everything is settled
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
            initHeader();
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, { scope: containerRef });

    return (
        <LiquidBackground colors={{
            uColor1: [0.5, 0.2, 0.8], // Purple
            uColor2: [0.1, 0.4, 0.9], // Blue
            uColor3: [0.2, 0.8, 0.4], // Green
            uColor4: [0.05, 0.05, 0.05], // White (5%)
            uColor5: [0.5, 0.2, 0.8],
            uColor6: [0.1, 0.4, 0.9]
        }}>
            <div ref={containerRef} className="relative z-10 w-full text-white selection:bg-white/20">
                {/* CSS Fallback to ensure white header on load before GSAP boots */}
                <style jsx global>{`
                    .nav-link { color: white; }
                    .project-logo { filter: brightness(1); }
                `}</style>

                {/* Fixed White Overlay for transition */}
                <div className="project-bg-overlay fixed inset-0 bg-white opacity-0 pointer-events-none z-[-1]" />

                {/* Header Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-8 bg-transparent text-white">
                    {/* Left: Back to work */}
                    <div className="w-1/4">
                        <Link href="/" className="nav-link text-xs font-bold tracking-widest uppercase hover:opacity-60 transition-opacity text-white flex items-center gap-2">
                            <Icon icon="solar:arrow-left-linear" className="text-sm" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Center: Links & Logo */}
                    <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 text-[13px] font-medium text-white pointer-events-auto w-2/4">
                        <button className="nav-link hover:text-white/60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap">Recent Works</button>
                        <button className="nav-link hover:text-white/60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap">About me</button>
                        <button className="nav-link hover:text-white/60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap">Process</button>

                        {/* Logo */}
                        <Link href="/" className="relative h-8 mx-2 lg:mx-4 flex items-center drop-shadow-md cursor-pointer">
                            <img
                                src="/logo.png"
                                alt="TP Logo"
                                className="project-logo h-full w-auto object-contain"
                                style={{ filter: 'brightness(1)' }}
                            />
                        </Link>

                        <button className="nav-link hover:text-white/60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap">Case studies</button>
                        <button className="nav-link hover:text-white/60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap">Services</button>
                        <button className="nav-link hover:text-white/60 transition-colors duration-300 drop-shadow-sm cursor-pointer whitespace-nowrap">Contact</button>
                    </div>

                    {/* Right: Spacer */}
                    <div className="hidden md:block w-1/4"></div>
                </nav>

                <main>
                    <div data-theme="dark">
                        <HeroScrollVideo
                            title="Vintage Revival"
                            subtitle="Project • 01"
                            meta="2026 MOD"
                            media={projectImages[0]}
                            mediaType="image"
                            scrollHeightVh={280}
                            smoothScroll={false}
                            targetSize="fullscreen"
                            overlay={{
                                caption: "/01 BRIEF",
                                heading: "Redefining Nostalgia",
                                paragraphs: [
                                    "Back to the Future will live forever in the minds of fans everywhere. The Hollywood classic touched generations and continues to be instantly recognizable. The brand needed to stand out in a crowded fashion market where many competitors also use 'retro' and 'vintage' aesthetics.",
                                    "The challenge was to create a brand identity that felt authentic, nostalgic, and premium without being cliché. We developed a design language rooted in vintage typography, muted yet warm color palettes."
                                ]
                            }}
                        />
                    </div>

                    {/* Image Grid Section */}
                    <section data-theme="light" className="reveal-grid-section reveal-section relative z-10 py-12 md:py-24 px-6 md:px-12 bg-transparent text-black">
                        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <div className="reveal-item aspect-[3/2] overflow-hidden rounded-sm bg-neutral-100">
                                <img
                                    src={projectImages[1]}
                                    alt="Process"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                                />
                            </div>
                            <div className="reveal-item aspect-[3/2] overflow-hidden rounded-sm bg-neutral-100 mt-0 md:mt-24">
                                <img
                                    src={projectImages[2]}
                                    alt="Process"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section /02 APPROACH (Existing) */}
                    <section data-theme="light" className="reveal-section py-32 md:py-64 bg-transparent text-black">
                        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
                            <h2 className="reveal-item text-xs font-black tracking-[0.3em] uppercase text-lime-600 mb-8">
                                /02 APPROACH
                            </h2>
                            <p className="reveal-item text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none max-w-5xl">
                                We developed a design language rooted in vintage typography, muted yet warm color palettes, and textured visuals.
                            </p>
                        </div>
                    </section>

                    {/* Section /03 PROJECT DETAILS */}
                    <section data-theme="light" className="reveal-section py-24 md:py-48 bg-transparent text-black border-t border-black/5">
                        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                            <h2 className="reveal-item text-xs font-black tracking-[0.3em] uppercase text-lime-600 mb-12">
                                /03 PROJECT DETAILS
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                                <div className="md:col-span-8">
                                    <div className="reveal-item aspect-[16/10] overflow-hidden bg-neutral-100">
                                        <img
                                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200"
                                            alt="Detail 1"
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-4 self-end">
                                    <div className="reveal-item aspect-square overflow-hidden bg-neutral-100">
                                        <img
                                            src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800"
                                            alt="Detail 2"
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-12 mt-12">
                                    <div className="reveal-item aspect-[21/9] overflow-hidden bg-neutral-100">
                                        <img
                                            src="https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1600"
                                            alt="Detail 3"
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section /04 VISUAL IDENTITY - Replaced with large image */}
                    <section data-theme="dark" className="reveal-section py-24 md:py-48 bg-black">
                        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                            <div className="reveal-item aspect-[21/9] overflow-hidden rounded-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600"
                                    alt="Visual Identity Immersive"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section /05 PROTOTYPING */}
                    <section data-theme="light" className="reveal-section py-24 md:py-48 bg-transparent text-black">
                        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                            <h2 className="reveal-item text-xs font-black tracking-[0.3em] uppercase text-lime-600 mb-16">
                                /05 PROTOTYPING
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                                {[
                                    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800",
                                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
                                    "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=800"
                                ].map((url, i) => (
                                    <div key={i}>
                                        <div className="reveal-item aspect-[3/4] overflow-hidden bg-neutral-100">
                                            <img
                                                src={url}
                                                alt={`Prototype ${i + 1}`}
                                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </LiquidBackground>
    );
}

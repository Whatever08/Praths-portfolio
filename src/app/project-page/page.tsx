"use client";

import { useRef } from "react";
import Link from "next/link";
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
import { EdgeToEdgeGallery } from "@/components/ui/EdgeToEdgeGallery";
import { StaggeredGridGallery } from "@/components/ui/StaggeredGridGallery";
import { BentoGridGallery } from "@/components/ui/BentoGridGallery";
import { DesignProcessReworked } from "@/components/ui/DesignProcessReworked";
import { useState } from "react";


gsap.registerPlugin(ScrollTrigger);

const projectImages = [
    "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
];

export default function ProjectPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLElement>(null);
    const [showReveal, setShowReveal] = useState(true);
    const [showRevealIn, setShowRevealIn] = useState(false);

    useGSAP(() => {
        // Navigation trigger etc handled by shared Navbar

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

        // Animated USP cards behind mockup
        gsap.utils.toArray<HTMLElement>(".moving-card").forEach((card, i) => {
            gsap.to(card, {
                y: "random(-20, 20)",
                x: "random(-15, 15)",
                rotation: "random(-2, 2)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2
            });
        });

        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, { scope: containerRef });

    return (
        <>
            <LiquidBackground colors={{
                uColor1: [0.5, 0.2, 0.8], // Purple
                uColor2: [0.1, 0.4, 0.9], // Blue
                uColor3: [0.2, 0.8, 0.4], // Green
                uColor4: [0.05, 0.05, 0.05], // White (5%)
                uColor5: [0.5, 0.2, 0.8],
                uColor6: [0.1, 0.4, 0.9]
            }}>
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
                                        title={<>Crafting E-Commerce a<br />Revolutionary Presence for<br />Architectural Menswear</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="Axiom approached me to create a distinctive e-commerce experience that would set them apart in the crowded streetwear market. They needed a platform that would showcase their architectural-inspired menswear while providing a seamless shopping experience that reflected their brand philosophy of &quot;structured minimalism.&quot;"
                                        scopeOfWork={["Shopify/Framer Development", "Branding", "Web Design", "Photography"]}
                                        media={projectImages[0]}
                                        mediaType="image"
                                        scrollHeightVh={140}
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

                                {/* Project Details Reference Section */}
                                <div className="w-full relative">
                                    <div className="absolute inset-0 bg-black/[0.15] pointer-events-none" />
                                    <section className="w-full relative z-10 text-[#e5e5e5] py-20 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto font-sans" data-theme="dark">
                                        {/* Top Row: Role & Timeline */}
                                        <div className="flex flex-col md:flex-row justify-between w-full mb-16 md:mb-24">
                                            <div className="w-full md:w-[65%] mb-8 md:mb-0">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Role</h3>
                                                <p className="text-sm md:text-base font-medium text-white">User Experience Designer</p>
                                            </div>
                                            <div className="w-full md:w-[30%]">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Timeline</h3>
                                                <p className="text-sm md:text-base font-medium text-white">2 Months</p>
                                            </div>
                                        </div>

                                        {/* Main Details 2-Col Grid */}
                                        <div className="flex flex-col md:flex-row justify-between w-full">
                                            {/* Left Column */}
                                            <div className="w-full md:w-[65%] flex flex-col gap-12 md:gap-16 pr-0 md:pr-12">
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Overview</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        A mobile-first health platform combining therapeutic exercises, mental wellness support, and COPD management tools into an integrated digital solution.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        Design an accessible interface for COPD patients to easily access exercise modules, track progress, and engage with support resources.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                                                        <li>Creating distress-aware navigation for emergency situations</li>
                                                        <li>Simplifying complex medical data visualization</li>
                                                        <li>Designing intuitive exercise module interfaces</li>
                                                        <li>Integrating community features with medical tools</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                                                        Delivered a comprehensive UX design featuring:
                                                    </p>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                                                        <li>Streamlined exercise modules with clear timing and difficulty indicators</li>
                                                        <li>Crisis-aware interface with quick-access emergency resources</li>
                                                        <li>Progress tracking dashboard with BreathEasy Score system</li>
                                                        <li>Integrated community support features</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Secondary Research</li>
                                                        <li>Branding Experience</li>
                                                        <li>Visual Identity</li>
                                                        <li>Art Direction</li>
                                                        <li>Design System</li>
                                                        <li>Information Architecture</li>
                                                        <li>Wireframing Interfaces</li>
                                                        <li>High Fidelity Wireframes</li>
                                                        <li>Development Handover</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools & Technologies</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Figma</li>
                                                        <li>Adobe Photoshop</li>
                                                        <li>Adobe Illustrator</li>
                                                        <li>Adobe After Effects</li>
                                                        <li>Relume.io</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">View Website</h3>
                                                    <button className="px-8 py-2.5 rounded-full border border-white/40 text-white text-sm hover:bg-white hover:text-black transition-colors font-medium">
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Capstonebox-style Scroll Features Section */}
                                <DesignProcessReworked
                                    heading="Design Process"
                                    subtitle="A structured approach to crafting exceptional digital experiences"
                                    items={[
                                        {
                                            number: "1",
                                            title: "Discovery & Research",
                                            description: "Deep dive into user needs, competitive landscape, and business goals to establish a solid foundation.",
                                            bullets: ["User Interviews", "Competitive Audit", "Stakeholder Workshops", "Heuristic Analysis"],
                                            image: "https://images.unsplash.com/photo-1553484771-047a44eee27a?q=80&w=1200",
                                        },
                                        {
                                            number: "2",
                                            title: "Information Architecture",
                                            description: "Structuring content and flows that feel intuitive and natural to the end user.",
                                            bullets: ["Site Mapping", "User Flows", "Content Strategy", "Navigation Design"],
                                            image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200",
                                        },
                                        {
                                            number: "3",
                                            title: "Visual Design System",
                                            description: "Building a cohesive design language with reusable components, typography scales, and color systems.",
                                            bullets: ["Component Library", "Typography Scale", "Color Palette", "Iconography"],
                                            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200",
                                        },
                                        {
                                            number: "4",
                                            title: "Prototyping & Testing",
                                            description: "Rapid iteration with high-fidelity prototypes validated through real user feedback.",
                                            bullets: ["Interactive Prototypes", "Usability Testing", "A/B Testing", "Iteration Cycles"],
                                            image: "https://images.unsplash.com/photo-1581291518633-83b4eef1d2fd?q=80&w=1200",
                                        },
                                    ]}
                                />

                                <div className="white-canvas-container w-full overflow-visible relative z-20">
                                    <div className="white-canvas-content w-full bg-white transition-all duration-300 ease-out rounded-[40px] md:rounded-[80px] shadow-2xl origin-center">

                                        {/* 2. Feature Cards Section (Dual Column) */}
                                        <section className="w-full bg-[#F5F5F7] py-12" data-theme="light">
                                            <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

                                                    {/* Card 1: Light Theme */}
                                                    <div className="bg-white rounded-3xl p-8 md:p-12 overflow-hidden border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                                        <div className="mb-12">
                                                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Flexible streak rules</h3>
                                                            <p className="text-black/60 font-medium leading-[1.5]">
                                                                Traditional habit trackers are too rigid. Things happen. So I designed a system that bends without breaking.
                                                            </p>
                                                        </div>
                                                        {/* Mockup Container */}
                                                        <div className="w-full aspect-[4/3] bg-neutral-50 rounded-2xl flex items-center justify-center p-6 border border-black/5">
                                                            <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-[280px]">
                                                                <div className="text-center mb-6">
                                                                    <div className="text-4xl mb-2">🔥</div>
                                                                    <div className="font-bold text-lg">28 Day Streak Active!</div>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">M</div>
                                                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">T</div>
                                                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">W</div>
                                                                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">T</div>
                                                                    <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center font-bold">F</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card 2: Dark Theme */}
                                                    <div className="bg-[#111612] text-white rounded-3xl p-8 md:p-12 overflow-hidden border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
                                                        <div className="mb-12">
                                                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Smart daily planner</h3>
                                                            <p className="text-white/60 font-medium leading-[1.5]">
                                                                Focus on what matters today. The planner automatically prioritizes your most critical tasks.
                                                            </p>
                                                        </div>
                                                        {/* Mockup Container */}
                                                        <div className="w-full aspect-[4/3] bg-[#0A0D0B] rounded-2xl flex items-center justify-center p-4 sm:p-6 border border-white/5 relative overflow-hidden">
                                                            {/* Subdued background tasks */}
                                                            <div className="absolute inset-x-6 top-6 space-y-3 opacity-30">
                                                                <div className="h-12 bg-white/5 rounded-lg w-full"></div>
                                                                <div className="h-12 bg-white/5 rounded-lg w-[80%]"></div>
                                                            </div>
                                                            {/* Active Highlighted Task */}
                                                            <div className="bg-[#1C241D] border border-green-500/30 rounded-xl p-4 w-full max-w-[300px] relative z-10 shadow-lg mt-12">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-5 h-5 rounded-full border-2 border-green-500"></div>
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-green-400 mb-1">11:30 AM</div>
                                                                        <div className="text-base font-medium">Read 10 pages</div>
                                                                        <div className="text-xs text-white/50 mt-1">30 minutes</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </section>


                                        {/* 1. Wide Image Showcase (iPhone 16 Pro Mockup) */}
                                        <section className="w-full bg-white px-4 md:px-8 py-24" data-theme="light">
                                            <div className="max-w-[1400px] mx-auto aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-sm relative">
                                                <img
                                                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1600"
                                                    alt="iPhone 16 Pro Mockup"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </section>

                                        {/* Carousel Slider — HorizontalScrollGallery */}
                                        <div data-theme="light" className="w-full bg-white">
                                            <HorizontalScrollGallery
                                                heading={<>All project images are handled<br />through multi-reference.</>}
                                                description="This flexible image system allows you to showcase your work in its best light on project pages. Multi-reference lets you upload images to your CMS and select the ideal ratio for each specific context, add custom descriptions, and create side-by-side image comparisons - all while maintaining visual consistency throughout your portfolio."
                                                items={[
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800', alt: 'App UI 1' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=800', alt: 'App UI 2' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200', alt: 'Retro Computing Setup' }
                                                ]}
                                            />
                                        </div>


                                        {/* 2. Refactored Image Reference Text Block */}
                                        <section className="max-w-[1000px] mx-auto px-6 md:px-12 py-32 text-center" data-theme="light">
                                            <h2 className="text-3xl md:text-[44px] font-bold tracking-tight mb-8 text-black">
                                                Project images are handled through multi-reference.
                                            </h2>
                                            <p className="text-base md:text-lg text-black/60 font-medium max-w-2xl mx-auto leading-relaxed">
                                                This flexible image system allows you to showcase your work in its best light on project pages. Multi-reference lets you upload images to your CMS and select the ideal ratio for each specific context, add custom descriptions, and create side-by-side image comparisons - all while maintaining visual consistency throughout your portfolio.
                                            </p>
                                        </section>

                                        {/* 3. Daily Habits Text Block */}
                                        <section className="max-w-[1000px] mx-auto px-6 md:px-12 py-24 text-center" data-theme="light">
                                            <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8 text-black">
                                                Build steady daily <span className="inline-block align-middle w-[1.5em] h-[0.8em] bg-neutral-100 rounded-full mx-2 overflow-hidden border border-black/5 shadow-sm relative"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=200" className="w-full h-full object-cover" alt="team" /></span> habits with a<br />
                                                layout that keeps your mornings,<br />
                                                evenings, <span className="inline-block align-middle mx-1">🌅</span> and focus simple to follow.
                                            </h2>
                                            <p className="text-base md:text-lg text-black/60 font-medium mb-10">
                                                Used by people to improve routines.
                                            </p>
                                            <div className="flex flex-wrap justify-center gap-3">
                                                {['#Founders', '#Students', '#Busy parents', '#Remote teams'].map((tag) => (
                                                    <span key={tag} className="px-5 py-2.5 rounded-full bg-neutral-100 text-black/70 text-sm font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>

                                        {/* 4. Complex Media Layout (MacBook Mockup) */}
                                        <section className="w-full overflow-hidden bg-white py-24 pb-48 relative" data-theme="light">
                                            <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative h-[600px] md:h-[850px] flex items-center justify-center">


                                                {/* USP Cards — absolutely positioned around the MacBook */}

                                                {/* Top-Left — overlapping left edge */}
                                                <div className="moving-card absolute top-[10%] left-[8%] z-30 bg-white rounded-2xl px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/[0.06] flex items-start gap-4 w-[280px] md:w-[330px]">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center mt-0.5">
                                                        <Icon icon="lucide:zap" className="w-6 h-6 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[15px] text-black mb-1">Instant Setup</div>
                                                        <div className="text-[12px] text-black/50 leading-relaxed">Go from zero to live in under 5 minutes.</div>
                                                    </div>
                                                </div>

                                                {/* Middle-Left — overlapping left edge */}
                                                <div className="moving-card absolute top-1/2 -translate-y-1/2 left-[5%] z-30 bg-white rounded-2xl px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/[0.06] flex items-start gap-4 w-[280px] md:w-[330px]">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-green-50 flex items-center justify-center mt-0.5">
                                                        <Icon icon="lucide:shield-check" className="w-6 h-6 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[15px] text-black mb-1">Privacy First</div>
                                                        <div className="text-[12px] text-black/50 leading-relaxed">Always encrypted. Always yours.</div>
                                                    </div>
                                                </div>

                                                {/* Bottom-Left — overlapping left edge */}
                                                <div className="moving-card absolute bottom-[10%] left-[8%] z-30 bg-white rounded-2xl px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/[0.06] flex items-start gap-4 w-[260px] md:w-[300px]">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-50 flex items-center justify-center mt-0.5">
                                                        <Icon icon="lucide:star" className="w-6 h-6 text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[15px] text-black mb-1">4.9★ Rating</div>
                                                        <div className="text-[12px] text-black/50 leading-relaxed">Loved by thousands of users.</div>
                                                    </div>
                                                </div>

                                                {/* Top-Right — overlapping right edge */}
                                                <div className="moving-card absolute top-[10%] right-[8%] z-30 bg-white rounded-2xl px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/[0.06] flex items-start gap-4 w-[280px] md:w-[330px]">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-purple-50 flex items-center justify-center mt-0.5">
                                                        <Icon icon="lucide:sparkles" className="w-6 h-6 text-purple-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[15px] text-black mb-1">AI-Powered</div>
                                                        <div className="text-[12px] text-black/50 leading-relaxed">Suggestions that adapt to you.</div>
                                                    </div>
                                                </div>

                                                {/* Middle-Right — overlapping right edge */}
                                                <div className="moving-card absolute top-1/2 -translate-y-1/2 right-[5%] z-30 bg-white rounded-2xl px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/[0.06] flex items-start gap-4 w-[280px] md:w-[330px]">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center mt-0.5">
                                                        <Icon icon="lucide:bar-chart-3" className="w-6 h-6 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[15px] text-black mb-1">Deep Analytics</div>
                                                        <div className="text-[12px] text-black/50 leading-relaxed">Track every metric that matters.</div>
                                                    </div>
                                                </div>

                                                {/* Bottom-Right — overlapping right edge */}
                                                <div className="moving-card absolute bottom-[10%] right-[8%] z-30 bg-white rounded-2xl px-6 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/[0.06] flex items-start gap-4 w-[260px] md:w-[300px]">
                                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-rose-50 flex items-center justify-center mt-0.5">
                                                        <Icon icon="lucide:heart" className="w-6 h-6 text-rose-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[15px] text-black mb-1">Built with care</div>
                                                        <div className="text-[12px] text-black/50 leading-relaxed">By a team that uses it daily.</div>
                                                    </div>
                                                </div>

                                                {/* Central Focused MacBook/iPad Mockup */}
                                                <div className="relative z-10 w-full max-w-[500px] md:max-w-[850px] aspect-[16/10] bg-neutral-900 rounded-[20px] md:rounded-[32px] shadow-2xl border-[8px] md:border-[12px] border-neutral-800 overflow-hidden flex flex-col">
                                                    <div className="w-full h-full bg-[#FAFAFA] relative overflow-hidden flex flex-col">
                                                        {/* Browser/System Bar */}
                                                        <div className="w-full h-8 md:h-12 bg-neutral-100 border-b border-neutral-200 flex items-center px-4 md:px-6 gap-2">
                                                            <div className="flex gap-1.5 md:gap-2">
                                                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57]"></div>
                                                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FFBD2E]"></div>
                                                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28C840]"></div>
                                                            </div>
                                                            <div className="flex-1 max-w-[200px] md:max-w-[400px] mx-auto h-5 md:h-7 bg-white rounded-lg border border-neutral-200"></div>
                                                        </div>

                                                        {/* Main Dashboard UI Content */}
                                                        <div className="flex-1 flex overflow-hidden">
                                                            {/* Sidebar */}
                                                            <div className="hidden lg:w-64 lg:flex flex-col bg-white border-r border-neutral-100 p-6 gap-8">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold">A</div>
                                                                    <span className="font-bold text-lg">Axiom</span>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex items-center gap-3 px-3 py-2 bg-neutral-50 rounded-lg text-black font-semibold">
                                                                        <Icon icon="lucide:layout-dashboard" className="w-5 h-5 text-indigo-500" /> Dashboard
                                                                    </div>
                                                                    <div className="flex items-center gap-3 px-3 py-2 text-neutral-400 font-medium">
                                                                        <Icon icon="lucide:bar-chart-3" className="w-5 h-5" /> Analytics
                                                                    </div>
                                                                    <div className="flex items-center gap-3 px-3 py-2 text-neutral-400 font-medium">
                                                                        <Icon icon="lucide:users" className="w-5 h-5" /> Teams
                                                                    </div>
                                                                    <div className="flex items-center gap-3 px-3 py-2 text-neutral-400 font-medium">
                                                                        <Icon icon="lucide:settings" className="w-5 h-5" /> Settings
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Content Area */}
                                                            <div className="flex-1 p-6 md:p-10 flex flex-col gap-6 md:gap-8 overflow-y-auto">
                                                                <div className="flex justify-between items-end">
                                                                    <div>
                                                                        <h3 className="text-2xl md:text-3xl font-bold text-black mb-1">Portfolio Stats</h3>
                                                                        <p className="text-sm md:text-base text-neutral-400 font-medium">Overview of your recent activity</p>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-100 flex items-center justify-center"><Icon icon="lucide:bell" className="w-4 h-4 md:w-5 md:h-5 text-neutral-600" /></div>
                                                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-neutral-900 flex items-center justify-center"><Icon icon="lucide:plus" className="w-4 h-4 md:w-5 md:h-5 text-white" /></div>
                                                                    </div>
                                                                </div>

                                                                {/* Cards Grid */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                                                    <div className="bg-white p-5 md:p-6 rounded-2xl border border-neutral-100 shadow-sm">
                                                                        <div className="text-xs md:text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Completion</div>
                                                                        <div className="text-2xl md:text-3xl font-bold mb-4">94.2%</div>
                                                                        <div className="w-full h-1.5 md:h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-[#111111] p-5 md:p-6 rounded-2xl shadow-xl text-white">
                                                                        <div className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Weekly Goal</div>
                                                                        <div className="text-2xl md:text-3xl font-bold mb-4">+$12,450</div>
                                                                        <div className="flex items-center gap-2 text-green-400 text-xs md:text-sm font-bold">
                                                                            <Icon icon="lucide:trending-up" className="w-4 h-4" /> 12% from last week
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-white p-5 md:p-6 rounded-2xl border border-neutral-100 shadow-sm hidden md:block">
                                                                        <div className="text-xs md:text-sm font-bold text-neutral-400 uppercase tracking-wider mb-2">Projects</div>
                                                                        <div className="text-2xl md:text-3xl font-bold">28 Active</div>
                                                                    </div>
                                                                </div>

                                                                {/* Main Chart Card (Simplified) */}
                                                                <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-sm flex flex-col gap-6">
                                                                    <div className="flex justify-between items-center">
                                                                        <h4 className="font-bold text-lg">Performance Over Time</h4>
                                                                        <div className="px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-bold border border-neutral-100">Last 30 Days</div>
                                                                    </div>
                                                                    <div className="flex-1 w-full relative min-h-[120px]">
                                                                        <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                                                                            <defs>
                                                                                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                                                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
                                                                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                                                                </linearGradient>
                                                                            </defs>
                                                                            <path d="M0,80 C50,60 80,100 120,40 C160,20 200,90 240,50 C280,30 320,60 400,20 L400,120 L0,120 Z" fill="url(#gradient)" />
                                                                            <path d="M0,80 C50,60 80,100 120,40 C160,20 200,90 240,50 C280,30 320,60 400,20" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* New Griflan-Style Gallery Sections */}
                                        <div className="w-full bg-white relative z-20">
                                            {/* 1. Staggered Grid */}
                                            <StaggeredGridGallery
                                                images={[
                                                    { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200", aspectRatio: "3/4" },
                                                    { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200", aspectRatio: "4/5" },
                                                    { src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200", aspectRatio: "1/1" },
                                                    { src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200", aspectRatio: "3/4" }
                                                ]}
                                            />

                                            {/* 2. Edge to Edge Interruption */}
                                            <EdgeToEdgeGallery
                                                src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1600"
                                                height="90vh"
                                            />

                                            {/* 3. Bento Asymmetric Grid */}
                                            <BentoGridGallery
                                                images={[
                                                    { src: "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=1600" },
                                                    { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200" },
                                                    { src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200" }
                                                ]}
                                            />
                                        </div>

                                        {/* 5. More Projects Section */}
                                        <div data-theme="light" className="bg-white">
                                            <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-24 bg-white">
                                                <h3 className="text-3xl md:text-[44px] font-bold tracking-tight mb-16 text-center text-black">
                                                    More Projects
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-20">
                                                    <Link href="#" className="group block w-full relative">
                                                        <div className="w-full flex flex-col">
                                                            <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-[#C1C9BB] border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6">
                                                                <img
                                                                    src="/kresse_wesling_placeholder_v2_1772645962257.png" // Fixed missing placeholder
                                                                    alt="Essentia Project"
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                                                />
                                                            </div>
                                                            <div className="flex justify-between items-start px-2">
                                                                <div>
                                                                    <h4 className="text-xl font-bold mb-1">Essentia</h4>
                                                                    <p className="text-sm text-black/60 font-medium">Ecommerce Site</p>
                                                                </div>
                                                                <span className="text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                                    <Icon icon="lucide:arrow-up-right" className="w-4 h-4" /> View Project
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    <div className="w-full h-full aspect-[4/3] md:aspect-auto rounded-[2rem] border border-black/10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center p-8 md:p-12 mb-6 md:mb-14">
                                                        <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mb-6 border border-neutral-300/50 shadow-sm">
                                                            <Icon icon="heroicons:users" className="text-2xl text-black/80" />
                                                        </div>
                                                        <p className="text-lg md:text-xl text-black/80 font-medium leading-relaxed max-w-[280px]">
                                                            Got a cool idea? <span className="font-bold text-black">This spot is waiting for your success story.</span>
                                                        </p>
                                                    </div>
                                                    <div className="w-full flex justify-center pb-12">
                                                        <Link href="#" className="text-sm md:text-base font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity text-black">
                                                            View all my projects <Icon icon="lucide:arrow-up-right" className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </section>
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

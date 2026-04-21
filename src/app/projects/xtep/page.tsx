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

// Custom Background Colors for Xtep
const PAGE_COLORS = {
    uColor1: [0.945, 0.353, 0.133], // Xtep Orange
    uColor2: [0.6, 0.1, 0.05],     // Deep Red
    uColor3: [0.9, 0.2, 0.1],      // Vibrant Red
    uColor4: [0.03, 0.03, 0.03],   // Black
    uColor5: [0.945, 0.353, 0.133],
    uColor6: [0.6, 0.1, 0.05]
};

const projectImages = [
    "/generated/xtep_vision.png",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200",
    "https://images.unsplash.com/photo-1511556532299-8f6617a75a34?q=80&w=1200",
];

export default function XtepPage() {
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
                                        title={<>Xtep: Accelerating the<br />Digital Storefront for<br />Premium Sportswear</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="Reimagining the e-commerce experience for Xtep, focusing on speed, athletic movement, and high-performance visual storytelling. We transformed their digital presence into a destination for athletes and sneaker enthusiasts alike."
                                        scopeOfWork={["E-Commerce Strategy", "Visual Identity", "3D Web Experience", "Performance Optimization"]}
                                        media={projectImages[0]}
                                        mediaType="image"
                                        scrollHeightVh={140}
                                        smoothScroll={false}
                                        targetSize="fullscreen"
                                        overlay={{
                                            caption: "/01 BRIEF",
                                            heading: "Running Faster Digitally",
                                            paragraphs: [
                                                "Xtep needed a digital ecosystem that reflected the energy of their physical products. The existing storefront felt static and failed to capture the 'momentum' that defines the brand.",
                                                "Our approach focused on liquid transitions, interactive product reveals, and a mobile-first checkout flow that feels as fast as the athletes who wear the gear."
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
                                                <p className="text-sm md:text-base font-medium text-white">Visual & Experience Designer</p>
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
                                                        A performance-driven redesign that emphasizes product durability and tech-specs through immersive 3D viewers and scroll-triggered kinetic typography.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        Elevate the digital shopping experience to match the technical prowess of the footwear, ensuring a frictionless path to purchase.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                                                        <li>Optimizing heavy 3D assets for mobile devices</li>
                                                        <li>Creating a motion system that feels athletic and fast</li>
                                                        <li>Balancing high-fashion aesthetics with technical specs</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                                                        Successfully launched a global digital flagship that saw a 25% increase in mobile engagement and average session duration.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Brand Immersion</li>
                                                        <li>Motion Studies</li>
                                                        <li>Web3D Prototyping</li>
                                                        <li>Performance Optimization</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools & Technologies</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Figma</li>
                                                        <li>Cinema 4D</li>
                                                        <li>Three.js</li>
                                                        <li>Post Processing</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">View Website</h3>
                                                    <button className="px-8 py-2.5 rounded-full border border-white/40 text-white text-sm hover:bg-white hover:text-black transition-colors font-medium">
                                                        View Shop
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
                                                heading={<>Motion is at the core of Xtep.</>}
                                                description="We built a design system that feels alive, using momentum-based scrolling and dynamic image masks."
                                                items={[
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200', alt: 'Xtep 1', title: 'Kinetic UI', description: 'Interface elements that react to scroll velocity for a fast-paced feel.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1511556532299-8f6617a75a34?q=80&w=1200', alt: 'Xtep 2', title: 'Product Showcase', description: 'High-fidelity product imagery that emphasizes texture and technology.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1200', alt: 'Xtep 3', title: '3D Interaction', description: 'Interactive sneaker models with real-time material swapping.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1200', alt: 'Xtep 4', title: 'Grid System', description: 'A flexible, modular grid that adapts to any product story.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200', alt: 'Xtep 5', title: 'Typography', description: 'Bold, athletic typefaces that convey power and speed.' },
                                                ]}
                                            />
                                        </div>

                                        {/* ── STACKED PARALLAX IMAGE GALLERY ─────────────────── */}
                                        <div data-theme="dark" className="w-full">
                                            {[
                                                {
                                                    src: "https://images.unsplash.com/photo-1539185441755-769473a23a5e?q=80&w=1600",
                                                    label: "Fluid Mechanics",
                                                    caption: "01 / Development",
                                                    body: "Translating athletic movement into digital transitions that feel natural yet highly engineered."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600",
                                                    label: "Tech Specs",
                                                    caption: "02 / Visualization",
                                                    body: "Focusing on the materials and technology that give Xtep its competitive edge."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=1600",
                                                    label: "Mobile First",
                                                    caption: "03 / UX Strategy",
                                                    body: "Designing for the athlete on the go, with ultra-fast loading and one-tap interactions."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4?q=80&w=1600",
                                                    label: "Motion Branding",
                                                    caption: "04 / Interactive",
                                                    body: "Creating a cohesive motion library that defines the brand's digital personality."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1600",
                                                    label: "Global Reach",
                                                    caption: "05 / Production",
                                                    body: "Scaling the experience for a worldwide audience with localized content hubs."
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
                                            <Link href="/projects/nebula" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 border-b sm:border-b-0 sm:border-r border-black/10 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Nebula</h3>
                                                </div>
                                            </Link>

                                            <Link href="/projects/exsavvy" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col items-end justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Next Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:translate-x-2 transition-all duration-500 leading-none pb-1">Exsavvy</h3>
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

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

                                <div className="white-canvas-container w-full overflow-visible relative z-20">
                                    <div className="white-canvas-content w-full bg-white transition-all duration-300 ease-out rounded-[40px] md:rounded-[80px] shadow-2xl origin-center">

                                        {/* Carousel Slider — HorizontalScrollGallery */}
                                        <div data-theme="light" className="w-full bg-white">
                                            <HorizontalScrollGallery
                                                heading={<>A structured approach to exceptional craft.</>}
                                                description="Each phase of this project was built on research, iteration, and collaboration — from the first sketch to the final pixel-perfect implementation."
                                                items={[
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200', alt: 'Design Process 1', title: 'Discovery & Research', description: 'Deep dive into user needs, competitive landscape, and business goals to establish a solid foundation.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200', alt: 'Design Process 2', title: 'Information Architecture', description: 'Structuring content and flows that feel intuitive and natural to the end user.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200', alt: 'Design Process 3', title: 'Visual Design System', description: 'Building a cohesive design language with reusable components, typography scales, and color systems.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1581291518633-83b4eef1d2fd?q=80&w=1200', alt: 'Design Process 4', title: 'Prototyping & Testing', description: 'Rapid iteration with high-fidelity prototypes validated through real user feedback.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200', alt: 'Design Process 5', title: 'Development & Handoff', description: 'Seamless collaboration with engineering teams to bring the finalized designs into production.' },
                                                ]}
                                            />
                                        </div>

                                        {/* ── STACKED PARALLAX IMAGE GALLERY ─────────────────── */}
                                        {/* No gaps — each image section stacks flush against the next */}
                                        <div data-theme="dark" className="w-full">
                                            {[
                                                {
                                                    src: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1600",
                                                    label: "Art Direction",
                                                    caption: "01 / Visual Language",
                                                    body: "Establishing a strong visual foundation that resonates with the core brand identity. We focused on creating a design language that feels both modern and timeless, ensuring consistency across all touchpoints while maintaining a unique edge."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600",
                                                    label: "Brand Identity",
                                                    caption: "02 / Identity System",
                                                    body: "Developing a comprehensive identity system that scales effortlessly. This involved refining the logo, selecting a robust typography stack, and defining a color palette that conveys trust and innovation perfectly tailored to the target audience."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600",
                                                    label: "UI Design",
                                                    caption: "03 / Interface Design",
                                                    body: "Translating the visual language into a clean, intuitive user interface. Every component was crafted with accessibility and usability in mind, resulting in an interface that is not only beautiful but also highly functional for everyday users."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600",
                                                    label: "Motion & Interaction",
                                                    caption: "04 / Micro-Interactions",
                                                    body: "Bringing the interface to life with subtle motion and micro-interactions. These moments of delight guide the user's focus, provide clear feedback, and elevate the overall user experience from ordinary to truly exceptional."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600",
                                                    label: "Final Delivery",
                                                    caption: "05 / Production",
                                                    body: "Ensuring a seamless transition from design to development. We provided comprehensive documentation, a fully componentized design system, and continued support during implementation to guarantee pixel-perfect execution."
                                                },
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="parallax-panel relative w-full overflow-hidden"
                                                    style={{ height: "100vh" }}
                                                >
                                                    {/* Parallax image — overflows the container, moves at a different speed via GSAP */}
                                                    <div
                                                        className={`parallax-img-${i} absolute inset-0 w-full`}
                                                        style={{ height: "130%", top: "-15%" }}
                                                    >
                                                        <img
                                                            src={item.src}
                                                            alt={item.label}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Subtle dark gradient for text legibility (faded more at the top now) */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/60" />
                                                    </div>

                                                    {/* Top-aligned Text Overlay */}
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
                                            {/* Previous Project */}
                                            <Link href="/project-page" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 border-b sm:border-b-0 sm:border-r border-black/10 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Nebula</h3>
                                                </div>
                                            </Link>

                                            {/* Next Project */}
                                            <Link href="/project-page" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col items-end justify-center group hover:bg-black/5 transition-colors duration-500">
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

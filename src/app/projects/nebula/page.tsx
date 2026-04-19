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

// Custom Background Colors for Nebula
const PAGE_COLORS = {
    uColor1: [0.039, 0.055, 0.153], // Deep Navy
    uColor2: [0.1, 0.4, 0.9],      // Electric Blue
    uColor3: [0.5, 0.2, 0.8],      // Nebula Purple
    uColor4: [0.02, 0.02, 0.02],   // Dark Space
    uColor5: [0.1, 0.4, 0.9],
    uColor6: [0.5, 0.2, 0.8]
};

const projectImages = [
    "/generated/nebula_vision.png",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
];

export default function NebulaPage() {
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
                                        title={<>Nebula: Designing the<br />Future of Decentralized<br />Cloud Computing</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="Nebula is a cutting-edge platform designed to revolutionize how developers access and manage cloud resources. By leveraging decentralized infrastructure, Nebula provides unparalleled security, scalability, and cost-efficiency for modern web applications."
                                        scopeOfWork={["Product Strategy", "UI/UX Design", "Custom 3D Assets", "Frontend Architecture"]}
                                        media={projectImages[0]}
                                        mediaType="image"
                                        scrollHeightVh={140}
                                        smoothScroll={false}
                                        targetSize="fullscreen"
                                        overlay={{
                                            caption: "/01 BRIEF",
                                            heading: "Scale Beyond Boundaries",
                                            paragraphs: [
                                                "The cloud computing landscape is currently dominated by a few centralized giants. Nebula sought to challenge this status quo by offering a decentralized alternative that doesn't compromise on performance or developer experience.",
                                                "Our mission was to translate complex technical concepts into an intuitive, visually stunning interface that feels both futuristic and fundamentally reliable."
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
                                                <p className="text-sm md:text-base font-medium text-white">Lead Product Designer</p>
                                            </div>
                                            <div className="w-full md:w-[30%]">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Timeline</h3>
                                                <p className="text-sm md:text-base font-medium text-white">4 Months</p>
                                            </div>
                                        </div>

                                        {/* Main Details 2-Col Grid */}
                                        <div className="flex flex-col md:flex-row justify-between w-full">
                                            {/* Left Column */}
                                            <div className="w-full md:w-[65%] flex flex-col gap-12 md:gap-16 pr-0 md:pr-12">
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Overview</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        Nebula provides a unified dashboard for managing distributed node clusters across the globe, allowing developers to deploy applications in seconds without worrying about underlying infrastructure hardware into an integrated digital solution.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                                                        Create a seamless onboarding flow and resource management system that hides the complexity of decentralized protocols while maintaining full transparency.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2">
                                                        <li>Simplifying decentralized resource allocation</li>
                                                        <li>Ensuring real-time latency feedback for node health</li>
                                                        <li>Designing for technical power-users</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4">
                                                        Successfully reduced cloud deployment time by 40% while maintaining 99.9% uptime visualization accuracy.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Secondary Research</li>
                                                        <li>Technical Architecture Mapping</li>
                                                        <li>UI/UX Design</li>
                                                        <li>Interactive Prototyping</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools & Technologies</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Figma</li>
                                                        <li>Spline (3D)</li>
                                                        <li>After Effects</li>
                                                        <li>Framer</li>
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
                                                heading={<>A structured approach to decentralized design.</>}
                                                description="From technical audit to visual storytelling, we built Nebula with a focus on developer autonomy and system resilience."
                                                items={[
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200', alt: 'Process 1', title: 'System Architecture', description: 'Mapping out the decentralized node network and resource allocation logic.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200', alt: 'Process 2', title: 'Visual Language', description: 'Developing a high-contrast dark mode aesthetic that reflects the depths of space.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200', alt: 'Process 3', title: 'User Testing', description: 'Validating the deployment flow with senior DevOps engineers to ensure speed and clarity.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1581291518633-83b4eef1d2fd?q=80&w=1200', alt: 'Process 4', title: 'High-Fidelity UI', description: 'Polishing the interface with refined type scales and cosmic-themed assets.' },
                                                    { type: 'image', src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200', alt: 'Process 5', title: 'Handover', description: 'Providing clear design specs and motion curves for the engineering team.' },
                                                ]}
                                            />
                                        </div>

                                        {/* ── STACKED PARALLAX IMAGE GALLERY ─────────────────── */}
                                        <div data-theme="light" className="w-full">
                                            {[
                                                {
                                                    src: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1600",
                                                    label: "Interstellar UI",
                                                    caption: "01 / Aesthetic",
                                                    body: "High-fidelity components designed with translucency and glow effects to mimic the feeling of a futuristic cockpit."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600",
                                                    label: "Brand Identity",
                                                    caption: "02 / Visual Foundation",
                                                    body: "Translating complex decentralized concepts into a premium, cosmic-inspired identity system."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600",
                                                    label: "Global Reach",
                                                    caption: "03 / Network",
                                                    body: "Visualizing worldwide traffic and node health in real-time through interactive SVG maps and data-rich sidebars."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600",
                                                    label: "Motion Language",
                                                    caption: "04 / Interactive",
                                                    body: "Bringing the interface to life with subtle motion and micro-interactions."
                                                },
                                                {
                                                    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600",
                                                    label: "Final Outcome",
                                                    caption: "05 / Delivery",
                                                    body: "A robust, scalable design system ready for deployment across all platform touchpoints."
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
                                            <Link href="/projects/akshara-events" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 border-b sm:border-b-0 sm:border-r border-black/10 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Akshara</h3>
                                                </div>
                                            </Link>

                                            <Link href="/projects/xtep" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col items-end justify-center group hover:bg-black/5 transition-colors duration-500">
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

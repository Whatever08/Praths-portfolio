"use client";

import { useRef, useState, useEffect } from "react";
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
import Link from "next/link";
import "./../nebula/nebula.css";

// Screen mockups for product introducing stack
import SplashImg from "./SPLASH SCREEN.png";
import OnboardingImg from "./Onboarding.png";
import OnboardingImg2 from "./Onboarding2.png";
import OnboardingImg3 from "./Onboarding3.png";
import OnboardingImg4 from "./Onboarding4.png";
import StoreImg from "./Store1.png";
import StoreImg2 from "./Store2.png";
import StoreImg3 from "./Store3.png";
import HomeImg from "./Homepage1.png";
import HomeImg2 from "./Home2.png";
import HomeImg4 from "./Home4.png";
import CheckoutImg from "./Checkout1.png";
import CheckoutImg2 from "./Checkout2.png";
import CheckoutImg3 from "./Checkout3.png";
import XtepLogo from "./Logoxtep.png";

gsap.registerPlugin(ScrollTrigger);

// Custom Background Colors for Xtep
const PAGE_COLORS = {
    uColor1: [0.91, 0.0, 0.176],     // Xtep Red
    uColor2: [0.047, 0.047, 0.047], // Deep Black/Dark Gray
    uColor3: [0.55, 0.0, 0.1],      // Burgundy Red
    uColor4: [0.03, 0.03, 0.03],    // Black
    uColor5: [0.91, 0.0, 0.176],
    uColor6: [0.047, 0.047, 0.047]
};

const wireframeCards = [
    { id: 1, src: "/l1.png", alt: "Wireframe Screen 1" },
    { id: 2, src: "/l2.png", alt: "Wireframe Screen 2" },
    { id: 3, src: "/l3.png", alt: "Wireframe Screen 3" },
    { id: 4, src: "/l4.png", alt: "Wireframe Screen 4" },
    { id: 5, src: "/l5.png", alt: "Wireframe Screen 5" },
    { id: 6, src: "/l6.png", alt: "Wireframe Screen 6" },
    { id: 7, src: "/l7.png", alt: "Wireframe Screen 7" },
    { id: 8, src: "/l8.png", alt: "Wireframe Screen 8" },
    { id: 9, src: "/l9.png", alt: "Wireframe Screen 9" },
];

// ─── XtepMarqueeShowcase ────────────────────────────────────────────────────
const MARQUEE_CATEGORIES = [
    {
        id: "01",
        heading: "Onboarding Screens",
        description: "Personalisation selector combats low brand awareness by showing products matched to user interests immediately.",
    },
    {
        id: "02",
        heading: "Homepage & Product Discovery",
        description: "Shop By Collection architecture introduces performance technology pillars passively during customer browsing.",
    },
    {
        id: "03",
        heading: "Product Detail & Reviews",
        description: "Verified peer reviews build trust for the unfamiliar brand and drive active running community participation.",
    },
    {
        id: "04",
        heading: "Checkout Flow",
        description: "3-step checkout with progress tracking reduces friction, coupon flow satisfies value-seeking, and D2C ensures authenticity.",
    },
];

type MarqueeScreens = {
    onboarding: string[];
    home: string[];
    store: string[];
    checkout: string[];
};

function XtepMarqueeShowcase({ screens }: { screens: MarqueeScreens }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [visible, setVisible] = useState(true);
    const trackRef = useRef<HTMLDivElement>(null);
    const pendingRef = useRef<number | null>(null);

    // Build ordered card list with category index embedded
    const buildCards = () => {
        const groups: { src: string; alt: string; catIdx: number }[][] = [
            screens.onboarding.map((src, i) => ({ src, alt: `Onboarding ${i + 1}`, catIdx: 0 })),
            screens.home.map((src, i) => ({ src, alt: `Home ${i + 1}`, catIdx: 1 })),
            screens.store.map((src, i) => ({ src, alt: `Store ${i + 1}`, catIdx: 2 })),
            screens.checkout.map((src, i) => ({ src, alt: `Checkout ${i + 1}`, catIdx: 3 })),
        ];
        return groups.flat();
    };

    const cards = buildCards();
    // Duplicate for seamless infinite loop
    const allCards = [...cards, ...cards];

    const switchCategory = (idx: number) => {
        if (pendingRef.current !== null) clearTimeout(pendingRef.current);
        // Fade out
        setVisible(false);
        pendingRef.current = window.setTimeout(() => {
            setActiveIdx(idx);
            setVisible(true);
        }, 320);
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        // Find the sentinel elements (first card of each category in set 1 only)
        const sentinels = track.querySelectorAll<HTMLElement>("[data-sentinel]");
        if (!sentinels.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const catIdx = Number((entry.target as HTMLElement).dataset.sentinel);
                        switchCategory(catIdx);
                    }
                });
            },
            {
                root: track.parentElement, // the overflow-hidden container
                rootMargin: "0px -45% 0px -45%", // trigger when sentinel crosses ~center
                threshold: 0,
            }
        );

        sentinels.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const cat = MARQUEE_CATEGORIES[activeIdx];

    return (
        <div className="rounded-3xl bg-white border border-[#E4DFD7] shadow-sm overflow-hidden">
            {/* ── Top: heading + category pills ── */}
            <div className="flex flex-col items-center justify-center pt-12 pb-8 px-8 text-center min-h-[120px]">
                {/* Category number pill */}
                <div
                    className="inline-flex items-center gap-2 bg-[#E8002D]/8 rounded-full px-4 py-1 mb-5"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(-8px)",
                        transition: "opacity 0.32s ease, transform 0.32s ease",
                    }}
                >
                    <span className="text-[10px] font-mono font-bold text-[#E8002D]">{cat.id}</span>
                    <span className="text-[10px] font-mono text-[#6B6762] uppercase tracking-widest">&bull;</span>
                    <span className="text-[10px] font-mono text-[#6B6762] uppercase tracking-wider font-semibold">UI DESIGN SYSTEM</span>
                </div>

                {/* Main heading */}
                <h3
                    className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans text-[#0C0C0C] tracking-tight"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.32s ease 0.04s, transform 0.32s ease 0.04s",
                    }}
                >
                    {cat.heading}
                </h3>

                {/* Progress dots */}
                <div className="flex items-center gap-2 mt-4">
                    {MARQUEE_CATEGORIES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => switchCategory(i)}
                            className={`rounded-full transition-all duration-300 ${i === activeIdx
                                    ? "w-6 h-2 bg-[#E8002D]"
                                    : "w-2 h-2 bg-[#E4DFD7] hover:bg-[#6B6762]"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ── Middle: scrolling marquee ── */}
            <div
                className="overflow-hidden py-8 bg-[#FAFAF9]"
                style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
            >
                <style>{`
                    @keyframes xtep-marquee-v2 {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .xtep-marquee-v2 {
                        display: flex;
                        gap: 16px;
                        width: max-content;
                        animation: xtep-marquee-v2 42s linear infinite;
                        will-change: transform;
                    }
                    .xtep-marquee-v2:hover {
                        animation-play-state: paused;
                    }
                `}</style>

                <div className="xtep-marquee-v2" ref={trackRef}>
                    {allCards.map((card, idx) => {
                        const baseIdx = idx % cards.length;
                        const isFirstOfCat = (
                            (card.catIdx === 0 && baseIdx === 0) ||
                            (card.catIdx === 1 && cards.findIndex(c => c.catIdx === 1) === baseIdx) ||
                            (card.catIdx === 2 && cards.findIndex(c => c.catIdx === 2) === baseIdx) ||
                            (card.catIdx === 3 && cards.findIndex(c => c.catIdx === 3) === baseIdx)
                        );
                        return (
                            <div
                                key={idx}
                                className="relative flex-shrink-0 w-[140px] md:w-[170px] aspect-[9/19.5] group flex items-center justify-center"
                                {...(isFirstOfCat ? { "data-sentinel": String(card.catIdx) } : {})}
                            >
                                <img
                                    src={card.src}
                                    alt={card.alt}
                                    className="w-full h-full object-contain scale-90 select-none pointer-events-none transition-transform duration-500 group-hover:scale-100"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Bottom: description ── */}
            <div className="flex flex-col items-center justify-center px-8 pt-8 pb-12 text-center min-h-[100px]">
                <p
                    className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans max-w-xl"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(8px)",
                        transition: "opacity 0.32s ease 0.08s, transform 0.32s ease 0.08s",
                    }}
                >
                    {cat.description}
                </p>

            </div>
        </div>
    );
}
// ────────────────────────────────────────────────────────────────────────────

export default function XtepPage() {

    const containerRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLElement>(null);
    const lenisRef = useRef<any>(null);
    const [showReveal, setShowReveal] = useState(true);
    const [showRevealIn, setShowRevealIn] = useState(false);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const handleCopyColor = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => {
            setCopiedColor(null);
        }, 1500);
    };

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

        // ── Pin carousel & drive horizontal scroll through all 4 cards ──
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

        // ── Pinned stacked cards introducing animation ──
        const introSection = containerRef.current?.querySelector(".dv-intro-section") as HTMLElement | null;
        const introCards = containerRef.current?.querySelectorAll(".dv-intro-card") as NodeListOf<HTMLElement> | null;

        if (introSection && introCards && introCards.length > 0) {
            const numCards = introCards.length;
            const stepsCount = numCards - 1; // Number of scroll steps (slide out all but the last card)

            // Layout factors based on screen size (fans out to the right)
            const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
            const xOffset = isDesktop ? 40 : 27;
            const yOffset = isDesktop ? -9 : -5;

            // Initialize card positions inside the fanned diagonal stack
            introCards.forEach((card, idx) => {
                const scaleVal = 1 - idx * 0.07;
                const yVal = idx * yOffset;
                const xVal = idx * xOffset;
                const opacityVal = 1;

                gsap.set(card, {
                    scale: scaleVal,
                    y: yVal,
                    x: xVal,
                    opacity: opacityVal,
                    rotation: 0,
                    zIndex: 100 - idx * 10,
                    transformOrigin: "center center",
                });
            });

            // Create scroll-driven transition timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: introSection,
                    start: "center center",
                    end: () => `+=${stepsCount * 450}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            });

            for (let step = 0; step < stepsCount; step++) {
                const label = `step-${step}`;
                const frontCard = introCards[step];

                // 1. Front card slides out left and disappears permanently (no loop-back)
                tl.to(frontCard, {
                    x: "-135%",
                    y: "0px",
                    rotation: 0,
                    scale: 0.95,
                    opacity: 0,
                    ease: "power2.inOut",
                    duration: 0.5,
                }, label);

                // 2. Move remaining stack cards forward
                for (let c = step + 1; c < numCards; c++) {
                    const nextSlot = c - (step + 1);
                    const scaleVal = 1 - nextSlot * 0.07;
                    const yVal = nextSlot * yOffset;
                    const xVal = nextSlot * xOffset;

                    tl.to(introCards[c], {
                        scale: scaleVal,
                        y: yVal,
                        x: xVal,
                        opacity: 1,
                        zIndex: 100 - nextSlot * 10,
                        ease: "power2.inOut",
                        duration: 1,
                    }, label);
                }
            }
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
                                        title={<>Xtep India:<br />E-Store App &amp;<br />Design Management</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="A design management case study examining how a mobile-first digital commerce ecosystem can solve Xtep's India market-entry challenges: trust, discovery, and community."
                                        scopeOfWork={["UX Design", "Business Strategy", "Design Management", "Mobile App"]}
                                        media="/Introvid.mp4"
                                        mediaType="video"
                                        scrollHeightVh={140}
                                        smoothScroll={false}
                                        targetSize="fullscreen"
                                        overlay={{
                                            caption: "/01 BRIEF",
                                            heading: "A Digital Entry for India",
                                            paragraphs: [
                                                "Xtep, a global performance sportswear company founded in 1987, operating across 30+ countries, needed a mobile-first digital commerce ecosystem to solve its India market-entry challenges: trust, discovery, and community.",
                                                "By connecting their 2.2 million XRC running club members to a D2C shopping app, the design management strategy aims to drive 45% online sales contribution and build brand awareness."
                                            ]
                                        }}
                                    />
                                </div>

                                {/* ── PROJECT DETAILS SECTION (dark) ───────────────── */}
                                <div className="w-full relative">
                                    <div className="absolute inset-0 bg-black/[0.15] pointer-events-none" />
                                    <section
                                        className="w-full relative z-10 text-[#e5e5e5] py-20 md:py-32 px-6 md:px-12 max-w-[1400px] mx-auto font-sans"
                                        data-theme="dark"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between w-full mb-16 md:mb-24">
                                            <div className="w-full md:w-[65%] mb-8 md:mb-0">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Role</h3>
                                                <p className="text-sm md:text-base font-medium text-white">Design Manager &amp; Lead UX Designer</p>
                                            </div>
                                            <div className="w-full md:w-[30%]">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Timeline</h3>
                                                <p className="text-sm md:text-base font-medium text-white">3 Weeks</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between w-full">
                                            <div className="w-full md:w-[65%] flex flex-col gap-12 md:gap-16 pr-0 md:pr-12">
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Overview</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl font-sans">
                                                        Xtep, a global running powerhouse with over 8,500 stores, faces trust, brand awareness, and product education gaps in the Indian market. This project defines a mobile-first e-commerce app designed to translate community engagement into D2C commerce.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl font-sans">
                                                        Create a trusted, educational, and community-driven mobile shopping experience that supports Xtep's 24% annual growth and 45% online sales contribution targets in India.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2 font-sans">
                                                        <li>Overcoming low brand awareness and marketplace trust gaps</li>
                                                        <li>Communicating complex carbon-plate technology at point-of-purchase</li>
                                                        <li>Integrating the 2.2M-member Xtep Running Club (XRC) ecosystem into commerce</li>
                                                        <li>Aligning e-commerce operations with expansion goals (200 EBOs, 500 MBOs)</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4 font-sans">
                                                        A comprehensive design strategy and 9-screen flow prototype that establishes Xtep's value proposition, bridges offline-online channels, and outlines a live website audit for conversion improvement.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Understanding the Process</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90 font-sans">
                                                        <li>Brand Immersion</li>
                                                        <li>Market Analysis</li>
                                                        <li>User Research (r/indianrunners)</li>
                                                        <li>Competitive Mapping</li>
                                                        <li>Business Model Canvas</li>
                                                        <li>UX/UI Design System</li>
                                                        <li>Website Conversion Audit</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools &amp; Technologies</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90 font-sans">
                                                        <li>Figma</li>
                                                        <li>FigJam</li>
                                                        <li>Shopify Audit</li>
                                                        <li>Reddit Analytics</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                                    <div className="white-canvas-content w-full bg-white transition-colors duration-300 ease-out shadow-2xl origin-center" data-theme="light">
                                        <div className="dv-embed">

                                            {/* ── 01 BRAND OVERVIEW ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-32 md:py-40" id="brand">
                                                <div className="dv-container">
                                                    <div className="text-center mb-16">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4">01 BRAND OVERVIEW</span>
                                                        <h2 className="dv-mixed-heading">
                                                            <span className="dv-heading-bold">Who is</span> <em className="dv-heading-italic">Xtep?</em>
                                                        </h2>
                                                        <p className="dv-subheading">
                                                            A global performance sportswear company founded in 1987, operating across 30+ countries with a powerful running ecosystem at its core.
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                                                        <div className="flex flex-col gap-8">
                                                            <p className="text-base text-[#6B6762] leading-relaxed font-sans">
                                                                Xtep positions itself around <strong className="text-[#0C0C0C]">running performance, sports technology, and community-driven growth.</strong> In India, the brand's stated vision is clear:
                                                            </p>
                                                            <blockquote className="border-l-2 border-[#E8002D] pl-6 py-4 bg-[#F0EDE8]/40 rounded-r-2xl text-base italic text-[#0C0C0C] font-sans leading-relaxed">
                                                                "India's running era is evolving: more aware, ambitious, and connected."
                                                                <cite className="block text-[10px] font-mono text-[#6B6762] mt-2 not-italic tracking-wider uppercase font-semibold">(Xtep India, Official)</cite>
                                                            </blockquote>
                                                            <p className="text-base text-[#6B6762] leading-relaxed font-sans">
                                                                The XRC (Xtep Running Club) ecosystem connects over <strong className="text-[#0C0C0C]">2.2 million members across 200+ cities</strong>, making community not just a feature, but a core business driver.
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-col gap-8">
                                                            <div>
                                                                <span className="text-[10px] tracking-widest font-mono text-[#6B6762] uppercase block mb-4 font-semibold">Brand Pillars</span>
                                                                <div className="flex flex-col border border-[#E4DFD7] rounded-2xl overflow-hidden bg-white">
                                                                    {["Running Performance", "Sports Technology", "Accessibility & Pricing", "Community-Driven Growth", "Global Running Culture"].map((pillar, idx) => (
                                                                        <div key={idx} className="p-5 border-b border-[#E4DFD7] last:border-b-0 flex items-center gap-4 hover:bg-[#F7F5F2] transition-colors duration-200">
                                                                            <span className="w-2 h-2 rounded-full bg-[#E8002D]" style={{ width: '8px', height: '8px' }}></span>
                                                                            <span className="text-sm font-sans font-medium text-[#0C0C0C]">{pillar}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Key Metrics Full-Width Row */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 bg-[#0C0C0C] border border-[#1F1F1F] rounded-3xl p-8 text-center shadow-xl">
                                                        <div className="flex flex-col items-center justify-center p-4">
                                                            <div className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-none mb-3">8,500+</div>
                                                            <div className="text-xs font-mono text-white/50 uppercase tracking-wider">Retail Stores Globally</div>
                                                        </div>
                                                        <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l md:border-r border-white/10">
                                                            <div className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-none mb-3">2.2M</div>
                                                            <div className="text-xs font-mono text-white/50 uppercase tracking-wider">XRC Club Members</div>
                                                        </div>
                                                        <div className="flex flex-col items-center justify-center p-4">
                                                            <div className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-none mb-3">30+</div>
                                                            <div className="text-xs font-mono text-white/50 uppercase tracking-wider">Countries of Operation</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                            {/* ── 02 MARKET CONTEXT ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-32 md:py-40" id="market">
                                                <div className="dv-container">
                                                    <div className="text-center mb-16">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">02 MARKET CONTEXT</span>
                                                        <h2 className="dv-mixed-heading !text-[#0C0C0C]">
                                                            <span className="dv-heading-bold">Why India,</span> <em className="dv-heading-italic">Why Now?</em>
                                                        </h2>
                                                        <p className="dv-subheading text-[#6B6762]">
                                                            India is a market where activewear demand is surging, competition is intense, and digital commerce is becoming the primary growth channel.
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                                        {[
                                                            { val: "$15B", title: "Current Activewear Market", text: "Fastest-growing activewear market in Asia, driven by rising fitness and marathon culture." },
                                                            { val: "$30B", title: "Projected Market by 2030", text: "Projected to double by 2030, accelerated by digital commerce and D2C expansion." },
                                                            { val: "45%", title: "Digital Sales Target", text: "Expected online channel contribution, serving as Xtep's core growth driver in India." }
                                                        ].map((card, idx) => (
                                                            <div key={idx} className="bg-white border border-[#E4DFD7] rounded-2xl p-8 hover:bg-[#0C0C0C] hover:border-[#0C0C0C] transition-all duration-300 text-left shadow-sm group cursor-default">
                                                                <div className="text-4xl font-sans font-bold text-[#0C0C0C] group-hover:text-white mb-4 leading-none text-left transition-colors duration-300">{card.val}</div>
                                                                <div className="text-base font-bold text-[#0C0C0C] group-hover:text-white mb-2 font-sans text-left transition-colors duration-300">{card.title}</div>
                                                                <p className="text-sm text-[#6B6762] group-hover:text-white/70 leading-relaxed font-sans text-left transition-colors duration-300">{card.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="bg-white border border-[#E4DFD7] rounded-2xl p-8 hover:bg-[#0C0C0C] hover:border-[#0C0C0C] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 text-left shadow-sm group transition-all duration-300 cursor-default">
                                                        <p className="text-lg text-[#0C0C0C] group-hover:text-white/90 max-w-xl font-sans leading-relaxed text-left transition-colors duration-300">
                                                            Xtep doesn't primarily have a product problem. It has a <strong className="text-[#0C0C0C] group-hover:text-white font-bold transition-colors duration-300">market-entry, trust-building, and digital ecosystem problem.</strong>
                                                        </p>
                                                        <div className="text-left md:text-right flex-shrink-0">
                                                            <div className="text-4xl font-sans font-bold text-[#0C0C0C] group-hover:text-white leading-none mb-1 text-left md:text-right transition-colors duration-300">24%</div>
                                                            <span className="text-xs font-mono text-[#6B6762] group-hover:text-white/50 uppercase tracking-widest block text-left md:text-right font-semibold transition-colors duration-300">Growth Target</span>
                                                        </div>
                                                    </div>

                                                    <div className="dv-marquee cursor-default py-4">
                                                        <div className="dv-marquee-track flex gap-6 pr-6">
                                                            {[
                                                                "Growing marathon participation across tier-1 and tier-2 cities",
                                                                "Rising fitness culture and demand for performance footwear under ₹10,000",
                                                                "Rapid D2C commerce growth, especially in sportswear and footwear categories",
                                                                "Decathlon's India success proves willingness to buy performance gear from newer brands"
                                                            ].map((text, idx) => (
                                                                <div key={`track1-${idx}`} className="group border border-[#E4DFD7] rounded-3xl p-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:bg-[#0C0C0C] hover:border-[#0C0C0C] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 text-left flex flex-col justify-center w-[420px] md:w-[500px] min-h-[240px] md:min-h-[280px] flex-shrink-0">
                                                                    <p className="text-xl md:text-[22px] font-medium leading-relaxed text-[#0C0C0C] group-hover:text-white font-sans text-left transition-colors duration-300">{text}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="dv-marquee-track flex gap-6 pr-6" aria-hidden="true">
                                                            {[
                                                                "Growing marathon participation across tier-1 and tier-2 cities",
                                                                "Rising fitness culture and demand for performance footwear under ₹10,000",
                                                                "Rapid D2C commerce growth, especially in sportswear and footwear categories",
                                                                "Decathlon's India success proves willingness to buy performance gear from newer brands"
                                                            ].map((text, idx) => (
                                                                <div key={`track2-${idx}`} className="group border border-[#E4DFD7] rounded-3xl p-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:bg-[#0C0C0C] hover:border-[#0C0C0C] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 text-left flex flex-col justify-center w-[420px] md:w-[500px] min-h-[240px] md:min-h-[280px] flex-shrink-0">
                                                                    <p className="text-xl md:text-[22px] font-medium leading-relaxed text-[#0C0C0C] group-hover:text-white font-sans text-left transition-colors duration-300">{text}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── 03 USER RESEARCH (GSAP Carousel) ── */}
                                            <section className="dv-section dv-research-carousel-section border-t border-b border-[#E4DFD7] bg-[#F0EDE8]/40 py-32 md:py-40" id="problems">
                                                <div className="dv-container">
                                                    <div className="text-center mb-16">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4">03 USER RESEARCH</span>
                                                        <h2 className="dv-mixed-heading !text-[#0C0C0C]">
                                                            <span className="dv-heading-bold">Four Real Problems</span> <em className="dv-heading-italic">from Real Users</em>
                                                        </h2>
                                                        <p className="dv-subheading !text-[#6B6762]">
                                                            Sourced entirely from community discussions on r/indianrunners: no assumptions, no fictional personas. Verbatim signals from the target audience.
                                                        </p>
                                                    </div>

                                                    <div className="dv-dark-cards-carousel dv-mt-24">
                                                        <div className="dv-dark-cards-track">
                                                            {[
                                                                {
                                                                    title: "Nobody Knows Xtep",
                                                                    desc: "Discovery is the first barrier. Users encounter the brand with zero prior knowledge, making D2C first impressions critical."
                                                                },
                                                                {
                                                                    title: "Brand Name Dictates Purchase",
                                                                    desc: "Runners consistently seek community validation, comparing Xtep to legacy brands. Building peer trust is essential."
                                                                },
                                                                {
                                                                    title: "Technology is Not Communicated",
                                                                    desc: "Technical innovations like carbon plates and cushioning systems require clear, point-of-purchase digital education."
                                                                },
                                                                {
                                                                    title: "Marketplace Trust Gap",
                                                                    desc: "Doubt over third-party marketplace authenticity creates a direct opportunity for D2C verified commerce."
                                                                }
                                                            ].map((prob, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="dv-dark-card w-[85vw] max-w-[640px] min-h-[400px] flex-shrink-0 flex flex-col justify-center items-center text-center p-8 md:p-16 rounded-[24px]"
                                                                    style={{
                                                                        background: 'linear-gradient(135deg, #0C0C0C 0%, #2A0008 100%)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                                                    }}
                                                                >
                                                                    <h3 className="dv-dark-card-title text-2xl md:text-[2.25rem] font-medium leading-[1.2] tracking-[-0.01em] text-white mb-5 text-center">
                                                                        {prob.title}
                                                                    </h3>
                                                                    <p className="dv-dark-card-body text-sm md:text-[1.1rem] leading-[1.6] text-white/85 max-w-[90%] text-center">
                                                                        {prob.desc}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── 04 COMPETITIVE ANALYSIS ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-32 md:py-40" id="competitors">
                                                <div className="dv-container">
                                                    <div className="text-center mb-16">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4">04 COMPETITIVE ANALYSIS</span>
                                                        <h2 className="dv-mixed-heading">
                                                            <span className="dv-heading-bold">Where Xtep Fits</span> <em className="dv-heading-italic">in the Market</em>
                                                        </h2>
                                                        <p className="dv-subheading">
                                                            Mapping Xtep against direct and indirect competitors across dimensions that matter for the Indian running market: price, technology, community, and D2C maturity.
                                                        </p>
                                                    </div>

                                                    <div className="overflow-x-auto border border-[#E4DFD7] rounded-2xl bg-white shadow-sm mb-12">
                                                        <table className="w-full border-collapse text-left text-xs font-sans">
                                                            <thead>
                                                                <tr className="bg-[#0C0C0C] text-white">
                                                                    <th className="p-4 uppercase tracking-widest font-mono text-[9px]">Brand</th>
                                                                    <th className="p-4 uppercase tracking-widest font-mono text-[9px]">Price Range</th>
                                                                    <th className="p-4 uppercase tracking-widest font-mono text-[9px]">Carbon Tech</th>
                                                                    <th className="p-4 uppercase tracking-widest font-mono text-[9px]">Community</th>
                                                                    <th className="p-4 uppercase tracking-widest font-mono text-[9px]">D2C App</th>
                                                                    <th className="p-4 uppercase tracking-widest font-mono text-[9px]">Product Education</th>
                                                                    <th className="p-4 uppercase tracking-widest font-mono text-[9px]">India Maturity</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-[#E4DFD7]">
                                                                <tr className="bg-[#0C0C0C]/5 font-semibold text-[#0C0C0C]">
                                                                    <td className="p-4 text-[#0C0C0C] font-bold">Xtep (Emerging)</td>
                                                                    <td className="p-4">₹5,000 – ₹12,000</td>
                                                                    <td className="p-4"><span className="text-green-600 font-bold">✓</span> JLIN, 160X</td>
                                                                    <td className="p-4"><span className="text-green-600 font-bold">✓</span> XRC 2.2M</td>
                                                                    <td className="p-4 text-amber-600">Emerging</td>
                                                                    <td className="p-4 text-red-600">✗ Weak in-app</td>
                                                                    <td className="p-4 text-red-600">✗ Early stage</td>
                                                                </tr>
                                                                {[
                                                                    { name: "Nike", price: "₹8,000 – ₹25,000+", tech: "✓ ZoomX, Vaporfly", comm: "✓ Nike Run Club", d2c: "✓ Mature", edu: "✓ Excellent", mat: "✓ Dominant" },
                                                                    { name: "Adidas", price: "₹7,000 – ₹22,000+", tech: "✓ Boost, 4D", comm: "Moderate", d2c: "✓ Mature", edu: "✓ Good", mat: "✓ Dominant" },
                                                                    { name: "ASICS", price: "₹7,000 – ₹18,000", tech: "✓ MetaSpeed", comm: "Moderate", d2c: "Basic", edu: "✓ Strong", mat: "Growing" },
                                                                    { name: "Decathlon", price: "₹1,500 – ₹8,000", tech: "✗ Limited", comm: "✗ Minimal", d2c: "Basic", edu: "Moderate", mat: "✓ Strong (value)" },
                                                                    { name: "Skechers", price: "₹4,000 – ₹10,000", tech: "✗ No", comm: "✗ Minimal", d2c: "Basic", edu: "Moderate", mat: "✓ Growing fast" },
                                                                    { name: "New Balance", price: "₹7,000 – ₹20,000", tech: "✓ FuelCell", comm: "Moderate", d2c: "Basic", edu: "✓ Good", mat: "Growing" }
                                                                ].map((row, idx) => (
                                                                    <tr key={idx} className="hover:bg-[#F7F5F2] text-[#6B6762] transition-colors duration-150">
                                                                        <td className="p-4 font-semibold text-[#0C0C0C]">{row.name}</td>
                                                                        <td className="p-4">{row.price}</td>
                                                                        <td className="p-4">{row.tech}</td>
                                                                        <td className="p-4">{row.comm}</td>
                                                                        <td className="p-4">{row.d2c}</td>
                                                                        <td className="p-4">{row.edu}</td>
                                                                        <td className="p-4">{row.mat}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                                        {[
                                                            { title: "vs. Nike / Adidas", text: "Both have mature D2C apps. Xtep's opportunity is to match this performance ecosystem at a more accessible price point." },
                                                            { title: "vs. Decathlon", text: "Decathlon wins on price but lacks performance storytelling. Xtep must communicate its superior tech at point of purchase." },
                                                            { title: "vs. Skechers", text: "Skechers has achieved mass awareness. Xtep can close this gap using the D2C mobile app as the primary vehicle." }
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="group bg-white border border-[#E4DFD7] rounded-xl p-8 flex flex-col justify-center text-left shadow-sm hover:bg-[#0C0C0C] hover:border-[#0C0C0C] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer" style={{ minHeight: '180px' }}>
                                                                <div className="font-bold text-[#0C0C0C] group-hover:text-white mb-3 text-left font-sans transition-colors duration-300" style={{ fontSize: '1.375rem' }}>{item.title}</div>
                                                                <p className="text-[#6B6762] group-hover:text-white/80 leading-relaxed text-left font-sans transition-colors duration-300" style={{ fontSize: '1.05rem' }}>{item.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>

                                <div className="dv-embed !bg-transparent">
                                    {/* ── 05 STRATEGIC VALUE (Value Proposition) ── */}
                                    <section className="dv-section bg-transparent py-32 md:py-40 relative z-20" id="value">
                                        <div className="dv-container !max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
                                            <div className="text-center mb-16">
                                                <span className="text-[10px] tracking-[0.2em] font-mono text-white/40 uppercase block mb-4">05 STRATEGIC VALUE</span>
                                                <h2 className="dv-mixed-heading !text-white">
                                                    <span className="dv-heading-bold">The D2C</span> <em className="dv-heading-italic !text-white/95">Value Proposition</em>
                                                </h2>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                                {/* For Customers */}
                                                <div className="bg-white border border-[#E4DFD7] text-[#0C0C0C] rounded-3xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between">
                                                    <div>
                                                        <span className="text-xs tracking-widest font-mono text-[#6B6762] mb-4 uppercase block font-semibold">FOR CUSTOMERS</span>
                                                        <p className="text-lg md:text-xl font-bold font-sans tracking-tight text-[#0C0C0C] text-left leading-snug mb-6 pb-6 border-b border-[#E4DFD7]">
                                                            Discover performance running products with confidence — through clear product education, trusted reviews, and personalised shopping.
                                                        </p>
                                                        <ul className="flex flex-col gap-4 text-sm md:text-base text-[#0C0C0C]/80 font-sans">
                                                            {[
                                                                "Find the right shoe faster with personalised recommendations based on running style",
                                                                "Understand technology (carbon plates, cushioning) with in-app explainers",
                                                                "Buy with confidence through verified community reviews and authenticity guarantee",
                                                                "Get performance gear at 40–60% less than Nike/Adidas equivalents"
                                                            ].map((bullet, index) => (
                                                                <li key={index} className="flex items-start gap-3 leading-relaxed">
                                                                    <span className="text-[#E8002D] font-bold shrink-0 mt-0.5">&rarr;</span>
                                                                    <span>{bullet}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* For Xtep India */}
                                                <div className="bg-white border border-[#E4DFD7] text-[#0C0C0C] rounded-3xl p-8 md:p-10 shadow-md hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between">
                                                    <div>
                                                        <span className="text-xs tracking-widest font-mono text-[#6B6762] mb-4 uppercase block font-semibold font-semibold">FOR XTEP INDIA</span>
                                                        <p className="text-lg md:text-xl font-bold font-sans tracking-tight text-[#0C0C0C] text-left leading-snug mb-6 pb-6 border-b border-[#E4DFD7]">
                                                            Build brand trust, increase product discoverability, and convert India's growing running community into loyal Xtep customers.
                                                        </p>
                                                        <ul className="flex flex-col gap-4 text-sm md:text-base text-[#0C0C0C]/80 font-sans">
                                                            {[
                                                                "Reduce CAC by turning community engagement into organic acquisition",
                                                                "Achieve 45% D2C sales target through a compelling mobile-first experience",
                                                                "Gather first-party data to inform product localisation for Indian runners",
                                                                "Build brand awareness without relying on expensive offline advertising"
                                                            ].map((bullet, index) => (
                                                                <li key={index} className="flex items-start gap-3 leading-relaxed">
                                                                    <span className="text-[#E8002D] font-bold shrink-0 mt-0.5">&rarr;</span>
                                                                    <span>{bullet}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* ── 06 BUSINESS MODEL CANVAS ── */}
                                    <section className="dv-section bg-transparent py-32 md:py-40 relative z-20" id="bmc">
                                        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">
                                            <div className="text-center mb-16">
                                                <span className="text-[10px] tracking-[0.2em] font-mono text-white/40 uppercase block mb-4">06 BUSINESS MODEL CANVAS</span>
                                                <h2 className="dv-mixed-heading !text-white">
                                                    <span className="dv-heading-bold">How the</span> <em className="dv-heading-italic !text-white/95">Business Works</em>
                                                </h2>
                                                <p className="dv-subheading !text-white/60">
                                                    Mapped to Xtep's actual India operations and D2C expansion strategy.
                                                </p>
                                            </div>

                                            {/* Top & Middle Rows of standard BMC combined */}
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[#E4DFD7] border-t border-x border-[#E4DFD7] rounded-t-2xl overflow-hidden text-left">
                                                {/* Key Partners (Column 1, Row 1 & 2) */}
                                                <div className="bg-white p-4 md:p-5 flex flex-col gap-4 col-span-2 md:col-span-1 md:row-span-2 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold text-left">Key Partners</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• Retail Partners (MBOs &amp; EBOs)</li>
                                                        <li>• Logistics &amp; Last-Mile Providers</li>
                                                        <li>• Marathon Organisers (TCS, Airtel, etc.)</li>
                                                        <li>• Running Clubs &amp; XRC Chapters</li>
                                                        <li>• Technology &amp; App Partners</li>
                                                        <li>• Payment Gateway Partners</li>
                                                        <li>• Influencers &amp; Elite Athletes</li>
                                                    </ul>
                                                </div>

                                                {/* Key Activities (Column 2, Row 1) */}
                                                <div className="bg-white p-4 md:p-5 flex flex-col gap-4 col-span-1 md:row-span-1 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold text-left">Key Activities</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• E-commerce Operations</li>
                                                        <li>• Community Building (XRC)</li>
                                                        <li>• Product Development</li>
                                                        <li>• Marketing &amp; Content</li>
                                                        <li>• Retail Network Expansion</li>
                                                        <li>• App Development &amp; UX</li>
                                                    </ul>
                                                </div>

                                                {/* Value Proposition (Column 3, Row 1 & 2) */}
                                                <div className="bg-white p-4 md:p-5 flex flex-col gap-4 col-span-2 md:col-span-1 md:row-span-2 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#E8002D] uppercase font-bold text-left">Value Proposition</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• Performance running shoes at accessible prices</li>
                                                        <li>• Carbon-plate technology (JLIN, 160X series)</li>
                                                        <li>• Global running expertise localised for India</li>
                                                        <li>• Community-driven trust and peer validation</li>
                                                        <li>• Seamless D2C experience with product education</li>
                                                        <li>• Authenticity guarantee through official app</li>
                                                        <li>• Personalised onboarding &amp; recommendations</li>
                                                    </ul>
                                                </div>

                                                {/* Customer Relationships (Column 4, Row 1) */}
                                                <div className="bg-white p-4 md:p-5 flex flex-col gap-4 col-span-1 md:row-span-1 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold text-left">Customer Relationships</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• XRC Running Community</li>
                                                        <li>• Personalised Recommendations</li>
                                                        <li>• Push Notifications &amp; Offers Feed</li>
                                                        <li>• Review &amp; Rating System</li>
                                                        <li>• Loyalty Program</li>
                                                        <li>• Customer Support Chat</li>
                                                    </ul>
                                                </div>

                                                {/* Customer Segments (Column 5, Row 1 & 2) */}
                                                <div className="bg-white p-4 md:p-5 flex flex-col gap-4 col-span-2 md:col-span-1 md:row-span-2 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold text-left">Customer Segments</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• Beginner runners (discovery phase)</li>
                                                        <li>• Amateur runners (performance focus)</li>
                                                        <li>• Fitness enthusiasts (lifestyle + function)</li>
                                                        <li>• Marathon runners (carbon plate buyers)</li>
                                                        <li>• Sportswear consumers (value-conscious)</li>
                                                    </ul>
                                                </div>

                                                {/* Key Resources (Column 2, Row 2) */}
                                                <div className="bg-white p-4 md:p-5 flex flex-col gap-4 col-span-1 md:row-span-1 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold text-left">Key Resources</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• Global Brand &amp; IP Portfolio</li>
                                                        <li>• Running Technology (Carbon Plates)</li>
                                                        <li>• Manufacturing Infrastructure</li>
                                                        <li>• XRC Community Ecosystem (2.2M members)</li>
                                                        <li>• Retail Network (100+ India stores)</li>
                                                    </ul>
                                                </div>

                                                {/* Channels (Column 4, Row 2) */}
                                                <div className="bg-white p-4 md:p-5 flex flex-col gap-4 col-span-1 md:row-span-1 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold text-left">Channels</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• D2C Mobile App (This Design)</li>
                                                        <li>• D2C Website</li>
                                                        <li>• Retail EBOs (200 target)</li>
                                                        <li>• Retail MBOs (500 target)</li>
                                                        <li>• Marketplaces</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Bottom Row: Cost Structure & Revenue Streams */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E4DFD7] border border-[#E4DFD7] rounded-b-2xl overflow-hidden text-left">
                                                <div className="bg-white p-5 md:p-6 flex flex-col gap-4 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold text-left">Cost Structure</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• Manufacturing &amp; Supply Chain Operations</li>
                                                        <li>• Marketing &amp; Brand Building Initiatives</li>
                                                        <li>• Retail Expansion Infrastructure (200 EBOs)</li>
                                                        <li>• Technology &amp; App Maintenance Costs</li>
                                                        <li>• Logistics &amp; Last-Mile Delivery</li>
                                                        <li>• Community Programs (XRC)</li>
                                                        <li>• Customer Acquisition Costs</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-white p-5 md:p-6 flex flex-col gap-4 text-left">
                                                    <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold text-left">Revenue Streams</div>
                                                    <ul className="flex flex-col gap-2 text-[13px] md:text-sm text-[#0C0C0C] text-left list-none font-medium">
                                                        <li>• Footwear Sales (primary)</li>
                                                        <li>• Apparel &amp; Accessories</li>
                                                        <li>• D2C Direct Sales (45% target)</li>
                                                        <li>• Marketplace Commission Revenue</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                                    <div className="white-canvas-content w-full bg-white transition-colors duration-300 ease-out shadow-2xl origin-center" data-theme="light">
                                        <div className="dv-embed">
                                            {/* ── TYPOGRAPHY & COLOR PALETTE SECTION ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-24 md:py-32 relative overflow-hidden" id="branding-assets">
                                                <div className="dv-container max-w-[1200px] mx-auto px-6 md:px-12">
                                                    
                                                    {/* Section Header */}
                                                    <div className="text-center mb-16 md:mb-20">
                                                        <h2 className="dv-mixed-heading">
                                                            <span className="dv-heading-bold">Brand Identity</span> <em className="dv-heading-italic">and Visual Identity</em>
                                                        </h2>
                                                    </div>

                                                    {/* Brand Logo Card (Feature Card style, full width) */}
                                                    <div className="dv-feature-card border border-[#E4DFD7] shadow-lg mb-16 rounded-[40px] overflow-hidden bg-white">
                                                        <div className="dv-feature-text dv-feature-light-gray">
                                                            <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-3 font-semibold text-left">BRANDMARK</span>
                                                            <h3 className="dv-feature-heading dv-left">
                                                                The Xtep Logo
                                                            </h3>
                                                            <p className="dv-subheading dv-left">
                                                                The Xtep logo represents speed, movement, and athletic performance. The customized bold double-cross graphic emblem symbolizes energetic force and the carbon-plate running technology, while the clean geometric alignment conveys high-speed, professional footwear aesthetics.
                                                            </p>
                                                        </div>
                                                        <div className="dv-feature-visual bg-white border-t border-[#E4DFD7] md:border-t-0 md:border-l md:border-[#E4DFD7] p-12 md:p-16 flex items-center justify-center aspect-square">
                                                            <img src={XtepLogo.src} alt="Xtep Logo" className="w-[60%] md:w-[64%] max-w-[250px] md:max-w-[300px] object-contain select-none pointer-events-none transition-transform duration-300 hover:scale-[1.03]" />
                                                        </div>
                                                    </div>

                                                    {/* 2 Column Layout for Typography & Colors */}
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                                                        
                                                        {/* Column 1: Typography */}
                                                        <div className="flex flex-col gap-6">
                                                            {/* Typography Showcase Card */}
                                                            <div className="bg-[#E30613] rounded-3xl p-8 flex flex-col justify-between aspect-auto min-h-[340px] lg:aspect-[16/10] overflow-hidden relative shadow-lg text-white group hover:scale-[1.01] transition-transform duration-300 select-none">
                                                                <div className="absolute top-0 right-0 p-8 opacity-10 text-white font-dm font-bold text-[150px] leading-none pointer-events-none select-none">
                                                                    Aa
                                                                </div>
                                                                
                                                                <div className="flex justify-between items-start z-10 w-full">
                                                                    <div className="text-left">
                                                                        <div className="text-[11px] tracking-widest font-mono text-white/75 uppercase font-bold mb-1">Type Specimen</div>
                                                                        <div className="text-2xl font-dm font-bold tracking-tight">DM Sans</div>
                                                                    </div>
                                                                    <div className="text-right font-mono text-[9px] text-white/70 tracking-widest uppercase">
                                                                        SANS-SERIF
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col gap-2 z-10 text-left mt-auto">
                                                                    <div className="border-b border-white/20 pb-1.5">
                                                                        <span className="font-dm font-bold text-lg">Bold</span>
                                                                    </div>
                                                                    <div className="border-b border-white/20 pb-1.5">
                                                                        <span className="font-dm font-semibold text-lg">SemiBold</span>
                                                                    </div>
                                                                    <div className="border-b border-white/20 pb-1.5">
                                                                        <span className="font-dm font-medium text-lg">Medium</span>
                                                                    </div>
                                                                    <div className="pb-1">
                                                                        <span className="font-dm font-normal text-lg">Regular</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Typography Text Info */}
                                                            <div className="text-left mt-2">
                                                                <h3 className="text-xl md:text-2xl font-bold font-dm text-[#0C0C0C] mb-3">DM Sans Typography</h3>
                                                                <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-dm">
                                                                    We selected the clean, modern geometric typeface <strong>DM Sans</strong> for the Xtep digital experience. By leveraging <strong>Bold, SemiBold, Medium, and Regular</strong> weights, we established a robust typography system that ensures high legibility, professional visual hierarchy, and a fast, performance-driven aesthetic that aligns with Xtep's athletic brand image.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Column 2: Color Palette */}
                                                        <div className="flex flex-col gap-6">
                                                            {/* Color Palette Specimen Card */}
                                                            <div className="bg-white rounded-3xl p-8 flex flex-col justify-between aspect-auto min-h-[340px] lg:aspect-[16/10] overflow-hidden relative shadow-lg border border-[#E4DFD7] hover:scale-[1.01] transition-transform duration-300">
                                                                
                                                                {/* Floating Copy Notification */}
                                                                {copiedColor && (
                                                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 text-[#0C0C0C] px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-md z-30 flex items-center gap-1.5 animate-bounce border border-[#E4DFD7]">
                                                                        <Icon icon="solar:check-circle-bold" className="text-[#E30613] text-sm" />
                                                                        Copied {copiedColor}!
                                                                    </div>
                                                                )}

                                                                <div className="flex justify-between items-start z-10 w-full mb-6">
                                                                    <div className="text-left">
                                                                        <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold mb-1">Color Palette</div>
                                                                        <div className="text-lg font-dm font-bold text-[#0C0C0C] tracking-tight">Active Colors</div>
                                                                    </div>
                                                                    <div className="text-right font-mono text-[8px] text-[#6B6762]/70 tracking-widest uppercase">
                                                                        HOVER FOR HEX
                                                                    </div>
                                                                </div>

                                                                {/* Interactive Swatches Bar Style */}
                                                                <div className="flex h-32 md:h-40 w-full rounded-xl overflow-hidden border border-[#E4DFD7] shadow-sm bg-[#FAFAF9] mt-auto">
                                                                    {[
                                                                        { hex: "#E30613", label: "Red", darkText: false },
                                                                        { hex: "#2A2A2A", label: "Charcoal", darkText: false },
                                                                        { hex: "#FFFFFF", label: "White", darkText: true, border: true },
                                                                        { hex: "#000000", label: "Black", darkText: false },
                                                                        { hex: "#666666", label: "Dark Grey", darkText: false },
                                                                        { hex: "#8C8C8C", label: "Med Grey", darkText: false },
                                                                        { hex: "#B3B3B3", label: "Grey", darkText: true },
                                                                        { hex: "#CCCCCC", label: "Light Grey", darkText: true },
                                                                        { hex: "#E6E6E6", label: "Extra Light", darkText: true },
                                                                        { hex: "#F2F2F2", label: "Soft White", darkText: true }
                                                                    ].map((color) => (
                                                                        <button
                                                                            key={color.hex}
                                                                            onClick={() => handleCopyColor(color.hex)}
                                                                            className="flex-1 h-full relative group transition-all duration-500 hover:flex-[2.2] cursor-pointer"
                                                                            style={{ 
                                                                                backgroundColor: color.hex,
                                                                                borderLeft: color.border ? '1px solid #E4DFD7' : 'none',
                                                                                borderRight: color.border ? '1px solid #E4DFD7' : 'none'
                                                                            }}
                                                                            title={`Click to copy ${color.hex}`}
                                                                        >
                                                                            <span className={`absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[10px] font-bold tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${color.darkText ? 'text-black/80' : 'text-white/90'}`}>
                                                                                {color.hex}
                                                                            </span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Color Palette Text Info */}
                                                            <div className="text-left mt-2">
                                                                <h3 className="text-xl md:text-2xl font-bold font-dm text-[#0C0C0C] mb-3">Colour Style</h3>
                                                                <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-dm">
                                                                    We carefully selected a color style that incorporates the unique colors of each product into their respective pages. This approach allowed us to effectively communicate the story behind each product and showcase the individuality of each brand.
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── PRODUCT INTRODUCING SECTION ── */}
                                            <section className="dv-section dv-intro-section bg-white border-b border-[#E4DFD7] py-32 md:py-40 relative overflow-hidden" id="introducing">
                                                <div className="dv-container max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24 min-h-[80vh] md:min-h-screen">

                                                    {/* Left Column: Stacked Cards Deck */}
                                                    <div className="w-full md:w-1/2 flex justify-center items-center relative min-h-[500px] md:min-h-[650px]">
                                                        <div className="relative w-[252px] h-[522px] md:w-[280px] md:h-[576px] -translate-x-[20%]">
                                                            {/* 8 Cards stacked on top of each other */}
                                                            <div className="dv-intro-card absolute inset-0 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-black/5 will-change-transform">
                                                                <img src={SplashImg.src} alt="Splash Screen" className="w-full h-full object-cover select-none pointer-events-none" />
                                                            </div>
                                                            <div className="dv-intro-card absolute inset-0 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-black/5 will-change-transform">
                                                                <img src={OnboardingImg4.src} alt="Onboarding Screen 4" className="w-full h-full object-cover select-none pointer-events-none" />
                                                            </div>
                                                            <div className="dv-intro-card absolute inset-0 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-black/5 will-change-transform">
                                                                <img src={OnboardingImg2.src} alt="Onboarding Screen 2" className="w-full h-full object-cover select-none pointer-events-none" />
                                                            </div>
                                                            <div className="dv-intro-card absolute inset-0 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-black/5 will-change-transform">
                                                                <img src={OnboardingImg3.src} alt="Onboarding Screen 3" className="w-full h-full object-cover select-none pointer-events-none" />
                                                            </div>
                                                            <div className="dv-intro-card absolute inset-0 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-black/5 will-change-transform">
                                                                <img src={OnboardingImg.src} alt="Onboarding Screen 1" className="w-full h-full object-cover select-none pointer-events-none" />
                                                            </div>
                                                            <div className="dv-intro-card absolute inset-0 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-black/5 will-change-transform">
                                                                <img src={HomeImg.src} alt="Home Screen 1" className="w-full h-full object-cover select-none pointer-events-none" />
                                                            </div>
                                                            <div className="dv-intro-card absolute inset-0 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-black/5 will-change-transform">
                                                                <img src={HomeImg2.src} alt="Home Screen 2" className="w-full h-full object-cover select-none pointer-events-none" />
                                                            </div>
                                                            <div className="dv-intro-card absolute inset-0 rounded-[40px] overflow-hidden bg-white shadow-2xl border border-black/5 will-change-transform">
                                                                <img src={StoreImg3.src} alt="Store Screen 3" className="w-full h-full object-cover select-none pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Column: Text & Typography */}
                                                    <div className="w-full md:w-1/2 flex flex-col items-start text-left justify-center max-w-[500px]">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold text-left">
                                                            INTRODUCING
                                                        </span>

                                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0C0C0C] mb-6 leading-[1.1] font-sans text-left">
                                                            X-tep E-Store App
                                                        </h2>

                                                        <p className="text-base md:text-lg text-[#6B6762] leading-relaxed mb-8 font-sans text-left">
                                                            A premium, community-driven shopping ecosystem designed to bring Xtep's state-of-the-art running technology directly to India's runners. Features integrated carbon-plate education, running club synchronization, and a frictionless 3-step checkout.
                                                        </p>

                                                        <div className="flex items-center mt-2">
                                                            <img src={XtepLogo.src} alt="Xtep Logo" className="h-[100px] object-contain select-none pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── 07 UI DESIGN SYSTEM ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-32 md:py-40" id="design">
                                                <div className="dv-container">
                                                    <div className="text-center mb-16">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4">07 UI DESIGN SYSTEM</span>
                                                        <h2 className="dv-mixed-heading">
                                                            <span className="dv-heading-bold">Design Decisions</span> <em className="dv-heading-italic">Tied to Business Problems</em>
                                                        </h2>
                                                        <p className="dv-subheading">
                                                            Every screen in the Xtep E-Store app is a direct response to one of the four identified user problems. Design is not decoration: it's problem-solving.
                                                        </p>
                                                    </div>

                                                    {/* ── Dynamic marquee container ── */}
                                                    <XtepMarqueeShowcase
                                                        screens={{
                                                            onboarding: [SplashImg.src, OnboardingImg.src, OnboardingImg2.src, OnboardingImg3.src, OnboardingImg4.src],
                                                            home: [HomeImg.src, HomeImg2.src, HomeImg4.src],
                                                            store: [StoreImg.src, StoreImg2.src, StoreImg3.src],
                                                            checkout: [CheckoutImg.src, CheckoutImg2.src, CheckoutImg3.src],
                                                        }}
                                                    />

                                                </div>
                                            </section>


                                            {/* ── 08 PROJECTED IMPACT ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-32 md:py-40" id="impact">
                                                <div className="dv-container">
                                                    <div className="text-center mb-16">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4">08 PROJECTED IMPACT</span>
                                                        <h2 className="dv-mixed-heading">
                                                            <span className="dv-heading-bold">What Success</span> <em className="dv-heading-italic">Looks Like</em>
                                                        </h2>
                                                        <p className="dv-subheading">
                                                            Metrics mapped directly to Xtep India's stated business targets and the identified user problems. Each one connects design decisions to business outcomes.
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                                                        {[
                                                            { num: "45%", label: "D2C Sales Target" },
                                                            { num: "24%", label: "Annual Growth Target" },
                                                            { num: "200", label: "Target EBO Stores" },
                                                            { num: "2.2M", label: "XRC Club Members" }
                                                        ].map((metric, idx) => (
                                                            <div key={idx} className="bg-white hover:bg-[#0C0C0C] border border-[#E4DFD7] hover:border-[#0C0C0C] rounded-2xl p-8 text-center flex flex-col justify-center shadow-sm transition-colors duration-300 group">
                                                                <div className="text-3xl md:text-4xl font-sans font-bold text-[#0C0C0C] group-hover:text-white leading-none mb-3 transition-colors duration-300">{metric.num}</div>
                                                                <p className="text-sm md:text-sm text-[#6B6762] group-hover:text-white/70 font-sans leading-relaxed transition-colors duration-300">{metric.label}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                                        {[
                                                            { title: "Design is a Business Lever", text: "Every screen maps to a measurable outcome, from onboarding personalization to checkout conversion." },
                                                            { title: "Trust Must Be Designed", text: "For a challenger brand in India, every UI decision must actively build and communicate trust." },
                                                            { title: "Community is a Moat", text: "Connecting Xtep's 2.2M XRC members to D2C commerce creates a self-sustaining growth flywheel." },
                                                            { title: "Omnichannel Architecture", text: "The D2C app functions as a digital extension of physical stores, marathon events, and communities." }
                                                        ].map((learning, idx) => (
                                                            <div key={idx} className="bg-white hover:bg-[#0C0C0C] border border-[#E4DFD7] hover:border-[#0C0C0C] rounded-2xl p-8 flex flex-col justify-center text-left shadow-sm transition-colors duration-300 group" style={{ minHeight: '160px' }}>
                                                                <div className="font-bold text-[#0C0C0C] group-hover:text-white mb-3 text-left font-sans transition-colors duration-300" style={{ fontSize: '1.375rem' }}>{learning.title}</div>
                                                                <p className="text-[#6B6762] group-hover:text-white/70 leading-relaxed text-left font-sans transition-colors duration-300" style={{ fontSize: '1.05rem' }}>{learning.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── 09 LIVE WEBSITE AUDIT ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-32 md:py-40" id="audit">
                                                <div className="dv-container">
                                                    <div className="text-center mb-16">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">09 LIVE WEBSITE AUDIT: XTEPINDIA.COM</span>
                                                        <h2 className="dv-mixed-heading">
                                                            <span className="dv-heading-bold">Why the Website</span> <em className="dv-heading-italic">Isn't Working</em>
                                                        </h2>
                                                        <p className="dv-subheading">
                                                            The website exists: a live Shopify store. But it's operated as a product catalogue when it needs to function as a brand-building and trust-building ecosystem. Sourced directly from the live site.
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
                                                        {[
                                                            { title: "Generic Shopify Theme", text: "No custom development, with zero brand differentiation at the infrastructure level." },
                                                            { title: "Pricing: Permanent Discounts", text: "Every product is always discounted. MRP becomes fiction, destroying profit margin and brand equity." },
                                                            { title: "Catalogue, Not Ecosystem", text: "The site lists products without brand-building, customer education, or community integration." }
                                                        ].map((verdict, idx) => (
                                                            <div key={idx} className="bg-white hover:bg-[#0C0C0C] border border-[#E4DFD7] hover:border-[#0C0C0C] rounded-2xl p-8 flex flex-col gap-4 text-left transition-colors duration-300 group shadow-sm">
                                                                <div className="font-bold font-sans text-[#0C0C0C] group-hover:text-white text-left transition-colors duration-300" style={{ fontSize: '1.25rem' }}>{verdict.title}</div>
                                                                <p className="text-sm text-[#6B6762] group-hover:text-white/70 leading-relaxed font-sans text-left transition-colors duration-300">{verdict.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 text-left">
                                                        {[
                                                            { title: "Zero Product Education", text: "Technology explainers exist only on the homepage, disappearing on product detail pages." },
                                                            { title: "Permanent Discounts", text: "When everything is always on sale, margins collapse and the brand is perceived as cheap." },
                                                            { title: "Incoherent Naming", text: "Product names have no consistent logic, making it impossible to understand the range." },
                                                            { title: "XRC Community Omitted", text: "Xtep's global strategy centers on XRC, but the community is entirely absent from the India site." },
                                                            { title: "Non-Local Athlete Proof", text: "Featured elite runners are all global, offering no relevance to Indian running culture." },
                                                            { title: "Missing Social Proof", text: "The homepage lacks customer reviews, runner stories, user-generated content, or rating feeds." },
                                                            { title: "Dead-End Tech Page", text: "The technology page lists terms without mapping them to specific products or benefits." },
                                                            { title: "What the App Solves", text: "Education at point of purchase, XRC connected to commerce, peer reviews as trust signals, and personalised onboarding." }
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="bg-white hover:bg-[#0C0C0C] border border-[#E4DFD7] hover:border-[#0C0C0C] rounded-2xl p-8 flex flex-col gap-3 text-left transition-colors duration-300 group shadow-sm">
                                                                <div className="font-bold font-sans text-[#0C0C0C] group-hover:text-white text-left transition-colors duration-300" style={{ fontSize: '1.15rem' }}>{item.title}</div>
                                                                <p className="text-sm text-[#6B6762] group-hover:text-white/70 leading-relaxed font-sans text-left transition-colors duration-300">{item.text}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="bg-white border border-[#E4DFD7] rounded-2xl p-8 max-w-4xl mx-auto shadow-sm">
                                                        <p className="text-xs md:text-sm text-[#6B6762] leading-relaxed font-sans">
                                                            The website has good bones: the technology sections exist, the product range is solid, the Shopify infrastructure works. But it is being operated as a <em>product catalogue when it needs to function as a brand-building ecosystem.</em> The gap between what Xtep says it is and what the website actually does is where every conversion goes to die. The app is the right answer, but only if the underlying brand strategy changes alongside it.
                                                        </p>
                                                    </div>
                                                </div>
                                            </section>

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

                                            <Link href="/projects/mclaren-racing" className="w-full sm:w-1/2 p-12 md:p-24 lg:p-32 flex flex-col items-end justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Next Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:translate-x-2 transition-all duration-500 leading-none pb-1">McLaren Racing</h3>
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

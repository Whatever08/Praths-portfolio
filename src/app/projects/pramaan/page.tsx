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

import deviceFrame1 from "./deviceframes-1.png";
import deviceFrame2 from "./deviceframes-2.png";
import deviceFrame3 from "./deviceframes-3.png";

gsap.registerPlugin(ScrollTrigger);

// Custom Background Colors for Pramaan (Cyber Blue & Navy Shades)
const PAGE_COLORS = {
    uColor1: [0.0, 0.3, 0.8],       // Electric Blue
    uColor2: [0.02, 0.05, 0.15],    // Dark Blue
    uColor3: [0.0, 0.15, 0.5],      // Cobalt Blue
    uColor4: [0.01, 0.02, 0.08],    // Deep Navy/Black
    uColor5: [0.0, 0.3, 0.8],
    uColor6: [0.02, 0.05, 0.15]
};

// ─── InsightCarousel ─────────────────────────────────────────────────────────
const INSIGHTS = [
    { num: "01", stat: "100%",  title: "Victims are not careless",       body: "Every victim trusted what appeared to be an official source. They are systematically exploited through sophisticated social engineering that weaponises trust, urgency, and technological unfamiliarity." },
    { num: "02", stat: "7 hrs", title: "Speed is everything",            body: "The average delay between fraud and FIR ensures criminals escape. Real-time detection and instant account freezing are the only meaningful interventions." },
    { num: "03", stat: "3",     title: "Fragmentation enables crime",    body: "Banks, police, and telecom operate in complete silos. Criminals exploit coordination gaps to move money through mule account networks before anyone can act." },
    { num: "04", stat: "₹0",   title: "Invisible theft pattern",        body: "No OTPs, no notifications, phone never leaves hand. Session hijacking defeats traditional security measures entirely. ₹28,500 stolen with zero alerts." },
    { num: "05", stat: "3 PM", title: "Peak exploitation times",      body: "Festivals, Sundays, 3 PM when banks close. Victims are distracted and institutions unavailable precisely when help is needed most." },
    { num: "06", stat: "₹40K",  title: "Trust is the weapon",           body: "Scammers who know personal details bypass all critical thinking. Official sounding language with personal data creates false legitimacy that overrides rational judgment." },
];

function InsightCarousel() {
    const [active, setActive] = useState(0);
    const total = INSIGHTS.length;
    // Show 3 per page on desktop → 2 pages (0-2, 3-5)
    const perPage = 3;
    const pages = Math.ceil(total / perPage);

    const prev = () => setActive((p) => (p - 1 + pages) % pages);
    const next = () => setActive((p) => (p + 1) % pages);

    const visible = INSIGHTS.slice(active * perPage, active * perPage + perPage);

    return (
        <div className="max-w-6xl mx-auto select-none reveal-section">
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"
                 style={{ minHeight: '320px' }}>
                {visible.map((ins, idx) => (
                    <div
                        key={`${active}-${idx}`}
                        className="reveal-item group bg-white border border-[#E4DFD7] hover:border-[#0C0C0C] rounded-3xl p-8 flex flex-col text-left shadow-sm hover:bg-[#0C0C0C] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-default"
                        style={{ transitionDelay: `${idx * 60}ms` }}
                    >
                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#0C0C0C] group-hover:text-white uppercase font-bold mb-4 block transition-colors duration-300">
                            INSIGHT {ins.num}
                        </span>
                        <div className="text-4xl md:text-5xl font-black font-sans text-[#0C0C0C] group-hover:text-white mb-4 leading-none tracking-tight transition-colors duration-300">
                            {ins.stat}
                        </div>
                        <div className="text-lg md:text-xl font-bold font-sans text-[#0C0C0C] group-hover:text-white mb-3 leading-snug transition-colors duration-300">
                            {ins.title}
                        </div>
                        <p className="text-sm md:text-base text-[#6B6762] group-hover:text-white/85 leading-relaxed font-sans font-normal transition-colors duration-300">
                            {ins.body}
                        </p>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
                {/* Prev */}
                <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-[#E4DFD7] bg-white hover:bg-[#0C0C0C] hover:border-[#0C0C0C] flex items-center justify-center transition-all duration-200 group/btn"
                    aria-label="Previous"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#0C0C0C] group-hover/btn:text-white transition-colors duration-200">
                        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                    {Array.from({ length: pages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`rounded-full transition-all duration-300 ${
                                i === active
                                    ? "w-6 h-2 bg-[#0C0C0C]"
                                    : "w-2 h-2 bg-[#E4DFD7] hover:bg-[#6B6762]"
                            }`}
                            aria-label={`Go to page ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Next */}
                <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-[#E4DFD7] bg-white hover:bg-[#0C0C0C] hover:border-[#0C0C0C] flex items-center justify-center transition-all duration-200 group/btn"
                    aria-label="Next"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#0C0C0C] group-hover/btn:text-white transition-colors duration-200">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            <style>{`
                @keyframes insightFadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

// ─── PramaanMarqueeShowcase ──────────────────────────────────────────────────
const MARQUEE_CATEGORIES = [
    {
        id: "01",
        heading: "Evidence Ingestion",
        description: "Real-time cryptographic hashing and logging tracks log files directly to verify and record evidence chains securely.",
    },
    {
        id: "02",
        heading: "Forensics Node Mapper",
        description: "Interactive network visualization maps attacker IP addresses, payment routing, and compromised systems.",
    },
    {
        id: "03",
        heading: "Sandbox Simulation",
        description: "Real-time emulation environment teaches cyber analysts to investigate evolving attack flows under realistic conditions.",
    },
    {
        id: "04",
        heading: "Log Standardisation",
        description: "Guided reporting layouts translate chaotic alerts into standardized, cross-sector cybersecurity threat intelligence.",
    },
];

type MarqueeScreens = {
    ingestion: string[];
    mapper: string[];
    sandbox: string[];
    reporting: string[];
};

function PramaanMarqueeShowcase({ screens }: { screens: MarqueeScreens }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [visible, setVisible] = useState(true);
    const trackRef = useRef<HTMLDivElement>(null);
    const pendingRef = useRef<number | null>(null);

    const buildCards = () => {
        const groups: { src: string; alt: string; catIdx: number }[][] = [
            screens.ingestion.map((src, i) => ({ src, alt: `Ingestion UI ${i + 1}`, catIdx: 0 })),
            screens.mapper.map((src, i) => ({ src, alt: `Mapper UI ${i + 1}`, catIdx: 1 })),
            screens.sandbox.map((src, i) => ({ src, alt: `Sandbox UI ${i + 1}`, catIdx: 2 })),
            screens.reporting.map((src, i) => ({ src, alt: `Reporting UI ${i + 1}`, catIdx: 3 })),
        ];
        return groups.flat();
    };

    const cards = buildCards();
    const allCards = [...cards, ...cards];

    const switchCategory = (idx: number) => {
        if (pendingRef.current !== null) clearTimeout(pendingRef.current);
        setVisible(false);
        pendingRef.current = window.setTimeout(() => {
            setActiveIdx(idx);
            setVisible(true);
        }, 320);
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

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
                root: track.parentElement,
                rootMargin: "0px -45% 0px -45%",
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
                <div
                    className="inline-flex items-center gap-2 bg-[#0066FF]/8 rounded-full px-4 py-1 mb-5"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(-8px)",
                        transition: "opacity 0.32s ease, transform 0.32s ease",
                    }}
                >
                    <span className="text-[10px] font-mono font-bold text-[#0066FF]">{cat.id}</span>
                    <span className="text-[10px] font-mono text-[#6B6762] uppercase tracking-widest">&bull;</span>
                    <span className="text-[10px] font-mono text-[#6B6762] uppercase tracking-wider font-semibold">FORENSICS PLATFORM</span>
                </div>

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

                <div className="flex items-center gap-2 mt-4">
                    {MARQUEE_CATEGORIES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => switchCategory(i)}
                            className={`rounded-full transition-all duration-300 ${i === activeIdx
                                    ? "w-6 h-2 bg-[#0066FF]"
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
                    @keyframes pramaan-marquee {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .pramaan-marquee {
                        display: flex;
                        gap: 24px;
                        width: max-content;
                        animation: pramaan-marquee 42s linear infinite;
                        will-change: transform;
                    }
                    .pramaan-marquee:hover {
                        animation-play-state: paused;
                    }
                `}</style>

                <div className="pramaan-marquee" ref={trackRef}>
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
                                className="relative flex-shrink-0 w-[300px] md:w-[400px] aspect-[16/10] group flex items-center justify-center border border-[#E4DFD7]/60 rounded-xl overflow-hidden shadow-sm bg-white"
                                {...(isFirstOfCat ? { "data-sentinel": String(card.catIdx) } : {})}
                            >
                                <img
                                    src={card.src}
                                    alt={card.alt}
                                    className="w-full h-full object-cover scale-[0.96] select-none pointer-events-none transition-transform duration-500 group-hover:scale-100"
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

// ─── CONFIGURATION FOR DESKTOP MOBILE MOCKUP POSITIONS ─────────────────────
// You can edit the values below to easily adjust the placement, rotation,
// and overlaps of the three device mockups.
const MOCKUP_LAYOUT_CONFIG = [
    {
        // CARD 1: Left Phone (Welcome Screen)
        rotate: -7,
        translateY: 1,
        translateX: 142,
        scale: 1.07,
        zIndex: 30,
    },
    {
        // CARD 2: Center Phone (Report Scam)
        rotate: 0,
        translateY: -7,
        translateX: 0,
        scale: 1.12,
        zIndex: 20,
    },
    {
        // CARD 3: Right Phone (Awareness Hub)
        rotate: 0,
        translateY: 0,
        translateX: -180,
        scale: 1.12,
        zIndex: 10,
    }
];

function PramaanMobileMockups() {
    const [isMobile, setIsMobile] = useState(false);
    const mockupContainerRef = useRef<HTMLDivElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDev, setIsDev] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [mockupConfig, setMockupConfig] = useState(MOCKUP_LAYOUT_CONFIG);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        
        if (typeof window !== "undefined") {
            setIsDev(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
        }
        
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!mockupContainerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsRevealed(true);
                } else if (entry.boundingClientRect.top > 0) {
                    // Only reset when scrolling back up past the element
                    setIsRevealed(false);
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(mockupContainerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleValChange = (idx: number, field: "rotate" | "translateX" | "translateY" | "scale", value: number) => {
        setMockupConfig((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: value };
            return next;
        });
    };

    const getStyle = (idx: number) => {
        let transform = "";
        let zIndex = 10;
        let opacity = 1;

        if (!isRevealed) {
            // Hidden state: slide in from the right and fade out
            transform = isMobile
                ? "translateX(150px) translateY(0px) rotate(0deg) scale(0.95)"
                : "translateX(350px) translateY(0px) rotate(0deg) scale(0.95)";
            opacity = 0;
            zIndex = 10;
        } else if (isMobile) {
            // Mobile fan: overlap phones horizontally just like desktop
            if (idx === 0) {
                transform = "rotate(-7deg) translateX(70px) translateY(6px) scale(1.0)";
                zIndex = 30;
            } else if (idx === 1) {
                transform = "rotate(0deg) translateX(0px) translateY(-6px) scale(1.08)";
                zIndex = 20;
            } else {
                transform = "rotate(0deg) translateX(-80px) translateY(0px) scale(1.08)";
                zIndex = 10;
            }
            opacity = 1;
        } else {
            // Desktop Dynamic Layout Configuration
            const cfg = mockupConfig[idx] || { rotate: 0, translateY: 0, translateX: 0, scale: 0.96, zIndex: 10 };
            transform = `rotate(${cfg.rotate}deg) translateY(${cfg.translateY}px) translateX(${cfg.translateX}px) scale(${cfg.scale})`;
            zIndex = cfg.zIndex;
            opacity = 1;
        }

        const delay = isRevealed ? `${idx * 150}ms` : "0ms";

        return {
            transform,
            zIndex,
            opacity,
            transition: "all 1.0s cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: delay,
        };
    };

    return (
        <div ref={mockupContainerRef} className="w-full flex flex-col items-center justify-center mt-12 md:mt-20 select-none overflow-visible">
            {/* ── CENTER PHONE MOCKUPS ── */}
            <div className="flex flex-row items-center justify-center gap-0 md:gap-4 lg:gap-8 min-h-[300px] md:min-h-[640px] w-full max-w-4xl overflow-visible relative z-20">
                
                {/* ── PHONE 1: WELCOME SCREEN (LEFT) ── */}
                <div 
                    className="relative flex-shrink-0 cursor-pointer"
                    style={getStyle(0)}
                >
                    <img 
                        src={deviceFrame3.src} 
                        alt="Welcome Screen Mockup"
                        className="h-[260px] md:h-[540px] w-auto object-contain pointer-events-none select-none drop-shadow-[0_25px_50px_rgba(15,23,42,0.15)]"
                    />
                </div>

                {/* ── PHONE 2: REPORT SCAM (CENTER) ── */}
                <div 
                    className="relative flex-shrink-0 cursor-pointer"
                    style={getStyle(1)}
                >
                    <img 
                        src={deviceFrame2.src} 
                        alt="Report Scam Mockup"
                        className="h-[260px] md:h-[540px] w-auto object-contain pointer-events-none select-none drop-shadow-[0_25px_50px_rgba(15,23,42,0.15)]"
                    />
                </div>

                {/* ── PHONE 3: AWARENESS HUB (RIGHT) ── */}
                <div 
                    className="relative flex-shrink-0 cursor-pointer"
                    style={getStyle(2)}
                >
                    <img 
                        src={deviceFrame1.src} 
                        alt="Awareness Hub Mockup"
                        className="h-[260px] md:h-[540px] w-auto object-contain pointer-events-none select-none drop-shadow-[0_25px_50px_rgba(15,23,42,0.15)]"
                    />
                </div>

            </div>

            {/* ── USP CARDS GRID (Aligned at the bottom) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-6 mt-16 md:mt-24 z-30">
                {/* Proof */}
                <div 
                    className={`flex flex-col p-6 rounded-[24px] border border-[#E4DFD7] bg-white/70 backdrop-blur-md shadow-sm transition-all duration-700 ease-out hover:shadow-md hover:scale-[1.02] hover:border-[#0066FF]/40 cursor-default justify-start items-start text-left
                        ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: isRevealed ? "100ms" : "0ms" }}
                >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#0066FF]/10 text-[#0066FF] mb-4">
                        <Icon icon="lucide:lock" className="w-5 h-5" />
                    </div>
                    <h4 className="text-base md:text-lg lg:text-xl font-bold font-sans text-[#0C0C0C] tracking-tight mb-2 uppercase">Proof</h4>
                    <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans font-normal">
                        Secure, legally strong evidence with clear chain of custody and encrypted uploads. Every file can stand up in court.
                    </p>
                </div>

                {/* Protect */}
                <div 
                    className={`flex flex-col p-6 rounded-[24px] border border-[#E4DFD7] bg-white/70 backdrop-blur-md shadow-sm transition-all duration-700 ease-out hover:shadow-md hover:scale-[1.02] hover:border-[#0066FF]/40 cursor-default justify-start items-start text-left
                        ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: isRevealed ? "200ms" : "0ms" }}
                >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#0066FF]/10 text-[#0066FF] mb-4">
                        <Icon icon="lucide:shield" className="w-5 h-5" />
                    </div>
                    <h4 className="text-base md:text-lg lg:text-xl font-bold font-sans text-[#0C0C0C] tracking-tight mb-2 uppercase">Protect</h4>
                    <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans font-normal">
                        Ongoing protection through scam alerts, detection scenarios, and practical tips that help you avoid scams before they happen.
                    </p>
                </div>

                {/* Empower */}
                <div 
                    className={`flex flex-col p-6 rounded-[24px] border border-[#E4DFD7] bg-white/70 backdrop-blur-md shadow-sm transition-all duration-700 ease-out hover:shadow-md hover:scale-[1.02] hover:border-[#0066FF]/40 cursor-default justify-start items-start text-left
                        ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: isRevealed ? "300ms" : "0ms" }}
                >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#0066FF]/10 text-[#0066FF] mb-4">
                        <Icon icon="lucide:zap" className="w-5 h-5" />
                    </div>
                    <h4 className="text-base md:text-lg lg:text-xl font-bold font-sans text-[#0C0C0C] tracking-tight mb-2 uppercase">Empower</h4>
                    <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans font-normal">
                        You always control what is scanned or shared. Review and deselect evidence through simple, jargon-free flows.
                    </p>
                </div>

                {/* Community */}
                <div 
                    className={`flex flex-col p-6 rounded-[24px] border border-[#E4DFD7] bg-white/70 backdrop-blur-md shadow-sm transition-all duration-700 ease-out hover:shadow-md hover:scale-[1.02] hover:border-[#0066FF]/40 cursor-default justify-start items-start text-left
                        ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: isRevealed ? "150ms" : "0ms" }}
                >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#0066FF]/10 text-[#0066FF] mb-4">
                        <Icon icon="lucide:users" className="w-5 h-5" />
                    </div>
                    <h4 className="text-base md:text-lg lg:text-xl font-bold font-sans text-[#0C0C0C] tracking-tight mb-2 uppercase">Community</h4>
                    <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans font-normal">
                        Learn from shared scam examples, discussions, and alerts. Turn individual experiences into collective defence.
                    </p>
                </div>

                {/* Clarity */}
                <div 
                    className={`flex flex-col p-6 rounded-[24px] border border-[#E4DFD7] bg-white/70 backdrop-blur-md shadow-sm transition-all duration-700 ease-out hover:shadow-md hover:scale-[1.02] hover:border-[#0066FF]/40 cursor-default justify-start items-start text-left
                        ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: isRevealed ? "250ms" : "0ms" }}
                >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#0066FF]/10 text-[#0066FF] mb-4">
                        <Icon icon="lucide:compass" className="w-5 h-5" />
                    </div>
                    <h4 className="text-base md:text-lg lg:text-xl font-bold font-sans text-[#0C0C0C] tracking-tight mb-2 uppercase">Clarity</h4>
                    <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans font-normal">
                        Plain language, 5-step guided journeys, and progress indicators so anyone can use it confidently without confusion.
                    </p>
                </div>

                {/* Gamified Learning */}
                <div 
                    className={`flex flex-col p-6 rounded-[24px] border border-[#E4DFD7] bg-white/70 backdrop-blur-md shadow-sm transition-all duration-700 ease-out hover:shadow-md hover:scale-[1.02] hover:border-[#0066FF]/40 cursor-default justify-start items-start text-left
                        ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ transitionDelay: isRevealed ? "350ms" : "0ms" }}
                >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#0066FF]/10 text-[#0066FF] mb-4">
                        <Icon icon="lucide:award" className="w-5 h-5" />
                    </div>
                    <h4 className="text-base md:text-lg lg:text-xl font-bold font-sans text-[#0C0C0C] tracking-tight mb-2 uppercase">Gamified Learning</h4>
                    <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans font-normal">
                        Quizzes, scenarios, badges, and leaderboards make scam awareness engaging and reward progress in building "scam sense."
                    </p>
                </div>
            </div>

            {/* ── LOCAL DEVELOMENT MOCKUP LAYOUT EDITOR ── */}
            {isDev && (
                <div className="mt-12 w-full max-w-xl px-4 z-40">
                    <button
                        onClick={() => setShowEditor(!showEditor)}
                        className="w-full py-3 px-6 rounded-2xl border border-[#E4DFD7] bg-white hover:bg-[#FAFAF9] text-[#0C0C0C] font-mono text-xs font-bold flex items-center justify-between transition-colors shadow-sm cursor-pointer"
                    >
                        <span>{showEditor ? "✕ CLOSE LAYOUT EDITOR" : "⚙️ OPEN INTERACTIVE LAYOUT EDITOR"}</span>
                        <span className="text-[10px] bg-[#E4DFD7] px-2 py-0.5 rounded font-mono font-normal">LOCALHOST ONLY</span>
                    </button>

                    {showEditor && (
                        <div className="mt-4 p-6 rounded-3xl bg-white border border-[#E4DFD7] shadow-sm text-[#0C0C0C] space-y-6">
                            <div className="flex items-center justify-between border-b border-[#E4DFD7] pb-3">
                                <h4 className="text-xs font-bold font-mono tracking-wider text-[#6B6762]">EDIT PHONE POSITIONING</h4>
                                <button 
                                    onClick={() => setMockupConfig(MOCKUP_LAYOUT_CONFIG)} 
                                    className="text-[10px] font-mono font-bold text-[#0066FF] hover:underline cursor-pointer"
                                >
                                    RESET TO DEFAULT
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {mockupConfig.map((cfg, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                                            <span className="text-[#6B6762]">CARD {idx + 1}:</span>
                                            <span className="text-[#0C0C0C]">
                                                {idx === 0 ? "Left Phone (Welcome)" : idx === 1 ? "Center Phone (Report)" : "Right Phone (Hub)"}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* translateX */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6762]">
                                                    <span>Translate X:</span>
                                                    <span className="font-bold text-[#0C0C0C]">{cfg.translateX}px</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="-300" 
                                                    max="300" 
                                                    value={cfg.translateX} 
                                                    onChange={(e) => handleValChange(idx, "translateX", parseInt(e.target.value))}
                                                    className="w-full accent-[#0066FF] cursor-pointer"
                                                />
                                            </div>

                                            {/* translateY */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6762]">
                                                    <span>Translate Y:</span>
                                                    <span className="font-bold text-[#0C0C0C]">{cfg.translateY}px</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="-200" 
                                                    max="200" 
                                                    value={cfg.translateY} 
                                                    onChange={(e) => handleValChange(idx, "translateY", parseInt(e.target.value))}
                                                    className="w-full accent-[#0066FF] cursor-pointer"
                                                />
                                            </div>

                                            {/* rotate */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6762]">
                                                    <span>Rotation:</span>
                                                    <span className="font-bold text-[#0C0C0C]">{cfg.rotate}°</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="-45" 
                                                    max="45" 
                                                    value={cfg.rotate} 
                                                    onChange={(e) => handleValChange(idx, "rotate", parseInt(e.target.value))}
                                                    className="w-full accent-[#0066FF] cursor-pointer"
                                                />
                                            </div>

                                            {/* scale */}
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6762]">
                                                    <span>Scale:</span>
                                                    <span className="font-bold text-[#0C0C0C]">{cfg.scale}</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="0.5" 
                                                    max="1.5" 
                                                    step="0.01"
                                                    value={cfg.scale} 
                                                    onChange={(e) => handleValChange(idx, "scale", parseFloat(e.target.value))}
                                                    className="w-full accent-[#0066FF] cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Output config code */}
                            <div className="mt-6 pt-4 border-t border-[#E4DFD7] space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-[#6B6762]">CURRENT LAYOUT CODE (COPY & PASTE TO MOCKUP_LAYOUT_CONFIG):</span>
                                    <button
                                        onClick={() => {
                                            const codeStr = JSON.stringify(mockupConfig, null, 4);
                                            navigator.clipboard.writeText(codeStr);
                                        }}
                                        className="text-[10px] font-mono font-bold bg-[#0066FF] hover:bg-[#0055DD] text-white px-2.5 py-1 rounded transition-colors cursor-pointer"
                                    >
                                        COPY JSON
                                    </button>
                                </div>
                                <pre className="text-[10px] font-mono bg-[#FAFAF9] p-3 rounded-lg border border-[#E4DFD7] text-[#0C0C0C] overflow-x-auto select-all leading-normal">
                                    {`const MOCKUP_LAYOUT_CONFIG = ${JSON.stringify(mockupConfig, null, 4)};`}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Victim Experience Journeys Data ─────────────────────────────────────────
const JOURNEYS_DATA = {
    mngl: {
        title: "MNGL Gas Scam Journey",
        subtitle: "How a simple utility bill leads to ₹40,000 theft",
        themeColor: "#FF3D00",
        steps: [
            {
                id: "1",
                time: "0 min",
                emotion: "Fear",
                title: "Receives call from \"MNGL staff\"",
                description: "Panic about unpaid bill",
                icon: "lucide:phone-call"
            },
            {
                id: "2",
                time: "5 min",
                emotion: "Trust",
                title: "Downloads \"official app\"",
                description: "Trust + Urgency = Downloads APK",
                icon: "lucide:download"
            },
            {
                id: "3",
                time: "7 min",
                emotion: "Compliance",
                title: "Grants permissions",
                description: "Remote access gained",
                icon: "lucide:shield-alert"
            },
            {
                id: "4",
                time: "10 min",
                emotion: "Cooperation",
                title: "Asked for ₹1 test payment",
                description: "Opens Google Pay",
                icon: "lucide:credit-card"
            },
            {
                id: "5",
                time: "12 min",
                emotion: "Shock",
                title: "₹40,000 stolen instead of ₹1",
                description: "Social media accounts hacked",
                icon: "lucide:alert-triangle"
            },
            {
                id: "6",
                time: "2 hours",
                emotion: "Helplessness",
                title: "Files police complaint",
                description: "Within 2 hours with no refund",
                icon: "lucide:file-text"
            }
        ]
    },
    drain: {
        title: "Silent Account Drain Journey",
        subtitle: "Money disappears without a trace, no OTP, no notification",
        themeColor: "#7C4DFF",
        steps: [
            {
                id: "1",
                time: "3:00 PM",
                emotion: "Normal",
                title: "Preparing Diwali orders at 3 PM",
                description: "Opens banking app for payment",
                icon: "lucide:shopping-bag"
            },
            {
                id: "2",
                time: "3:01 PM",
                emotion: "Shock",
                title: "Sees ₹0 balance",
                description: "Confusion and panic",
                icon: "lucide:wallet"
            },
            {
                id: "3",
                time: "3:05 PM",
                emotion: "Panic",
                title: "₹28,500 gone at 11 AM",
                description: "4 hour gap already lost",
                icon: "lucide:clock"
            },
            {
                id: "4",
                time: "3:10 PM",
                emotion: "Confusion",
                title: "No OTPs, phone never left hand",
                description: "Invisible theft",
                icon: "lucide:smartphone"
            },
            {
                id: "5",
                time: "4:00 PM",
                emotion: "Frustration",
                title: "Rushes to bank",
                description: "Told \"transaction from registered device\"",
                icon: "lucide:landmark"
            },
            {
                id: "6",
                time: "5:00 PM",
                emotion: "Despair",
                title: "Bank refuses reversal",
                description: "Money already dispersed with no recovery",
                icon: "lucide:x-circle"
            }
        ]
    },
    gap: {
        title: "Institutional Coordination Gap",
        subtitle: "The bureaucratic maze that lets criminals escape",
        themeColor: "#FF1744",
        steps: [
            {
                id: "1",
                time: "0 min",
                emotion: "Panic",
                title: "Victim discovers fraud",
                description: "Critical: Golden hour starts",
                icon: "lucide:alert-circle"
            },
            {
                id: "2",
                time: "+30 min",
                emotion: "Frustration",
                title: "Calls bank (30 min wait)",
                description: "Told to visit branch",
                icon: "lucide:phone"
            },
            {
                id: "3",
                time: "+2.5 hours",
                emotion: "Anxiety",
                title: "Visits bank branch",
                description: "2 hours travel + queue",
                icon: "lucide:landmark"
            },
            {
                id: "4",
                time: "+3.5 hours",
                emotion: "Exhaustion",
                title: "Told to get police complaint first",
                description: "Goes to police station (1 hour travel)",
                icon: "lucide:route"
            },
            {
                id: "5",
                time: "+6.5 hours",
                emotion: "Hope fading",
                title: "Manual FIR filing",
                description: "Takes 3 hours",
                icon: "lucide:file-signature"
            },
            {
                id: "6",
                time: "+7 hours",
                emotion: "Defeat",
                title: "Money already gone",
                description: "Withdrawn from mule accounts",
                icon: "lucide:ban"
            }
        ]
    }
};

// ─── Research & Context Maps Data ──────────────────────────────────────────
const MAPS_DATA = {
    context: {
        id: "context",
        label: "Context Map",
        title: "Lived Experience Mapping",
        subtitle: "Mapping victim feelings and emotional trajectories across shock, humiliation, and digital banking anxiety",
        image: "/context_mapping.png",
        figmaLink: "https://www.figma.com/slides/m3yldhvRxJ9zo0sM3iYbet/Cyber-Crime-Case-Study--Final?node-id=75-212&t=I4guL1xaUsfLosii-4",
        description: "Context mapping reveals the emotional landscape of users experiencing fraud, highlighting feelings of shock, humiliation, and anxiety about digital banking. Understanding these insights can guide the development of more effective support systems that address both emotional and practical needs.",
        cards: [
            {
                title: "Emotional Landscape",
                text: "Understanding these insights guides the development of more effective support systems that address both emotional and practical needs."
            },
            {
                title: "Core Trajectories",
                text: "Victims transition quickly from panic to shame, making them less likely to report fraud early. Designing for these emotions reduces reporting friction."
            }
        ]
    },
    stakeholder: {
        id: "stakeholder",
        label: "Stakeholder Map",
        title: "Stakeholder Map & Power Matrix",
        subtitle: "Primary, Secondary & Tertiary Actors",
        image: "/pramaan_stakeholder_map.png",
        figmaLink: "https://www.figma.com/slides/m3yldhvRxJ9zo0sM3iYbet/Cyber-Crime-Case-Study--Final?node-id=76-323&t=I4guL1xaUsfLosii-4",
        description: "The stakeholder map plots the various agencies, organizations, and individuals involved in the cyber fraud response ecosystem. This identifies key touchpoints and highlights where user groups have high interest but low power to influence the overall system.",
        cards: [
            {
                title: "Power \\ Interest Dynamics",
                text: "Government bodies and banks hold highest power and influence, while individual victims face the most risk but have limited ability to change policies or systems."
            },
            {
                title: "Key Touchpoints",
                text: "Telecom providers, cybercrime police, and UPI platforms are the critical links where coordinated communication is required to prevent mule account movement."
            }
        ]
    },
    ecosystem: {
        id: "ecosystem",
        label: "Ecosystem Map",
        title: "Ecosystem Map 1",
        subtitle: "Connected Systems & Flow Gaps",
        image: "/pramaan_ecosystem_map.png",
        figmaLink: "https://www.figma.com/slides/m3yldhvRxJ9zo0sM3iYbet/Cyber-Crime-Case-Study--Final?node-id=82-568&t=I4guL1xaUsfLosii-4",
        description: "This map traces the flow of data, funds, and communications between fraud victims, banks, tech companies, and authorities.",
        cards: [
            {
                title: "Conclusion",
                text: "The ecosystem map shows that identity fraud on social media is caused by many connected actors and systems. Fraudsters exploit victims through platforms, while victims must rely on banks, tech companies, and authorities for help. However, gaps and dependencies between all these players often leave victims unsupported and allow fraudsters to succeed."
            },
            {
                title: "Coordination Gaps",
                text: "Critical delays occur because banks, police, and telecom companies operate in silos. Fraudsters exploit these gaps to move funds before the victims can file an official complaint."
            }
        ]
    },
    taxonomy: {
        id: "taxonomy",
        label: "Cybercrime Taxonomy",
        title: "Taxonomy of Computer and Cyber Crimes",
        subtitle: "Landscape of digital financial offenses",
        image: "/pramaan_cybercrime_taxonomy.png",
        figmaLink: "https://www.figma.com/slides/m3yldhvRxJ9zo0sM3iYbet/Cyber-Crime-Case-Study--Final?node-id=85-609&t=I4guL1xaUsfLosii-4",
        description: "This classification system clarifies the categories of digital crimes to isolate where Pramaan operates and defines its target scope.",
        cards: [
            {
                title: "Conclusion",
                text: "This diagram breaks down the landscape of computer related crimes into two main types. Type I includes crimes where the computer itself is the direct target, such as hacking, malware, or denial of service attacks. Type II covers crimes where computers are used as tools to commit other offenses."
            },
            {
                title: "Why is it helpful",
                text: "Under Type II crimes, we focus on digital financial fraud, identity theft, data misuse, phishing, social engineering, and online money laundering. These directly link to UPI scams, online banking fraud, and other digital payment attacks. By rooting our project in this category, we clearly define our scope and ensure we're targeting the right problem."
            }
        ]
    }
};

export default function PramaanPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLElement>(null);
    const lenisRef = useRef<any>(null);
    const [isWip, setIsWip] = useState(false);
    const [showReveal, setShowReveal] = useState(true);
    const [showRevealIn, setShowRevealIn] = useState(false);
    const [activeJourney, setActiveJourney] = useState<"mngl" | "drain" | "gap">("mngl");
    const [activeMap, setActiveMap] = useState<"context" | "stakeholder" | "ecosystem" | "taxonomy">("context");

    const [isLocalhost, setIsLocalhost] = useState(false);

    // ── Platform Showcase controller (localhost only) ──
    const [showCtrl, setShowCtrl] = useState(false);
    const [ctrlPaddingY, setCtrlPaddingY] = useState(40);   // px, section top/bottom
    const [ctrlGap, setCtrlGap] = useState(36);             // px, column gap
    const [ctrlHeadingSize, setCtrlHeadingSize] = useState(56); // px
    const [ctrlBodySize, setCtrlBodySize] = useState(16);   // px
    const [ctrlProtoScale, setCtrlProtoScale] = useState(55); // %, max-width of phone

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            setIsWip(false);
            setIsLocalhost(isLocal);
        }
    }, []);

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
        if (!containerRef.current) return;
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

        // Pin carousel & horizontal scroll (supports multiple carousels on the page)
        const carouselSections = containerRef.current?.querySelectorAll(".dv-research-carousel-section") as NodeListOf<HTMLElement> | null;
        if (carouselSections) {
            carouselSections.forEach((carouselSection) => {
                const carousel = carouselSection.querySelector(".dv-dark-cards-carousel") as HTMLElement | null;
                const track = carouselSection.querySelector(".dv-dark-cards-track") as HTMLElement | null;

                if (carousel && track) {
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
            });
        }

        // Pinned stacked cards deck
        const introSection = containerRef.current?.querySelector(".dv-intro-section") as HTMLElement | null;
        const introCards = containerRef.current?.querySelectorAll(".dv-intro-card") as NodeListOf<HTMLElement> | null;

        if (introSection && introCards && introCards.length > 0) {
            const numCards = introCards.length;
            const stepsCount = numCards - 1;

            const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
            const xOffset = isDesktop ? 40 : 20;
            const yOffset = isDesktop ? -9 : -4;

            introCards.forEach((card, idx) => {
                const scaleVal = 1 - idx * 0.07;
                const yVal = idx * yOffset;
                const xVal = idx * xOffset;

                gsap.set(card, {
                    scale: scaleVal,
                    y: yVal,
                    x: xVal,
                    opacity: 1,
                    rotation: 0,
                    zIndex: 100 - idx * 10,
                    transformOrigin: "center center",
                });
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: introSection,
                    start: () => typeof window !== "undefined" && window.innerWidth >= 768 ? "center center" : "top 160px",
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

                tl.to(frontCard, {
                    x: "-135%",
                    y: "0px",
                    rotation: 0,
                    scale: 0.95,
                    opacity: 0,
                    ease: "power2.inOut",
                    duration: 0.5,
                }, label);

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
    }, { scope: containerRef, dependencies: [isWip] });

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
                    {isWip ? (
                        <div className="relative z-10 w-full min-h-screen text-white flex flex-col justify-between selection:bg-white/20">
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
                                rightContent={null}
                            />

                            <main className="flex-grow flex flex-col items-center justify-center px-6 text-center py-40">
                                <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
                                    <span className="text-[10px] tracking-[0.3em] font-mono text-white/50 uppercase block font-semibold">
                                        CASE STUDY
                                    </span>
                                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-sans text-white uppercase">
                                        Pramaan
                                    </h1>
                                    <div className="h-px w-20 bg-white/20 my-2" />
                                    <p className="text-sm md:text-base text-white/70 font-mono tracking-widest uppercase">
                                        [ Work in Progress ]
                                    </p>
                                    <p className="text-sm md:text-base text-white/50 max-w-sm leading-relaxed font-sans">
                                        This case study is currently being drafted and will be detailed soon.
                                    </p>
                                </div>
                            </main>

                            <footer className="w-full py-8 text-center text-[10px] font-mono text-white/30 uppercase tracking-widest">
                                &copy; 2026 &bull; All Rights Reserved
                            </footer>
                        </div>
                    ) : (
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
                                        title={<>Pramaan: Designing a<br />Cyber Fraud Evidence<br />&amp; Learning Platform</>}
                                        titleClassName="text-[26px] md:text-[45px] lg:text-[58px] font-medium leading-[1.0] tracking-[-0.02em] text-white text-left w-full max-w-[840px] mx-auto"
                                        description="A field immersed UX research and product design project helping cyber fraud victims in India collect court ready evidence, navigate fragmented reporting systems, and build lasting scam detection skills so the system works for them, not against them."
                                        scopeOfWork={["UX RESEARCH", "PRODUCT STRATEGY", "UI/UX DESIGN", "ETHNOGRAPHIC FIELDWORK", "SDG ALIGNMENT", "USABILITY TESTING"]}
                                        media="/Pramaan.mp4"
                                        mediaType="video"
                                        poster="/Pramaan2.png"
                                        autoPlay={true}
                                        muted={true}
                                        loop={true}
                                        playsInline={true}
                                        scrollHeightVh={140}
                                        smoothScroll={false}
                                        targetSize="fullscreen"
                                        overlay={{
                                            caption: "/01 BRIEF",
                                            heading: "Securing Digital Truth",
                                            paragraphs: [
                                                "Every year, millions of Indians lose money to cyber fraud and are left alone to navigate a system that was never built for them. Victims do not know what to save, who to report to, or how to prove what happened.",
                                                "Pramaan was designed for society. A platform that puts power back in the hands of the people, turning confusion into clarity, and giving every victim a fair chance at justice."
                                            ]
                                        }}
                                    />
                                </div>

                                {/* ── PROJECT DETAILS SECTION ── */}
                                <div className="w-full relative">
                                    <div className="absolute inset-0 bg-black/[0.15] pointer-events-none" />
                                    <section
                                        className="w-full relative z-10 text-[#e5e5e5] py-12 md:py-20 px-6 md:px-12 max-w-[1400px] mx-auto font-sans"
                                        data-theme="dark"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between w-full mb-10 md:mb-16">
                                            <div className="w-full md:w-[65%] mb-8 md:mb-0">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Team</h3>
                                                <p className="text-sm md:text-base font-medium text-white">Samruddhi Choudhari, Tanvi Kumbhar, Prathamesh T</p>
                                            </div>
                                            <div className="w-full md:w-[30%]">
                                                <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-3 font-medium">Timeline</h3>
                                                <p className="text-sm md:text-base font-medium text-white">4 Weeks</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between w-full">
                                            <div className="w-full md:w-[65%] flex flex-col gap-12 md:gap-16 pr-0 md:pr-12">
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Overview</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl font-sans">
                                                        PRAMAAN (meaning &lsquo;evidence&rsquo; in Hindi) is a digital evidence and learning platform that helps people report cyber scams, collect court-ready proof, and build everyday scam-detection skills through interactive learning. It combines secure reporting, AI-assisted evidence scanning, and gamified education so users feel protected instead of helpless.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Goal</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl font-sans">
                                                        Design an intuitive mobile application that simplifies the high-stress process of cyber fraud reporting and evidence gathering, reducing a confusing 6-hour scramble into a 10-minute guided flow.
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Challenges</h3>
                                                    <ul className="list-disc pl-5 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl space-y-2 font-sans">
                                                        <li>Helping high-stress, panicked victims collect valid digital evidence (like screenshots and APKs) in the immediate aftermath of a scam.</li>
                                                        <li>Designing a clear, step-by-step reporting flow that navigates siloed authorities (police cyber cell, banks, and UPI platforms).</li>
                                                        <li>Addressing the emotional paralysis (panic, shame, and confusion) that prevents victims from reporting scams quickly.</li>
                                                        <li>Ensuring the collected evidence meets legal/forensic standards (timestamped, chain-of-custody, secure storage) to help speed up cyber cell investigations.</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-medium text-white mb-6 tracking-tight">Outcome</h3>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl mb-4 font-sans">
                                                        A cohesive, user-friendly product design that collapses a complex reporting process into a guided mobile journey, raising victim confidence, standardizing evidence collection, and improving forensic outcomes for law enforcement.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-[30%] flex flex-col gap-12 md:gap-16 mt-12 md:mt-0 font-sans">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Methods</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Ethnographic Research</li>
                                                        <li>Empathy Mapping</li>
                                                        <li>Journey Mapping</li>
                                                        <li>MoSCoW Prioritisation</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">Tools</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>Figma &bull; FigJam</li>
                                                        <li>Miro &bull; Notion</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-serif italic text-white/50 mb-6 font-medium">SDG Alignment</h3>
                                                    <ul className="flex flex-col gap-1.5 text-sm md:text-base text-white/90">
                                                        <li>SDG 9 &bull; SDG 16</li>
                                                        <li>SDG 1 &bull; SDG 4 &bull; SDG 10</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                                    <div className="white-canvas-content w-full bg-white transition-colors duration-300 ease-out shadow-2xl origin-center" data-theme="light">
                                        <div className="dv-embed">

                                            {/* ── 01 PROBLEM IDENTIFICATION ── */}
                                            <section className="dv-section dv-research-carousel-section bg-white border-b border-[#E4DFD7] py-16 md:py-20" id="problem-section">
                                                <div className="dv-container">
                                                    <div className="text-center mb-10 max-w-6xl mx-auto">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">01 PROBLEM IDENTIFICATION</span>
                                                        <h2 className="dv-mixed-heading !text-[#0C0C0C]">
                                                            <span className="dv-heading-bold">Understanding the</span> <em className="dv-heading-italic">Problem</em>
                                                        </h2>
                                                        <div className="mt-8 flex flex-col gap-6 text-base md:text-lg text-[#6B6762] leading-relaxed font-sans text-left max-w-3xl mx-auto">
                                                            <p>
                                                                Cyber fraud in India has become a national crisis. As millions of new users come online, scams are growing faster than the systems meant to stop them from UPI fraud and fake utility calls to deepfakes and SIM swap attacks. Money moves through multiple bank accounts within hours, making tracing nearly impossible.
                                                            </p>
                                                            <p>
                                                                India is especially affected because the systems for protection, awareness, and investigation are still catching up. Only 1.6% of registered cybercrime cases lead to convictions. Forensic labs in Maharashtra alone have 27,000+ cases awaiting analysis. The result: victims are left traumatised, financially devastated, and entirely alone.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="dv-dark-cards-carousel dv-mt-24">
                                                        <div className="dv-dark-cards-track">
                                                            {[
                                                                { num: "01", title: "Rapid Digital Growth", text: "India's Aadhaar, UPI, and DigiLocker adoption expanded convenience but created new attack surfaces for cybercriminals to exploit at scale." },
                                                                { num: "02", title: "Cross Border Scam Factories", text: "Indian citizens trafficked to Southeast Asia are forced to run fake loan apps, call centres, and crypto based fraud operations abroad." },
                                                                { num: "03", title: "Jurisdiction & Legal Gaps", text: "Criminals operate from countries with weak or mismatched laws. Outdated penalties, limited platform accountability, and expert shortages leave victims unprotected." },
                                                                { num: "04", title: "Advanced Hiding Techniques", text: "VPNs, bulletproof hosting, IPFS, and blockchain hide identity. 5G and OTT apps make lawful tracking even harder for investigators." },
                                                                { num: "05", title: "Organised Cybercrime as a Service", text: "Ready-made hacking tools on the dark web make cyberattacks accessible to anyone, including low-skilled criminals with no technical background." },
                                                                { num: "06", title: "Social & Psychological Impact", text: "Victims of sextortion, cyberstalking, and deepfakes face trauma, social withdrawal, and erosion of trust in digital services entirely." }
                                                            ].map((item, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="dv-dark-card w-[85vw] max-w-[640px] min-h-[400px] flex-shrink-0 flex flex-col justify-center items-center text-center p-8 md:p-16 rounded-[24px]"
                                                                    style={{
                                                                        background: 'linear-gradient(135deg, #01060F 0%, #001A4D 100%)',
                                                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                                                    }}
                                                                >
                                                                    <h3 className="dv-dark-card-title text-2xl md:text-[2.25rem] font-medium leading-[1.2] tracking-[-0.01em] text-white mb-5 text-center">
                                                                        {item.num}. {item.title}
                                                                    </h3>
                                                                    <p className="dv-dark-card-body text-sm md:text-[1.1rem] leading-[1.6] text-white/85 max-w-[90%] text-center">
                                                                        {item.text}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── 02 RESEARCH & STRATEGY ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-16 md:py-20" id="research-section">
                                                <div className="dv-container">
                                                    <div className="text-center mb-10 max-w-6xl mx-auto">
                                                        <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">02 RESEARCH & STRATEGY</span>
                                                        <h2 className="dv-mixed-heading !text-[#0C0C0C]">
                                                            <span className="dv-heading-bold">Field</span> <em className="dv-heading-italic">Immersion</em>
                                                        </h2>
                                                        <div className="mt-8 flex flex-col gap-6 text-base md:text-lg text-[#6B6762] leading-relaxed font-sans text-left max-w-3xl mx-auto">
                                                            <p>
                                                                Through a three pronged ethnographic approach by interviewing real victims in Pune, documenting their environments, and observing journeys from fraud discovery through institutional response, we built a picture grounded in lived reality, not assumptions.
                                                            </p>
                                                            <p>
                                                                We spoke directly with MNGL gas scam victims, victims of silent account drain, and social media fraud survivors. We also interviewed PSI Deepak Rahane and Inspector Sameer Kulkarni from Pune's cyber cell to understand the investigator's perspective.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="max-w-3xl mx-auto mb-10">
                                                        <blockquote className="border-l-2 border-[#0066FF] pl-6 py-4 bg-[#F0EDE8]/40 rounded-r-2xl text-base md:text-lg italic text-[#0C0C0C] font-sans leading-relaxed">
                                                            "Police find it hard to trace financial frauds because evidence is collected too slowly and forensic labs are overloaded. By the time investigation starts, scammers have already moved the money abroad and wiped all digital proof."
                                                        </blockquote>
                                                        <cite className="block mt-3 font-mono text-[10px] text-[#6B6762] uppercase tracking-wider not-italic text-right">
                                                            FIELD DOCUMENTATION FINDING, PUNE CYBER CELL
                                                        </cite>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        {[
                                                            {
                                                                label: "PHOTO DOCUMENTATION",
                                                                title: "Victim Environments",
                                                                text: "Homemaker's beauty parlour, retired banker's home, kitchen where fake MNGL call was received. Banking app showing ₹0 balance. Fake APK download screens. Police station complaint counter."
                                                            },
                                                            {
                                                                label: "SKETCH DOCUMENTATION",
                                                                title: "Journey Mapping",
                                                                text: "MNGL Gas Scam user flow, Silent Account Drain timeline, Institutional coordination gap all mapped end to end to expose where the system fails victims."
                                                            },
                                                            {
                                                                label: "OBSERVATION NOTES",
                                                                title: "Behavioral Patterns",
                                                                text: "Emotional states at discovery moment, verbal testimonies, behavioral trust indicators and why shame prevents timely reporting."
                                                            }
                                                        ].map((card, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="group bg-[#FAFAF9] border border-[#E4DFD7] rounded-xl p-8 flex flex-col justify-between text-left shadow-sm hover:bg-[#01060F] hover:border-[#01060F] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                                                style={{ minHeight: '280px' }}
                                                            >
                                                                <div>
                                                                    <span className="text-[10px] tracking-[0.15em] font-mono text-[#6B6762] group-hover:text-white/60 uppercase block mb-3 font-semibold transition-colors duration-300">
                                                                        {card.label}
                                                                    </span>
                                                                    <h3 className="font-bold text-[#0C0C0C] group-hover:text-white mb-4 !text-left font-sans transition-colors duration-300 text-xl">
                                                                        {card.title}
                                                                    </h3>
                                                                    <p className="text-[#6B6762] group-hover:text-white/85 leading-relaxed font-sans transition-colors duration-300 text-sm md:text-[0.95rem]">
                                                                        {card.text}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </section>

                                             {/* ── 03 CONTEXT MAPPING ── */}
                                             <section className="dv-section bg-white border-b border-[#E4DFD7] py-16 md:py-20" id="context-mapping-section">
                                                 <div className="dv-container">
                                                     <div className="text-center mb-10 max-w-6xl mx-auto">
                                                         <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">03 CONTEXT MAPPING</span>
                                                         <h2 className="dv-mixed-heading !text-[#0C0C0C]">
                                                             <span className="dv-heading-bold">Research &amp; Context</span> <em className="dv-heading-italic">Mapping</em>
                                                         </h2>
                                                         <p className="mt-4 text-base md:text-lg text-[#6B6762] leading-relaxed font-sans max-w-3xl mx-auto">
                                                             Mapping the digital, social, and legal landscape of cybersecurity fraud in India. Explore user experiences, stakeholder dynamics, ecosystem gaps, and criminal taxonomy.
                                                         </p>
                                                     </div>

                                                     {/* Interactive Map Tabs */}
                                                     <div className="flex flex-wrap justify-center items-center gap-3 mb-10 max-w-5xl mx-auto px-4">
                                                         {(Object.keys(MAPS_DATA) as Array<keyof typeof MAPS_DATA>).map((key) => {
                                                             const item = MAPS_DATA[key];
                                                             const isActive = activeMap === key;
                                                             return (
                                                                 <button
                                                                     key={key}
                                                                     onClick={() => setActiveMap(key)}
                                                                     className={`px-5 py-3 rounded-2xl border font-sans text-xs tracking-wider uppercase font-semibold transition-all duration-300 cursor-pointer select-none ${
                                                                         isActive
                                                                             ? "bg-[#0C0C0C] text-white border-[#0C0C0C] shadow-sm scale-[1.02]"
                                                                             : "bg-transparent text-[#6B6762] border-[#E4DFD7] hover:bg-[#F2EFEA]/50 hover:text-[#0C0C0C]"
                                                                     }`}
                                                                 >
                                                                     {item.label}
                                                                 </button>
                                                             );
                                                         })}
                                                     </div>

                                                     {/* Selected Map Content Card */}
                                                     {(() => {
                                                         const figmaLink = MAPS_DATA[activeMap].figmaLink;
                                                         const embedUrl = figmaLink 
                                                             ? `https://www.figma.com/embed?embed_host=share&hide-ui=1&url=${encodeURIComponent(figmaLink)}`
                                                             : null;
                                                         return (
                                                             <div className="max-w-6xl mx-auto px-4 md:px-0">
                                                                 <div className="mb-10 text-center">
                                                                     <h3 className="text-2xl md:text-3xl font-bold font-sans text-[#0C0C0C] tracking-tight text-center">
                                                                         {MAPS_DATA[activeMap].title}
                                                                     </h3>
                                                                     <p className="text-sm md:text-base font-sans text-[#6B6762] leading-relaxed mt-4 max-w-3xl mx-auto text-center">
                                                                         {MAPS_DATA[activeMap].description}
                                                                     </p>
                                                                 </div>

                                                                 {/* Map Image or Figma Embed Render */}
                                                                 <div className={`w-full flex justify-center bg-[#FAFAF9] border border-[#E4DFD7]/60 rounded-3xl overflow-hidden group/image mb-10 ${embedUrl ? "p-0" : "p-4 md:p-8"}`}>
                                                                     {embedUrl ? (
                                                                        <div className="relative w-full">
                                                                            <iframe 
                                                                                src={embedUrl}
                                                                                title={MAPS_DATA[activeMap].title}
                                                                                className="w-full h-[500px] md:h-[650px] border-0 bg-white pointer-events-none"
                                                                            />
                                                                            {/* Transparent overlay — blocks click-through slide navigation */}
                                                                            <div className="absolute inset-0 z-10" style={{ cursor: 'default' }} />
                                                                        </div>
                                                                     ) : (
                                                                         <img 
                                                                             src={MAPS_DATA[activeMap].image} 
                                                                             alt={MAPS_DATA[activeMap].title} 
                                                                             className="w-full max-h-[650px] object-contain select-none transition-transform duration-500 group-hover/image:scale-[1.01]" 
                                                                         />
                                                                     )}
                                                                 </div>

                                                                 {/* Descriptive Cards Grid */}
                                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                                                     {MAPS_DATA[activeMap].cards.map((card, idx) => (
                                                                         <div 
                                                                             key={idx} 
                                                                             className="group border border-[#E4DFD7] bg-[#FAFAF9] hover:bg-[#0C0C0C] hover:border-[#0C0C0C] rounded-2xl p-6 md:p-8 transition-all duration-300 flex flex-col justify-between cursor-default"
                                                                         >
                                                                             <div>
                                                                                 <h4 className="text-xs tracking-wider font-mono text-[#0C0C0C] group-hover:text-white uppercase font-bold mb-3 transition-colors duration-300">
                                                                                     {card.title}
                                                                                 </h4>
                                                                                 <p className="text-sm md:text-base text-[#6B6762] group-hover:text-white/90 leading-relaxed font-sans transition-colors duration-300">
                                                                                     {card.text}
                                                                                 </p>
                                                                             </div>
                                                                         </div>
                                                                     ))}
                                                                 </div>
                                                             </div>
                                                         );
                                                     })()}
                                                 </div>
                                             </section>

                                             {/* ── 04 VICTIM EXPERIENCES ── */}
                                             <section className="dv-section bg-[#FAFAF9] border-b border-[#E4DFD7] py-16 md:py-20" id="victim-experiences-section">
                                                 <div className="dv-container">
                                                     <div className="text-center mb-10 max-w-6xl mx-auto">
                                                         <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">04 VICTIM EXPERIENCES</span>
                                                         <h2 className="dv-mixed-heading !text-[#0C0C0C]">
                                                             <span className="dv-heading-bold">Mapping Victim</span> <em className="dv-heading-italic">Experiences</em>
                                                         </h2>
                                                         <p className="mt-4 text-base md:text-lg text-[#6B6762] leading-relaxed font-sans max-w-3xl mx-auto">
                                                             Mapping victims' lived experiences into structured and coherent journeys reveals the systemic, bureaucratic, and emotional gaps where current response frameworks fail them.
                                                         </p>
                                                     </div>

                                                     {/* Interactive Journey Tabs */}
                                                     <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 max-w-5xl mx-auto">
                                                         {(Object.keys(JOURNEYS_DATA) as Array<keyof typeof JOURNEYS_DATA>).map((key) => {
                                                             const journey = JOURNEYS_DATA[key];
                                                             const isActive = activeJourney === key;
                                                             return (
                                                                 <button
                                                                     key={key}
                                                                     onClick={() => setActiveJourney(key)}
                                                                     className={`w-full md:w-auto px-6 py-4 rounded-2xl border text-left md:text-center font-sans transition-all duration-300 flex flex-col md:items-center gap-1 cursor-pointer select-none ${
                                                                         isActive
                                                                             ? "bg-white shadow-md border-[#E4DFD7]"
                                                                             : "bg-transparent border-[#E4DFD7]/40 hover:bg-[#F2EFEA]/50"
                                                                     }`}
                                                                 >
                                                                     <div className="flex items-center gap-2">
                                                                         <span 
                                                                             className="w-2.5 h-2.5 rounded-full inline-block"
                                                                             style={{ backgroundColor: journey.themeColor }}
                                                                         />
                                                                         <span className={`text-xs font-mono uppercase tracking-wider ${isActive ? "text-[#0C0C0C] font-bold" : "text-[#6B6762]"}`}>
                                                                             {key === "mngl" ? "MNGL Scam" : key === "drain" ? "Silent Drain" : "Bureaucratic Gap"}
                                                                         </span>
                                                                     </div>
                                                                     <span className={`text-sm font-semibold mt-1 font-sans ${isActive ? "text-[#0C0C0C]" : "text-[#6B6762]/80"}`}>
                                                                         {journey.title}
                                                                     </span>
                                                                 </button>
                                                             );
                                                         })}
                                                     </div>

                                                     {/* Vertical Timeline Card */}
                                                     <div className="bg-white border border-[#E4DFD7] rounded-3xl p-6 md:p-12 max-w-6xl mx-auto shadow-sm">
                                                         <div className="border-b border-[#E4DFD7] pb-6 mb-12 text-left">
                                                             <h3 className="text-xl md:text-2xl font-bold font-sans text-[#0C0C0C] !text-left">
                                                                 {JOURNEYS_DATA[activeJourney].title}
                                                             </h3>
                                                             <p className="text-sm font-sans text-[#6B6762] mt-1">
                                                                 {JOURNEYS_DATA[activeJourney].subtitle}
                                                             </p>
                                                         </div>

                                                         {/* Timeline steps */}
                                                         <div className="relative pl-8 md:pl-16 border-l-2 border-[#E4DFD7]/70 space-y-12 ml-4">
                                                             {JOURNEYS_DATA[activeJourney].steps.map((step, idx) => (
                                                                 <div key={idx} className="relative group">
                                                                     {/* Icon Bullet Point */}
                                                                     <div 
                                                                         className="absolute -left-[52px] md:-left-[88px] top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border bg-white flex items-center justify-center shadow-sm transition-all duration-300"
                                                                         style={{ 
                                                                             borderColor: JOURNEYS_DATA[activeJourney].themeColor,
                                                                             color: JOURNEYS_DATA[activeJourney].themeColor
                                                                         }}
                                                                     >
                                                                         <Icon icon={step.icon} className="text-xl md:text-2xl" />
                                                                         
                                                                         {/* Step number badge */}
                                                                         <span 
                                                                             className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white"
                                                                             style={{ backgroundColor: JOURNEYS_DATA[activeJourney].themeColor }}
                                                                         >
                                                                             {step.id}
                                                                         </span>
                                                                     </div>

                                                                     {/* Card Container */}
                                                                     <div className="bg-[#FAFAF9]/60 border border-[#E4DFD7]/60 rounded-2xl p-5 md:p-6 transition-all duration-300 group-hover:bg-[#FAFAF9] group-hover:border-[#E4DFD7] group-hover:shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                                         <div className="flex-grow text-left">
                                                                             <h4 className="text-base font-bold font-sans text-[#0C0C0C] !text-left">
                                                                                 {step.title}
                                                                             </h4>
                                                                             <p className="text-xs md:text-sm font-sans text-[#6B6762] mt-1 text-left">
                                                                                 {step.description}
                                                                             </p>
                                                                             <div className="text-[10px] font-mono uppercase tracking-wider mt-2 font-semibold flex items-center gap-1.5" style={{ color: JOURNEYS_DATA[activeJourney].themeColor }}>
                                                                                 <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: JOURNEYS_DATA[activeJourney].themeColor }}></span>
                                                                                 Emotion: {step.emotion}
                                                                             </div>
                                                                         </div>
                                                                         
                                                                         {/* Badges Column */}
                                                                         <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                                                             <span className="text-[10px] font-mono text-[#6B6762] bg-[#E4DFD7]/40 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                                                                                 {step.time}
                                                                             </span>
                                                                             <span 
                                                                                 className="text-[10px] font-mono text-white px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold"
                                                                                 style={{ backgroundColor: JOURNEYS_DATA[activeJourney].themeColor }}
                                                                             >
                                                                                 {step.emotion}
                                                                             </span>
                                                                         </div>
                                                                     </div>
                                                                 </div>
                                                             ))}
                                                         </div>
                                                     </div>

                                                     {/* Statically displayed Critical Timeline Card */}
                                                     <div className="bg-white border border-[#E4DFD7] rounded-3xl p-6 md:p-12 max-w-6xl mx-auto shadow-sm mt-16">
                                                         {/* Desktop Layout: Horizontal Timeline */}
                                                         <div className="hidden md:block">
                                                             <div className="flex items-center gap-3 border-b border-[#E4DFD7] pb-6 mb-12 text-left">
                                                                 <Icon icon="lucide:clock" className="text-2xl text-[#1E293B]" />
                                                                 <h3 className="text-xl md:text-2xl font-bold font-sans text-[#0C0C0C] !text-left">
                                                                     The Critical Timeline
                                                                 </h3>
                                                             </div>

                                                             {/* Horizontal Timeline Container */}
                                                             <div className="relative w-full py-8 mb-10">
                                                                 {/* Gradient Bar */}
                                                                 <div className="absolute top-[10px] left-[8.33%] right-[8.33%] h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 via-orange-500 to-red-500 -translate-y-1/2" />
                                                                 
                                                                 {/* Grid of steps */}
                                                                 <div className="grid grid-cols-6 relative z-10">
                                                                     {/* Step 1 */}
                                                                     <div className="flex flex-col items-center text-center px-2">
                                                                         <div className="w-5 h-5 rounded-full bg-[#EF4444] border-[3px] border-white shadow-sm flex items-center justify-center mb-4 ring-1 ring-slate-100" />
                                                                         <span className="text-xs md:text-sm font-semibold text-slate-800">0 min</span>
                                                                         <span className="text-[11px] md:text-xs text-slate-500 mt-1.5 leading-normal font-medium font-sans">Fraud occurs</span>
                                                                     </div>

                                                                     {/* Step 2 */}
                                                                     <div className="flex flex-col items-center text-center px-2">
                                                                         <div className="w-5 h-5 rounded-full bg-[#FBC02D] border-[3px] border-white shadow-sm flex items-center justify-center mb-4 ring-1 ring-slate-100" />
                                                                         <span className="text-xs md:text-sm font-semibold text-slate-800">30 min</span>
                                                                         <span className="text-[11px] md:text-xs text-slate-500 mt-1.5 leading-normal font-medium font-sans">Victim calls bank</span>
                                                                     </div>

                                                                     {/* Step 3 */}
                                                                     <div className="flex flex-col items-center text-center px-2">
                                                                         <div className="w-5 h-5 rounded-full bg-[#FBC02D] border-[3px] border-white shadow-sm flex items-center justify-center mb-4 ring-1 ring-slate-100" />
                                                                         <span className="text-xs md:text-sm font-semibold text-slate-800">2.5 hrs</span>
                                                                         <span className="text-[11px] md:text-xs text-slate-500 mt-1.5 leading-normal font-medium font-sans">Arrives at<br />bank branch</span>
                                                                     </div>

                                                                     {/* Step 4 */}
                                                                     <div className="flex flex-col items-center text-center px-2">
                                                                         <div className="w-5 h-5 rounded-full bg-[#FB8C00] border-[3px] border-white shadow-sm flex items-center justify-center mb-4 ring-1 ring-slate-100" />
                                                                         <span className="text-xs md:text-sm font-semibold text-slate-800">3.5 hrs</span>
                                                                         <span className="text-[11px] md:text-xs text-slate-500 mt-1.5 leading-normal font-medium font-sans">Sent to<br />police station</span>
                                                                     </div>

                                                                     {/* Step 5 */}
                                                                     <div className="flex flex-col items-center text-center px-2">
                                                                         <div className="w-5 h-5 rounded-full bg-[#FB8C00] border-[3px] border-white shadow-sm flex items-center justify-center mb-4 ring-1 ring-slate-100" />
                                                                         <span className="text-xs md:text-sm font-semibold text-slate-800">6.5 hrs</span>
                                                                         <span className="text-[11px] md:text-xs text-slate-500 mt-1.5 leading-normal font-medium font-sans">FIR filed</span>
                                                                     </div>

                                                                     {/* Step 6 */}
                                                                     <div className="flex flex-col items-center text-center px-2">
                                                                         <div className="w-5 h-5 rounded-full bg-[#EF4444] border-[3px] border-white shadow-sm flex items-center justify-center mb-4 ring-1 ring-slate-100" />
                                                                         <span className="text-xs md:text-sm font-semibold text-slate-800">7 hrs</span>
                                                                         <span className="text-[11px] md:text-xs text-slate-500 mt-1.5 leading-normal font-medium font-sans">Money already<br />withdrawn</span>
                                                                     </div>
                                                                 </div>
                                                             </div>

                                                             {/* Critical Finding Banner */}
                                                             <div className="border-l-4 border-red-600 bg-red-50/50 rounded-2xl rounded-l-none p-5 md:p-6 text-left">
                                                                 <div className="text-red-600 font-bold text-sm md:text-base mb-1 font-sans">
                                                                     Critical Finding:
                                                                 </div>
                                                                 <p className="text-slate-800 font-sans text-sm md:text-base lg:text-lg leading-relaxed font-medium">
                                                                     The average 7-hour delay between fraud occurrence and FIR filing ensures criminals escape with stolen money. Bureaucratic fragmentation is the fraudster's best ally.
                                                                 </p>
                                                             </div>
                                                         </div>

                                                         {/* Mobile Layout: Fallback to vertical layout for readability */}
                                                         <div className="block md:hidden">
                                                             <div className="border-b border-[#E4DFD7] pb-6 mb-12 text-left">
                                                                 <div className="flex items-center gap-3">
                                                                     <Icon icon="lucide:clock" className="text-2xl text-[#1E293B]" />
                                                                     <h3 className="text-xl font-bold font-sans text-[#0C0C0C] !text-left">
                                                                         The Critical Timeline
                                                                     </h3>
                                                                 </div>
                                                             </div>

                                                             <div className="relative pl-8 border-l-2 border-[#E4DFD7]/70 space-y-12 ml-4">
                                                                 {/* Step 1 */}
                                                                 <div className="relative group">
                                                                     <div className="absolute -left-[52px] w-10 h-10 rounded-full border bg-white flex items-center justify-center shadow-sm" style={{ borderColor: '#FF1744', color: '#FF1744' }}>
                                                                         <Icon icon="lucide:alert-circle" className="text-xl" />
                                                                         <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white bg-[#FF1744]">1</span>
                                                                     </div>
                                                                     <div className="bg-[#FAFAF9]/60 border border-[#E4DFD7]/60 rounded-2xl p-5 flex flex-col justify-between items-start gap-4 text-left w-full">
                                                                         <div>
                                                                             <h4 className="text-base font-bold font-sans text-[#0C0C0C] !text-left">Fraud occurs</h4>
                                                                             <div className="text-[10px] font-mono uppercase tracking-wider mt-2 font-semibold flex items-center gap-1.5 text-[#FF1744]">
                                                                                 <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744]" />
                                                                                 Time: 0 min
                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                                 </div>

                                                                 {/* Step 2 */}
                                                                 <div className="relative group">
                                                                     <div className="absolute -left-[52px] w-10 h-10 rounded-full border bg-white flex items-center justify-center shadow-sm" style={{ borderColor: '#FF1744', color: '#FF1744' }}>
                                                                         <Icon icon="lucide:phone" className="text-xl" />
                                                                         <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white bg-[#FF1744]">2</span>
                                                                     </div>
                                                                     <div className="bg-[#FAFAF9]/60 border border-[#E4DFD7]/60 rounded-2xl p-5 flex flex-col justify-between items-start gap-4 text-left w-full">
                                                                         <div>
                                                                             <h4 className="text-base font-bold font-sans text-[#0C0C0C] !text-left">Victim calls bank</h4>
                                                                             <div className="text-[10px] font-mono uppercase tracking-wider mt-2 font-semibold flex items-center gap-1.5 text-[#FF1744]">
                                                                                 <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744]" />
                                                                                 Time: 30 min
                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                                 </div>

                                                                 {/* Step 3 */}
                                                                 <div className="relative group">
                                                                     <div className="absolute -left-[52px] w-10 h-10 rounded-full border bg-white flex items-center justify-center shadow-sm" style={{ borderColor: '#FF1744', color: '#FF1744' }}>
                                                                         <Icon icon="lucide:landmark" className="text-xl" />
                                                                         <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white bg-[#FF1744]">3</span>
                                                                     </div>
                                                                     <div className="bg-[#FAFAF9]/60 border border-[#E4DFD7]/60 rounded-2xl p-5 flex flex-col justify-between items-start gap-4 text-left w-full">
                                                                         <div>
                                                                             <h4 className="text-base font-bold font-sans text-[#0C0C0C] !text-left">Arrives at bank branch</h4>
                                                                             <div className="text-[10px] font-mono uppercase tracking-wider mt-2 font-semibold flex items-center gap-1.5 text-[#FF1744]">
                                                                                 <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744]" />
                                                                                 Time: 2.5 hrs
                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                                 </div>

                                                                 {/* Step 4 */}
                                                                 <div className="relative group">
                                                                     <div className="absolute -left-[52px] w-10 h-10 rounded-full border bg-white flex items-center justify-center shadow-sm" style={{ borderColor: '#FF1744', color: '#FF1744' }}>
                                                                         <Icon icon="lucide:route" className="text-xl" />
                                                                         <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white bg-[#FF1744]">4</span>
                                                                     </div>
                                                                     <div className="bg-[#FAFAF9]/60 border border-[#E4DFD7]/60 rounded-2xl p-5 flex flex-col justify-between items-start gap-4 text-left w-full">
                                                                         <div>
                                                                             <h4 className="text-base font-bold font-sans text-[#0C0C0C] !text-left">Sent to police station</h4>
                                                                             <div className="text-[10px] font-mono uppercase tracking-wider mt-2 font-semibold flex items-center gap-1.5 text-[#FF1744]">
                                                                                 <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744]" />
                                                                                 Time: 3.5 hrs
                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                                 </div>

                                                                 {/* Step 5 */}
                                                                 <div className="relative group">
                                                                     <div className="absolute -left-[52px] w-10 h-10 rounded-full border bg-white flex items-center justify-center shadow-sm" style={{ borderColor: '#FF1744', color: '#FF1744' }}>
                                                                         <Icon icon="lucide:file-signature" className="text-xl" />
                                                                         <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white bg-[#FF1744]">5</span>
                                                                     </div>
                                                                     <div className="bg-[#FAFAF9]/60 border border-[#E4DFD7]/60 rounded-2xl p-5 flex flex-col justify-between items-start gap-4 text-left w-full">
                                                                         <div>
                                                                             <h4 className="text-base font-bold font-sans text-[#0C0C0C] !text-left">FIR filed</h4>
                                                                             <div className="text-[10px] font-mono uppercase tracking-wider mt-2 font-semibold flex items-center gap-1.5 text-[#FF1744]">
                                                                                 <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744]" />
                                                                                 Time: 6.5 hrs
                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                                 </div>

                                                                 {/* Step 6 */}
                                                                 <div className="relative group">
                                                                     <div className="absolute -left-[52px] w-10 h-10 rounded-full border bg-white flex items-center justify-center shadow-sm" style={{ borderColor: '#FF1744', color: '#FF1744' }}>
                                                                         <Icon icon="lucide:ban" className="text-xl" />
                                                                         <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center text-white bg-[#FF1744]">6</span>
                                                                     </div>
                                                                     <div className="bg-[#FAFAF9]/60 border border-[#E4DFD7]/60 rounded-2xl p-5 flex flex-col justify-between items-start gap-4 text-left w-full">
                                                                         <div>
                                                                             <h4 className="text-base font-bold font-sans text-[#0C0C0C] !text-left">Money already withdrawn</h4>
                                                                             <div className="text-[10px] font-mono uppercase tracking-wider mt-2 font-semibold flex items-center gap-1.5 text-[#FF1744]">
                                                                                 <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744]" />
                                                                                 Time: 7 hrs
                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                                 </div>
                                                             </div>

                                                             {/* Critical Finding Banner (Mobile) */}
                                                             <div className="border-l-4 border-red-600 bg-red-50/50 rounded-2xl rounded-l-none p-5 text-left mt-8">
                                                                 <div className="text-red-600 font-bold text-sm mb-1 font-sans">
                                                                     Critical Finding:
                                                                 </div>
                                                                 <p className="text-slate-800 font-sans text-sm leading-relaxed font-medium">
                                                                     The average 7-hour delay between fraud occurrence and FIR filing ensures criminals escape with stolen money. Bureaucratic fragmentation is the fraudster's best ally.
                                                                 </p>
                                                             </div>
                                                         </div>
                                                     </div>
                                                 </div>
                                             </section>

                                             {/* ── 05 KEY INSIGHTS ── */}
                                             <section className="dv-section dv-research-carousel-section bg-white border-b border-[#E4DFD7] py-16 md:py-20" id="insights-section" style={{ paddingBottom: '40px' }}>
                                                 <div className="dv-container">
                                                     <div className="text-center mb-10 max-w-6xl mx-auto">
                                                         <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">05 KEY INSIGHTS</span>
                                                         <h2 className="dv-mixed-heading !text-[#0C0C0C]">
                                                             <span className="dv-heading-bold">Critical</span> <em className="dv-heading-italic">Findings</em>
                                                         </h2>
                                                         <p className="mt-4 text-base md:text-lg text-[#6B6762] leading-relaxed font-sans max-w-3xl mx-auto">
                                                             Six insights emerged from direct field immersion, each connecting what's visible (actions and complaints) to what's hidden (fears and unmet needs). These drove every design decision.
                                                         </p>
                                                     </div>

                                                     <div className="dv-dark-cards-carousel dv-mt-24">
                                                         <div className="dv-dark-cards-track">
                                                             {INSIGHTS.map((ins, idx) => (
                                                                 <div
                                                                     key={idx}
                                                                     className="dv-dark-card w-[85vw] max-w-[640px] min-h-[400px] flex-shrink-0 flex flex-col justify-center items-center text-center p-8 md:p-16 rounded-[24px]"
                                                                     style={{
                                                                         background: 'linear-gradient(135deg, #01060F 0%, #001A4D 100%)',
                                                                         border: '1px solid rgba(255, 255, 255, 0.1)'
                                                                     }}
                                                                 >
                                                                     <div className="text-[10px] tracking-[0.2em] font-mono text-white/60 uppercase font-bold mb-4 block">
                                                                         INSIGHT {ins.num}
                                                                     </div>
                                                                     <div className="text-4xl md:text-5xl font-black font-sans text-white mb-4 leading-none tracking-tight">
                                                                         {ins.stat}
                                                                     </div>
                                                                     <h3 className="dv-dark-card-title text-2xl md:text-[2.25rem] font-bold leading-[1.2] tracking-[-0.01em] text-white mb-5 text-center">
                                                                         {ins.title}
                                                                     </h3>
                                                                     <p className="dv-dark-card-body text-sm md:text-[1.1rem] leading-[1.6] text-white/85 max-w-[90%] text-center font-normal">
                                                                         {ins.body}
                                                                     </p>
                                                                 </div>
                                                             ))}
                                                         </div>
                                                     </div>
                                                 </div>
                                             </section>

                                             {/* ── 06 PROBLEM STATEMENT ── */}
                                             <section className="dv-section bg-[#FAFAF9] border-b border-[#E4DFD7] py-16 md:py-20" id="problem-statement-section" style={{ paddingTop: '40px' }}>
                                                 <div className="dv-container">
                                                     <div className="text-center max-w-5xl mx-auto">
                                                         <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">06 Problem Statement</span>
                                                         <h2 className="dv-mixed-heading !text-[#0C0C0C] mb-4">
                                                             <span className="dv-heading-bold">The</span> <em className="dv-heading-italic">Problem</em>
                                                         </h2>
                                                         <p className="dv-subheading !text-[#0C0C0C] max-w-3xl mx-auto">
                                                             Police find it hard to trace financial frauds because evidence is collected too slow and forensic labs are overloaded. By the time investigation even starts, scammers have already moved the money abroad and wiped all digital proof.
                                                         </p>
                                                     </div>
                                                 </div>
                                             </section>

                                             {/* ── 07 INTRODUCING PRAMAAN ── */}
                                             <section className="dv-section bg-white border-b border-[#E4DFD7] py-16 md:py-20" id="overview-section">
                                                 <div className="dv-container">
                                                     <div className="text-center max-w-6xl mx-auto">
                                                         <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">07 INTRODUCING PRAMAAN</span>
                                                         <h2 className="dv-mixed-heading !text-[#0C0C0C]">
                                                             <span className="dv-heading-bold">Introducing the</span> <em className="dv-heading-italic">Platform</em>
                                                         </h2>
                                                         <p className="mt-4 text-base md:text-lg text-[#6B6762] leading-relaxed font-sans text-center max-w-3xl mx-auto">
                                                             PRAMAAN (meaning &lsquo;evidence&rsquo; in Hindi) is a digital evidence and learning platform that helps people report cyber scams, collect court-ready proof, and build everyday scam-detection skills through interactive learning. It combines secure reporting, AI-assisted evidence scanning, and gamified education so users feel protected instead of helpless.
                                                         </p>
                                                     </div>
                                                     <PramaanMobileMockups />
                                                 </div>
                                             </section>

                                        </div>
                                    </div>
                                </div>

                                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                                    <div className="white-canvas-content w-full bg-white transition-colors duration-300 ease-out shadow-2xl origin-center" data-theme="light">
                                        <div className="dv-embed">
                                            {/* ── DESIGN SYSTEM SECTION ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-16 md:py-20 relative overflow-hidden" id="branding-assets-section">
                                                <div className="dv-container max-w-[1200px] mx-auto px-6 md:px-12">

                                                    <div className="text-center mb-8 md:mb-12">
                                                        <h2 className="dv-mixed-heading">
                                                            <span className="dv-heading-bold">Design</span> <em className="dv-heading-italic">System</em>
                                                        </h2>
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                                                        {/* Typography Card */}
                                                        <div className="flex flex-col gap-6">
                                                            <div className="bg-[#1B3FAB] rounded-3xl p-8 flex flex-col justify-between aspect-auto min-h-[340px] lg:aspect-[16/10] overflow-hidden relative shadow-lg text-white group hover:scale-[1.01] transition-transform duration-300 select-none">
                                                                <div className="absolute top-0 right-0 p-8 opacity-10 text-white font-sans font-bold text-[150px] leading-none pointer-events-none select-none">
                                                                    Aa
                                                                </div>

                                                                <div className="flex justify-between items-start z-10 w-full">
                                                                    <div className="text-left">
                                                                        <div className="text-[11px] tracking-widest font-mono text-white/75 uppercase font-bold mb-1">Type Specimen</div>
                                                                        <div className="text-2xl font-sans font-bold tracking-tight">Inter</div>
                                                                    </div>
                                                                    <div className="text-right font-mono text-[9px] text-white/70 tracking-widest uppercase">
                                                                        SANS-SERIF
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col gap-2 z-10 text-left mt-auto">
                                                                    <div className="border-b border-white/20 pb-1.5">
                                                                        <span className="font-sans font-bold text-lg">Bold</span>
                                                                    </div>
                                                                    <div className="border-b border-white/20 pb-1.5">
                                                                        <span className="font-sans font-semibold text-lg">SemiBold</span>
                                                                    </div>
                                                                    <div className="border-b border-white/20 pb-1.5">
                                                                        <span className="font-sans font-medium text-lg">Medium</span>
                                                                    </div>
                                                                    <div className="pb-1">
                                                                        <span className="font-sans font-normal text-lg">Regular</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="text-left mt-2">
                                                                <h3 className="text-xl md:text-2xl font-bold font-sans text-[#0C0C0C] mb-3">Inter Typography</h3>
                                                                <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans">
                                                                    <strong>Inter</strong> was chosen for its clarity under stress — tight spacing and distinct letterforms reduce reading friction in high-anxiety moments like evidence collection and fraud reporting. Weight variation from Regular to Bold creates a clear information hierarchy.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Color System Card */}
                                                        <div className="flex flex-col gap-6">
                                                            <div className="bg-white rounded-3xl p-8 flex flex-col gap-6 overflow-hidden relative shadow-lg border border-[#E4DFD7] hover:scale-[1.01] transition-transform duration-300">

                                                                <div className="flex justify-between items-center">
                                                                    <div className="text-left">
                                                                        <div className="text-[11px] tracking-widest font-mono text-[#6B6762] uppercase font-bold mb-1">Color Palette</div>
                                                                        <div className="text-lg font-sans font-bold text-[#0C0C0C] tracking-tight">System Colors</div>
                                                                    </div>
                                                                    <div className="text-right font-mono text-[8px] text-[#6B6762]/70 tracking-widest uppercase">
                                                                        HOVER FOR HEX
                                                                    </div>
                                                                </div>

                                                                {/* Primary */}
                                                                <div>
                                                                    <div className="text-[10px] font-mono font-bold text-[#6B6762] uppercase tracking-widest mb-2">Primary</div>
                                                                    <div className="flex h-16 w-full rounded-xl overflow-hidden border border-[#E4DFD7]">
                                                                        {[
                                                                            { hex: "#1B3FAB", darkText: false },
                                                                            { hex: "#2B52CC", darkText: false },
                                                                            { hex: "#4A6EE0", darkText: false },
                                                                            { hex: "#D6E0FF", darkText: true },
                                                                            { hex: "#EBF0FF", darkText: true },
                                                                        ].map((c) => (
                                                                            <div key={c.hex} className="flex-1 h-full relative group transition-all duration-300 hover:flex-[2] cursor-default" style={{ backgroundColor: c.hex }}>
                                                                                <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${c.darkText ? 'text-black/70' : 'text-white/90'}`}>{c.hex}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Accent / Status */}
                                                                <div>
                                                                    <div className="text-[10px] font-mono font-bold text-[#6B6762] uppercase tracking-widest mb-2">Accent / Status</div>
                                                                    <div className="flex h-16 w-full rounded-xl overflow-hidden border border-[#E4DFD7]">
                                                                        {[
                                                                            { hex: "#E63946", darkText: false },
                                                                            { hex: "#FF6B35", darkText: false },
                                                                            { hex: "#2EC27E", darkText: false },
                                                                            { hex: "#F4B942", darkText: true },
                                                                            { hex: "#FFE8CC", darkText: true },
                                                                        ].map((c) => (
                                                                            <div key={c.hex} className="flex-1 h-full relative group transition-all duration-300 hover:flex-[2] cursor-default" style={{ backgroundColor: c.hex }}>
                                                                                <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${c.darkText ? 'text-black/70' : 'text-white/90'}`}>{c.hex}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Neutral */}
                                                                <div>
                                                                    <div className="text-[10px] font-mono font-bold text-[#6B6762] uppercase tracking-widest mb-2">Neutral</div>
                                                                    <div className="flex h-16 w-full rounded-xl overflow-hidden border border-[#E4DFD7]">
                                                                        {[
                                                                            { hex: "#0D0D0D", darkText: false },
                                                                            { hex: "#4A4A4A", darkText: false },
                                                                            { hex: "#9B9B9B", darkText: false },
                                                                            { hex: "#E8E8E8", darkText: true },
                                                                            { hex: "#F7F7F7", darkText: true },
                                                                        ].map((c) => (
                                                                            <div key={c.hex} className="flex-1 h-full relative group transition-all duration-300 hover:flex-[2] cursor-default" style={{ backgroundColor: c.hex }}>
                                                                                <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${c.darkText ? 'text-black/70' : 'text-white/90'}`}>{c.hex}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            <div className="text-left mt-2">
                                                                <h3 className="text-xl md:text-2xl font-bold font-sans text-[#0C0C0C] mb-3">System Color Palette</h3>
                                                                <p className="text-sm md:text-base text-[#6B6762] leading-relaxed font-sans">
                                                                    Three-tier palette: Primary blues build institutional trust, Accent colours communicate real-time status (danger, warning, success), and Neutrals provide the clean canvas that keeps high-stress interfaces readable.
                                                                </p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── 10 PLATFORM SHOWCASE ── */}
                                            <section
                                                className="dv-section bg-white border-b border-[#E4DFD7] relative"
                                                id="design-section"
                                                style={{ paddingTop: ctrlPaddingY, paddingBottom: ctrlPaddingY }}
                                            >
                                                {/* ── Localhost controller toggle ── */}
                                                {isLocalhost && (
                                                    <button
                                                        onClick={() => setShowCtrl(v => !v)}
                                                        className="absolute top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0C0C0C] text-white font-mono text-[10px] font-bold tracking-widest hover:bg-[#1B3FAB] transition-colors shadow-lg"
                                                    >
                                                        {showCtrl ? "✕ CLOSE" : "⚙ CONTROLS"}
                                                    </button>
                                                )}

                                                {/* ── Floating control panel ── */}
                                                {isLocalhost && showCtrl && (
                                                    <div className="absolute top-14 right-4 z-50 bg-[#0C0C0C] text-white rounded-2xl shadow-2xl p-5 w-72 flex flex-col gap-4 font-mono text-[11px]">
                                                        <div className="text-white/50 uppercase tracking-widest text-[9px] font-bold border-b border-white/10 pb-2">Showcase Controls</div>

                                                        {/* Padding */}
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex justify-between">
                                                                <span className="text-white/70">Section Padding Y</span>
                                                                <span className="text-[#1B3FAB] font-bold">{ctrlPaddingY}px</span>
                                                            </div>
                                                            <input type="range" min={0} max={160} step={4} value={ctrlPaddingY}
                                                                onChange={e => setCtrlPaddingY(Number(e.target.value))}
                                                                className="w-full accent-[#1B3FAB] cursor-pointer"
                                                            />
                                                        </div>

                                                        {/* Column gap */}
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex justify-between">
                                                                <span className="text-white/70">Column Gap</span>
                                                                <span className="text-[#2EC27E] font-bold">{ctrlGap}px</span>
                                                            </div>
                                                            <input type="range" min={0} max={128} step={4} value={ctrlGap}
                                                                onChange={e => setCtrlGap(Number(e.target.value))}
                                                                className="w-full accent-[#2EC27E] cursor-pointer"
                                                            />
                                                        </div>

                                                        {/* Heading size */}
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex justify-between">
                                                                <span className="text-white/70">Heading Size</span>
                                                                <span className="text-[#F4B942] font-bold">{ctrlHeadingSize}px</span>
                                                            </div>
                                                            <input type="range" min={24} max={96} step={2} value={ctrlHeadingSize}
                                                                onChange={e => setCtrlHeadingSize(Number(e.target.value))}
                                                                className="w-full accent-[#F4B942] cursor-pointer"
                                                            />
                                                        </div>

                                                        {/* Body text size */}
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex justify-between">
                                                                <span className="text-white/70">Body Text Size</span>
                                                                <span className="text-[#E63946] font-bold">{ctrlBodySize}px</span>
                                                            </div>
                                                            <input type="range" min={12} max={28} step={1} value={ctrlBodySize}
                                                                onChange={e => setCtrlBodySize(Number(e.target.value))}
                                                                className="w-full accent-[#E63946] cursor-pointer"
                                                            />
                                                        </div>

                                                        {/* Proto scale */}
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex justify-between">
                                                                <span className="text-white/70">Prototype Scale</span>
                                                                <span className="text-[#7C3AED] font-bold">{ctrlProtoScale}%</span>
                                                            </div>
                                                            <input type="range" min={30} max={160} step={5} value={ctrlProtoScale}
                                                                onChange={e => setCtrlProtoScale(Number(e.target.value))}
                                                                className="w-full accent-[#7C3AED] cursor-pointer"
                                                            />
                                                        </div>

                                                        {/* Reset + Copy */}
                                                        <div className="flex gap-2 pt-1 border-t border-white/10">
                                                            <button
                                                                onClick={() => { setCtrlPaddingY(40); setCtrlGap(32); setCtrlHeadingSize(56); setCtrlBodySize(16); setCtrlProtoScale(100); }}
                                                                className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-[10px] transition-colors"
                                                            >↩ Reset</button>
                                                            <button
                                                                onClick={() => navigator.clipboard?.writeText(`paddingY:${ctrlPaddingY} gap:${ctrlGap} heading:${ctrlHeadingSize} body:${ctrlBodySize} proto:${ctrlProtoScale}%`)}
                                                                className="flex-1 py-1.5 rounded-lg bg-[#1B3FAB] hover:bg-[#2B52CC] text-white text-[10px] transition-colors"
                                                            >⎘ Copy</button>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="max-w-[1280px] mx-auto px-6 md:px-12">
                                                    <div
                                                        className="grid grid-cols-1 lg:grid-cols-12 items-center"
                                                        style={{ gap: ctrlGap }}
                                                    >
                                                        {/* Left: Text Details */}
                                                        <div className="lg:col-span-5 flex flex-col items-start text-left gap-5">
                                                            <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase font-semibold">10 Platform Showcase</span>
                                                            <h2
                                                                className="dv-mixed-heading !text-left leading-[1.1] mb-0"
                                                                style={{ fontSize: ctrlHeadingSize }}
                                                            >
                                                                <span className="dv-heading-bold">Live</span>{" "}
                                                                <em className="dv-heading-italic">Prototype</em>
                                                            </h2>
                                                            <p className="text-[#6B6762] leading-relaxed font-sans font-normal" style={{ fontSize: ctrlBodySize }}>
                                                                Tap through the Pramaan app. Explore evidence collection, guided reporting, and scam detection modules built for real users under stress.
                                                            </p>
                                                            <div className="flex flex-col gap-2 pt-2">
                                                                {[
                                                                    { dot: "#0066FF", label: "Evidence Collection Flow" },
                                                                    { dot: "#00C48C", label: "Guided Reporting Journey" },
                                                                    { dot: "#7C3AED", label: "Scam Detection Modules" },
                                                                ].map(({ dot, label }) => (
                                                                    <div key={label} className="flex items-center gap-2.5">
                                                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
                                                                        <span className="font-mono text-[#6B6762] font-medium" style={{ fontSize: ctrlBodySize - 2 }}>{label}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Right: Figma Mobile Prototype */}
                                                        <div className="lg:col-span-7 w-full flex justify-center lg:justify-end">
                                                            <div className="relative" style={{ width: `${ctrlProtoScale}%`, maxWidth: 400 }}>
                                                                {/* Phone shell */}
                                                                <div
                                                                    className="relative w-full overflow-hidden rounded-[48px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.28)] border-[6px] border-[#0C0C0C]"
                                                                    style={{ aspectRatio: "9/19" }}
                                                                >
                                                                    {/* Status bar notch area */}
                                                                    <div className="absolute top-0 left-0 right-0 h-8 bg-[#0C0C0C] z-10 flex items-center justify-center">
                                                                        <div className="w-24 h-5 bg-[#0C0C0C] rounded-b-2xl" />
                                                                    </div>
                                                                    <iframe
                                                                        style={{ border: "none" }}
                                                                        width="100%"
                                                                        height="100%"
                                                                        src="https://embed.figma.com/proto/wjbbzs1eUB9XSs2g6AYPkW/Cyber-crime--DES-app-Design-?node-id=96-2568&viewport=717%2C-45%2C0.2&scaling=scale-down&content-scaling=fixed&starting-point-node-id=96%3A2568&page-id=82%3A2376&embed-host=share"
                                                                        allowFullScreen
                                                                        title="Pramaan App Prototype"
                                                                    />
                                                                </div>
                                                                {/* Subtle glow beneath phone */}
                                                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-[#0066FF]/20 blur-2xl rounded-full pointer-events-none" />
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── 11 PROJECTED IMPACT ── */}
                                            <section className="dv-section bg-white border-b border-[#E4DFD7] py-10 md:py-12" id="impact-section">
                                                <div className="dv-container">

                                                    {/* ── POSSIBLE IMPACT ── */}
                                                    <div className="border-t border-[#E4DFD7] pt-20">

                                                        {/* Intro — centred */}
                                                        <div className="text-center max-w-4xl mx-auto mb-16">
                                                            <span className="text-[10px] tracking-[0.2em] font-mono text-[#6B6762] uppercase block mb-4 font-semibold">Possible Impact</span>
                                                            <h3 className="dv-mixed-heading mb-6">
                                                                <span className="dv-heading-bold">Designed for</span> <em className="dv-heading-italic">Society</em>
                                                            </h3>
                                                            <p className="dv-subheading mb-12">
                                                                Transforming the crisis of digital fraud from a state of paralysis into a structured, supported path to justice.
                                                            </p>
                                                        </div>

                                                        {/* Three outcome cards — white, left-aligned */}
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
                                                            {[
                                                                {
                                                                    num: "01",
                                                                    title: "Reduce Evidence Collection Delay",
                                                                    text: "Victims currently have no guided process to collect digital evidence in crisis. Pramaan collapses a 6-hour confused scramble into a 10-minute guided flow.",
                                                                    accent: "#0066FF"
                                                                },
                                                                {
                                                                    num: "02",
                                                                    title: "Better Reporting Confidence",
                                                                    text: "Turns a confusing, fragmented system into a step-by-step guided journey. Users gain a clear sense of progress through case ID, status, and a downloadable report.",
                                                                    accent: "#2EC27E"
                                                                },
                                                                {
                                                                    num: "03",
                                                                    title: "Stronger Forensic Outcomes",
                                                                    text: "Standardised evidence bundles with timestamps, digital signatures, and chain-of-custody speed up forensic lab work and reduce the 22,000+ case backlog.",
                                                                    accent: "#7C3AED"
                                                                }
                                                            ].map(({ title, text }) => (
                                                                <div key={title} className="bg-white hover:bg-[#0C0C0C] border border-[#E4DFD7] hover:border-[#0C0C0C] rounded-2xl p-7 flex flex-col gap-3 dv-left transition-colors duration-300 group">
                                                                    <h4 className="text-lg md:text-xl font-bold font-sans text-[#0C0C0C] group-hover:text-white leading-snug text-left transition-colors duration-300">{title}</h4>
                                                                    <p className="text-sm md:text-base text-[#0C0C0C] group-hover:text-white/70 leading-relaxed font-sans text-left transition-colors duration-300">{text}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* SDG Cards — white bg, coloured left border, left-aligned */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-left">
                                                            {[
                                                                {
                                                                    num: "16",
                                                                    color: "#1B3FAB",
                                                                    title: "Peace, Justice & Strong Institutions",
                                                                    text: "Strengthens cybercrime reporting, evidence handling, and access to justice for digital fraud victims."
                                                                },
                                                                {
                                                                    num: "9",
                                                                    color: "#F4B942",
                                                                    title: "Industry, Innovation & Infrastructure",
                                                                    text: "Builds secure digital infrastructure for scam reporting, evidence collection, and coordination."
                                                                },
                                                                {
                                                                    num: "4",
                                                                    color: "#E63946",
                                                                    title: "Quality Education",
                                                                    text: "Awareness Hub teaches practical digital safety, evidence basics, and scam recognition skills to all users."
                                                                },
                                                                {
                                                                    num: "1",
                                                                    color: "#7C3AED",
                                                                    title: "No Poverty",
                                                                    text: "Helps protect savings from cyber fraud, especially for vulnerable users least able to absorb financial shocks."
                                                                }
                                                            ].map(({ num, color, title, text }) => (
                                                                <div key={num} className="bg-white hover:bg-[#0C0C0C] border border-[#E4DFD7] hover:border-[#0C0C0C] rounded-2xl p-6 flex flex-col gap-3 dv-left transition-colors duration-300 group">
                                                                    <div className="text-4xl md:text-5xl font-black font-sans leading-none text-left text-[#0C0C0C] group-hover:text-white transition-colors duration-300">{num}</div>
                                                                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-left text-[#6B6762] group-hover:text-white/50 transition-colors duration-300">SDG Goal</div>
                                                                    <h5 className="text-sm md:text-base font-bold font-sans text-[#0C0C0C] group-hover:text-white leading-snug text-left transition-colors duration-300">{title}</h5>
                                                                    <p className="text-xs md:text-sm text-[#0C0C0C] group-hover:text-white/70 leading-relaxed font-sans text-left transition-colors duration-300">{text}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                    </div>
                                                    {/* end Possible Impact */}

                                                </div>
                                            </section>
                                        </div>

                                        {/* Next/Previous Projects Section */}
                                        <div data-theme="light" className="w-full bg-white border-t border-black/10 flex flex-col sm:flex-row">
                                            <Link href="/projects/xtep" className="w-full p-12 md:p-24 lg:p-32 flex flex-col items-start justify-center group hover:bg-black/5 transition-colors duration-500">
                                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-6">Previous Project</span>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className="text-2xl md:text-4xl lg:text-5xl text-black/40 group-hover:text-black group-hover:-translate-x-4 transition-all duration-500">&larr;</span>
                                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black group-hover:-translate-x-2 transition-all duration-500 leading-none pb-1">Xtep</h3>
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
                    )}
                </>
            </LiquidBackground>
        </>
    );
}

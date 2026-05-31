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
import { useState, useEffect } from "react";
import Link from "next/link";
import "./../nebula/nebula.css";

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

export default function XtepPage() {
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

                                <div className="white-canvas-container w-full overflow-visible relative z-20" data-theme="light">
                                    <div className="white-canvas-content w-full bg-white transition-colors duration-300 ease-out rounded-[40px] md:rounded-[80px] shadow-2xl origin-center" data-theme="light">
                                        <div className="dv-embed">
                                            {/* ── PROBLEM STATEMENT ── */}
                                            <section className="dv-section dv-problem-section" style={{ textAlign: 'left', padding: '80px 0' }}>
                                                <div className="dv-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                                        <div style={{ width: '8px', height: '8px', backgroundColor: '#f15a22', borderRadius: '2px' }}></div>
                                                        <span style={{ color: '#7a829a', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>THE BRIEF</span>
                                                    </div>

                                                    <h2 className="dv-left" style={{ fontSize: '3.5rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '32px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                                                        Running Faster Digitally
                                                    </h2>

                                                    <p className="dv-body" style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                                                        <strong>Xtep needed a digital ecosystem that reflected the energy of their physical products. The existing storefront felt static and failed to capture the 'momentum' that defines the brand. Key challenges included:</strong>
                                                    </p>

                                                    <ol style={{ paddingLeft: '0', listStyleType: 'none', color: '#6b7280', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '32px' }}>
                                                        <li>1. Optimizing complex 3D assets to load instantly on mobile networks</li>
                                                        <li>2. Designing a liquid transition and motion library reflecting athletic power</li>
                                                        <li>3. Balancing high-fashion visuals with technical specification panels</li>
                                                        <li>4. Constructing a personalized interactive product customization module</li>
                                                        <li>5. Lowering checkout friction for a global audience with localized payment routes</li>
                                                    </ol>
                                                </div>
                                            </section>

                                            {/* ── VISUAL DIRECTION ── */}
                                            <section className="dv-section dv-research-carousel-section">
                                                <div className="dv-container">
                                                    <h2 className="dv-mixed-heading">
                                                        <span className="dv-heading-bold">Product</span>{" "}
                                                        <em className="dv-heading-italic">Direction</em>
                                                    </h2>
                                                    <p className="dv-subheading">
                                                        We built a design system that feels alive, using momentum-based scrolling and dynamic image masks:
                                                    </p>

                                                    <div className="dv-dark-cards-carousel dv-mt-24">
                                                        <div className="dv-dark-cards-track">
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Fluid Mechanics</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Translating athletic movement into digital transitions that feel natural yet highly engineered.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Tech Specs</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Focusing on the materials and technology that give Xtep its competitive edge.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Mobile First</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Designing for the athlete on the go, with ultra-fast loading and one-tap interactions.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Motion Branding</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Creating a cohesive motion library that defines the brand's digital personality.
                                                                </p>
                                                            </div>
                                                            <div className="dv-dark-card" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)' }}>
                                                                <h3 className="dv-dark-card-title">Global Reach</h3>
                                                                <p className="dv-dark-card-body">
                                                                    Scaling the experience for a worldwide audience with localized content hubs.
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
                                                        Through brand immersion, motion studies, and Web3D prototyping, we engineered an e-commerce platform that matches Xtep's technical footwear details.
                                                    </p>

                                                    <div className="dv-method-cards-grid dv-mt-40">
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Brand Immersion</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Studying product anatomy and material science at Xtep's labs to translate engineering into visual storefront patterns.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Motion Studies</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Iterating on easing curves and inertia models to make page navigation feel athletic, springy, and responsive.</p>
                                                        </div>
                                                        <div className="dv-method-card" style={{ padding: '40px 32px', minHeight: '340px' }}>
                                                            <h5 className="dv-method-title dv-left" style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.25rem' }}>Web3D Optimization</h5>
                                                            <p className="dv-method-desc" style={{ color: 'rgba(0,0,0,0.6)', fontSize: '1rem', lineHeight: '1.6', flexGrow: 1 }}>Simplifying mesh complexity and high-res textures to render interactive 3D sneakers smoothly at 60fps on mobile.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── SKETCH & WIREFRAMES ── */}
                                            <section className="dv-section dv-wireframes-section" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
                                                <div className="dv-container">
                                                    <div className="dv-edge-cases-block dv-feature-light-gray dv-mb-24">
                                                        <div className="dv-edge-text dv-text-center">
                                                            <h3 className="dv-mixed-heading" style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                                                                <span className="dv-heading-bold">Storefront</span>{" "}
                                                                <em className="dv-heading-italic">Wireframing</em>
                                                            </h3>
                                                            <p className="dv-subheading">
                                                                Sketched product customizer interfaces, cart flyouts, and sneaker specification dashboards to optimize transactional flow and conversion metrics before visual styling.
                                                            </p>
                                                        </div>
                                                        <div className="dv-marquee dv-mt-40">
                                                            <div className="dv-marquee-track">
                                                                {wireframeCards.map((card) => (
                                                                    <div key={`track1-${card.id}`} className="dv-marquee-card">
                                                                        <img src={card.src} alt={card.alt} className="dv-marquee-img" loading="lazy" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="dv-marquee-track" aria-hidden="true">
                                                                {wireframeCards.map((card) => (
                                                                    <div key={`track2-${card.id}`} className="dv-marquee-card">
                                                                        <img src={card.src} alt={card.alt} className="dv-marquee-img" loading="lazy" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── DESIGN ARCHITECTURE FIGMA EMBED ── */}
                                            <section className="dv-section dv-architecture-section" style={{ paddingBottom: '40px' }}>
                                                <div className="dv-container dv-text-center">
                                                    <h2 className="dv-mixed-heading dv-mb-40">
                                                        <span className="dv-heading-bold">E-Commerce</span>{" "}
                                                        <em className="dv-heading-italic">Architecture</em>
                                                    </h2>

                                                    <div className="dv-prototype-window-wrapper">
                                                        <div className="dv-prototype-window-header">
                                                            <div className="dv-window-dots">
                                                                <span className="dv-dot-red"></span>
                                                                <span className="dv-dot-yellow"></span>
                                                                <span className="dv-dot-green"></span>
                                                            </div>
                                                            <div className="dv-window-title">
                                                                <Icon icon="solar:figma-bold-duotone" className="text-[#F24E1E] text-sm" />
                                                                <span className="font-sans font-medium text-xs tracking-wider">FIGMA BOARD</span>
                                                            </div>
                                                            <div className="dv-window-spacer"></div>
                                                        </div>
                                                        <div className="dv-prototype-embed-container">
                                                            <iframe
                                                                className="dv-prototype-iframe"
                                                                src="https://embed.figma.com/design/DSBKMu5b9w7FOs5EkQKAol/Data-Analytics-Project?node-id=1132-13335&t=ahg3kYmic4LqAEfy-4&embed-host=share"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── THE CANVAS SHOWCASE ── */}
                                            <section className="dv-section dv-intro-section">
                                                <div className="dv-container dv-text-center">
                                                    <h2 className="dv-mixed-heading">
                                                        <span className="dv-heading-bold">Introducing</span>{" "}
                                                        <em className="dv-heading-italic">the Experience</em>
                                                    </h2>
                                                    <p className="dv-subheading">
                                                        A digital flagship built to bring performance footwear to life.
                                                    </p>
                                                </div>

                                                <div className="dv-container dv-mt-40">
                                                    <div className="dv-bento-grid">
                                                        {/* Card 1 (Top Left) */}
                                                        <div className="dv-bento-card" style={{ padding: 0 }}>
                                                            <img src="/Xtep.png" alt="Xtep Digital Flagfront Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        {/* Card 2 (Bottom Left) */}
                                                        <div className="dv-bento-card" style={{ padding: 0 }}>
                                                            <img src="/Xtep2.png" alt="Xtep Mobile E-Commerce Mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>

                                                        {/* Card 3 (Top Mid) */}
                                                        <div className="dv-bento-card" style={{ padding: 0 }}>
                                                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200" alt="Xtep Sneaker Closeup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        {/* Card 4 (Bottom Mid) */}
                                                        <div className="dv-bento-card" style={{ padding: 0 }}>
                                                            <img src="https://images.unsplash.com/photo-1511556532299-8f6617a75a34?q=80&w=1200" alt="Athletic Display" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>

                                                        {/* Card 5 (Right Tall) */}
                                                        <div className="dv-bento-card dv-bento-tall" style={{ padding: 0 }}>
                                                            <img src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1200" alt="Running Shoes Detail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── DETAILED PORTFOLIO SECTIONS ── */}
                                            <section className="dv-section dv-screens-section" style={{ paddingTop: '120px' }}>
                                                <div className="dv-container">
                                                    <h2 className="dv-mixed-heading dv-text-center dv-mb-64">
                                                        <span className="dv-heading-bold">Features</span>{" "}
                                                        <em className="dv-heading-italic">Showcase</em>
                                                    </h2>

                                                    {/* Feature 1 */}
                                                    <div className="dv-feature-card dv-mb-40">
                                                        <div className="dv-feature-text dv-feature-light-gray">
                                                            <h3 className="dv-feature-heading dv-left">Fluid Mechanics</h3>
                                                            <p className="dv-subheading dv-left">Translating athletic movement into digital transitions that feel natural, incorporating liquid easing profiles and instant response times.</p>
                                                        </div>
                                                        <div className="dv-feature-visual dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)' }}>
                                                            <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 2 & 3 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-40">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Tech Specs</h4>
                                                                <p className="dv-screen-desc text-white-80">Focusing on the carbon plates and lightweight foam technology that give Xtep footwear its competitive edge.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1511556532299-8f6617a75a34?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Mobile First</h4>
                                                                <p className="dv-screen-desc text-white-80">Designing for the customer on the go, with ultra-fast loading, lightweight pages, and responsive tap targets.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Feature 4 & 5 in grid */}
                                                    <div className="dv-screens-2grid dv-mb-24">
                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">Motion Branding</h4>
                                                                <p className="dv-screen-desc text-white-80">Creating a cohesive kinetic motion library that defines Xtep's digital product showcases and checkout loops.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="dv-screen-card dv-feature-purple-bg" style={{ background: 'linear-gradient(135deg, #1f0b03 0%, #2e1005 100%)', height: 'auto', paddingBottom: '40px' }}>
                                                            <div className="dv-screen-card-text dv-text-center">
                                                                <h4 className="dv-screen-title text-white">3D Customizer</h4>
                                                                <p className="dv-screen-desc text-white-80">Allowing users to customize colorways and test cushioning details under simulated impact graphs in real time.</p>
                                                            </div>
                                                            <div className="dv-screen-card-visual dv-mt-24">
                                                                <div className="dv-video-wrapper" style={{ aspectRatio: '16/10' }}>
                                                                    <img src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1600" className="dv-screen-media" style={{ objectFit: 'cover' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* ── PRODUCT PROTOTYPE (MVP) ── */}
                                            <section className="dv-section dv-prototype-section">
                                                <div className="dv-container dv-text-center">
                                                    <h2 className="dv-mixed-heading dv-mb-40">
                                                        <span className="dv-heading-bold">Experience</span>{" "}
                                                        <em className="dv-heading-italic">the Storefront</em>
                                                    </h2>

                                                    <div className="dv-prototype-window-wrapper">
                                                        <div className="dv-prototype-window-header">
                                                            <div className="dv-window-dots">
                                                                <span className="dv-dot-red"></span>
                                                                <span className="dv-dot-yellow"></span>
                                                                <span className="dv-dot-green"></span>
                                                            </div>
                                                            <div className="dv-window-title">
                                                                <Icon icon="solar:figma-bold-duotone" className="text-[#F24E1E] text-sm" />
                                                                <span className="font-sans font-medium text-xs tracking-wider">INTERACTIVE PROTOTYPE</span>
                                                            </div>
                                                            <div className="dv-window-spacer"></div>
                                                        </div>
                                                        <div className="dv-prototype-embed-container">
                                                            <iframe
                                                                className="dv-prototype-iframe"
                                                                src="https://embed.figma.com/proto/DSBKMu5b9w7FOs5EkQKAol/Data-Analytics-Project?node-id=323-2905&viewport=-1260%2C-100%2C0.16&scaling=scale-down&content-scaling=fixed&starting-point-node-id=323%3A2905&page-id=0%3A1&embed-host=share"
                                                                allowFullScreen
                                                            />
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
                                                        Accelerating conversion and user engagement through motion:
                                                    </p>

                                                    <div className="dv-impact-grid dv-mt-40">
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Mobile Engagement</h4>
                                                            <p className="dv-impact-text">Launched a global digital flagship that saw a 25% increase in mobile session duration.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Conversion Increase</h4>
                                                            <p className="dv-impact-text">Frictionless checkout flows and interactive 3D sizing guides boosted conversions by 18%.</p>
                                                        </div>
                                                        <div className="dv-impact-card">
                                                            <h4 className="dv-impact-title">Performance Overhead</h4>
                                                            <p className="dv-impact-text">Reduced initial page load times by 40% through asset compression and progressive hydration.</p>
                                                        </div>
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

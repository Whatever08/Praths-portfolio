"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
    { num: '01', title: 'DISCOVERY', desc: 'Uncovering the core values to tell a story that resonates.', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800' },
    { num: '02', title: 'DEFINE', desc: 'Defining the roadmap. We analyze the landscape to position your brand effectively.', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' },
    { num: '03', title: 'CRAFT', desc: 'Pixel-perfect design merged with fluid animations.', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800' },
    { num: '04', title: 'TEST', desc: 'Rigorous testing to ensure absolute robustness before going live.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' },
    { num: '05', title: 'DEVELOP', desc: 'Translating design into robust code. Modern frameworks for silky smooth performance.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800' }
];

export function ProcessSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const dotsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const innerDotsRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        const mm = gsap.matchMedia();

        mm.add({
            isMobile: "(max-width: 767px)",
            isDesktop: "(min-width: 768px)"
        }, (context) => {
            const { isMobile } = context.conditions as any;

            // Precise distance calculations
            const totalHorizontalScroll = track.scrollWidth;
            const totalWidth = track.scrollWidth - window.innerWidth;
            const fadeHold = window.innerHeight * 0.8;

            // Slower scroll for mobile as requested
            // Much longer scroll for mobile to ensure 5th card finishes
            const scrollEnd = isMobile ? `+=${totalHorizontalScroll * 4 + fadeHold}` : `+=${totalHorizontalScroll + fadeHold}`;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => scrollEnd,
                    pin: true,
                    scrub: isMobile ? 1 : 0.5,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const cardProgress = Math.min(1, (self.scroll() - self.start) / (isMobile ? totalHorizontalScroll * 4 : totalHorizontalScroll));
                        if (progressFillRef.current) {
                            progressFillRef.current.style.width = `${Math.min(100, cardProgress * 100)}%`;
                        }

                        const velocity = self.getVelocity() / 300;
                        const skew = gsap.utils.clamp(-12, 12, velocity);

                        const total = processSteps.length;
                        dotsRefs.current.forEach((outer, i) => {
                            const inner = innerDotsRefs.current[i];
                            if (!outer || !inner) return;
                            const threshold = i / (total - 1);
                            const active = cardProgress >= threshold - 0.02; // Tightened threshold

                            inner.style.backgroundColor = active ? "#ff3b30" : "transparent";
                            inner.style.borderColor = active ? "#ff3b30" : "rgba(255,255,255,0.25)";
                            outer.style.transform = active ? "scale(1.2)" : "scale(1)";
                            outer.style.borderColor = active ? "rgba(255,59,48,0.3)" : "rgba(255,255,255,0.08)";
                        });

                        // Dynamic skew only for desktop
                        if (!isMobile) {
                            const innerCards = track.querySelectorAll(".process-card-inner");
                            innerCards.forEach((card) => {
                                gsap.to(card, { skewX: skew, duration: 0.3, ease: "power2.out", overwrite: "auto" });
                            });
                        }
                    }
                }
            });

            tl.to(track, {
                x: -totalWidth,
                ease: "none",
                duration: 1
            });

            tl.to(section, {
                opacity: 0,
                scale: 0.95,
                y: -50,
                duration: 0.2,
                ease: "power2.inOut"
            });

            const cards = track.querySelectorAll(".process-card-inner");
            cards.forEach((el) => {
                if (isMobile) {
                    // FLAT MOBILE ANIMATION
                    gsap.set(el, { rotateY: 0, z: 0, skewX: 0 });
                    gsap.fromTo(el,
                        { opacity: 1, x: 100 },
                        {
                            opacity: 1, x: 0,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: el,
                                containerAnimation: tl,
                                start: "left 100%",
                                end: "left 10%",
                                scrub: true,
                            }
                        }
                    );

                    // EXIT for mobile
                    gsap.to(el, {
                        opacity: 1, x: -100,
                        ease: "power2.in",
                        scrollTrigger: {
                            trigger: el,
                            containerAnimation: tl,
                            start: "right 90%",
                            end: "right 0%",
                            scrub: true,
                        }
                    });
                } else {
                    // 3D DESKTOP ANIMATION
                    gsap.set(el, { transformPerspective: 2000 });
                    gsap.fromTo(el,
                        { rotateY: 30, z: -250, opacity: 0, scale: 0.85, x: 100 },
                        {
                            rotateY: 0, z: 0, opacity: 1, scale: 1, x: 0,
                            ease: "none",
                            scrollTrigger: {
                                trigger: el,
                                containerAnimation: tl,
                                start: "left 100%",
                                end: "left 20%",
                                scrub: true,
                            }
                        }
                    );

                    gsap.to(el, {
                        rotateY: -30, z: -250, opacity: 0, scale: 0.85, x: -100,
                        ease: "none",
                        immediateRender: false,
                        scrollTrigger: {
                            trigger: el,
                            containerAnimation: tl,
                            start: "right 80%",
                            end: "right -20%",
                            scrub: true,
                        }
                    });
                }
            });
        });

        return () => mm.revert();
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative bg-black/90 z-30 pointer-events-auto overflow-hidden">

            {/* ── Top: label + horizontal progress tracker ── */}
            <div className="absolute top-0 left-0 right-0 z-30 pt-[calc(5rem+5vh)] pb-0 flex flex-col items-center">
                <p className="text-[30px] font-semibold font-sans text-white mb-8 text-center">
                    The Process
                </p>

                {/* Progress row — width constrained and centered */}
                <div className="relative w-[70vw] max-w-[700px]" style={{ height: '52px' }}>

                    {/* line at center of 22px dot: 14px label + 4px gap + 11px = 29px */}
                    <div className="absolute left-0 right-0 bg-white/[0.07]" style={{ top: '29px', height: '1px' }} />
                    <div
                        ref={progressFillRef}
                        className="absolute left-0 bg-[#ff3b30] origin-left"
                        style={{ top: '29px', height: '1px', width: '0%' }}
                    />

                    {/* Dots + labels */}
                    {processSteps.map((step, i) => (
                        <div
                            key={i}
                            className="absolute flex flex-col items-center -translate-x-1/2"
                            style={{ left: `${(i / (processSteps.length - 1)) * 100}%`, top: 0 }}
                        >
                            {/* Step label */}
                            <span className="text-[9px] uppercase tracking-[0.15em] text-white/30 font-semibold" style={{ lineHeight: '14px', marginBottom: '4px' }}>
                                {step.num}
                            </span>

                            {/* Outer ring 22px */}
                            <div
                                ref={el => { dotsRefs.current[i] = el; }}
                                className="w-[22px] h-[22px] rounded-full border border-white/[0.15] bg-[#080808] flex items-center justify-center transition-all duration-300"
                            >
                                {/* Inner dot 8px */}
                                <div
                                    ref={el => { innerDotsRefs.current[i] = el; }}
                                    className="w-2 h-2 rounded-full border border-white/25 bg-transparent transition-all duration-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Horizontally scrolling cards ── */}
            <div className="h-screen overflow-hidden flex">
                <div
                    ref={trackRef}
                    className="flex h-full will-change-transform"
                    style={{ width: "max-content" }}
                >
                    {processSteps.map((step) => (
                        <div
                            key={step.num}
                            className="relative w-screen h-screen shrink-0 flex items-center justify-center"
                        >
                            <div
                                className="process-card-inner w-full transform translate-y-[13vh] flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-24"
                                style={{
                                    paddingLeft: 'clamp(10vw, 50% - 350px, 50% - 350px)',
                                    paddingRight: '10vw'
                                }}
                            >
                                <div className="flex-1">
                                    {/* Ghost number */}
                                    <span className="block text-[10rem] md:text-[14rem] lg:text-[17rem] leading-none font-black text-white select-none -mb-8 md:-mb-14">
                                        {step.num}
                                    </span>
                                    {/* Red accent */}
                                    <div className="w-12 h-[2px] bg-[#ff3b30] mb-7" />
                                    <h3 className="text-[2.8rem] md:text-[4.5rem] lg:text-[5.5rem] font-medium tracking-tight text-white uppercase leading-[0.95] mb-5">
                                        {step.title}
                                    </h3>
                                    <p className="text-white text-base md:text-lg leading-relaxed max-w-[28rem]">
                                        {step.desc}
                                    </p>
                                </div>

                                {/* Square Image Placeholder */}
                                <div className="relative shrink-0 group">
                                    <div className="absolute inset-0 bg-red-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] bg-white/10 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-sm relative z-10 transition-transform duration-700 group-hover:scale-[1.02]">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full h-full object-cover opacity-100 transition-opacity duration-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

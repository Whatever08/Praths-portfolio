"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface FeatureItem {
    number: string;
    title: string;
    description: string;
    bullets?: string[];
    image: string;
}

interface ScrollFeaturesProps {
    heading?: string;
    subtitle?: string;
    items: FeatureItem[];
    theme?: "light" | "dark";
}

export const ScrollFeatures = ({
    heading, // optional
    subtitle,
    items,
    theme = "light",
}: ScrollFeaturesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinWrapperRef = useRef<HTMLDivElement>(null);
    const leftColumnRef = useRef<HTMLDivElement>(null);

    const isDark = theme === "dark";
    const textColor = isDark ? "text-white" : "text-black";
    const bodyColor = isDark ? "text-white/60" : "text-black/50";
    const borderColor = isDark ? "border-white/10" : "border-black/[0.08]";
    const bgColor = isDark ? "bg-[#0a0a0a]" : "bg-white";
    const dividerColor = isDark ? "bg-white/10" : "bg-black/[0.08]";
    const inactiveColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
    const activeColor = "#f97316";

    useGSAP(() => {
        if (!pinWrapperRef.current) return;

        const bodies = pinWrapperRef.current.querySelectorAll(".feature-body");
        const numbers = pinWrapperRef.current.querySelectorAll(".feature-number");
        const titles = pinWrapperRef.current.querySelectorAll(".feature-title");
        const imageWrappers = pinWrapperRef.current.querySelectorAll(".image-wrapper");
        const images = pinWrapperRef.current.querySelectorAll(".image-wrapper img");

        // 1. Measure precise pixel heights of the bodies to prevent GSAP "auto" snapping
        const bodyHeights: number[] = [];
        bodies.forEach((el) => {
            const tempEl = el as HTMLElement;
            // Temporarily open to measure real physical height
            gsap.set(tempEl, { height: "auto", position: "absolute", visibility: "hidden", display: "block" });
            const height = tempEl.offsetHeight;
            bodyHeights.push(height);
            // Reset back
            gsap.set(tempEl, { height: 0, position: "static", visibility: "visible", display: "block", overflow: "hidden", marginTop: 0 });
        });

        // 2. Initialize DOM startup state for GSAP 
        gsap.set(bodies[0], { height: bodyHeights[0], opacity: 1, marginTop: 16 });

        gsap.set(numbers, { color: inactiveColor });
        gsap.set(numbers[0], { color: activeColor });

        gsap.set(titles, { opacity: 0.4 });
        gsap.set(titles[0], { opacity: 1 });

        // Initialize right-side images stacked. All images after first are clipped hidden at the bottom
        gsap.set(imageWrappers, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(imageWrappers[0], { clipPath: "inset(0% 0 0 0)" });
        
        // Initial rising state for images
        gsap.set(images, { y: 60, scale: 1.1 });
        gsap.set(images[0], { y: 0, scale: 1 });

        const scrollDistance = items.length * 900; // Large scrub distance for smooth reading

        // 3. Setup the master scrubber timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinWrapperRef.current,
                start: "top top",
                end: `+=${scrollDistance}`,
                pin: true,
                scrub: 1, // Smooth damping, completely locks to scroll wheel
            }
        });

        // 4. Build the timeline sequence linearly
        for (let i = 0; i < items.length - 1; i++) {
            
            // "HOLD" Phase: Let the user scroll safely while the item stays fully active
            tl.to({}, { duration: 0.6 }); 

            // "TRANSITION" Phase: Scrub collapse current item, expand next item
            const transTime = 1.2; // Increase duration relative to hold for smoother easing interpolation
            
            // Collapse current item
            tl.to(bodies[i], { height: 0, opacity: 0, marginTop: 0, duration: transTime, ease: "power2.inOut" }, `trans-${i}`);
            tl.to(numbers[i], { color: inactiveColor, duration: transTime, ease: "power2.inOut" }, `trans-${i}`);
            tl.to(titles[i], { opacity: 0.4, duration: transTime, ease: "power2.inOut" }, `trans-${i}`);
            
            // Expand next item
            tl.to(bodies[i+1], { height: bodyHeights[i+1], opacity: 1, marginTop: 16, duration: transTime, ease: "power2.inOut" }, `trans-${i}`);
            tl.to(numbers[i+1], { color: activeColor, duration: transTime, ease: "power2.inOut" }, `trans-${i}`);
            tl.to(titles[i+1], { opacity: 1, duration: transTime, ease: "power2.inOut" }, `trans-${i}`);
            
            // New Image slowly rises from the bottom of the frame exactly like Capstonebox
            tl.to(imageWrappers[i+1], { clipPath: "inset(0% 0 0 0)", duration: transTime, ease: "power2.inOut" }, `trans-${i}`);
            tl.to(images[i+1], { y: 0, scale: 1, duration: transTime, ease: "power2.out" }, `trans-${i}`);
        }

        // Final "HOLD" phase
        tl.to({}, { duration: 0.6 });

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className={`w-full ${bgColor}`}
            data-theme={theme}
        >
            <div ref={pinWrapperRef} className="w-full h-[100dvh] flex flex-col justify-start overflow-hidden pt-52 pb-10">
                
                {/* Optional Section Header */}
                {(heading || subtitle) && (
                    <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 mb-16 shrink-0">
                        {heading && (
                            <h2 className={`text-[30px] md:text-[40px] font-semibold tracking-tight ${textColor} mb-2`}>
                                {heading}
                            </h2>
                        )}
                        {subtitle && (
                            <p className={`text-sm md:text-base ${bodyColor} max-w-xl`}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Two-Column Scroll Layout */}
                <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 relative flex flex-col md:flex-row items-start flex-1 min-h-0">
                    
                    {/* Vertical Divider */}
                    <div className={`hidden lg:block absolute left-[65%] top-0 bottom-0 w-px ${dividerColor}`} />

                    {/* Left Column — Accordion Items */}
                    <div className="w-full lg:w-[65%] lg:pr-14 relative z-10 flex flex-col pt-12 h-full overflow-visible">
                        {/* Wrapper to physically slide upwards mirroring native scroll */}
                        <div ref={leftColumnRef} className="flex flex-col w-full relative">
                            {items.map((item, i) => (
                                <div
                                    key={i}
                                    className={`scroll-trigger-item py-4 md:py-5 border-b ${borderColor} last:border-b-0`}
                                >
                                    <div className="flex items-start gap-4 md:gap-6">
                                        {/* Number */}
                                        <div className="flex flex-col items-center shrink-0 w-10 md:w-12 pt-1">
                                            <span className="feature-number text-3xl md:text-5xl font-bold tracking-tighter leading-none">
                                                {item.number}
                                            </span>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 min-w-0">
                                            {/* Fix: Added explicit textColor class so it doesn't default to site-wide white on white themes! */}
                                            <h3 className={`feature-title text-xl md:text-2xl font-bold tracking-tight pb-1 ${textColor}`}>
                                                {item.title}
                                            </h3>

                                            {/* GSAP Managed Accordion Body */}
                                            <div className="feature-body w-full">
                                                <div className="py-2">
                                                    <p className={`text-sm md:text-base ${bodyColor} leading-snug mb-4 max-w-sm`}>
                                                        {item.description}
                                                    </p>
                                                    {item.bullets && item.bullets.length > 0 && (
                                                        <ul className={`space-y-2 text-sm ${bodyColor} pb-1`}>
                                                            {item.bullets.map((b, bi) => (
                                                                <li key={bi} className="flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] opacity-70" />
                                                                    {b}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    {/* Mobile-only image that appears within accordion */}
                                                    <div className="block lg:hidden mt-4 rounded-xl overflow-hidden aspect-[16/9] bg-neutral-100 relative">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column — Static Image Wrap */}
                    <div className="w-full lg:w-[35%] relative hidden lg:block h-[45vh] lg:h-[55vh] flex justify-end pt-12">
                        <div className="h-full w-full">
                            {/* Static Frame Mask - Cleanly sized to its 35% container */}
                            <div className="w-full h-full rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.12)] relative bg-neutral-100">
                                
                                {/* All images perfectly stacked, GSAP manipulates clip path to reveal from bottom. Parallax removed as requested. */}
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="image-wrapper absolute inset-0 w-full h-full pointer-events-none"
                                        style={{ zIndex: i + 1 }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ScrollFeatures;

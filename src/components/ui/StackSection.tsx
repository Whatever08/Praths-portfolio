"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const row1 = ["HTML", "CSS", "Java", "GSAP", "Framer Motion"];
const row2 = ["Figma", "Photoshop", "Illustrator", "Rive", "Spline"];
const row3 = ["Vercel", "Claude", "OpenAI", "Antigravity"];

export default function StackSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        // Register ScrollTrigger inside useGSAP if not already registered on window
        gsap.registerPlugin(require("gsap/ScrollTrigger").ScrollTrigger);
        
        const marquees = gsap.utils.toArray(".stack-marquee-inner") as HTMLElement[];

        marquees.forEach((marquee, i) => {
            const direction = i % 2 === 0 ? -1 : 1;
            const setWidth = 100 / 8; // 12.5% because we duplicate 8 times

            // Initialize right-moving rows off-screen slightly to avoid blank gaps
            if (direction === 1) {
                gsap.set(marquee, { xPercent: -setWidth * 2 });
            }

            // Scrub distance based on scroll
            gsap.to(marquee, {
                xPercent: direction === -1 ? -setWidth * 2 : 0, 
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1, // Smooth dragging linked to scroll
                }
            });
        });
    }, { scope: sectionRef });

    const renderRow = (items: string[]) => (
        <div className="stack-marquee w-full overflow-hidden whitespace-nowrap py-1">
            <div className="stack-marquee-inner flex items-center w-max leading-none pointer-events-auto">
                {[...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items].map((item, idx) => (
                    <span
                        key={idx}
                        className="stack-tag text-[45px] font-medium uppercase tracking-tighter text-white cursor-default select-none px-4 md:px-5"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <section ref={sectionRef} className="py-24 bg-black/90 relative z-30 pointer-events-auto overflow-hidden">
            <div className="max-w-[100rem] mx-auto px-6 md:px-12 mb-8 flex flex-col items-center">
                <h2 className="text-[30px] font-semibold font-sans text-white text-center">
                    Stack
                </h2>
            </div>

            <div className="flex flex-col gap-[1px] md:gap-[3px] leading-none">
                {renderRow(row1)}
                {renderRow(row2)}
                {renderRow(row3)}
            </div>
        </section>
    );
}

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const textContent = [
    "AN", "INTERACTION", "DESIGNER", "AND", "VIBE-CODING", "NOVICE", "FROM", "PUNE,",
    "DRIVEN", "BY", "CURIOSITY", "BEYOND", "TRADITIONAL", "INTERFACES.", "I", "DESIGN",
    "FOR", "WEB", "AND", "APPS,", "WHILE", "CONTINUOUSLY", "EXPLORING", "NEW", "WAYS",
    "PEOPLE", "INTERACT", "WITH", "DIGITAL", "SYSTEMS.", "MY", "FUTURE", "GOALS", "LIE",
    "IN", "IMMERSIVE", "ENVIRONMENTS-", "EXPLORING", "AR,", "VR,", "AND", "BUILDING",
    "GENERATIVE,", "REAL-TIME", "EXPERIENCES.", "MY", "WORK", "BLENDS", "CODE,", "MOTION,",
    "AND", "SENSORY", "INPUT", "TO", "CREATE", "DYNAMIC,", "EXPERIMENTAL", "INTERFACES."
];

const highlights: string[] = [];

export function TextRevealSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            ".reveal-word",
            {
                opacity: 0.15,
            },
            {
                opacity: 1,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=400%", // Pin for 4x the viewport height — text has ~60 words
                    scrub: 1.5,
                    pin: true,
                },
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-40 px-6 flex items-center justify-center min-h-[100vh] bg-black/90 relative z-30 pointer-events-auto">
            <div className="max-w-[75rem] mx-auto text-center flex flex-col items-center">
                <h2 className="text-[30px] font-semibold font-sans text-white mb-16 text-center">
                    About Me
                </h2>

                <h3 ref={textRef} className="text-[1.15rem] md:text-[2rem] lg:text-[2.6rem] leading-[1.15] font-medium text-white uppercase flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em]">
                    {textContent.map((word, i) => {
                        const isHighlight = highlights.includes(word);
                        return (
                            <span
                                key={i}
                                className={`reveal-word inline-block ${isHighlight ? 'text-[#FF3333]' : ''}`}
                            >
                                {word}
                            </span>
                        );
                    })}
                </h3>
            </div>
        </section>
    );
}

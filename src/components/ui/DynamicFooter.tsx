"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@iconify/react";

gsap.registerPlugin(ScrollTrigger);

export const DynamicFooter = () => {
    const footerRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // GSAP Reveal Animation
        if (textRef.current && footerRef.current) {
            gsap.fromTo(
                textRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                    },
                }
            );
        }
    }, [isMounted]);

    if (!isMounted) return <div className="h-20" />; // Spacer during hydration

    return (
        <footer
            ref={footerRef}
            data-theme="dark"
            className="relative w-full bg-black/90 backdrop-blur-xl border-t border-white/5 pt-32 pb-12 overflow-hidden z-[30]"
        >
            <div className="max-w-[100rem] mx-auto px-6 md:px-12">
                {/* Heading + Contact — same line */}
                <div ref={textRef} className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 md:gap-8">
                    <h2 className="text-[6vw] md:text-[5vw] font-black leading-[0.85] tracking-tighter text-white uppercase select-none">
                        Let&apos;s <br />
                        Make <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-white font-serif italic font-normal">Vibes.</span>
                    </h2>

                    {/* Get in touch — right-aligned, bottom of the heading */}
                    <a
                        href="mailto:tprathamesh8@gmail.com"
                        className="group inline-flex flex-col items-start md:items-end gap-2 shrink-0 pb-2"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-white text-[2.8vw] md:text-[2.4vw] font-black leading-[0.85] tracking-tighter italic whitespace-nowrap pr-2 md:pr-4">
                            Shoot an Email
                        </span>
                        <span className="text-white text-[4.8vw] md:text-[4vw] font-black leading-[0.85] tracking-tighter uppercase border-b border-transparent group-hover:border-white/50 transition-all flex items-center gap-2 whitespace-nowrap">
                            Get in touch <Icon icon="solar:arrow-right-up-linear" className="w-[4.8vw] h-[4.8vw] md:w-[4vw] md:h-[4vw]" />
                        </span>
                    </a>
                </div>

                {/* Mid-Footer Credits — Requested Placement */}
                <div className="mb-24 flex flex-col items-start gap-1 text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium italic">
                    <p>Forged in <span className="text-white/80 not-italic">Antigravity</span></p>
                    <p>Crafted by Prathamesh Tipnis <span className="text-white/80 not-italic">♡</span></p>
                    <p>Powered by <span className="text-white/80 not-italic">Vercel</span></p>
                </div>

                {/* Bottom Bar */}
                <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-[10px] font-sans font-medium">
                    <p>© 2024 Prathamesh Tipnis. All rights reserved.</p>
                    <div className="flex gap-8">
                        <button className="hover:text-white/50 transition-colors">Privacy</button>
                        <button className="hover:text-white/50 transition-colors">Terms</button>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="text-white flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
                        >
                            Back to top <Icon icon="solar:alt-arrow-up-linear" className="text-xs" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

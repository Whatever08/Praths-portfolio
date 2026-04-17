"use client";

import React, { useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* =========================
   Types
 ========================= */

type GalleryItem = {
    type: "image" | "video";
    src: string;
    alt?: string;
};

export type HorizontalScrollGalleryProps = {
    items: GalleryItem[];
    heading?: ReactNode;
    description?: ReactNode;
    className?: string;
};

/* =========================
   Component
 ========================= */

export const HorizontalScrollGallery: React.FC<HorizontalScrollGalleryProps> = ({
    items,
    heading,
    description,
    className
}) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!rootRef.current || !containerRef.current || !wrapperRef.current) return;

        const pinWrap = wrapperRef.current;
        const pinWrapWidth = pinWrap.offsetWidth;
        const horizontalScrollLength = pinWrapWidth - window.innerWidth;

        // Ensure we only pin and scroll if the content is wider than the screen
        if (horizontalScrollLength > 0) {
            gsap.to(pinWrap, {
                x: -horizontalScrollLength,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    start: "center center",
                    end: `+=${horizontalScrollLength}`,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });
        }
    }, { scope: rootRef });

    return (
        <section ref={rootRef} className={`w-full bg-white overflow-hidden ${className || ""}`}>
            {/* Header Area */}
            {(heading || description) && (
                <div className="max-w-[800px] mx-auto px-6 md:px-12 pt-32 pb-16 text-center text-black">
                    {heading && (
                        <h3 className="text-2xl md:text-[32px] font-bold tracking-tight mb-6 text-black leading-tight">
                            {heading}
                        </h3>
                    )}
                    {description && (
                        <p className="text-black/60 font-medium leading-[1.6] max-w-2xl mx-auto">
                            {description}
                        </p>
                    )}
                </div>
            )}

            {/* Horizontal Scroll Area */}
            <div ref={containerRef} className="h-screen flex items-center bg-white">
                <div ref={wrapperRef} className="flex gap-8 px-8 md:px-[10vw] flex-nowrap h-[60vh] md:h-[75vh]">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="relative h-full aspect-[4/3] flex-shrink-0 rounded-3xl overflow-hidden bg-black/5 border border-black/10"
                        >
                            {item.type === "image" ? (
                                <img
                                    src={item.src}
                                    alt={item.alt || `Gallery image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    src={item.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-32 bg-white"></div> {/* Spacer under pin */}
        </section>
    );
};

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
    title?: string;
    description?: string;
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
        const pinWrapWidth = pinWrap.scrollWidth;
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
                    start: "top top",
                    end: `+=${horizontalScrollLength}`,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });
        }
    }, { scope: rootRef });

    return (
        <section ref={rootRef} className={`w-full bg-white overflow-hidden ${className || ""}`}>
            {/* Horizontal Scroll Area (Pinned Container) */}
            <div ref={containerRef} className="h-screen w-full flex flex-col items-center justify-center bg-white">
                
                {/* Header Area */}
                {(heading || description) && (
                    <div className="w-full px-6 md:px-12 mb-10 md:mb-16 text-center text-black shrink-0">
                        {heading && (
                            <h3 className="w-full text-2xl md:text-[32px] font-bold tracking-tight mb-4 text-black leading-tight">
                                {heading}
                            </h3>
                        )}
                        {description && (
                            <p className="w-full text-black/60 font-medium leading-[1.6]">
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className="w-full">
                    <div ref={wrapperRef} className="flex gap-8 px-8 md:px-[10vw] flex-nowrap items-center">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="group flex flex-col gap-5 flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw]"
                        >
                            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-black/5 border border-black/10">
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
                            {(item.title || item.description) && (
                                <div className="flex flex-col gap-1.5 px-2">
                                    {item.title && (
                                        <h4 className="text-xl md:text-2xl font-bold tracking-tight text-black">
                                            {item.title}
                                        </h4>
                                    )}
                                    {item.description && (
                                        <p className="text-sm md:text-base text-black/60 font-medium leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    </div>
                </div>
            </div>

            <div className="h-32 bg-white"></div> {/* Spacer under pin */}
        </section>
    );
};

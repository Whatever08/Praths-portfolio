"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* =========================
   Types
 ========================= */

interface StaggeredImage {
    src: string;
    alt?: string;
    aspectRatio?: string; // e.g., "3/4", "1/1", "4/5"
}

export interface StaggeredGridGalleryProps {
    images: StaggeredImage[];
    className?: string;
}

/* =========================
   Component
 ========================= */

export const StaggeredGridGallery: React.FC<StaggeredGridGalleryProps> = ({ 
    images, 
    className = "" 
}) => {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current) return;

        // Subtle subtle entry animation for each image
        const items = containerRef.current.querySelectorAll('.staggered-item');
        
        items.forEach((item, index) => {
            gsap.fromTo(item, 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });

    }, { scope: containerRef });

    // Split images into two columns
    const leftCol = images.filter((_, i) => i % 2 === 0);
    const rightCol = images.filter((_, i) => i % 2 !== 0);

    return (
        <section 
            ref={containerRef}
            className={`w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32 ${className}`}
            data-theme="light"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-start">
                
                {/* Left Column */}
                <div className="flex flex-col gap-8 md:gap-16 lg:gap-24">
                    {leftCol.map((img, idx) => (
                        <div key={`left-${idx}`} className="staggered-item w-full overflow-hidden rounded-[20px] md:rounded-[32px] bg-neutral-100 will-change-transform" style={{ aspectRatio: img.aspectRatio || "3/4" }}>
                            <img src={img.src} alt={img.alt || "Gallery image"} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* Right Column - Staggered */}
                <div className="flex flex-col gap-8 md:gap-16 lg:gap-24 mt-0 md:mt-32 lg:mt-48">
                    {rightCol.map((img, idx) => (
                        <div key={`right-${idx}`} className="staggered-item w-full overflow-hidden rounded-[20px] md:rounded-[32px] bg-neutral-100 will-change-transform" style={{ aspectRatio: img.aspectRatio || "4/5" }}>
                            <img src={img.src} alt={img.alt || "Gallery image"} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

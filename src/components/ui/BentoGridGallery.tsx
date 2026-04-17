"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* =========================
   Types
 ========================= */

interface BentoImage {
    src: string;
    alt?: string;
}

export interface BentoGridGalleryProps {
    images: BentoImage[]; // Should ideally provide exactly 3 images
    className?: string;
}

/* =========================
   Component
 ========================= */

export const BentoGridGallery: React.FC<BentoGridGalleryProps> = ({ 
    images, 
    className = "" 
}) => {
    const containerRef = useRef<HTMLElement>(null);
    const hasImages = images && images.length >= 3;

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll('.bento-item');
        
        // Staggered fade and slide up
        gsap.fromTo(items, 
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                }
            }
        );

    }, { scope: containerRef });

    if (!hasImages) return null; // Needs at least 3 images

    return (
        <section 
            ref={containerRef}
            className={`w-full max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32 ${className}`}
            data-theme="light"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
                
                {/* Large Featured Image (Left) */}
                <div className="bento-item md:col-span-7 lg:col-span-8 flex flex-col h-full min-h-[50vh] md:min-h-0 bg-neutral-100 rounded-[20px] md:rounded-[32px] overflow-hidden will-change-transform border border-black/5">
                    <img 
                        src={images[0].src} 
                        alt={images[0].alt || "Featured image"} 
                        className="w-full h-full object-cover rounded-inherit"
                    />
                </div>

                {/* Stacked Smaller Images (Right) */}
                <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 md:gap-8 lg:gap-10 h-full">
                    <div className="bento-item flex-1 bg-neutral-100 rounded-[20px] md:rounded-[32px] overflow-hidden min-h-[30vh] md:min-h-[auto] will-change-transform border border-black/5">
                        <img 
                            src={images[1].src} 
                            alt={images[1].alt || "Gallery image 2"} 
                            className="w-full h-full object-cover rounded-inherit"
                        />
                    </div>
                    
                    <div className="bento-item flex-1 bg-neutral-100 rounded-[20px] md:rounded-[32px] overflow-hidden min-h-[30vh] md:min-h-[auto] will-change-transform border border-black/5">
                        <img 
                            src={images[2].src} 
                            alt={images[2].alt || "Gallery image 3"} 
                            className="w-full h-full object-cover rounded-inherit"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

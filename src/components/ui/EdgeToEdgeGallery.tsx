"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* =========================
   Types
 ========================= */

interface EdgeToEdgeGalleryProps {
    src: string;
    alt?: string;
    height?: string; // e.g., "60vh", "100vh"
    className?: string;
}

/* =========================
   Component
 ========================= */

export const EdgeToEdgeGallery: React.FC<EdgeToEdgeGalleryProps> = ({ 
    src, 
    alt = "Full width gallery image", 
    height = "80vh",
    className = "" 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!containerRef.current || !imageRef.current) return;

        // Subtle Parallax effect on the image
        gsap.fromTo(imageRef.current,
            { y: "-15%" },
            {
                y: "15%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom", // Start when the top of the container hits the bottom of the viewport
                    end: "bottom top",   // End when the bottom of the container hits the top of the viewport
                    scrub: 0.5,
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef}
            className={`w-full overflow-hidden relative ${className}`}
            style={{ height }}
            data-theme="light" // Assumes it sits in the white canvas
        >
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="absolute top-0 left-0 w-full h-[130%] object-cover object-center will-change-transform" 
                // h-[130%] gives room for the parallax movement (-15% to +15%)
            />
        </section>
    );
};

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ViewportLensProps {
    children: React.ReactNode;
}

export function ViewportLens({ children }: ViewportLensProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const enabledRef = useRef(false);
    const bounceRef = useRef<gsap.core.Tween | null>(null);
    const returnRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useGSAP(() => {
        if (!containerRef.current || !contentRef.current) return;

        // Tighter perspective = more dramatic 3D depth
        gsap.set(containerRef.current, { perspective: 600, transformStyle: 'preserve-3d' });

        // Gate: enable once white section hits top
        const gridSection = document.querySelector(".reveal-grid-section");
        ScrollTrigger.create({
            trigger: gridSection || containerRef.current,
            start: "top top",
            onEnter: () => { enabledRef.current = true; },
            onLeaveBack: () => {
                enabledRef.current = false;
                gsap.to(contentRef.current, { scale: 1, z: 0, duration: 0.6, ease: "power2.out", overwrite: true, force3D: true });
            },
        });

        // Section reveals
        const sections = gsap.utils.toArray<HTMLElement>("[data-lens-reveal]");
        sections.forEach((section) => {
            gsap.set(section, { scale: 1, opacity: 1, transformPerspective: 1200, force3D: true });
            gsap.fromTo(section,
                { scale: 0.995 },
                {
                    scale: 1.01,
                    autoAlpha: 1,
                    ease: "power1.inOut",
                    scrollTrigger: { trigger: section, start: "top bottom", end: "top center", scrub: 1 }
                }
            );
        });
    }, { scope: containerRef });

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        let lastScrollY = window.scrollY;
        let lastTime = performance.now();

        const onScroll = () => {
            if (!enabledRef.current) return;

            const now = performance.now();
            const dt = now - lastTime;
            const dy = Math.abs(window.scrollY - lastScrollY);
            const velocity = dt > 0 ? (dy / dt) * 1000 : 0;

            lastScrollY = window.scrollY;
            lastTime = now;

            if (velocity < 50) return;

            // Subtle, slow bounce — max scale 1.015
            const targetScale = 1 + Math.min(velocity, 1200) / 200000;

            // Z-depth: content moves toward viewer (feels 3D)
            const targetZ = Math.min(40, velocity / 18);

            if (bounceRef.current) bounceRef.current.kill();
            bounceRef.current = gsap.to(el, {
                scale: targetScale,
                z: targetZ,
                duration: 0.8,
                ease: "power2.out",
                overwrite: true,
                force3D: true,
            });

            // Slow elastic return — both scale and z bounce back
            if (returnRef.current) clearTimeout(returnRef.current);
            returnRef.current = setTimeout(() => {
                gsap.to(el, {
                    scale: 1,
                    z: 0,
                    duration: 2.0,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: false,
                });
            }, 120);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (returnRef.current) clearTimeout(returnRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="viewport-lens-root w-full overflow-hidden relative"
            style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
        >
            <div
                ref={contentRef}
                className="viewport-lens-content will-change-transform origin-center"
            >
                {children}
            </div>
        </div>
    );
}

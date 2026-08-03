"use client";

import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null);
    const pathname = usePathname();

    // Tie Lenis to GSAP ticker for synchronized animations
    useEffect(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }
        
        gsap.ticker.add(update);
        
        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    // Reset scroll position on route change
    useEffect(() => {
        if (lenisRef.current?.lenis) {
            // Scroll to top immediately when route changes
            lenisRef.current.lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    return (
        <ReactLenis 
            root 
            ref={lenisRef} 
            options={{
                autoRaf: false,
                duration: 1.4,
                lerp: 0.05,
                wheelMultiplier: 1.1,
                gestureOrientation: "vertical",
                smoothWheel: true
            }}
        >
            {children}
        </ReactLenis>
    );
}

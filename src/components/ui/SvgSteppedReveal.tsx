"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SvgSteppedRevealProps {
  variant: "cover" | "uncover";
  direction?: "left" | "right"; // Which side finishes first
  onComplete?: () => void;
}

export default function SvgSteppedReveal({ variant, direction = "left", onComplete }: SvgSteppedRevealProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // 5 columns
    // We animate the top edge Y value mapping from 0 to 100 or 100 to 0.
    const proxy = { y0: 0, y1: 0, y2: 0, y3: 0, y4: 0 }; 

    // uncover: start at 0 (top-edge is at top, so fully covering screen) and animate to 100 (top edge at bottom, screen uncovered).
    // cover: start at 100 (top edge at bottom, screen uncovered) and animate to 0 (top edge at top, covering screen).
    const startY = variant === "uncover" ? 0 : 100;
    const endY = variant === "uncover" ? 100 : 0;

    proxy.y0 = startY;
    proxy.y1 = startY;
    proxy.y2 = startY;
    proxy.y3 = startY;
    proxy.y4 = startY;

    const updatePath = () => {
      if (!pathRef.current) return;
      const d = `
        M 0 ${proxy.y0} 
        L 20 ${proxy.y0} L 20 ${proxy.y1} 
        L 40 ${proxy.y1} L 40 ${proxy.y2} 
        L 60 ${proxy.y2} L 60 ${proxy.y3} 
        L 80 ${proxy.y3} L 80 ${proxy.y4} 
        L 100 ${proxy.y4}
        L 100 100 
        L 0 100 
        Z
      `.replace(/\s+/g, ' ').trim();
      pathRef.current.setAttribute("d", d);
    };

    updatePath();

    const tl = gsap.timeline({
      onComplete,
    });

    const targets = direction === "left" 
      ? ["y0", "y1", "y2", "y3", "y4"] 
      : ["y4", "y3", "y2", "y1", "y0"];

    targets.forEach((t, i) => {
      tl.to(
        proxy, 
        { 
          [t]: endY, 
          duration: 0.8, // Snappy transition like Capstone
          ease: "power3.inOut", 
          onUpdate: updatePath 
        }, 
        i * 0.08 // Stagger start time
      );
    });

    return () => {
      tl.kill();
    };
  }, [variant, direction, onComplete]);

  return (
    <div className={`fixed inset-0 z-[99999] pointer-events-none flex`}>
      <svg
        className="w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}

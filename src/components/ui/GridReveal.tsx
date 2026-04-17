"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface GridRevealProps {
    onComplete?: () => void;
    variant?: "in" | "out";
    direction?: "left" | "right" | "both";
}

const GridReveal: React.FC<GridRevealProps> = ({
    onComplete,
    variant = "out",
    direction = "both"
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const cells = gridRef.current.querySelectorAll(".grid-cell");

        const tl = gsap.timeline({
            onComplete: () => {
                if (onComplete) onComplete();
            },
        });

        if (variant === "in") {
            // Animation IN: Bars fill the screen (covering)
            tl.set(cells, { scaleX: 0, opacity: 1 });

            cells.forEach((cell, i) => {
                let origin = "left"; // Default: Comes from left
                if (direction === "right") origin = "right"; // Comes from right
                else if (direction === "both") origin = i % 2 === 0 ? "left" : "right";

                gsap.set(cell, { transformOrigin: origin });
            });

            tl.to(cells, {
                scaleX: 1,
                duration: 0.6,
                stagger: {
                    each: 0.05,
                    from: direction === "right" ? "end" : "start",
                },
                ease: "power2.inOut",
            });
        } else {
            // Animation OUT: Bars shrink (revealing)
            tl.set(cells, { scaleX: 1, opacity: 1 });

            cells.forEach((cell, i) => {
                let origin = "right"; // Default: Shrinks towards right
                if (direction === "right") origin = "left"; // Shrinks towards left
                else if (direction === "both") origin = i % 2 === 0 ? "right" : "left";

                gsap.set(cell, { transformOrigin: origin });
            });

            tl.to(cells, {
                scaleX: 0,
                duration: 0.8,
                stagger: {
                    each: 0.05,
                    from: direction === "right" ? "start" : "end",
                },
                ease: "expo.inOut",
            });
        }

        return () => {
            tl.kill();
        };
    }, [variant, onComplete, direction]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden bg-transparent"
        >
            <div
                ref={gridRef}
                className="grid w-full h-full"
                style={{
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "repeat(12, 1fr)",
                }}
            >
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="grid-cell w-full h-full bg-[#0A0E27]"
                    />
                ))}
            </div>
        </div>
    );
};

export default GridReveal;

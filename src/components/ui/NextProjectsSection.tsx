"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
    {
        id: "02",
        name: "ECOSPHERE DIGITAL",
        tag: "Brand Identity",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
        href: "/project-page",
    },
    {
        id: "03",
        name: "NOVA FINTECH",
        tag: "Product Design",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
        href: "/project-page",
    },
    {
        id: "04",
        name: "AURA LUXURY",
        tag: "E-Commerce",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
        href: "/project-page",
    },
    {
        id: "05",
        name: "LQD SYSTEMS",
        tag: "Design Systems",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
        href: "/project-page",
    },
];

interface ProjectRowProps {
    project: typeof PROJECTS[0];
    index: number;
    speed: number;
}

function ProjectRow({ project, index, speed }: ProjectRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const leftTrackRef = useRef<HTMLDivElement>(null);
    const rightTrackRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const leftTweenRef = useRef<gsap.core.Tween | null>(null);
    const rightTweenRef = useRef<gsap.core.Tween | null>(null);

    const label = `${project.name} · `;
    const repeats = Array.from({ length: 8 });

    // Condensed + tall = best base for the perspective stretch illusion
    const textStyle: React.CSSProperties = {
        fontFamily: "'Arial Narrow', 'Arial', sans-serif",
        fontSize: "clamp(80px, 14vw, 200px)",
        fontWeight: 900,
        fontStretch: "condensed",
        lineHeight: 0.9,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        color: "#000",
        // Extra horizontal squish to amplify the condensed look
        transform: "scaleX(0.62)",
        transformOrigin: "left center",
        display: "inline-block",
    };

    useEffect(() => {
        if (!leftTrackRef.current || !rightTrackRef.current || !rowRef.current) return;

        // Left track: radiates outward to the left
        leftTweenRef.current = gsap.fromTo(
            leftTrackRef.current,
            { x: "0%" },
            { x: "-50%", duration: speed, ease: "none", repeat: -1 }
        );

        // Right track: radiates outward to the right
        rightTweenRef.current = gsap.fromTo(
            rightTrackRef.current,
            { x: "-50%" },
            { x: "0%", duration: speed, ease: "none", repeat: -1 }
        );

        const row = rowRef.current;
        const img = imageRef.current;

        const onEnter = () => {
            gsap.to([leftTweenRef.current, rightTweenRef.current], { timeScale: 0.08, duration: 0.7, ease: "power2.out" });
            if (img) gsap.to(img, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out" });
        };
        const onLeave = () => {
            gsap.to([leftTweenRef.current, rightTweenRef.current], { timeScale: 1, duration: 0.9, ease: "power2.inOut" });
            if (img) gsap.to(img, { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: "power2.in" });
        };

        row.addEventListener("mouseenter", onEnter);
        row.addEventListener("mouseleave", onLeave);

        return () => {
            row.removeEventListener("mouseenter", onEnter);
            row.removeEventListener("mouseleave", onLeave);
            leftTweenRef.current?.kill();
            rightTweenRef.current?.kill();
        };
    }, [speed]);

    const H = "clamp(88px, 13.5vw, 188px)";

    return (
        <div
            ref={rowRef}
            className="reveal-row relative cursor-pointer group border-t border-black/10"
            style={{
                borderBottom: index === PROJECTS.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none",
                overflow: "hidden",
                height: H,
            }}
        >
            {/*
             * LEFT HALF
             * right: 50% → right edge is at viewport center
             * rotateY(+22deg) with pivot at right → letters stretch outward to the left
             */}
            <div style={{
                position: "absolute", top: 0, right: "50%",
                width: "130%", height: "100%", overflow: "hidden",
                display: "flex", justifyContent: "flex-end", alignItems: "center",
                transformOrigin: "right center",
                transform: "perspective(700px) rotateY(22deg)",
            }}>
                <div ref={leftTrackRef} style={{ display: "flex", flexDirection: "row-reverse", width: "200%", flexShrink: 0, alignItems: "center" }}>
                    {repeats.map((_, i) => (
                        <span key={i} style={textStyle}>{label}</span>
                    ))}
                </div>
            </div>

            {/*
             * RIGHT HALF
             * left: 50% → left edge is at viewport center
             * rotateY(-22deg) with pivot at left → letters stretch outward to the right
             */}
            <div style={{
                position: "absolute", top: 0, left: "50%",
                width: "130%", height: "100%", overflow: "hidden",
                display: "flex", alignItems: "center",
                transformOrigin: "left center",
                transform: "perspective(700px) rotateY(-22deg)",
            }}>
                <div ref={rightTrackRef} style={{ display: "flex", width: "200%", flexShrink: 0, alignItems: "center" }}>
                    {repeats.map((_, i) => (
                        <span key={i} style={textStyle}>{label}</span>
                    ))}
                </div>
            </div>

            {/* Flat hover image — centered, z-index above warped text */}
            <div
                ref={imageRef}
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, opacity: 0, scale: 0.92, pointerEvents: "none" }}
            >
                <div style={{ width: 380, height: 240, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }} />
                </div>
            </div>

            {/* Number */}
            <div style={{ position: "absolute", top: "50%", left: 20, transform: "translateY(-50%)", zIndex: 30, pointerEvents: "none" }}>
                <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.25em", textTransform: "uppercase", color: "#84cc16" }}>/{project.id}</span>
            </div>

            {/* Tag */}
            <div style={{ position: "absolute", top: "50%", right: 20, transform: "translateY(-50%)", zIndex: 30, pointerEvents: "none" }}>
                <span className="group-hover:text-lime-500 transition-colors duration-300" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)" }}>
                    {project.tag} →
                </span>
            </div>
        </div>
    );
}

export function NextProjectsSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        gsap.from(sectionRef.current.querySelectorAll(".reveal-header > *"), {
            y: 28, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" },
        });
        gsap.from(sectionRef.current.querySelectorAll(".reveal-row"), {
            y: 36, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        });
    }, []);

    return (
        <section ref={sectionRef} data-theme="light" className="relative bg-white text-black pt-24 md:pt-36 pb-16 md:pb-24">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-10 md:mb-14 reveal-header">
                <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-lime-500 mb-3">/06 MORE PROJECTS</span>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-black">Other Work</h2>
            </div>

            <div className="w-full">
                {PROJECTS.map((project, i) => (
                    <Link key={project.id} href={project.href}>
                        <ProjectRow project={project} index={i} speed={18 + i * 4} />
                    </Link>
                ))}
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 flex justify-end">
                <Link href="/" className="text-[10px] font-black tracking-[0.3em] uppercase text-black/40 hover:text-lime-500 transition-colors duration-300">
                    Back to All Projects →
                </Link>
            </div>
        </section>
    );
}

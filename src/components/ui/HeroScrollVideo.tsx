"use client";
import React, { CSSProperties, ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* =========================
   Types
========================= */

type Source = { mp4?: string; webm?: string; ogg?: string };
type VideoLike = string | Source;

type Eases = {
    container?: string;
    overlay?: string;
    text?: string;
};

export type HeroScrollVideoProps = {
    title?: ReactNode;
    subtitle?: ReactNode;
    meta?: ReactNode;
    credits?: ReactNode;

    description?: ReactNode;
    scopeOfWork?: string[];
    titleClassName?: string;

    media?: VideoLike;
    poster?: string;
    mediaType?: "video" | "image";
    muted?: boolean;
    loop?: boolean;
    playsInline?: boolean;
    autoPlay?: boolean;

    overlay?: {
        caption?: ReactNode;
        heading?: ReactNode;
        paragraphs?: ReactNode[];
        extra?: ReactNode;
    };

    initialBoxSize?: number;
    targetSize?: { widthVw: number; heightVh: number; borderRadius?: number } | "fullscreen";
    scrollHeightVh?: number;
    showHeroExitAnimation?: boolean;
    sticky?: boolean;
    overlayBlur?: number;
    overlayRevealDelay?: number;
    eases?: Eases;

    className?: string;
    style?: CSSProperties;
};

const DEFAULTS = {
    initialBoxSize: 420,
    targetSize: "fullscreen" as const,
    scrollHeightVh: 300,
    overlayBlur: 10,
    overlayRevealDelay: 0.35,
    eases: {
        container: "expo.out",
        overlay: "expo.out",
        text: "power3.inOut",
    } as Eases,
};

function isSourceObject(m?: VideoLike): m is Source {
    return !!m && typeof m !== "string";
}

export const HeroScrollVideo: React.FC<HeroScrollVideoProps> = ({
    title,
    subtitle,
    meta,
    credits,

    description,
    scopeOfWork,
    titleClassName,

    media,
    poster,
    mediaType = "video",
    muted = true,
    loop = true,
    playsInline = true,
    autoPlay = true,

    overlay,

    initialBoxSize = DEFAULTS.initialBoxSize,
    targetSize = DEFAULTS.targetSize,
    scrollHeightVh = DEFAULTS.scrollHeightVh,
    showHeroExitAnimation = true,
    sticky = true,
    overlayBlur = DEFAULTS.overlayBlur,
    overlayRevealDelay = DEFAULTS.overlayRevealDelay,
    eases = DEFAULTS.eases,

    className,
    style,
}) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const headlineRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const overlayCaptionRef = useRef<HTMLDivElement | null>(null);
    const overlayContentRef = useRef<HTMLDivElement | null>(null);

    const containerEase = eases.container ?? "expo.out";
    const overlayEase = eases.overlay ?? "expo.out";
    const textEase = eases.text ?? "power3.inOut";

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        const container = containerRef.current!;
        const overlayEl = overlayRef.current!;
        const overlayCaption = overlayCaptionRef.current!;
        const overlayContent = overlayContentRef.current!;
        const headline = headlineRef.current!;

        // Headline exit
        if (showHeroExitAnimation && headline) {
            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: headline,
                    start: "top top",
                    end: "top+=500 top",
                    scrub: true,
                },
            });

            headline.querySelectorAll(".hsv-reveal-item").forEach((el, i) => {
                heroTl.to(el, {
                    y: -100,
                    opacity: 0,
                    filter: "blur(20px)",
                    scale: 0.9,
                    stagger: 0.1,
                    ease: textEase,
                }, 0);
            });
        }

        // Main expansion
        const triggerEl = rootRef.current?.querySelector("[data-sticky-scroll]") as HTMLElement;
        if (!triggerEl) return;

        const mainTl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerEl,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
            },

        });

        const target = targetSize === "fullscreen"
            ? { width: "100vw", height: "100vh", borderRadius: 0 }
            : { width: `${(targetSize as any).widthVw ?? 92}vw`, height: `${(targetSize as any).heightVh ?? 92}vh`, borderRadius: (targetSize as any).borderRadius ?? 0 };

        gsap.set(container, {
            width: initialBoxSize,
            height: initialBoxSize,
            borderRadius: 24,
            clipPath: "inset(0 0 0 0)",
        });
        gsap.set(overlayEl, { clipPath: "inset(100% 0 0 0)", opacity: 0 });
        gsap.set(overlayContent, { y: 60, opacity: 0 });
        gsap.set(overlayCaption, { y: 20, opacity: 0 });

        mainTl
            .to(container, {
                width: target.width,
                height: target.height,
                borderRadius: target.borderRadius,
                ease: containerEase,
            }, 0)
            .to(overlayEl, {
                clipPath: "inset(0% 0 0 0)",
                opacity: 1,
                ease: overlayEase,
            }, overlayRevealDelay)
            .to(overlayCaption, { y: 0, opacity: 1, ease: overlayEase }, overlayRevealDelay + 0.1)
            .to(overlayContent, {
                y: 0,
                opacity: 1,
                ease: overlayEase,
            }, overlayRevealDelay + 0.15);

    }, { scope: rootRef });

    const renderMedia = () => {
        if (mediaType === "image") {
            const src = typeof media === "string" ? media : media?.mp4 || "";
            return <img src={src} alt="" className="w-full h-full object-cover" />;
        }
        const sources = [];
        if (typeof media === "string") sources.push(<source key="mp4" src={media} type="video/mp4" />);
        else if (isSourceObject(media)) {
            if (media.webm) sources.push(<source key="webm" src={media.webm} type="video/webm" />);
            if (media.mp4) sources.push(<source key="mp4" src={media.mp4} type="video/mp4" />);
        }
        return (
            <video poster={poster} muted={muted} loop={loop} playsInline={playsInline} autoPlay={autoPlay} className="w-full h-full object-cover">
                {sources}
            </video>
        );
    };

    return (
        <div ref={rootRef} className={`relative w-full ${className || ""}`} style={{ ...style }}>
            <div className="min-h-screen flex items-center justify-center p-6 md:p-12 perspective-[1000px] pt-32 pb-24" ref={headlineRef}>
                <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center">
                    <div className="text-center w-full">
                        <h1 className={`hsv-reveal-item ${titleClassName || "text-[max(48px,12vw)] font-black uppercase leading-[0.85] tracking-[-0.04em] bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent"} mb-4`}>
                            {title}
                        </h1>
                        {subtitle && (
                            <h2 className="hsv-reveal-item text-[max(14px,2vw)] font-bold uppercase tracking-[0.1em] text-lime-400 mb-8">
                                {subtitle}
                            </h2>
                        )}
                        {meta && (
                            <div className="hsv-reveal-item inline-flex items-center gap-3 px-4 py-2 rounded-full text-xs font-black bg-white/10 border border-white/10 backdrop-blur-md uppercase mt-4">
                                {meta}
                            </div>
                        )}
                    </div>

                    {description && (
                        <div className="w-full max-w-[840px] mt-16 md:mt-24 text-left">
                            <div className="hsv-reveal-item text-xl md:text-[22px] font-normal text-white/90 leading-[1.6] mb-12">
                                {description}
                            </div>

                            {scopeOfWork && scopeOfWork.length > 0 && (
                                <div className="hsv-reveal-item mt-8">
                                    <h4 className="text-sm md:text-base font-semibold text-white/50 mb-6 font-sans">
                                        Scope of Work
                                    </h4>
                                    <div className="flex flex-wrap gap-4">
                                        {scopeOfWork.map((scope, i) => (
                                            <span key={i} className="px-6 py-3 rounded-full border border-white/20 text-white/90 text-sm md:text-base whitespace-nowrap bg-white/5 backdrop-blur-sm">
                                                {scope}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="relative" data-sticky-scroll style={{ height: `${Math.max(150, scrollHeightVh)}vh` }}>
                <div className={`is-sticky sticky top-0 h-screen flex items-center justify-center overflow-hidden`}>
                    <div className="relative overflow-hidden bg-black shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center justify-center" ref={containerRef}>
                        {renderMedia()}

                        <div className="absolute inset-0 bg-black/40 z-[1]" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 z-[5]" ref={overlayRef} style={{ backdropFilter: `blur(${overlayBlur}px)` }}>
                            {overlay?.caption && (
                                <div className="absolute top-12 md:top-20 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-lime-400" ref={overlayCaptionRef}>
                                    {overlay.caption}
                                </div>
                            )}
                            <div className="max-w-3xl text-center" ref={overlayContentRef}>
                                {overlay?.heading && (
                                    <h3 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase mb-8 leading-none">
                                        {overlay.heading}
                                    </h3>
                                )}
                                <div className="space-y-6">
                                    {overlay?.paragraphs?.map((p, i) => (
                                        <p key={i} className="text-lg md:text-xl lg:text-2xl font-medium text-white/90 leading-relaxed">
                                            {p}
                                        </p>
                                    ))}
                                </div>
                                {overlay?.extra}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

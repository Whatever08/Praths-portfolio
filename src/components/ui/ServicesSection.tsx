"use client";
import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SERVICES_TAGS = [
  {
    label: "Design System",
    icon: "solar:widget-2-bold-duotone",
    iconColor: "bg-[#FF6B35]",
    x: "-180px",
    y: "-35px",
    rotate: -8,
    animationClass: "animate-float-1",
  },
  {
    label: "Design Research",
    icon: "solar:minimalistic-magnifer-bold-duotone",
    iconColor: "bg-[#00A8E8]",
    x: "-15px",
    y: "-70px",
    rotate: 4,
    animationClass: "animate-float-2",
  },
  {
    label: "Experience Design",
    icon: "solar:heart-bold-duotone",
    iconColor: "bg-[#EF476F]",
    x: "165px",
    y: "-40px",
    rotate: -6,
    animationClass: "animate-float-3",
  },
  {
    label: "Prototyping",
    icon: "solar:screencast-bold-duotone",
    iconColor: "bg-[#FF3366]",
    x: "-110px",
    y: "40px",
    rotate: 6,
    animationClass: "animate-float-4",
  },
  {
    label: "coding / Vibe coding",
    icon: "solar:code-bold-duotone",
    iconColor: "bg-[#06D6A0]",
    x: "20px",
    y: "45px",
    rotate: -20,
    animationClass: "animate-float-5",
  },
  {
    label: "Design Mgmt",
    icon: "solar:settings-bold-duotone",
    iconColor: "bg-[#FFD166]",
    x: "160px",
    y: "35px",
    rotate: 9,
    animationClass: "animate-float-6",
  },
];

const WORDS = [
  { text: "I", className: "" },
  { text: "DESIGN", className: "" },
  { text: "DIGITAL", className: "" },
  { text: "EXPERIENCES", className: "" },
  { text: "THAT", className: "" },
  { text: "BALANCE", className: "" },
  { text: "USER", className: "" },
  { text: "NEEDS", className: "" },
  { text: "AND", className: "" },
  { text: "PRODUCT", className: "" },
  { text: "GOALS,", className: "" },
  { text: "CREATING", className: "" },
  { text: "VALUE", className: "" },
  { text: "FOR", className: "" },
  { text: "BOTH.", className: "" },
];

const styles = `
  @keyframes float-1 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-4px) rotate(0.5deg); }
  }
  @keyframes float-2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(-0.5deg); }
  }
  @keyframes float-3 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-3px) rotate(0.3deg); }
  }
  @keyframes float-4 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(-0.4deg); }
  }
  @keyframes float-5 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-4px) rotate(0.6deg); }
  }
  @keyframes float-6 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-3px) rotate(-0.3deg); }
  }

  .animate-float-1 { animation: float-1 5s ease-in-out infinite; }
  .animate-float-2 { animation: float-2 4.5s ease-in-out infinite; }
  .animate-float-3 { animation: float-3 6s ease-in-out infinite; }
  .animate-float-4 { animation: float-4 5.5s ease-in-out infinite; }
  .animate-float-5 { animation: float-5 4.8s ease-in-out infinite; }
  .animate-float-6 { animation: float-6 6.5s ease-in-out infinite; }
`;

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Thoughtful scrub-based word reveal (same feel as About Me section)
    gsap.fromTo(
      ".services-reveal-word",
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.08,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "center 40%",
          scrub: 1.2,
        },
      }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      }
    });

    // 2. Drop Pill Badges from Above centered, then landing/spreading in a Bounce Pile
    tl.fromTo(
      ".service-pill",
      {
        y: -450,
        x: () => gsap.utils.random(-25, 25), // Falls directly down the center path
        opacity: 0,
        rotation: () => gsap.utils.random(-80, 80),
      },
      {
        y: (i) => parseFloat(SERVICES_TAGS[i].y), // Lands at pile Y
        x: (i) => parseFloat(SERVICES_TAGS[i].x), // Spreads out to pile X
        opacity: 1,
        rotation: (i) => SERVICES_TAGS[i].rotate,
        stagger: {
          each: 0.12,
          from: "random",
        },
        duration: 1.2,
        ease: "bounce.out",
      },
      "-=0.3"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-36 relative pointer-events-auto overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="max-w-[85rem] mx-auto px-6 md:px-12 relative flex flex-col items-center justify-center min-h-[580px]">
        
        {/* Header (Same font & layout style as About Me) */}
        <h2 className="text-[24px] font-semibold font-sans text-white mb-6 text-center">
          What I Do
        </h2>
        
        {/* Central Content (Same font & size style as About Me text) */}
        <h3 className="text-[1.15rem] md:text-[2rem] lg:text-[2.6rem] leading-[1.15] font-medium text-white uppercase flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em] text-center max-w-4xl mx-auto px-4 z-10 py-6 select-none">
          {WORDS.map((w, idx) => (
            <span
              key={idx}
              className={`services-reveal-word inline-block opacity-[0.12] ${w.className}`}
            >
              {w.text}
            </span>
          ))}
        </h3>

        {/* Floating Badges Pile — truly centered on the page */}
        <div className="relative h-[200px] mt-4 pointer-events-none"
          style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
        >
          {/* Inner anchor sits at exact horizontal center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.88] xs:scale-[0.99] sm:scale-[1.10] md:scale-[1.23] lg:scale-[1.30] origin-center">
            {SERVICES_TAGS.map((tag, i) => (
              <div
                key={i}
                className="absolute service-pill pointer-events-auto opacity-0"
                style={{
                  left: "0px",
                  top: "0px",
                  transformOrigin: "center center",
                }}
              >
                {/* Inner wrapper for independent floating animations without interfering with GSAP drop */}
                <div className={tag.animationClass}>
                  <div className="flex items-center gap-3 bg-[#121214]/90 text-white pl-3 pr-6 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-300 border border-white/10 select-none">
                    <div className={`w-8 h-8 rounded-full ${tag.iconColor} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                      <Icon icon={tag.icon} className="text-lg" />
                    </div>
                    <span className="font-bold text-sm text-[#E5E5E7] tracking-tight whitespace-nowrap">
                      {tag.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

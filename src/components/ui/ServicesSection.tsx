"use client";
import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// SOHub-style: large vivid pills with bold colours and varied rotations
const SERVICES_TAGS = [
  {
    label: "Design System",
    icon: "solar:widget-2-bold-duotone",
    bg: "#FF6B35",        // vibrant orange
    textColor: "#fff",
    x: -220,
    y: -55,
    rotate: -12,
  },
  {
    label: "Design Research",
    icon: "solar:minimalistic-magnifer-bold-duotone",
    bg: "#00C6FF",        // electric cyan
    textColor: "#000",
    x: 10,
    y: -80,
    rotate: 6,
  },
  {
    label: "Experience Design",
    icon: "solar:heart-bold-duotone",
    bg: "#FF3FA4",        // hot pink
    textColor: "#fff",
    x: 230,
    y: -50,
    rotate: -7,
  },
  {
    label: "Prototyping",
    icon: "solar:screencast-bold-duotone",
    bg: "#C8FF00",        // acid green-yellow
    textColor: "#000",
    x: -150,
    y: 60,
    rotate: 10,
  },
  {
    label: "Vibe Coding",
    icon: "solar:code-bold-duotone",
    bg: "#7B2FFF",        // electric purple
    textColor: "#fff",
    x: 50,
    y: 70,
    rotate: -16,
  },
  {
    label: "Design Mgmt",
    icon: "solar:settings-bold-duotone",
    bg: "#FFD166",        // golden yellow
    textColor: "#000",
    x: 240,
    y: 55,
    rotate: 8,
  },
];

const WORDS = [
  "I", "DESIGN", "DIGITAL", "EXPERIENCES", "THAT",
  "BALANCE", "USER", "NEEDS", "AND", "PRODUCT",
  "GOALS,", "CREATING", "VALUE", "FOR", "BOTH.",
];

const styles = `
  @keyframes sohub-breathe {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-6px) scale(1.015); }
  }
  .pill-breathe-1 { animation: sohub-breathe 4.2s ease-in-out infinite; }
  .pill-breathe-2 { animation: sohub-breathe 5.1s ease-in-out infinite 0.6s; }
  .pill-breathe-3 { animation: sohub-breathe 3.8s ease-in-out infinite 1.1s; }
  .pill-breathe-4 { animation: sohub-breathe 4.7s ease-in-out infinite 0.3s; }
  .pill-breathe-5 { animation: sohub-breathe 5.3s ease-in-out infinite 0.9s; }
  .pill-breathe-6 { animation: sohub-breathe 4.0s ease-in-out infinite 0.5s; }

  .service-pill {
    cursor: default;
    will-change: transform;
    transition: box-shadow 0.3s ease;
  }
  .service-pill:hover {
    box-shadow: 0 24px 60px rgba(0,0,0,0.45), 0 0 0 2px rgba(255,255,255,0.2) !important;
  }
`;

const breatheClasses = [
  "pill-breathe-1","pill-breathe-2","pill-breathe-3",
  "pill-breathe-4","pill-breathe-5","pill-breathe-6",
];

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // ── 1. Word reveal on scroll ──
    gsap.fromTo(
      ".services-reveal-word",
      { opacity: 0.1 },
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

    // ── 2. Drop-in entrance ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".service-pill",
      {
        y: -500,
        x: () => gsap.utils.random(-40, 40),
        opacity: 0,
        rotation: () => gsap.utils.random(-90, 90),
        scale: 0.6,
      },
      {
        y: (i: number) => SERVICES_TAGS[i].y,
        x: (i: number) => SERVICES_TAGS[i].x,
        opacity: 1,
        rotation: (i: number) => SERVICES_TAGS[i].rotate,
        scale: 1,
        stagger: { each: 0.1, from: "random" },
        duration: 1.3,
        ease: "bounce.out",
        onComplete: setupMagneticParallax,
      },
      "-=0.2"
    );

    function setupMagneticParallax() {
      const container = containerRef.current;
      if (!container) return;

      const pills = gsap.utils.toArray<HTMLElement>(".service-pill");
      const qs = pills.map((el, i) => {
        const lag = 0.08 + i * 0.025;
        return {
          x:   gsap.quickTo(el, "x",        { duration: lag,       ease: "power3.out" }),
          y:   gsap.quickTo(el, "y",        { duration: lag,       ease: "power3.out" }),
          rot: gsap.quickTo(el, "rotation", { duration: lag * 1.5, ease: "power2.out" }),
        };
      });

      const onMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
        const normY = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);

        qs.forEach((q, i) => {
          const sx = 48 + i * 10;
          const sy = 32 + i * 7;
          q.x(SERVICES_TAGS[i].x + normX * sx);
          q.y(SERVICES_TAGS[i].y + normY * sy);
          q.rot(SERVICES_TAGS[i].rotate + normX * 12);
        });
      };

      const onLeave = () => {
        pills.forEach((el, i) => {
          gsap.to(el, {
            x: SERVICES_TAGS[i].x,
            y: SERVICES_TAGS[i].y,
            rotation: SERVICES_TAGS[i].rotate,
            duration: 2.0 + i * 0.06,
            ease: "elastic.out(1.1, 0.45)",
            overwrite: "auto",
          });
        });
      };

      container.addEventListener("mousemove", onMove);
      container.addEventListener("mouseleave", onLeave);
      (container as any)._mv = onMove;
      (container as any)._ml = onLeave;
    }

    return () => {
      const c = containerRef.current;
      if (c) {
        if ((c as any)._mv) c.removeEventListener("mousemove", (c as any)._mv);
        if ((c as any)._ml) c.removeEventListener("mouseleave", (c as any)._ml);
      }
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-36 relative pointer-events-auto overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="max-w-[85rem] mx-auto px-6 md:px-12 relative flex flex-col items-center justify-center min-h-[620px]">

        {/* Header */}
        <h2 className="text-[24px] font-semibold font-sans text-white mb-6 text-center">
          What I Do
        </h2>

        {/* Scroll-reveal headline */}
        <h3 className="text-2xl sm:text-[2rem] md:text-[2.2rem] lg:text-[2.6rem] leading-[1.15] font-medium text-white uppercase flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em] text-center max-w-4xl mx-auto px-4 z-10 py-6 select-none">
          {WORDS.map((w, idx) => (
            <span key={idx} className="services-reveal-word inline-block opacity-[0.1]">
              {w}
            </span>
          ))}
        </h3>

        {/* ── SOHub-style pill cluster ── */}
        <div className="relative w-full h-[240px] mt-16 pointer-events-none">
          {/* Centre anchor */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.70] xs:scale-[0.82] sm:scale-[0.95] md:scale-[1.10] lg:scale-[1.20] origin-center">
            {SERVICES_TAGS.map((tag, i) => (
              <div
                key={i}
                className="absolute service-pill pointer-events-auto opacity-0"
                style={{ left: 0, top: 0, transformOrigin: "center center" }}
              >
                {/* Centering wrapper */}
                <div className="absolute -translate-x-1/2 -translate-y-1/2">
                  {/* Subtle breathe — doesn't fight GSAP because it's on a child */}
                  <div className={breatheClasses[i]}>
                    <div
                      className="flex items-center gap-3 pl-3 pr-7 py-3.5 rounded-full select-none"
                      style={{
                        background: tag.bg,
                        color: tag.textColor,
                        boxShadow: "0 16px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)",
                        border: "1.5px solid rgba(255,255,255,0.18)",
                      }}
                    >
                      {/* Icon bubble — slightly darkened version of pill colour */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(0,0,0,0.18)" }}
                      >
                        <Icon icon={tag.icon} className="text-xl" style={{ color: tag.textColor }} />
                      </div>
                      <span className="font-black text-[15px] tracking-tight whitespace-nowrap" style={{ color: tag.textColor }}>
                        {tag.label}
                      </span>
                    </div>
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

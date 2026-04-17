"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { cn } from "@/lib/utils";

interface ProcessItem {
  number: string;
  title: string;
  description: string;
  bullets?: string[];
  image: string;
}

interface DesignProcessReworkedProps {
  heading?: string;
  subtitle?: string;
  items: ProcessItem[];
  accentColor?: string; // e.g. "#f0900a"
}

export const DesignProcessReworked = ({
  heading = "Design Process",
  subtitle,
  items,
  accentColor = "#f0900a",
}: DesignProcessReworkedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !rightRef.current) return;

    // ── Register Plugins ──
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const panels = gsap.utils.toArray<HTMLElement>(".process-item");
    const slides = gsap.utils.toArray<HTMLElement>(".process-slide");
    const progressBars = gsap.utils.toArray<HTMLElement>(".process-progress-fill");
    const dots = gsap.utils.toArray<HTMLElement>(".process-dot");
    const globalProgress = containerRef.current.querySelector(".global-progress-fill") as HTMLElement;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${items.length * 100}%`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (globalProgress) {
            gsap.set(globalProgress, { scaleX: self.progress });
          }
        }
      },
    });

    const st = tl.scrollTrigger!;

    items.forEach((_, i) => {
      const step = 1 / items.length;
      const start = i * step;
      const end = (i + 1) * step;

      // ── Click to Jump ──
      const panel = panels[i] as HTMLElement;
      if (panel) {
        panel.onclick = () => {
          gsap.to(window, {
            scrollTo: st.start + (i / items.length) * (st.end - st.start) + 10,
            duration: 1.2,
            ease: "power3.inOut"
          });
        };
      }

      // ── Animate Left Panel Progress Bars ──
      tl.to(progressBars[i], {
        height: "100%",
        duration: 0.5,
        ease: "none",
      }, start);

      // ── Animate Right Slides (Scale/Opacity) ──
      if (i < items.length - 1) {
        tl.to(slides[i], {
          opacity: 0,
          scale: 1.05,
          duration: 0.2,
          ease: "power2.inOut"
        }, end - 0.1);

        tl.fromTo(slides[i + 1],
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.2, ease: "power2.inOut" },
          end - 0.1
        );
      }

      // ── Active States for Text & Dots ──
      tl.call(() => {
        panels.forEach((p, idx) => p.classList.toggle("active", idx === i));
        dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
      }, undefined, start);

      // ── Left Panel Auto-scroll (Protected) ──
      if (items.length > 1 && leftRef.current) {
        const scrollOffset = (i / (items.length - 1)) * (leftRef.current.scrollHeight - window.innerHeight + 100);
        tl.to(leftRef.current, {
          y: -Math.max(0, scrollOffset || 0),
          duration: 1 / items.length,
          ease: "power1.inOut"
        }, start);
      }
    });

  }, { scope: containerRef, dependencies: [items] });

  return (
    <section
      ref={containerRef}
      className="cb-section flex w-full min-h-screen bg-white overflow-hidden font-sans"
      style={{ "--accent": accentColor } as React.CSSProperties}
    >
      {/* ── LEFT PANEL ───────────────────────────────────────────────────── */}
      <div className="w-[48%] flex-shrink-0 border-r border-[#e8e8e8] overflow-hidden">
        <div ref={leftRef} className="pb-24">
          <div className="flex items-center gap-2.5 px-11 py-10 border-b border-[#e8e8e8]">
            <div className="w-4 h-[1px]" style={{ background: accentColor }} />
            <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#999]">
              {heading}
            </span>
          </div>

          {items.map((item, i) => (
            <div
              key={i}
              className="process-item relative flex border-b border-[#e8e8e8] py-11 pr-11 group cursor-pointer transition-colors duration-300"
              data-index={i}
            >
              {/* Individual vertical progress bar */}
              <div className="absolute left-0 top-0 w-[3px] h-0 bg-[var(--accent)] transition-[height] duration-500 ease-out process-progress-fill" />

              {/* Active background gradient (subtle) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(240,144,10,0.03)] to-transparent opacity-0 group-[.active]:opacity-100 transition-opacity duration-500" />

              {/* Number */}
              <div className="w-[100px] flex-shrink-0 pl-7 pt-1 z-10">
                <div className="font-syne text-[56px] font-extrabold leading-none tracking-[-0.05em] text-[#e8e8e8] group-[.active]:text-[var(--accent)] group-[.active]:-translate-y-0.5 transition-all duration-500 select-none">
                  {item.number || i + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 z-10">
                <h3 className="font-syne text-[22px] font-bold text-[#0e0e0e] leading-tight tracking-tight mb-4 transition-colors duration-300">
                  {item.title}
                </h3>
                <div className="flex flex-col">
                  <p className="text-[14px] text-[#555] leading-relaxed mb-4">
                    {item.description}
                  </p>
                  {item.bullets && (
                    <div className="flex flex-col gap-1">
                      {item.bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 py-1.5 text-[13.5px] text-[#999] group-[.active]:text-[#555] transition-colors duration-300">
                          <div className="w-1 h-1 rounded-full bg-[#e8e8e8] group-[.active]:bg-[var(--accent)] flex-shrink-0 transition-colors duration-300" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────────── */}
      <div ref={rightRef} className="flex-1 relative bg-[#fafaf8]">
        {/* Image Slides */}
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "process-slide absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out pointer-events-none",
              i === 0 ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover block scale-100 transition-transform duration-1000 ease-out"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(14,14,14,0.05)] via-transparent to-[rgba(14,14,14,0.15)]" />

            {/* Caption */}
            <div className="absolute bottom-7 left-7 z-20 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-[3px] flex items-center gap-2 opacity-0 translate-y-2 transition-all duration-500 delay-300 group-[.active]:opacity-100 group-[.active]:translate-y-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                {item.title}
              </span>
            </div>
          </div>
        ))}

        {/* Vertical Pagination Dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-30">
          {items.map((_, i) => (
            <div
              key={i}
              className="process-dot w-1.5 h-1.5 rounded-full bg-white/40 border-[1.5px] border-white/60 transition-all duration-300 group-[.active]:bg-white group-[.active]:scale-125"
            />
          ))}
        </div>

        {/* Bottom Horizontal Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20 z-30 overflow-hidden">
          <div className="global-progress-fill h-full bg-[var(--accent)] w-full origin-left scale-x-0" />
        </div>
      </div>

      {/* Tailwind & Syne Local Styles if needed */}
      <style jsx global>{`
        .font-syne {
          font-family: var(--font-syne), sans-serif;
        }
        .cb-section {
          --accent: ${accentColor};
        }
      `}</style>
    </section>
  );
};

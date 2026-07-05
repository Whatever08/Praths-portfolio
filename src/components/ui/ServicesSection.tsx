"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES = [
  {
    title: "Visual Design",
    image: "/RahejaNova.png"
  },
  {
    title: "Website Design",
    image: "/WebDesign.png"
  },
  {
    title: "Website Strategy",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Frontend Dev",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
  }
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const el = sectionRef.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pointer-events-auto w-full"
      style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
    >
      <div className="max-w-[85rem] mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

          {/* Left Column — heading matching site-wide style */}
          <div className="lg:col-span-3 flex items-center">
            <h2 className="text-[24px] font-semibold font-sans text-white">
              heres how can i help you
            </h2>
          </div>

          {/* Center Column — Services List */}
          <div className="lg:col-span-6 flex flex-col gap-0.5 z-10 w-full">
            {SERVICES.map((srv, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onClick={() => setHoveredIndex(i)}
                  className="group cursor-pointer select-none py-1"
                >
                  <h3
                    className={`text-[32px] sm:text-[42px] md:text-[52px] lg:text-[56px] font-bold tracking-tight font-sans transition-all duration-300 ${
                      isHovered
                        ? "text-white translate-x-1"
                        : "text-[#333333] group-hover:text-white/50"
                    }`}
                  >
                    {srv.title}
                  </h3>
                </div>
              );
            })}
          </div>

          {/* Right Column — Image preview */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end z-10">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-xl overflow-hidden bg-zinc-900/50 border border-white/10 shadow-2xl">
              {SERVICES.map((srv, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    hoveredIndex === i
                      ? "opacity-100 scale-100 rotate-0"
                      : "opacity-0 scale-95 rotate-[-2deg] pointer-events-none"
                  }`}
                >
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

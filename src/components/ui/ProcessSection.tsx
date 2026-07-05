"use client";

import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProcessStep {
  num: string;
  name: string;
  title: string;
  desc: string;
  subtitle: string;
  img: string;
  bg: string;
  textColor: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    name: "Discover",
    title: "Understand the real problem",
    desc: "We start with stakeholder interviews, user research and analytics to learn what people actually need — not just what the brief says. No design decision happens blind.",
    subtitle: "Discover & research",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-white",
    textColor: "text-[#111111]"
  },
  {
    num: "02",
    name: "Define",
    title: "Frame the right challenge",
    desc: "Insights get distilled into clear problem statements, personas and journey maps that align the whole team around a single, well-defined direction.",
    subtitle: "Define & frame",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#BFE3FF]",
    textColor: "text-[#111111]"
  },
  {
    num: "03",
    name: "Design",
    title: "Shape the experience",
    desc: "Wireframes evolve into polished, on-brand interfaces — every flow, state and micro-interaction considered down to the pixel.",
    subtitle: "Design & craft",
    img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#FFCA6B]",
    textColor: "text-[#111111]"
  },
  {
    num: "04",
    name: "Prototype",
    title: "Validate before you build",
    desc: "Interactive prototypes go in front of real users fast, so friction gets caught and fixed before a single line of production code is written.",
    subtitle: "Prototype & test",
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#FF9FD1]",
    textColor: "text-[#111111]"
  },
  {
    num: "05",
    name: "Deliver",
    title: "Launch, measure, refine",
    desc: "We hand off pixel-perfect specs and dev-ready assets, then track real usage post-launch to keep improving the experience with evidence, not guesswork.",
    subtitle: "Deliver & iterate",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    bg: "bg-[#D8CBFF]",
    textColor: "text-[#111111]"
  }
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
  };

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-32 relative pointer-events-auto overflow-hidden bg-transparent">
      <div className="max-w-[85rem] mx-auto px-6 md:px-12 relative flex flex-col">
        
        {/* Section Header — matches other sections */}
        <div className="flex items-center justify-between mb-20">
          <h2 className="text-[32px] md:text-[38px] font-bold font-sans text-white text-center tracking-tight flex-1">
            Process
          </h2>
          {/* Navigation buttons */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrev}
              type="button"
              aria-label="Previous step"
              className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="text-lg" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              aria-label="Next step"
              className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
            </button>
          </div>
        </div>

        {/* Steps Row */}
        <div className="flex flex-col md:flex-row items-stretch gap-2.5 h-auto md:h-[540px]">
          {PROCESS_STEPS.map((step, i) => {
            const isOpen = activeIndex === i;
            
            // Mobile layout toggle: isOpen toggles relative/absolute classes to let the container size naturally
            const openViewClass = isOpen 
              ? "relative md:absolute inset-0 opacity-100 pointer-events-auto" 
              : "absolute inset-0 opacity-0 pointer-events-none";

            const closedViewClass = isOpen
              ? "absolute inset-0 opacity-0 pointer-events-none"
              : "relative md:absolute inset-0 opacity-100 pointer-events-auto";

            return (
              <div
                key={step.num}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (min-width: 900px)").matches) {
                    setActiveIndex(i);
                  }
                }}
                style={{
                  flexGrow: isOpen ? 6.2 : 1,
                }}
                className={`group relative rounded-xl overflow-hidden border cursor-pointer step-card-transition transition-all duration-500 w-full md:w-auto ${
                  isOpen ? "max-h-[1200px] h-auto md:h-full" : "max-h-[128px] h-[128px] md:h-full md:max-h-none"
                } ${
                  isOpen 
                    ? "bg-white text-zinc-950 border-transparent shadow-xl" 
                    : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:bg-zinc-800/90 hover:text-zinc-200"
                }`}
              >
                {/* Closed View */}
                <div
                  className={`p-5 sm:p-6 flex flex-col justify-between card-face-transition w-full h-[128px] md:h-full ${closedViewClass}`}
                >
                  <p className="text-[11px] tracking-[1.5px] uppercase font-semibold opacity-70">
                    Step {step.num}
                  </p>
                  <div className="text-left">
                    <p className="num-outline text-[34px] sm:text-[38px] font-bold leading-none select-none">
                      {step.num}
                    </p>
                    <p className="mt-2 text-[11px] tracking-[1.2px] uppercase font-semibold max-w-[130px] whitespace-nowrap">
                      {step.name}
                    </p>
                  </div>
                </div>

                {/* Open View */}
                <div
                  className={`p-6 sm:p-8 md:p-10 flex flex-col card-face-transition text-left w-full h-auto md:h-full ${openViewClass}`}
                >
                  <p className="text-[11px] tracking-[1.5px] uppercase font-semibold opacity-70">
                    Step {step.num} — {step.name}
                  </p>
                  <h3 className="mt-2 text-[24px] sm:text-[28px] md:text-[32px] leading-[1.08] font-semibold max-w-[420px] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.65] max-w-[400px] opacity-90">
                    {step.desc}
                  </p>


                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-4 flex-1 items-end">
                    <div>
                      <p className="text-[54px] sm:text-[64px] md:text-[76px] font-bold leading-none select-none">
                        {step.num}
                      </p>
                      <p className="mt-2 text-[11px] tracking-[1.2px] uppercase font-semibold">
                        {step.subtitle}
                      </p>
                    </div>
                    <div className="relative w-full h-[170px] sm:h-[200px] md:h-[240px] rounded-xl overflow-hidden border border-black/10">
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>




      </div>
    </section>
  );
}

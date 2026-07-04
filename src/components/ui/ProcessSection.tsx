"use client";

import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProcessStep {
  num: string;
  pill: string;
  title: string;
  bullets: string[];
  duration: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    pill: "Discovery",
    title: "Understanding the Problem & Users",
    bullets: [
      "Stakeholder Alignment: Understand business goals, project scope, and success metrics.",
      "User Research: Conduct interviews, surveys, observations, and competitor analysis.",
      "Pain Point Identification: Uncover user needs, frustrations, and opportunities.",
      "Define the Challenge: Synthesize findings into clear problem statements and design goals."
    ],
    duration: "1–2 Weeks"
  },
  {
    num: "02",
    pill: "Define",
    title: "Transforming Insights into Opportunities",
    bullets: [
      "Research Synthesis: Organize findings using affinity mapping and thematic analysis.",
      "User Personas: Create representative user profiles based on research.",
      "Journey Mapping: Visualize user experiences, touchpoints, and pain points.",
      "Prioritize Requirements: Define features and opportunities based on impact and feasibility."
    ],
    duration: "3–5 Days"
  },
  {
    num: "03",
    pill: "Ideate",
    title: "Exploring Creative Solutions",
    bullets: [
      "Brainstorming Workshops: Generate multiple concepts and innovative ideas.",
      "Information Architecture: Structure content and user flows.",
      "Wireframing: Sketch low-fidelity screens and interaction patterns.",
      "Concept Validation: Evaluate ideas against user and business needs."
    ],
    duration: "1 Week"
  },
  {
    num: "04",
    pill: "Design",
    title: "Crafting Meaningful Experiences",
    bullets: [
      "UI Design: Develop visual systems, layouts, typography, and components.",
      "Interactive Prototyping: Create realistic user flows and interactions.",
      "Design System Creation: Ensure consistency and scalability across screens.",
      "Accessibility Review: Design for usability and inclusivity."
    ],
    duration: "1–2 Weeks"
  },
  {
    num: "05",
    pill: "Test & Iterate",
    title: "Validating and Refining the Experience",
    bullets: [
      "Usability Testing: Observe users completing tasks and identify issues.",
      "Feedback Analysis: Gather insights from users and stakeholders.",
      "Iterative Improvements: Refine designs based on findings.",
      "Handoff & Documentation: Deliver final assets and implementation guidelines."
    ],
    duration: "3–7 Days"
  }
];

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // GSAP ScrollTrigger to reveal each row sequentially on scroll
    const rows = gsap.utils.toArray(".process-row");
    rows.forEach((row: any) => {
      gsap.fromTo(
        row,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 relative pointer-events-auto overflow-hidden bg-transparent">
      <div className="max-w-[85rem] mx-auto px-6 md:px-12 relative flex flex-col">
        
        {/* Section Header */}
        <h2 className="text-[32px] md:text-[38px] font-bold font-sans text-white mb-20 text-center tracking-tight">
          Process
        </h2>

        {/* Process List Container */}
        <div className="flex flex-col border-b border-white/5">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={step.num}
              className="process-row grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start py-16 md:py-24 border-t border-white/5 group relative transition-all duration-500 hover:bg-white/[0.015] px-6 md:px-8 -mx-6 md:-mx-8 rounded-xl"
            >
              
              {/* Left Column: Pill Label */}
              <div className="md:col-span-3 flex items-center md:pt-2">
                <div className="border border-white/10 px-5 py-2 rounded-full text-xs md:text-sm font-semibold text-white/50 group-hover:text-white/90 group-hover:border-white/30 transition-all duration-300 uppercase tracking-widest select-none bg-black/40">
                  {step.pill}
                </div>
              </div>

              {/* Center Column: Number, Title, Bullets */}
              <div className="md:col-span-7 flex flex-col gap-8 relative">
                {/* Number & Title */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl md:text-3xl lg:text-[2.2rem] font-bold tracking-tight shrink-0 select-none">
                    <span className="text-white/40 font-light mr-1">/</span>
                    <span className="text-white">{step.num}</span>
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300 tracking-tight leading-tight">
                    {step.title}
                  </h3>
                </div>

                {/* Bullet Points */}
                <ul className="flex flex-col gap-4 pl-9 relative">
                  {step.bullets.map((bullet, bIdx) => {
                    const colonIndex = bullet.indexOf(":");
                    const boldText = colonIndex > -1 ? bullet.substring(0, colonIndex) : bullet;
                    const normalText = colonIndex > -1 ? bullet.substring(colonIndex + 1) : "";

                    return (
                      <li
                        key={bIdx}
                        className="text-white/40 group-hover:text-white/70 text-sm sm:text-base leading-relaxed group/bullet flex items-start gap-3 transition-colors duration-300"
                      >
                        <span className="text-white/40 group-hover:text-white text-[11px] select-none shrink-0 mt-1.5 transition-transform duration-500 ease-out group-hover/bullet:rotate-45 group-hover/bullet:scale-125">
                          ✳
                        </span>
                        <span>
                          {colonIndex > -1 ? (
                            <>
                              <strong className="text-white/60 group-hover:text-white/90 font-medium transition-colors duration-300">
                                {boldText}:
                              </strong>
                              {normalText}
                            </>
                          ) : (
                            bullet
                          )}
                        </span>
                      </li>
                    );
                  })}
                  
                  {/* Decorative glowing white dot on the right edge of bullet area */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out blur-[1px] shadow-[0_0_12px_#ffffff] hidden md:block" />
                </ul>
              </div>

              {/* Right Column: Clock & Duration */}
              <div className="md:col-span-2 flex justify-start md:justify-end items-center text-white/30 group-hover:text-white/60 text-sm md:text-base font-medium transition-colors duration-300 tracking-wider md:pt-2">
                <div className="flex items-center gap-2.5">
                  <Icon icon="solar:clock-circle-linear" className="text-lg text-white/40 group-hover:text-white/70" />
                  <span>/{step.duration}/</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

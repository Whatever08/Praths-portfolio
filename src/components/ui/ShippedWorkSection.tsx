"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

const PROJECTS = [
  {
    num: "01",
    total: "01",
    title: "Envision VFX",
    category: "Creative · VFX · Cinematic",
    description:
      "Redesigned the website for a VFX studio built to showcase their projects and services for better brand visibility.",
    image: "/hero image.png",
    /* slides shown in the hover panel, each with a label */
    slides: [
      { img: "/HOME 7.png", label: "Showreel" },
      { img: "/OUR STORY.png", label: "Brand Identity" },
      { img: "/Our Work.png", label: "Brand Identity" },
      { img: "/OUR TEAM 2.png", label: "Brand Identity" },

    ],
    tags: ["Brand Identity", "Web Design", "Motion"],
    link: "https://envisionvfx.in",
    isExternal: true,
  },
];

function ProjectItem({ project }: { project: typeof PROJECTS[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* cycle through slides on hover */
  useEffect(() => {
    if (isHovered && project.slides.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % project.slides.length);
      }, 1100);
    } else {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
      setSlideIndex(0);
    }
    return () => {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    };
  }, [isHovered, project.slides.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

      {/* Left Column — Media Cover */}
      <div
        className="col-span-1 lg:col-span-8 relative aspect-[3/2] rounded-xl overflow-hidden bg-black/5 cursor-crosshair shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Base image — always visible */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay — fades in on hover */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${isHovered ? "opacity-50" : "opacity-0"
            }`}
        />

        {/* Slideshow panel — appears over the darkened image */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
        >
          <div className="w-[78%] bg-white rounded-xl overflow-hidden shadow-2xl">
            {/* Slide image */}
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              {project.slides.map((slide, i) => (
                <img
                  key={i}
                  src={slide.img}
                  alt={slide.label}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ${slideIndex === i ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* "Hover to explore" hint — bottom left */}
        <div
          className={`absolute bottom-5 left-6 flex items-center gap-2 transition-all duration-300 pointer-events-none ${isHovered ? "opacity-0" : "opacity-100"
            }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
            Hover to explore
          </span>
        </div>
      </div>

      {/* Right Column — Project Details */}
      <div className="col-span-1 lg:col-span-4 flex flex-col justify-end py-2 self-stretch">

        {/* Bottom — title + description + View Website */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black mb-3 font-sans">
            {project.title}
          </h3>
          <p className="text-sm text-black/55 leading-relaxed max-w-sm font-normal mb-6">
            {project.description}
          </p>
          <Link
            href={project.link}
            target={project.isExternal ? "_blank" : "_self"}
            rel={project.isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/80 hover:text-black transition-colors duration-200 group"
          >
            View Website
            <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </div>

      </div>

    </div>
  );
}

export function ShippedWorkSection() {
  return (
    <section className="relative pointer-events-auto bg-[#eae9e5] py-24 md:py-32 px-0">
      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-10">

        {/* Section Heading */}
        <h2 className="text-[24px] font-semibold font-sans text-black mb-16 text-center">
          Shipped Work
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="col-span-1 lg:col-span-12 flex flex-col gap-24 md:gap-32">
            {PROJECTS.map((project) => (
              <ProjectItem key={project.num} project={project} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default ShippedWorkSection;

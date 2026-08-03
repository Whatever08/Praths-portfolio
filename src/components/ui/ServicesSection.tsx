"use client";
import React, { useRef, useEffect } from "react";
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
    title: "Application Design",
    image: "/mobileappdesign.png"
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
  const sectionRef = useRef<HTMLDivElement>(null);
  // Refs for each image layer — direct DOM mutations, no React re-renders
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Refs for each service title text
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const activeIndex = useRef<number>(0);

  // Apply active state directly via DOM to skip React render cycle entirely
  const setActive = (i: number) => {
    if (activeIndex.current === i) return;
    const prev = activeIndex.current;
    activeIndex.current = i;

    // Swap image layers
    const prevImg = imageRefs.current[prev];
    const nextImg = imageRefs.current[i];
    if (prevImg) {
      prevImg.style.opacity = "0";
      prevImg.style.transform = "scale(0.96)";
    }
    if (nextImg) {
      nextImg.style.opacity = "1";
      nextImg.style.transform = "scale(1)";
    }

    // Swap title colours
    const prevTitle = titleRefs.current[prev];
    const nextTitle = titleRefs.current[i];
    if (prevTitle) prevTitle.style.color = "#333333";
    if (nextTitle) nextTitle.style.color = "#ffffff";
  };

  useEffect(() => {
    // Set initial active state (index 0)
    const firstImg = imageRefs.current[0];
    if (firstImg) {
      firstImg.style.opacity = "1";
      firstImg.style.transform = "scale(1)";
    }
    const firstTitle = titleRefs.current[0];
    if (firstTitle) firstTitle.style.color = "#ffffff";

    // Section entrance animation
    if (!sectionRef.current) return;
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
      style={{ paddingTop: "8rem", paddingBottom: "8rem" }}
    >
      {/* Preload local images so there's no fetch-on-hover jank */}
      <link rel="preload" as="image" href="/RahejaNova.png" />
      <link rel="preload" as="image" href="/WebDesign.png" />
      <link rel="preload" as="image" href="/mobileappdesign.png" />

      <div className="max-w-[85rem] mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">

          {/* Left Column */}
          <div className="lg:col-span-3 flex items-start pt-2">
            <h2 className="text-[30px] font-semibold tracking-tight text-white leading-tight">
              Here&apos;s how can<br />i help you with<br />your projects
            </h2>
          </div>

          {/* Center Column — Services List */}
          <div className="lg:col-span-6 flex flex-col gap-0.5 z-10 w-full">
            {SERVICES.map((srv, i) => (
              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group cursor-pointer select-none py-1"
              >
                <h3
                  ref={el => { titleRefs.current[i] = el; }}
                  className="text-[32px] sm:text-[42px] md:text-[52px] lg:text-[56px] font-bold tracking-tight font-sans"
                  style={{
                    color: i === 0 ? "#ffffff" : "#333333",
                    transition: "color 0.25s ease",
                  }}
                >
                  {srv.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Right Column — Image Preview */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end z-10">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-xl overflow-hidden bg-zinc-900/50 border border-white/10 shadow-2xl">
              {SERVICES.map((srv, i) => (
                <div
                  key={i}
                  ref={el => { imageRefs.current[i] = el; }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    transform: "scale(0.96)",
                    // Only GPU-composited props: opacity + transform (no rotate, no layout triggers)
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                    willChange: "opacity, transform",
                    pointerEvents: "none",
                  }}
                >
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
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

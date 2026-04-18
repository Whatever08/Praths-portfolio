"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Icon } from "@iconify/react";

interface NavbarProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  logoSrc?: string;
  logoLink?: string;
  showMobileMenu?: boolean;
}

export const Navbar = ({
  leftContent,
  rightContent,
  logoSrc = "/logo.png",
  logoLink = "/",
  showMobileMenu = true,
}: NavbarProps) => {
  const navRef = useRef<HTMLElement>(null);
  const leftItemsRef = useRef<HTMLDivElement>(null);
  const rightItemsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const smartNavTl = useRef<gsap.core.Timeline | null>(null);
  const isScrollingViaClick = useRef(false);

  useGSAP(() => {
    // 1. DIRECTIONAL REVEAL & LOGO SWALLOWING Timeline
    smartNavTl.current = gsap.timeline({ paused: true });

    // Left items move right into logo
    smartNavTl.current.to(leftItemsRef.current, {
      x: 60,
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power3.inOut"
    }, 0);

    // Right items move left into logo
    smartNavTl.current.to(rightItemsRef.current, {
      x: -60,
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power3.inOut"
    }, 0);

    // Global ScrollTrigger for Directional Reveal
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        // BYPASS if we are jumping via a click
        if (isScrollingViaClick.current) return;

        // ALWAYS show links when at the very top (first 100px)
        if (self.scroll() < 100) {
          smartNavTl.current?.reverse();
          gsap.to(navRef.current, {
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            borderBottom: "1px solid rgba(255,255,255,0)",
            duration: 0.4
          });
          return;
        }

        // SCROLL DOWN: Swallow links
        if (self.direction === 1) {
          smartNavTl.current?.play();
          gsap.to(navRef.current, {
            backgroundColor: "transparent",
            backdropFilter: "blur(15px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            duration: 0.4
          });
        } 
        // SCROLL UP: Reveal links
        else {
          smartNavTl.current?.reverse();
          gsap.to(navRef.current, {
            backgroundColor: "transparent",
            backdropFilter: "blur(15px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            duration: 0.4
          });
        }
      }
    });

    // Handle 'nav-jump' events from other components (like DesignProcess)
    const handleNavJump = () => {
      isScrollingViaClick.current = true;
      smartNavTl.current?.reverse(); // Ensure links are visible during jump
      
      // Reset flag after jump duration (usually 1.2s + buffer)
      setTimeout(() => {
        isScrollingViaClick.current = false;
      }, 1500);
    };

    window.addEventListener("nav-jump", handleNavJump);

    // 2. THEME-SENSING INVERSION — robust elementFromPoint approach
    let lastTheme = "dark";

    const updateTheme = (theme: string) => {
      if (theme === lastTheme) return;
      lastTheme = theme;
      const isLight = theme === "light";
      gsap.to(navRef.current, {
        color: isLight ? "#000000" : "#ffffff",
        duration: 0.4,
        ease: "power2.inOut"
      });
      gsap.to(".nav-logo-img", {
        filter: isLight ? "brightness(0)" : "brightness(1)",
        duration: 0.4
      });
    };

    // Sample the element underneath the navbar (at center, 40px from top)
    const sampleTheme = () => {
      const checkY = 40;
      const checkX = window.innerWidth / 2;
      // Temporarily hide the navbar to sample behind it
      if (navRef.current) navRef.current.style.pointerEvents = "none";
      const el = document.elementFromPoint(checkX, checkY) as HTMLElement | null;
      if (navRef.current) navRef.current.style.pointerEvents = "";

      if (!el) return;

      // Walk up from sampled element to find data-theme attribute
      let cursor: HTMLElement | null = el;
      let foundTheme = "dark";
      while (cursor && cursor !== document.body) {
        const theme = cursor.getAttribute("data-theme");
        if (theme) { foundTheme = theme; break; }
        cursor = cursor.parentElement;
      }
      updateTheme(foundTheme);
    };

    // Use ScrollTrigger onUpdate for efficiency
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: sampleTheme,
      onRefresh: sampleTheme,
    });

    // Initial sample
    sampleTheme();

    return () => {
      window.removeEventListener("nav-jump", handleNavJump);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: navRef });

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 md:py-8 bg-transparent transition-all duration-300"
    >
      {/* Left Slot */}
      <div ref={leftItemsRef} className="w-1/2 md:w-1/4 flex justify-start items-center">
        {leftContent}
      </div>

      {/* Center: Logo (The Anchor for swallowing) */}
      <div className="flex items-center justify-center gap-4 lg:gap-8 w-1/3 md:w-2/4">
        {/* Hide mobile logo from leftItems in the prop, we use this central one */}
        <Link 
          href={logoLink} 
          ref={logoRef}
          className="nav-logo relative h-8 mx-4 lg:mx-8 flex items-center opacity-100 cursor-pointer z-10"
        >
          <img
            src={logoSrc}
            alt="Logo"
            className="nav-logo-img h-full w-auto object-contain transition-all duration-300"
          />
        </Link>
      </div>

      {/* Right Slot */}
      <div ref={rightItemsRef} className="w-1/2 md:w-1/4 flex justify-end items-center">
        {rightContent}
        {showMobileMenu && (
          <button className="md:hidden ml-4">
            <Icon icon="solar:hamburger-menu-linear" className="text-2xl" />
          </button>
        )}
      </div>
    </nav>
  );
};

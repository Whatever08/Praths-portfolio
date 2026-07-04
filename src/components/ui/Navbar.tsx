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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

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
        if (isScrollingViaClick.current) return;

        // ALWAYS show links when at the very top
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

    const handleNavJump = () => {
      isScrollingViaClick.current = true;
      smartNavTl.current?.reverse();
      setTimeout(() => { isScrollingViaClick.current = false; }, 1500);
    };

    window.addEventListener("nav-jump", handleNavJump);

    // Initial theme check
    const sampleTheme = () => {
      const checkY = 40;
      const checkX = window.innerWidth / 2;

      // Use elementsFromPoint to see through the fixed navbar
      const elements = document.elementsFromPoint(checkX, checkY);
      const el = elements.find(node =>
        node !== navRef.current &&
        !navRef.current?.contains(node)
      ) as HTMLElement | null;

      if (!el) return;

      let cursor: HTMLElement | null = el;
      let foundTheme = "dark";
      while (cursor && cursor !== document.body) {
        const theme = cursor.getAttribute("data-theme");
        if (theme) { foundTheme = theme; break; }
        cursor = cursor.parentElement;
      }

      const isLight = foundTheme === "light";
      gsap.to(navRef.current, {
        color: isLight ? "#000000" : "#ffffff",
        duration: 0.4
      });
      gsap.to(".nav-logo-img", {
        filter: isLight ? "brightness(0)" : "brightness(1)",
        duration: 0.4
      });
    };

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: sampleTheme,
    });

    sampleTheme();

    return () => {
      window.removeEventListener("nav-jump", handleNavJump);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: navRef });

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 md:py-8 bg-transparent"
      >
        {/* Left Slot */}
        <div ref={leftItemsRef} className="w-1/3 md:w-1/4 flex justify-start items-center">
          {leftContent}
        </div>

        {/* Center: Logo */}
        <div className="flex items-center justify-center w-1/3 md:w-2/4">
          <Link href={logoLink} className="nav-logo relative h-7 md:h-8 flex items-center cursor-pointer z-10">
            <img
              src={logoSrc}
              alt="Logo"
              className="nav-logo-img h-full w-auto object-contain transition-all duration-300"
            />
          </Link>
        </div>

        {/* Right Slot */}
        <div ref={rightItemsRef} className="w-1/3 md:w-1/4 flex justify-end items-center">
          <div className="hidden md:flex">{rightContent}</div>
          {showMobileMenu && (
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden ml-4 p-2 hover:opacity-60 transition-opacity"
            >
              <Icon icon="solar:hamburger-menu-linear" className="text-2xl" />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className={`fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl transition-all duration-500 ease-in-out flex flex-col justify-between p-8 ${
            isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          {/* Header inside overlay */}
          <div className="flex justify-between items-center w-full">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="relative h-7 flex items-center">
              <img
                src={logoSrc}
                alt="Logo"
                className="h-full w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white p-2 hover:rotate-90 transition-transform duration-300"
            >
              <Icon icon="solar:close-circle-linear" className="text-4xl" />
            </button>
          </div>

          {/* Main Links */}
          <div className="flex flex-col items-start justify-center gap-6 my-auto pl-4">
            <div className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-2">Navigation</div>

            <Link
              href="/#projects"
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase text-left cursor-pointer"
            >
              Projects
            </Link>

            <Link
              href="/projects"
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase text-left cursor-pointer"
            >
              View All Projects
            </Link>

            <Link
              href="/#about"
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase text-left cursor-pointer"
            >
              About
            </Link>

            <Link
              href="/#services"
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase text-left cursor-pointer"
            >
              What I do
            </Link>

            <Link
              href="/#case-studies"
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase text-left cursor-pointer"
            >
              Case Studies
            </Link>

            <Link
              href="/#contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-4xl font-black tracking-tighter text-white hover:text-white/60 transition-colors uppercase text-left cursor-pointer"
            >
              Contact
            </Link>
          </div>

          {/* Footer inside overlay */}
          <div className="flex justify-between items-center w-full pt-6 border-t border-white/10 pl-4">
            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/in/prathamesh-tipnis-653b00142/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white text-xs uppercase tracking-widest font-bold"
              >
                LinkedIn
              </a>
              <a
                href="https://www.behance.net/tprathameshUXD1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white text-xs uppercase tracking-widest font-bold"
              >
                Behance
              </a>
            </div>
            <span className="text-white/20 text-xs font-mono">© 2026</span>
          </div>
        </div>
      )}
    </>
  );
};

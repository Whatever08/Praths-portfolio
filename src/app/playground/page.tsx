"use client";

import { VortexGallery } from "@/components/ui/VortexGallery";
import { Navbar } from "@/components/ui/Navbar";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function PlaygroundPage() {
  return (
    <main className="relative w-full h-screen bg-[#030303] text-white selection:bg-white/20">
      {/* Navigation Override for Minimal Look */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 md:py-8 bg-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link 
            href="/"
            className="text-[10px] md:text-xs font-bold tracking-widest uppercase hover:opacity-60 transition-opacity flex items-center gap-2 font-sans cursor-pointer"
          >
            <Icon icon="solar:arrow-left-linear" className="text-sm" />
            <span>Back</span>
          </Link>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center flex-col pointer-events-none">
          <h1 className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/50 mb-1">Playground</h1>
          <div className="w-8 h-[1px] bg-white/20" />
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="text-[10px] uppercase tracking-widest font-bold text-white/40">
            Scroll to Explore
          </div>
        </div>
      </nav>

      {/* The 3D Vortex Gallery */}
      <VortexGallery />

      {/* Status Indicators */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none text-center">
        <div className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/30 mb-2">
          Interactive 3D Environment
        </div>
        <div className="flex justify-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-white opacity-20" />
          <div className="w-1 h-1 rounded-full bg-white opacity-40 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-white opacity-20" />
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function ComingSoonGuard() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable Coming Soon popup on Vercel live server
    if (
      typeof window !== "undefined" &&
      window.location.hostname.includes("vercel.app")
    ) {
      setEnabled(true);
    }
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-2xl px-6 pointer-events-auto">
      {/* Subtle background radial lights */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle 600px at 50% 50%, rgba(232, 0, 45, 0.08), transparent 70%),
            radial-gradient(circle 400px at 50% 30%, rgba(255, 107, 53, 0.06), transparent 70%)
          `
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-[#121214]/80 border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.8)] text-center flex flex-col items-center">
        {/* Glow TP Lightning Logo Icon */}
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 shadow-inner hover:scale-105 transition-transform duration-300">
          <img
            src="/logo.png"
            alt="TP Logo"
            className="w-8 h-auto object-contain brightness-200"
          />
        </div>

        <span className="text-[10px] font-mono text-[#E8002D] font-bold uppercase tracking-[0.25em] mb-4">
          Project Status
        </span>

        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-4 font-sans">
          Coming Soon
        </h2>

        <p className="text-sm text-white/60 leading-relaxed font-sans font-normal max-w-sm mb-10">
          This digital case study is currently under construction. Prathamesh is curating design assets and polishing interactions for this experience.
        </p>

        <button
          onClick={() => {
            window.location.href = "/projects";
          }}
          className="w-full py-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#E5E5E7] transition-colors duration-300 shadow-[0_12px_24px_rgba(255,255,255,0.15)] cursor-pointer"
        >
          Explore Other Projects
        </button>
      </div>
    </div>
  );
}

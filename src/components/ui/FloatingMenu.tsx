"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-[150] pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom ${
        isOpen
          ? "w-[491px] max-w-[calc(100vw-2rem)] h-[400px] bg-[#0E0E0E] rounded-[15px] p-[10px] flex flex-col justify-between shadow-2xl border border-white/5"
          : "w-[491px] max-w-[calc(100vw-2rem)] h-[112px] bg-[#0E0E0E] rounded-[15px] p-[10px] flex flex-col justify-end shadow-2xl border border-white/5"
      }`}
    >
      {/* Expanded Nav Links (Top Part) */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between flex-1 overflow-hidden px-4 ${
          isOpen ? "opacity-100 py-3" : "opacity-0 h-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-3 mt-3">
          {[
            { label: "Home", href: "/", icon: "solar:home-smile-bold" },
            { label: "Projects", href: "/projects", icon: "solar:folder-with-files-bold" },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 py-2 border-b border-white/5 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-[10px] bg-[#FBFBFB]/5 group-hover:bg-[#FBFBFB] flex shrink-0 items-center justify-center text-white group-hover:text-[#070707] transition-all duration-300">
                <Icon icon={item.icon} className="text-xl" />
              </div>
              <span className="text-white/60 group-hover:text-[#FBFBFB] text-[21px] font-['Instrument_Sans',sans-serif] font-bold tracking-tight transition-colors">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Social Links — Left Aligned */}
        <div className="flex gap-4 pt-4 pb-8 justify-start pl-2">
          <a
            href="https://www.linkedin.com/in/prathamesh-tipnis-653b00142/"
            className="flex items-center justify-center w-12 h-12 rounded-[10px] bg-white/5 hover:bg-white/10 transition-colors text-[#FBFBFB]"
          >
            <Icon icon="line-md:linkedin" className="text-xl" />
          </a>
          <a
            href="https://www.behance.net/tprathameshUXD1"
            className="flex items-center justify-center w-12 h-12 rounded-[10px] bg-white/5 hover:bg-white/10 transition-colors text-[#FBFBFB]"
          >
            <Icon icon="fa6-brands:behance" className="text-xl" />
          </a>
          <a
            href="mailto:tprathamesh8@gmail.com"
            className="flex items-center justify-center w-12 h-12 rounded-[10px] bg-white/5 hover:bg-white/10 transition-colors text-[#FBFBFB]"
          >
            <Icon icon="line-md:email-opened" className="text-xl" />
          </a>
        </div>
      </div>

      {/* Bottom Bar (Pill UI) */}
      <div className="w-full flex items-center justify-center gap-0 shrink-0">

        {/* Left Block (Logo) */}
        <div className="w-[92px] h-[92px] bg-[#FBFBFB] rounded-[10px] flex items-center justify-center shrink-0">
          <div className="w-[69px] h-[69px] rounded-[10px] overflow-hidden flex items-center justify-center p-1.5 bg-[#1F1F1F]">
            <img src="/logo.png" alt="Logo" className="w-[60%] h-[60%] object-contain" />
          </div>
        </div>

        {/* Middle Block (Text) */}
        <div className="flex-1 max-w-[277px] h-[92px] bg-[#FBFBFB] rounded-[10px] flex flex-col justify-center items-start pl-[25px] py-1">
          <span className="font-['Instrument_Sans',sans-serif] font-bold text-[23px] leading-none text-[#070707]">
            Prathamesh Tipnis
          </span>
          <span className="font-['Instrument_Sans',sans-serif] font-bold text-[16px] leading-none text-[#070707] mt-[4px]">
            Product Designer
          </span>
        </div>

        {/* Right Block (Button) */}
        <div className="w-[92px] h-[92px] bg-[#FBFBFB] rounded-[10px] flex items-center justify-center shrink-0">
          {isOpen ? (
            <button
              onClick={() => setIsOpen(false)}
              className="w-[69px] h-[69px] rounded-[10px] bg-[#1F1F1F] flex items-center justify-center hover:bg-[#2F2F2F] transition-colors shrink-0 cursor-pointer"
            >
              <Icon icon="lucide:x" className="text-white text-3xl" />
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="w-[69px] h-[69px] rounded-[10px] bg-[#1F1F1F] flex items-center justify-center hover:bg-[#2F2F2F] transition-colors shrink-0 cursor-pointer"
            >
              <Icon icon="lucide:menu" className="text-white text-3xl" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

interface BackToProjectsProps {
  href?: string;
  label?: string;
}

export const BackToProjects = ({
  href = "/projects",
  label = "All Projects",
}: BackToProjectsProps) => {
  return (
    <Link
      href={href}
      className="back-to-projects-btn group fixed top-6 left-6 md:top-8 md:left-12 z-[101] flex items-center gap-2 px-4 py-2 rounded-full text-white/70 hover:text-white transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Icon
        icon="solar:arrow-left-linear"
        className="text-base transition-transform duration-300 group-hover:-translate-x-1"
      />
      <span className="text-xs font-semibold uppercase tracking-[0.12em]">
        {label}
      </span>
    </Link>
  );
};

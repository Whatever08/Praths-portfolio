"use client";

import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import { useRef } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface CaseStudy {
    id: string;
    number: string;
    title: string;
    description: string;
    collaborators: string[];
    image: string;
    color: string;
    tag: string;
}

const CASE_STUDIES: CaseStudy[] = [
    {
        id: "01",
        tag: "SERVICE / 01",
        number: "CASE STUDY / 01",
        title: "Exsavvy Platform",
        description: "A comprehensive digital ecosystem designed to elevate brand interactions. We crafted a highly intuitive interface with immersive animations and a deeply integrated design language.",
        collaborators: ["Prathamesh Tipnis"],
        image: "/Exsavvy2.png",
        color: "#FFFFFF",
    },
    {
        id: "02",
        tag: "SERVICE / 02",
        number: "CASE STUDY / 02",
        title: "Nebula System",
        description: "A futuristic data visualization and management dashboard. Focused on cutting-edge aesthetics and seamless performance, we engineered a scalable solution tailored for complex data ecosystems.",
        collaborators: ["Prathamesh Tipnis"],
        image: "/Nebula2.png",
        color: "#FFFFFF",
    },
    {
        id: "03",
        tag: "SERVICE / 03",
        number: "CASE STUDY / 03",
        title: "Flytbase Command",
        description: "Redefining autonomous drone operations with real-time tracking and control architecture. We built a robust, high-performance interface that balances mission-critical functionality with elegant, functional design.",
        collaborators: ["Prathamesh Tipnis"],
        image: "/flytbase2.png",
        color: "#FFFFFF",
    },
];

interface CardProps {
    i: number;
    study: CaseStudy;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
}

const CaseStudyCard = ({
    i,
    study,
    progress,
    range,
    targetScale,
}: CardProps) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "start start"],
    });

    // Scale of the image inside the card
    const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
    // Overall card scale as it gets stacked
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div
            ref={container}
            className="h-[80vh] md:h-screen w-full flex items-center justify-center sticky top-0 px-4 md:px-12 pointer-events-none"
        >
            <motion.div
                style={{
                    scale,
                    top: `calc(var(--sticky-top, 10vh) + ${i * 25}px)`,
                }}
                className="relative flex flex-col w-full max-w-5xl origin-top rounded-[2.5rem] shadow-[-20px_20px_60px_rgba(0,0,0,0.1)] overflow-visible pointer-events-auto [--sticky-top:20vh] md:[--sticky-top:10vh]"
            >
                {/* Card Body */}
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 lg:p-14 flex flex-col md:flex-row gap-8 lg:gap-14 min-h-[300px] md:min-h-[330px] lg:min-h-[400px] overflow-hidden shadow-inner">
                    {/* Content Left */}
                    <div className="flex-1 flex flex-col justify-between py-2 md:py-4 order-2 md:order-1">
                        <div>
                            <h3 className="text-2xl md:text-3xl lg:text-5xl font-black text-black tracking-tighter leading-[0.9] mb-4 md:mb-6">
                                {study.title}
                            </h3>
                            <p className="text-base md:text-lg lg:text-xl text-black/50 leading-relaxed max-w-xl font-medium line-clamp-3 md:line-clamp-none">
                                {study.description}
                            </p>

                            <button className="mt-6 md:mt-8 px-8 py-3 w-fit rounded-full border border-black/20 text-black text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
                                View Project
                            </button>
                        </div>

                        <div className="mt-8 md:mt-12">
                            <div className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] mb-3">
                                Collaborators
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {study.collaborators.map((name, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-black/5 rounded-full text-[10px] md:text-xs font-bold text-black/70">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image Right */}
                    <div className="flex-1 relative rounded-[2rem] overflow-hidden min-h-[200px] md:min-h-full bg-slate-100 order-1 md:order-2 shadow-inner">
                        <motion.div
                            className="w-full h-full"
                            style={{ scale: imageScale }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={study.image}
                                alt={study.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const CaseStudiesSection = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"],
    });

    const headerOpacity = useTransform(scrollYProgress, [0.6, 0.8], [1, 0]);
    const headerY = useTransform(scrollYProgress, [0.6, 0.8], [0, -50]);

    return (
        <section ref={container} className="relative bg-transparent mt-32 mb-40">
            {/* 1) Floating Sticky Header - Pins to the top and stays there while the container implies scroll height */}
            <motion.div 
                style={{ opacity: headerOpacity, y: headerY }}
                className="sticky top-0 w-full flex justify-center z-10 pointer-events-none pb-20 pt-24 md:pt-32"
            >
                <div className="max-w-[90rem] px-6 md:px-12 flex flex-col items-center text-center pointer-events-auto">
                    <h2 className="text-[30px] font-semibold font-sans text-white">
                        Case Study
                    </h2>
                </div>
            </motion.div>

            {/* 2) Stacking Cards Wrapper - Each card is sticky inside this tall container */}
            {/* Negative margin top to let the first card slide under the header smoothly */}
            <div className="relative z-20 w-full -mt-[15vh]">
                {CASE_STUDIES.map((study, i) => {
                    const targetScale = 1 - (CASE_STUDIES.length - i) * 0.05;
                    const step = 1 / CASE_STUDIES.length;
                    return (
                        <CaseStudyCard
                            key={study.id}
                            i={i}
                            study={study}
                            progress={scrollYProgress}
                            range={[i * step, 1]}
                            targetScale={targetScale}
                        />
                    );
                })}

                {/* Tall bottom spacer to ensure the last card remains sticky briefly before leaving section */}
                <div className="h-[20vh]" />
            </div>
        </section>
    );
};

export default CaseStudiesSection;

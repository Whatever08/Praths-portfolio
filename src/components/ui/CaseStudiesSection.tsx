"use client";

import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import { useRef } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface CaseStudy {
    id: string;
    tag: string;
    number: string;
    title: string;
    description: string;
    collaborators: string[];
    image: string;
    color: string;
    link: string;
}

const CASE_STUDIES: CaseStudy[] = [
    {
        id: "00",
        tag: "SERVICE / 00",
        number: "CASE STUDY / 00",
        title: "Exsavvy Platform",
        description: "A comprehensive digital ecosystem designed to elevate brand interactions. We crafted a highly intuitive interface with immersive animations and a deeply integrated design language.",
        collaborators: ["Prathamesh Tipnis"],
        image: "/Exsavvy2.png",
        color: "#FFFFFF",
        link: "https://www.behance.net/gallery/137709183/Exsavvy-UX-Case-Study",
    },
    {
        id: "01",
        tag: "SERVICE / 01",
        number: "CASE STUDY / 01",
        title: "Nebula System",
        description: "A futuristic data visualization and management dashboard. Focused on cutting-edge aesthetics and seamless performance, we engineered a scalable solution tailored for complex data ecosystems.",
        collaborators: ["Prathamesh Tipnis", "Sandrea Joseph"],
        image: "/Nebula2.png",
        color: "#FFFFFF",
        link: "https://www.figma.com/deck/P7FWip4bgwJ8kEPoqCnXsV",
    },
    {
        id: "02",
        tag: "SERVICE / 02",
        number: "CASE STUDY / 02",
        title: "User Testing 2FA in Indian Banking Apps",
        description: "A comprehensive user testing study evaluating the friction and security trade-offs of two-factor authentication in Indian banking applications.",
        collaborators: ["Prathamesh Tipnis", "Tanvi Jain", "Kshitij Bhoyar", "Nisha Nage"],
        image: "/2fa_face.png",
        color: "#FFFFFF",
        link: "https://www.figma.com/proto/lybG9pm8ll1DW1IxBckVQR/User-Testing--Two-Factor-Authentication-in-Indian-Banking--Apps?page-id=0%3A1&node-id=119-10990&viewport=-202%2C487%2C0.09&t=R1qXnK4g7P46yuYj-1&scaling=scale-down&content-scaling=fixed",
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
    const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
    // Overall card scale as it gets stacked
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div
            ref={container}
            className="h-[85vh] md:h-screen w-full flex items-center justify-center sticky top-0 px-4 md:px-12 pointer-events-none"
        >
            <motion.div
                style={{
                    scale,
                    top: `calc(var(--sticky-top, 10vh) + ${i * 25}px)`,
                }}
                className="relative flex flex-col w-[85vw] md:w-full max-w-5xl origin-top rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-visible pointer-events-auto [--sticky-top:20vh] md:[--sticky-top:10vh]"
            >
                {/* Card Body */}
                <div className="bg-white rounded-[2.5rem] p-5 md:p-10 lg:p-14 grid grid-cols-1 grid-rows-2 md:flex md:flex-row gap-6 md:gap-8 lg:gap-14 min-h-[540px] md:min-h-[450px] lg:min-h-[500px] overflow-hidden">
                    {/* Content Left */}
                    <div className="flex-1 flex flex-col justify-between py-2 md:py-4 order-2 md:order-1">
                        <div>
                            <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black tracking-tighter leading-[1.1] mb-3 md:mb-6">
                                {study.title}
                            </h3>
                            <p className="text-sm md:text-lg lg:text-xl text-black/60 leading-[1.6] max-w-xl font-normal line-clamp-3 md:line-clamp-none tracking-tight">
                                {study.description}
                            </p>

                            <div className="flex items-center gap-4 mt-4 md:mt-10">
                                <Link
                                    href={study.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-full border border-black/20 text-black text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 cursor-pointer inline-block text-center"
                                >
                                    View Project
                                </Link>
                            </div>
                        </div>

                        <div className="mt-4 md:mt-12">
                            <div className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mb-2 md:mb-4">
                                Collaborators
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {study.collaborators.map((name, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-black/5 rounded-[6px] text-[11px] md:text-xs font-semibold text-black/80">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image Right */}
                    <div 
                        className="flex-1 md:h-auto md:min-h-full relative rounded-[2rem] overflow-hidden bg-[#0a0a0a] order-1 md:order-2 shadow-inner"
                        style={{
                            transform: "translate3d(0, 0, 0)",
                            WebkitTransform: "translate3d(0, 0, 0)",
                            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                        }}
                    >
                        <motion.div
                            className="w-full h-full"
                            style={{ scale: imageScale }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={study.image}
                                alt={study.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                    transform: "translate3d(0, 0, 0)",
                                    WebkitTransform: "translate3d(0, 0, 0)",
                                }}
                            />
                        </motion.div>
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

    const headerOpacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);
    const headerY = useTransform(scrollYProgress, [0.8, 0.9], [0, -50]);

    return (
        <section ref={container} className="relative bg-transparent mt-32 mb-40">
            {/* Floating Sticky Header */}
            <motion.div
                style={{ opacity: headerOpacity, y: headerY }}
                className="sticky top-0 w-full flex justify-center z-10 pointer-events-none pb-20 pt-24 md:pt-32"
            >
                <div className="max-w-[90rem] px-6 md:px-12 flex flex-col items-center text-center pointer-events-auto">
                    <h2 className="text-[32px] md:text-[40px] tracking-tight font-medium font-sans text-white">
                        Case Study
                    </h2>
                </div>
            </motion.div>

            {/* Stacking Cards Wrapper */}
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

                {/* Bottom spacer */}
                <div className="h-[20vh]" />
            </div>
        </section>
    );
};

export default CaseStudiesSection;
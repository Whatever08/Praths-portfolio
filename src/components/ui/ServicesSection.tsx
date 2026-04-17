"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, Variants } from "motion/react";
import Image from "next/image";

interface Service {
    title: string;
    description: string;
    color: string;
    image: string;
}

const SERVICES: Service[] = [
    {
        title: "Visual Design",
        description: "Aesthetic Direction",
        color: "#000000",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    },
    {
        title: "UI/UX Design",
        description: "User-Centric Interfaces",
        color: "#1C1C1C",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200",
    },
    {
        title: "Branding",
        description: "Identity & Strategy",
        color: "#2C2C2C",
        image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200",
    },
    {
        title: "Frontend Development",
        description: "Creative & Vibe Coding",
        color: "#0D0D0D",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
    },
    {
        title: "Mobile Applications",
        description: "Responsive Exp.",
        color: "#1A1A1A",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
    },
];

const scaleAnimation: Variants = {
    closed: { scale: 0, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } },
    enter: { scale: 1, x: "-50%", y: "-50%", transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
    hidden: { scale: 0, x: "-50%", y: "-50%" },
};

interface ModalState {
    active: boolean;
    index: number;
}

const ServicesSection = () => {
    const [modal, setModal] = useState<ModalState>({ active: false, index: 0 });
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section ref={sectionRef} className="py-32 bg-black/90 relative z-30 pointer-events-auto overflow-hidden border-t border-white/5">
            <div className="max-w-[100rem] mx-auto px-6 md:px-12 mb-20 flex flex-col items-center">
                <h2 className="text-[30px] font-semibold font-sans text-white text-center">
                    Services
                </h2>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
                <div className="flex flex-col items-center">
                    {SERVICES.map((service, index) => (
                        <ServiceItem
                            key={index}
                            index={index}
                            service={service}
                            setModal={setModal}
                        />
                    ))}
                </div>
                <Modal modal={modal} services={SERVICES} />
            </div>
        </section>
    );
};

interface ServiceItemProps {
    index: number;
    service: Service;
    setModal: React.Dispatch<React.SetStateAction<ModalState>>;
}

function ServiceItem({ index, service, setModal }: ServiceItemProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = () => {
        setModal({ active: true, index });
        gsap.to(titleRef.current, { x: 25, opacity: 1, duration: 0.5, ease: "power3.out" });
        gsap.to(circleRef.current, { backgroundColor: "#fff", color: "#000", scale: 1.05, duration: 0.4 });

        const tl = gsap.timeline();
        tl.to(descRef.current, { opacity: 1, x: -20, duration: 0.6, ease: "power2.out" })
            .to(descRef.current, { opacity: 0, x: -10, duration: 0.6, delay: 1.5, ease: "power2.in" });
    };

    const handleMouseLeave = () => {
        setModal({ active: false, index });
        gsap.to(titleRef.current, { x: 0, opacity: 0.6, duration: 0.5, ease: "power3.out" });
        gsap.to(circleRef.current, { backgroundColor: "transparent", color: "#fff", scale: 1, duration: 0.4 });

        gsap.killTweensOf(descRef.current);
        gsap.to(descRef.current, { opacity: 0, x: 0, duration: 0.3, ease: "power2.in" });
    };

    return (
        <div
            className="group flex w-full cursor-pointer items-center justify-between border-white/5 border-t py-12 transition-all duration-300 last:border-b"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center gap-6 md:gap-10">
                <div
                    ref={circleRef}
                    className="w-8 h-8 md:w-12 md:h-12 border border-white/10 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shrink-0 transition-all duration-300"
                >
                    {index + 1}
                </div>
                <h2
                    ref={titleRef}
                    className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-white opacity-60 transition-opacity"
                >
                    {service.title}
                </h2>
            </div>

            <span
                ref={descRef}
                className="opacity-0 font-sans text-sm md:text-xl font-black text-white tracking-widest uppercase text-right md:pr-4"
            >
                — {service.description}
            </span>
        </div>
    );
}

interface ModalProps {
    modal: ModalState;
    services: Service[];
}

function Modal({ modal, services }: ModalProps) {
    const { active, index } = modal;
    const modalContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!modalContainer.current) return;

        const xMoveContainer = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" });
        const yMoveContainer = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            xMoveContainer(clientX);
            yMoveContainer(clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <motion.div
            variants={scaleAnimation}
            initial="hidden"
            animate={active ? "enter" : "closed"}
            ref={modalContainer}
            className="pointer-events-none fixed top-0 left-0 z-[100] flex h-[220px] w-[280px] md:h-[280px] md:w-[380px] items-center justify-center overflow-hidden rounded-2xl bg-black border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
        >
            <div
                className="absolute h-full w-full transition-[top] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{ top: `${index * -100}%` }}
            >
                {services.map((service, idx) => (
                    <div
                        className="flex h-full w-full items-center justify-center relative overflow-hidden"
                        key={idx}
                    >
                        <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="w-full h-full object-cover"
                            sizes="(max-width: 768px) 280px, 380px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default ServicesSection;

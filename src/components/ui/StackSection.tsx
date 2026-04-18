"use client";

import HorizontalScrollGallery from "./HorizontalScrollGallery";

export default function StackSection() {
    return (
        <section className="py-24 bg-white relative z-30 pointer-events-auto overflow-hidden">
            <HorizontalScrollGallery
                heading="The Stack."
                description="Powering modern, high-performance web experiences."
                items={[
                    {
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1627398240449-04f51e0416ee?q=80&w=1200',
                        alt: 'Frontend',
                        title: 'Modern Frontend',
                        description: 'Next.js, React, and Tailwind CSS for robust, scalable architectures.'
                    },
                    {
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
                        alt: 'Animation',
                        title: 'Immersive Motion',
                        description: 'GSAP and Framer Motion for pixel-perfect, highly customized interactions.'
                    },
                    {
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200',
                        alt: 'Design',
                        title: 'Visual Design',
                        description: 'Figma, Spline, and Rive bridging the gap between flat UI and 3D experiences.'
                    },
                    {
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200',
                        alt: 'Backend',
                        title: 'Backend Services',
                        description: 'Vercel and Supabase providing reliable, low-latency infrastructure.'
                    }
                ]}
            />
        </section>
    );
}

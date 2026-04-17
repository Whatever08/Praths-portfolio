"use client";

import React, { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";

/* =========================================================================
   GLSL SHADERS
   ========================================================================= */

const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uRadius;
    uniform float uStrength;
    
    attribute vec3 aOriginal;
    attribute float aSize;
    attribute float aRandom;

    varying vec3 vColor;
    varying float vOpacity;

    void main() {
        vec3 pos = aOriginal;
        
        // Mouse Repulsion
        float dist = distance(uMouse, pos.xy);
        if (dist < uRadius) {
            vec2 dir = normalize(pos.xy - uMouse);
            float force = (uRadius - dist) / uRadius;
            pos.xy += dir * force * uStrength;
        }

        // Animated floating
        pos.x += sin(uTime * 1.5 + aRandom * 10.0) * 0.05;
        pos.y += cos(uTime * 1.2 + aRandom * 10.0) * 0.05;
        pos.z += sin(uTime * 2.0 + aRandom * 5.0) * 0.1;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;

        vOpacity = 0.7 + 0.3 * sin(uTime + aRandom * 6.28);
    }
`;

const fragmentShader = `
    varying float vOpacity;

    void main() {
        // Round particle
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        
        float alpha = smoothstep(0.5, 0.4, d) * vOpacity;
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
`;

/* =========================================================================
   COMPONENT
   ========================================================================= */

interface ParticleTextProps {
    text: string;
    fontSize?: number;
    density?: number;
    className?: string;
}

export const ParticleText: React.FC<ParticleTextProps> = ({ 
    text, 
    fontSize = 120, 
    density = 1.0,
    className = "" 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- 1. Scene Setup ---
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // --- 2. Text Sampling ---
        const samplingCanvas = document.createElement("canvas");
        const ctx = samplingCanvas.getContext("2d", { willReadFrequently: true })!;
        samplingCanvas.width = width;
        samplingCanvas.height = height;

        ctx.fillStyle = "white";
        ctx.font = `black 900 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, width / 2, height / 2);

        const imageData = ctx.getImageData(0, 0, width, height).data;
        const positions: number[] = [];
        const randoms: number[] = [];
        const sizes: number[] = [];

        // Sample pixels (step controls density)
        const step = Math.max(1, Math.floor(4 / density)); 
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const index = (y * width + x) * 4;
                const alpha = imageData[index + 3];

                if (alpha > 128) {
                    // Convert pixel coords to Three.js space
                    const px = (x - width / 2) * (180 / width);
                    const py = -(y - height / 2) * (180 / width); // Keep aspect ratio
                    
                    positions.push(px, py, 0);
                    randoms.push(Math.random());
                    sizes.push(Math.random() * 2 + 1);
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("aOriginal", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("aRandom", new THREE.Float32BufferAttribute(randoms, 1));
        geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(-1000, -1000) },
                uRadius: { value: 15.0 },
                uStrength: { value: 5.0 }
            },
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // --- 3. Animation & Interaction ---
        const mouse = new THREE.Vector2();
        const handleMouseMove = (e: MouseEvent) => {
            const rect = containerRef.current!.getBoundingClientRect();
            // Convert to world space (-90 to 90 roughly)
            const x = ((e.clientX - rect.left) / width) * 2 - 1;
            const y = -((e.clientY - rect.top) / height) * 2 + 1;
            mouse.set(x * 90, y * 45); // Adjust multipliers to match world scale
        };

        window.addEventListener("mousemove", handleMouseMove);

        let animationId: number;
        const animate = (time: number) => {
            material.uniforms.uTime.value = time / 1000;
            // Interpolate mouse for smoothness
            material.uniforms.uMouse.value.lerp(mouse, 0.1);
            
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);

        // --- 4. Cleanup ---
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, [text, fontSize, density]);

    return (
        <div 
            ref={containerRef} 
            className={`w-full h-full min-h-[40vh] md:min-h-[60vh] relative z-10 ${className}`} 
        />
    );
};

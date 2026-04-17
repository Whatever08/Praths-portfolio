/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─── Touch Displacement Texture ───────────────────────────────────────────────
class TouchTexture {
    size: number;
    maxAge: number;
    radius: number;
    speed: number;
    trail: { x: number; y: number; age: number; force: number; vx: number; vy: number }[];
    last: { x: number; y: number } | null;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    texture: THREE.Texture;

    constructor() {
        this.size = 64;
        this.maxAge = 64;
        this.radius = 0.15;
        this.speed = 1 / 64;
        this.trail = [];
        this.last = null;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.size, this.size);
        this.texture = new THREE.Texture(this.canvas);
    }

    update() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.size, this.size);
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const p = this.trail[i];
            const f = p.force * this.speed * (1 - p.age / this.maxAge);
            p.x += p.vx * f;
            p.y += p.vy * f;
            p.age++;
            if (p.age > this.maxAge) {
                this.trail.splice(i, 1);
            } else {
                this.drawPoint(p);
            }
        }
        this.texture.needsUpdate = true;
    }

    addTouch(point: { x: number; y: number }) {
        let force = 0, vx = 0, vy = 0;
        if (this.last) {
            const dx = point.x - this.last.x;
            const dy = point.y - this.last.y;
            if (dx === 0 && dy === 0) return;
            const d = Math.sqrt(dx * dx + dy * dy);
            vx = dx / d;
            vy = dy / d;
            force = Math.min((dx * dx + dy * dy) * 20000, 2.0);
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }

    drawPoint(p: { x: number; y: number; age: number; force: number; vx: number; vy: number }) {
        const pos = { x: p.x * this.size, y: (1 - p.y) * this.size };
        let intensity = p.age < this.maxAge * 0.3
            ? Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2))
            : -((1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) * ((1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) - 2));
        intensity *= p.force;
        const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
        const radius = this.radius * this.size;
        this.ctx.shadowOffsetX = this.size * 5;
        this.ctx.shadowOffsetY = this.size * 5;
        this.ctx.shadowBlur = radius;
        this.ctx.shadowColor = `rgba(${color},${0.3 * intensity})`;
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,0,0,1)";
        this.ctx.arc(pos.x - this.size * 5, pos.y - this.size * 5, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// ─── Shader strings (kept outside the class so they're not re-created) ────────
const VERTEX_SHADER = /* glsl */`
    varying vec2 vUv;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
    }
`;

const FRAGMENT_SHADER = /* glsl */`
    // ── uniforms ──
    uniform float uTime;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform float uGrainIntensity;
    uniform float uGradientSize;
    uniform float uColor1Weight;
    uniform float uColor2Weight;
    uniform float uVignetteOffset;
    uniform float uVignetteDarkness;
    uniform vec2  uResolution;
    uniform vec3  uColor1;
    uniform vec3  uColor2;
    uniform vec3  uColor3;
    uniform vec3  uColor4;
    uniform vec3  uColor5;
    uniform vec3  uColor6;
    uniform vec3  uDarkNavy;
    uniform sampler2D uTouchTexture;

    varying vec2 vUv;

    // ── helpers ──
    vec3 getGradientColor(vec2 uv, float time) {
        float s = uSpeed;
        vec2 c1 = vec2(0.5 + sin(time * s * 0.40) * 0.40, 0.5 + cos(time * s * 0.50) * 0.40);
        vec2 c2 = vec2(0.5 + cos(time * s * 0.60) * 0.50, 0.5 + sin(time * s * 0.45) * 0.50);
        vec2 c3 = vec2(0.5 + sin(time * s * 0.35) * 0.45, 0.5 + cos(time * s * 0.55) * 0.45);
        vec2 c4 = vec2(0.5 + cos(time * s * 0.50) * 0.40, 0.5 + sin(time * s * 0.40) * 0.40);
        vec2 c5 = vec2(0.5 + sin(time * s * 0.70) * 0.35, 0.5 + cos(time * s * 0.60) * 0.35);
        vec2 c6 = vec2(0.5 + cos(time * s * 0.45) * 0.50, 0.5 + sin(time * s * 0.65) * 0.50);

        float i1 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c1));
        float i2 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c2));
        float i3 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c3));
        float i4 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c4));
        float i5 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c5));
        float i6 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c6));

        vec3 col = vec3(0.0);
        col += uColor1 * i1 * (0.55 + 0.45 * sin(time * s))        * uColor1Weight;
        col += uColor2 * i2 * (0.55 + 0.45 * cos(time * s * 1.20)) * uColor2Weight;
        col += uColor3 * i3 * (0.55 + 0.45 * sin(time * s * 0.80)) * uColor1Weight;
        col += uColor4 * i4 * (0.55 + 0.45 * cos(time * s * 1.30)) * uColor2Weight;
        col += uColor5 * i5 * (0.55 + 0.45 * sin(time * s * 1.10)) * uColor1Weight;
        col += uColor6 * i6 * (0.55 + 0.45 * cos(time * s * 0.90)) * uColor2Weight;

        col = clamp(col, 0.0, 1.0) * uIntensity;
        return col;
    }

    void main() {
        vec2 uv = vUv;

        // ── touch displacement ──
        vec4 touch = texture2D(uTouchTexture, uv);
        uv.x -= (touch.r * 2.0 - 1.0) * 0.8 * touch.b;
        uv.y -= (touch.g * 2.0 - 1.0) * 0.8 * touch.b;

        // ── ripple ──
        vec2 center = vec2(0.5);
        float dist  = length(uv - center);
        float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * touch.b;
        uv += ripple;

        // ── colour ──
        vec3 color = getGradientColor(uv, uTime);
        color = clamp(color, 0.0, 1.0);

        gl_FragColor = vec4(color, 1.0);
    }
`;

// ─── Gradient background controller ───────────────────────────────────────────
class GradientBackground {
    sceneManager: any;
    isPaused: boolean;
    uniforms: any;
    mesh: THREE.Mesh | null = null;

    constructor(sceneManager: any) {
        this.sceneManager = sceneManager;
        this.isPaused = false;
        this.uniforms = {
            uTime:          { value: 0 },
            uResolution:    { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uColor1:        { value: new THREE.Vector3(0.945, 0.353, 0.133) },
            uColor2:        { value: new THREE.Vector3(0.039, 0.055, 0.153) },
            uColor3:        { value: new THREE.Vector3(0.945, 0.231, 0.188) },
            uColor4:        { value: new THREE.Vector3(0.059, 0.094, 0.302) },
            uColor5:        { value: new THREE.Vector3(1.0, 0.42, 0.188) },
            uColor6:        { value: new THREE.Vector3(0.02, 0.02, 0.04) },
            uSpeed:         { value: 1.2 },
            uIntensity:     { value: 1.8 },
            uGradientSize:  { value: 0.45 },
            uColor1Weight:  { value: 0.5 },
            uColor2Weight:  { value: 1.8 },
            uDarkNavy:      { value: new THREE.Vector3(0.02, 0.02, 0.02) },
            uTouchTexture:  { value: null },
        };
    }

    init() {
        const viewSize = this.sceneManager.getViewSize();
        const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.sceneManager.scene.add(this.mesh);
    }

    update(delta: number) {
        if (!this.isPaused) this.uniforms.uTime.value += delta;
    }

    onResize(w: number, h: number) {
        const viewSize = this.sceneManager.getViewSize();
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height);
        }
        this.uniforms.uResolution.value.set(w, h);
    }
}

// ─── Main app ─────────────────────────────────────────────────────────────────
class LiquidApp {
    container: HTMLElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    clock: THREE.Clock;
    touchTexture: TouchTexture;
    gradientBackground: GradientBackground;
    animationId: number | null = null;
    boundOnMove: (e: MouseEvent | TouchEvent) => void;
    boundOnResize: () => void;

    constructor(container: HTMLElement) {
        this.container = container;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.z = 50;

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        this.touchTexture = new TouchTexture();
        this.gradientBackground = new GradientBackground(this);
        this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;

        this.boundOnMove = this.onMove.bind(this);
        this.boundOnResize = this.onResize.bind(this);

        this.init();
    }

    getViewSize() {
        const fov = (this.camera.fov * Math.PI) / 180;
        const height = Math.abs(this.camera.position.z * Math.tan(fov / 2) * 2);
        return { width: height * this.camera.aspect, height };
    }

    onMove(e: MouseEvent | TouchEvent) {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        this.touchTexture.addTouch({
            x: clientX / window.innerWidth,
            y: 1 - clientY / window.innerHeight,
        });
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.gradientBackground.onResize(window.innerWidth, window.innerHeight);
    }

    init() {
        this.gradientBackground.init();
        window.addEventListener("mousemove", this.boundOnMove);
        window.addEventListener("touchmove", this.boundOnMove, { passive: true });
        window.addEventListener("resize", this.boundOnResize);
        this.tick();
    }

    tick() {
        const delta = Math.min(this.clock.getDelta(), 0.1);
        this.touchTexture.update();
        this.gradientBackground.update(delta);
        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(() => this.tick());
    }

    destroy() {
        window.removeEventListener("mousemove", this.boundOnMove);
        window.removeEventListener("touchmove", this.boundOnMove);
        window.removeEventListener("resize", this.boundOnResize);
        if (this.animationId !== null) cancelAnimationFrame(this.animationId);
        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
        this.renderer.forceContextLoss();
    }
}

// ─── React component ──────────────────────────────────────────────────────────
export function ProjectLiquidBackground({ children }: { children?: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const app = new LiquidApp(containerRef.current);
        return () => app.destroy();
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* WebGL canvas */}
            <div
                ref={containerRef}
                className="fixed inset-0 z-[-2] pointer-events-none w-full h-full"
            />
            {/* Film-grain overlay — baseFrequency 0.5 (40% softer) */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.12] z-[-1]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px 180px",
                }}
                aria-hidden="true"
            />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class TouchTexture {
    size: number;
    width: number;
    height: number;
    maxAge: number;
    radius: number;
    speed: number;
    trail: { x: number; y: number; age: number; force: number; vx: number; vy: number }[];
    last: { x: number; y: number } | null;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    texture: THREE.Texture;

    constructor() {
        this.size = 64; this.width = 64; this.height = 64; this.maxAge = 64; this.radius = 0.15; this.speed = 1 / 64;
        this.trail = []; this.last = null;
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width; this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d")!;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.texture = new THREE.Texture(this.canvas);
    }

    update() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const p = this.trail[i];
            const f = p.force * this.speed * (1 - p.age / this.maxAge);
            p.x += p.vx * f; p.y += p.vy * f; p.age++;
            if (p.age > this.maxAge) this.trail.splice(i, 1);
            else this.drawPoint(p);
        }
        this.texture.needsUpdate = true;
    }

    addTouch(point: { x: number; y: number }) {
        let force = 0, vx = 0, vy = 0;
        if (this.last) {
            const dx = point.x - this.last.x, dy = point.y - this.last.y;
            if (dx === 0 && dy === 0) return;
            const d = Math.sqrt(dx * dx + dy * dy);
            vx = dx / d; vy = dy / d;
            force = Math.min((dx * dx + dy * dy) * 20000, 2.0);
        }
        this.last = { x: point.x, y: point.y };
        this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
    }

    drawPoint(p: { x: number; y: number; age: number; force: number; vx: number; vy: number }) {
        const pos = { x: p.x * this.width, y: (1 - p.y) * this.height };
        let intensity = p.age < this.maxAge * 0.3
            ? Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2))
            : -((1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) * ((1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) - 2));
        intensity *= p.force;
        const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`;
        const radius = this.radius * this.width;
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

class GradientBackground {
    sceneManager: any;
    isPaused: boolean;
    uniforms: any;
    mesh: THREE.Mesh | null = null;
    constructor(sceneManager: any, colors?: any) {
        this.sceneManager = sceneManager;
        this.isPaused = false;
        this.uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uColor1: { value: colors?.uColor1 || new THREE.Vector3(0.945, 0.353, 0.133) },
            uColor2: { value: colors?.uColor2 || new THREE.Vector3(0.039, 0.055, 0.153) },
            uColor3: { value: colors?.uColor3 || new THREE.Vector3(0.945, 0.353, 0.133) },
            uColor4: { value: colors?.uColor4 || new THREE.Vector3(0.039, 0.055, 0.153) },
            uColor5: { value: colors?.uColor5 || new THREE.Vector3(0.945, 0.353, 0.133) },
            uColor6: { value: colors?.uColor6 || new THREE.Vector3(0.039, 0.055, 0.153) },
            uSpeed: { value: 1.2 }, uIntensity: { value: 1.8 },
            uTouchTexture: { value: null },
            uDarkNavy: { value: new THREE.Vector3(0.02, 0.02, 0.02) },
            uGradientSize: { value: 0.45 }, uGradientCount: { value: 12.0 },
            uColor1Weight: { value: 0.5 }, uColor2Weight: { value: 1.8 }
        };
    }
    init() {
        const viewSize = this.sceneManager.getViewSize();
        const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `varying vec2 vUv; void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); vUv = uv; }`,
            fragmentShader: `
                uniform float uTime, uSpeed, uIntensity, uGradientSize, uGradientCount, uColor1Weight, uColor2Weight;
                uniform vec2 uResolution;
                uniform vec3 uColor1, uColor2, uColor3, uColor4, uColor5, uColor6, uDarkNavy;
                uniform sampler2D uTouchTexture;
                varying vec2 vUv;
                
                vec3 getGradientColor(vec2 uv, float time) {
                    vec2 c1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
                    vec2 c2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
                    vec2 c3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
                    vec2 c4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
                    vec2 c5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
                    vec2 c6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
                    
                    float i1 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c1));
                    float i2 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c2));
                    float i3 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c3));
                    float i4 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c4));
                    float i5 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c5));
                    float i6 = 1.0 - smoothstep(0.0, uGradientSize, length(uv - c6));
                    
                    vec3 color = vec3(0.0);
                    color += uColor1 * i1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
                    color += uColor2 * i2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
                    color += uColor3 * i3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
                    color += uColor4 * i4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight; 
                    color += uColor5 * i5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
                    color += uColor6 * i6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;
                    
                    color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;
                    return color;
                }
                
                void main() {
                    vec2 uv = vUv;
                    vec4 touchTex = texture2D(uTouchTexture, uv);
                    uv.x -= (touchTex.r * 2.0 - 1.0) * 0.8 * touchTex.b;
                    uv.y -= (touchTex.g * 2.0 - 1.0) * 0.8 * touchTex.b;
                    vec2 center = vec2(0.5);
                    float dist = length(uv - center);
                    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * touchTex.b;
                    uv += vec2(ripple);

                    vec3 color = getGradientColor(uv, uTime);
                    color = clamp(color, vec3(0.0), vec3(1.0));
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.sceneManager.scene.add(this.mesh);
    }
    update(delta: number) { if (!this.isPaused) this.uniforms.uTime.value += delta; }
    onResize(w: number, h: number) {
        const viewSize = this.sceneManager.getViewSize();
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
        }
        this.uniforms.uResolution.value.set(w, h);
    }
}

class LiquidApp {
    container: HTMLElement;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    clock: THREE.Clock;
    touchTexture: TouchTexture;
    gradientBackground: GradientBackground;
    animationId: number | null = null;
    boundOnMove: (e: any) => void;
    boundOnResize: () => void;

    constructor(container: HTMLElement, colors?: any) {
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
        this.gradientBackground = new GradientBackground(this, colors);
        this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;

        this.boundOnMove = this.onMove.bind(this);
        this.boundOnResize = this.onResize.bind(this);

        this.init();
    }
    setPaused(paused: boolean) { this.gradientBackground.isPaused = paused; }
    getViewSize() {
        const fov = (this.camera.fov * Math.PI) / 180;
        const height = Math.abs(this.camera.position.z * Math.tan(fov / 2) * 2);
        return { width: height * this.camera.aspect, height };
    }
    onMove(e: MouseEvent | TouchEvent) {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        this.touchTexture.addTouch({ x: clientX / window.innerWidth, y: 1 - clientY / window.innerHeight });
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
        window.addEventListener("touchmove", this.boundOnMove);
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
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
    }
}

export function LiquidBackground({ children, colors }: { children?: React.ReactNode, colors?: any }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let processedColors: any = undefined;
        if (colors) {
            processedColors = {};
            if (colors.uColor1) processedColors.uColor1 = new THREE.Vector3(...colors.uColor1);
            if (colors.uColor2) processedColors.uColor2 = new THREE.Vector3(...colors.uColor2);
            if (colors.uColor3) processedColors.uColor3 = new THREE.Vector3(...colors.uColor3);
            if (colors.uColor4) processedColors.uColor4 = new THREE.Vector3(...colors.uColor4);
            if (colors.uColor5) processedColors.uColor5 = new THREE.Vector3(...colors.uColor5);
            if (colors.uColor6) processedColors.uColor6 = new THREE.Vector3(...colors.uColor6);
        }

        const app = new LiquidApp(containerRef.current, processedColors);
        return () => app.destroy();
    }, [colors]);

    return (
        <div className="relative min-h-screen">
            {/* WebGL canvas */}
            <div
                ref={containerRef}
                className="fixed inset-0 z-[-2] pointer-events-none w-full h-full"
            />
            {/* Film-grain overlay — baseFrequency 0.5 (40% softer than sharp grain) */}
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

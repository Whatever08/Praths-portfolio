/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
  type OGLRenderingContext,
} from "ogl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils"; // Assuming shadcn 'cn' utility path

/* --------------------------------
* Types
----------------------------------- */
export interface GalleryItem {
  image: string;
  text: string;
  link?: string;
}

interface CircularGalleryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * An array of image and text objects for the gallery.
   */
  items?: GalleryItem[];
  /**
   * The amount of curvature. Higher values create a stronger bend.
   * @default 3
   */
  bend?: number;
  /**
   * The border radius for the images, as a percentage (0.0 to 0.5).
   * @default 0.05
   */
  borderRadius?: number;
  /**
   * @default 2
   */
  scrollSpeed?: number;
  /**
   * Easing factor for the scroll animation (lower is smoother).
   * @default 0.025
   */
  scrollEase?: number;
  /**
   * Optional class name to override the default font (e.g., from Next/font).
   */
  fontClassName?: string;
  /**
   * Callback when an item is clicked.
   */
  onItemClick?: (item: GalleryItem) => void;
}

/* --------------------------------
* OGL Helper Utilities
----------------------------------- */
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: object) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof (instance as any)[key] === "function") {
      (instance as any)[key] = (instance as any)[key].bind(instance);
    }
  });
}

function createTextTexture(
  gl: OGLRenderingContext,
  text: string,
  font: string,
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);

  // Extract font size properly from strings like "bold 90px font"
  // but force it to 25px max based on user request.
  const customFont = font.replace(/\d+px/, "25px");
  context.font = customFont;

  const fontSizeMatch = customFont.match(/(\d+)px/);
  const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1], 10) : 40;

  // Render only the text
  canvas.width = textWidth + 140;
  canvas.height = fontSize + 100;

  // Add subtle shadow for the text to improve contrast against variable backgrounds
  context.shadowColor = "rgba(0,0,0,0.8)";
  context.shadowBlur = 15;
  context.shadowOffsetY = 4;

  // Placeholder text
  context.font = customFont;
  context.fillStyle = "white"; // Force stark white for absolute visibility on cards
  context.textBaseline = "top";
  context.textAlign = "center";
  context.fillText(text, canvas.width / 2, 40);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

/* --------------------------------
* OGL Classes
----------------------------------- */
class Title {
  gl: OGLRenderingContext;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor,
    font,
  }: {
    gl: OGLRenderingContext;
    plane: Mesh;
    renderer: Renderer;
    text: string;
    textColor: string;
    font: string;
  }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture } = createTextTexture(
      this.gl,
      this.text,
      this.font,
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        uniform float uAlpha;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = vec4(color.rgb, color.a * uAlpha);
        }
      `,
      uniforms: { tMap: { value: texture }, uAlpha: { value: 0 } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });

    // Scale and position will be updated dynamically in onResize
    // so it perfectly anchors below the card without distortion.
    this.mesh.setParent(this.plane);
  }
}

class Media {
  gl: OGLRenderingContext;
  geometry: Plane;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  extra: number = 0;
  widthTotal: number = 0;
  width: number = 0;
  x: number = 0;
  scale: number = 1;
  padding: number = 2;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;
  isHovered: boolean = false;
  link?: string;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    link,
  }: {
    geometry: Plane;
    gl: OGLRenderingContext;
    image: string;
    index: number;
    length: number;
    renderer: Renderer;
    scene: Transform;
    screen: { width: number; height: number };
    text: string;
    viewport: { width: number; height: number };
    bend: number;
    textColor: string;
    borderRadius: number;
    font: string;
    link?: string;
  }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.link = link;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uHover;
        uniform float uAlpha;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          // Grayscale to Color transition
          float grayscale = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          vec3 finalColor = mix(vec3(grayscale), color.rgb, uHover);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.002;
          float alpha = (1.0 - smoothstep(-edgeSmooth, edgeSmooth, d)) * uAlpha;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uHover: { value: 0 },
        uAlpha: { value: 1 },
      },
      transparent: true,
    });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(
    scroll: { current: number; last: number },
    direction: "left" | "right",
    mouseWorld: { x: number; y: number },
    isMobile: boolean = false
  ) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);

      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }

    // Hover logic check
    const hw = this.plane.scale.x / 2;
    const hh = this.plane.scale.y / 2;
    const dx = mouseWorld.x - this.plane.position.x;
    const dy = mouseWorld.y - this.plane.position.y;

    const angle = -this.plane.rotation.z;
    const rotX = dx * Math.cos(angle) - dy * Math.sin(angle);
    const rotY = dx * Math.sin(angle) + dy * Math.cos(angle);

    const textHeightPadding = 0.5;

    this.isHovered =
      rotX > -hw &&
      rotX < hw &&
      rotY > -hh - textHeightPadding &&
      rotY < hh;

    const targetAlpha = isMobile ? (Math.abs(x) < this.width / 2 ? 1 : 0) : (this.isHovered ? 1 : 0);
    this.title.mesh.program.uniforms.uAlpha.value = lerp(
      this.title.mesh.program.uniforms.uAlpha.value,
      targetAlpha,
      0.04
    );

    // Mobile specific: Hide the entire card if it's not the central one
    if (isMobile) {
      // Very strict visibility: only show if within 25% of screen width from center
      const visibility = Math.abs(x) < (this.viewport.width * 0.25) ? 1 : 0;
      this.program.uniforms.uAlpha.value = lerp(
        this.program.uniforms.uAlpha.value,
        visibility,
        0.05
      );
      // Flat animation for mobile: No bend, just straight horizontal movement
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      this.program.uniforms.uAlpha.value = 1;
    }

    this.program.uniforms.uHover.value = lerp(
      this.program.uniforms.uHover.value,
      (isMobile ? (Math.abs(x) < this.width / 4 ? 1 : 0) : (this.isHovered ? 1 : 0)),
      0.05
    );
  }

  onResize(
    {
      screen,
      viewport,
    }: {
      screen?: { width: number; height: number };
      viewport?: { width: number; height: number };
    } = {},
  ) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
    }
    // Dynamically adjust scale based on screen width for mobile responsiveness
    const isMobile = this.screen.width < 768;
    this.scale = this.screen.height / (isMobile ? 1800 : 1500); // Scale up cards on mobile

    this.plane.scale.y =
      (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x =
      (this.viewport.width * (700 * this.scale)) / this.screen.width;

    this.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];

    this.padding = isMobile ? 1.5 : 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;

    if (this.title && this.title.mesh) {
      const textureWidth = this.title.mesh.program.uniforms.tMap.value.image.width;
      const textureHeight = this.title.mesh.program.uniforms.tMap.value.image.height;
      const aspect = textureWidth / textureHeight;
      const planeAspect = this.plane.scale.x / this.plane.scale.y;

      const meshHeight = 0.4;
      const meshWidth = meshHeight * aspect / planeAspect;
      this.title.mesh.scale.set(meshWidth, meshHeight, 1);

      this.title.mesh.position.y = -0.5 - (meshHeight * 0.5) + 0.05;
      this.title.mesh.position.z = 0.1;
    }
  }
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: { ease: number; current: number; target: number; last: number; position?: number };
  onCheckDebounce: () => void;
  renderer!: Renderer;
  gl!: OGLRenderingContext;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  mediasImages!: GalleryItem[];
  medias!: Media[];
  isDown: boolean = false;
  start: number = 0;
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf!: number;
  boundOnResize!: () => void;
  boundOnWheel!: (e: WheelEvent) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;
  boundOnMouseMove!: (e: MouseEvent) => void;
  mouseWorld: { x: number; y: number } = { x: 0, y: 0 };
  speed: number = 0;
  direction: "left" | "right" = "right";

  constructor(
    container: HTMLElement,
    {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
      onItemClick,
    }: {
      items?: GalleryItem[];
      bend: number;
      textColor: string;
      borderRadius: number;
      font: string;
      scrollSpeed: number;
      scrollEase: number;
      onItemClick?: (item: GalleryItem) => void;
    },
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 500);

    (this as any).onItemClick = onItemClick;

    autoBind(this);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 15,
      widthSegments: 30,
    });
  }

  createMedias(
    items: GalleryItem[] | undefined,
    bend: number,
    textColor: string,
    borderRadius: number,
    font: string,
  ) {
    const galleryItems = items && items.length > 0 ? items : [];
    this.mediasImages = [...galleryItems, ...galleryItems]; // Duplicate for seamless loop
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        link: data.link,
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.target;
    this.start = "touches" in e ? e.touches[0].clientX : e.clientX;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.screen || !this.viewport) return;
    const nx = (e.clientX / this.screen.width) * 2 - 1;
    const ny = -(e.clientY / this.screen.height) * 2 + 1;
    this.mouseWorld.x = nx * (this.viewport.width / 2);
    this.mouseWorld.y = ny * (this.viewport.height / 2);
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.08);
    this.scroll.target = (this.scroll as any).position + distance;
  }

  onTouchUp() {
    this.isDown = false;

    // Check if it was a drag or just a click
    const distanceDragged = Math.abs((this.scroll as any).position - this.scroll.target);
    if (distanceDragged < 10) {
      const hoveredMedia = this.medias.find((m) => m.isHovered);
      if (hoveredMedia && hoveredMedia.link) {
        if ((this as any).onItemClick) {
          (this as any).onItemClick(this.mediasImages[hoveredMedia.index]);
        } else {
          if (hoveredMedia.link.startsWith("/")) {
            window.location.href = hoveredMedia.link;
          } else {
            window.open(hoveredMedia.link, "_blank");
          }
        }
      }
    }

    this.onCheck();
  }

  onWheel(e: WheelEvent) {
    const delta = e.deltaY;
    this.scroll.target += delta * 0.025 * this.scrollSpeed;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport }),
      );
    }
  }

  update() {
    this.scroll.target += this.speed;
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease,
    );

    this.direction = this.scroll.current > this.scroll.last ? "right" : "left";

    // On mobile, ensure we have a focal card
    const isMobile = this.screen.width < 768;

    if (this.medias) {
      this.medias.forEach((media) => {
        media.update(this.scroll, this.direction, this.mouseWorld, isMobile);
      });
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize;
    this.boundOnWheel = this.onWheel;
    this.boundOnTouchDown = this.onTouchDown;
    this.boundOnTouchMove = this.onTouchMove;
    this.boundOnTouchUp = this.onTouchUp;
    this.boundOnMouseMove = this.onMouseMove;

    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("mousewheel", this.boundOnWheel as EventListener);
    window.addEventListener("wheel", this.boundOnWheel as EventListener);
    window.addEventListener("mousemove", this.boundOnMouseMove);
    this.container.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    this.container.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("mousewheel", this.boundOnWheel as EventListener);
    window.removeEventListener("wheel", this.boundOnWheel as EventListener);
    window.removeEventListener("mousemove", this.boundOnMouseMove);
    this.container.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    this.container.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);

    if (this.renderer && this.renderer.gl) {
      if (this.renderer.gl.canvas.parentNode) {
        this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
      }
      const ext = this.renderer.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
  }
}

/* --------------------------------
* React Component
----------------------------------- */
const CircularGallery = ({
  items,
  bend = 3,
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.025,
  className,
  fontClassName,
  onItemClick,
  ...props
}: CircularGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get computed styles for theme-adaptive text
    const computedStyle = getComputedStyle(containerRef.current);
    const computedColor = computedStyle.color || "hsl(var(--foreground))";
    const computedFontWeight = computedStyle.fontWeight || "bold";
    const computedFontSize = computedStyle.fontSize || "30px";
    const computedFontFamily = computedStyle.fontFamily;

    const computedFont = `${computedFontWeight} ${computedFontSize} ${computedFontFamily}`;

    // Adaptive scroll settings for mobile to prevent "fast motion" on enter
    const isMobile = window.innerWidth < 768;
    const adaptiveSpeed = isMobile ? scrollSpeed * 0.4 : scrollSpeed;
    const adaptiveEase = isMobile ? scrollEase * 0.5 : scrollEase;

    const app = new App(containerRef.current, {
      items,
      bend,
      textColor: computedColor,
      borderRadius,
      font: computedFont,
      scrollSpeed: adaptiveSpeed,
      scrollEase: adaptiveEase,
      onItemClick,
    });

    return () => {
      app.destroy();
    };
  }, [items, bend, borderRadius, scrollSpeed, scrollEase, fontClassName]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden cursor-grab active:cursor-grabbing",
        // Apply theme-aware defaults for getComputedStyle to read
        "text-foreground font-medium text-[70px] tracking-tight",
        fontClassName,
        className,
      )}
      {...props}
    />
  );
};

export { CircularGallery };

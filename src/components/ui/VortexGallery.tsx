"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import normalizeWheel from "normalize-wheel";
import GUI from "lil-gui";

// --- Shaders ---
const vertexShader = `
#define PI 3.14159265359

attribute float aAngle;
attribute float aHeight;
attribute float aRadius;
attribute float aAspectRatio;
attribute float aSpeed;
attribute vec4 aTextureCoords;
attribute vec2 aImageRes;

varying vec4 vTextureCoords;
varying vec2 vUv;
varying float vAspectRatio;

uniform float uMaxZ;
uniform float uZrange;
uniform float uTime;
uniform float uScrollY;
uniform float uSpeedY;
uniform float uDirection;

vec4 getQuaternionFromAxisAngle(vec3 axis, float angle) {
    float halfAngle = angle * 0.5;
    return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
}

void main() {
    vec3 scaledPosition = position;
    scaledPosition.y /= aAspectRatio;

    float zPos = aHeight + uScrollY;
    float zRange = uZrange; 
    float minZ = (uMaxZ - uZrange); 
    zPos = mod(zPos - minZ, zRange) + minZ;

    float theta = aAngle + uSpeedY * 0.4 * aSpeed;
    
    vec3 instancePosition = vec3(cos(theta) * aRadius, zPos, sin(theta) * aRadius);
    float angle = atan(instancePosition.x, instancePosition.z);    

    vec4 rotation = getQuaternionFromAxisAngle(vec3(0.0, 1.0, 0.0), angle);

    vec3 finalPosition = scaledPosition +
        2.0 * cross(rotation.xyz, cross(rotation.xyz, scaledPosition) + rotation.w * scaledPosition);

    vec4 modelPosition = modelMatrix * vec4(instancePosition + finalPosition, 1.0);    
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;  

    vUv = uv;
    vTextureCoords = aTextureCoords;
    vAspectRatio = aAspectRatio;
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uAtlas;
varying vec4 vTextureCoords;

void main() {
    float xStart = vTextureCoords.x;
    float xEnd = vTextureCoords.y;
    float yStart = vTextureCoords.z;
    float yEnd = vTextureCoords.w;
    
    vec2 atlasUV = vec2(
        mix(xStart, xEnd, vUv.x),
        mix(yStart, yEnd, vUv.y)
    );
    
    vec4 color = texture2D(uAtlas, atlasUV);
    gl_FragColor = color;
}
`;

const centerVertexShader = `
varying vec2 vUv;

void main() {    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);  
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;  
    vUv = uv;    
}
`;

const centerFragmentShader = `
varying vec2 vUv;
uniform sampler2D uAtlas;
uniform vec4 uTextureCoords;
uniform float uZoom;

void main() {
    float xStart = uTextureCoords.x;
    float xEnd = uTextureCoords.y;
    float yStart = uTextureCoords.z;
    float yEnd = uTextureCoords.w;
    
    vec2 zoomedUv = clamp((vUv - 0.5) / uZoom + 0.5, 0.0, 1.0);
    
    vec2 atlasUV = vec2(
        mix(xStart, xEnd, zoomedUv.x),
        mix(yStart, yEnd, zoomedUv.y)
    );
    
    vec4 color = texture2D(uAtlas, atlasUV);
    gl_FragColor = color;
}
`;

// --- Interface ---
interface ImageInfo {
  width: number;
  height: number;
  aspectRatio: number;
  uvs: {
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
  };
}

export const VortexGallery: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Prevent scrolling on the page when the gallery is active
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // --- SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2(-9999, -9999);
    const raycaster = new THREE.Raycaster();
    const scrollY = {
      speedTarget: 0,
      speedCurrent: 0,
      target: 0,
      current: 0,
      direction: 1,
      lastDirection: 1,
    };

    let atlasTexture: THREE.Texture | null = null;
    let imageInfos: ImageInfo[] = [];
    let instancedMaterial: THREE.ShaderMaterial | null = null;
    let centerMaterial: THREE.ShaderMaterial | null = null;
    let textureIndex = 0;

    const RADIUS = 6;
    const HEIGHT = 120;
    const COUNT = 600;

    // --- UTILS ---
    const getSizes = () => {
      const fov = camera.fov * (Math.PI / 180);
      const height = camera.position.z * Math.tan(fov / 2) * 2;
      const width = height * camera.aspect;
      return { width, height };
    };

    // --- ASSETS ---
    const loadTextureAtlas = async () => {
      const imagePaths = [
        "/frames/512/p1.jpg", "/frames/512/p2.jpg", "/frames/512/p3.jpg",
        "/frames/512/p4.jpg", "/frames/512/p5.jpg", "/frames/512/p6.jpg",
        "/frames/512/p7.jpg", "/frames/512/p8.jpg", "/frames/512/p9.jpg",
        "/frames/512/p10.jpg", "/frames/512/p11.jpg", "/frames/512/p12.jpg",
        "/frames/512/p13.jpg", "/frames/512/p14.jpg", "/frames/512/p15.jpg",
        "/frames/512/p16.jpg", "/frames/512/p17.jpg", "/frames/512/p18.jpg",
        "/frames/512/p19.jpg", "/frames/512/p20.jpg"
      ];

      const images = (await Promise.all(
        imagePaths.map((path) => {
          return new Promise<HTMLImageElement | null>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = path;
          });
        })
      )).filter((img): img is HTMLImageElement => img !== null);

      if (images.length === 0) {
        console.warn("VortexGallery: No images loaded.");
        return;
      }

      const atlasWidth = Math.max(...images.map((img) => img.width));
      let totalHeight = images.reduce((acc, img) => acc + img.height, 0);

      const canvas = document.createElement("canvas");
      canvas.width = atlasWidth;
      canvas.height = totalHeight;
      const ctx = canvas.getContext("2d")!;

      let currentY = 0;
      imageInfos = images.map((img) => {
        const aspectRatio = img.width / img.height;
        ctx.drawImage(img, 0, currentY);

        // In UV space, Y=0 is the bottom and Y=1 is the top.
        // currentY is from the top in Canvas space.
        const yTop = 1.0 - currentY / totalHeight;
        const yBottom = 1.0 - (currentY + img.height) / totalHeight;

        const info = {
          width: img.width,
          height: img.height,
          aspectRatio,
          uvs: {
            xStart: 0,
            xEnd: img.width / atlasWidth,
            yStart: yBottom, // UV Bottom
            yEnd: yTop,      // UV Top
          },
        };
        currentY += img.height;
        return info;
      });

      atlasTexture = new THREE.Texture(canvas);
      atlasTexture.needsUpdate = true;
    };

    const createInstancedMesh = () => {
      // SUBDIVIDED GEOMETRY for liquid ripples
      const geometry = new THREE.BoxGeometry(1.5, 1.5, 0.075, 32, 32, 1);
      instancedMaterial = new THREE.ShaderMaterial({
        vertexShader: `
#define PI 3.14159265359

attribute float aAngle;
attribute float aHeight;
attribute float aRadius;
attribute float aAspectRatio;
attribute float aSpeed;
attribute vec4 aTextureCoords;
attribute vec2 aImageRes;

varying vec4 vTextureCoords;
varying vec2 vUv;
varying float vAspectRatio;

uniform float uMaxZ;
uniform float uZrange;
uniform float uTime;
uniform float uScrollY;
uniform float uSpeedY;
uniform float uDirection;

vec4 getQuaternionFromAxisAngle(vec3 axis, float angle) {
    float halfAngle = angle * 0.5;
    return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
}

void main() {
    vec3 scaledPosition = position;
    scaledPosition.y /= aAspectRatio;

    // --- LIQUID EFFECT (Balanced) ---
    float speedFactor = abs(uSpeedY) * 0.4 + 0.1;
    float ripple = (sin(scaledPosition.x * 2.0 + uTime * 0.8) + cos(scaledPosition.y * 2.0 + uTime * 0.8)) * 0.006 * speedFactor;
    scaledPosition.z += ripple;

    float zPos = aHeight + uScrollY;
    float zRange = uZrange; 
    float minZ = (uMaxZ - uZrange); 
    zPos = mod(zPos - minZ, zRange) + minZ;

    float theta = aAngle + uSpeedY * 0.4 * aSpeed;
    
    vec3 instancePosition = vec3(cos(theta) * aRadius, zPos, sin(theta) * aRadius);
    float angle = atan(instancePosition.x, instancePosition.z);    

    vec4 rotation = getQuaternionFromAxisAngle(vec3(0.0, 1.0, 0.0), angle);

    vec3 finalPosition = scaledPosition +
        2.0 * cross(rotation.xyz, cross(rotation.xyz, scaledPosition) + rotation.w * scaledPosition);

    vec4 modelPosition = modelMatrix * vec4(instancePosition + finalPosition, 1.0);    
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;  

    vUv = uv;
    vTextureCoords = aTextureCoords;
    vAspectRatio = aAspectRatio;
}
        `,
        fragmentShader,
        precision: "highp",
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uAtlas: { value: atlasTexture },
          uScrollY: { value: 0 },
          uZrange: { value: HEIGHT },
          uMaxZ: { value: HEIGHT * 0.5 },
          uSpeedY: { value: 0 },
          uDirection: { value: scrollY.direction },
        },
        side: THREE.DoubleSide,
      });

      const instancedMesh = new THREE.InstancedMesh(geometry, instancedMaterial, COUNT);
      instancedMesh.name = "vortex";

      const aAngles = new Float32Array(COUNT);
      const aHeights = new Float32Array(COUNT);
      const aRadiuses = new Float32Array(COUNT);
      const aAspectRatios = new Float32Array(COUNT);
      const aSpeeds = new Float32Array(COUNT);
      const aImagesRes = new Float32Array(COUNT * 2);
      const aTextureCoords = new Float32Array(COUNT * 4);

      const CIRCLE_COUNT = HEIGHT / 3;
      const CIRCLE_HEIGHT = HEIGHT / CIRCLE_COUNT;
      const speeds = new Float32Array(CIRCLE_COUNT);
      for (let j = 0; j < CIRCLE_COUNT; j++) speeds[j] = Math.random() * 0.2 + 0.8;

      for (let i = 0; i < COUNT; i++) {
        const angle = (i / COUNT) * Math.PI * 2;
        const imageIndex = Math.floor(Math.random() * imageInfos.length);

        aTextureCoords[i * 4 + 0] = imageInfos[imageIndex].uvs.xStart;
        aTextureCoords[i * 4 + 1] = imageInfos[imageIndex].uvs.xEnd;
        aTextureCoords[i * 4 + 2] = imageInfos[imageIndex].uvs.yStart;
        aTextureCoords[i * 4 + 3] = imageInfos[imageIndex].uvs.yEnd;

        aImagesRes[i * 2 + 0] = imageInfos[imageIndex].width;
        aImagesRes[i * 2 + 1] = imageInfos[imageIndex].height;

        aAngles[i] = angle;
        aHeights[i] = (i % CIRCLE_COUNT) * CIRCLE_HEIGHT - HEIGHT / 2;
        aRadiuses[i] = RADIUS;
        aAspectRatios[i] = imageInfos[imageIndex].aspectRatio;
        aSpeeds[i] = speeds[i % CIRCLE_COUNT];
      }

      instancedMesh.geometry.setAttribute("aAngle", new THREE.InstancedBufferAttribute(aAngles, 1));
      instancedMesh.geometry.setAttribute("aHeight", new THREE.InstancedBufferAttribute(aHeights, 1));
      instancedMesh.geometry.setAttribute("aRadius", new THREE.InstancedBufferAttribute(aRadiuses, 1));
      instancedMesh.geometry.setAttribute("aAspectRatio", new THREE.InstancedBufferAttribute(aAspectRatios, 1));
      instancedMesh.geometry.setAttribute("aSpeed", new THREE.InstancedBufferAttribute(aSpeeds, 1));
      instancedMesh.geometry.setAttribute("aTextureCoords", new THREE.InstancedBufferAttribute(aTextureCoords, 4));
      instancedMesh.geometry.setAttribute("aImageRes", new THREE.InstancedBufferAttribute(aImagesRes, 2));

      scene.add(instancedMesh);
    };

    const createCenteredMesh = () => {
      const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
      centerMaterial = new THREE.ShaderMaterial({
        vertexShader: `
varying vec2 vUv;
uniform float uTime;
uniform float uSpeed;

void main() {    
    vec3 pos = position;

    // --- LIQUID EFFECT (Balanced) ---
    float speedFactor = uSpeed * 0.4 + 0.1;
    float ripple = (sin(pos.x * 2.5 + uTime * 1.0) + cos(pos.y * 2.5 + uTime * 1.0)) * 0.006 * speedFactor;
    pos.z += ripple;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);  
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;  
    vUv = uv;    
}
        `,
        fragmentShader: centerFragmentShader,
        uniforms: {
          uAtlas: { value: atlasTexture },
          uTime: { value: 0 },
          uSpeed: { value: 0 },
          uZoom: { value: 1.0 },
          uTextureCoords: {
            value: new THREE.Vector4(
              imageInfos[textureIndex].uvs.xStart,
              imageInfos[textureIndex].uvs.xEnd,
              imageInfos[textureIndex].uvs.yStart,
              imageInfos[textureIndex].uvs.yEnd
            ),
          },
        },
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, centerMaterial);
      
      // Set initial scale to match the first texture's aspect ratio
      if (imageInfos[textureIndex]) {
        const info = imageInfos[textureIndex];
        const maxW = 2.5;
        const maxH = 2.9;
        let targetW = maxH * info.aspectRatio;
        let targetH = maxH;
        if (targetW > maxW) {
          targetW = maxW;
          targetH = maxW / info.aspectRatio;
        }
        mesh.scale.set(targetW, targetH, 1);
      }
      
      mesh.name = "center";
      scene.add(mesh);
    };

    const createStarfield = () => {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 6000;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i += 3) {
        // Distribute stars in a large sphere
        const r = 100 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        // Random star colors (stark white to cool blue)
        const luminance = 0.5 + Math.random() * 0.5;
        colors[i] = luminance; // R
        colors[i + 1] = luminance; // G
        colors[i + 2] = luminance + Math.random() * 0.2; // B
      }

      starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const starMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      });

      const stars = new THREE.Points(starGeometry, starMaterial);
      stars.name = "starfield";
      scene.add(stars);
    };

    // --- DRAG INTERACTION ---
    const drag = {
      isDragging: false,
      isImageDrag: false,
      lastX: 0,
      lastY: 0,
      targetYRotation: 0,
      currentYRotation: 0,
      baseZoom: 1.0,
      currentZoom: 1.0,
    };

    // --- EVENTS ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const onWheel = (event: WheelEvent) => {
      const normalized = normalizeWheel(event);
      const sizes = getSizes();
      const delta = event.deltaY;
      let value = Math.sign(event.deltaY);

      if (delta === 0) {
        value = scrollY.lastDirection;
      } else {
        scrollY.lastDirection = value;
      }

      scrollY.direction = value;
      scrollY.speedTarget += (normalized.pixelY * sizes.height) / window.innerHeight;
      scrollY.target += (normalized.pixelY * sizes.height) / window.innerHeight;
    };

    const checkImageHover = (mouseX: number, mouseY: number) => {
      raycaster.setFromCamera({ x: mouseX, y: mouseY } as THREE.Vector2, camera);
      const center = scene.getObjectByName("center");
      if (center) {
        return raycaster.intersectObject(center).length > 0;
      }
      return false;
    };

    const onMouseDown = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      drag.isImageDrag = checkImageHover(mouse.x, mouse.y);
      drag.isDragging = true;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (drag.isDragging) {
        const deltaX = event.clientX - drag.lastX;
        const deltaY = event.clientY - drag.lastY;
        
        if (drag.isImageDrag) {
          drag.baseZoom -= deltaY * 0.01;
          drag.baseZoom = THREE.MathUtils.clamp(drag.baseZoom, 1.0, 4.0);
        } else {
          drag.targetYRotation += deltaX * 0.005;
        }
        
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
      }
    };

    const onMouseUp = () => {
      drag.isDragging = false;
      drag.isImageDrag = false;
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      drag.isImageDrag = checkImageHover(mouse.x, mouse.y);
      drag.isDragging = true;
      drag.lastX = touch.clientX;
      drag.lastY = touch.clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

      if (drag.isDragging) {
        const deltaX = touch.clientX - drag.lastX;
        const deltaY = touch.clientY - drag.lastY;
        
        if (drag.isImageDrag) {
          drag.baseZoom -= deltaY * 0.01;
          drag.baseZoom = THREE.MathUtils.clamp(drag.baseZoom, 1.0, 4.0);
        } else {
          drag.targetYRotation += deltaX * 0.005;
        }

        drag.lastX = touch.clientX;
        drag.lastY = touch.clientY;
      }
    };

    const onTouchEnd = () => {
      drag.isDragging = false;
      drag.isImageDrag = false;
    };



    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onWheel);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);


    // --- INIT ---
    loadTextureAtlas().then(() => {
      if (imageInfos.length > 0) {
        createInstancedMesh();
        createCenteredMesh();
      }
      createStarfield();
    });

    // --- DEBUG ---
    const debug = GUI ? new GUI() : null;
    if (debug) debug.hide();

    // --- RENDER LOOP ---
    let frameId: number;
    const render = () => {
      const time = clock.getElapsedTime();

      if (instancedMaterial && centerMaterial) {
        instancedMaterial.uniforms.uTime.value = time;
        centerMaterial.uniforms.uTime.value = time;

        const sizes = getSizes();
        scrollY.target += 0.015 * scrollY.direction;
        scrollY.speedTarget += 0.015 * scrollY.direction;

        let currentTextureIndex = Math.abs(
          Math.floor(scrollY.speedTarget) % imageInfos.length
        );

        // Reset zoom if scrolling to a new image
        if (textureIndex !== currentTextureIndex) {
          drag.baseZoom = 1.0;
          textureIndex = currentTextureIndex;
        }

        if (imageInfos[textureIndex]) {
          const info = imageInfos[textureIndex];
          centerMaterial.uniforms.uTextureCoords.value.set(
            info.uvs.xStart,
            info.uvs.xEnd,
            info.uvs.yStart,
            info.uvs.yEnd
          );

          const centerMesh = scene.getObjectByName("center") as THREE.Mesh;
          let isHovered = false;

          if (centerMesh) {
            // Check hover status
            raycaster.setFromCamera(mouse, camera);
            isHovered = raycaster.intersectObject(centerMesh).length > 0;

            document.body.style.cursor = isHovered 
              ? (drag.isDragging ? 'ns-resize' : 'zoom-in') 
              : (drag.isDragging ? 'ew-resize' : 'default');

            const maxW = 2.5;
            const maxH = 2.9;
            let targetW = maxH * info.aspectRatio;
            let targetH = maxH;
            
            if (targetW > maxW) {
              targetW = maxW;
              targetH = maxW / info.aspectRatio;
            }

            // Pop out slightly when hovered
            const hoverScale = (isHovered && !drag.isImageDrag) ? 1.03 : 1.0;
            targetW *= hoverScale;
            targetH *= hoverScale;

            centerMesh.scale.x = gsap.utils.interpolate(centerMesh.scale.x, targetW, 0.08);
            centerMesh.scale.y = gsap.utils.interpolate(centerMesh.scale.y, targetH, 0.08);
          }

          // Smoothly animate the texture zoom
          const targetZoomVal = drag.baseZoom + (isHovered && !drag.isImageDrag ? 0.05 : 0.0);
          drag.currentZoom = gsap.utils.interpolate(drag.currentZoom, targetZoomVal, 0.1);
          centerMaterial.uniforms.uZoom.value = drag.currentZoom;
        }

        scrollY.current = gsap.utils.interpolate(scrollY.current, scrollY.target, 0.1);
        scrollY.speedCurrent = gsap.utils.interpolate(scrollY.speedCurrent, scrollY.speedTarget, 0.1);

        instancedMaterial.uniforms.uScrollY.value = scrollY.current;
        instancedMaterial.uniforms.uSpeedY.value = scrollY.speedCurrent;
        instancedMaterial.uniforms.uDirection.value = scrollY.direction;
        centerMaterial.uniforms.uSpeed.value = Math.abs(scrollY.speedCurrent);

        // Apply Drag Rotation
        drag.currentYRotation = gsap.utils.interpolate(drag.currentYRotation, drag.targetYRotation, 0.05);
        const vortex = scene.getObjectByName("vortex") as THREE.InstancedMesh;
        const center = scene.getObjectByName("center") as THREE.Mesh;
        const starfield = scene.getObjectByName("starfield") as THREE.Points;

        if (vortex) vortex.rotation.y = drag.currentYRotation;
        if (center) center.rotation.y = drag.currentYRotation;
        // Parallax rotation for background stars
        if (starfield) starfield.rotation.y = drag.currentYRotation * 0.4;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      cancelAnimationFrame(frameId);
      if (debug) debug.destroy();
      renderer.dispose();
      scene.clear();
      // Restore scrolling
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#030303] overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Visual Grain/Noise Overlay for premium feel */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.035] mix-blend-overlay" />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

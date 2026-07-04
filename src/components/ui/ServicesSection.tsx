"use client";
import React, { useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES_TAGS = [
  { label: "Design System",     icon: "solar:widget-2-bold-duotone",              iconColor: "bg-[#FF6B35]" },
  { label: "Design Research",   icon: "solar:minimalistic-magnifer-bold-duotone", iconColor: "bg-[#00A8E8]" },
  { label: "Experience Design", icon: "solar:heart-bold-duotone",                 iconColor: "bg-[#EF476F]" },
  { label: "Prototyping",       icon: "solar:screencast-bold-duotone",            iconColor: "bg-[#FF3366]" },
  { label: "Vibe Coding",       icon: "solar:code-bold-duotone",                  iconColor: "bg-[#06D6A0]" },
  { label: "Design Mgmt",       icon: "solar:settings-bold-duotone",              iconColor: "bg-[#FFD166]" },
];

const WORDS = [
  "I", "DESIGN", "DIGITAL", "EXPERIENCES", "THAT",
  "BALANCE", "USER", "NEEDS", "AND", "PRODUCT",
  "GOALS,", "CREATING", "VALUE", "FOR", "BOTH.",
];

const PHYSICS_HEIGHT = 420;

export default function ServicesSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const physicsBoxRef = useRef<HTMLDivElement>(null);
  const pillRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef     = useRef<any>(null);
  const animFrameRef  = useRef<number>(0);
  const isReadyRef    = useRef(false); // physics world is built
  const droppedRef    = useRef<boolean[]>(Array(SERVICES_TAGS.length).fill(false));
  const bodiesRef     = useRef<any[]>([]);
  const cursorXRef    = useRef<number | null>(null); // cursor X relative to physics box

  useEffect(() => {
    if (typeof window === "undefined") return;

    let matterModule: any = null;

    // ── Word reveal ─────────────────────────────────────────────────────────────
    const wordTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      end: "center 40%",
      scrub: 1.2,
      onUpdate: (self) => {
        const words = document.querySelectorAll<HTMLElement>(".srv-word");
        words.forEach((el, i) => {
          const p = Math.min(1, Math.max(0, self.progress * words.length - i));
          el.style.opacity = String(0.1 + 0.9 * p);
        });
      },
    });

    // ── Build physics world once section enters view ─────────────────────────────
    const buildTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      once: true,
      onEnter: async () => {
        matterModule = await import("matter-js");
        const { Engine, Runner, Bodies, World } = matterModule;

        const box = physicsBoxRef.current;
        if (!box) return;

        const W = box.offsetWidth;
        const H = PHYSICS_HEIGHT;
        const THICK = 60;

        const engine = Engine.create({ gravity: { x: 0, y: 3 } });
        engineRef.current = engine;

        // static boundaries
        const floor = Bodies.rectangle(W / 2,        H + THICK / 2,  W + 400, THICK, { isStatic: true, friction: 0.9 });
        const wallL = Bodies.rectangle(-THICK / 2,   H / 2,          THICK,   H * 3, { isStatic: true });
        const wallR = Bodies.rectangle(W + THICK / 2, H / 2,         THICK,   H * 3, { isStatic: true });
        World.add(engine.world, [floor, wallL, wallR]);

        const runner = Runner.create();

        // RAF: step engine + sync DOM bodies
        const loop = () => {
          Runner.tick(runner, engine, 1000 / 60);

          bodiesRef.current.forEach((body, i) => {
            const el = pillRefs.current[i];
            if (!el || !body) return;
            const { x, y } = body.position;
            const a = body.angle;
            el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px) rotate(${a}rad)`;
            el.style.opacity = "1";
          });

          animFrameRef.current = requestAnimationFrame(loop);
        };
        animFrameRef.current = requestAnimationFrame(loop);

        isReadyRef.current = true;
      },
    });

    // ── Cursor tracking + pill drop ──────────────────────────────────────────────
    let nextDrop = 0; // index of the next pill to drop

    const dropPillAt = (cursorX: number) => {
      if (!isReadyRef.current || !matterModule) return;
      if (nextDrop >= SERVICES_TAGS.length) return; // all dropped

      const { Bodies, Body, World } = matterModule;
      const box = physicsBoxRef.current;
      const el  = pillRefs.current[nextDrop];
      if (!box || !el) return;

      const W = box.offsetWidth;
      const pillW = el.offsetWidth  || 180;
      const pillH = el.offsetHeight || 56;

      // Clamp spawn X so pill stays inside walls
      const spawnX = Math.min(Math.max(cursorX, pillW / 2), W - pillW / 2);
      const spawnY = -(pillH + 20);

      const body = Bodies.rectangle(spawnX, spawnY, pillW, pillH, {
        restitution: 0.3,
        friction:    0.6,
        frictionAir: 0.02,
        density:     0.003,
        chamfer:     { radius: pillH / 2 },
        label:       `pill-${nextDrop}`,
      });
      Body.setAngle(body, (Math.random() - 0.5) * 0.5);
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 0 });

      World.add(engineRef.current.world, body);
      bodiesRef.current[nextDrop] = body;
      nextDrop++;
    };

    // Track cursor X inside the physics box
    const onMouseMove = (e: MouseEvent) => {
      const box = physicsBoxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      cursorXRef.current = e.clientX - rect.left;
    };

    // Drop a pill each time cursor moves inside the physics box (with cooldown)
    let lastDropTime = 0;
    const DROP_INTERVAL = 350; // ms between drops

    const onBoxMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastDropTime < DROP_INTERVAL) return;
      lastDropTime = now;
      const box = physicsBoxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      dropPillAt(e.clientX - rect.left);
    };

    const physicsBox = physicsBoxRef.current;
    physicsBox?.addEventListener("mousemove", onBoxMove);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      wordTrigger.kill();
      buildTrigger.kill();
      cancelAnimationFrame(animFrameRef.current);
      physicsBox?.removeEventListener("mousemove", onBoxMove);
      window.removeEventListener("mousemove", onMouseMove);
      if (engineRef.current && matterModule) {
        matterModule.Engine.clear(engineRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pointer-events-auto"
      style={{ paddingTop: "9rem", paddingBottom: "6rem" }}
    >
      <div className="max-w-[85rem] mx-auto px-6 md:px-12 flex flex-col items-center">
        {/* Label */}
        <h2 className="text-[24px] font-semibold font-sans text-white mb-6 text-center">
          What I Do
        </h2>

        {/* Scroll-reveal headline */}
        <h3 className="text-xl sm:text-[1.6rem] md:text-[1.9rem] lg:text-[2.6rem] leading-[1.15] font-medium text-white uppercase flex flex-wrap justify-center gap-x-[0.3em] gap-y-[0.1em] text-center max-w-4xl mx-auto px-4 z-10 py-6 select-none">
          {WORDS.map((w, idx) => (
            <span key={idx} className="srv-word inline-block" style={{ opacity: 0.1 }}>
              {w}
            </span>
          ))}
        </h3>

        {/* Hint */}
        <p className="text-white/30 text-sm mt-4 select-none tracking-wide">
          move your cursor below ↓
        </p>
      </div>

      {/* ── Physics stage ── */}
      <div
        ref={physicsBoxRef}
        className="relative w-full overflow-hidden cursor-none"
        style={{ height: `${PHYSICS_HEIGHT}px`, marginTop: "4rem" }}
      >
        {/* Hidden pill DOM templates — pills start invisible, opacity set to 1 when body is added */}
        {SERVICES_TAGS.map((tag, i) => (
          <div
            key={i}
            ref={(el) => { pillRefs.current[i] = el; }}
            className="absolute top-0 left-0 pointer-events-none"
            style={{ opacity: 0, willChange: "transform", transformOrigin: "top left" }}
          >
            <div className="flex items-center gap-3.5 bg-[#121214]/90 text-white pl-4 pr-8 py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.2)] border border-white/10 select-none whitespace-nowrap">
              <div className={`w-11 h-11 rounded-full ${tag.iconColor} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                <Icon icon={tag.icon} className="text-2xl" />
              </div>
              <span className="font-bold text-base text-[#E5E5E7] tracking-tight">
                {tag.label}
              </span>
            </div>
          </div>
        ))}

        {/* Bottom ground gradient */}
        <div
          className="absolute bottom-0 left-0 w-full pointer-events-none z-10"
          style={{ height: 80, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}
        />
      </div>
    </section>
  );
}

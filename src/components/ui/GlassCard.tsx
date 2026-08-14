"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Tone = "glass" | "solid" | "onBrand";

const TONE: Record<Tone, string> = {
  glass: "glass",
  solid: "border border-white/70 bg-white shadow-float",
  /** For cards sitting on a saturated brand panel. */
  onBrand: "border border-white/20 bg-white/10 backdrop-blur-xl",
};

/**
 * The workhorse surface for this site.
 *
 * Three things happen on hover, all cheap: the card lifts, a radial highlight
 * tracks the pointer (via --mx/--my consumed by the `.spotlight` utility in
 * globals.css), and — when `tilt` is on — it rotates a few degrees toward the
 * cursor in 3D. Rotation is deliberately small; past ~8deg it stops reading as
 * a physical object and starts looking like a bug.
 */
export function GlassCard({
  children,
  className = "",
  tone = "glass",
  tilt = false,
  lift = true,
  cursor = "card",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  tilt?: boolean;
  lift?: boolean;
  /** Value written to data-cursor; pass null to leave the cursor alone. */
  cursor?: string | null;
  /** For anchor-link targets, e.g. a section jumping straight to this card. */
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 220, damping: 20 });
  const springY = useSpring(rotY, { stiffness: 220, damping: 20 });
  const rotateX = useTransform(springX, (v) => `${v}deg`);
  const rotateY = useTransform(springY, (v) => `${v}deg`);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);

    if (tilt && !reduceMotion) {
      rotX.set((0.5 - py) * 8);
      rotY.set((px - 0.5) * 8);
    }
  };

  const onLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  const spotlightTone = tone === "onBrand" ? "spotlight spotlight-invert" : "spotlight";

  return (
    <motion.div
      ref={ref}
      id={id}
      data-cursor={cursor ?? undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={reduceMotion || !lift ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={
        tilt && !reduceMotion
          ? { rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }
          : undefined
      }
      className={`relative isolate overflow-hidden ${spotlightTone} ${TONE[tone]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

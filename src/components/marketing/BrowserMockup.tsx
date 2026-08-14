"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Stylised, abstract representation of a product UI — not a screenshot of real
 * software. It illustrates what the work looks like without implying a
 * finished product exists.
 *
 * As it enters the viewport the panel "unfolds": it starts tipped back in 3D
 * and rotates flat while scaling up, so the hero resolves into focus as you
 * scroll rather than simply appearing.
 */
export function BrowserMockup({
  title = "app.s-tech.dev",
  className = "",
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.35"],
  });

  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });
  const rotateX = useTransform(eased, [0, 1], [16, 0]);
  const scale = useTransform(eased, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.4, 1]);

  return (
    <div ref={ref} className={`[perspective:1600px] ${className}`}>
      <motion.div
        data-cursor="card"
        style={
          reduceMotion
            ? undefined
            : { rotateX, scale, opacity, transformOrigin: "50% 0%", transformStyle: "preserve-3d" }
        }
        className="relative overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_60px_140px_-50px_rgba(23,68,150,0.65)]"
      >
        {/* Rim light along the top edge — sells the glass. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl"
        />

        <div className="relative flex items-center gap-2 border-b border-ink/[0.07] bg-sky-4/50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-2" />
          <span className="h-2.5 w-2.5 rounded-full bg-sky-2" />
          <span className="h-2.5 w-2.5 rounded-full bg-sky-2" />
          <span className="ml-3 truncate font-mono text-[11px] text-ink-soft">{title}</span>
        </div>

        <div className="relative bg-gradient-to-b from-white to-sky-5 p-4 sm:p-6">{children}</div>
      </motion.div>
    </div>
  );
}

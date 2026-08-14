"use client";

import { useScroll, useSpring, useTransform, useReducedMotion, motion } from "motion/react";
import { Cloud } from "./Cloud";

/**
 * The atmosphere the entire site sits inside.
 *
 * Fixed to the viewport and pinned behind everything (-z-10). Three cloud
 * bands drift upward at different rates as the page scrolls, which reads as
 * depth without the cost of a real parallax scene: only `transform` changes,
 * and each band is a single composited layer.
 */
export function SkyBackground() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Softening the raw progress keeps the drift from feeling mechanically
  // locked to the scrollbar, especially with Lenis easing on top.
  const progress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    restDelta: 0.0008,
  });

  const farY = useTransform(progress, [0, 1], ["0%", "-22%"]);
  const midY = useTransform(progress, [0, 1], ["0%", "-55%"]);
  const nearY = useTransform(progress, [0, 1], ["0%", "-95%"]);
  const hazeOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.5, 0.85]);

  const still = reduceMotion ? { y: undefined } : undefined;

  return (
    <div
      aria-hidden
      className="bg-grain pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base atmosphere: saturated at altitude, hazing out toward the horizon. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--color-sky-1) 0%, var(--color-sky-2) 26%, var(--color-sky-3) 52%, var(--color-sky-4) 74%, var(--color-sky-5) 100%)",
        }}
      />

      {/* Sun bloom, upper right. Warms the blue just enough to look like light. */}
      <div
        className="absolute -right-40 -top-56 h-[46rem] w-[46rem] rounded-full opacity-70 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(214,236,255,0.6) 45%, transparent 70%)",
        }}
      />

      {/* Far band — small, pale, barely moves. */}
      <motion.div className="absolute inset-0" style={still ?? { y: farY }}>
        <div className="absolute inset-0 [animation:cloud-drift_150s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
          <Cloud className="left-[4%] top-[6%] h-24 w-64" opacity={0.5} blur={16} />
          <Cloud className="right-[10%] top-[16%] h-20 w-56" opacity={0.42} blur={18} />
          <Cloud className="left-[38%] top-[30%] h-16 w-48" opacity={0.34} blur={20} />
          <Cloud className="right-[30%] top-[62%] h-20 w-56" opacity={0.3} blur={20} />
        </div>
      </motion.div>

      {/* Mid band — the readable, recognisable clouds. */}
      <motion.div className="absolute inset-0" style={still ?? { y: midY }}>
        <div className="absolute inset-0 [animation:cloud-drift_110s_ease-in-out_infinite_alternate-reverse] motion-reduce:animate-none">
          <Cloud className="-left-[6%] top-[22%] h-44 w-[30rem]" opacity={0.78} blur={10} />
          <Cloud className="right-[-4%] top-[44%] h-40 w-[26rem]" opacity={0.7} blur={12} />
          <Cloud className="left-[26%] top-[76%] h-36 w-[24rem]" opacity={0.6} blur={14} />
        </div>
      </motion.div>

      {/* Near band — large, soft, fastest. Sells the sense of descent. */}
      <motion.div className="absolute inset-0" style={still ?? { y: nearY }}>
        <div className="absolute inset-0 [animation:cloud-drift_80s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
          <Cloud className="left-[-14%] top-[58%] h-64 w-[44rem]" opacity={0.85} blur={8} />
          <Cloud className="right-[-16%] top-[88%] h-72 w-[48rem]" opacity={0.8} blur={10} />
        </div>
      </motion.div>

      {/* Horizon haze — thickens as you descend, so lower sections read calmer. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          opacity: reduceMotion ? 0.5 : hazeOpacity,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(246,250,255,0.75) 55%, rgba(246,250,255,0.95) 100%)",
        }}
      />
    </div>
  );
}

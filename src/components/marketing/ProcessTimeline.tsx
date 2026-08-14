"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import {
  LIT_CARD_VARIANTS,
  LIT_BADGE_VARIANTS,
  LIT_BADGE_GLOW,
  LIT_CARD_STATIC_STYLE,
  LIT_BADGE_STATIC_STYLE,
} from "@/components/motion/litVariants";

const STEPS = [
  {
    number: "01",
    title: "Define",
    description: "Target market, required fields, sources, and output format.",
    detail: "You confirm the spec before any research starts.",
  },
  {
    number: "02",
    title: "Design",
    description: "A workflow suited to the project, the sources, and your tools.",
    detail: "Rules and checks are agreed up front, not invented mid-project.",
  },
  {
    number: "03",
    title: "Research",
    description: "Information collected consistently, from approved sources.",
    detail: "The same criteria are applied to every single record.",
  },
  {
    number: "04",
    title: "Verify",
    description: "Details cross-checked, formatting normalised, duplicates removed.",
    detail: "Anything that can't be confirmed is flagged, never guessed.",
  },
  {
    number: "05",
    title: "Deliver",
    description: "Organised output in the format your workflow already uses.",
    detail: "Spreadsheet, CRM-ready import, or your own template.",
  },
  {
    number: "06",
    title: "Improve",
    description: "Criteria and fields refined from what you send back.",
    detail: "Your feedback changes how the next batch is built.",
  },
];

/**
 * The six-step workflow.
 *
 * Each card is triggered by its *own* `whileInView`, so every one of the six
 * reliably plays its entrance and lights up once it's actually on screen. An
 * earlier version tied every card's lit/unlit state to one shared
 * scroll-progress spring; on a short section that value could settle before
 * the reader reached the later cards, leaving them looking permanently
 * inactive. The thin rail above is still driven continuously by scroll — that
 * one genuinely is a single running total, so it's the one thing left on a
 * shared motion value.
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.7"],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative mt-14">
      <div aria-hidden className="h-px w-full overflow-hidden bg-white/20">
        <motion.div
          className="h-full w-full origin-left bg-white"
          style={reduceMotion ? { scaleX: 1 } : { scaleX: fill }}
        />
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, i) => (
          <motion.li
            key={step.number}
            initial={reduceMotion ? undefined : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: false, amount: 0.35 }}
            variants={reduceMotion ? undefined : LIT_CARD_VARIANTS}
            transition={{ delay: (i % 3) * 0.08 }}
            className="group relative overflow-hidden rounded-3xl border p-6 backdrop-blur-md"
            style={reduceMotion ? LIT_CARD_STATIC_STYLE : undefined}
          >
            <div className="flex items-center gap-3">
              <motion.span
                variants={reduceMotion ? undefined : LIT_BADGE_VARIANTS}
                transition={{ delay: (i % 3) * 0.08 }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${LIT_BADGE_GLOW}`}
                style={reduceMotion ? LIT_BADGE_STATIC_STYLE : undefined}
              >
                {step.number}
              </motion.span>
              <p className="text-base font-semibold tracking-tight text-invert">
                {step.title}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-invert-muted">{step.description}</p>

            <p className="mt-4 flex items-start gap-2 border-t border-white/15 pt-4 text-xs leading-5 text-invert-muted">
              <ArrowRight
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden
              />
              {step.detail}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

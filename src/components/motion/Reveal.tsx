"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Pre-built motion components, looked up by tag name.
 *
 * Deliberately a static map rather than `motion.create(tag)` at render time:
 * that helper mints a fresh component identity on every render, which would
 * unmount and remount the subtree each pass.
 */
const TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  span: motion.span,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  article: motion.article,
} as const;

export type MotionTag = keyof typeof TAGS;

const EASE = [0.16, 1, 0.3, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered entrance. Content rises into place with a little blur
 * lifting off, so it reads as "coming into focus" rather than a flat fade.
 * Replays every time a section leaves and re-enters the viewport (not just
 * the first time), and becomes a no-op under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.8,
  as = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  direction?: Direction;
  duration?: number;
  as?: MotionTag;
  /** Fraction of the element that must be visible before it fires. */
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = TAGS[as];
  const { x, y } = OFFSET[direction];

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/**
 * Parent that walks its children in one after another. Pair with
 * <StaggerItem>, which inherits its timing from here.
 */
export function Stagger({
  children,
  className,
  delay = 0,
  step = 0.08,
  as = "div",
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  step?: number;
  as?: MotionTag;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = TAGS[as];

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: step, delayChildren: delay } },
  };

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount }}
    >
      {children}
    </Tag>
  );
}

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = TAGS[as];

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className} variants={ITEM_VARIANTS}>
      {children}
    </Tag>
  );
}

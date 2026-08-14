"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

export type HeadingSegment = {
  text: string;
  /** Renders in the Instrument Serif italic brand accent. */
  accent?: boolean;
};

const CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

/**
 * 175%, not 110%: the word has to start fully below CLIP_PAD as well as below
 * its own box, otherwise the ascenders peek into the padded strip before the
 * reveal plays. Headings here run as tight as leading-[0.98], so the box is
 * only ~0.98em and the padding is a large share of the travel.
 */
const WORD: Variants = {
  hidden: { y: "175%" },
  show: { y: "0%", transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Room left below each word's line box for descenders. Instrument Serif's
 * italic g/y swing well past the box bottom that the tight heading
 * line-heights produce, and 0.32em still sheared the tail off the g in
 * "growth workflow". Padding and the matching negative margin cancel out, so
 * raising this costs no layout height, only clip height.
 */
const CLIP_PAD = "0.45em";

/**
 * Headline that wipes in word by word from behind a mask.
 *
 * Each word sits in its own `overflow-hidden` clip; the inner span starts
 * pushed below the clip and slides up. The clip is padded and pulled back by
 * an equal amount so descenders (g, y, p) aren't sheared off.
 *
 * The full text is exposed to assistive tech as one string via aria-label,
 * so screen readers never hear it word-fragmented.
 */
export function AnimatedHeading({
  segments,
  className = "",
  accentClassName = "font-accent italic text-brand",
  as: Tag = "h2",
  delay = 0,
}: {
  segments: HeadingSegment[];
  className?: string;
  accentClassName?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const label = segments.map((s) => s.text).join(" ");

  if (reduceMotion) {
    return (
      <Tag className={className}>
        {segments.map((segment, i) => (
          <span key={i} className={segment.accent ? accentClassName : undefined}>
            {segment.text}
            {i < segments.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className} aria-label={label}>
      <motion.span
        aria-hidden
        className="inline"
        variants={CONTAINER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.5 }}
        transition={{ delayChildren: delay }}
      >
        {segments.flatMap((segment, si) =>
          segment.text.split(" ").map((word, wi) => (
            <span
              key={`${si}-${wi}`}
              className="inline-flex overflow-hidden align-bottom"
              style={{ paddingBottom: CLIP_PAD, marginBottom: `-${CLIP_PAD}` }}
            >
              <motion.span
                variants={WORD}
                className={segment.accent ? accentClassName : undefined}
              >
                {word}
              </motion.span>
              <span className="inline-block">&nbsp;</span>
            </span>
          ))
        )}
      </motion.span>
    </Tag>
  );
}

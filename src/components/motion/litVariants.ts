import type { Variants } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Shared "activation" look for cards sitting on a saturated brand-blue
 * panel — used by the process-timeline steps and by anything else on those
 * panels that should feel like part of the same system rather than a
 * one-off lookalike.
 *
 * Card fades/rises and its border+fill "activate" to a lit look.
 */
export const LIT_CARD_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.15)",
  },
  visible: {
    opacity: 1,
    y: 0,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.35)",
    transition: { duration: 0.55, ease: EASE },
  },
};

/**
 * Icon badge pops and swaps to solid white + brand a beat after the card
 * lands. Framer Motion interpolates these colours frame-by-frame, so they
 * need to be literal, parseable values — a CSS custom property like
 * var(--color-brand) can't be animated the same way "transparent" can't be.
 */
export const LIT_BADGE_VARIANTS: Variants = {
  hidden: { scale: 0.75, backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff" },
  visible: {
    scale: 1,
    backgroundColor: "#ffffff",
    color: "#1f62f0",
    transition: {
      default: { duration: 0.4, delay: 0.25, ease: EASE },
      scale: { type: "spring", stiffness: 320, damping: 16, delay: 0.25 },
    },
  },
};

/** box-shadow can't be animated by variants either, so the glow is static. */
export const LIT_BADGE_GLOW = "shadow-[0_10px_24px_-12px_rgba(255,255,255,0.85)]";

/** Static end-state, applied directly when prefers-reduced-motion is on. */
export const LIT_CARD_STATIC_STYLE = {
  backgroundColor: "rgba(255,255,255,0.14)",
  borderColor: "rgba(255,255,255,0.35)",
};
export const LIT_BADGE_STATIC_STYLE = { backgroundColor: "#ffffff", color: "#1f62f0" };

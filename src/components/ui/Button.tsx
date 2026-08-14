"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

type Variant = "primary" | "secondary" | "invert" | "outline-invert";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-brand hover:bg-brand-hover border border-brand-hover/60",
  secondary:
    "bg-white/70 text-ink border border-white/80 backdrop-blur-md shadow-float hover:bg-white",
  invert: "bg-white text-brand border border-white hover:bg-white/92 shadow-float",
  "outline-invert":
    "bg-white/5 text-invert border border-white/25 backdrop-blur-md hover:bg-white/12",
};

const SIZE: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Disables the magnetic pull, e.g. inside dense toolbars. */
  magnetic?: boolean;
};

type AsLink = CommonProps & ComponentPropsWithoutRef<typeof Link> & { href: string };
type AsButton = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };

/**
 * Primary call to action.
 *
 * Two layered affordances on hover: a diagonal light sweep crossing the face
 * (the `.shine` span) and a magnetic lean toward the pointer. Both are purely
 * decorative and drop away under prefers-reduced-motion.
 */
export function Button(props: AsLink | AsButton) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    children,
    magnetic = true,
    ...rest
  } = props;

  const reduceMotion = useReducedMotion();

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium whitespace-nowrap transition-colors duration-200";
  const classes = `${base} ${SIZE[size]} ${VARIANT[variant]} ${className}`;

  const inner = (
    <>
      {/* Light sweep. Sits above the fill, below the label. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  const motionProps = reduceMotion
    ? {}
    : { whileTap: { scale: 0.96 }, transition: { type: "spring" as const, stiffness: 400, damping: 25 } };

  // The press animation lives on a wrapper rather than on the element itself:
  // motion's own `onAnimationStart` collides with React's DOM handler of the
  // same name, so spreading arbitrary element props into motion.button
  // doesn't type-check.
  const node =
    "href" in rest && rest.href ? (
      <motion.span className="inline-flex" {...motionProps}>
        <Link className={classes} data-cursor="link" {...(rest as ComponentPropsWithoutRef<typeof Link>)}>
          {inner}
        </Link>
      </motion.span>
    ) : (
      <motion.span className="inline-flex" {...motionProps}>
        <button className={classes} data-cursor="link" {...(rest as ComponentPropsWithoutRef<"button">)}>
          {inner}
        </button>
      </motion.span>
    );

  return magnetic && !reduceMotion ? <Magnetic strength={10}>{node}</Magnetic> : node;
}

"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { MousePointer2 } from "lucide-react";

type Variant = "default" | "link" | "card" | "label";

/** Ring geometry per state. The dot is hidden once the ring carries meaning. */
/**
 * Fills are always written as rgba with an explicit alpha — motion cannot
 * interpolate the keyword `transparent`, so a zero-alpha colour stands in for
 * "no fill" to keep every state cross-fadeable.
 */
const RING: Record<Variant, { size: number; fill: string; border: string }> = {
  default: { size: 34, fill: "rgba(31,98,240,0)", border: "1.5px solid rgba(15,47,99,0.35)" },
  link: { size: 48, fill: "rgba(31,98,240,0.14)", border: "1.5px solid rgba(31,98,240,0.5)" },
  // Small enough to sit beside typical card text instead of sitting on top
  // of it — the previous 76px ring with a blur backdrop was covering and
  // visibly blurring copy on any card with text near the pointer.
  card: { size: 40, fill: "rgba(31,98,240,0.1)", border: "1.5px solid rgba(31,98,240,0.45)" },
  label: { size: 92, fill: "rgba(31,98,240,0.95)", border: "1px solid rgba(31,98,240,1)" },
};

const RING_INVERT: Record<Variant, { fill: string; border: string }> = {
  default: { fill: "rgba(255,255,255,0)", border: "1.5px solid rgba(255,255,255,0.5)" },
  link: { fill: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.7)" },
  card: { fill: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.4)" },
  label: { fill: "rgba(255,255,255,0.96)", border: "1px solid #ffffff" },
};

/**
 * Two-part pointer: a dot that tracks the mouse exactly, and a ring that
 * trails it on a spring. Elements opt into states by declaring
 * `data-cursor="link" | "card" | "label"`, and dark sections declare
 * `data-cursor-theme="invert"` so the cursor stays visible on navy.
 *
 * Renders nothing at all on coarse pointers or under reduced motion, and the
 * native cursor is only hidden once this component is actually live.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [invert, setInvert] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.6 });

  // Only take over the pointer where a floating cursor makes sense.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(fine.matches && !calm.matches);
    sync();

    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;

      setInvert(Boolean(target.closest('[data-cursor-theme="invert"]')));

      const holder = target.closest<HTMLElement>("[data-cursor]");
      if (holder) {
        const next = (holder.dataset.cursor as Variant) ?? "default";
        setVariant(next);
        setLabel(next === "label" ? (holder.dataset.cursorLabel ?? "") : "");
        return;
      }

      // Anything natively interactive gets the link treatment for free.
      const interactive = target.closest("a, button, [role='button'], summary, input, select, textarea");
      setVariant(interactive ? "link" : "default");
      setLabel("");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ring = RING[variant];
  const skin = invert ? RING_INVERT[variant] : ring;
  const showDot = variant === "default" && !label;
  // "link"/"card" replace the ring outright with a pointer-arrow glyph —
  // no circle behind it at all, just the arrow, same idea as a native OS
  // cursor swapping shape over a clickable element.
  const showArrow = (variant === "link" || variant === "card") && !label;
  const ringBg = showArrow ? "rgba(0,0,0,0)" : skin.fill;
  const ringBorder = showArrow ? "1.5px solid rgba(0,0,0,0)" : skin.border;

  return (
    <>
      <motion.div
        className="cursor-ring flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          width: ring.size,
          height: ring.size,
          marginLeft: -ring.size / 2,
          marginTop: -ring.size / 2,
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.82 : 1,
          backgroundColor: ringBg,
          border: ringBorder,
        }}
        transition={{
          scale: { type: "spring", stiffness: 500, damping: 30 },
          default: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        <AnimatePresence mode="wait">
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className={`px-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.1em] ${
                invert ? "text-brand" : "text-white"
              }`}
            >
              {label}
            </motion.span>
          ) : showArrow ? (
            <motion.span
              key="arrow"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center drop-shadow-[0_2px_4px_rgba(9,38,84,0.35)]"
            >
              <MousePointer2
                className={invert ? "text-white" : "text-brand"}
                width={22}
                height={22}
                fill="currentColor"
                stroke={invert ? "#0f2f63" : "#ffffff"}
                strokeWidth={1.5}
              />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="cursor-dot"
        style={{
          x,
          y,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          backgroundColor: invert ? "#ffffff" : "var(--color-brand)",
        }}
        animate={{ opacity: visible && showDot ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

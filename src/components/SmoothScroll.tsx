"use client";

import { ReactLenis } from "lenis/react";

/**
 * Wraps the ReactLenis instantiation so its options object — including the
 * `easing` function used for anchor-link jumps — never has to cross the
 * server/client boundary as a prop. The root layout that renders this is a
 * Server Component (it exports `metadata`), and React Server Components
 * can't pass a bare function to a Client Component as a prop the way they
 * can pass already-rendered JSX; defining it here, inside a "use client"
 * module, sidesteps that entirely.
 */
export function SmoothScroll() {
  return (
    <ReactLenis
      root
      options={{
        // Forwarded straight into Lenis's scrollTo for anchor-link clicks
        // specifically (nav links, CTAs, footer links) — giving them their
        // own duration+easing makes jump-to-section feel like a deliberate,
        // consistent glide regardless of distance, without touching normal
        // wheel/touch scroll feel, which is governed separately by `lerp`.
        anchors: { offset: -90, duration: 1.3, easing: (t: number) => 1 - Math.pow(2, -10 * t) },
        lerp: 0.09,
      }}
    />
  );
}

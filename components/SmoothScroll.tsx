"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Momentum scrolling for mouse wheel and trackpad; touch keeps the phone's native scrolling (syncTouch is off by
// default), in-page links glide to their section, and Lenis turns itself off for visitors who prefer reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);
  return null;
}

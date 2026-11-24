"use client";

import { useEffect } from "react";
import { animate, stagger } from "animejs";

// Entrance animations for the home page, with anime.js. The hero ([data-hero]) rises in on load and its review count
// counts up ([data-count]); each [data-reveal] container's children rise in, one after another, when it scrolls into
// view (containers can nest: a section's heading and text, then the cards in its grid). Elements start hidden only while <html> has
// "will-animate", which layout.tsx sets before the first paint when JavaScript runs and motion is allowed; without it
// (reduced motion, no JavaScript, or the 4-second safety in layout.tsx), everything simply shows.
export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("will-animate")) return;
    root.dataset.animated = ""; // tells the safety timer in layout.tsx that animation has started

    const rise = (targets: Element[], start = 0) =>
      animate(targets, {
        opacity: { from: 0, to: 1 },
        translateY: { from: 28, to: 0 },
        duration: 900,
        delay: stagger(90, { start }),
        ease: "outExpo",
      });

    rise([...document.querySelectorAll("[data-hero]")], 150);
    for (const el of document.querySelectorAll<HTMLElement>("[data-count]")) {
      const target = Number(el.dataset.count);
      const counter = { n: 0 };
      animate(counter, {
        n: target,
        duration: 1800,
        delay: 400,
        ease: "outExpo",
        onUpdate: () => (el.textContent = `${Math.round(counter.n).toLocaleString("en-IN")}+`),
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          // A nested [data-reveal] grid isn't faded itself (that would drop its glass cards' blur); its cards are.
          rise([...entry.target.children].filter((el) => !el.hasAttribute("data-reveal")));
        }
      },
      { rootMargin: "0px 0px -12% 0px" }, // starts a little after the top edge comes into view
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}

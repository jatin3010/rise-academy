"use client";

import { useRef, type PointerEvent } from "react";

// Phone-shaped review videos: nothing downloads until one is played (preload="none"), and starting one pauses the others.
// Phones swipe through them in a row; wider screens show all three side by side, spread across the width but each at
// most 20rem wide, so they stay shorter than the screen.
// English captions show by default, for people watching on mute and for deaf visitors.
// With a mouse, resting on a video for a moment plays it muted (a preview) until the pointer leaves; a click on it, or
// unmuting it, keeps it playing with sound. A preview never interrupts a video someone is watching, and is skipped for
// visitors who prefer reduced motion.
export default function VideoReviews({ videos }: { videos: { src: string; poster: string; captions: string; label: string }[] }) {
  const timer = useRef(0);
  const others = (v: HTMLVideoElement) => [...(v.closest("ul")?.querySelectorAll("video") ?? [])].filter((o) => o !== v);
  const isPreview = (v: HTMLVideoElement) => "preview" in v.dataset;
  const normal = (v: HTMLVideoElement) => {
    delete v.dataset.preview;
    v.muted = false;
  };
  const enter = (e: PointerEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (e.pointerType !== "mouse" || !v.paused || others(v).some((o) => !o.paused)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = window.setTimeout(() => {
      v.dataset.preview = "";
      v.muted = true; // browsers only start videos on their own when muted
      v.play().catch(() => {});
    }, 300); // a moment's rest, so sweeping the mouse across doesn't start all three
  };
  const leave = (e: PointerEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    clearTimeout(timer.current);
    if (!isPreview(v)) return;
    v.pause();
    normal(v); // sound on for whenever it's played properly
  };
  return (
    <ul data-reveal className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-[repeat(3,minmax(0,20rem))] sm:justify-between sm:overflow-visible sm:px-0 sm:pb-0">
      {videos.map(({ src, poster, captions, label }) => (
        <li key={src} className="w-[72%] shrink-0 snap-center rounded-2xl bg-white/10 p-1.5 backdrop-blur-lg sm:w-auto">
          <video
            src={src}
            poster={poster}
            controls
            preload="none"
            playsInline
            aria-label={label}
            onPlay={(e) => !isPreview(e.currentTarget) && others(e.currentTarget).forEach((o) => o.pause())}
            onPointerEnter={enter}
            onPointerLeave={leave}
            onClick={(e) => {
              if (!isPreview(e.currentTarget)) return;
              e.preventDefault(); // a click on a preview means "watch this": keep playing, not the usual click-to-pause
              normal(e.currentTarget);
            }}
            onVolumeChange={(e) => isPreview(e.currentTarget) && !e.currentTarget.muted && normal(e.currentTarget)}
            // Full screen shows the whole portrait video at screen height; filling a landscape screen cropped it.
            className="aspect-[9/16] w-full rounded-xl bg-black object-cover [&:fullscreen]:rounded-none [&:fullscreen]:object-contain"
          >
            <track kind="captions" src={captions} srcLang="en" label="English" default />
          </video>
        </li>
      ))}
    </ul>
  );
}

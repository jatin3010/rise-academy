"use client";

// Phone-shaped review videos: nothing downloads until one is played (preload="none"), and starting one pauses the others.
// Phones swipe through them in a row; wider screens show all three side by side.
// English captions show by default, for people watching on mute and for deaf visitors.
export default function VideoReviews({ videos }: { videos: { src: string; poster: string; captions: string; label: string }[] }) {
  const pauseOthers = (playing: HTMLVideoElement) =>
    playing.closest("ul")?.querySelectorAll("video").forEach((v) => v !== playing && v.pause());
  return (
    <ul data-reveal className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
      {videos.map(({ src, poster, captions, label }) => (
        <li key={src} className="w-[72%] shrink-0 snap-center rounded-2xl bg-white/10 p-1.5 backdrop-blur-lg sm:w-auto">
          <video
            src={src}
            poster={poster}
            controls
            preload="none"
            playsInline
            aria-label={label}
            onPlay={(e) => pauseOthers(e.currentTarget)}
            className="aspect-[9/16] w-full rounded-xl bg-black object-cover"
          >
            <track kind="captions" src={captions} srcLang="en" label="English" default />
          </video>
        </li>
      ))}
    </ul>
  );
}

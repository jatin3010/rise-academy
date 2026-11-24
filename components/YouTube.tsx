"use client";

import { useState } from "react";
import { Play } from "lucide-react";

// Shows the video's thumbnail and loads YouTube's player only when pressed: the page stays fast, and visitors who never
// press play get no YouTube cookies (youtube-nocookie.com).
// `hd`: the 1280px thumbnail (about 190 KB) for a large card; small cards use the 480px one (about 50 KB).
export default function YouTube({ id, title, hd = false }: { id: string; title: string; hd?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const showStandardThumb = (img: HTMLImageElement) => {
    const standard = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    if (img.src !== standard) img.src = standard;
  };
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`} className="group absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail; a static export can't resize remote images */}
          <img
            src={`https://i.ytimg.com/vi/${id}/${hd ? "maxresdefault" : "hqdefault"}.jpg`}
            // Some videos have no HD thumbnail: YouTube then sends a 120×90 placeholder (or an error), so use the standard one.
            onLoad={(e) => e.currentTarget.naturalWidth < 200 && showStandardThumb(e.currentTarget)}
            onError={(e) => showStandardThumb(e.currentTarget)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full bg-black/60 ring-1 ring-white/20 backdrop-blur-md transition-transform group-hover:scale-110 group-focus-visible:scale-110">
              <Play className="ml-1 size-7 fill-current text-white" aria-hidden />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

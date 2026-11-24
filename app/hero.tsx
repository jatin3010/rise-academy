"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import PillNav from "@/components/PillNav";
import { asset, RATING, REVIEW_COUNT, VIDEOS, WHATSAPP } from "@/lib/site";
import { CTA, GLASS } from "@/lib/styles";
import logo from "./logo.jpeg";

// The heading and the call-back form rise in with CSS, which starts at the first paint. With anime.js they had to wait
// for all the page's JavaScript: 2+ extra seconds of an empty hero on slow phones. The two cards use anime.js (Motion.tsx).
const ENTER =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-7 duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] fill-mode-both";

// The menu (React Bits PillNav). It comes twice, one per screen size, so the right one shows from the first paint:
// PillNav measures the screen only once the page's JavaScript runs, and until then phones got the whole row of links.
const MENU = {
  logo: <Image src={logo} alt="" width={34} height={34} unoptimized className="rounded-full" />,
  logoAlt: "Rise Academy, back to top",
  logoHref: "#top",
  items: [
    { label: "Courses", href: "#courses" },
    { label: "Why Rise", href: "#why" },
    ...(VIDEOS.length ? [{ label: "Classes", href: "#classes" }] : []),
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ],
  activeHref: "", // one page with the menu at its top, so no link is marked as the current page
  intro: false, // its pop-in would replay over the menu already showing before the JavaScript loaded
  style: { "--pn-mark": "34px" }, // the logo fills most of its round bubble
};

// Opens WhatsApp with the visitor's number pre-filled, so the academy can call them back.
function requestCallback(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const phone = new FormData(e.currentTarget).get("phone");
  const text = encodeURIComponent(`Hi Rise Academy, please call me back on ${phone}`);
  window.open(`${WHATSAPP}?text=${text}`, "_blank", "noopener");
}

export default function Hero() {
  return (
    <section className="relative flex min-h-svh w-full flex-col overflow-hidden">
      <video src={asset("hero.mp4")} poster={asset("hero.jpg")} autoPlay loop muted playsInline aria-hidden className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="flex items-center gap-3 px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          {/* Each copy fills the space left of "Enroll now": phones fold the links into its menu button. */}
          <div className="min-w-0 flex-1 md:hidden">
            <PillNav {...MENU} collapse="always" />
          </div>
          <div className="hidden min-w-0 flex-1 md:flex">
            <PillNav {...MENU} collapse="never" />
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className={`flex items-center self-stretch whitespace-nowrap rounded-full px-5 text-sm font-medium text-white ${CTA}`}
          >
            Enroll now
          </a>
        </header>

        <div className="mt-auto flex flex-col gap-6 px-5 pb-8 sm:gap-8 sm:px-8 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-16">
          <div className="max-w-xl">
            <h1 className={`text-3xl font-semibold leading-[1.1] tracking-tight text-[#010101] sm:text-4xl lg:text-[3.5rem] lg:text-white ${ENTER} delay-150`}>
              {/* Says who and where in the main heading, for search and AI answers; the tagline stays the visual headline. */}
              <span className="mb-3 block text-sm font-medium tracking-normal opacity-70">
                Rise Academy · Coaching in Sector 110, Gurugram
              </span>{" "}
              Strong foundations today. Successful futures tomorrow.
            </h1>
            <form
              onSubmit={requestCallback}
              className={`mt-6 flex flex-col gap-3 sm:mt-8 sm:inline-flex sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-1.5 ${ENTER} delay-240`}
            >
              <input
                type="tel"
                name="phone"
                required
                pattern="[0-9+ ]{10,15}"
                title="Enter your 10-digit phone number"
                autoComplete="tel"
                aria-label="Your phone number"
                placeholder="Your phone number"
                className="rounded-full bg-white px-5 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none sm:w-64 sm:rounded-none sm:bg-transparent sm:px-4 sm:py-2"
              />
              <button type="submit" className={`rounded-full px-6 py-3 text-sm font-medium text-white sm:py-2.5 ${CTA}`}>
                Get a call back
              </button>
            </form>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto lg:gap-5">
            <div data-hero className={`flex flex-col justify-between sm:w-64 ${GLASS}`}>
              <p
                data-count={REVIEW_COUNT}
                style={{ fontFamily: "var(--font-silkscreen), cursive" }}
                className="text-3xl font-normal tracking-tight text-[#010101] sm:text-4xl lg:text-white"
              >
                {REVIEW_COUNT.toLocaleString("en-IN")}+
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#010101]/70 sm:mt-4 lg:text-white/70">
                Google reviews from our students, rated {RATING} on average.
              </p>
            </div>

            <figure data-hero className={`sm:w-64 ${GLASS}`}>
              <div className="mb-3 flex items-center gap-2 sm:mb-4">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-black text-xs font-bold text-white" aria-hidden>
                  G
                </span>
                <span className="text-sm font-semibold text-[#010101] lg:text-white">Google Review</span>
              </div>
              <blockquote className="text-sm leading-relaxed text-[#010101]/80 lg:text-white/80">
                &ldquo;Best spoken English coaching center in Gurgaon. The best place for improvement of overall English and
                personality development.&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 sm:mt-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-sm font-semibold text-[#010101] lg:text-white" aria-hidden>
                  V
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#010101] lg:text-white">Vinit Rana</div>
                  <div className="text-xs text-[#010101]/60 lg:text-white/60">Student</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { asset, RATING, REVIEW_COUNT, WHATSAPP } from "@/lib/site";
import { CTA, GLASS } from "@/lib/styles";
import logo from "./logo.jpeg";

const LINKS = [
  ["Courses", "#courses"],
  ["Why Rise", "#why"],
  ["Reviews", "#reviews"],
  ["Contact", "#contact"],
];

// Opens WhatsApp with the visitor's number pre-filled, so the academy can call them back.
function requestCallback(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const phone = new FormData(e.currentTarget).get("phone");
  const text = encodeURIComponent(`Hi Rise Academy, please call me back on ${phone}`);
  window.open(`${WHATSAPP}?text=${text}`, "_blank", "noopener");
}

export default function Hero() {
  const [open, setOpen] = useState(false);

  // Lock page scroll only below md, so it can't stay stuck if the screen widens while the menu is open.
  useEffect(() => {
    document.body.classList.toggle("max-md:overflow-hidden", open);
    return () => document.body.classList.remove("max-md:overflow-hidden");
  }, [open]);

  return (
    <section className="relative flex min-h-svh w-full flex-col overflow-hidden">
      <video src={asset("hero.mp4")} poster={asset("hero.jpg")} autoPlay loop muted playsInline aria-hidden className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative z-10 flex flex-1 flex-col">
        <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          <a href="#top" className="flex items-center gap-2">
            <Image src={logo} alt="" width={36} height={36} unoptimized priority className="h-9 w-9 rounded-full object-cover" />
            <span className="text-lg font-semibold text-[#010101] lg:text-white">Rise Academy</span>
          </a>

          <div className="hidden gap-3 md:flex">
            {/* Darker glass than the spec's white/10: on tablets the links sit over the bright mist and vanished. */}
            <div className="flex gap-1 rounded-full bg-black/20 px-1.5 py-1.5 backdrop-blur-lg">
              {LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className={`flex items-center self-stretch rounded-full px-5 text-sm font-medium text-white ${CTA}`}
            >
              Enroll now
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            // White while open: the dark drawer sits behind the button.
            className={`relative z-50 grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-lg md:hidden ${open ? "text-white" : "text-[#010101] lg:text-white"}`}
          >
            <Menu className={`col-start-1 row-start-1 h-5 w-5 transition-all duration-300 ${open ? "rotate-90 scale-0 opacity-0" : ""}`} aria-hidden />
            <X className={`col-start-1 row-start-1 h-5 w-5 transition-all duration-300 ${open ? "" : "-rotate-90 scale-0 opacity-0"}`} aria-hidden />
          </button>
        </nav>

        <div
          onClick={() => setOpen(false)}
          aria-hidden
          className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />
        <div
          id="mobile-menu"
          inert={!open}
          className={`fixed top-0 right-0 z-40 flex h-full w-72 flex-col bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col gap-2 px-6 pt-24">
            {LINKS.map(([label, href], i) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${(i + 1) * 60}ms` : "0ms" }}
                className={`rounded-xl px-4 py-3.5 text-base font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white ${open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
              >
                {label}
              </a>
            ))}
          </div>
          <div
            style={{ transitionDelay: open ? "300ms" : "0ms" }}
            className={`mt-auto px-6 pb-10 transition-all duration-[400ms] ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className={`block w-full rounded-full py-3 text-center text-sm font-medium text-white ${CTA}`}
            >
              Enroll now
            </a>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-6 px-5 pb-8 sm:gap-8 sm:px-8 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-16">
          <div className="max-w-xl">
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-[#010101] sm:text-4xl lg:text-[3.5rem] lg:text-white">
              {/* Says who and where in the main heading, for search and AI answers; the tagline stays the visual headline. */}
              <span className="mb-3 block text-sm font-medium tracking-normal opacity-70">
                Rise Academy · Coaching in Sector 110, Gurugram
              </span>{" "}
              Strong foundations today. Successful futures tomorrow.
            </h1>
            <form
              onSubmit={requestCallback}
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:inline-flex sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-1.5"
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
            <div className={`flex flex-col justify-between sm:w-64 ${GLASS}`}>
              <p
                style={{ fontFamily: "var(--font-silkscreen), cursive" }}
                className="text-3xl font-normal tracking-tight text-[#010101] sm:text-4xl lg:text-white"
              >
                {REVIEW_COUNT.toLocaleString("en-IN")}+
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#010101]/70 sm:mt-4 lg:text-white/70">
                Google reviews from our students, rated {RATING} on average.
              </p>
            </div>

            <figure className={`sm:w-64 ${GLASS}`}>
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

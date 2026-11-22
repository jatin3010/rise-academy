"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4";
const LINKS = ["Modules", "Clientele", "Solutions", "Billing"];
const CTA = "bg-linear-to-b from-[#2B2B2B] to-[#101010] transition-opacity hover:opacity-90";
const GLASS = "rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:p-6";

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 256 256" className="fill-[#010101] lg:fill-white" aria-hidden>
        <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
      </svg>
      <span className="text-lg font-semibold text-[#010101] lg:text-white">nexum</span>
    </a>
  );
}

export default function NexumHero() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video src={VIDEO} autoPlay loop muted playsInline aria-hidden className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative z-10 flex h-full flex-col">
        <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          <Logo />

          <div className="hidden gap-3 md:flex">
            <div className="flex gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
              {LINKS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {label}
                  {label === "Solutions" && <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
                </a>
              ))}
            </div>
            <a href="#" className={`flex items-center self-stretch rounded-full px-5 text-sm font-medium text-white ${CTA}`}>
              Get started
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nexum-menu"
            className="relative z-50 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-[#010101] backdrop-blur-lg md:hidden lg:text-white"
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
          id="nexum-menu"
          inert={!open}
          className={`fixed top-0 right-0 z-40 flex h-full w-72 flex-col bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col gap-2 px-6 pt-24">
            {LINKS.map((label, i) => (
              <a
                key={label}
                href="#"
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${(i + 1) * 60}ms` : "0ms" }}
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-white/80 transition-all duration-300 hover:bg-white/10 hover:text-white ${open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
              >
                {label}
                {label === "Solutions" && <ChevronDown className="h-4 w-4" aria-hidden />}
              </a>
            ))}
          </div>
          <div
            style={{ transitionDelay: open ? "300ms" : "0ms" }}
            className={`mt-auto px-6 pb-10 transition-all duration-[400ms] ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <a href="#" className={`block w-full rounded-full py-3 text-center text-sm font-medium text-white ${CTA}`}>
              Get started
            </a>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-6 px-5 pb-8 sm:gap-8 sm:px-8 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-16">
          <div className="max-w-xl">
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-[#010101] sm:text-4xl lg:text-[3.5rem] lg:text-white">
              Ship AI workers that grind while you rest
            </h1>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:inline-flex sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-1.5"
            >
              <input
                type="email"
                aria-label="Email address"
                placeholder="Type your email"
                className="rounded-full bg-white px-5 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none sm:w-64 sm:rounded-none sm:bg-transparent sm:px-4 sm:py-2"
              />
              <button type="submit" className={`rounded-full px-6 py-3 text-sm font-medium text-white sm:py-2.5 ${CTA}`}>
                Get started
              </button>
            </form>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto lg:gap-5">
            <div className={`flex flex-col justify-between sm:w-64 ${GLASS}`}>
              <p
                style={{ fontFamily: "var(--font-silkscreen), cursive" }}
                className="text-3xl font-normal tracking-tight text-[#010101] sm:text-4xl lg:text-white"
              >
                42,500+
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#010101]/70 sm:mt-4 lg:text-white/70">
                Teams run Nexum to handle recurring ops daily.
              </p>
            </div>

            <figure className={`sm:w-64 ${GLASS}`}>
              <div className="mb-3 flex items-center gap-2 sm:mb-4">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-black text-xs font-bold text-white" aria-hidden>
                  S
                </span>
                <span className="text-sm font-semibold text-[#010101] lg:text-white">Stratify</span>
              </div>
              <blockquote className="text-sm leading-relaxed text-[#010101]/80 lg:text-white/80">
                &ldquo;With Nexum we went from managing tedious operational work to having AI agents that handle everything.&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3 sm:mt-5">
                {/* eslint-disable-next-line @next/next/no-img-element -- external avatar; next/image optimisation is off under static export */}
                <img src="https://i.pravatar.cc/72?img=12" alt="Sara Klein" className="h-9 w-9 rounded-full bg-white/20 object-cover" />
                <div>
                  <div className="text-sm font-semibold text-[#010101] lg:text-white">Sara Klein</div>
                  <div className="text-xs text-[#010101]/60 lg:text-white/60">Dir of Operations</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

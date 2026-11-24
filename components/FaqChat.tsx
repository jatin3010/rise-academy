"use client";

import { useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { CheckCheck, MessageCircleQuestionMark, SendHorizontal } from "lucide-react";

// The FAQ as a WhatsApp chat: the visitor's question on the right, the academy's reply on the left. Phones get one tall
// chat, like the app. From 1024px it takes WhatsApp Desktop's landscape layout: the questions listed on the left (a
// click scrolls the chat to that answer) and the chat scrolling inside its window. Every answer stays in the page text,
// for search engines and AI answers.
export default function FaqChat({ faqs, logo, whatsapp }: { faqs: [string, string][]; logo: StaticImageData; whatsapp: string }) {
  const chat = useRef<HTMLDListElement>(null);
  const show = (i: number) => {
    const box = chat.current!;
    const question = box.querySelectorAll("dt")[i] as HTMLElement;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: question.offsetTop - 16, behavior: smooth ? "smooth" : "instant" });
  };

  return (
    <div className="max-w-2xl overflow-hidden rounded-2xl bg-[#0b141a]/85 ring-1 ring-white/10 backdrop-blur-lg lg:grid lg:h-[600px] lg:max-w-none lg:grid-cols-[320px_1fr]">
      <nav className="hidden min-h-0 flex-col border-r border-white/10 bg-[#111b21]/80 lg:flex" aria-label="Questions">
        <div className="flex h-16 shrink-0 items-center bg-[#202c33] px-4 font-semibold">{faqs.length} questions</div>
        <ul className="min-h-0 overflow-y-auto" data-lenis-prevent>
          {faqs.map(([question], i) => (
            <li key={question}>
              <button
                type="button"
                onClick={() => show(i)}
                className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/5 focus-visible:bg-white/10"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00a884]/20 text-[#00a884]" aria-hidden>
                  <MessageCircleQuestionMark className="size-5" />
                </span>
                <span className="line-clamp-2 text-sm text-white/85">{question}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex min-h-0 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-3 bg-[#202c33] px-4">
          <Image src={logo} alt="" width={40} height={40} unoptimized className="size-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold">Rise Academy</div>
            <div className="text-xs text-white/60">Questions parents and students ask us</div>
          </div>
        </div>

        <dl ref={chat} className="relative flex flex-col gap-2 px-3 py-5 sm:px-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto" data-lenis-prevent>
          {faqs.map(([question, answer]) => (
            <div key={question} className="flex flex-col gap-2">
              <dt className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#005c4b] px-3 py-2 text-sm text-white lg:max-w-[70%]">
                {question}
                <CheckCheck className="float-right mt-0.5 ml-2 size-4 text-[#53bdeb]" aria-hidden />
              </dt>
              <dd className="mr-auto mb-2 max-w-[85%] rounded-lg rounded-tl-none bg-[#202c33] px-3 py-2 text-sm leading-relaxed text-white/90 lg:max-w-[70%]">
                {answer}
              </dd>
            </div>
          ))}
        </dl>

        <a
          href={whatsapp}
          target="_blank"
          rel="noopener"
          className="flex shrink-0 items-center gap-2 bg-[#202c33] px-3 py-2.5 transition-colors hover:bg-[#2a3942]"
        >
          <span className="flex-1 rounded-full bg-[#2a3942] px-4 py-2.5 text-sm text-white/60">Ask your own question on WhatsApp…</span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00a884] text-[#0b141a]" aria-hidden>
            <SendHorizontal className="size-5" />
          </span>
        </a>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { PHONE, WHATSAPP } from "@/lib/site";

// Phones only: Call and WhatsApp buttons fixed to the bottom of the screen, so a parent ready to call never has to
// scroll back up. With afterHero it slides in once the home page's hero (#hero) has scrolled away; the hero has its
// own buttons, and the bar would cover them.
export default function ContactBar({ afterHero = false }: { afterHero?: boolean }) {
  const [shown, setShown] = useState(!afterHero);
  useEffect(() => {
    const hero = afterHero && document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, [afterHero]);

  const button = "flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold";
  return (
    <div
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-white/10 bg-black/80 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg transition-transform duration-300 md:hidden ${shown ? "" : "translate-y-full"}`}
    >
      <a href={`tel:${PHONE}`} className={`${button} bg-white/10 text-white`}>
        <Phone className="size-4" aria-hidden /> Call
      </a>
      <a href={WHATSAPP} target="_blank" rel="noopener" className={`${button} bg-[#00a884] text-[#0b141a]`}>
        <MessageCircle className="size-4" aria-hidden /> WhatsApp
      </a>
    </div>
  );
}

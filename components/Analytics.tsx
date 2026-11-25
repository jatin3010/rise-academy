"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA = process.env.NEXT_PUBLIC_GA_ID;

// Google Analytics 4: loads only once its measurement ID is set (GitHub variable GA_MEASUREMENT_ID), and never on the
// admin pages. Taps on Call and WhatsApp count as leads ("generate_lead"), and so does the hero's call-back form
// (app/hero.tsx), so the reports show what brings enquiries.
export default function Analytics() {
  const path = usePathname();
  const on = Boolean(GA) && !path.startsWith("/admin");
  useEffect(() => {
    if (!on) return;
    const onClick = (event: MouseEvent) => {
      const href = (event.target as Element | null)?.closest?.("a")?.getAttribute("href") ?? "";
      const method = href.startsWith("tel:") ? "call" : href.includes("wa.me/") ? "whatsapp" : "";
      if (method) window.gtag?.("event", "generate_lead", { method });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [on]);
  if (!on) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');`}
      </Script>
    </>
  );
}

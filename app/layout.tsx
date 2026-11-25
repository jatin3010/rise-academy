import type { Metadata } from "next";
import { Anek_Devanagari } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import SmoothScroll from "@/components/SmoothScroll";
import { OG_IMAGE, PHONE_DISPLAY, RATING, SITE_URL } from "@/lib/site";
import logo from "./logo.jpeg";

// Anek, by the Indian foundry Ek Type: one family for English and Hindi (राइज़ एकेडमी), so both scripts match.
// Its width axis lets headings run slightly narrower (font-stretch) than body text.
const anek = Anek_Devanagari({ variable: "--font-sans", subsets: ["latin", "devanagari"], axes: ["wdth"] });

const title = "Rise Academy Gurugram — Tuition, Spoken English, IELTS & Computer Classes";
const description = `Rise Academy (राइज़ एकेडमी), Sector 110, New Palam Vihar, Gurugram: school tuition for Classes 1–12, spoken English, IELTS, PTE and computer courses. Rated ${RATING} on Google. Call ${PHONE_DISPLAY}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Rise Academy",
    url: "./",
    title,
    description,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
  icons: logo.src,
  // Google Search Console's ownership check (GitHub variable GOOGLE_SITE_VERIFICATION); left out while unset.
  verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script below adds "will-animate" to <html> before React loads, on purpose.
    <html lang="en-IN" className={`${anek.variable} h-full motion-safe:scroll-smooth antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {/* Before the first paint: let components/Motion.tsx hide what it animates in, only when JavaScript runs and
            motion is allowed. If it hasn't started within 4 s (very slow connection), show everything as it is. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(matchMedia("(prefers-reduced-motion: no-preference)").matches){var r=document.documentElement;r.classList.add("will-animate");setTimeout(function(){if(!r.hasAttribute("data-animated"))r.classList.remove("will-animate")},4000)}`,
          }}
        />
        {/* A dawn behind every page: night indigo with saffron and gold light rising at the bottom, the "rise" of the
            logo. Calm enough for text, with colour for the glass panels to blur. */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-night"
          style={{
            backgroundImage: [
              "radial-gradient(120% 55% at 50% 118%, rgb(228 81 27 / 0.38), transparent 62%)",
              "radial-gradient(60% 35% at 50% 105%, rgb(235 174 51 / 0.22), transparent 70%)",
              "radial-gradient(70% 55% at 10% -10%, rgb(53 83 162 / 0.35), transparent 65%)",
            ].join(", "),
          }}
        />
        <SmoothScroll />
        <Analytics />
        {children}
      </body>
    </html>
  );
}

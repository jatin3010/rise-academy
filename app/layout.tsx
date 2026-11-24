import type { Metadata } from "next";
import { Geist, Silkscreen } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { asset, PHONE_DISPLAY, RATING, SITE_URL } from "@/lib/site";
import logo from "./logo.jpeg";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const silkscreen = Silkscreen({ variable: "--font-silkscreen", subsets: ["latin"], weight: "400" });

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
    images: [{ url: "og.jpg", width: 1200, height: 630, alt: "Rise Academy courses banner with phone number and address" }],
  },
  twitter: { card: "summary_large_image" },
  icons: logo.src,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script below adds "will-animate" to <html> before React loads, on purpose.
    <html lang="en-IN" className={`${geist.variable} ${silkscreen.variable} h-full motion-safe:scroll-smooth antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {/* Before the first paint: let components/Motion.tsx hide what it animates in, only when JavaScript runs and
            motion is allowed. If it hasn't started within 4 s (very slow connection), show everything as it is. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(matchMedia("(prefers-reduced-motion: no-preference)").matches){var r=document.documentElement;r.classList.add("will-animate");setTimeout(function(){if(!r.hasAttribute("data-animated"))r.classList.remove("will-animate")},4000)}`,
          }}
        />
        {/* Dimmed hero frame fixed behind every page, so glass panels have something to blur. */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgb(0 0 0 / 0.7), rgb(0 0 0 / 0.7)), url(${asset("hero.jpg")})` }}
        />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

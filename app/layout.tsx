import type { Metadata } from "next";
import { Geist, Noto_Sans_Devanagari, Silkscreen } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const silkscreen = Silkscreen({ variable: "--font-silkscreen", subsets: ["latin"], weight: ["400", "700"] });
const hindi = Noto_Sans_Devanagari({
  variable: "--font-hindi",
  subsets: ["devanagari"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Rise Academy — English Speaking & IELTS Coaching, Gurugram",
  description:
    "Rise Academy (राइज़ एकेडमी), New Palam Vihar, Sector 110, Gurugram. Spoken English, IELTS coaching and personality development. Rated 4.9 by 1,000+ students.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${silkscreen.variable} ${hindi.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

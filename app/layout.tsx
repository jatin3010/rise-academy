import type { Metadata } from "next";
import { Geist, Silkscreen } from "next/font/google";
import "./globals.css";
import { RATING } from "@/lib/site";
import logo from "./logo.jpeg";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const silkscreen = Silkscreen({ variable: "--font-silkscreen", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Rise Academy — School Tuition, Spoken English & Computer Courses, Gurugram",
  description: `Rise Academy (राइज़ एकेडमी), Sector 110, Gurugram. School tuition for classes 1st–12th, spoken English, IELTS, PTE, personality development and computer courses. Rated ${RATING} on Google.`,
  icons: logo.src,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${silkscreen.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

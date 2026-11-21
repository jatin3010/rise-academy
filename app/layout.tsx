import type { Metadata } from "next";
import { Fraunces, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-heading", subsets: ["latin"] });
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
      className={`${inter.variable} ${fraunces.variable} ${hindi.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

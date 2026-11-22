import type { Metadata } from "next";
import { Geist, Silkscreen } from "next/font/google";
import NexumHero from "./hero";

const geist = Geist({ subsets: ["latin"] });
const silkscreen = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-silkscreen" });

export const metadata: Metadata = { title: "Nexum Hero" };

export default function Page() {
  return (
    <div className={`${geist.className} ${silkscreen.variable} antialiased`}>
      <NexumHero />
    </div>
  );
}

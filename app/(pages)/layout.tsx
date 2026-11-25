import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactBar from "@/components/ContactBar";
import Footer from "@/components/Footer";
import { WHATSAPP } from "@/lib/site";
import { CTA } from "@/lib/styles";
import logo from "../logo.jpeg";

// The pages besides the home page (course pages, privacy policy): a header back to the home page, the shared footer,
// and the phones' Call / WhatsApp bar. "(pages)" is a folder name only; it is not part of the address.
export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between gap-3 px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold">
          <Image src={logo} alt="" width={36} height={36} unoptimized className="size-9 rounded-full" />
          Rise Academy
        </Link>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener"
          className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium text-white ${CTA}`}
        >
          Enroll now
        </a>
      </header>
      <main className="px-5 pt-6 pb-16 sm:px-8 lg:px-12">{children}</main>
      <Footer />
      <ContactBar />
    </>
  );
}

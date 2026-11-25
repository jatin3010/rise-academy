import type { Metadata } from "next";
import { ADDRESS, PHONE, PHONE_DISPLAY, WHATSAPP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy | Rise Academy",
  description: "What Rise Academy's website and office keep about visitors, enquiries and students, and how to have it changed or deleted.",
  alternates: { canonical: "./" },
};

// Describes what the site really does: keep it in step with the call-back form (app/hero.tsx), the CRM, and
// components/Analytics.tsx. The analytics paragraph shows only while Google Analytics is switched on.
const analytics = Boolean(process.env.NEXT_PUBLIC_GA_ID);
const UPDATED = "25 November 2026";

export default function PrivacyPage() {
  const h2 = "mt-10 text-xl font-semibold";
  const p = "mt-3 leading-relaxed text-white/80";
  return (
    <article className="max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated {UPDATED}</p>
      <p className={p}>
        Rise Academy, {ADDRESS}, runs this website. This page explains what we keep about you and why. For any question,
        call <a className="underline" href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a> or{" "}
        <a className="underline" href={WHATSAPP} target="_blank" rel="noopener">send us a WhatsApp message</a>.
      </p>

      <h2 className={h2}>What we keep, and why</h2>
      <p className={p}>
        <strong className="text-white">Call-back requests.</strong> When you use “Get a call back”, we save the phone number
        you type so that we can call you about our courses, and WhatsApp opens with a message for you to send if you wish.
        We use the number only to talk to you about Rise Academy, and delete it when it is no longer needed.
      </p>
      <p className={p}>
        <strong className="text-white">Students.</strong> For students who join, we keep their name, phone number, parent’s
        name, class, courses, fees and payments, to run classes and collect fees. Only approved Rise Academy staff can see
        these records, after signing in. We send WhatsApp messages about fees and classes only with the student’s consent,
        or a parent’s consent for anyone under 18.
      </p>
      {analytics && (
        <p className={p}>
          <strong className="text-white">Visit statistics.</strong> We use Google Analytics to count visits and to see which
          pages and buttons are used, for example how many people tap “Call”. It uses cookies and receives your device
          details and IP address. You can block it in your browser settings.
        </p>
      )}
      <p className={p}>
        <strong className="text-white">Videos and the map.</strong> Class videos come from YouTube (youtube-nocookie.com)
        and load only when you play one or rest your mouse on it; the map comes from Google Maps. These services may set
        their own cookies, under their own privacy policies.
      </p>

      <h2 className={h2}>Where it is kept</h2>
      <p className={p}>
        Call-back requests and student records are stored with Supabase, our database provider. We do not sell your
        information or give it to anyone for their own marketing.
      </p>

      <h2 className={h2}>Your choices</h2>
      <p className={p}>
        You can ask us at any time to show, correct or delete what we keep about you; a parent or guardian can ask for a
        child. Call or WhatsApp {PHONE_DISPLAY}, and we will do it as soon as we can.
      </p>

      <h2 className={h2}>Changes</h2>
      <p className={p}>If we change how we use information, we will update this page and the date at the top.</p>
    </article>
  );
}

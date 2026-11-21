import { GraduationCap, MessageCircle, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PHONE = "+917042481547";
const PHONE_DISPLAY = "070424 81547";
const WHATSAPP = "https://wa.me/917042481547";
const MAPS_QUERY = "Rise+Academy+New+Palam+Vihar+Gurugram";
const ADDRESS = "A-117, Bajghera Rd, New Palam Vihar, Block B, Chowk, Sector 110, Gurugram, Haryana 122017";

const courses = [
  {
    icon: MessageCircle,
    title: "Spoken English",
    text: "Build fluency and confidence for everyday conversation, interviews and the workplace, from beginner to advanced.",
  },
  {
    icon: GraduationCap,
    title: "IELTS Coaching",
    text: "Focused preparation for Listening, Reading, Writing and Speaking, with practice tests and feedback for your target band.",
  },
  {
    icon: Sparkles,
    title: "Personality Development",
    text: "Communication, body language and public speaking skills that help you present yourself with confidence.",
  },
];

const reasons = [
  ["Dedicated faculty", "Approachable teachers who make sure no student is left behind."],
  ["Strong fundamentals", "Grammar and core concepts first, so fluency lasts."],
  ["Doubt-clearing sessions", "Time set aside to answer every question."],
  ["Easy to reach", "Main-road location at Sector 110, New Palam Vihar."],
];

const reviews = [
  {
    name: "Shashwat Savarn",
    text: "Rise Academy in New Palam Vihar provides an excellent learning environment with dedicated and approachable faculty. The teachers focus on building strong core concepts and ensure no student is left behind during doubt-clearing sessions.",
  },
  {
    name: "Vinit Rana",
    text: "Best spoken English coaching center in Gurgaon. No doubt guys, this is the best place for improvement of overall English and personality development. And Ravil sir is definitely the best mentor of my life.",
  },
  {
    name: "Sanjay Vashist",
    text: "I joined the academy to improve my English speaking and communication skills, and I have seen a noticeable improvement in my confidence and fluency.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Rise Academy",
  alternateName: "राइज़ एकेडमी",
  telephone: "+91-7042481547",
  url: "https://rise-academy.grexa.site",
  address: {
    "@type": "PostalAddress",
    streetAddress: "A-117, Bajghera Rd, New Palam Vihar, Block B, Chowk, Sector 110",
    addressLocality: "Gurugram",
    addressRegion: "Haryana",
    postalCode: "122017",
    addressCountry: "IN",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1001" },
};

const big = "h-11 rounded-full px-6 text-base font-semibold";
const ghostOnDark = cn(buttonVariants({ variant: "outline" }), big, "border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white");

function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-0.5 text-primary", className)} role="img" aria-label="5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4 fill-current" aria-hidden />
      ))}
    </span>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">{eyebrow}</p>
      <h2 className="mt-2 mb-8 font-heading text-3xl font-bold md:text-4xl">{title}</h2>
    </>
  );
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="font-heading text-2xl font-extrabold">
            Rise<span className="text-amber-600">.</span>Academy
          </a>
          <nav aria-label="Main" className="flex flex-wrap gap-5 text-sm font-medium">
            {["Courses", "Why Rise", "Reviews", "Contact"].map((label) => (
              <a key={label} href={`#${label.split(" ")[0].toLowerCase()}`} className="hover:text-amber-700">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden bg-foreground py-24 text-white">
          <div aria-hidden className="absolute -top-32 -right-32 size-[420px] rounded-full bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)] opacity-35" />
          <div className="relative mx-auto max-w-5xl px-4">
            <p lang="hi" className="font-hindi text-lg text-primary">राइज़ एकेडमी</p>
            <h1 className="mt-3 mb-5 max-w-[14ch] font-heading text-5xl font-extrabold leading-tight md:text-7xl">
              Speak English with <span className="text-primary">confidence.</span>
            </h1>
            <p className="max-w-[52ch] text-lg text-white/80">
              Spoken English, IELTS coaching and personality development in New Palam Vihar, Gurugram. Small batches,
              patient mentors, and real progress you can hear.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${PHONE}`} className={cn(buttonVariants(), big)}>Call {PHONE_DISPLAY}</a>
              <a href={WHATSAPP} target="_blank" rel="noopener" className={ghostOnDark}>Chat on WhatsApp</a>
            </div>
            <Badge variant="secondary" className="mt-10 h-auto gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
              <Stars /> <strong>4.9</strong> on Google · 1,001 reviews
            </Badge>
          </div>
        </section>

        <section id="courses" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="What we teach" title="Courses" />
            <div className="grid gap-5 md:grid-cols-3">
              {courses.map(({ icon: Icon, title, text }) => (
                <Card key={title} className="p-2">
                  <CardHeader>
                    <Icon className="size-8 text-amber-600" aria-hidden />
                    <CardTitle className="mt-3 text-xl font-bold">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-base text-muted-foreground">{text}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="border-y bg-card py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="Why students choose us" title="Why Rise Academy" />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {reasons.map(([title, text]) => (
                <li key={title} className="border-l-4 border-primary pl-4">
                  <strong className="block font-heading text-lg">{title}</strong>
                  <span className="text-muted-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="reviews" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="4.9 ★ from 1,001 Google reviews" title="What our students say" />
            <div className="grid gap-5 md:grid-cols-3">
              {reviews.map(({ name, text }) => (
                <Card key={name} className="pt-6">
                  <CardContent className="flex flex-col gap-4">
                    <Stars />
                    <blockquote className="text-base text-muted-foreground">“{text}”</blockquote>
                  </CardContent>
                  <CardFooter className="mt-auto font-semibold">{name}</CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
                target="_blank"
                rel="noopener"
                className={cn(buttonVariants({ variant: "outline" }), big, "border-foreground bg-transparent")}
              >
                Read all reviews on Google
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-foreground py-20 text-white">
          <div className="mx-auto max-w-5xl px-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Visit or call us</p>
            <h2 className="mt-2 mb-8 font-heading text-3xl font-bold md:text-4xl">Contact</h2>
            <div className="grid items-start gap-8 md:grid-cols-2">
              <div>
                <dl className="grid gap-5">
                  {[
                    ["Address", ADDRESS],
                    ["Phone", <a key="p" href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>],
                    ["Hours", "Open daily · Closes 10 PM"],
                    ["Plus code", "G25G+V9 Gurugram"],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <dt className="text-xs uppercase tracking-widest text-primary">{label}</dt>
                      <dd className="text-lg">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={WHATSAPP} target="_blank" rel="noopener" className={cn(buttonVariants(), big)}>WhatsApp us</a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`}
                    target="_blank"
                    rel="noopener"
                    className={ghostOnDark}
                  >
                    Get directions
                  </a>
                </div>
              </div>
              <iframe
                title="Map showing Rise Academy, New Palam Vihar, Gurugram"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Rise+Academy,+A-117+Bajghera+Rd,+New+Palam+Vihar,+Sector+110,+Gurugram&output=embed"
                className="h-[340px] w-full rounded-2xl border-0"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground">© Rise Academy · राइज़ एकेडमी · Gurugram</footer>

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener"
        aria-label="Chat with Rise Academy on WhatsApp"
        className="fixed right-4 bottom-4 z-20 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
        </svg>
      </a>
    </>
  );
}

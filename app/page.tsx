import { GraduationCap, MessageCircle, Sparkles, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PHONE, PHONE_DISPLAY, WHATSAPP } from "@/lib/site";
import { cn } from "@/lib/utils";
import Hero from "./hero";

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

      <main id="top">
        <Hero />

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
    </>
  );
}

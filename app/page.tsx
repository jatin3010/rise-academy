import { BookOpen, ChevronDown, MessageCircle, Monitor, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import TrueFocus from "@/components/TrueFocus";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PHONE, PHONE_DISPLAY, RATING, REVIEW_COUNT, SITE_URL, WHATSAPP } from "@/lib/site";
import { CTA, GLASS } from "@/lib/styles";
import { cn } from "@/lib/utils";
import Hero from "./hero";
import logo from "./logo.jpeg";

const MAPS_QUERY = "Rise+Academy+New+Palam+Vihar+Gurugram";
const ADDRESS = "A-117, Bajghera Rd, New Palam Vihar, Block B, Chowk, Sector 110, Gurugram, Haryana 122017";

const courses = [
  {
    icon: BookOpen,
    title: "School Tuition",
    text: "Classes 1st–12th in three wings: Junior (1–5), Middle (6–8) and Senior (9–12).",
    items: ["Mathematics", "Science", "English", "Social Science", "Accountancy", "Economics", "Business Studies"],
  },
  {
    icon: MessageCircle,
    title: "Spoken English & Personal Growth",
    text: "Speak fluently, present yourself with confidence, and prepare for interviews and English tests.",
    items: ["Spoken English", "Personality Development", "Interview Preparation", "IELTS", "PTE"],
  },
  {
    icon: Monitor,
    title: "Computer & Digital Skills",
    text: "Practical computer skills for school, college and work.",
    items: ["Computer Courses", "MS Office", "Advanced Excel", "Tally", "Digital Marketing", "Website Designing"],
  },
];

const reasons = [
  ["Personal attention", "Teachers make sure no student is left behind."],
  ["Concept-based learning", "Understanding first, not rote memorisation."],
  ["Regular tests & assessments", "Frequent tests show what is learnt and what needs work."],
  ["Individual progress tracking", "Each student's progress is followed closely."],
  ["Supportive environment", "A friendly place where students feel free to ask questions."],
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

// Plain facts in one paragraph, so search engines and AI answers can quote who, what and where.
const about = `Rise Academy (राइज़ एकेडमी) is a coaching centre at A-117, Bajghera Road, New Palam Vihar, Sector 110, Gurugram. It offers school tuition for Classes 1 to 12, spoken English, personality development, interview preparation, IELTS and PTE coaching, and computer courses including MS Office, Advanced Excel, Tally, digital marketing and website designing. Students rate it ${RATING} out of 5 on Google across ${REVIEW_COUNT.toLocaleString("en-IN")} reviews.`;

// Only facts from the Google listing and the academy's banners; no fees or batch times, which we don't know.
const faqs = [
  ["What courses does Rise Academy offer?", courses.map(({ title, items }) => `${title}: ${items.join(", ")}`).join(". ") + "."],
  ["Which school classes do you teach?", "All classes from 1st to 12th, in three wings: Junior (Classes 1–5), Middle (Classes 6–8) and Senior (Classes 9–12)."],
  ["Where is Rise Academy in Gurugram?", `${ADDRESS}. Google Maps plus code: G25G+V9 Gurugram.`],
  ["What are the timings?", `The academy is open until 10 PM. Call ${PHONE_DISPLAY} to ask about batch timings.`],
  ["Do you coach for IELTS and PTE?", "Yes. IELTS and PTE preparation is part of the Spoken English & Personal Growth programme."],
  ["How do I join?", `Call ${PHONE_DISPLAY} or send a WhatsApp message to the same number.`],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EducationalOrganization"],
  "@id": `${SITE_URL}#business`,
  name: "Rise Academy",
  alternateName: "राइज़ एकेडमी",
  description: about,
  url: SITE_URL,
  telephone: PHONE,
  image: new URL("og.jpg", SITE_URL).href,
  logo: new URL(logo.src, SITE_URL).href,
  sameAs: ["https://rise-academy.grexa.site"],
  hasMap: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
  // Decoded from the plus code 7JWVG25G+V9 (G25G+V9 Gurugram).
  geo: { "@type": "GeoCoordinates", latitude: 28.50969, longitude: 77.02594 },
  areaServed: { "@type": "City", name: "Gurugram" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Courses",
    itemListElement: courses.map(({ title, items }) => ({
      "@type": "OfferCatalog",
      name: title,
      itemListElement: items.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
    })),
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "A-117, Bajghera Rd, New Palam Vihar, Block B, Chowk, Sector 110",
    addressLocality: "Gurugram",
    addressRegion: "Haryana",
    postalCode: "122017",
    addressCountry: "IN",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: RATING, reviewCount: REVIEW_COUNT },
};

// Shared TrueFocus settings for section headings: white brackets like the hero, light blur so headings stay readable.
const focus = { borderColor: "var(--primary)", blurAmount: 2, cornerSize: 12 };

const big = "h-11 rounded-full px-6 text-sm font-medium";
const ctaButton = cn(buttonVariants(), big, "text-white", CTA);
const glassButton = cn(buttonVariants({ variant: "ghost" }), big, "bg-white/10 backdrop-blur-lg hover:bg-white/20");
const glassCard = "rounded-2xl backdrop-blur-lg";

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
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-3 mb-8 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
        <TrueFocus sentence={title} {...focus} />
      </h2>
    </>
  );
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Dimmed hero frame fixed behind the sections, so the glass panels have something to blur. Relative URL: same shortcut as the hero video. */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgb(0 0 0 / 0.7), rgb(0 0 0 / 0.7)), url(hero.jpg)" }}
      />

      <main id="top">
        <Hero />

        <section id="courses" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="The best coaching in Gurugram" title="Our courses" />
            <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">{about}</p>
            <div className="grid gap-5 md:grid-cols-3">
              {courses.map(({ icon: Icon, title, text, items }) => (
                <Card key={title} className={`p-2 ${glassCard}`}>
                  <CardHeader>
                    <Icon className="size-8 text-white/80" aria-hidden />
                    <CardTitle className="mt-3 text-xl font-semibold tracking-tight">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-base text-muted-foreground">
                    <p>{text}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {items.map((item) => (
                        <li key={item}>
                          <Badge variant="secondary">{item}</Badge>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="Why students choose us" title="Why Rise Academy" />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {reasons.map(([title, text]) => (
                <li key={title} className={GLASS}>
                  <strong className="block font-semibold">{title}</strong>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="reviews" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle
              eyebrow={`${RATING} ★ from ${REVIEW_COUNT.toLocaleString("en-IN")} Google reviews`}
              title="What our students say"
            />
            <div className="grid gap-5 md:grid-cols-3">
              {reviews.map(({ name, text }) => (
                <Card key={name} className={`pt-6 ${glassCard}`}>
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
                className={glassButton}
              >
                Read all reviews on Google
              </a>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="Asked by parents and students" title="Common questions" />
            <div className="grid max-w-3xl gap-3">
              {faqs.map(([question, answer]) => (
                <details key={question} className={`group ${GLASS}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {question}
                    <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="Visit or call us" title="Contact" />
            <div className="grid items-start gap-5 md:grid-cols-2">
              <div className={GLASS}>
                <dl className="grid gap-5">
                  {[
                    ["Address", ADDRESS],
                    ["Phone", <a key="p" href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>],
                    ["Hours", "Closes 10 PM · call for batch timings"],
                    ["Plus code", "G25G+V9 Gurugram"],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
                      <dd className="text-lg">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={WHATSAPP} target="_blank" rel="noopener" className={ctaButton}>WhatsApp us</a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`}
                    target="_blank"
                    rel="noopener"
                    className={glassButton}
                  >
                    Get directions
                  </a>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-1.5 backdrop-blur-lg">
                <iframe
                  title="Map showing Rise Academy, New Palam Vihar, Gurugram"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Rise+Academy,+A-117+Bajghera+Rd,+New+Palam+Vihar,+Sector+110,+Gurugram&ll=28.50969,77.02594&z=16&output=embed"
                  className="block h-[340px] w-full rounded-xl border-0"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">© Rise Academy · राइज़ एकेडमी · Gurugram</footer>
    </>
  );
}

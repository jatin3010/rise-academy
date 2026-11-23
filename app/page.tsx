import Image from "next/image";
import { BookOpen, CheckCheck, MessageCircle, Monitor, SendHorizontal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import CardSwap, { Card as SwapCard } from "@/components/CardSwap";
import TrueFocus from "@/components/TrueFocus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COURSES } from "@/lib/courses";
import { PHONE, PHONE_DISPLAY, RATING, REVIEW_COUNT, SITE_URL, WHATSAPP } from "@/lib/site";
import { CTA, GLASS, GLASS_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import Hero from "./hero";
import logo from "./logo.jpeg";

const MAPS_QUERY = "Rise+Academy+New+Palam+Vihar+Gurugram";
const ADDRESS = "A-117, Bajghera Rd, New Palam Vihar, Block B, Chowk, Sector 110, Gurugram, Haryana 122017";

const icons = { "School Tuition": BookOpen, "Spoken English & Personal Growth": MessageCircle, "Computer & Digital Skills": Monitor };
const courses = COURSES.map((course) => ({ ...course, icon: icons[course.title] }));

const reasons = [
  ["Personal attention", "Teachers make sure no student is left behind."],
  ["Concept-based learning", "Understanding first, not rote memorisation."],
  ["Regular tests & assessments", "Frequent tests show what is learnt and what needs work."],
  ["Individual progress tracking", "Each student's progress is followed closely."],
  ["Supportive environment", "A friendly place where students feel free to ask questions."],
];

// Real Google reviews only. To show more, paste them here word for word with the reviewer's name as shown on Google.
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

      <main id="top">
        <Hero />

        <section id="courses" className="py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="The best coaching in Gurugram" title="Our courses" />
            <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">{about}</p>
            <div className="grid gap-5 md:grid-cols-3">
              {courses.map(({ icon: Icon, title, text, items }) => (
                <Card key={title} className={`p-2 ${GLASS_CARD}`}>
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

        <section id="why" className="py-14 sm:py-20">
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

        <section id="reviews" className="py-14 sm:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 md:grid-cols-2">
            <div>
              <SectionTitle
                eyebrow={`${RATING} ★ from ${REVIEW_COUNT.toLocaleString("en-IN")} Google reviews`}
                title="What our students say"
              />
              <p className="mb-8 max-w-md leading-relaxed text-muted-foreground">
                Real reviews from Rise Academy students on Google. Swipe the top card, tap one behind it, or use the
                arrow keys.
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`}
                target="_blank"
                rel="noopener"
                className={glassButton}
              >
                Read all {REVIEW_COUNT.toLocaleString("en-IN")} reviews on Google
              </a>
            </div>
            {/* Narrow, tall cards with small offsets: the stack scales down to fit its column, so this keeps the
                review text readable on phones. The negative margin lets it use the full phone width. */}
            <div className="-mx-4 sm:mx-0">
            <CardSwap label="Student reviews" width={280} height={360} cardDistance={14} verticalDistance={22} depth={60} visibleCards={3} delay={5000}>
              {reviews.map(({ name, text }) => (
                <SwapCard key={name} className="flex flex-col gap-3 p-5">
                  <Stars />
                  <blockquote className="line-clamp-9 text-[15px] leading-relaxed text-white/80">“{text}”</blockquote>
                  <div className="mt-auto flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-white/10 text-sm font-semibold" aria-hidden>
                      {name[0]}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{name}</div>
                      <div className="text-xs text-white/60">Google review</div>
                    </div>
                  </div>
                </SwapCard>
              ))}
            </CardSwap>
            </div>
          </div>
        </section>

        <section id="faq" className="py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4">
            <SectionTitle eyebrow="Asked by parents and students" title="Common questions" />
            {/* FAQ as a chat thread: the visitor's question on the right, the academy's reply on the left.
                Every answer stays visible page text for search and AI answers. */}
            <div className="max-w-2xl overflow-hidden rounded-2xl bg-[#0b141a]/85 ring-1 ring-white/10 backdrop-blur-lg">
              <div className="flex items-center gap-3 bg-[#202c33] px-4 py-3">
                <Image src={logo} alt="" width={40} height={40} unoptimized className="size-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">Rise Academy</div>
                  <div className="text-xs text-white/60">Questions parents and students ask us</div>
                </div>
              </div>

              <dl className="flex flex-col gap-2 px-3 py-5 sm:px-5">
                {faqs.map(([question, answer]) => (
                  <div key={question} className="flex flex-col gap-2">
                    <dt className="ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-[#005c4b] px-3 py-2 text-sm text-white">
                      {question}
                      <CheckCheck className="float-right mt-0.5 ml-2 size-4 text-[#53bdeb]" aria-hidden />
                    </dt>
                    <dd className="mr-auto mb-2 max-w-[85%] rounded-lg rounded-tl-none bg-[#202c33] px-3 py-2 text-sm leading-relaxed text-white/90">
                      {answer}
                    </dd>
                  </div>
                ))}
              </dl>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 bg-[#202c33] px-3 py-2.5 transition-colors hover:bg-[#2a3942]"
              >
                <span className="flex-1 rounded-full bg-[#2a3942] px-4 py-2.5 text-sm text-white/60">
                  Ask your own question on WhatsApp…
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#00a884] text-[#0b141a]" aria-hidden>
                  <SendHorizontal className="size-5" />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="py-14 sm:py-20">
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

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, MessageCircle, Monitor } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import CardSwap, { Card as SwapCard } from "@/components/CardSwap";
import ContactBar from "@/components/ContactBar";
import FaqChat from "@/components/FaqChat";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import SectionTitle from "@/components/SectionTitle";
import SpotlightCard from "@/components/SpotlightCard";
import Stars from "@/components/Stars";
import VideoReviews from "@/components/VideoReviews";
import YouTube from "@/components/YouTube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COURSES } from "@/lib/courses";
import {
  ADDRESS,
  asset,
  FAQ,
  INSTAGRAM,
  MAPS_QUERY,
  PHONE,
  PHONE_DISPLAY,
  RATING,
  REVIEW_COUNT,
  REVIEW_VIDEOS,
  REVIEWS,
  SITE_URL,
  VIDEOS,
  WHATSAPP,
  YOUTUBE,
} from "@/lib/site";
import { CTA_BUTTON, GLASS, GLASS_BUTTON, GLASS_CARD } from "@/lib/styles";
import { cn } from "@/lib/utils";
import Hero from "./hero";
import logo from "./logo.jpeg";

const icons = { "School Tuition": BookOpen, "Spoken English & Personal Growth": MessageCircle, "Computer & Digital Skills": Monitor };
const courses = COURSES.map((course) => ({ ...course, icon: icons[course.title] }));

const reasons = [
  ["Personal attention", "Teachers make sure no student is left behind."],
  ["Concept-based learning", "Understanding first, not rote memorisation."],
  ["Regular tests & assessments", "Frequent tests show what is learnt and what needs work."],
  ["Individual progress tracking", "Each student's progress is followed closely."],
  ["Supportive environment", "A friendly place where students feel free to ask questions."],
];

// Plain facts in one paragraph, so search engines and AI answers can quote who, what and where.
const about = `Rise Academy (राइज़ एकेडमी) is a coaching centre at A-117, Bajghera Road, New Palam Vihar, Sector 110, Gurugram. It offers school tuition for Classes 1 to 12, spoken English, personality development, interview preparation, IELTS and PTE coaching, and computer courses including MS Office, Advanced Excel, Tally, digital marketing and website designing. Students rate it ${RATING} out of 5 on Google across ${REVIEW_COUNT.toLocaleString("en-IN")} reviews.`;

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
  sameAs: ["https://rise-academy.grexa.site", YOUTUBE, INSTAGRAM.url],
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

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="top">
        <Motion />
        <Hero />

        <section id="courses" className="py-14 sm:py-20">
          <div data-reveal className="px-5 sm:px-8 lg:px-12">
            <SectionTitle eyebrow="The best coaching in Gurugram" title="Our courses" />
            <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">{about}</p>
            <div data-reveal className="grid gap-5 md:grid-cols-3">
              {courses.map(({ icon: Icon, slug, title, text, items }) => (
                <Card key={title} className={`p-2 ${GLASS_CARD}`}>
                  <CardHeader>
                    <Icon className="size-8 text-white/80" aria-hidden />
                    <CardTitle className="mt-3 text-xl font-semibold tracking-tight">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex grow flex-col text-base text-muted-foreground">
                    <p>{text}</p>
                    <ul className="mt-4 mb-5 flex flex-wrap gap-2">
                      {items.map((item) => (
                        <li key={item}>
                          <Badge variant="secondary">{item}</Badge>
                        </li>
                      ))}
                    </ul>
                    {/* prefetch={false}: see components/Footer.tsx */}
                    <Link href={`/courses/${slug}/`} prefetch={false} className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-white hover:underline">
                      More about {title} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="py-14 sm:py-20">
          <div data-reveal className="px-5 sm:px-8 lg:px-12">
            <SectionTitle eyebrow="Why students choose us" title="Why Rise Academy" />
            <ul data-reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {reasons.map(([title, text]) => (
                <li key={title} className={GLASS}>
                  <strong className="block font-semibold">{title}</strong>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* From his own Instagram bio (lib/site.ts); his photo is the one on that profile. */}
        <section id="founder" className="py-14 sm:py-20">
          <div data-reveal className="px-5 sm:px-8 lg:px-12">
            <SectionTitle eyebrow="Meet the founder" title="Ravil Sir" />
            <div className={`flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-start ${GLASS}`}>
              <Image
                src={asset("instagram/profile.webp")}
                alt="Ravil Sir, founder of Rise Academy"
                width={96}
                height={96}
                unoptimized
                className="size-24 shrink-0 rounded-full ring-2 ring-white/20"
              />
              <div>
                <p className="text-lg leading-relaxed">
                  Ravil Sir founded Rise Academy and UniKids School. A Delhi University alumnus with an IELTS band score of
                  8.5, he teaches spoken English, grammar and exam English himself: the classes below are his.
                </p>
                <figure className="mt-5 border-l-2 border-white/30 pl-4">
                  <blockquote className="text-white/80">“Ravil sir is definitely the best mentor of my life.”</blockquote>
                  <figcaption className="mt-1 text-sm text-muted-foreground">Vinit Rana, Google review</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {VIDEOS.length > 0 && (
          <section id="classes" className="py-14 sm:py-20">
            <div data-reveal className="px-5 sm:px-8 lg:px-12">
              <SectionTitle eyebrow="See how we teach" title="Inside our classes" />
              <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
                Real classes with Ravil Sir: spoken English, grammar, and preparation for SSC CGL, CUET and job interviews.
              </p>
              {/* From 1280px the first video sits large on the left with the others beside it, so on a full-width page it
                  never grows taller than the screen. */}
              <ul data-reveal className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {VIDEOS.map(({ id, title }, i) => (
                  <li key={id} className={cn("rounded-2xl bg-white/10 p-1.5 backdrop-blur-lg", i === 0 && "sm:col-span-2 xl:row-span-2")}>
                    <YouTube id={id} title={title} hd={i === 0} />
                    <p className="px-3 pt-3 pb-2 text-sm font-medium text-white/85">{title}</p>
                  </li>
                ))}
              </ul>
              <a href={YOUTUBE} target="_blank" rel="noopener" className={cn(GLASS_BUTTON, "mt-8")}>
                Watch more classes on YouTube
              </a>
            </div>
          </section>
        )}

        <section id="reviews" className="py-14 sm:py-20">
          <div data-reveal className="grid items-center gap-10 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
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
                className={GLASS_BUTTON}
              >
                Read all {REVIEW_COUNT.toLocaleString("en-IN")} reviews on Google
              </a>
            </div>
            {/* Narrow, tall cards with small offsets: the stack scales down to fit its column, so this keeps the
                review text readable on phones. The negative margin lets it use the full phone width. */}
            <div className="-mx-5 sm:mx-0">
            <CardSwap label="Student reviews" width={280} height={360} cardDistance={14} verticalDistance={22} depth={60} visibleCards={3} delay={5000}>
              {REVIEWS.map(({ name, text }) => (
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

        {REVIEW_VIDEOS.length > 0 && (
          <section id="video-reviews" className="py-14 sm:py-20">
            {/* From 1536px the heading sits beside the videos, like the Google reviews above, instead of three phones
                spread far apart across a wide screen. */}
            <div data-reveal className="items-center gap-10 px-5 sm:px-8 lg:px-12 2xl:grid 2xl:grid-cols-[1fr_auto]">
              <div>
                <SectionTitle eyebrow="In their own words" title="What students and parents say" />
                <p className="mb-8 max-w-3xl leading-relaxed text-muted-foreground">
                  Rise Academy students and parents talk about their experience, filmed at the academy.
                </p>
              </div>
              <VideoReviews
                videos={REVIEW_VIDEOS.map((n) => ({
                  src: asset(`reviews/review-${n}.mp4`),
                  poster: asset(`reviews/review-${n}.webp`),
                  captions: asset(`reviews/review-${n}.vtt`),
                  label: `Video review ${n} of ${REVIEW_VIDEOS.length} from a Rise Academy student or parent`,
                }))}
              />
            </div>
          </section>
        )}

        <section id="instagram" className="py-14 sm:py-20">
          <div data-reveal className="grid items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
            <div>
              <SectionTitle eyebrow={`@${INSTAGRAM.handle}`} title="Follow us on Instagram" />
              <p className="max-w-md leading-relaxed text-muted-foreground">
                Classes, new joiners, our faculty and everyday life at Rise Academy, posted by Ravil Sir and the team.
              </p>
            </div>
            {/* The profile as the Instagram app shows it in dark mode; a soft light follows the pointer. */}
            <SpotlightCard
              className="w-full max-w-lg p-5! backdrop-blur-lg sm:p-7! lg:justify-self-end"
              style={{ "--spotlight-card-surface": "rgb(12 16 20 / 0.8)" }}
            >
              <p className="flex items-center gap-2 font-semibold">
                <HugeiconsIcon icon={InstagramIcon} size={20} aria-hidden /> {INSTAGRAM.handle}
              </p>
              <div className="mt-5 flex items-center gap-4 sm:gap-6">
                <a
                  href={INSTAGRAM.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={`${INSTAGRAM.name} on Instagram`}
                  className="shrink-0 rounded-full bg-linear-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] p-[3px]"
                >
                  <Image
                    src={asset("instagram/profile.webp")}
                    alt=""
                    width={96}
                    height={96}
                    unoptimized
                    className="size-20 rounded-full border-[3px] border-[#0c1014] sm:size-24"
                  />
                </a>
                <div className="min-w-0 grow">
                  <p className="font-semibold">{INSTAGRAM.name}</p>
                  <ul className="mt-2 flex justify-between gap-2 text-sm">
                    {INSTAGRAM.stats.map(([n, label]) => (
                      <li key={label} className="flex flex-col">
                        <strong className="text-base font-semibold">{n.toLocaleString("en-IN")}</strong>
                        <span className="text-white/80">{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/50">{INSTAGRAM.category}</p>
              <p className="mt-1 text-sm leading-relaxed">
                {INSTAGRAM.bio.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 text-sm font-semibold">
                <a
                  href={INSTAGRAM.url}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Follow ${INSTAGRAM.name} on Instagram`}
                  className="rounded-lg bg-[#4a5df9] py-2 text-center text-white transition-colors hover:bg-[#3e50e6]"
                >
                  Follow
                </a>
                <a
                  href={`https://ig.me/m/${INSTAGRAM.handle}`}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Message ${INSTAGRAM.name} on Instagram`}
                  className="rounded-lg bg-white/10 py-2 text-center transition-colors hover:bg-white/15"
                >
                  Message
                </a>
              </div>
              <ul className="mt-6 flex gap-3 overflow-x-auto" aria-label="Story highlights">
                {INSTAGRAM.highlights.map((label, i) => (
                  <li key={label} className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 whitespace-nowrap text-center text-xs">
                    <Image
                      src={asset(`instagram/highlight-${i + 1}.webp`)}
                      alt=""
                      width={64}
                      height={64}
                      unoptimized
                      className="size-16 rounded-full border-2 border-[#0c1014] ring-2 ring-white/25"
                    />
                    {label}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </div>
        </section>

        <section id="faq" className="py-14 sm:py-20">
          <div data-reveal className="px-5 sm:px-8 lg:px-12">
            <SectionTitle eyebrow="Asked by parents and students" title="Common questions" />
            <FaqChat faqs={Object.values(FAQ)} logo={logo} whatsapp={WHATSAPP} />
          </div>
        </section>

        <section id="contact" className="py-14 sm:py-20">
          <div data-reveal className="px-5 sm:px-8 lg:px-12">
            <SectionTitle eyebrow="Visit or call us" title="Contact" />
            <div data-reveal className="grid items-start gap-5 md:grid-cols-2">
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
                  <a href={WHATSAPP} target="_blank" rel="noopener" className={CTA_BUTTON}>WhatsApp us</a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`}
                    target="_blank"
                    rel="noopener"
                    className={GLASS_BUTTON}
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

      <Footer />
      <ContactBar afterHero />
    </>
  );
}

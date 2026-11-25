import type { Metadata } from "next";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import Stars from "@/components/Stars";
import YouTube from "@/components/YouTube";
import { COURSES } from "@/lib/courses";
import { ADDRESS, FAQ, MAPS_QUERY, OG_IMAGE, PHONE, PHONE_DISPLAY, REVIEWS, VIDEOS, WHATSAPP, YOUTUBE } from "@/lib/site";
import { CTA_BUTTON, GLASS, GLASS_BUTTON } from "@/lib/styles";
import { cn } from "@/lib/utils";

// One page per course group (/courses/school-tuition/ and so on), so each can be found on Google for its own searches.
// Only facts already on the site; batch timings, fees and results go here once the academy sends them.
type Slug = (typeof COURSES)[number]["slug"];
const QUESTIONS: Record<Slug, (keyof typeof FAQ)[]> = {
  "school-tuition": ["classes", "timings", "where", "join"],
  "spoken-english": ["ielts", "timings", "where", "join"],
  "computer-courses": ["timings", "where", "join"],
};

export const dynamicParams = false;
export const generateStaticParams = () => COURSES.map(({ slug }) => ({ slug }));
const courseFor = async (params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  return COURSES.find((c) => c.slug === slug)!; // dynamicParams = false: only the slugs above exist
};

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const course = await courseFor(params);
  const title = `${course.heading} | Rise Academy`;
  const description = `${course.text} ${course.items.join(", ")}. Rise Academy, A-117 Bajghera Road, New Palam Vihar, Sector 110, Gurugram. Call ${PHONE_DISPLAY}.`;
  return {
    title,
    description,
    alternates: { canonical: "./" },
    openGraph: { type: "website", locale: "en_IN", siteName: "Rise Academy", url: "./", title, description, images: [OG_IMAGE] },
  };
}

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const course = await courseFor(params);
  const ask = `${WHATSAPP}?text=${encodeURIComponent(`Hi Rise Academy, I'd like to know about ${course.title}.`)}`;
  const reviews = REVIEWS.filter((r) => r.course === course.slug);
  const videos = course.slug === "spoken-english" ? VIDEOS : []; // the YouTube classes are all English lessons
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-white">Home</Link> / <Link href="/#courses" className="hover:text-white">Courses</Link> /{" "}
        {course.title}
      </nav>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{course.heading}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
        {course.text} At Rise Academy, A-117 Bajghera Road, New Palam Vihar, Sector 110, Gurugram.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={ask} target="_blank" rel="noopener" className={CTA_BUTTON}>Ask on WhatsApp</a>
        <a href={`tel:${PHONE}`} className={GLASS_BUTTON}>Call {PHONE_DISPLAY}</a>
      </div>

      <section className="mt-16">
        <SectionTitle eyebrow={course.title} title="What you can learn" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {course.items.map((item) => (
            <li key={item} className={cn(GLASS, "font-medium")}>{item}</li>
          ))}
        </ul>
      </section>

      {videos.length > 0 && (
        <section className="mt-16">
          <SectionTitle eyebrow="See how we teach" title="Classes with Ravil Sir" />
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map(({ id, title }) => (
              <li key={id} className="rounded-2xl bg-white/10 p-1.5 backdrop-blur-lg">
                <YouTube id={id} title={title} />
                <p className="px-3 pt-3 pb-2 text-sm font-medium text-white/85">{title}</p>
              </li>
            ))}
          </ul>
          <a href={YOUTUBE} target="_blank" rel="noopener" className={cn(GLASS_BUTTON, "mt-8")}>
            Watch more classes on YouTube
          </a>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mt-16">
          <SectionTitle eyebrow="Google reviews" title="What students say" />
          <ul className="grid gap-5 md:grid-cols-2">
            {reviews.map(({ name, text }) => (
              <li key={name} className={GLASS}>
                <figure>
                  <Stars />
                  <blockquote className="mt-3 leading-relaxed text-white/85">“{text}”</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold">{name}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <SectionTitle eyebrow="Asked by parents and students" title="Common questions" />
        <dl className="grid max-w-3xl gap-3">
          {QUESTIONS[course.slug].map((key) => (
            <div key={key} className={GLASS}>
              <dt className="font-semibold">{FAQ[key][0]}</dt>
              <dd className="mt-2 leading-relaxed text-white/80">{FAQ[key][1]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="Visit or call us" title="Rise Academy, Sector 110" />
        <p className="max-w-2xl text-lg leading-relaxed">{ADDRESS}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={ask} target="_blank" rel="noopener" className={CTA_BUTTON}>WhatsApp us</a>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`} target="_blank" rel="noopener" className={GLASS_BUTTON}>
            Get directions
          </a>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle eyebrow="Also at Rise Academy" title="Other courses" />
        <ul className="flex flex-wrap gap-3">
          {COURSES.filter((c) => c.slug !== course.slug).map((c) => (
            <li key={c.slug}>
              {/* prefetch={false}: see components/Footer.tsx */}
              <Link href={`/courses/${c.slug}/`} prefetch={false} className={GLASS_BUTTON}>{c.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

import Link from "next/link";
import { COURSES } from "@/lib/courses";

// Links to every course page and the privacy policy. Extra space at the bottom on phones, where the Call / WhatsApp bar sits.
// prefetch={false} on links to the course and privacy pages: in a static export, Next.js 16 asks for their prefetch files
// under names its build doesn't write (404s on every visit). A click still opens them in-app, without a full reload.
export default function Footer() {
  return (
    <footer className="border-t px-5 pt-8 pb-28 text-sm text-muted-foreground sm:px-8 md:pb-8 lg:px-12">
      <nav aria-label="Courses and policies" className="flex flex-wrap gap-x-6 gap-y-2">
        {COURSES.map(({ slug, title }) => (
          <Link key={slug} href={`/courses/${slug}/`} prefetch={false} className="hover:text-white">
            {title}
          </Link>
        ))}
        <Link href="/privacy/" prefetch={false} className="hover:text-white">
          Privacy policy
        </Link>
      </nav>
      <p className="mt-4">© Rise Academy · राइज़ एकेडमी · Sector 110, Gurugram</p>
    </footer>
  );
}

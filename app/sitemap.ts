import type { MetadataRoute } from "next";
import { COURSES } from "@/lib/courses";
import { SITE_URL } from "@/lib/site";

// Every public page, for Google Search Console (not /admin).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...COURSES.map(({ slug }) => `courses/${slug}/`), "privacy/"].map((path) => ({ url: new URL(path, SITE_URL).href }));
}

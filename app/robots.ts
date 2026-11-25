import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Crawlers read robots.txt only at the top of a domain, so this starts to count once the site has its own domain.
// /admin isn't blocked here: its pages say "noindex" themselves, which crawlers can only see if they may open them.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("sitemap.xml", SITE_URL).href };
}

import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Localhost (no NEXT_PUBLIC_SITE_URL set) is never indexed.
export default function robots(): MetadataRoute.Robots {
  const dev = site.url.includes("localhost");
  return {
    rules: dev ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: "/" },
    sitemap: dev ? undefined : `${site.url}/sitemap.xml`,
  };
}

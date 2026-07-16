import type { MetadataRoute } from "next";
import { clientEnv } from "@/lib/env";

/**
 * robots.txt (SPEC M7 DoD). Marketing is crawlable; the app, admin, checkout
 * and auth surfaces are disallowed — they hold personal/sensitive flows and
 * have no SEO value.
 */
export default function robots(): MetadataRoute.Robots {
  const base = clientEnv.NEXT_PUBLIC_SITE_URL;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app", "/admin", "/kassa", "/logga-in", "/callback"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

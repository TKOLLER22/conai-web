import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getInsights } from "@/lib/insights";
import { SITE_URL } from "@/lib/seo";

const PATHS = [
  "",
  "/about",
  "/services",
  "/individuals",
  "/pricing",
  "/work",
  "/insights",
  "/book-audit",
  "/contact",
  "/careers",
  "/referral",
  "/advisor",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ),
      },
    })),
  );

  const articles = routing.locales.flatMap((locale) =>
    getInsights(locale).map((insight) => ({
      url: `${SITE_URL}/${locale}/insights/${insight.slug}`,
      lastModified: new Date(insight.date),
    })),
  );

  return [...pages, ...articles];
}

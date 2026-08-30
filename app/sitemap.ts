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
  // Locale prefixes are never exposed (cookie-based language) — one URL per
  // page. Crawlers see the default locale (sk). Static pages carry no
  // lastModified — stamping every deploy's build time on all of them would
  // tell crawlers everything changed when nothing did; articles keep their
  // real publication dates.
  const pages = PATHS.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
  }));

  // Article slugs are locale-specific, so both locales' articles keep
  // distinct, crawlable URLs.
  const articles = routing.locales.flatMap((locale) =>
    getInsights(locale).map((insight) => ({
      url: `${SITE_URL}/insights/${insight.slug}`,
      lastModified: new Date(insight.date),
    })),
  );

  return [...pages, ...articles];
}

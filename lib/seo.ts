/** Override per environment (e.g. a Coolify staging domain) at build time. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://conai.sk";

/**
 * Canonical for a path. Locale prefixes are never exposed in URLs
 * (localePrefix: "never" — the language is cookie-based), so there is one
 * canonical URL per page and no hreflang set. The `locale` parameter is kept
 * for call-site stability.
 */
export function seoAlternates(_locale: string, path: string) {
  return { canonical: path };
}

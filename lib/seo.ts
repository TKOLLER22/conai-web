/**
 * Origins allowed to be indexed. conai.tomaskoller.sk is the LIVE domain for
 * now; at the conai.sk launch, make conai.sk the DEFAULT_URL below and 301
 * the subdomain to it (see CLAUDE.md launch checklist).
 */
export const INDEXABLE_URLS = [
  "https://conai.sk",
  "https://conai.tomaskoller.sk",
];

const DEFAULT_URL = "https://conai.tomaskoller.sk";

/** Override per environment at build time. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_URL;

/** Anything not in the allowlist (previews, local) must never be indexed. */
export const IS_PRODUCTION_DOMAIN = INDEXABLE_URLS.includes(SITE_URL);

/**
 * Canonical for a path. Locale prefixes are never exposed in URLs
 * (localePrefix: "never" — the language is cookie-based), so there is one
 * canonical URL per page and no hreflang set.
 */
export function seoCanonical(path: string) {
  return { canonical: path };
}

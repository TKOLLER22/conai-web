/** Override per environment (e.g. a Coolify staging domain) at build time. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://conai.sk";

/**
 * hreflang alternates + canonical for a locale-prefixed path.
 * The homepage canonical must be "/sk" (no trailing slash) — that is the URL
 * Next actually serves; "/sk/" 308-redirects.
 */
export function seoAlternates(locale: string, path: string) {
  const p = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${p}`,
    languages: {
      sk: `/sk${p}`,
      en: `/en${p}`,
      "x-default": `/sk${p}`,
    },
  };
}

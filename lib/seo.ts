export const SITE_URL = "https://conai.sk";

/** hreflang alternates + canonical for a locale-prefixed path. */
export function seoAlternates(locale: string, path: string) {
  const p = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${p || "/"}`,
    languages: {
      sk: `/sk${p || "/"}`,
      en: `/en${p || "/"}`,
      "x-default": `/sk${p || "/"}`,
    },
  };
}

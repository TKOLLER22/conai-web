import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Insight = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  readMinutes: number;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");
const REQUIRED_FIELDS = ["title", "date", "category", "excerpt"] as const;

/** Runs at build time (SSG) — throw loudly instead of shipping broken pages. */
function validateFrontmatter(
  data: Record<string, unknown>,
  file: string,
): void {
  for (const field of REQUIRED_FIELDS) {
    if (typeof data[field] !== "string" || (data[field] as string).length === 0) {
      throw new Error(`Insight "${file}" is missing frontmatter field "${field}"`);
    }
  }
  if (Number.isNaN(new Date(data.date as string).getTime())) {
    throw new Error(`Insight "${file}" has an unparseable date: "${data.date}"`);
  }
}

export function getInsights(locale: string): Insight[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      validateFrontmatter(data, `${locale}/${file}`);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        category: data.category as string,
        excerpt: data.excerpt as string,
        readMinutes: typeof data.readMinutes === "number" ? data.readMinutes : 1,
        content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getInsight(locale: string, slug: string): Insight | null {
  return getInsights(locale).find((insight) => insight.slug === slug) ?? null;
}

/**
 * Slugs are locale-specific; the visitor's cookie locale may not own the
 * requested slug. Fall back to whichever locale does, so every article URL
 * resolves for every visitor (and for crawlers).
 */
export function findInsight(
  locales: readonly string[],
  locale: string,
  slug: string,
): { insight: Insight; locale: string } | null {
  const own = getInsight(locale, slug);
  if (own) return { insight: own, locale };
  for (const other of locales) {
    if (other === locale) continue;
    const foreign = getInsight(other, slug);
    if (foreign) return { insight: foreign, locale: other };
  }
  return null;
}

export function formatInsightDate(locale: string, date: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

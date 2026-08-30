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
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        category: data.category as string,
        excerpt: data.excerpt as string,
        readMinutes: (data.readMinutes as number) ?? 1,
        content,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getInsight(locale: string, slug: string): Insight | null {
  return getInsights(locale).find((insight) => insight.slug === slug) ?? null;
}

import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { findInsight, formatInsightDate, getInsights } from "@/lib/insights";
import FinalCta from "@/components/ui/FinalCta";
import JsonLd from "@/components/seo/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getInsights(locale).map((insight) => ({ locale, slug: insight.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/insights/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const found = findInsight(routing.locales, locale, slug);
  if (!found) return {};
  return {
    title: `${found.insight.title} | ConAI`,
    description: found.insight.excerpt,
    alternates: { canonical: `/insights/${slug}` },
  };
}

export default async function InsightPage({
  params,
}: PageProps<"/[locale]/insights/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const found = findInsight(routing.locales, locale, slug);
  if (!found) notFound();
  const { insight, locale: contentLocale } = found;

  const t = await getTranslations("insights");
  const tHome = await getTranslations("home");

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: insight.title,
          description: insight.excerpt,
          datePublished: insight.date,
          inLanguage: contentLocale,
          author: { "@type": "Organization", name: "ConAI" },
        }}
      />
      <article className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
        <div
          aria-hidden
          className="aura-brand absolute -top-[50vmin] right-[-25vmin] h-[90vmin] w-[90vmin] opacity-40"
        />
        <Container className="max-w-4xl">
          <Reveal>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-fg-faint transition-colors hover:text-fg"
            >
              <ArrowLeft strokeWidth={1.5} aria-hidden className="size-3.5" />
              {t("back")}
            </Link>
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
              <span className="text-brand-400">{insight.category}</span>
              <time dateTime={insight.date}>
                {formatInsightDate(contentLocale, insight.date)}
              </time>
              <span>{t("readTime", { min: insight.readMinutes })}</span>
            </div>
            <h1 className="text-display mt-6 text-3xl sm:text-4xl md:text-5xl">
              {insight.title}
            </h1>
            <div className="prose-insight mt-12">
              <MDXRemote source={insight.content} />
            </div>
          </Reveal>
        </Container>
      </article>

      <FinalCta title={tHome("cta.title")} />
    </main>
  );
}

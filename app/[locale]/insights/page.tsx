import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoCanonical } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { formatInsightDate, getInsights } from "@/lib/insights";
import FinalCta from "@/components/ui/FinalCta";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/insights">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "insights.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoCanonical("/insights"),
  };
}

export default async function InsightsPage({
  params,
}: PageProps<"/[locale]/insights">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const tHome = await getTranslations("home");
  const insights = getInsights(locale);

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("title"),
    itemListElement: insights.map((insight, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: insight.title,
      url: `${SITE_URL}/insights/${insight.slug}`,
    })),
  };

  return (
    <main>
      <JsonLd data={listJsonLd} />
      <PageHeader kicker={t("kicker")} title={t("title")} intro={t("intro")} />

      <Container className="pb-8">
        <div className="flex flex-col">
          {insights.map((insight, i) => (
            <Reveal key={insight.slug} delay={i * 0.05}>
              <Link
                href={`/insights/${insight.slug}`}
                className="group grid gap-4 border-t border-line py-10 transition-colors hover:bg-fg/[0.03] md:grid-cols-12 md:gap-8 md:py-12"
              >
                <div className="flex flex-row gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint md:col-span-3 md:flex-col md:gap-2">
                  <span className="text-brand-400">{insight.category}</span>
                  <time dateTime={insight.date}>
                    {formatInsightDate(locale, insight.date)}
                  </time>
                  <span>{t("readTime", { min: insight.readMinutes })}</span>
                </div>
                <div className="md:col-span-8">
                  <h2 className="text-display max-w-2xl text-2xl md:text-4xl">
                    {insight.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-fg-muted md:text-lg">
                    {insight.excerpt}
                  </p>
                </div>
                <div className="hidden items-start justify-end md:col-span-1 md:flex">
                  <ArrowRight strokeWidth={1.5}
                    aria-hidden
                    className="mt-2 size-5 text-fg-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-400"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      <FinalCta title={tHome("cta.title")} />
    </main>
  );
}

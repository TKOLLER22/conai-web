import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoCanonical } from "@/lib/seo";
import FinalCta from "@/components/ui/FinalCta";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/individuals">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "individuals.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoCanonical("/individuals"),
  };
}

type Offer = { title: string; desc: string; price?: string };

export default async function IndividualsPage({
  params,
}: PageProps<"/[locale]/individuals">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("individuals");
  const offers = t.raw("offers") as Offer[];

  return (
    <main>
      <PageHeader kicker={t("kicker")} title={t("title")} intro={t("intro")} />

      <Container className="pb-8">
        <Reveal>
          <div className="max-w-2xl border-l-2 border-brand-500/50 pl-6">
            <h2 className="text-display text-2xl md:text-3xl">{t("approachTitle")}</h2>
            <p className="mt-3 text-lg leading-relaxed text-fg-muted">
              {t("approachText")}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {offers.map((offer, i) => (
            <Reveal key={offer.title} delay={i * 0.06}>
              <article className="flex h-full min-h-52 flex-col rounded-3xl border border-line bg-ink-850/80 p-8 md:p-9">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-display text-2xl">{offer.title}</h3>
                  {offer.price && (
                    <span className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-brand-300">
                      {offer.price}
                    </span>
                  )}
                </div>
                <p className="mt-4 max-w-[54ch] leading-relaxed text-fg-muted md:text-lg">
                  {offer.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>

      <FinalCta title={t("ctaTitle")} subtitle={t("ctaDesc")} />
    </main>
  );
}

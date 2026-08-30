import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoCanonical } from "@/lib/seo";
import Badge from "@/components/ui/Badge";
import FinalCta from "@/components/ui/FinalCta";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/advisor">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "advisor.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoCanonical("/advisor"),
  };
}

export default async function AdvisorPage({
  params,
}: PageProps<"/[locale]/advisor">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("advisor");
  const features = t.raw("features") as { title: string; desc: string }[];

  return (
    <main>
      <PageHeader
        kicker={t("kicker")}
        title={t("title")}
        intro={t("intro")}
        badge={<Badge>{t("badge")}</Badge>}
      />

      <Container className="pb-8">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.07}>
              <h2 className="text-display text-2xl">{feature.title}</h2>
              <p className="mt-3 leading-relaxed text-fg-muted md:text-lg">
                {feature.desc}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16">
          <p className="max-w-xl border-l-2 border-brand-500/50 pl-5 text-fg-muted">
            {t("note")}
          </p>
        </Reveal>
      </Container>

      <FinalCta title={t("ctaTitle")} subtitle={t("ctaDesc")} />
    </main>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const sections = t.raw("sections") as { h: string; p: string }[];

  return (
    <main>
      <PageHeader kicker={t("kicker")} title={t("title")} intro={t("updated")} />

      <Container className="max-w-4xl pb-28 md:pb-40">
        <Reveal>
          <div className="flex flex-col gap-12">
            {sections.map((section) => (
              <section key={section.h}>
                <h2 className="text-display text-2xl">{section.h}</h2>
                <p className="mt-4 max-w-[65ch] text-lg leading-relaxed text-fg-muted">
                  {section.p}
                </p>
              </section>
            ))}
          </div>
        </Reveal>
      </Container>
    </main>
  );
}

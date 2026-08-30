import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import FinalCta from "@/components/ui/FinalCta";
import JsonLd from "@/components/seo/JsonLd";
import Kicker from "@/components/ui/Kicker";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Section, { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tHome = await getTranslations("home");
  const blocks = t.raw("blocks") as { kicker: string; text: string }[];
  const faq = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <PageHeader kicker={t("kicker")} title={t("title")} />

      <Container>
        <div className="grid gap-14 md:grid-cols-3 md:gap-10">
          {blocks.map((block, i) => (
            <Reveal key={block.kicker} delay={i * 0.07}>
              <Kicker>{block.kicker}</Kicker>
              <p className="mt-6 text-lg leading-relaxed text-fg-muted">{block.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Statement */}
      <Section rule className="!py-24 md:!py-36">
        <Reveal className="mx-auto max-w-4xl text-center">
          <blockquote className="text-display text-3xl leading-snug md:text-5xl md:leading-[1.15]">
            <span className="text-gradient-brand">{t("statement")}</span>
          </blockquote>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section id="faq" rule>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Kicker>{t("faq.kicker")}</Kicker>
              <h2 className="text-display mt-5 max-w-sm text-4xl md:text-5xl">
                {t("faq.title")}
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <div className="flex flex-col">
              {faq.map((item) => (
                <details key={item.q} className="group border-t border-line py-6 md:py-7">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium transition-colors hover:text-brand-300 md:text-xl">
                    {item.q}
                    <Plus strokeWidth={1.5}
                      aria-hidden
                      className="size-5 shrink-0 text-fg-faint transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="mt-4 max-w-[60ch] leading-relaxed text-fg-muted md:text-lg">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <FinalCta title={tHome("cta.title")} />
    </main>
  );
}

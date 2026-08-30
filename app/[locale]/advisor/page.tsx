import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import FinalCta from "@/components/home/FinalCta";
import Kicker from "@/components/ui/Kicker";
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
    alternates: seoAlternates(locale, "/advisor"),
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
      <header className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
        <div
          aria-hidden
          className="aura-brand absolute -top-[45vmin] right-[-20vmin] h-[90vmin] w-[90vmin] opacity-50"
        />
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-center gap-5">
              <Kicker>{t("kicker")}</Kicker>
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-signal-300/90">
                <span className="size-1.5 animate-pulse rounded-full bg-signal-300" />
                {t("badge")}
              </span>
            </div>
            <h1 className="text-display mt-6 max-w-4xl text-4xl sm:text-5xl md:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-fg-muted md:text-xl">
              {t("intro")}
            </p>
          </Reveal>
        </Container>
      </header>

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

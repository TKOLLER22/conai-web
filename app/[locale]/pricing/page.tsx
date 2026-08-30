import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Calculator from "@/components/roi/Calculator";
import FinalCta from "@/components/home/FinalCta";
import Kicker from "@/components/ui/Kicker";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Section, { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/pricing">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing.meta" });
  return { title: t("title"), description: t("description") };
}

type Package = { name: string; price: string; desc: string; href: string };

export default async function PricingPage({
  params,
}: PageProps<"/[locale]/pricing">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const tHome = await getTranslations("home");
  const packages = t.raw("packages") as Package[];
  const factors = t.raw("factors.items") as string[];

  return (
    <main>
      <PageHeader kicker={t("kicker")} title={t("title")} intro={t("intro")} />

      <Container>
        {/* Package summary — rows, not cards */}
        <div className="flex flex-col">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.name} delay={i * 0.04}>
              <Link
                href={pkg.href}
                className="group grid items-baseline gap-2 border-t border-line py-7 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:gap-6 md:py-8"
              >
                <h2 className="text-display text-2xl md:col-span-4 md:text-3xl">
                  {pkg.name}
                </h2>
                <p className="text-fg-muted md:col-span-4 md:text-lg">{pkg.desc}</p>
                <div className="flex items-center justify-between gap-4 md:col-span-4 md:justify-end">
                  <span className="whitespace-nowrap font-mono text-sm text-brand-300 md:text-base">
                    {pkg.price}
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 text-fg-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-400"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* What drives the price */}
        <Reveal className="hairline-t mt-4 pt-16 md:pt-20">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-display text-3xl md:text-4xl">{t("factors.title")}</h2>
              <p className="mt-4 max-w-sm text-lg text-fg-muted">{t("factors.intro")}</p>
            </div>
            <ol className="flex flex-col gap-4 lg:col-span-6 lg:col-start-7">
              {factors.map((factor, i) => (
                <li key={factor} className="flex items-baseline gap-5 text-lg md:text-xl">
                  <span className="font-mono text-sm text-brand-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {factor}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>

      {/* ROI calculator */}
      <Section id="roi" rule className="mt-16 md:mt-24">
        <Reveal>
          <Kicker>{t("roi.kicker")}</Kicker>
          <h2 className="text-display mt-5 max-w-3xl text-4xl md:text-6xl">
            {t("roi.title")}
          </h2>
        </Reveal>
        <Reveal className="mt-14 md:mt-20">
          <Calculator />
        </Reveal>
      </Section>

      <FinalCta title={tHome("cta.title")} />
    </main>
  );
}

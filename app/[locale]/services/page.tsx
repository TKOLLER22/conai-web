import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoCanonical } from "@/lib/seo";
import Button from "@/components/ui/Button";
import FinalCta from "@/components/ui/FinalCta";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoCanonical("/services"),
  };
}

type Tier = {
  id: string;
  level: string;
  title: string;
  price: string;
  for: string;
  includes: string[];
  approach: string;
  examples: { name: string; desc?: string }[];
};

function TierBlock({
  tier,
  labels,
  children,
}: {
  tier: Tier;
  labels: { forWho: string; includesTitle: string; examplesTitle: string };
  children?: React.ReactNode;
}) {
  return (
    <article id={tier.id} className="hairline-t py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="kicker">{tier.level}</p>
          <h2 className="text-display mt-5 max-w-md text-3xl md:text-5xl">
            {tier.title}
          </h2>
          <span className="mt-7 inline-block rounded-full border border-line px-5 py-2 font-mono text-sm text-fg-muted">
            {tier.price}
          </span>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
            {labels.forWho}
          </p>
          <p className="mt-2 max-w-sm text-lg leading-relaxed text-fg-muted">
            {tier.for}
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
            {labels.includesTitle}
          </p>
          <ul className="mt-5 flex flex-col gap-4">
            {tier.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg leading-relaxed">
                <Check strokeWidth={1.5} aria-hidden className="mt-1.5 size-4.5 shrink-0 text-mint-400" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 border-l-2 border-brand-500/50 pl-5 text-lg leading-relaxed text-fg-muted">
            {tier.approach}
          </p>

          {tier.examples.length > 0 && (
            <>
              <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
                {labels.examplesTitle}
              </p>
              <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {tier.examples.map((example) => (
                  <li key={example.name}>
                    <span className="font-medium">{example.name}</span>
                    {example.desc && (
                      <span className="mt-0.5 block text-sm text-fg-faint">
                        {example.desc}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {children}
        </div>
      </div>
    </article>
  );
}

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tiers = t.raw("tiers") as Tier[];
  const addon = t.raw("addon") as {
    label: string;
    title: string;
    price: string;
    priceNote: string;
    items: string[];
  };
  const retainer = t.raw("retainer") as Omit<Tier, "id" | "examples" | "level"> & {
    label: string;
  };
  const labels = {
    forWho: t("forWho"),
    includesTitle: t("includesTitle"),
    examplesTitle: t("examplesTitle"),
  };

  const offer = (name: string, minPrice?: number) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name, provider: { "@id": `${SITE_URL}/#organization` } },
    ...(minPrice
      ? {
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice,
            priceCurrency: "EUR",
          },
        }
      : {}),
  });

  // Mirrors the tiers and indicative prices visible on this page.
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: t("title"),
    url: `${SITE_URL}/services`,
    itemListElement: [
      offer(tiers[0].title, 500),
      offer(tiers[1].title, 2500),
      offer(tiers[2].title, 8000),
      offer(tiers[3].title),
      offer(retainer.title, 300),
    ],
  };

  return (
    <main>
      <JsonLd data={servicesJsonLd} />
      <PageHeader kicker={t("kicker")} title={t("title")} intro={t("intro")} />

      <Container>
        {/* Step 0: the free audit */}
        <Reveal>
          <div className="relative mb-16 overflow-hidden rounded-3xl border border-brand-500/30 p-8 md:mb-24 md:p-12">
            <div
              aria-hidden
              className="aura-brand absolute -right-1/4 -top-3/4 h-[60rem] w-[60rem] opacity-60"
            />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <p className="kicker">{t("audit.label")}</p>
                <h2 className="text-display mt-4 text-3xl md:text-4xl">
                  {t("audit.title")}
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-fg-muted">
                  {t("audit.desc")}
                </p>
              </div>
              <Button href="/book-audit" size="lg" className="shrink-0">
                {t("audit.cta")}
              </Button>
            </div>
          </div>
        </Reveal>

        {tiers.map((tier) => (
          <Reveal key={tier.id}>
            <TierBlock tier={tier} labels={labels}>
              {tier.id === "navigation" && (
                <div className="mt-10 rounded-2xl border border-dashed border-line-strong p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
                    {addon.label}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <h3 className="text-display text-xl md:text-2xl">{addon.title}</h3>
                    <span className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-fg-muted">
                      {addon.price}
                    </span>
                  </div>
                  <ul className="mt-5 flex flex-col gap-2.5 text-fg-muted">
                    {addon.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check strokeWidth={1.5} aria-hidden className="mt-1 size-4 shrink-0 text-mint-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
                    {addon.priceNote}
                  </p>
                </div>
              )}
            </TierBlock>
          </Reveal>
        ))}

        {/* Retainer */}
        <Reveal>
          <TierBlock
            tier={{
              id: "retainer",
              level: retainer.label,
              title: retainer.title,
              price: retainer.price,
              for: retainer.for,
              includes: retainer.includes,
              approach: retainer.approach,
              examples: [],
            }}
            labels={labels}
          />
        </Reveal>

        <Reveal>
          <p className="hairline-t pt-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-fg-faint">
            {t("note")}
          </p>
        </Reveal>
      </Container>

      <FinalCta title={t("final.title")} subtitle={t("final.desc")} />
    </main>
  );
}

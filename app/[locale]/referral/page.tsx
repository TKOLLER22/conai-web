import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/referral">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "referral.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale, "/referral"),
  };
}

export default async function ReferralPage({
  params,
}: PageProps<"/[locale]/referral">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("referral");
  const rules = t.raw("rules") as string[];

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

      <Container className="pb-28 md:pb-40">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <p className="text-display text-gradient-brand text-[7rem] leading-none md:text-[10rem]">
              {t("reward")}
            </p>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-fg-muted md:text-xl">
              {t("rewardDesc")}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="kicker">{t("rulesTitle")}</p>
            <ol className="mt-6 flex flex-col gap-4">
              {rules.map((rule, i) => (
                <li key={rule} className="flex items-baseline gap-5 text-lg leading-relaxed">
                  <span className="font-mono text-sm text-brand-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {rule}
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-lg text-sm leading-relaxed text-fg-faint">
              {t("note")}
            </p>
            <div className="mt-10">
              <Button href="mailto:info@conai.sk" variant="secondary">
                {t("cta")}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
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
      <PageHeader
        kicker={t("kicker")}
        title={t("title")}
        intro={t("intro")}
        badge={<Badge>{t("badge")}</Badge>}
      />

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

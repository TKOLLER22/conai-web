import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/careers">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale, "/careers"),
  };
}

export default async function CareersPage({
  params,
}: PageProps<"/[locale]/careers">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");
  const include = t.raw("include") as string[];

  return (
    <main>
      <PageHeader kicker={t("kicker")} title={t("title")} intro={t("intro")} />

      <Container className="pb-28 md:pb-40">
        <Reveal>
          <p className="kicker">{t("includeTitle")}</p>
          <ul className="mt-6 flex max-w-xl flex-col gap-4">
            {include.map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg">
                <Check strokeWidth={1.5} aria-hidden className="mt-1.5 size-4.5 shrink-0 text-mint-400" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Button href="mailto:info@conai.sk">{t("cta")}</Button>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}

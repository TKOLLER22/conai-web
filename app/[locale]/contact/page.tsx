import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoAlternates } from "@/lib/seo";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: seoAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tCta = await getTranslations("common.cta");

  return (
    <main>
      <PageHeader kicker={t("kicker")} title={t("title")} />

      <Container className="pb-28 md:pb-40">
        <div className="grid gap-14 md:grid-cols-2 md:gap-8">
          <Reveal>
            <p className="kicker">{t("writeUs")}</p>
            <a
              href="mailto:info@conai.sk"
              className="text-display mt-5 inline-block break-all text-3xl transition-colors hover:text-brand-300 sm:text-4xl md:text-5xl"
            >
              info@conai.sk
            </a>
            <p className="mt-8 kicker !text-fg-faint">{t("followUs")}</p>
            <a
              href="https://www.linkedin.com/company/conai-ai-solutions-for-smes"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xl text-fg-muted transition-colors hover:text-fg"
            >
              LinkedIn
              <ArrowUpRight aria-hidden className="size-5" />
            </a>
            <p className="mt-12 font-mono text-xs uppercase tracking-[0.14em] text-fg-faint">
              {t("legal")}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 p-8 md:p-10">
              <div
                aria-hidden
                className="aura-brand absolute -right-1/3 -top-2/3 h-[40rem] w-[40rem] opacity-50"
              />
              <div className="relative">
                <p className="kicker">{t("orBook")}</p>
                <h2 className="text-display mt-4 text-2xl md:text-3xl">
                  {tCta("bookAudit")}
                </h2>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-fg-faint">
                  {tCta("auditMeta")}
                </p>
                <div className="mt-8">
                  <Button href="/book-audit">{tCta("audit")}</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}

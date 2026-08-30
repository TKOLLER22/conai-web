import type { Metadata } from "next";
import { ArrowUpRight, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CalEmbed from "@/components/book/CalEmbed";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/book-audit">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bookAudit.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function BookAuditPage({
  params,
}: PageProps<"/[locale]/book-audit">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("bookAudit");
  const tHome = await getTranslations("home.hero");
  const tCta = await getTranslations("common.cta");

  return (
    <main>
      <PageHeader kicker={t("kicker")} title={t("title")} intro={t("intro")} />

      <Container className="pb-24 md:pb-32">
        <Reveal>
          <ul className="mb-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-fg-muted">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <Check aria-hidden className="size-4 text-mint-400" />
                {tHome(`bullets.${i}`)}
              </li>
            ))}
          </ul>

          <p className="mb-10 max-w-2xl border-l-2 border-brand-500/50 pl-5 text-fg-muted">
            {t("note")}
          </p>

          <CalEmbed />

          <p className="mt-6 text-sm text-fg-faint">
            {t("fallback")}{" "}
            <a
              href="https://cal.eu/conai/audit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-400 transition-colors hover:text-brand-300"
            >
              cal.eu/conai/audit
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          </p>

          <p className="mt-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-fg-faint">
            {tCta("auditMeta")}
          </p>
        </Reveal>
      </Container>
    </main>
  );
}

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Logo from "@/components/ui/Logo";
import { Container } from "@/components/ui/Section";

const COLUMNS = [
  {
    title: "firma",
    links: [
      { key: "about", href: "/about" },
      { key: "work", href: "/work" },
      { key: "insights", href: "/insights" },
      { key: "careers", href: "/careers" },
      { key: "contact", href: "/contact" },
    ],
  },
  {
    title: "sluzby",
    links: [
      { key: "forCompanies", href: "/services" },
      { key: "forIndividuals", href: "/individuals" },
      { key: "pricing", href: "/pricing" },
      { key: "roiCalc", href: "/pricing#roi" },
      { key: "referral", href: "/referral" },
    ],
  },
] as const;

export default function Footer() {
  const t = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t relative overflow-hidden bg-ink-950">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-5">
            <Link href="/" aria-label="ConAI">
              <Logo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-fg-muted">
              {t("footer.tagline")}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={t(`footer.${col.title}`)}>
              <h3 className="kicker mb-5 !text-fg-faint">{t(`footer.${col.title}`)}</h3>
              <ul className="flex flex-col gap-3 text-sm text-fg-muted">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className="transition-colors hover:text-fg">
                      {t(`nav.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label={t("footer.pomoc")}>
            <h3 className="kicker mb-5 !text-fg-faint">{t("footer.pomoc")}</h3>
            <ul className="flex flex-col gap-3 text-sm text-fg-muted">
              <li>
                <Link href="/about#faq" className="transition-colors hover:text-fg">
                  {t("nav.faq")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-fg">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/conai-ai-solutions-for-smes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-fg"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href="mailto:info@conai.sk" className="transition-colors hover:text-fg">
                  info@conai.sk
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="hairline-t mt-14 flex flex-col gap-3 pt-8 font-mono text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} ConAI · {t("footer.legal")}
          </p>
          <Link href="/privacy" className="transition-colors hover:text-fg">
            {t("nav.privacy")}
          </Link>
        </div>
      </Container>

      {/* Oversized wordmark bleeding off the bottom edge */}
      <div aria-hidden className="pointer-events-none relative h-[10vw] select-none overflow-hidden">
        <span className="absolute inset-x-0 top-0 text-center font-display text-[21vw] font-bold leading-[0.78] tracking-tight text-fg/[0.03]">
          ConAI
        </span>
      </div>
    </footer>
  );
}

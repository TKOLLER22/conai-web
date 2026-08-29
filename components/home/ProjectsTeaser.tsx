import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

const SPANS = ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-4"];

type Featured = { tag: string; title: string; desc: string; chips: string[] };

export default function ProjectsTeaser() {
  const t = useTranslations("home.projects");
  const featured = t.raw("featured") as Featured[];

  return (
    <Section rule>
      <Reveal>
        <Kicker>{t("kicker")}</Kicker>
        <h2 className="text-display mt-5 max-w-3xl text-4xl md:text-6xl">
          {t("title")}
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-5 md:grid-cols-6">
        {featured.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.06} className={SPANS[i]}>
            <Link
              href="/work"
              className="group flex h-full min-h-72 flex-col rounded-3xl border border-line bg-ink-850/80 p-8 transition-colors duration-300 hover:border-brand-400/50 md:p-10"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="kicker !text-fg-faint">{project.tag}</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 shrink-0 text-fg-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-400"
                />
              </div>
              <h3 className="text-display mt-9 max-w-[26ch] text-2xl md:text-3xl">
                {project.title}
              </h3>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-fg-muted">
                {project.desc}
              </p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                {project.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] text-fg-muted"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12">
        <Button href="/work" variant="link">
          {t("more")}
        </Button>
      </Reveal>
    </Section>
  );
}

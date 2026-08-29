"use client";

import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useRef } from "react";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { gsap, motionDisabled, useGSAP } from "@/lib/gsap";

const PIN_CONDITION =
  "(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)";

type Step = { index: string; title: string; desc: string; price: string };

function Boundary({ label }: { label: string }) {
  return (
    <>
      {/* Stacked flow: horizontal dashed rule with a centered label */}
      <div className="ladder-boundary-h flex w-full max-w-xl items-center gap-5" aria-hidden>
        <span className="flex-1 border-t border-dashed border-signal-300/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal-300/90">
          {label}
        </span>
        <span className="flex-1 border-t border-dashed border-signal-300/40" />
      </div>
      {/* Pinned flow: a vertical dashed checkpoint the scroll crosses */}
      <div
        className="ladder-boundary-v hidden shrink-0 flex-col items-center gap-5 self-stretch py-6"
        aria-hidden
      >
        <span className="w-px flex-1 border-l border-dashed border-signal-300/40" />
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-signal-300/90 [writing-mode:vertical-rl]">
          {label}
        </span>
        <span className="w-px flex-1 border-l border-dashed border-signal-300/40" />
      </div>
    </>
  );
}

function Arrow() {
  return (
    <div className="ladder-arrow shrink-0 self-center text-brand-400/60" aria-hidden>
      <MoveRight className="size-10 md:size-12" strokeWidth={1.25} />
    </div>
  );
}

export default function Ladder() {
  const t = useTranslations("home.ladder");
  const steps = t.raw("steps") as Step[];
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(PIN_CONDITION, () => {
        if (motionDisabled()) return;
        const section = sectionRef.current!;
        const track = trackRef.current!;
        section.setAttribute("data-pinned", "");

        const distance = () => track.scrollWidth - window.innerWidth + 120;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => section.removeAttribute("data-pinned");
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <>
      <section
        ref={sectionRef}
        data-ladder
        className="hairline-t relative overflow-hidden py-24 md:py-32"
      >
        <div
          ref={trackRef}
          className="ladder-track flex flex-col items-start gap-14 px-6 sm:px-10"
        >
          {/* Heading rides along as the first panel */}
          <div className="ladder-heading flex max-w-2xl shrink-0 flex-col justify-center gap-6">
            <Kicker>{t("kicker")}</Kicker>
            <h2 className="text-display text-4xl md:text-6xl">{t("title")}</h2>
          </div>

          {steps.map((step, i) => (
            <Fragment key={step.title}>
              {i > 0 &&
                (i === 2 ? <Boundary label={t("agencyTag")} /> : <Arrow />)}
              <article className="ladder-step relative w-full max-w-xl shrink-0">
                <span className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-fg-muted">
                  {step.price}
                </span>
                <h3 className="text-display mt-7 text-3xl md:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-fg-muted md:text-lg">
                  {step.desc}
                </p>
              </article>
            </Fragment>
          ))}
        </div>
      </section>

      {/* The quote gets its own moment after the scroll resolves */}
      <Section className="!py-24 md:!py-32">
        <Reveal className="max-w-4xl">
          <blockquote className="text-display text-3xl leading-snug md:text-5xl md:leading-[1.15]">
            {t("quote")}
          </blockquote>
          <div className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-5">
            <Button href="/services" variant="link">
              {t("linkPackages")}
            </Button>
            <Button href="/pricing" variant="link">
              {t("linkPricing")}
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

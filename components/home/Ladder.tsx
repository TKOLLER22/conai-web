"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";
import { gsap, motionDisabled, useGSAP } from "@/lib/gsap";

const PIN_CONDITION =
  "(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)";

type Step = { index: string; title: string; desc: string; price: string };

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

        const distance = () => track.scrollWidth - window.innerWidth + 96;

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
    <section
      ref={sectionRef}
      data-ladder
      className="hairline-t relative overflow-hidden py-24 md:py-32"
    >
      <div ref={trackRef} className="ladder-track flex flex-col gap-10 px-6 sm:px-8 lg:gap-14">
        {/* Heading rides along as the first panel */}
        <div className="ladder-heading flex max-w-xl shrink-0 flex-col justify-center gap-5 lg:w-[26rem]">
          <Kicker>{t("kicker")}</Kicker>
          <h2 className="text-display text-4xl md:text-5xl">{t("title")}</h2>
        </div>

        {steps.map((step, i) => (
          <article
            key={step.index}
            style={{ "--stair": `${(steps.length - 1 - i) * 2.75}rem` } as React.CSSProperties}
            className="ladder-step relative flex min-h-[19rem] w-full shrink-0 flex-col rounded-3xl border border-line bg-ink-850/80 p-8 md:p-9 lg:h-[21rem] lg:w-[27rem]"
          >
            {i === 1 && (
              <span className="absolute -top-3.5 left-8 -rotate-2 rounded-full border border-signal-300/40 bg-ink-900 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-signal-300">
                {t("agencyTag")}
              </span>
            )}
            <div className="flex items-start justify-between">
              <span className="font-mono text-5xl font-medium text-brand-400/90">
                {step.index}
              </span>
              <span className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-fg-muted">
                {step.price}
              </span>
            </div>
            <div className="mt-auto pt-10">
              <h3 className="font-display text-2xl font-semibold tracking-tight md:text-[1.7rem]">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-muted">
                {step.desc}
              </p>
            </div>
          </article>
        ))}

        {/* Quote payoff */}
        <div className="ladder-quote flex max-w-xl shrink-0 flex-col justify-center gap-8 lg:w-[34rem] lg:pl-10">
          <blockquote className="font-display text-2xl font-medium leading-snug tracking-tight text-fg md:text-[1.75rem]">
            {t("quote")}
          </blockquote>
          <div className="flex flex-col items-start gap-3">
            <Button href="/services" variant="link">
              {t("linkPackages")}
            </Button>
            <Button href="/pricing" variant="link">
              {t("linkPricing")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section
      ref={sectionRef}
      data-ladder
      className="hairline-t relative overflow-hidden py-24 md:py-32"
    >
      <div
        ref={trackRef}
        className="ladder-track flex flex-col gap-20 px-6 sm:px-10"
      >
        {/* Heading rides along as the first panel */}
        <div className="ladder-heading flex max-w-2xl shrink-0 flex-col justify-center gap-6">
          <Kicker>{t("kicker")}</Kicker>
          <h2 className="text-display text-4xl md:text-6xl">{t("title")}</h2>
        </div>

        {steps.map((step, i) => (
          <article
            key={step.index}
            className="ladder-step relative w-full max-w-xl shrink-0 border-l border-line pl-8 md:pl-10"
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-sm tracking-[0.2em] text-brand-400">
                {step.index}
              </span>
              <span className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-fg-muted">
                {step.price}
              </span>
              {i === 1 && (
                <span className="-rotate-2 rounded-full border border-signal-300/40 bg-signal-300/8 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-signal-300">
                  {t("agencyTag")}
                </span>
              )}
            </div>
            <h3 className="text-display mt-8 text-3xl md:text-4xl">{step.title}</h3>
            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-fg-muted md:text-lg">
              {step.desc}
            </p>
            <span
              aria-hidden
              className="ladder-ghost text-outline-brand pointer-events-none absolute -top-12 right-2 hidden select-none font-display text-[8rem] font-bold leading-none"
            >
              {step.index}
            </span>
          </article>
        ))}

        {/* Quote payoff */}
        <div className="ladder-quote flex max-w-2xl shrink-0 flex-col justify-center gap-9 border-l border-brand-500/40 pl-8 md:pl-10">
          <blockquote className="text-display text-2xl leading-snug md:text-[2.1rem]">
            {t("quote")}
          </blockquote>
          <div className="flex flex-col items-start gap-3.5">
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

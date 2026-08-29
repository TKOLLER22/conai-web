"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { gsap, motionDisabled, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

type Step = { title: string; desc: string };

export default function Process() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as Step[];
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>(".process-step");
        if (motionDisabled()) {
          items.forEach((el) => el.classList.add("process-active"));
          return;
        }
        const triggers = items.map((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 62%",
            onEnter: () => el.classList.add("process-active"),
            onLeaveBack: () => el.classList.remove("process-active"),
          }),
        );
        return () => triggers.forEach((st) => st.kill());
      });

      // Reduced motion: everything lit.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        document
          .querySelectorAll(".process-step")
          .forEach((el) => el.classList.add("process-active"));
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <Section rule>
      <div ref={scope} className="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Kicker>{t("kicker")}</Kicker>
            <h2 className="text-display mt-5 text-4xl md:text-5xl">{t("title")}</h2>
            <div className="mt-8">
              <Button href="/insights" variant="link">
                {t("link")}
              </Button>
            </div>
          </Reveal>
        </div>

        <ol className="relative flex flex-col">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05}>
              <li className="process-step group relative grid grid-cols-[3.25rem_1fr] gap-6 pb-14 last:pb-0">
                {/* connector */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[1.625rem] top-14 h-[calc(100%-3.5rem)] w-px bg-line"
                  />
                )}
                <span className="process-num flex size-13 items-center justify-center rounded-full border border-line font-mono text-sm text-fg-muted transition-colors duration-500">
                  {i + 1}
                </span>
                <div className="pt-2.5">
                  <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-[46ch] leading-relaxed text-fg-muted">
                    {step.desc}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

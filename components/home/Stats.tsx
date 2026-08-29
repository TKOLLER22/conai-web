"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { gsap, motionDisabled, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Container } from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

type StatItem = {
  display: string;
  count?: { to: number; suffix?: string; prefix?: string };
  caption: string;
  source: string;
};

function StatValue({ item, className = "" }: { item: StatItem; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!item.count) return;
    const el = ref.current!;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      if (motionDisabled()) return;
      const state = { v: 0 };
      gsap.to(state, {
        v: item.count!.to,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = `${item.count!.prefix ?? ""}${Math.round(state.v)}${item.count!.suffix ?? ""}`;
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <span
      ref={ref}
      className={`text-display block whitespace-nowrap font-display font-bold ${className}`}
    >
      {item.display}
    </span>
  );
}

/**
 * One argument, three pieces of evidence: the 11% vs 41% adoption gap
 * leads as a full-width statement; the supporting stats sit below it.
 */
export default function Stats() {
  const t = useTranslations("home.stats");
  const headline = t.raw("headline") as StatItem;
  const items = t.raw("items") as StatItem[];

  return (
    <div className="hairline-t relative overflow-hidden py-24 md:py-36">
      <Container>
        <Reveal>
          <StatValue
            item={headline}
            className="text-gradient-brand text-[clamp(3.2rem,8.6vw,8.5rem)]"
          />
          <div className="mt-8 flex flex-col gap-3 md:mt-10">
            <p className="max-w-2xl text-lg leading-relaxed text-fg-muted md:text-2xl md:leading-relaxed">
              {headline.caption}
            </p>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
              {headline.source}
            </span>
          </div>
        </Reveal>

        <dl className="mt-20 grid grid-cols-1 gap-14 sm:grid-cols-3 md:mt-28 md:gap-10">
          {items.map((item, i) => (
            <Reveal key={item.source + i} delay={i * 0.08}>
              <dt className="sr-only">{item.source}</dt>
              <dd className="flex max-w-sm flex-col gap-3">
                <StatValue item={item} className="text-5xl md:text-6xl" />
                <span className="text-base leading-relaxed text-fg-muted md:text-lg">
                  {item.caption}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
                  {item.source}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </div>
  );
}

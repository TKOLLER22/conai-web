"use client";

import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { gsap, motionDisabled, SplitText, useGSAP, DESKTOP } from "@/lib/gsap";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function Hero() {
  const t = useTranslations("home.hero");
  const scope = useRef<HTMLElement>(null);
  // The canvas wrapper is CSS-hidden below lg, but a display:none canvas
  // would still download three.js and init WebGL — so gate the mount too.
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) setShow3D(true);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(DESKTOP, () => {
        // Loaded in a background tab (rAF frozen) or motion disabled:
        // show the final state immediately instead of a stalled intro.
        if (motionDisabled() || document.hidden) return;

        const split = SplitText.create("[data-hero-title]", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
        });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(split.lines, {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.09,
        })
          .from(
            "[data-hero-fade]",
            { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1 },
            "-=0.55",
          )
          .then(() => split.revert());
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-svh items-center overflow-hidden pt-24 md:pt-16"
    >
      {/* Aura anchoring the 3D icon */}
      <div
        aria-hidden
        className="aura-brand absolute -right-[15%] top-1/2 h-[120vmin] w-[120vmin] -translate-y-1/2 opacity-70"
      />

      <div className="mx-auto grid w-full max-w-[88rem] items-center gap-14 px-6 sm:px-10 lg:grid-cols-[1fr_1fr] lg:gap-0">
        <div className="relative z-10">
          <p data-hero-fade className="kicker mb-6">
            {t("kicker")}
          </p>
          <h1
            data-hero-title
            className="text-display text-[clamp(2.8rem,6.2vw,6.1rem)]"
          >
            {t("title")}
          </h1>
          <p
            data-hero-fade
            className="mt-8 max-w-[48ch] text-lg leading-relaxed text-fg-muted md:text-xl"
          >
            {t("subtitle")}
          </p>
          <div data-hero-fade className="mt-10">
            <Button href="/book-audit" size="lg">
              {t("cta")}
            </Button>
          </div>
          <ul
            data-hero-fade
            className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm text-fg-muted"
          >
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-2">
                <Check aria-hidden className="size-4 text-mint-400" />
                {t(`bullets.${i}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden lg:block" data-hero-fade>
          {show3D && (
            <Hero3D className="ml-auto aspect-square w-[min(46vw,850px)] lg:-mr-[5vw]" />
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        data-hero-fade
        aria-hidden
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
          {t("scroll")}
        </span>
        <span className="scroll-hint-line" />
      </div>
    </section>
  );
}

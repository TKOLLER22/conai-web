"use client";

import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Component, useRef, useSyncExternalStore, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { gsap, motionDisabled, SplitText, useGSAP, DESKTOP } from "@/lib/gsap";

const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

/**
 * The 3D icon is decorative — a GLB fetch or WebGL failure must only drop
 * the icon, never the page (r3f re-throws render errors into React).
 */
class Hero3DBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = !!(
        canvas.getContext("webgl2") ?? canvas.getContext("webgl")
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const SHOW_3D_QUERY =
  "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

function subscribeShow3D(onChange: () => void) {
  const mql = window.matchMedia(SHOW_3D_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export default function Hero() {
  const t = useTranslations("home.hero");
  const scope = useRef<HTMLElement>(null);
  // The canvas wrapper is CSS-hidden below lg, but a display:none canvas would
  // still download three.js and init WebGL — gate the mount on viewport,
  // reduced-motion preference and actual WebGL support.
  const show3D = useSyncExternalStore(
    subscribeShow3D,
    () => window.matchMedia(SHOW_3D_QUERY).matches && hasWebGL(),
    () => false,
  );

  useGSAP(
    (_, contextSafe) => {
      // [data-hero-fade] elements start CSS-hidden (see globals.css) so the
      // intro never flashes. Whenever the intro won't run — touch device,
      // reduced motion, background tab, ?nomotion=1 — show them immediately.
      const showAll = () => gsap.set("[data-hero-fade]", { autoAlpha: 1 });

      if (
        !window.matchMedia(DESKTOP).matches ||
        motionDisabled() ||
        document.hidden
      ) {
        showAll();
        return;
      }

      // Fade targets start at opacity 0 via CSS; give them the slide offset.
      gsap.set("[data-hero-fade]", { y: 20 });

      let fadesPlayed = false;
      let started = false;
      const startIntro = contextSafe!(() => {
        if (started || !scope.current?.isConnected) return;
        started = true;

        SplitText.create("[data-hero-title]", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          // The title uses non-breaking spaces to keep phrases together.
          // reduceWhiteSpace (default true) collapses \u00A0 to plain spaces
          // BEFORE splitting (SplitText source: text.replace(/\s+/g, " ")),
          // which changes the wrap during the animation and snaps on revert.
          reduceWhiteSpace: false,
          wordDelimiter: " ",
          // The tween is created HERE (not outside) so autoSplit can rebuild
          // it with progress kept if lines change (font swap, resize).
          onSplit(self) {
            const tween = gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.1,
              stagger: 0.09,
              ease: "power4.out",
              // Restore natural text (incl. nbsp wrapping) when done —
              // SplitText suspends non-breaking spaces while lines are split.
              onComplete: () => self.revert(),
            });
            if (!fadesPlayed) {
              fadesPlayed = true;
              gsap.to("[data-hero-fade]", {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                delay: 0.7,
                ease: "power4.out",
              });
            }
            return tween;
          },
        });
      });

      // Split only after webfonts are active: fallback-font metrics wrap the
      // headline differently, which used to visibly snap on revert.
      if (document.fonts?.status === "loaded") {
        startIntro();
      } else {
        document.fonts.ready.then(startIntro);
        // Safety net: never leave the intro un-started if fonts hang.
        setTimeout(startIntro, 1500);
      }
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
                <Check aria-hidden strokeWidth={1.5} className="size-4 text-mint-400" />
                {t(`bullets.${i}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden lg:block" data-hero-fade>
          {show3D && (
            <Hero3DBoundary>
              <Hero3D className="ml-auto aspect-square w-[min(46vw,850px)] lg:-mr-[5vw]" />
            </Hero3DBoundary>
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

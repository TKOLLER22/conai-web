import { describe, expect, it } from "vitest";
import { findInsight, getInsight, getInsights } from "../insights";

// Runs against the real content tree — doubles as content validation in CI.
describe("getInsights", () => {
  for (const locale of ["sk", "en"]) {
    it(`${locale}: every article has valid frontmatter`, () => {
      const insights = getInsights(locale);
      expect(insights.length).toBeGreaterThan(0);
      for (const insight of insights) {
        expect(insight.title).toBeTruthy();
        expect(insight.category).toBeTruthy();
        expect(insight.excerpt).toBeTruthy();
        expect(Number.isNaN(new Date(insight.date).getTime())).toBe(false);
        expect(insight.readMinutes).toBeGreaterThan(0);
      }
    });
  }

  it("sorts newest first", () => {
    const dates = getInsights("sk").map((i) => i.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("returns null for unknown slugs and locales", () => {
    expect(getInsight("sk", "does-not-exist")).toBeNull();
    expect(getInsights("de")).toEqual([]);
  });
});

describe("findInsight (cross-locale slug fallback)", () => {
  const LOCALES = ["sk", "en"] as const;
  const skSlug = getInsights("sk")[0].slug;
  const enSlug = getInsights("en")[0].slug;

  it("own locale wins when it has the slug", () => {
    const found = findInsight(LOCALES, "sk", skSlug);
    expect(found?.locale).toBe("sk");
    expect(found?.insight.slug).toBe(skSlug);
  });

  it("falls back to the locale that owns a foreign slug", () => {
    const found = findInsight(LOCALES, "sk", enSlug);
    expect(found?.locale).toBe("en");
    expect(found?.insight.slug).toBe(enSlug);
  });

  it("returns null when no locale owns the slug", () => {
    expect(findInsight(LOCALES, "sk", "nope-nope")).toBeNull();
  });
});

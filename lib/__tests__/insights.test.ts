import { describe, expect, it } from "vitest";
import { getInsight, getInsights } from "../insights";

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

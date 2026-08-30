import { describe, expect, it } from "vitest";
import { seoAlternates } from "../seo";

describe("seoAlternates", () => {
  it("homepage canonical has no trailing slash (regression)", () => {
    const alt = seoAlternates("sk", "/");
    expect(alt.canonical).toBe("/sk");
    expect(alt.languages.sk).toBe("/sk");
    expect(alt.languages.en).toBe("/en");
    expect(alt.languages["x-default"]).toBe("/sk");
  });

  it("subpage paths pass through unchanged", () => {
    const alt = seoAlternates("en", "/services");
    expect(alt.canonical).toBe("/en/services");
    expect(alt.languages.sk).toBe("/sk/services");
  });
});

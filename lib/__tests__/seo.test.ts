import { describe, expect, it } from "vitest";
import { seoAlternates } from "../seo";

describe("seoAlternates", () => {
  it("canonicals are bare paths — locale never appears in URLs", () => {
    expect(seoAlternates("sk", "/").canonical).toBe("/");
    expect(seoAlternates("en", "/").canonical).toBe("/");
    expect(seoAlternates("sk", "/services").canonical).toBe("/services");
    expect(seoAlternates("en", "/services").canonical).toBe("/services");
  });
});

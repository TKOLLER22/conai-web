import { afterEach, describe, expect, it, vi } from "vitest";
import { seoCanonical } from "../seo";

describe("seoCanonical", () => {
  it("returns bare canonical paths (no locale prefixes)", () => {
    expect(seoCanonical("/").canonical).toBe("/");
    expect(seoCanonical("/services").canonical).toBe("/services");
  });
});

// SITE_URL / IS_PRODUCTION_DOMAIN are module-level and env-driven — the one
// flag that decides indexing. Pin every env shape, including the deliberate
// `||` (an unset Docker ARG arrives as EMPTY STRING, which must fall back).
describe("SITE_URL / IS_PRODUCTION_DOMAIN env matrix", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  async function loadSeo(env: string | undefined) {
    vi.resetModules();
    if (env === undefined) {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
      vi.unstubAllEnvs();
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", env);
    }
    return import("../seo");
  }

  it("unset → current live domain, indexable", async () => {
    const seo = await loadSeo(undefined);
    expect(seo.SITE_URL).toBe("https://conai.tomaskoller.sk");
    expect(seo.IS_PRODUCTION_DOMAIN).toBe(true);
  });

  it("empty string (unset Docker ARG) → falls back to live domain", async () => {
    const seo = await loadSeo("");
    expect(seo.SITE_URL).toBe("https://conai.tomaskoller.sk");
    expect(seo.IS_PRODUCTION_DOMAIN).toBe(true);
  });

  it("conai.sk (future launch) → indexable", async () => {
    const seo = await loadSeo("https://conai.sk");
    expect(seo.IS_PRODUCTION_DOMAIN).toBe(true);
  });

  it("unknown preview host → NOT indexable", async () => {
    const seo = await loadSeo("https://preview.example.com");
    expect(seo.SITE_URL).toBe("https://preview.example.com");
    expect(seo.IS_PRODUCTION_DOMAIN).toBe(false);
  });
});

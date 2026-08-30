import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL } from "@/lib/seo";

const PRODUCTION_HOSTS = new Set(["conai.sk", "www.conai.sk", "conai.tomaskoller.sk"]);

// Dynamic on purpose: indexing permission is decided by the requesting host,
// not by build configuration, so staging/preview domains can never be indexed
// even when built with production defaults.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host")?.split(":")[0] ?? "";
  if (!PRODUCTION_HOSTS.has(host)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

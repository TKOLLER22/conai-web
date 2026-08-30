import type { MetadataRoute } from "next";
import { IS_PRODUCTION_DOMAIN, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DOMAIN) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

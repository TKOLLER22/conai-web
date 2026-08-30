import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

// With localePrefix "never", one URL serves either language depending on the
// NEXT_LOCALE cookie — caches must not reuse a response across locales.
export function proxy(request: NextRequest) {
  const response = intl(request);
  response.headers.append("Vary", "Cookie");
  return response;
}

export default proxy;

export const config = {
  // Skip internals, static files and metadata routes
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};

/**
 * A shared header for the documentation sites of the TurboWarp Plus packages.
 *
 * Two ways to use it:
 *
 *   Runtime — one script tag, nothing else:
 *     <script type="module" src=".../dist/auto.js"></script>
 *
 *   Build time — paste the markup in and ship the stylesheet beside it:
 *     renderSiteHeader(resolveSite('https://…/turbowarp-jsqr/'))
 *     <link rel="stylesheet" href=".../header.css">
 *
 * The runtime path is the one to reach for. It puts the header in a shadow
 * root, so a site's own stylesheet and this header cannot disturb each other,
 * and a fix here reaches every site without editing any of them.
 */
export type {
  AlternateLink,
  HeaderLabels,
  HeaderTheme,
  LanguageSwitch,
  RenderHeaderOptions,
  ResolveSiteOptions,
  SiteContext,
  SiteLanguage,
} from "./types.ts";

export { LANGUAGE_EVENT } from "./types.ts";

export {
  DEFAULT_INDEX_URL,
  DEFAULT_OWNER,
  DEFAULT_SCOPE,
  resolveAlternate,
  resolveRepoFromUrl,
  resolveSite,
} from "./resolve.ts";

export {
  HEADER_CSS,
  escapeHtml,
  labelsFor,
  renderHeaderContent,
  renderMark,
} from "./markup.ts";

export { TAG_NAME, TurboWarpPlusHeader, defineHeader } from "./element.ts";

import { renderHeaderContent } from "./markup.ts";
import type { RenderHeaderOptions, SiteContext } from "./types.ts";

/**
 * The header as a standalone HTML string, for pages generated at build time.
 *
 * Unlike the custom element this is not in a shadow root, so the page must
 * load `header.css` and accept that its own stylesheet can reach the markup.
 */
export function renderSiteHeader(
  site: SiteContext,
  options: RenderHeaderOptions = {},
): string {
  return renderHeaderContent(site, options);
}

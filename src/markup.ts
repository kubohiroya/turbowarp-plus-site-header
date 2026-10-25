import type {
  HeaderLabels,
  HeaderTheme,
  SiteContext,
  SiteLanguage,
} from "./types.ts";

/** The hat block that marks this family, drawn the same way everywhere. */
const MARK_HAT =
  "M16 78c8-60 216-60 224 0V190a26 26 0 0 1-26 26H132c-4 0-7 3-8 6l-6 10c-3 5-8 8-14 8H80c-6 0-11-3-14-8l-6-10c-1-3-4-6-8-6H42a26 26 0 0 1-26-26Z";
const MARK_PLUS = "M128 100v80M88 140h80";

const LABELS: Readonly<Record<SiteLanguage, HeaderLabels>> = {
  en: {
    brand: "TurboWarp Plus",
    indexTitle: "All TurboWarp Plus packages",
    repository: "GitHub",
    npm: "npm",
    switchTo: "日本語",
  },
  ja: {
    brand: "TurboWarp Plus",
    indexTitle: "TurboWarp Plus のパッケージ一覧",
    repository: "GitHub",
    npm: "npm",
    switchTo: "English",
  },
};

export function labelsFor(lang: SiteLanguage): HeaderLabels {
  return LABELS[lang];
}

export function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * The stylesheet, written once and used two ways: inlined into the shadow root
 * by the custom element, and emitted as dist/header.css for pages that paste
 * the markup in at build time.
 *
 * Everything hangs off `.twp-header`, so the same rules work in both places.
 */
export const HEADER_CSS = `
:host {
  /* The host page's styles must not reach in, and ours must not leak out.
     "all" comes first: it would otherwise undo the display below. */
  all: initial;
  display: block;
  contain: layout style;
}

.twp-header {
  --twp-from: #6d28e0;
  --twp-mid: #3b55e0;
  --twp-to: #11a3d8;
  --twp-bg: #ffffff;
  --twp-fg: #1a1d26;
  --twp-muted: #68718a;
  --twp-line: #e2e6f0;

  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--twp-line);
  background: var(--twp-bg);
  color: var(--twp-fg);
  font: 14px/1.4 system-ui, -apple-system, "Segoe UI", "Hiragino Sans",
    "Noto Sans JP", sans-serif;
}

.twp-header[data-theme="dark"] {
  --twp-bg: #14161d;
  --twp-fg: #e7eaf2;
  --twp-muted: #959ec0;
  --twp-line: #272c38;
}

/* Only when nobody told us which way the page goes. */
@media (prefers-color-scheme: dark) {
  .twp-header[data-theme="auto"] {
    --twp-bg: #14161d;
    --twp-fg: #e7eaf2;
    --twp-muted: #959ec0;
    --twp-line: #272c38;
  }
}

.twp-header * {
  box-sizing: border-box;
}

.twp-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  font-weight: 650;
  letter-spacing: -0.1px;
}

.twp-header__brand:hover .twp-header__brand-name {
  text-decoration: underline;
}

.twp-header__mark {
  width: 22px;
  height: 22px;
  flex: none;
  display: block;
}

.twp-header__sep {
  color: var(--twp-muted);
}

.twp-header__site {
  font: 500 13.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  color: var(--twp-muted);
  overflow-wrap: anywhere;
}

.twp-header__links {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.twp-header__link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  color: var(--twp-muted);
  text-decoration: none;
  font-size: 13px;
  white-space: nowrap;
}

.twp-header__link:hover,
.twp-header__link:focus-visible {
  background: color-mix(in srgb, var(--twp-mid) 12%, transparent);
  color: var(--twp-fg);
}

.twp-header__link:focus-visible {
  outline: 2px solid var(--twp-mid);
  outline-offset: 1px;
}

.twp-header__icon {
  width: 15px;
  height: 15px;
  fill: currentColor;
  flex: none;
}

@media (max-width: 480px) {
  .twp-header__site {
    width: 100%;
    order: 3;
  }
  .twp-header__sep {
    display: none;
  }
}
`.trim();

const GITHUB_ICON = `<svg class="twp-header__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.73.5.9 5.48.9 11.94c0 5.06 3.29 9.35 7.86 10.86.57.11.78-.26.78-.57v-2c-3.2.72-3.88-1.4-3.88-1.4-.52-1.38-1.28-1.75-1.28-1.75-1.05-.74.08-.73.08-.73 1.16.08 1.77 1.23 1.77 1.23 1.03 1.82 2.7 1.3 3.36.99.1-.77.4-1.3.73-1.6-2.55-.3-5.24-1.31-5.24-5.84 0-1.29.44-2.34 1.17-3.17-.12-.3-.51-1.5.11-3.14 0 0 .96-.32 3.15 1.21a10.6 10.6 0 0 1 5.74 0c2.18-1.53 3.14-1.21 3.14-1.21.62 1.64.23 2.84.12 3.14.73.83 1.17 1.88 1.17 3.17 0 4.54-2.7 5.53-5.26 5.83.41.37.78 1.1.78 2.21v3.28c0 .31.2.69.79.57A11.14 11.14 0 0 0 23.1 11.94C23.1 5.48 18.27.5 12 .5Z"/></svg>`;

const NPM_ICON = `<svg class="twp-header__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M1.76 6.4h20.48v11.2H12v1.87H6.4V17.6H1.76V6.4Zm1.87 9.33h2.8V8.27h1.86v7.46h1.87V8.27h1.87v9.33H3.63v-1.87Zm9.33-7.46v9.33h3.73V15.7h1.87V8.27h-5.6Zm1.87 1.86h1.86v3.74h-1.86V10.13Z"/></svg>`;

const LANG_ICON = `<svg class="twp-header__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 6h-2.95a15.6 15.6 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.93 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14a7.9 7.9 0 0 1 0-4h3.38a16.6 16.6 0 0 0 0 4H4.26Zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.03 8.03 0 0 1 5.07 16Zm2.95-8H5.07a8.03 8.03 0 0 1 4.33-3.56A15.6 15.6 0 0 0 8.02 8ZM12 19.96A13.6 13.6 0 0 1 10.09 16h3.82A13.6 13.6 0 0 1 12 19.96ZM14.34 14H9.66a14.8 14.8 0 0 1 0-4h4.68a14.8 14.8 0 0 1 0 4Zm.26 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14a16.6 16.6 0 0 0 0-4h3.38a7.9 7.9 0 0 1 0 4h-3.38Z"/></svg>`;

/** The brand mark, with gradient ids scoped by `idPrefix`. */
export function renderMark(idPrefix = "twp"): string {
  const body = `${idPrefix}-body`;
  const warp = `${idPrefix}-warp`;
  const clip = `${idPrefix}-clip`;
  return `<svg class="twp-header__mark" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${body}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="var(--twp-from)"/>
      <stop offset=".5" stop-color="var(--twp-mid)"/>
      <stop offset="1" stop-color="var(--twp-to)"/>
    </linearGradient>
    <linearGradient id="${warp}" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#bdf4ff" stop-opacity="0"/>
      <stop offset="1" stop-color="#bdf4ff" stop-opacity=".9"/>
    </linearGradient>
    <clipPath id="${clip}"><path d="${MARK_HAT}"/></clipPath>
  </defs>
  <path fill="url(#${body})" d="${MARK_HAT}"/>
  <g clip-path="url(#${clip})" fill="none" stroke="url(#${warp})" stroke-linecap="round">
    <path d="M18 140A116 116 0 0 1 134 24" stroke-width="17"/>
    <path d="M52 140a82 82 0 0 1 82-82" stroke-width="13" opacity=".6"/>
  </g>
  <path d="${MARK_PLUS}" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round"/>
</svg>`;
}

/**
 * The header's contents: brand, which package this is, and the three ways out
 * of the page — the index, the repository, and the other language.
 */
export function renderHeaderContent(
  site: SiteContext,
  idPrefix = "twp",
  theme: HeaderTheme = "auto",
): string {
  const labels = labelsFor(site.lang);

  const links: string[] = [];
  if (site.repoUrl) {
    links.push(
      `<a class="twp-header__link" href="${escapeHtml(site.repoUrl)}" rel="noopener">${GITHUB_ICON}<span>${escapeHtml(labels.repository)}</span></a>`,
    );
  }
  if (site.npmUrl) {
    links.push(
      `<a class="twp-header__link" href="${escapeHtml(site.npmUrl)}" rel="noopener">${NPM_ICON}<span>${escapeHtml(labels.npm)}</span></a>`,
    );
  }
  if (site.alternateUrl && site.alternateLang) {
    links.push(
      `<a class="twp-header__link" href="${escapeHtml(site.alternateUrl)}" lang="${site.alternateLang}" hreflang="${site.alternateLang}">${LANG_ICON}<span>${escapeHtml(labels.switchTo)}</span></a>`,
    );
  }

  const site_ = site.repo
    ? `<span class="twp-header__sep" aria-hidden="true">/</span><span class="twp-header__site">${escapeHtml(site.repo)}</span>`
    : "";

  // On the index itself the brand is a link to where the reader already is.
  const current = site.atIndex ? ' aria-current="page"' : "";

  return `<div class="twp-header" data-theme="${escapeHtml(theme)}">
  <a class="twp-header__brand" href="${escapeHtml(site.indexUrl)}" title="${escapeHtml(labels.indexTitle)}"${current}>
    ${renderMark(idPrefix)}
    <span class="twp-header__brand-name">${escapeHtml(labels.brand)}</span>
  </a>
  ${site_}
  <nav class="twp-header__links" aria-label="${escapeHtml(labels.indexTitle)}">${links.join("")}</nav>
</div>`;
}

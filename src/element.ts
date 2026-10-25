import { HEADER_CSS, renderHeaderContent } from "./markup.ts";
import { resolveSite } from "./resolve.ts";
import type {
  AlternateLink,
  HeaderTheme,
  ResolveSiteOptions,
} from "./types.ts";

export const TAG_NAME = "turbowarp-plus-header";

/**
 * Reads the page's own translation links.
 *
 * A site knows which of its pages are translated; this header does not. When
 * the page says so, that wins over guessing from the path.
 */
function readAlternates(doc: Document): AlternateLink[] {
  const links = doc.querySelectorAll<HTMLLinkElement>(
    'link[rel~="alternate"][hreflang][href]',
  );
  return [...links].map((link) => ({
    hreflang: link.getAttribute("hreflang") ?? "",
    href: link.getAttribute("href") ?? "",
  }));
}

interface Rgba {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

function parseColor(value: string): Rgba | null {
  const match = /^rgba?\(([^)]+)\)$/iu.exec(value.trim());
  if (!match?.[1]) return null;
  const parts = match[1]
    .split(/[\s,/]+/u)
    .filter((part) => part.length > 0)
    .map(Number);
  const [r, g, b, a] = parts;
  if (
    ![r, g, b].every(
      (part) => typeof part === "number" && Number.isFinite(part),
    )
  ) {
    return null;
  }
  return {
    r: r as number,
    g: g as number,
    b: b as number,
    a: typeof a === "number" && Number.isFinite(a) ? a : 1,
  };
}

/** Rec. 601 luma is enough to tell a dark page from a light one. */
function isDark({ r, g, b }: Rgba): boolean {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

/**
 * The header, in a shadow root.
 *
 * These documentation sites each bring their own stylesheet, written without
 * any knowledge of this header. A shadow root is what keeps the two from
 * reaching into each other.
 */
export class TurboWarpPlusHeader extends HTMLElement {
  static readonly observedAttributes = [
    "repo",
    "npm",
    "owner",
    "scope",
    "index",
    "site-lang",
    "sticky",
    "theme",
    "guess-alternate",
  ];

  private media: MediaQueryList | null = null;
  private readonly onSchemeChange = (): void => this.render();

  connectedCallback(): void {
    const view = this.ownerDocument.defaultView;
    if (view && !this.media) {
      this.media = view.matchMedia("(prefers-color-scheme: dark)");
      this.media.addEventListener("change", this.onSchemeChange);
    }
    this.render();
  }

  disconnectedCallback(): void {
    this.media?.removeEventListener("change", this.onSchemeChange);
    this.media = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  private options(): ResolveSiteOptions {
    const npm = this.getAttribute("npm");
    const repo = this.getAttribute("repo");

    const options: {
      -readonly [K in keyof ResolveSiteOptions]: ResolveSiteOptions[K];
    } = {
      alternates: readAlternates(this.ownerDocument),
      documentLang: this.ownerDocument.documentElement.lang || null,
    };

    if (repo) options.repo = repo;
    const explicitLang = this.getAttribute("site-lang");
    if (explicitLang) options.lang = explicitLang;
    if (npm) options.npm = npm === "none" || npm === "false" ? false : npm;
    if (this.getAttribute("owner")) {
      options.owner = this.getAttribute("owner") as string;
    }
    if (this.getAttribute("scope")) {
      options.scope = this.getAttribute("scope") as string;
    }
    if (this.getAttribute("index")) {
      options.indexUrl = this.getAttribute("index") as string;
    }
    if (this.hasAttribute("guess-alternate")) options.guessAlternate = true;
    return options;
  }

  /**
   * Which way the page goes, read off the page itself.
   *
   * These sites do not agree on colour: some follow the reader's system
   * setting, some are light whatever it says. A header that followed the
   * system setting alone would sit dark on a cream page. So it takes the
   * first painted background above it and matches that, and only falls back
   * to the system setting when nothing above it paints one.
   */
  private detectTheme(): HeaderTheme {
    const attribute = this.getAttribute("theme");
    if (attribute === "light" || attribute === "dark" || attribute === "auto") {
      return attribute;
    }

    const view = this.ownerDocument.defaultView;
    if (!view) return "auto";

    let node: Element | null = this.parentElement ?? this.ownerDocument.body;
    while (node) {
      const color = parseColor(view.getComputedStyle(node).backgroundColor);
      if (color && color.a > 0.1) return isDark(color) ? "dark" : "light";
      node = node.parentElement;
    }
    return "auto";
  }

  render(): void {
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const href =
      this.ownerDocument.location?.href ?? "https://example.invalid/";
    const site = resolveSite(href, this.options());

    const sticky = this.hasAttribute("sticky")
      ? ":host{position:sticky;top:0;z-index:2147483000}"
      : "";

    shadow.innerHTML = `<style>${HEADER_CSS}${sticky}</style>${renderHeaderContent(site, "twp", this.detectTheme())}`;
  }
}

/** Registers the element. Safe to call more than once. */
export function defineHeader(tagName: string = TAG_NAME): void {
  if (typeof customElements === "undefined") return;
  if (customElements.get(tagName)) return;
  customElements.define(tagName, TurboWarpPlusHeader);
}

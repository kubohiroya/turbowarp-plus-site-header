export type SiteLanguage = "en" | "ja";

export interface AlternateLink {
  /** The `hreflang` value as written in the document. */
  readonly hreflang: string;
  readonly href: string;
}

export interface ResolveSiteOptions {
  /** The GitHub account the documentation sites live under. */
  readonly owner?: string;
  /** The npm scope the packages are published under. */
  readonly scope?: string;
  /**
   * The repository this page belongs to. Left out, it is the first path
   * segment of a `<owner>.github.io` URL, which is where Project Pages live.
   */
  readonly repo?: string | null;
  /**
   * The npm package name. `false` marks a repository that is deliberately not
   * published, so the header shows no npm link.
   */
  readonly npm?: string | false | null;
  /** Where the family index lives. */
  readonly indexUrl?: string;
  /** The page's own `<link rel="alternate" hreflang="...">` entries. */
  readonly alternates?: readonly AlternateLink[];
  /**
   * Assume `/<repo>/ja/` exists beside `/<repo>/` when the page declares no
   * translation. Off by default: a guessed link that 404s is worse than none.
   */
  readonly guessAlternate?: boolean;
  /** Overrides every other signal. */
  readonly lang?: string | null;
  /**
   * The page's own `<html lang>`. Every page in this family declares it, which
   * makes it a better signal than the path: a site could be written in one
   * language without a `/ja/` directory at all.
   */
  readonly documentLang?: string | null;
}

export interface SiteContext {
  readonly owner: string;
  readonly repo: string | null;
  readonly repoUrl: string | null;
  readonly npmName: string | null;
  readonly npmUrl: string | null;
  readonly lang: SiteLanguage;
  /** This same page in the other language, when it can be worked out. */
  readonly alternateUrl: string | null;
  readonly alternateLang: SiteLanguage | null;
  readonly indexUrl: string;
  /** True when this page is the index the brand links to. */
  readonly atIndex: boolean;
}

/** "auto" follows the reader's system setting; the others are fixed. */
export type HeaderTheme = "auto" | "light" | "dark";

/**
 * How the header offers the other language.
 *
 * "link" sends the reader to the translated page, which is what a site with
 * two sets of pages wants. "buttons" is for a page that switches language in
 * place: the header draws the control and announces the choice, and the page
 * acts on it.
 */
export type LanguageSwitch = "link" | "buttons";

export interface RenderHeaderOptions {
  /** Scopes the gradient ids, so two headers on one page do not collide. */
  readonly idPrefix?: string;
  readonly theme?: HeaderTheme;
  readonly langSwitch?: LanguageSwitch;
}

/** Fired on the element when a language button is pressed. */
export const LANGUAGE_EVENT = "turbowarp-plus:language";

export interface HeaderLabels {
  readonly brand: string;
  readonly indexTitle: string;
  readonly repository: string;
  readonly npm: string;
  readonly switchTo: string;
  readonly language: string;
}

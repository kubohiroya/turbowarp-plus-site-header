import type {
  AlternateLink,
  ResolveSiteOptions,
  SiteContext,
  SiteLanguage,
} from "./types.ts";

export const DEFAULT_OWNER = "kubohiroya";
export const DEFAULT_SCOPE = "@kubohiroya";
export const DEFAULT_INDEX_URL =
  "https://kubohiroya.github.io/turbowarp-plus-packages/";

/** The language segment these sites use for their Japanese pages. */
const JA_SEGMENT = "ja";

const splitPath = (pathname: string): string[] =>
  pathname.split("/").filter((segment) => segment.length > 0);

/** "ja-JP" and "ja" are the same language as far as the switch is concerned. */
function primarySubtag(value: string): string {
  return value.toLowerCase().split("-")[0] ?? "";
}

function asSiteLanguage(value: string | null | undefined): SiteLanguage | null {
  if (!value) return null;
  return primarySubtag(value) === JA_SEGMENT ? "ja" : "en";
}

/**
 * The repository a Project Pages URL belongs to.
 *
 * Project Pages are served from `<owner>.github.io/<repo>/`, so the first path
 * segment is the repository. A user site or a custom domain has no such
 * segment, and the caller has to say which repository it is.
 */
export function resolveRepoFromUrl(url: URL, owner: string): string | null {
  const userSite = `${owner.toLowerCase()}.github.io`;
  if (url.hostname.toLowerCase() !== userSite) return null;
  return splitPath(url.pathname)[0] ?? null;
}

/**
 * The same page in the other language.
 *
 * Only the page's own `hreflang` links are trusted. The site knows which of
 * its pages are translated and this header does not: of the 53 sites in this
 * family, 36 declare no translation, and some of those genuinely have none.
 * Guessing `/<repo>/ja/` for them offers the reader a link to a 404, which is
 * worse than offering no link at all.
 *
 * `guess` opts into the path convention for a site that knows it holds.
 */
export function resolveAlternate(
  url: URL,
  repo: string | null,
  lang: SiteLanguage,
  alternates: readonly AlternateLink[] = [],
  guess = false,
): string | null {
  const wanted: SiteLanguage = lang === "ja" ? "en" : "ja";

  for (const link of alternates) {
    const tag = primarySubtag(link.hreflang);
    if (tag === "x" || !link.href) continue; // x-default points at one of the two
    if (asSiteLanguage(tag) === wanted) {
      return new URL(link.href, url).toString();
    }
  }

  if (!guess || !repo) return null;

  const segments = splitPath(url.pathname);
  if (segments[0] !== repo) return null;
  const rest = segments.slice(1);

  const next =
    lang === "ja"
      ? rest[0] === JA_SEGMENT
        ? rest.slice(1)
        : rest
      : [JA_SEGMENT, ...rest];

  const alternate = new URL(url.toString());
  const trailingSlash = url.pathname.endsWith("/") || rest.length === 0;
  alternate.pathname = `/${[repo, ...next].join("/")}${trailingSlash ? "/" : ""}`;
  alternate.hash = "";
  return alternate.toString();
}

/** Whether two addresses point at the same document, ignoring query and hash. */
function sameDocument(url: URL, other: string): boolean {
  try {
    const target = new URL(other, url);
    return target.origin === url.origin && target.pathname === url.pathname;
  } catch {
    return false;
  }
}

/** Everything the header needs, worked out from one URL. */
export function resolveSite(
  href: string | URL,
  options: ResolveSiteOptions = {},
): SiteContext {
  const url = href instanceof URL ? href : new URL(href);
  const owner = options.owner ?? DEFAULT_OWNER;
  const scope = options.scope ?? DEFAULT_SCOPE;
  const indexUrl = options.indexUrl ?? DEFAULT_INDEX_URL;

  const repo =
    options.repo === undefined
      ? resolveRepoFromUrl(url, owner)
      : (options.repo ?? null);

  const segments = splitPath(url.pathname);
  const fromPath: SiteLanguage =
    repo && segments[0] === repo && segments[1] === JA_SEGMENT ? "ja" : "en";
  // What the page says about itself beats what its address implies.
  const lang =
    asSiteLanguage(options.lang) ??
    asSiteLanguage(options.documentLang) ??
    fromPath;

  const npmName =
    options.npm === false
      ? null
      : (options.npm ?? (repo ? `${scope}/${repo}` : null));

  const alternateUrl = resolveAlternate(
    url,
    repo,
    lang,
    options.alternates,
    options.guessAlternate ?? false,
  );

  return {
    owner,
    repo,
    repoUrl: repo ? `https://github.com/${owner}/${repo}` : null,
    npmName,
    npmUrl: npmName ? `https://www.npmjs.com/package/${npmName}` : null,
    lang,
    alternateUrl,
    alternateLang: alternateUrl ? (lang === "ja" ? "en" : "ja") : null,
    indexUrl,
    atIndex: sameDocument(url, indexUrl),
  };
}

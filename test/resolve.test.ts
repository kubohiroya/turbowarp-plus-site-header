import { test } from "node:test";
import assert from "node:assert/strict";

import {
  resolveAlternate,
  resolveRepoFromUrl,
  resolveSite,
} from "../src/resolve.ts";

const PAGES = "https://kubohiroya.github.io";

test("the first path segment of a Project Pages URL is the repository", () => {
  assert.equal(
    resolveRepoFromUrl(new URL(`${PAGES}/turbowarp-jsqr/`), "kubohiroya"),
    "turbowarp-jsqr",
  );
  assert.equal(
    resolveRepoFromUrl(
      new URL(`${PAGES}/turbowarp-jsqr/ja/guide.html`),
      "kubohiroya",
    ),
    "turbowarp-jsqr",
  );
});

test("a custom domain has no repository segment to read", () => {
  assert.equal(
    resolveRepoFromUrl(new URL("https://example.com/docs/"), "kubohiroya"),
    null,
  );
  assert.equal(resolveRepoFromUrl(new URL(`${PAGES}/`), "kubohiroya"), null);
});

test("the repository gives the GitHub and npm links", () => {
  const site = resolveSite(`${PAGES}/turbowarp-jsqr/`);
  assert.equal(site.repo, "turbowarp-jsqr");
  assert.equal(site.repoUrl, "https://github.com/kubohiroya/turbowarp-jsqr");
  assert.equal(site.npmName, "@kubohiroya/turbowarp-jsqr");
  assert.equal(
    site.npmUrl,
    "https://www.npmjs.com/package/@kubohiroya/turbowarp-jsqr",
  );
});

test("a package that is not published shows no npm link", () => {
  const site = resolveSite(`${PAGES}/turbowarp-kamishibai-docs/`, {
    npm: false,
  });
  assert.equal(site.npmName, null);
  assert.equal(site.npmUrl, null);
});

test("an unscoped npm name can be given explicitly", () => {
  const site = resolveSite(`${PAGES}/turbowarp-realtime-motion-capture-app/`, {
    npm: "turbowarp-realtime-motion-capture-app",
  });
  assert.equal(
    site.npmUrl,
    "https://www.npmjs.com/package/turbowarp-realtime-motion-capture-app",
  );
});

test("the /ja/ segment marks a Japanese page", () => {
  assert.equal(resolveSite(`${PAGES}/turbowarp-jsqr/ja/`).lang, "ja");
  assert.equal(resolveSite(`${PAGES}/turbowarp-jsqr/`).lang, "en");
});

test("what the page says about itself beats what its address implies", () => {
  const site = resolveSite(`${PAGES}/turbowarp-jsqr/`, {
    documentLang: "ja-JP",
  });
  assert.equal(site.lang, "ja");
});

test("an explicit language beats both", () => {
  const site = resolveSite(`${PAGES}/turbowarp-jsqr/ja/`, {
    documentLang: "ja",
    lang: "en",
  });
  assert.equal(site.lang, "en");
});

test("the page's own hreflang links are used when it has them", () => {
  const site = resolveSite(`${PAGES}/turbowarp-jsqr/`, {
    alternates: [
      { hreflang: "en", href: `${PAGES}/turbowarp-jsqr/` },
      { hreflang: "ja", href: `${PAGES}/turbowarp-jsqr/ja/` },
      { hreflang: "x-default", href: `${PAGES}/turbowarp-jsqr/` },
    ],
  });
  assert.equal(site.alternateUrl, `${PAGES}/turbowarp-jsqr/ja/`);
  assert.equal(site.alternateLang, "ja");
});

test("relative hreflang hrefs resolve against the page", () => {
  const site = resolveSite(`${PAGES}/turbowarp-jsqr/`, {
    alternates: [{ hreflang: "ja", href: "./ja/" }],
  });
  assert.equal(site.alternateUrl, `${PAGES}/turbowarp-jsqr/ja/`);
});

test("without hreflang links the /ja/ convention is assumed, both ways", () => {
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-jsqr/`),
      "turbowarp-jsqr",
      "en",
    ),
    `${PAGES}/turbowarp-jsqr/ja/`,
  );
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-jsqr/ja/`),
      "turbowarp-jsqr",
      "ja",
    ),
    `${PAGES}/turbowarp-jsqr/`,
  );
});

test("the rest of a deep path is carried across the language switch", () => {
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-jsqr/guide/blocks.html`),
      "turbowarp-jsqr",
      "en",
    ),
    `${PAGES}/turbowarp-jsqr/ja/guide/blocks.html`,
  );
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-jsqr/ja/guide/blocks.html`),
      "turbowarp-jsqr",
      "ja",
    ),
    `${PAGES}/turbowarp-jsqr/guide/blocks.html`,
  );
});

test("with no repository there is nothing to switch between", () => {
  const site = resolveSite("https://example.com/docs/");
  assert.equal(site.repo, null);
  assert.equal(site.repoUrl, null);
  assert.equal(site.alternateUrl, null);
  assert.equal(site.alternateLang, null);
});

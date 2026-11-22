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
    resolveRepoFromUrl(new URL(`${PAGES}/turbowarp-zxing/`), "kubohiroya"),
    "turbowarp-zxing",
  );
  assert.equal(
    resolveRepoFromUrl(
      new URL(`${PAGES}/turbowarp-zxing/ja/guide.html`),
      "kubohiroya",
    ),
    "turbowarp-zxing",
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
  const site = resolveSite(`${PAGES}/turbowarp-zxing/`);
  assert.equal(site.repo, "turbowarp-zxing");
  assert.equal(site.repoUrl, "https://github.com/kubohiroya/turbowarp-zxing");
  assert.equal(site.npmName, "@kubohiroya/turbowarp-zxing");
  assert.equal(
    site.npmUrl,
    "https://www.npmjs.com/package/@kubohiroya/turbowarp-zxing",
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
  assert.equal(resolveSite(`${PAGES}/turbowarp-zxing/ja/`).lang, "ja");
  assert.equal(resolveSite(`${PAGES}/turbowarp-zxing/`).lang, "en");
});

test("what the page says about itself beats what its address implies", () => {
  const site = resolveSite(`${PAGES}/turbowarp-zxing/`, {
    documentLang: "ja-JP",
  });
  assert.equal(site.lang, "ja");
});

test("an explicit language beats both", () => {
  const site = resolveSite(`${PAGES}/turbowarp-zxing/ja/`, {
    documentLang: "ja",
    lang: "en",
  });
  assert.equal(site.lang, "en");
});

test("the page's own hreflang links are used when it has them", () => {
  const site = resolveSite(`${PAGES}/turbowarp-zxing/`, {
    alternates: [
      { hreflang: "en", href: `${PAGES}/turbowarp-zxing/` },
      { hreflang: "ja", href: `${PAGES}/turbowarp-zxing/ja/` },
      { hreflang: "x-default", href: `${PAGES}/turbowarp-zxing/` },
    ],
  });
  assert.equal(site.alternateUrl, `${PAGES}/turbowarp-zxing/ja/`);
  assert.equal(site.alternateLang, "ja");
});

test("relative hreflang hrefs resolve against the page", () => {
  const site = resolveSite(`${PAGES}/turbowarp-zxing/`, {
    alternates: [{ hreflang: "ja", href: "./ja/" }],
  });
  assert.equal(site.alternateUrl, `${PAGES}/turbowarp-zxing/ja/`);
});

test("a page that declares no translation is offered no language link", () => {
  const site = resolveSite(`${PAGES}/turbowarp-extension-template/`);
  assert.equal(site.alternateUrl, null);
  assert.equal(site.alternateLang, null);
});

test("the /ja/ convention is used only when a site opts into it", () => {
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-zxing/`),
      "turbowarp-zxing",
      "en",
      [],
      false,
    ),
    null,
  );
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-zxing/`),
      "turbowarp-zxing",
      "en",
      [],
      true,
    ),
    `${PAGES}/turbowarp-zxing/ja/`,
  );
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-zxing/ja/`),
      "turbowarp-zxing",
      "ja",
      [],
      true,
    ),
    `${PAGES}/turbowarp-zxing/`,
  );
});

test("the rest of a deep path is carried across the language switch", () => {
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-zxing/guide/blocks.html`),
      "turbowarp-zxing",
      "en",
      [],
      true,
    ),
    `${PAGES}/turbowarp-zxing/ja/guide/blocks.html`,
  );
  assert.equal(
    resolveAlternate(
      new URL(`${PAGES}/turbowarp-zxing/ja/guide/blocks.html`),
      "turbowarp-zxing",
      "ja",
      [],
      true,
    ),
    `${PAGES}/turbowarp-zxing/guide/blocks.html`,
  );
});

test("with no repository there is nothing to switch between", () => {
  const site = resolveSite("https://example.com/docs/");
  assert.equal(site.repo, null);
  assert.equal(site.repoUrl, null);
  assert.equal(site.alternateUrl, null);
  assert.equal(site.alternateLang, null);
});

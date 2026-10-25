import { test } from "node:test";
import assert from "node:assert/strict";

import { escapeHtml, renderHeaderContent } from "../src/markup.ts";
import { resolveSite } from "../src/resolve.ts";

const PAGES = "https://kubohiroya.github.io";

test("the brand links to the family index", () => {
  const html = renderHeaderContent(resolveSite(`${PAGES}/turbowarp-jsqr/`));
  assert.match(
    html,
    /href="https:\/\/kubohiroya\.github\.io\/turbowarp-plus-packages\/"/u,
  );
  assert.match(html, /TurboWarp Plus/u);
});

test("it names the package the page belongs to", () => {
  const html = renderHeaderContent(resolveSite(`${PAGES}/turbowarp-jsqr/`));
  assert.match(html, /class="twp-header__site">turbowarp-jsqr</u);
});

test("it offers the repository and the npm page", () => {
  const html = renderHeaderContent(resolveSite(`${PAGES}/turbowarp-jsqr/`));
  assert.match(
    html,
    /href="https:\/\/github\.com\/kubohiroya\/turbowarp-jsqr"/u,
  );
  assert.match(
    html,
    /href="https:\/\/www\.npmjs\.com\/package\/@kubohiroya\/turbowarp-jsqr"/u,
  );
});

test("the npm link is absent for a site that is not a package", () => {
  const html = renderHeaderContent(
    resolveSite(`${PAGES}/turbowarp-kamishibai-docs/`, { npm: false }),
  );
  assert.doesNotMatch(html, /npmjs\.com/u);
  assert.match(html, /github\.com/u);
});

test("the language link carries its target language, named in that language", () => {
  const declared = [
    { hreflang: "en", href: `${PAGES}/turbowarp-jsqr/` },
    { hreflang: "ja", href: `${PAGES}/turbowarp-jsqr/ja/` },
  ];

  const english = renderHeaderContent(
    resolveSite(`${PAGES}/turbowarp-jsqr/`, { alternates: declared }),
  );
  assert.match(english, /hreflang="ja"[^>]*>.*日本語/su);

  const japanese = renderHeaderContent(
    resolveSite(`${PAGES}/turbowarp-jsqr/ja/`, { alternates: declared }),
  );
  assert.match(japanese, /hreflang="en"[^>]*>.*English/su);
});

test("a page with no declared translation shows no language link", () => {
  const html = renderHeaderContent(resolveSite(`${PAGES}/turbowarp-jsqr/`));
  assert.doesNotMatch(html, /hreflang=/u);
});

test("gradient ids can be scoped so two headers on a page do not collide", () => {
  const first = renderHeaderContent(resolveSite(`${PAGES}/a/`), "one");
  const second = renderHeaderContent(resolveSite(`${PAGES}/a/`), "two");
  assert.match(first, /id="one-body"/u);
  assert.match(second, /id="two-body"/u);
});

test("markup in a repository name cannot escape into the page", () => {
  const html = renderHeaderContent(
    resolveSite(`${PAGES}/x/`, { repo: '"><script>alert(1)</script>' }),
  );
  assert.doesNotMatch(html, /<script>/u);
  assert.match(html, /&lt;script&gt;/u);
});

test("escapeHtml covers the five characters that matter", () => {
  assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
});

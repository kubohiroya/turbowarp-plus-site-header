# turbowarp-plus-site-header

A shared header for the documentation sites of the TurboWarp Plus packages: one bar that says which family a page belongs to and gives the way back to the index, the repository, and the other language.

[English](README.md) | [日本語](README.ja.md)

It sits above whatever the site already has. Roughly half of these sites have a header of their own and half do not, so this one adds a family bar rather than replacing anyone's navigation.

## Use it

One script tag, nothing else:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@kubohiroya/turbowarp-plus-site-header@0/dist/auto.js"
></script>
```

It registers `<turbowarp-plus-header>` and puts one at the top of the page. To
place it yourself — or to make it stick — write the element where you want it
and the script will leave it alone:

```html
<turbowarp-plus-header sticky></turbowarp-plus-header>
```

### What it works out on its own

|                    | from                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Which package      | the first path segment of `<owner>.github.io/<repo>/`                                      |
| Repository link    | `github.com/<owner>/<repo>`                                                                |
| npm link           | `@<scope>/<repo>`                                                                          |
| Language           | `<html lang>`, falling back to a `/ja/` path segment                                       |
| The other language | the page's own `<link rel="alternate" hreflang>`, falling back to adding or removing `/ja` |
| Light or dark      | the first painted background above the header                                              |

Nothing is listed anywhere, so adding a package needs no change here.

### Attributes

Every one is optional; each overrides one of the guesses above.

| attribute        | effect                                                                        |
| ---------------- | ----------------------------------------------------------------------------- |
| `repo`           | the repository, when the URL cannot say — a custom domain, or a local preview |
| `npm`            | the package name, or `none` for a site that is not published                  |
| `owner`, `scope` | for a different account or npm scope                                          |
| `index`          | where the brand links to                                                      |
| `site-lang`      | `en` or `ja`, overriding every other signal                                   |
| `theme`          | `light`, `dark`, or `auto` to follow the reader's system setting              |
| `sticky`         | keep it at the top while the page scrolls                                     |

## Why a custom element

These sites were each written with their own stylesheet and no knowledge of
this header: one makes every `svg` 120px, another makes every link orange and
heavy. Markup pasted into the page would be at the mercy of all of it, and
would have to be re-pasted into every site for every change. In a shadow root
neither side can reach the other, and a fix here reaches every site at once.

## Build-time use

For a page that would rather not run script, the markup and the stylesheet can
be generated instead. The page then owns the result, and its own CSS applies to
it:

```js
import {
  renderSiteHeader,
  resolveSite,
} from "@kubohiroya/turbowarp-plus-site-header";

const html = renderSiteHeader(
  resolveSite("https://kubohiroya.github.io/turbowarp-jsqr/"),
);
```

```html
<link
  rel="stylesheet"
  href="…/@kubohiroya/turbowarp-plus-site-header/dist/header.css"
/>
```

## Develop

```bash
pnpm install
npm run verify   # lint, format, typecheck, test
npm run demo     # http://localhost:4190/
```

The demo page carries a deliberately hostile stylesheet, so that the isolation
is visible rather than assumed.

## License

MPL-2.0. See [LICENSE](LICENSE).

# AGENTS.md

Notes for anyone — person or agent — working on this package or rolling it out.

## Which sites carry the header

The header says which family a page belongs to and gives the way back to the
index. That is worth having on a package's documentation. It is not worth
having everywhere.

**A `turbowarp-*-app` repository does not get it.** Those repositories are part
of the TurboWarp Plus family, but an application's GitHub Pages site stands on
its own and does not need a header linking back to turbowarp-plus. Adding one
there was declined in
[turbowarp-kamishibai-app#1049](https://github.com/kubohiroya/turbowarp-kamishibai-app/pull/1049).

**A fork of someone else's project does not get it** — `scratch-gui` and any
site that serves the TurboWarp editor itself. The whole point of this family's
naming and colouring is not to be mistaken for the upstream project, and
putting our bar over their editor works against that.

**A page that redirects on load does not get it.** The language chooser at the
root of `turbowarp-extension-data-editor` replaces the location as soon as it
runs, so a header there would only flash.

Everything else — a package's documentation site — carries it.

## Where to put it in a repository

In order of preference:

1. **A shared client script the site already loads on every page.** One place
   reaches every page, hand-written and generated alike. `site-shell.js` in the
   kamishibai sites is the example. Guard it on `document`, since such modules
   are often imported by tests under Node, and swallow a load failure: the page
   must stand on its own without the bar.
2. **The page generator**, when there is one. Not its output: that is rebuilt
   on every deployment.
3. **The committed HTML**, before `</body>`, when the site is written by hand.
   Keep it outside any `BEGIN/END` marker region, which a generator rewrites.

Never patch a built artifact — `dist`, `_site`, a `gh-pages` branch — directly.

## Before changing what the header renders

Every site on the family loads the same build, and GitHub Pages serves it with
`cache-control: max-age=600`. A change reaches readers over the following ten
minutes, and not all at once: `auto.js`, `element.js` and `markup.js` are
separate requests with separate cache lifetimes, so for a short window a page
can run a mix of old and new. A query string on `auto.js` does not fix this —
its static imports carry no query.

So: keep changes additive, and do not remove something a page depends on in the
same release that adds its replacement. Bundling the distributed files into one
would close the window; it has not been done.

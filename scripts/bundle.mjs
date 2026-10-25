#!/usr/bin/env node
/**
 * Bundles the runtime entry into one file.
 *
 * Every site in the family loads dist/auto.js from the same URL, and GitHub
 * Pages serves it with `cache-control: max-age=600`. While the entry was a
 * module graph, those ten minutes ran independently for each of its five
 * files, so a browser could run a new element.js against a cached markup.js —
 * and a query string on the entry did not help, because its static imports
 * carry none. One file cannot be half old: it is either the whole new build or
 * the whole previous one.
 *
 * The unbundled modules stay in dist for anyone importing the package from
 * npm; only the entry that browsers fetch is bundled.
 */
import { build } from "esbuild";
import { stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "dist", "auto.js");

await build({
  entryPoints: [join(ROOT, "src", "auto.ts")],
  outfile: OUT,
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  sourcemap: true,
  legalComments: "none",
  banner: {
    js: "/* @kubohiroya/turbowarp-plus-site-header · MPL-2.0 · https://github.com/kubohiroya/turbowarp-plus-site-header */",
  },
});

const { size } = await stat(OUT);
console.log(`wrote dist/auto.js (${size} bytes, one file)`);

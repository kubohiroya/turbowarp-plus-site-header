import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

/**
 * Every site in the family fetches dist/auto.js from one URL, cached for ten
 * minutes. While it was a module graph, each of its files carried its own ten
 * minutes, so a browser could run a new element against a cached renderer.
 * These tests hold the entry to one self-contained file, where that cannot
 * happen.
 */
test("the runtime entry pulls in nothing else", async () => {
  const bundle = await readFile(join(DIST, "auto.js"), "utf8");

  assert.doesNotMatch(
    bundle,
    /\bfrom\s*["']\.\.?\//u,
    "a relative static import would be a second cache entry",
  );
  assert.doesNotMatch(
    bundle,
    /\bimport\s*\(\s*["']\.\.?\//u,
    "a relative dynamic import would be a second cache entry",
  );
});

test("the entry still carries everything the header needs", async () => {
  const bundle = await readFile(join(DIST, "auto.js"), "utf8");

  for (const needed of [
    "turbowarp-plus-header", // the element it defines
    "twp-header", // the markup it renders
    "turbowarp-plus-packages", // the index it links to
  ]) {
    assert.ok(bundle.includes(needed), `the bundle has lost ${needed}`);
  }
});

test("the stylesheet ships beside it, for pages that render the markup themselves", async () => {
  const css = await readFile(join(DIST, "header.css"), "utf8");
  assert.match(css, /\.twp-header\b/u);
});

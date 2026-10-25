#!/usr/bin/env node
/**
 * Writes dist/header.css from the stylesheet the element already carries.
 *
 * The CSS lives in markup.ts so the shadow root and the standalone file can
 * never drift apart; this makes the file for pages that paste the markup in.
 */
import { writeFile } from 'node:fs/promises';

const { HEADER_CSS } = await import('../dist/markup.js');
const out = new URL('../dist/header.css', import.meta.url);
await writeFile(out, `${HEADER_CSS}\n`);
console.log(`wrote ${out.pathname} (${HEADER_CSS.length} bytes)`);

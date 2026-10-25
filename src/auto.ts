/**
 * The one-script-tag entry point.
 *
 *   <script type="module" src=".../dist/auto.js"></script>
 *
 * Registers the element and puts one at the top of the page, unless the page
 * already contains one — which is how a site opts out of the automatic
 * placement: write `<turbowarp-plus-header sticky>` where you want it, and
 * this leaves it alone.
 */
import { TAG_NAME, defineHeader } from "./element.ts";

export { TAG_NAME, TurboWarpPlusHeader, defineHeader } from "./element.ts";

function mount(): void {
  defineHeader();
  if (document.querySelector(TAG_NAME)) return;
  document.body.prepend(document.createElement(TAG_NAME));
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
}

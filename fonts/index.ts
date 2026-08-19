import localFont from "next/font/local";

/**
 * Two families, and a third would be one accessory too many (`marca.md` §4).
 *
 * Both are self-hosted from this directory rather than fetched from Google at
 * build time: the woff2 files sit beside this module and ship with the repo,
 * with their OFL licences alongside them.
 *
 * Each file is the `latin` subset. The store is pt-BR only and every character
 * it sets — including every accent, `ª`, `º` and the `×` the measurements use —
 * lives inside it.
 */

/**
 * Display only, and only for the four roles `marca.md` §4 allows: piece name,
 * collection title, editorial title and one feature line per page. The
 * stylesheet keeps that promise by reaching Mincho through the `.t-display-*`
 * roles and publishing no font utility that would hand it to anything else.
 */
export const zenOldMincho = localFont({
  src: "./zen-old-mincho-latin.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-zen-old-mincho",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});

/**
 * Body, interface and data. The file is a variable font; the declared range is
 * the two weights the type scale uses — 400 for text, 500 for the annotation
 * and CTA voices — so a surface cannot reach for a weight the scale never set.
 */
export const schibstedGrotesk = localFont({
  src: "./schibsted-grotesk-latin.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--font-schibsted-grotesk",
  fallback: ["system-ui", "sans-serif"],
});

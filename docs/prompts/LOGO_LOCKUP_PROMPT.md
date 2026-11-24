# ChatGPT prompt - the store logo WITH its name (concept, illustrations and lockups)

Why: the delivered logo (`web/icon.svg`) is a symbol only. The name "OS APPs and Downs" appears in the app header as plain text next to it. This prompt asks for a real logo lockup that contains the name, plus the supporting illustrations, so the app can use them. Paste the whole block as is (it restates the design language; this round is the ONE exception to the "no text inside art" rule, and only for the logo/wordmark files listed below).

```
You are the brand designer and illustrator for an app store called "OS APPs and Downs" - the private store of one developer (OS = his initials) for the apps he built. The name plays on "ups and downs" (going up and down: upload/download), with "Ups" spelled APPs, like Applications. Audience: the owner, family and friends, mostly on an Android phone, often non-technical. Personality in 3 words: friendly, clear, a little playful. The store is Hebrew-first (right-to-left) with English equal.

EXISTING SYMBOL (keep the family, you may refine it): a rounded-square app icon on an indigo->cyan 135-degree gradient, with a white storefront (striped awning over a box) carrying an UP arrow and a DOWN arrow, one amber accent. Palette (use only these): indigo #4f46e5, cyan #06b6d4, amber #f59e0b, teal #0f766e, rose #e11d48, ink #14162a, soft background #f6f7fb, white; dark background #0e1020. Gradients only indigo->cyan at 135 degrees. Flat vector, soft rounded geometry, round caps and joins, no photo-realism, no tiny details, original work only (no copied logos, fonts-as-art, mascots, brands or living artists' styles), free to use.

THIS ROUND - the name must be in the logo. The exact wordmark text is: OS APPs and Downs  (capital O, S, A, P, P; lowercase "s" in APPs; "and" in lowercase). Give "APPs" the visual emphasis (it is the pun). Letters: a bold, rounded, geometric sans-serif look, friendly, highly legible at 120 px wide. Build the letters yourself as custom lettering (outlined shapes), do not rely on an installed font.

STAGE 1 - CONCEPTS. Show 3 distinct logo directions on one sheet (light and dark background, numbered 1-3), each with a one-line rationale in the chat (not inside the art):
 1) Symbol + horizontal wordmark: the storefront mark on the left, the name on one line.
 2) Stacked: the mark above a two-line name ("OS APPs" / "and Downs").
 3) A more playful idea of your own that makes the up/down arrows part of the lettering (for example the arrows replace or sit inside the letters of "APPs" / "Downs"), still readable.
Wait for me to choose ("continue 2" etc.).

STAGE 2 - FINAL LOCKUP SET (for the chosen direction). Deliver, each as SVG and as PNG (transparent background):
 a) logo-horizontal-light / logo-horizontal-dark: mark + name on one line, viewBox 640x160. Light = dark ink text for light backgrounds; dark = white text for dark backgrounds.
 b) logo-stacked-light / logo-stacked-dark: viewBox 480x420.
 c) wordmark-light / wordmark-dark: the name only, viewBox 560x120.
 d) mark-only: the symbol alone (as the current icon, refined if you improved it): icon.svg (rounded square), icon-maskable.svg (full-bleed square, art inside the central 80%), icon-mono.svg (single colour, transparent). PNG 192, 512 and maskable 512.
 e) A Hebrew companion line to use under the logo, as separate art: "חנות האפליקציות של OS" in a friendly rounded Hebrew lettering (right-to-left, correct letter shapes, final letters), light and dark, viewBox 480x80. Plain text must be exactly: חנות האפליקציות של OS
 f) share-card.png 1200x630 (for WhatsApp/link previews): soft gradient background, the stacked logo centred, Hebrew line below, nothing else.
 g) splash.png 1080x1920 (portrait launch image): the stacked logo centred on the gradient, a few soft app-tile shapes floating with up/down arrows, lots of calm space.
 
STAGE 3 - ILLUSTRATION KIT in the same style, no text inside, light + dark variants where marked (SVG, viewBox given):
 1) hero-light / hero-dark, viewBox 1200x360: two shelves of rounded tiles with up/down arrows between them and soft clouds; left and right 15% quiet space; lower-middle 40% nearly empty (white text sits there). Refresh the previous hero so it matches the new logo.
 2) about-illustration (viewBox 480x320, light + dark): the storefront with a small flag, a few app tiles in front, one up and one down arrow - used on the About page.
 3) category-badges: nine small round badges (viewBox 64x64) for: health & fitness, family & routine, Judaism & learning, tools, time & clocks, events, files, design & dev, travel - each a simple duotone symbol on a tinted circle (these are colourful badges; the existing line icons stay for the filter list).
 4) empty-shelf spot (viewBox 240x180, light + dark): an empty shelf with one lonely tile, friendly.

TECHNICAL CONTRACT (the app validates it): SVG 1.1 using only <svg>, <g>, <path>, <rect>, <circle>, <ellipse>, <line>, <polygon>, <linearGradient>, <stop>, <clipPath>, <defs>. NO <text>, <tspan>, <image>, <filter>, <style>, scripts or external references: all lettering must be outlined into <path> shapes. viewBox always given; unique ids prefixed with the file name; each SVG under 25 KB (the lockups with outlined letters may need that; all others under 12 KB). No gradients other than indigo->cyan. If you cannot outline the lettering into paths, say so and deliver the PNG versions (transparent, 2x size) and name the font family you used, so I can recreate it.
Contrast: text-vs-background at least 4.5:1 in both light and dark versions; the logo must still read at 120 px wide and at 36 px high.
RTL: nothing in the symbol may depend on left-to-right reading; the Hebrew line is right-to-left.

DELIVERY: work in the stages above and stop after each ("wait for continue"). At the end of each stage report: file names, sizes in KB, colours used, and confirm no <text>/<image>/<filter> was used in any SVG. Put every file into one ZIP at the end of Stage 3, with folders: brand/ (a-d), hebrew/ (e), social/ (f, g), illustrations/ (Stage 3), previews/ (contact sheets on light and dark backgrounds).
Reply "ready" and start with Stage 1.
```

## After ChatGPT delivers (developer checklist)
Validate each SVG (allowed elements, sizes), look at the sheets, put files in `web/art/store/brand/`, use the horizontal lockup in the header (light/dark pair like `ui/art.js`), the share card in `index.html` (`og:image` is a navigation-only meta, no CSP impact), regenerate the PNG icons (`npm run icons`), add the files to `web/sw.js` SHELL, update `docs/DESIGN_LANGUAGE.md`, `docs/PENDING_CHATGPT_PROMPTS.md`, the ledger (#16), run the full regression. If the owner prefers "&" ("OS APPs & Downs") the name changes in the store UI strings, manifest, README and docs.

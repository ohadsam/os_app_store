# ChatGPT prompts - visuals for "OS APPs & Downs" (paste block A first, then ONE prompt at a time)

## Block A - shared design language (paste at the start of the conversation)
```
You are the illustrator for an app store called "OS APPs & Downs": the private store of one developer (OS = his initials) for the apps he built. "Ups and Downs" = going up and down; here "Ups" is spelled APPs. Audience: the owner, family and friends, mostly on an Android phone, often non-technical. Personality in 3 words: friendly, clear, a little playful. Hebrew-first (RTL) app, so nothing may depend on left-to-right reading order, and NO text or letters inside any artwork (the app adds all text).
Style system: flat vector, soft rounded geometry, 24-grid logic, round caps and joins, no photo-realism, no outlines thinner than 2px at 512px, no tiny details. Palette (use only these): indigo #4f46e5, cyan #06b6d4, amber #f59e0b, teal #0f766e, rose #e11d48, ink #14162a, soft background #f6f7fb, white. Gradients allowed only indigo->cyan, 135 degrees. Light direction from top-left, subtle. Everything must work on a light AND a dark (#0e1020) background: deliver light and dark variants where asked.
Rules: 100% original work (no copied logos, icon sets, mascots, brands, living artists' styles); CC0-style free to use; no text in art; no people's faces; calm, no flashing. Technical contract: SVG 1.1 using only <svg>, <g>, <path>, <rect>, <circle>, <ellipse>, <line>, <polygon>, <linearGradient>, <stop>, <clipPath>, <defs>; no <text>, <image>, <filter>, <style>, scripts, external references; viewBox given; every file under 12 KB; unique ids prefixed with the file name. Also give a 1024px PNG of each when asked.
Delivery: work in stages. After each stage stop and wait for me to write "continue". At the end of each stage report: file names, sizes in KB, the colours used, and confirm no text/<image>/<filter> was used.
Reply "ready" and wait for prompt 1.
```

## Prompt 1 - the store logo and app icon
```
Stage 1: design 4 logo concepts for "OS APPs & Downs", as SVG, 512x512 viewBox, each a rounded-square app icon (corner radius 112) on the indigo->cyan gradient. Shared idea: a store/shopping bag or storefront that also says "apps", with an UP arrow and a DOWN arrow (going up and down: upload/download) built into it; one concept may use a stylised "OS" monogram shape without readable letters being required (abstract). Make them distinct, ownable, instantly readable at 48px, white main shape with one amber accent.
Show all 4 side by side on a sheet (light and dark background), numbered 1-4. Wait for my choice.
Stage 2 (after I choose): final files: icon.svg (full-bleed rounded square), icon-maskable.svg (full-bleed square background, art inside the central 80% safe zone), icon-mono.svg (single colour, transparent, for notifications), plus PNG 192, 512 and maskable 512, and a horizontal wordless "mark + empty space" lockup for the header (36px high, light and dark variants, mark only - I add the words).
Validate: legible at 48px, contrast of the white shape against the gradient >= 3:1, nothing outside the safe zone for the maskable file.
```

## Prompt 2 - hero banner and page backgrounds
```
Stage 1: a wide hero illustration for the top of the store home page, SVG viewBox 1200x360 (also usable cropped to 390x220 center), for light and dark. Scene: a friendly "shelf" of rounded app-icon tiles (12 abstract tiles, no glyphs, in the palette) with a few arrows going up and down between them, gentle clouds and sparkles, open and airy, calm. The left/right 15% must be quiet space (it is mirrored in RTL). Leave the lower-middle 40% fairly empty because white text will be placed over it: keep contrast low there (it sits on the indigo->cyan gradient).
Deliver hero-light.svg and hero-dark.svg (dark = deeper indigo #0e1020 -> #262a55 base, same scene).
Stage 2: two subtle full-page background patterns (bg-light.svg, bg-dark.svg), 400x400 seamless tile, very low contrast (<= 6% difference from #f6f7fb / #0e1020): tiny rounded squares and arrows, no focal point.
Validate: seamless edges, file sizes, text legibility test (put white 24px text in the empty zone mentally and tell me the contrast).
```

## Prompt 3 - empty and error states (4 illustrations)
```
Stage 1: four small illustrations, each SVG viewBox 240x180, light and dark variants (8 files), same family as the hero (rounded tiles, arrows, indigo/cyan/amber):
1) no-results: an empty shelf with a magnifier and one lonely tile.
2) offline: a tile with a small cloud and a broken dotted arrow, calm, not alarming.
3) load-error: a tile with a gentle wrench/circular arrow (retry) feel, friendly.
4) coming-soon-screenshots: a phone-shaped frame (portrait, rounded) with a soft dashed outline and a camera shutter shape, meaning "screenshots will be added" (used as a placeholder where an app has no screenshots).
File names: no-results-light.svg, no-results-dark.svg, offline-..., load-error-..., coming-soon-...
Validate: each readable at 120px wide, no text, under 8 KB, ids prefixed with the file name.
```

## Prompt 4 - category icons (9 icons)
```
Stage 1: nine category icons for the store filter, SVG viewBox 48x48, duotone: a stroke in currentColor-friendly ink #14162a (use fill/stroke "currentColor" for the main line so the app can recolour it) plus one soft accent shape in indigo #4f46e5 at 25% opacity. 2.4px stroke, round caps. Categories (ideas): health & fitness (a running shoe / heart-pulse), family & routine (sun over a house / two figures without faces), Judaism & learning (an open book with a small flame), tools (a wrench and screwdriver crossed), time & clocks (a clock with a bell), events (a calendar with a confetti burst), files (a folder with a small tab), design & dev (a puzzle piece with a node link), travel (a car with a map pin). File names: cat-health.svg, cat-family.svg, cat-faith.svg, cat-tools.svg, cat-time.svg, cat-events.svg, cat-files.svg, cat-dev.svg, cat-travel.svg.
Show a contact sheet at 48px and 24px on light and dark. Validate: consistent weight and metaphor level, readable at 24px, under 3 KB each.
```

## Prompt 5 - install-guide helpers (friendly, no phone UI)
```
Stage 1: three small illustrations for the "how to install" page (SVG viewBox 320x200, light and dark): (1) "download": a tile with a big down arrow landing on a shelf; (2) "allow once": a tile and a shield with a check mark, a friendly hand-less gesture (no hands, no faces), meaning "you approve this once"; (3) "done": the same tile on a home screen grid with a small sparkle. They sit above the real instruction steps, so they must be calm, simple and reassuring (the install flow shows scary Android warnings).
Do NOT draw Android system dialogs or any real brand UI; keep it abstract.
Validate: no text, under 8 KB, light + dark.
```

## After ChatGPT delivers (developer checklist)
Validate each SVG (allowed elements only, sizes), look at the rendered sheets, put files in `web/art/store/`, add them to `web/sw.js` SHELL, wire into `ui/*` (hero, empty states, category icons, header mark), regenerate PNG icons (`npm run icons`), update `docs/DESIGN_LANGUAGE.md` and `docs/PENDING_CHATGPT_PROMPTS.md`, run the full regression.

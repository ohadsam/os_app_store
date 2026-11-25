# Design language
Personality: friendly, clear, store-like. Tokens (light/dark) in `web/css/app.css` `:root`: `bg surface surface2 ink muted line brand brand2 accent good warn tint`. Brand = indigo `#4f46e5` to cyan `#06b6d4` gradient (hero, icon). Cards radius 16, pills 999, tap targets >= 44 px, one primary action per card/screen, logical CSS properties only, reduced motion respected. Icons: inline 24-grid, stroke 1.8, round caps (`js/icons.js`). Store icon: shopping bag with a down arrow on the brand gradient (`web/icon.svg`).
Hard rules: original work only; all pictures in the store are AI-made or generated from the apps themselves (stated in About + footer); no text inside art; RTL-safe.

## Delivered art (1.1.0)
Logo: a storefront awning over a box with up and down arrows (indigo->cyan rounded square, white shape, amber accent). Hero: two shelves of rounded tiles with up/down arrows and soft clouds. States/install: tile + magnifier / cloud / retry / dashed phone frame; download / shield-check / sparkle. Categories: 48 grid duotone, `currentColor` stroke (rendered through a CSS mask so they follow the text colour). All SVG files use only allowed elements, no text.

## Second ChatGPT round (1.3.0)
Integrated: refreshed hero, About illustration, nine category badges (home category row). **Not integrated:** the logo lockups, wordmarks, share card and splash of this round spell the name "OS APPs and Downs" (with "and"); the owner decided on "OS APPs & Downs" - they must be regenerated with the ampersand (follow-up prompt in the chat / `docs/prompts/LOGO_LOCKUP_PROMPT.md`). The symbol (`icon.svg`) is unchanged.

## Third round (1.4.0): the logo with the name
The lockups were regenerated with the ampersand: custom lettering "OS APPs & Downs" (APPs emphasised in indigo / cyan, the up arrow over the A, the down arrow under the n). Used: `brand/logo-horizontal-*` in the header (light/dark pair, `ui/art.js`), `brand/logo-stacked-*` on About, `social/share-card.png` as `og:image` (link previews). Not used on purpose: `splash.png` (an installed PWA builds its own splash from the icon + background colour), the wordmark-only and Hebrew-line files (kept in the owner's ZIP for later use). The hero art has a fixed height; the fill below it uses the art's sampled bottom colours so there is no seam.

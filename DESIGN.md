---
name: Agentic Coding in Terminal
description: Warm paper-and-clay documentation world for a terminal-tooling workshop
colors:
  book-cloth-clay: "#c15f3c"
  claude-terracotta: "#d97959"
  ivory-paper: "#faf9f5"
  warm-charcoal: "#1a1815"
  card-ivory: "#fffdfa"
  card-umber: "#221f1a"
  stone-mist: "#f7f5ef"
  stone-ink: "#211f1a"
  stone-shade: "#635f55"
  stone-dusk: "#b9b5a7"
  stone-border-light: "#e7e2d6"
  stone-border-dark: "#35312a"
  table-head-ivory: "#f2efe6"
  table-head-umber: "#2a2621"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.1rem, 7vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.11
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.22em"
  label-small:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.22em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.7875em"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
components:
  button-primary:
    backgroundColor: "#b45937"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "13px 28px"
  code-chip:
    backgroundColor: "rgba(60, 50, 40, 0.06)"
    rounded: "{rounded.sm}"
    padding: "2px 3px"
---

# Design System: Agentic Coding in Terminal

## Overview

**Creative North Star: "The Warm Terminal"**

Terminal-native subject matter deliberately wrapped in warm ivory and clay instead of cold hacker black. The contrast is the identity: a site about shells, agents, and CLI flags that reads like a well-bound manual on a sunlit desk. Every neutral carries a warm stone cast, the single accent is a fired clay, and the two themes are the same room at different hours, warm charcoal at night rather than void black.

The personality is cozy, practical, craftsman. Density serves the mid-task reader: reference tables, copy-ready commands, and firm hierarchy come first, and comfort comes from material warmth rather than from whitespace luxury. Nothing shouts; interactive surfaces reveal their character only when touched.

Confirmed anti-references: the cold hacker terminal (pure black, neon green/cyan, glow, matrix effects) and corporate SaaS gloss (blue-purple gradients, glassmorphism, floating 3D blobs). This world exists to refuse both.

**Key Characteristics:**
- One clay accent over an all-warm stone neutral family; no second hue anywhere in the UI
- System font stacks only; character comes from color, spacing, and material, not typefaces
- Flat reading surface; soft warm lift reserved for interactive surfaces
- Dual-theme parity: every surface tuned for warm ivory and warm charcoal alike
- Built to be projected and annotated live (presenter kit is part of the design)

## Colors

One fired-clay voice over a family of warm stones; the palette re-tints per theme from a single HSL variable set rather than maintaining two palettes.

### Primary
- **Book-Cloth Clay** (#c15f3c): the light-mode accent. Links, CTAs, active navigation (sidebar and TOC), hover borders, selection tint. Derived at runtime from `--primary-hue: 16deg / --primary-saturation: 53% / --primary-lightness: 55%` in `assets/css/custom.css`; Hextra computes the full primary-50…900 ramp from those three variables.
- **Claude Terracotta** (#d97959): the dark-mode twin of the same token (`--primary-lightness: 66.7%`, hue 15deg), tuned to land on the Claude brand orange. Same roles as Book-Cloth Clay; never both in one theme.

### Neutral
- **Ivory Paper** (#faf9f5): light-mode body and navbar glass base.
- **Warm Charcoal** (#1a1815): dark-mode body; charcoal with a visible warm cast, never #000.
- **Card Ivory** (#fffdfa) / **Card Umber** (#221f1a): raised card surfaces, one hair lighter/darker than their body so shadow reads as elevation instead of outline.
- **Stone Mist** (#f7f5ef): light tinted surfaces (gray-50 of the warm stone ramp that replaces Tailwind's gray/neutral/slate).
- **Stone Ink** (#211f1a): light-mode heading/body ink.
- **Stone Shade** (#635f55): light-mode muted text tier.
- **Stone Dusk** (#b9b5a7): dark-mode secondary text (deliberately lifted to ~8.6:1 on the body for docs-reading contrast; defined in the `.dark` re-scope of gray-400/500).
- **Stone Border Light** (#e7e2d6) / **Stone Border Dark** (#35312a): card and container hairlines.
- **Table Head Ivory** (#f2efe6) / **Table Head Umber** (#2a2621): table header tint per theme.

### Named Rules
**The One-Clay Rule.** Clay is the only hue in the UI. States, emphasis, and accents re-tint from the primary ramp; no blues, greens, or a second brand color, ever. (Presenter ink colors are user annotation content, not UI, and are exempt.)

**The Warm Stone Rule.** Every gray is a warm stone. The ramp overrides Tailwind's cool gray/neutral/slate globally; if a new element ships with a blue-gray, it is a bug.

## Typography

**Display Font:** ui-sans-serif / system-ui (system stack)
**Body Font:** same system sans stack
**Label/Mono Font:** ui-monospace / SFMono-Regular / Menlo / Consolas

**Character:** Deliberately voiceless typefaces; the system reads as native tooling, loads instantly, and lets color and material carry the personality. Tight negative tracking on large sizes gives headings their set, bound-title feel.

### Hierarchy
- **Display** (700, clamp(3.1rem → 5.5rem)/0.98, -0.05em): the home cover title only, set in three stacked lines ("Agentic / Coding in / Terminal") for a monumental, bound-title mass.
- **Headline** (700, 2.25rem/1.11, -0.025em): docs page titles (the H1 rendered from front matter; never duplicated in the body).
- **Title** (600, 1.875rem/1.2): section H2s; each carries a full-width hairline underline as a structural divider.
- **Body** (400, 1rem/1.75): prose, list items, table cells. The article column caps at ~832px (~90ch), inside the 72rem content cap.
- **Label** (600, 0.78rem, 0.22em tracking, uppercase): the cover's series line and Contents heading — a tracked micro-label, the imprint voice of the manual masthead.
- **Label-small** (600, 0.7rem, 0.22em tracking, uppercase): the same imprint voice sized for the reading pages' chrome — the chapter running head's series line, the chapter crossing's PREVIOUS/NEXT, and the TOC's "On this page". Squeezes to 0.64rem below 480px so the running head clears its folio.
- **Code** (mono, 0.7875em inline): inline chips and fenced blocks; blocks at 12px-equivalent with 16px padding.

The Manual Cover also carries a small set of cover-scoped steps beneath the roles above: colophon at 1.05rem, Contents entry titles at 1.15rem/600, entry notes and mono clay folios at 0.9rem, and the machine-path chip at 0.85rem mono.

### Named Rules
**The System-Voice Rule.** No webfonts. The system stacks are a commitment, not a fallback: they keep the terminal-adjacent voice, zero font-loading shift, and clean llms.txt parity between what humans and machines read.

## Layout

Three-zone docs layout inside a 72rem content cap: left sidebar (page nav), ~832px article column, right "On this page" TOC (visible ≥1280px). The chrome is deliberately uncapped: `--hextra-max-page-width`, `--hextra-max-navbar-width`, and `--hextra-max-footer-width` are set to `none` so navbar, page wrapper, and footer reach the viewport edges on wide monitors, while prose keeps its reading measure.

The home is the Manual Cover, a full-bleed title page rather than a re-capped column: the cover plate (series line, title, colophon, Begin pill) is centered at full viewport width, and only the ruled Contents column caps itself, at 46rem centered. The old 90rem home re-cap is gone; the ground bloom that replaces the retired wash+grain band spans the whole viewport precisely so nothing has to be capped to hide a seam (see Shapes).

Spacing follows Tailwind's 4px base with an observed rhythm of 8 / 16 / 24 / 40: tight inside groups (8px cell padding, 16px block padding), generous between blocks (24px paragraph rhythm, 40px above section titles, more space above a heading than below it).

Breakpoints that matter: 768px (mobile nav, banner in-flow, tables switch to block scroll), 1280px (TOC appears), 640px (cover Contents entries re-grid — note drops below the title/leader/folio line), 480px (bookmark cards stack). Floating chrome (pen, scroll-to-top) anchors bottom-right at 2rem; both the docs TOC scroll box and the mobile cover Contents carry 7.5rem bottom clearance so their last entries can always scroll out from under it.

## Elevation & Depth

**The Paper-On-A-Desk Rule.** The reading surface is flat: hairline borders and tonal tints (table heads, code chips) do the structural work. Shadows exist only on things you can pick up: cards, CTA pills, and floating chrome, with a soft ambient rest state that deepens on hover alongside a small lift. Light-mode shadows are warm brown, never neutral black; the hover glow is clay-tinted so elevation and accent share a temperature.

### Shadow Vocabulary
- **Card rest, light** (`0 1px 2px rgba(63,52,40,.05), 0 5px 14px rgba(63,52,40,.05)`): raised cards at rest; the warm raised-paper recipe.
- **Card hover, light** (`0 3px 8px rgba(63,52,40,.07), 0 18px 34px rgba(150,74,46,.13)`): deepened, clay-tinted; pairs with a -3px translate and clay border.
- **Card rest / hover, dark** (`0 1px 2px rgba(0,0,0,.3)` / `0 2px 6px rgba(0,0,0,.35), 0 20px 40px rgba(0,0,0,.5)`): same behavior, deeper values for the charcoal room.
- **CTA rest** (`0 1px 2px rgba(120,55,30,.12), 0 6px 16px rgba(160,74,46,.18)` light; `0 1px 2px rgba(0,0,0,.3), 0 8px 22px rgba(217,121,89,.22)` dark): the Begin pill; hover deepens (light `0 3px 8px … 0 12px 28px`, dark `0 3px 8px rgba(0,0,0,.35), 0 12px 30px rgba(217,121,89,.3)`) with a -2px lift.
- **Chrome float** (`0 2px 10px rgba(0,0,0,.45)`): pen, scroll-to-top, presenter toolbar; raised dark circles with backdrop blur, same recipe in both themes.

## Shapes

A four-step radius ladder keyed to interactivity: 4px (nav items), 6px (inline code chips, framed bookmark images, cover focus rings), 8px (bookmark cards, lightbox), 12px (code blocks, the cover's machine chip), and full pills (9999px) for the cover's Begin action and the presenter toolbar. Bigger, softer corners mark the most touchable objects.

Borders are 1px hairlines everywhere, in stone or low-alpha white/black; no border is ever thicker than 1px (blockquotes included — the theme's 2px quote bar is thinned to a 1px stone hairline) and no colored left-border accents exist. The bookmark card's signature device is an inner frame: the preview image floats inset 12px on all sides with its own 6px radius, sitting "matted" inside the card. The Manual Cover adds three drawn hairline devices of its own: a 3.5rem × 1px clay rule under the series line, 1px dotted leaders between each Contents entry and its folio (gray-400 light / gray-600 dark), and the hairline flanks of the Contents heading.

The same devices recur on every docs page as the **chapter grammar**: a running head above the H1 (Label-small series line linking to the cover, dotted leader, mono clay folio), the 3.5rem clay rule closing the chapter H1 (`.content h1::after`), and a ruled chapter crossing in place of the stock pager. Folio numbers are read from the home page's `contents` front matter — the cover's own index — so cover and chapters can never disagree; the docs index page, as unnumbered front matter, carries the series line alone. Short clay rule = chapter start, full stone hairline = section: that is the page's rule vocabulary.

The home ground is a single full-bleed clay bloom, not a texture and not a capped band. `--cover-bloom` is `radial-gradient(120% 55% at 50% -12%, rgba(193,95,59,.085), transparent 58%)` in light and `rgba(217,119,87,.12)` in dark, painted on `.manual-cover-page::before` at `inset: 0` across the entire viewport with `overflow: hidden` so it never mints a horizontal scrollbar. Because the glow spans the full width, there is no edge to seam — which is exactly what retired the old capped wash+grain band (and its deleted `grain.svg`). The bloom is strictly home-only and never touches the reading surface.

## Components

Component philosophy: **quiet until touched**. Rest states are hairline-and-tint restrained; the personality lives in the hover response, a 0.2s expo-out (`cubic-bezier(.16, 1, .3, 1)`) lift with deepened warm shadow. Motion is one authored moment (the home cover composing itself in on load, `mc-rise`: a 0.65s expo-out rise of translateY(14px) + blur(6px), staggered through series → rule → title → colophon → Begin → Contents heading → entries 1–6 → machine chip) plus these micro-lifts; everything runs `backwards`, gates behind `prefers-reduced-motion`, and content is fully visible without animation.

### Buttons
- **Shape:** full pill ({rounded.pill}), 13px 28px padding, 600 weight, 1rem.
- **The Begin pill (home cover):** the single filled clay action. Light mode deepens the fill one ramp step (the primary ramp at ×0.84 lightness, ≈ #b45937) so ivory text (#faf9f5) clears 4.5:1; dark mode inverts to a terracotta fill (`--acc-600`, ≈ #d97959) with warm near-black ink (#1a1210).
- **Hover / Focus:** -2px lift with deepened warm CTA shadow (per theme; see Elevation), 0.2s expo-out; active returns to 0. Focus-visible is a 2px clay outline at 3px offset.
- The cover carries **exactly one filled action**; there is no outline or secondary pill (the old hero's second pill is retired). Every other path off the cover is a ruled Contents row, not a competing button.

### Cards / Containers
- **Corner Style:** 8px (bookmark cards).
- **Background:** Card Ivory / Card Umber, one step off the body so elevation reads.
- **Shadow Strategy:** bookmark cards sit on a 1px border and the matted inner frame rather than a lift; hover is a quiet background tint (see Elevation for the raised-card recipe reused by other liftable surfaces).
- **Border:** 1px Stone Border Light/Dark.
- **Internal Padding:** bookmark info column 16px 18px 14px.

### Tables
- **Style:** full column width, header row tinted Table Head Ivory/Umber at 600 weight, left-aligned th over left-aligned cells, 1px stone grid.
- **State:** quiet clay row hover (`rgba(193,95,59,.045)` light / `rgba(217,119,87,.06)` dark, 0.12s).
- **Overflow:** real table layout ≥768px; long tokens (link text, inline code) wrap via `overflow-wrap: anywhere`; below 768px tables fall back to block scroll.

### Task-list Checkboxes
- **Style:** printed form squares — appearance-none, 1.05em, 1px stone hairline (gray-300 light / gray-700 dark), 4px radius. Checked fills clay with a drawn check (SVG mask, no baked-in color).

### Footer
- **Style:** the band rules itself off with a 1px `--card-border` hairline; the copyright line sets in the machine-chip's mono voice at the theme's 0.75rem. The manual's back colophon.

### Inline Code
- **Style:** warm translucent chip (`rgba(60,50,40,.06)` light / `rgba(255,255,255,.07)` dark) with matching 1px border, 6px radius, `box-decoration-break: clone` so wrapped chips keep per-line corners. Fenced blocks: 12px radius, 1px hairline, syntax theme on the warm surface.

### Navigation
- **Navbar:** translucent body-color glass with backdrop blur, uncapped width; site title at 700. The llms banner leads with a drawn inline SVG document glyph (1.8 stroke, currentColor), not an emoji.
- **Sidebar:** 14px items, muted stone at rest; active page in clay text on a soft clay tint, 4px radius. Page order is setup-first (weights match the cover's folio order), so sidebar, pager, cover, and folios tell one 01–06 story.
- **TOC:** heading "On this page" set in Label-small; entries 14px; active entry in clay (color-only change, no weight shift, so the list never reflows while scrolling).
- **Chapter running head** (replaces the breadcrumb, `layouts/_partials/breadcrumb.html`): Label-small series line linking to the cover · dotted leader · 0.85rem mono clay folio. In light mode the folio deepens one ramp step (×0.84, the Begin-pill recipe) to clear 4.5:1 on ivory; leader and folio are aria-hidden like the cover's.
- **Chapter crossing** (replaces the pager, `layouts/_partials/components/pager.html`): above a 1px stone hairline, PREVIOUS and NEXT as two-deck entries — Label-small over a 1.05rem/600 title — bridged by the dotted leader (or ruled from the margin when the chapter is first or last). Hover shifts the title to clay, color only. Below 640px the sides stack, verso left-aligned, recto right-aligned, leader retired.

### Manual Cover (signature)
The home is the title page of a bound field manual (`layout: manual-cover`), not a hero-plus-feature-cards landing. Its parts, top to bottom:
- **Series line** — a centered Label (uppercase, tracked) above the title, the imprint line of the manual.
- **Clay rule** — a 3.5rem × 1px clay bar (`--acc-600`), centered, that grows in (scaleX) on load.
- **Title** — the Display face stacked in three lines, monumental.
- **Colophon** — "Apex Builders Collective × Info PC — {cohort} cohort" at 1.05rem, org names bold (the binding dual-org byline, carried onto the cover).
- **Begin pill** — one filled clay action (see Buttons), "Begin — Setup Guide", setup-first.
- **Ruled Contents** — a printed-index of the six pages: entry title (1.15rem/600) + note (0.9rem, ellipsized) + a 1px dotted leader + a mono clay folio (0.9rem, 01–06), in setup-first order. The heading is a Label between two hairline flanks. Entry title shifts to clay on hover (color only).
- **Machine chip** — a mono (0.85rem) bordered row (`--card-border`, 12px radius) linking `/llms-full.txt`, its path in clay; the llms.txt binding surfaced as a colophon.
- **Mobile (≤640px)** — each entry re-grids to title + leader + folio on one line with the note dropped below; Contents keeps 7.5rem bottom clearance for the floating pen/scroll column.
- **Compose-in** — `mc-rise` (see the philosophy line): parts rise in reading order, gated behind reduced-motion, fully legible without it.

### Presenter Kit (signature)
Floating raised-dark circles (2.5rem, `rgba(48,48,52,.92)` fill, 1px light border, blur backdrop, chrome-float shadow) bottom-right for pen and scroll-to-top; a pill toolbar for ink tools with white-chip pressed states; button-anchored tooltips (dark chip, 0.35s delay). Projector mode bumps the root font to 20px so the whole rem-based layout rescales coherently. These stay dark chrome in both themes by design.

## Do's and Don'ts

### Do:
- **Do** derive every accent use from the primary ramp so both themes re-tint from the three HSL variables in `custom.css`; new hues are never introduced per-component. When a fill needs more contrast (the Begin pill on ivory), deepen along the ramp (×0.84 lightness) rather than reaching for a new color.
- **Do** keep light-mode shadows warm (brown/clay rgba values), with a real offset and soft blur; follow the rest → hover deepening pattern with a -2/-3px lift at 0.2s expo-out.
- **Do** keep the home ground full-bleed and seam-free: the clay bloom paints `.manual-cover-page::before` at `inset: 0` across the viewport, the cover plate is centered at full width, and only the Contents column caps (46rem).
- **Do** draw icons as inline SVG (currentColor, ~1.8–2 stroke weight); never ship an emoji or icon font as a UI glyph.
- **Do** verify every surface in both themes before shipping; dark is the default and light is a peer, and the dark text tiers stay at their lifted contrast values (Stone Dusk secondary at ~8.6:1).
- **Do** keep tables full-width with tinted left-aligned headers and quiet clay row hover; reference density is the product.
- **Do** gate all motion behind `prefers-reduced-motion` and keep content fully visible without it.

### Don't:
- **Don't** use pure black backgrounds, neon green/cyan accents, glow effects, or terminal-cliché styling; the warm room is the identity (confirmed anti-reference).
- **Don't** use blue-purple gradients, glassmorphism panels, or 3D blob decoration; SaaS gloss is the other confirmed anti-reference.
- **Don't** introduce cool grays anywhere; every neutral comes from the warm stone ramp.
- **Don't** add webfonts; the system stacks are a commitment (The System-Voice Rule).
- **Don't** let the home's clay bloom or its `mc-rise` compose-in choreography touch the docs reading surfaces; the reading room stays flat and still.
- **Don't** reintroduce a capped wash/grain band or any full-width seam on the home; the ground is one full-bleed bloom, seam-free at any width.
- **Don't** add a second filled CTA to the cover; it carries exactly one clay action (Begin), and secondary paths are the ruled Contents rows, never a competing or outline button.

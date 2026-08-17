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
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
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
  xl: "24px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
components:
  button-primary:
    backgroundColor: "{colors.book-cloth-clay}"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.book-cloth-clay}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  card-feature:
    backgroundColor: "{colors.card-ivory}"
    rounded: "{rounded.xl}"
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
- **Display** (700, 3rem/1.0, -0.05em): home hero headline only.
- **Headline** (700, 2.25rem/1.11, -0.025em): docs page titles (the H1 rendered from front matter; never duplicated in the body).
- **Title** (600, 1.875rem/1.2): section H2s; each carries a full-width hairline underline as a structural divider.
- **Body** (400, 1rem/1.75): prose, list items, table cells. The article column caps at ~832px (~90ch), inside the 72rem content cap.
- **Code** (mono, 0.7875em inline): inline chips and fenced blocks; blocks at 12px-equivalent with 16px padding.

### Named Rules
**The System-Voice Rule.** No webfonts. The system stacks are a commitment, not a fallback: they keep the terminal-adjacent voice, zero font-loading shift, and clean llms.txt parity between what humans and machines read.

## Layout

Three-zone docs layout inside a 72rem content cap: left sidebar (page nav), ~832px article column, right "On this page" TOC (visible ≥1280px). The chrome is deliberately uncapped: `--hextra-max-page-width`, `--hextra-max-navbar-width`, and `--hextra-max-footer-width` are set to `none` so navbar, page wrapper, and footer reach the viewport edges on wide monitors, while prose keeps its reading measure. The home layout re-caps itself at 90rem, centered.

Spacing follows Tailwind's 4px base with an observed rhythm of 8 / 16 / 24 / 40: tight inside groups (8px cell padding, 16px block padding), generous between blocks (24px paragraph rhythm, 40px above section titles, more space above a heading than below it).

The home feature grid is a justified flex wrap (`flex: 1 1 24rem`), producing 3 + 2 rows with no orphan cell, collapsing to 2 then 1 column. Breakpoints that matter: 768px (mobile nav, banner in-flow, tables switch to block scroll), 1280px (TOC appears), 480px (bookmark cards stack). Floating chrome (pen, scroll-to-top) anchors bottom-right at 2rem; the TOC scroll box carries 7.5rem bottom clearance so its last entries can always scroll out from under it.

## Elevation & Depth

**The Paper-On-A-Desk Rule.** The reading surface is flat: hairline borders and tonal tints (table heads, code chips) do the structural work. Shadows exist only on things you can pick up: cards, CTA pills, and floating chrome, with a soft ambient rest state that deepens on hover alongside a small lift. Light-mode shadows are warm brown, never neutral black; the hover glow is clay-tinted so elevation and accent share a temperature.

### Shadow Vocabulary
- **Card rest, light** (`0 1px 2px rgba(63,52,40,.05), 0 5px 14px rgba(63,52,40,.05)`): feature cards at rest.
- **Card hover, light** (`0 3px 8px rgba(63,52,40,.07), 0 18px 34px rgba(150,74,46,.13)`): deepened, clay-tinted; pairs with a -3px translate and clay border.
- **Card rest / hover, dark** (`0 1px 2px rgba(0,0,0,.3)` / `0 2px 6px rgba(0,0,0,.35), 0 20px 40px rgba(0,0,0,.5)`): same behavior, deeper values for the charcoal room.
- **CTA rest** (`0 1px 2px rgba(120,55,30,.12), 0 6px 16px rgba(160,74,46,.18)`): hero pills; hover deepens to `0 3px 8px … 0 12px 28px` with a -2px lift.
- **Chrome float** (`0 2px 10px rgba(0,0,0,.45)`): pen, scroll-to-top, presenter toolbar; raised dark circles with backdrop blur, same recipe in both themes.

## Shapes

A five-step radius ladder keyed to interactivity: 4px (nav items), 6px (inline code chips, framed bookmark images), 8px (bookmark cards, lightbox), 12px (code blocks), 24px (feature cards), and full pills (9999px) for the two hero CTAs and the presenter toolbar. Bigger, softer corners mark the most touchable objects.

Borders are 1px hairlines everywhere, in stone or low-alpha white/black; no border is ever thicker than 1px and no colored left-border accents exist. The bookmark card's signature device is an inner frame: the preview image floats inset 12px on all sides with its own 6px radius, sitting "matted" inside the card. The home hero carries the world's one atmospheric texture: a clay radial wash from the top-left plus an SVG grain overlay (opacity .28 light / .22 dark, `mix-blend-mode: overlay`), scoped strictly to the home main and never touching the reading surface.

## Components

Component philosophy: **quiet until touched**. Rest states are hairline-and-tint restrained; the personality lives in the hover response, a 0.2s expo-out (`cubic-bezier(.16, 1, .3, 1)`) lift with deepened warm shadow. Motion is one authored moment (the home hero rise: headline, subtitle, CTAs, then cards staggering in with an 8px blur-out over ~0.6-0.7s) plus these micro-lifts; everything gates behind `prefers-reduced-motion` and content is fully visible without animation.

### Buttons
- **Shape:** full pill ({rounded.pill}), 12px 24px padding, 500 weight.
- **Primary:** Book-Cloth Clay / Claude Terracotta fill, Ivory Paper text, CTA rest shadow.
- **Hover / Focus:** -2px lift, deepened clay shadow, 0.2s expo-out; active returns to 0.
- **Outline (secondary):** transparent fill, clay text, 1.5px inset clay ring (inset shadow, so the box never resizes); hover floods to clay fill with white text. Exactly one filled primary per hero.

### Cards / Containers
- **Corner Style:** 24px (feature cards), 8px (bookmark cards).
- **Background:** Card Ivory / Card Umber, one step off the body so elevation reads.
- **Shadow Strategy:** card rest → card hover vocabulary (see Elevation); hover adds -3px translate and a half-opacity clay border; the title icon (clay, 0.22s) nudges up 1px and scales 1.06.
- **Border:** 1px Stone Border Light/Dark.
- **Internal Padding:** theme default (feature cards); bookmark info column 16px 18px 14px.

### Tables
- **Style:** full column width, header row tinted Table Head Ivory/Umber at 600 weight, left-aligned th over left-aligned cells, 1px stone grid.
- **State:** quiet clay row hover (`rgba(193,95,59,.045)` light / `rgba(217,119,87,.06)` dark, 0.12s).
- **Overflow:** real table layout ≥768px; long tokens (link text, inline code) wrap via `overflow-wrap: anywhere`; below 768px tables fall back to block scroll.

### Inline Code
- **Style:** warm translucent chip (`rgba(60,50,40,.06)` light / `rgba(255,255,255,.07)` dark) with matching 1px border, 6px radius, `box-decoration-break: clone` so wrapped chips keep per-line corners. Fenced blocks: 12px radius, 1px hairline, syntax theme on the warm surface.

### Navigation
- **Navbar:** translucent body-color glass with backdrop blur, uncapped width; site title at 700.
- **Sidebar:** 14px items, muted stone at rest; active page in clay text on a soft clay tint, 4px radius.
- **TOC:** "On this page", 14px; active entry in clay (color-only change, no weight shift, so the list never reflows while scrolling).
- **Breadcrumb:** stone muted, current page in ink.

### Presenter Kit (signature)
Floating raised-dark circles (2.5rem, `rgba(48,48,52,.92)` fill, 1px light border, blur backdrop, chrome-float shadow) bottom-right for pen and scroll-to-top; a pill toolbar for ink tools with white-chip pressed states; button-anchored tooltips (dark chip, 0.35s delay). Projector mode bumps the root font to 20px so the whole rem-based layout rescales coherently. These stay dark chrome in both themes by design.

## Do's and Don'ts

### Do:
- **Do** derive every accent use from the primary ramp so both themes re-tint from the three HSL variables in `custom.css`; new hues are never introduced per-component.
- **Do** keep light-mode shadows warm (brown/clay rgba values), with a real offset and soft blur; follow the rest → hover deepening pattern with a -2/-3px lift at 0.2s expo-out.
- **Do** verify every surface in both themes before shipping; dark is the default and light is a peer, and the dark text tiers stay at their lifted contrast values (Stone Dusk secondary at ~8.6:1).
- **Do** keep tables full-width with tinted left-aligned headers and quiet clay row hover; reference density is the product.
- **Do** gate all motion behind `prefers-reduced-motion` and keep content fully visible without it.

### Don't:
- **Don't** use pure black backgrounds, neon green/cyan accents, glow effects, or terminal-cliché styling; the warm room is the identity (confirmed anti-reference).
- **Don't** use blue-purple gradients, glassmorphism panels, or 3D blob decoration; SaaS gloss is the other confirmed anti-reference.
- **Don't** introduce cool grays anywhere; every neutral comes from the warm stone ramp.
- **Don't** add webfonts; the system stacks are a commitment (The System-Voice Rule).
- **Don't** let the hero atmosphere (wash, grain) or entrance choreography leak onto docs reading surfaces; the reading room stays still and flat.
- **Don't** put more than one filled clay CTA in a single hero or section; the second action is always the outline pill.

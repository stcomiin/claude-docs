# Claude Code Context

## Stack

Hugo static site with Hextra theme, deployed to GitHub Pages via Actions.
Hugo runs via Docker — not installed natively.

## Commands

```bash
# Dev server
docker run --rm -d --name hugo-preview -p 1313:1313 -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo server --bind 0.0.0.0 --baseURL "http://localhost:1313" --disableFastRender --noHTTPCache

# Restart (required after asset/config changes)
docker stop hugo-preview && docker run --rm -d --name hugo-preview -p 1313:1313 -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo server --bind 0.0.0.0 --baseURL "http://localhost:1313" --disableFastRender --noHTTPCache

# Build
docker run --rm -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo --gc --minify

# Update Hextra theme
docker run --rm -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo mod get -u github.com/imfing/hextra
```

On Windows with Git Bash, prefix Docker commands with `MSYS_NO_PATHCONV=1` to prevent path mangling.

## Gotchas

- **Docker caches assets.** Changes to `assets/css/`, `hugo.yaml`, or layouts require a container restart. Content/static changes reload automatically.
- **No duplicate H1 headings.** Hextra renders `title` from front matter as the page H1. Never add `# Title` in the markdown body — it will show twice.
- **Hugo `weight` = sidebar order.** Lower weight = higher position. Current pages use 1–4.
- **Images go in `static/images/`**, referenced as `/images/filename.png` in markdown (not relative paths).
- **Custom domain:** CNAME lives in `static/CNAME` so it copies to the build output.
- **Hextra prose img defaults leak into custom shortcodes/layouts.** `.content :where(img)` adds `margin-block: 1rem`, `border-radius`, and `max-width: 100%` to every image inside `.content`. The selector uses `:where()` so it has minimal specificity, but the cascade still wins on properties you didn't declare. Always explicitly reset `margin: 0` and `border-radius: 0` (or your intended values) on custom img styles, or opt out via `class="not-prose"` on an ancestor.
- **`position: absolute; inset: Npx` doesn't auto-size `<img>`/`<video>`/`<iframe>`.** For non-replaced elements, all four insets auto-compute width/height. For replaced elements, CSS runs the inline-replaced width algorithm first (which honors `max-width: 100%` from Hextra preflight) and then solves for offsets — width gets locked to the parent, the box over-constrains, and the browser silently drops `right`/`bottom`. Use `top/left: Npx; width: calc(100% - 2*Npx); height: calc(100% - 2*Npx)` for replaced elements instead.
- **Hextra's layout caps live in CSS variables, not classes.** `variables.css` defines `--hextra-max-page-width: 90rem`, `--hextra-max-content-width: 72rem`, `--hextra-max-navbar-width: 90rem`, `--hextra-max-footer-width: 80rem`, then the `.hextra-max-*-width` classes simply consume them. Override the **variables** in `:root` (not the classes) so every consumer — including Hextra's own internal helpers — sees the change. Useful asymmetric default: drop page/navbar/footer caps so chrome fills wide viewports, but keep the content cap so prose stays at ~80ch (`custom.css` already does this).

## Structure

```
content/_index.md          → Landing page (hextra-home layout)
content/docs/_index.md     → Docs section index
content/docs/*.md          → Doc pages (weight controls sidebar order)
static/images/             → Content images
static/                    → Favicons, CNAME
assets/css/custom.css      → Custom CSS overrides (auto-loaded by Hextra)
layouts/shortcodes/        → Custom shortcodes (e.g. bookmark.html)
layouts/partials/custom/   → Head injections, banners
hugo.yaml                  → Site config
go.mod / go.sum            → Hugo module (Hextra theme)
.github/workflows/pages.yaml → GitHub Pages deployment
```

## Adding Pages

Create `content/docs/my-page.md` with front matter:

```yaml
---
title: My Page
weight: 5
---
```

For sub-sections, create a folder with `_index.md` inside it.

## Shortcodes

### Embedded link cards

Use the `bookmark` shortcode for Notion-style link previews (title + description + favicon + OG image):

```
{{< bookmark url="https://example.com/post" title="Post title" description="Short blurb shown under the title." icon="https://example.com/favicon.ico" image="/images/og-image.png" >}}
```

Only `url` is required; everything else falls back gracefully. Defined in `layouts/shortcodes/bookmark.html`, styled in `assets/css/custom.css` under `.bookmark-card`. The image is positioned with absolute insets (see Gotchas about replaced elements) so it sits framed inside the card.

# Claude Code Context

## Stack

Hugo static site with Hextra theme, deployed to GitHub Pages via Actions.
Hugo runs via Docker — not installed natively.

## Commands

```bash
# Dev server
docker run --rm -d --name hugo-preview -p 1313:1313 -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo server --bind 0.0.0.0 --baseURL "http://localhost:1313" --disableFastRender --noHTTPCache

# Restart (required after asset/config changes)
docker stop hugo-preview && !!

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

## Structure

```
content/_index.md          → Landing page (hextra-home layout)
content/docs/_index.md     → Docs section index
content/docs/*.md          → Doc pages (weight controls sidebar order)
static/images/             → Content images
static/                    → Favicons, CNAME
assets/css/custom.css      → Custom CSS overrides (auto-loaded by Hextra)
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

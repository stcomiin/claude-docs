# Claude Code Context

## Rules

- **Always use the chrome-devtools MCP to verify any UI change.** Every change that could affect rendered HTML, CSS, layout, navigation, internal links, anchor resolution, console output, or page assets must be verified by driving the live dev server through chrome-devtools — never by curl, WebFetch, or eyeballing the source file alone. Curl confirms bytes; only the browser confirms the rendered page. No exceptions. Workflow details in the Verification section below.

## Stack

Hugo static site with Hextra theme, deployed to GitHub Pages via Actions.
Hugo runs via Docker — not installed natively.

## Commands

```bash
# Dev server
docker run --rm -d --name hugo-preview -p 1313:1313 -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo server --bind 0.0.0.0 --baseURL "http://localhost:1313" --disableFastRender --noHTTPCache --poll 700ms

# Restart (required after config / Hextra theme changes)
docker stop hugo-preview && docker run --rm -d --name hugo-preview -p 1313:1313 -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo server --bind 0.0.0.0 --baseURL "http://localhost:1313" --disableFastRender --noHTTPCache --poll 700ms

# Build
docker run --rm -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo --gc --minify

# Update Hextra theme
docker run --rm -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo mod get -u github.com/imfing/hextra
```

On Windows with Git Bash, prefix Docker commands with `MSYS_NO_PATHCONV=1` to prevent path mangling.

## Gotchas

- **Live reload requires `--poll` on Docker-for-Windows.** Hugo's default watcher uses inotify, but Docker Desktop's virtualized Windows→Linux bind mount does **not** forward inotify events — file contents update on read, but the kernel inside the container never sees a change event, so Hugo never rebuilds. Always launch with `--poll 700ms` (already in the Commands above) so Hugo stats files on an interval instead. Without it the dev server appears alive but silently serves the build from container start.
- **Restart still needed for config / theme changes.** With `--poll`, content, layouts, shortcodes, `assets/css/`, and `static/images/` reload automatically. But `hugo.yaml` module changes and Hextra theme updates (`hugo mod get -u …`) require a container restart — Hugo only resolves modules at startup.
- **No duplicate H1 headings.** Hextra renders `title` from front matter as the page H1. Never add `# Title` in the markdown body — it will show twice.
- **Hugo `weight` = sidebar order.** Lower weight = higher position. Current pages use 1–4.
- **Images go in `static/images/`**, referenced as `/images/filename.png` in markdown (not relative paths).
- **Internal page links must be absolute (`/docs/<slug>/`), not bare slugs.** Hugo's goldmark renderer treats `[text](slug)` as a literal href — it is *not* a `ref`/`relref` shortcode. With pretty URLs, the current page is served at `/docs/<page>/`, so a bare slug like `(skills-plugins-deep-dive)` resolves against that directory → `/docs/<page>/skills-plugins-deep-dive` → 404. Bare slugs *only* work from `_index.md` (served at `/docs/`). The safe pattern everywhere is `[text](/docs/<slug>/)`, and for anchored links `[text](/docs/<slug>/#anchor)` (the trailing slash before `#` avoids a 301 redirect that some clients drop fragments on).
- **Custom domain:** CNAME lives in `static/CNAME` so it copies to the build output.
- **Hextra prose img defaults leak into custom shortcodes/layouts.** `.content :where(img)` adds `margin-block: 1rem`, `border-radius`, and `max-width: 100%` to every image inside `.content`. The selector uses `:where()` so it has minimal specificity, but the cascade still wins on properties you didn't declare. Always explicitly reset `margin: 0` and `border-radius: 0` (or your intended values) on custom img styles, or opt out via `class="not-prose"` on an ancestor.
- **`position: absolute; inset: Npx` doesn't auto-size `<img>`/`<video>`/`<iframe>`.** For non-replaced elements, all four insets auto-compute width/height. For replaced elements, CSS runs the inline-replaced width algorithm first (which honors `max-width: 100%` from Hextra preflight) and then solves for offsets — width gets locked to the parent, the box over-constrains, and the browser silently drops `right`/`bottom`. Use `top/left: Npx; width: calc(100% - 2*Npx); height: calc(100% - 2*Npx)` for replaced elements instead.
- **Hextra's layout caps live in CSS variables, not classes.** `variables.css` defines `--hextra-max-page-width: 90rem`, `--hextra-max-content-width: 72rem`, `--hextra-max-navbar-width: 90rem`, `--hextra-max-footer-width: 80rem`, then the `.hextra-max-*-width` classes simply consume them. Override the **variables** in `:root` (not the classes) so every consumer — including Hextra's own internal helpers — sees the change. Useful asymmetric default: drop page/navbar/footer caps so chrome fills wide viewports, but keep the content cap so prose stays at ~80ch (`custom.css` already does this).

## Verification

The repo ships with a project-scoped `.mcp.json` that wires up the [chrome-devtools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp). On first session start in this repo Claude Code will prompt to approve it — accept it. Per the Rules section above, this MCP is the **mandatory** verification path for any UI change.

Standard workflow:

1. Make sure the dev server is up (see Commands above).
2. Drive the rendered site at `http://localhost:1313/` with chrome-devtools tools — `navigate_page`, `evaluate_script`, `list_console_messages`, `list_network_requests`, `take_snapshot`, `take_screenshot`. Confirm the change visually and check console for errors after every meaningful edit.
3. For internal-link changes, run an evaluate_script that enumerates main a[href], fetches each destination, and verifies HTTP 200 plus that any #fragment matches a real id on the destination page. (See the script pattern in the Verification section — DOMParser-parsed docs inherit the running page's baseURI, so always resolve via a.getAttribute('href') against the source page URL, not via a.href.)
4. Reload the page or restart the Docker container if changes don't appear — the file watcher across the Windows-Docker volume boundary is unreliable, and Hugo will sometimes serve stale HTML from its internal build cache. Cache-bust fetches with `?t=Date.now()` if you suspect staleness.

Do not skip this step "because the change is small" — small CSS, layout, or link edits are exactly where regressions hide.

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

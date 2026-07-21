# Agentic Coding in Terminal

Workshop materials — Apex Builders Collective × Info PC

**Live site:** https://claude-docs.devbionics.com

## Prerequisites

- [Docker](https://www.docker.com/) installed and running

## Local Development

```bash
# Start dev server
docker run --rm -d --name hugo-preview -p 1313:1313 -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo server --bind 0.0.0.0 --baseURL "http://localhost:1313" --disableFastRender --noHTTPCache

# Build static site
docker run --rm -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo --gc --minify
```

Open http://localhost:1313 to preview.

**Important:** The Docker container caches assets (CSS, templates). After editing files in `assets/` or `hugo.yaml`, restart the container:

```bash
docker stop hugo-preview && docker run --rm -d --name hugo-preview -p 1313:1313 -v "$(pwd):/src" -w /src hugomods/hugo:exts hugo server --bind 0.0.0.0 --baseURL "http://localhost:1313" --disableFastRender --noHTTPCache
```

Content changes in `content/` and `static/` are picked up automatically via live reload.

## Adding New Pages

### 1. Create a markdown file

Add a `.md` file inside `content/docs/`:

```
content/docs/my-new-page.md
```

### 2. Add front matter

Every page needs YAML front matter at the top:

```yaml
---
title: My New Page
weight: 5
---

Your content starts here.
```

- **`title`** — Page title displayed in the sidebar and browser tab.
- **`weight`** — Controls sidebar ordering. Lower numbers appear higher. Existing pages use 1–5.

**Do not** add a `# Title` heading in the body — Hextra renders the `title` from front matter automatically.

### 3. Adding a sub-section (folder with multiple pages)

```
content/docs/my-section/
├── _index.md          # Section landing page (required)
├── first-page.md
└── second-page.md
```

The `_index.md` defines the section and creates a collapsible group in the sidebar:

```yaml
---
title: My Section
weight: 5
---

Optional intro text for the section landing page.
```

### 4. Images

Place images in `static/images/` and reference them in markdown:

```markdown
![Alt text](/images/my-image.png)
```

### 5. Internal links

Link to other pages using relative paths within the docs section:

```markdown
[Setup Guide](setup-guide)
[Cheat Sheet](cheat-sheet)
```

## Useful Hextra Features

### Callouts

```markdown
{{</* callout type="info" */>}}
  This is an info callout. Types: info, warning, error.
{{</* /callout */>}}
```

### Tabs

```markdown
{{</* tabs */>}}
  {{</* tab name="YAML" */>}}YAML content{{</* /tab */>}}
  {{</* tab name="JSON" */>}}JSON content{{</* /tab */>}}
{{</* /tabs */>}}
```

### Collapsible details

```markdown
{{</* details title="Click to expand" closed="true" */>}}
  Hidden content here.
{{</* /details */>}}
```

### Code blocks with copy button

Fenced code blocks automatically get a copy button on hover.

## Presenter Kit

Every page ships live-presentation tools for the instructor: an ephemeral ink overlay for drawing and typing over content while teaching, and a projector mode that enlarges type for the back of the room. Everything runs client-side; annotations are never saved or synced.

### Controls

| Control | Action |
| --- | --- |
| Pencil button (bottom-right) or `Alt+P` | Toggle the annotation overlay and its toolbar |
| `Draw` / `Text` | Mode pair — exactly one is active (shown as a filled chip): freehand ink, or click-to-type labels |
| Color dots | Red pen, blue pen, yellow highlighter; labels use the selected color |
| `Undo` or `Ctrl+Z` | Remove the newest stroke or label |
| `Clear` | Remove every annotation |
| `Exit` or `Esc` | Leave the overlay; annotations stay visible so links work again |
| `Projector` or `Alt+B` | Toggle 20px root type for projector legibility |

In text mode, click the page to place a typing cursor: `Enter` adds a line, long lines wrap, `Ctrl+Enter` or clicking elsewhere commits, `Esc` cancels.

### Behavior guarantees

- Annotations anchor to the content and scroll with the page.
- Nothing persists: no `localStorage`, no network. Refresh or navigation wipes all ink and labels. Projector mode alone survives page changes (via `sessionStorage`) and dies with the tab.
- Shortcuts match the typed character, so they work on AZERTY and QWERTZ layouts; `Alt` combos also accept the physical key for macOS. Shortcuts never fire while typing in a search field or label.
- There is no sync between browsers — participants see the presenter's ink only through the projector or screen share.

### Implementation

All behavior lives in `assets/js/presenter.js` (vanilla JS, no dependencies), loaded through Hugo Pipes from `layouts/partials/custom/head-end.html`, with styles under the `.presenter-*` classes in `assets/css/custom.css`. Verify any change to these files in the browser per CLAUDE.md.

## Project Structure

```
claude-docs/
├── content/
│   ├── _index.md                    # Landing page (hero + feature cards)
│   └── docs/
│       ├── _index.md                # Docs section index
│       ├── agentic-coding-in-terminal.md   # Main workshop curriculum
│       ├── setup-guide.md           # Pre-workshop setup
│       ├── skills-plugins-deep-dive.md
│       ├── existing-codebase-workflows.md
│       ├── security.md              # Cybersecurity & hardening
│       └── cheat-sheet.md
├── static/
│   ├── images/                      # Content images
│   ├── favicon.ico                  # Favicons
│   └── CNAME                        # Custom domain
├── assets/
│   ├── css/custom.css               # Custom styling
│   └── js/presenter.js              # Presenter kit (ink overlay + projector mode)
├── layouts/
│   ├── partials/custom/             # Head injections, llms.txt banner
│   └── shortcodes/                  # bookmark.html link cards
├── hugo.yaml                        # Site configuration
├── go.mod / go.sum                  # Hugo module (Hextra theme)
└── .github/workflows/pages.yaml    # GitHub Pages deployment
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow in `.github/workflows/pages.yaml`, which builds the site with Hugo and deploys to GitHub Pages.

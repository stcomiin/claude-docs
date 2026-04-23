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
- **`weight`** — Controls sidebar ordering. Lower numbers appear higher. Existing pages use 1–4.

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

## Project Structure

```
claude-docs/
├── content/
│   ├── _index.md                    # Landing page (hero + feature cards)
│   └── docs/
│       ├── _index.md                # Main workshop content
│       ├── setup-guide.md           # Pre-workshop setup
│       ├── skills-plugins-deep-dive.md
│       └── cheat-sheet.md
├── static/
│   ├── images/                      # Content images
│   ├── favicon.ico                  # Favicons
│   └── CNAME                        # Custom domain
├── assets/css/custom.css            # Custom styling
├── hugo.yaml                        # Site configuration
├── go.mod / go.sum                  # Hugo module (Hextra theme)
└── .github/workflows/pages.yaml    # GitHub Pages deployment
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow in `.github/workflows/pages.yaml`, which builds the site with Hugo and deploys to GitHub Pages.

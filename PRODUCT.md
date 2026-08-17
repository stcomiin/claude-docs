# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three confirmed audiences, in order of how the site meets them:

- **Live workshop attendees** — following along on their own laptops while a presenter drives the site on a projector during the session.
- **Returning attendees** — people who took the workshop and come back mid-task, terminal open, to look up a command, flag, or workflow.
- **Any developer** — general developers learning agentic terminal coding who never attended a session.

AI assistants ingest the site via the llms.txt outputs; that path is a binding capability (see Capabilities), not a primary audience.

## Product Purpose

Workshop curriculum and reference for agentic coding in the terminal: Claude Code, Codex, GSD, BMAD, and Superpowers, plus security hardening and existing-codebase workflows. Success means an attendee arrives set up (pre-workshop guide), can follow the live session, and keeps returning to the material afterward as a working reference.

## Positioning

The authoritative material for a **recurring workshop series** run by Apex Builders Collective × Info PC. Content is refreshed per cohort rather than frozen per event; run-specific facts (dates such as "April 2026", model names, prices, tool versions) are expected to change between runs.

## Operating Context

- A presenter drives the live site on a projector; the presenter kit (projector font-scale mode plus ephemeral ink/label overlay) exists for this and must keep working.
- Attendees follow along on laptops during sessions; afterward they read the site beside an open terminal and copy-paste commands from it.
- AI assistants consume `/llms.txt` and `/llms-full.txt`; the top banner advertises this path.
- Deployed to GitHub Pages at https://claude-docs.devbionics.com (repo: stcomiin/claude-docs); local dev runs Hugo via Docker (see CLAUDE.md / README.md).

## Capabilities and Constraints

- Hugo static site with the Hextra theme; six docs pages (curriculum, setup guide, skills & plugins, cheat sheet, security, existing codebases) plus a landing page and docs index.
- FlexSearch client-side search, dark-default theme with light toggle, edit-on-GitHub links, image lightbox, scroll-to-top.
- **Binding (confirmed 2026-08-18):** the llms.txt / llms-full.txt outputs stay first-class, and the presenter kit stays supported. Future work must not break either.
- Cheat-sheet printability was offered as a binding commitment and **not selected**: treat print-friendliness as a nice-to-have, not a constraint.
- Terminology used across the site: agentic coding, spec-driven development, vibe coding, GSD, BMAD, Superpowers, MCP, CLAUDE.md/AGENTS.md.
- Undecided: the next cohort's date and which run-specific facts refresh with it.

## Brand Commitments

- Site and workshop title: **Agentic Coding in Terminal**.
- **Binding (confirmed 2026-08-18):** dual-org billing "Apex Builders Collective × Info PC" stays on the hero and page bylines.
- Footer copyright line: "© {year} Agentic Coding in Terminal workshop." (via `i18n/en.yaml`).

## Evidence on Hand

- Real screenshots and diagrams in `static/images/` (statusline setup steps, hooks/subagents diagrams, docker CLI example, OCR scan sample, OG covers).
- One embedded bookmark to Anthropic's postmortem article (curriculum page).
- No testimonials, case studies, attendance numbers, or partner logos exist. Future work must not fabricate any.

## Product Principles

1. **Serve the full journey.** Every page should know which moment it serves: before (setup), during (live follow-along and projection), or after (mid-task reference).
2. **Refresh per cohort.** Run-specific facts are data, not structure: keep dates, versions, and prices easy to find and update without reshaping pages.
3. **Reference density beats narrative.** Readers arrive mid-task; scanability, tables, and copy-paste-ready commands outrank prose.
4. **Machine-readable is first-class.** Meaning must survive the llms.txt plain-text path; never trap essential content in visuals alone.
5. **Presentation-safe.** Material must hold up projected at low resolution and annotated live with the ink overlay.

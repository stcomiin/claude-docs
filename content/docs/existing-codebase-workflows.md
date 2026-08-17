---
title: Existing Codebase Workflows
weight: 6
---

These are the two spec-driven frameworks we highly recommend for working with existing codebases using agentic coding tools.

The goal is to give the agent enough project context to follow existing patterns, then keep the requested change small enough to review.

Existing apps already have architecture, naming patterns, tests, API contracts, database rules, and team habits. The agent needs those boundaries before it edits.

Pick the lightest workflow that fits the task. Choose a heavier workflow as complexity grows: more brainstorming, larger features, more repo context, review, or verification:

- **Plain session**: use Claude Code or Codex directly for a typo, copy edit, simple test update, or one-file fix where you already know the right file and expected diff.
- **Quick workflow**: use `gsd-quick` or `bmad-quick-dev` when the change is small but still needs repo discovery, guardrails, or light tracking.
- **Full GSD path**: use GSD's map, project, spec, discuss, plan, execute, verify, review, and ship flow when the work should be tracked through phases and verification.
- **Full BMAD path**: use BMAD's project-context, brief, PRD, architecture, story, implementation, and review flow when the work needs product planning and handoffs.

This guide assumes GSD or BMAD is installed, you can run the repo's checks locally, and you have permission to change the code. It does not cover blank projects, install troubleshooting, or full command references.

## GSD or BMAD? Or Both?

From our experience using both frameworks, BMAD is very extensive for brainstorming, whether for initial brainstorming for a brand new project or to explore and discuss a new feature to be added. They have various methods for brainstorming ideas that use different brainstorming workflows and agent personas to add new POVs to build on your initial idea.

The main friction with BMAD is the scoping down of workflows for the actual development parts that you have to do. This means that dev is slower as you have to manually invoke review after running the /bmad-create-story workflow, double check the story, then run /bmad-dev-story to get the agent to write the actual code, manually ask it to review, etc. The verification for each part of the workflow is manual (as of current version in Apr 2026).

The frictional part of BMAD is what GSD gets right. Each step of the workflow is automatically verified and iterated by agents as part of the workflow. Code execution automatically gets verified by a code verifier agent, and it's sent back for fixes if the verification fails. This goes on in a loop until the verifier agent verifies that the code has fulfilled the requirements, where it will then proceed with the next flow.

Generally, we recommend BMAD for brainstorming, and GSD for the actual code execution.

## Existing-Codebase Rule

Mapping and project-context steps can find existing patterns, but they cannot infer hidden project rules such as "do not touch IAM", "do not change the schema", or "preserve this legacy API contract". Rules that apply across the codebase should live in `CLAUDE.md`.

Before either workflow, write a short task guardrail block. This is not a codebase map. It is the boundary for the current change:

- Hard limits: files, schemas, APIs, subsystems, or behaviors that must not change without explicit approval.
- Patterns to follow: existing route, component, service, test, styling, or error-handling examples.
- Scope boundary: what the change should do, and what related cleanup or modernization is out of scope.
- Verification: the exact test, lint, build, or manual checks that prove the change worked.

For example:

```text
Goal:
Add a Refresh Feed button to each source row on the News Sources page.

Likely area:
News Sources table, source row actions, existing feed refresh API helper, related frontend tests.

Hard limits:
Do not change feed parsing, database schema, auth rules, or source configuration format.

Patterns to follow:
Use the existing table action pattern, button styling, loading state, and error handling.
Use the existing API helper instead of creating a second fetch path.

Verify:
Run npm test and npm run lint.
Manually check that refreshing a source updates the row status and does not delete existing articles.
```

Paste those guardrails into the workflow prompt or a small handoff file. After GSD or BMAD creates planning files, move any long-lived constraints there and stop treating the handoff file as authoritative.

## Before Starting with GSD or BMAD

1. Start from a clean branch.

```bash
git status --short
git switch -c feature/my-change
```

If `git status --short` prints anything, commit, stash, or move the work to a separate worktree before starting. Dirty changes follow you onto a new branch.

1. Check current project instructions and baseline docs that already exist (if any).

Check files such as `CLAUDE.md`, `AGENTS.md`, `README.md`, architecture notes, and nearby feature docs. Keep persistent agent instructions short and specific. Do not turn `CLAUDE.md` or `AGENTS.md` into a generated codebase summary. For examples, see [CLAUDE.md and AGENTS.md](/docs/agentic-coding-in-terminal/#claudemd-and-agentsmd).

1. Run the baseline checks.

```bash
# Examples only. Use the commands from the repo you are working in.
npm test
npm run lint
```

If the baseline already fails, record the failure before asking the agent to work. That gives you something to compare against after implementation.

1. Start a fresh agent session for the change.

Reusing a long or unrelated session makes it easier for old assumptions to leak into the work.

1. Write the task in one or two sentences.

A good existing-codebase task names the user-facing change, likely files or areas, hard limits, and verification command.

Use this shape:

```text
Goal:
Likely area:
Hard limits:
Patterns to follow:
Verify:
```

For short changes, paste this text into the workflow prompt. For longer briefs, write a small handoff file and reference it from the prompt. Once GSD or BMAD creates planning files, update those files instead of keeping a separate `task.md`.

## Choose the Workflow

| Situation | Use |
| --- | --- |
| Typo, copy edit, obvious one-file fix | Plain Claude Code or Codex |
| Small bug fix with light tracking | `gsd-quick` or `bmad-quick-dev` |
| Feature idea still needs brainstorming or product shape | BMAD |
| Product-heavy change needs a PRD, architecture notes, or stories | BMAD first, then GSD for execution |
| Existing app needs phased delivery and verification | Full GSD path |
| Team wants planning split by product, architect, and dev roles | BMAD |
| Auth, security, PII, billing, migrations, incidents, or unclear requirements | Full GSD or full BMAD path plus manual review |

For either tool, start with discovery, set clear boundaries, and review the planning files it writes before allowing large edits.

## Command Names Vary

The examples below use Claude Code slash-command style.

| Tool | Examples |
| --- | --- |
| GSD | `/gsd-help`, `/gsd-map-codebase`, `/gsd-quick` |
| BMAD | `/bmad-help`, `/bmad-generate-project-context`, `/bmad-quick-dev` |

In Codex, GSD skills use `$` instead of `/`, such as `$gsd-help` or `$gsd-quick`. If a command is not found, run the tool's help command and use the syntax shown in your session. Also use the output folders created by your install; examples here use the common defaults.

## Use GSD

Use GSD when the change is defined and you want requirements, plans, execution, and verification tracked in git.

If BMAD already produced a brief, PRD, architecture notes, or stories, use those as inputs to GSD. Do not brainstorm the same feature again.

Start with help:

```text
/gsd-help
```

Use the command names your session shows.

### 1. Pick the Smallest GSD Flow That Fits

For a small bug fix or narrow UI/API change, use quick work. If you already know the files and constraints, paste the task and guardrails directly into:

```text
/gsd-quick
```

When quick work still needs validation, add the relevant phase flag:

```text
/gsd-quick --validate
/gsd-quick --research --validate
```

When you need a fast read on an unfamiliar area before quick work, use scan:

```text
/gsd-scan
/gsd-scan --focus concerns
```

### 2. Map Before Full Project Setup

For larger work, map the repo before creating GSD project context:

```text
/gsd-map-codebase
```

Open `.planning/codebase/` and check the stack, major directories, test commands, and risk areas. Fix obvious wrong assumptions before planning from the map.

### 3. Initialize Project Context

Then create the GSD project context:

```text
/gsd-new-project
```

When answering prompts, frame the work as a change to an existing application. Point GSD at the codebase map and existing docs. Keep unrelated cleanup and rewrites out of the first milestone.

Use discussion mode when you want to answer design and implementation questions yourself. Use assumptions mode when you want GSD to inspect the repo and propose defaults first:

```text
/gsd-settings workflow.discuss_mode assumptions
/gsd-discuss-phase 1
```

Then use the full GSD path:

```text
/gsd-spec-phase 1
/gsd-discuss-phase 1
/gsd-plan-phase 1
```

### 4. Review the Plan Before Code

Before execution, inspect:

```text
.planning/PROJECT.md
.planning/REQUIREMENTS.md
.planning/ROADMAP.md
.planning/phases/
```

The plan should say what will change, what will not change, how the work is split across phases, which tests will run, and which existing patterns it will follow.

After review, continue with implementation:

```text
/gsd-execute-phase 1
/gsd-verify-work 1
/gsd-code-review 1
/gsd-ship 1
```

The sequence above is for the first GSD run in a repo. If GSD has already been initialized, refresh the map with `/gsd-map-codebase` when needed, then continue with the next phase. Do not run `/gsd-new-project` again unless the project state is missing or stale enough to rebuild.

### 5. Verify and Refresh Context

After execution, rerun the repo checks yourself and inspect the diff:

```bash
# Use the repo's real commands.
npm test
npm run lint
git diff
git status
```

Compare the result with any baseline failures you recorded before the change.

If the phase creates new route folders, migrations, module boundaries, or other structural changes, refresh the codebase map before planning the next phase:

```text
/gsd-map-codebase
```

## Use BMAD

Use BMAD when the work needs product shaping and brainstorming before it needs code: project context, PRDs, architecture notes, and stories.

Start with help:

```text
/bmad-help
```

Use the command names your session shows.

### 1. Generate Project Context

Install BMAD in the repo if it is not already installed:

```bash
npx bmad-method install
```

If the repo already has BMAD output from finished or stale work, archive or clean it before starting a new change.

Then generate the project context:

```text
/bmad-generate-project-context
```

Open the BMAD output folder, by default `_bmad-output/`, and read `project-context.md`. It should name the stack, versions, folder conventions, test commands, styling rules, and implementation constraints.

Edit this file before implementation if it misses a rule the project depends on. Remove any generic advice that does not change how this project should be built.

For a complex or poorly documented app, run:

```text
/bmad-document-project
```

Use that when BMAD needs a current-state project document before planning changes.

### 2. Pick Quick Dev or Product Flow

For a small fix, refactor, or narrow feature:

```text
/bmad-quick-dev
```

Give it the same kind of constrained existing-codebase task you would give a developer:

```text
Goal:
Add a Refresh Feed button to each source row on the News Sources page.

Likely area:
News Sources table, source row actions, existing feed refresh API helper, related frontend tests.

Hard limits:
Do not change feed parsing, database schema, auth rules, or source configuration format.

Patterns to follow:
Use the existing table action pattern, button styling, loading state, and error handling.
Use the existing API helper instead of creating a second fetch path.

Verify:
Run npm test and npm run lint.
Manually check that refreshing a source updates the row status and does not delete existing articles.
```

For larger product work, generate project context first, then run the product/story flow:

```text
/bmad-brainstorming
/bmad-product-brief
/bmad-create-prd
/bmad-create-architecture
/bmad-create-epics-and-stories
/bmad-sprint-planning
/bmad-create-story
```

Skip `/bmad-brainstorming` when the change is already defined and you do not need idea exploration.

After BMAD has shaped the work, you can hand the reviewed brief, PRD, architecture notes, or story to GSD for implementation and verification.

### 3. Keep BMAD Inside the Existing App

Before accepting a story, check that it names the existing modules, contracts, and tests it will preserve.

If BMAD proposes a modernization you did not ask for, stop and restate the boundary:

```text
Keep this as an existing-codebase change. Follow the existing service/component pattern even if a different architecture would be cleaner. Do not rewrite unrelated files.
```

If you choose to stay in BMAD for implementation, review the story first, then run:

```text
/bmad-dev-story
/bmad-code-review
```

### 4. Review Outputs and Promote Only What Matters

BMAD writes working files under its configured output folder, commonly `_bmad-output/`. Treat those files as working material, not permanent documentation by default.

Move BMAD output into your normal docs only when it records a long-term decision. Otherwise, review it, use it for the change, and keep the PR focused on the product/code diff.

## Hands-on Lab: Same Feature, Both Workflows

**Workshop repo:** [stcomiin/claude-docs-workshop-handson](https://github.com/stcomiin/claude-docs-workshop-handson)

Run the same feature through GSD and BMAD on the same sample app. The point is to experience the difference, not just read about it.

### Sample Codebase

Use [`fastapi/full-stack-fastapi-template`](https://github.com/fastapi/full-stack-fastapi-template). MIT-licensed, actively maintained, and feels like a real enterprise app instead of a starter shell:

- **Frontend:** React + TypeScript + Vite + Tailwind + shadcn/ui
- **Backend:** FastAPI + SQLModel + PostgreSQL
- **Auth:** JWT, password recovery, role-based access
- **Tests:** Pytest backend + Playwright frontend
- **Tooling:** Docker Compose, GitHub Actions CI

Different stack? The workflow lessons still transfer. Run the lab here first, then apply the same flow to your own repo.

### Feature: Item Categories with Filter

**Add item categories with a filter on the items list.** It touches:

- **Frontend:** category dropdown on the create/edit form, filter dropdown on the list, category badge on each row
- **Backend:** category model, CRUD endpoints, a query parameter to filter items
- **Database:** migration for a `categories` table and a foreign key on `items`

The spread is deliberate. This size of feature surfaces the common brownfield failure modes: scope myopia (don't refactor the items module), AI slop (no premature abstraction), pattern adherence (use the existing CRUD pattern), and migration discipline (handle existing rows).

Write a guardrail block using the shape from [Existing-Codebase Rule](#existing-codebase-rule). Hard limits: don't touch the auth model, don't refactor the items module, don't change unrelated endpoints.

### Run It Through GSD

Two paths:

| Path | Use when |
| --- | --- |
| Short path | 20-25 min via `/gsd-quick`. |
| Full path | Practice map, project init, spec, discuss, plan, execute, verify, review, ship. |

What you should notice:

- The auto-verifier catches "compiles but doesn't satisfy spec" without re-prompting.
- Phase boundaries and `.planning/` keep a category addition from sprawling into an items-module rewrite.
- `/gsd-verify-work` is where you confirm the feature actually does what you wanted, not just that tests pass. Tests go green and the spec can still be wrong.

### Run It Through BMAD

Same feature, BMAD this time.

| Path | Use when |
| --- | --- |
| Short path | 30-40 min via `/bmad-quick-dev`. |
| Full path | Full method: PRD, architecture, epics, stories, sprint planning, dev story, code review. |

What you should notice:

- **Win:** brainstorming the category model surfaces decisions a solo prompt skips: per-user vs global, single vs multi-category, soft-delete vs hard-delete. The architecture step catches the migration tradeoff (default category vs nullable FK) before code locks it in.
- **Cost:** manual verification gates between `/bmad-create-story`, `/bmad-dev-story`, and `/bmad-code-review`. After GSD's auto-verifier, doing it by hand at every step is slow.

After running both, most people land in the same place: BMAD for upstream shaping, GSD for downstream execution.

## Final Review Checklist

Before shipping the change, confirm:

- Context files, plans, stories, or reviews were read and corrected.
- Tests, lint, build, and manual checks from the guardrail block were rerun.
- The diff is limited to the expected files and behavior.
- No hard-limit files, schemas, APIs, or contracts changed without approval.
- Baseline failures are unchanged or clearly explained.
- New structural changes are reflected in the next codebase map or project context refresh.

## Official References

Read these alongside this page:

| Tool | Reference |
| --- | --- |
| GSD | [Brownfield Projects](https://mintlify.wiki/gsd-build/get-shit-done/guides/brownfield-projects) |
| BMAD | [Established Projects](https://docs.bmad-method.org/how-to/established-projects/) |
| BMAD | [Project Context](https://docs.bmad-method.org/explanation/project-context/) |
| BMAD | [Commands and Skills](https://docs.bmad-method.org/reference/commands/) |
| Claude Code | [Skills and Custom Commands](https://code.claude.com/docs/en/slash-commands) |

Related GSD 2 reading: [Brownfield Reality](https://getshitdone.help/solo-guide/brownfield/) and [Context Engineering](https://getshitdone.help/solo-guide/context-engineering/). GSD 2 covers brownfield concepts, but its command syntax and project structure differ from the GSD workflow shown above.

---

[Back to main page](/)

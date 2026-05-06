---
title: Existing Codebase Workflows
weight: 5
---

Use this when you already have an application and want Claude Code to make a change without treating the repo like a blank project.

The goal is to give the agent enough project context to follow existing patterns, then keep the requested change small enough to review.

## Before Either Workflow

1. Start from a clean git branch.

```bash
git status
git switch -c feature/my-change
```

2. Read the existing docs and run the baseline checks.

```bash
# Examples only. Use the commands from the repo you are working in.
npm test
npm run lint
```

3. Write the task in one or two sentences.

Good brownfield tasks name the user-facing change, the files or area likely involved, the constraints, and the verification command.

```text
Add a Test action to each collector row on the Settings page.
The backend route and API helper already exist, so do not change the database or backend contract.
Follow the current table and button patterns. Verify with npm test and npm run lint.
```

## GSD Path

Use GSD when you want the change to be tracked through requirements, phases, plans, execution, and verification.

### 1. Map the Current Codebase

Run the mapper before initializing GSD for an existing app:

```text
/gsd-map-codebase
```

Review the generated `.planning/codebase/` files. Check that the stack, major directories, test commands, and risk areas match the repo.

For a quick first pass, use:

```text
/gsd-scan
/gsd-scan --focus concerns
```

### 2. Initialize Around What You Are Adding

Then create the GSD project context:

```text
/gsd-new-project
```

When answering prompts, frame the work as a change to an existing application. Point GSD at the codebase map and existing docs. Keep unrelated cleanup, rewrites, and "while you are there" ideas out of the first milestone.

### 3. Pick the Smallest GSD Flow That Fits

For a small bug fix or narrow UI/API change:

```text
/gsd-quick
```

If the change still needs stronger checks:

```text
/gsd-quick --validate
/gsd-quick --research --validate
```

For a larger feature, use the full phase flow:

```text
/gsd-discuss-phase 1
/gsd-plan-phase 1
/gsd-execute-phase 1
/gsd-verify-work 1
/gsd-ship 1
```

Use discussion mode when you want to answer design and implementation questions yourself. If the repo has strong conventions and you want GSD to infer them first, set assumptions mode:

```text
/gsd-settings workflow.discuss_mode assumptions
/gsd-discuss-phase 1
```

### 4. Review the Artifacts Before Code

Before execution, inspect:

```text
.planning/PROJECT.md
.planning/REQUIREMENTS.md
.planning/ROADMAP.md
.planning/phases/
```

The plan should say what will change, what will not change, which tests will run, and which existing patterns it will follow.

### 5. Verify and Refresh Context

After execution, run the repo checks yourself and inspect the diff:

```bash
git diff
git status
```

If the phase creates new route folders, migrations, module boundaries, or other structural changes, refresh the codebase map before planning the next phase:

```text
/gsd-map-codebase
```

## BMAD Path

Use BMAD when you want a product/team-style workflow with role-specific agents, project context, PRDs, architecture notes, stories, implementation, and review.

BMAD installs can expose workflows as skills or slash commands depending on the runtime and install version. If your generated BMAD items are skills, type `bmad-quick-dev`. If your workshop setup exposes slash commands, type `/bmad-quick-dev`. The workflow names are otherwise the same.

### 1. Generate Project Context

Install BMAD in the repo if it is not already installed:

```bash
npx bmad-method install
```

Then generate the project context:

```text
/bmad-generate-project-context
```

Review `_bmad-output/project-context.md`. It should capture the stack, versions, folder conventions, test commands, styling rules, and implementation constraints that the agents should follow.

Edit this file before implementation if it misses a rule the project depends on.

For a complex or poorly documented app, also consider:

```text
/bmad-document-project
```

Use that when BMAD needs a current-state project document before it can safely plan against the existing system.

### 2. Pick Quick Dev or the Full Method

For a small fix, refactor, or narrow feature:

```text
/bmad-quick-dev
```

Give it the same kind of constrained brownfield task you would give a developer:

```text
Use the existing Settings table patterns to add a Test action to each collector row.
Do not change backend routes, database schema, or collector configuration format.
Run the existing frontend checks before summarizing.
```

For larger product work, use the full planning path:

```text
/bmad-product-brief
/bmad-create-prd
/bmad-create-architecture
/bmad-create-epics-and-stories
/bmad-sprint-planning
/bmad-create-story
/bmad-dev-story
/bmad-code-review
```

### 3. Keep BMAD Grounded in Existing Patterns

Before accepting a story or implementation, check that the artifact names the existing modules, contracts, and tests it will preserve.

If BMAD proposes a modernization you did not ask for, stop and restate the boundary:

```text
Keep this as a brownfield change. Follow the existing service/component pattern even if a different architecture would be cleaner. Do not rewrite unrelated files.
```

### 4. Review Outputs and Promote Only What Matters

BMAD writes working files under `_bmad-output/`. Treat that folder as a working notebook, not automatically as permanent docs.

Promote or rewrite an artifact into your normal docs only when it records a long-term decision. Otherwise, review it, use it for the change, and keep the PR focused on the product/code diff.

## Choosing Between Them

| Situation | Better fit |
| --- | --- |
| Small bug fix with light tracking | GSD quick or BMAD quick-dev |
| Existing app needs phased delivery and verification | GSD |
| Product-heavy change with PRD, architecture, stories, and review | BMAD |
| Team wants durable phase state in git | GSD |
| Team wants role-specific planning artifacts | BMAD |

For either tool, the brownfield rule is the same: make the agent discover the current system first, constrain the requested change, then review generated artifacts before letting it edit broadly.

---

[Back to main page](/)

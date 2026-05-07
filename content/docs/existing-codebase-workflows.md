---
title: Existing Codebase Workflows
weight: 5
---

These are the two spec-driven frameworks we highly recommend for working with existing codebases using agentic coding tools.

The goal is to give the agent enough project context to follow existing patterns, then keep the requested change small enough to review.

Changing an existing app is different from starting with a blank repo. The agent has to preserve the code that is already there: architecture, naming patterns, tests, API contracts, database schema and migration rules, and team conventions. The more of those things a change touches, the more context and review you need before implementation.

There are four levels:

- **Plain session**: use Claude Code or Codex directly for a typo, copy edit, simple test update, or one-file fix where you already know the right file and expected diff.
- **Quick workflow**: use `gsd-quick` or `bmad-quick-dev` when the change is small but still needs repo discovery, guardrails, or light tracking.
- **Full GSD path**: use GSD's map, project, spec, discuss, plan, execute, verify, review, and ship flow when the work should be tracked through phases and verification.
- **Full BMAD path**: use BMAD's project-context, brief, PRD, architecture, story, implementation, and review flow when the work needs product/team-style artifacts.

For production incidents, auth, security, PII, billing, migrations, cross-repo changes, ambiguous requirements, or substantial business logic, do not use quick mode. Use the full GSD or full BMAD path and manually review the generated artifacts, planned commands, and final diff.

This guide assumes GSD or BMAD is installed, you can run the repo's checks locally, and you have permission to change the code. It does not cover starting from a blank repo, tool installation troubleshooting, or full command references.

## GSD or BMAD? Or Both?

From our experience using both frameworks, BMAD is very extensive for brainstorming, whether for initial brainstorming for a brand new project or to explore and discuss a new feature to be added. They have various methods for brainstorming ideas that use different brainstorming workflows and agent personas to add new POVs to build on your initial idea.

The main friction with BMAD is the scoping down of workflows for the actual development parts that you have to do. This means that dev is slower as you have to manually invoke review after running the /bmad-create-story workflow, double check the story, then run /bmad-dev-story to get the agent to write the actual code, manually ask it to review, etc. The verification for each part of the workflow is manual (as of current version in Apr 2026).

The frictional part of BMAD is what GSD gets right. Each step of the workflow is automatically verified and iterated by agents as part of the workflow. Code execution automatically gets verified by a code verifier agent, and it's sent back for fixes if the verification fails. This goes on in a loop until the verifier agent verifies that the code has fulfilled the requirements, where it will then proceed with the next flow.

Generally, we recommend BMAD for brainstorming, and GSD for the actual code execution.

## Existing-Codebase Rule

Mapping and project-context steps from the two frameworks can find existing patterns, but they cannot reliably infer hidden project rules such as "do not touch billing", "do not change the schema", or "preserve this legacy API contract". These rules that apply across the codebase should live in CLAUDE.md.

Before either workflow, write a short task guardrail block. This is not a codebase map. It is the boundary for the current change:

- Hard limits: files, schemas, APIs, subsystems, or behaviors that must not change without explicit approval.
- Patterns to follow: existing route, component, service, test, styling, or error-handling examples.
- Scope boundary: what the change should do, and what related cleanup or modernization is out of scope.
- Verification: the exact test, lint, build, or manual checks that prove the change worked.

For example:

```text
Goal:
Add a Pause Feed action to each source row on the News Sources page.

Likely area:
News Sources table, source row actions, existing feed status API helper, related frontend tests.

Hard limits:
Do not change RSS ingestion, social media connector logic, feed parsing, database schema, auth rules, or source configuration format.

Patterns to follow:
Use the existing table action pattern, button styling, confirmation behavior, and loading/error states.
Use the existing API helper instead of creating a second fetch path.

Verify:
Run npm test and npm run lint.
Manually check that pausing a source updates the row state and does not delete existing articles.
```

Paste those guardrails into the workflow prompt or a small handoff file. After GSD or BMAD creates its own context artifacts, copy long-lived constraints into those artifacts and stop treating the handoff file as authoritative.

## Before Starting with GSD or BMAD

1. Start from a clean branch.

```bash
git status --short
git switch -c feature/my-change
```

If `git status --short` prints anything, commit, stash, or move the work to a separate worktree before starting. Dirty changes follow you onto a new branch.

2. Check current project instructions and baseline docs that already exist (if any).

Check files such as `CLAUDE.md`, `AGENTS.md`, `README.md`, architecture notes, and nearby feature docs. Keep persistent agent instructions short and specific; do not turn `CLAUDE.md` or `AGENTS.md` into a generated codebase summary.

3. Run the baseline checks.

```bash
# Examples only. Use the commands from the repo you are working in.
npm test
npm run lint
```

If the baseline already fails, record the failure before asking the agent to work. That gives you something to compare against after implementation.

4. Start a fresh agent session for the change.

Reusing a long or unrelated session makes it easier for old assumptions to leak into the work.

5. Write the task in one or two sentences.

A useful existing-codebase task names the user-facing change, likely files or areas, constraints, and verification command.

Use this shape:

```text
Goal:
Likely area:
Hard limits:
Patterns to follow:
Verify:
```

For short changes, paste this text into the workflow prompt. For longer briefs or work that needs review before execution, write a small handoff file and reference it from the prompt. Do not keep treating `task.md` as authoritative after GSD or BMAD creates its own artifacts.

## Choose GSD or BMAD

| Situation | Better fit |
| --- | --- |
| Typo, copy edit, obvious one-file fix | Plain Claude Code or Codex |
| Small bug fix with light tracking | `gsd-quick` or `bmad-quick-dev` |
| Existing app needs phased delivery and verification | Full GSD path |
| Product-heavy change with PRD, architecture, stories, and review | BMAD |
| Team wants durable phase state in git | Full GSD path |
| Team wants role-specific planning artifacts | BMAD |
| Auth, security, PII, billing, migrations, incidents, or ambiguous requirements | Full GSD or full BMAD path plus manual review |

For either tool, start with discovery, constrain the change, and review generated artifacts before allowing large edits.

## Command Names Vary

The examples below use Claude Code slash-command style.

| Tool | Examples |
| --- | --- |
| GSD | `/gsd-help`, `/gsd-map-codebase`, `/gsd-quick` |
| BMAD | `/bmad-help`, `/bmad-generate-project-context`, `/bmad-quick-dev` |

In Codex, GSD skills use `$` instead of `/`, such as `$gsd-help` or `$gsd-quick`. If a command is not found, run the tool's help command and use the syntax shown in your session. Also use the output folders created by your install; examples here use the common defaults.

## Use GSD

Use GSD when you want requirements, phases, plans, execution, and verification tracked in git.

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

If the change still needs stronger checks:

```text
/gsd-quick --validate
/gsd-quick --research --validate
```

If you need a fast read on an unfamiliar area before quick work, use scan:

```text
/gsd-scan
/gsd-scan --focus concerns
```

### 2. Map Before Full Project Setup

For larger existing-codebase work, map the repo before creating GSD project context:

```text
/gsd-map-codebase
```

Review the generated `.planning/codebase/` files. Check that the stack, major directories, test commands, and risk areas match the repo. Fix obvious wrong assumptions before planning from the map.

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

### 4. Review Artifacts Before Code

Before execution, inspect:

```text
.planning/PROJECT.md
.planning/REQUIREMENTS.md
.planning/ROADMAP.md
.planning/phases/
```

The plan should say what will change, what will not change, which tests will run, and which existing patterns it will follow.

After review, continue with implementation:

```text
/gsd-execute-phase 1
/gsd-verify-work 1
/gsd-code-review 1
/gsd-ship 1
```

This sequence is for the first GSD run in a repo. If `.planning/` already exists, refresh `/gsd-map-codebase` when needed, then continue with the next phase instead of running `/gsd-new-project` again.

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

Use BMAD when you want role-specific planning artifacts: project context, PRDs, architecture notes, stories, implementation, and review.

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

Review the configured BMAD output folder, commonly `_bmad-output/`. Its `project-context.md` should capture the stack, versions, folder conventions, test commands, styling rules, and implementation constraints that the agents should follow.

Edit this file before implementation if it misses a rule the project depends on. Remove generic advice that does not change how this project should be built.

For a complex or poorly documented app, run:

```text
/bmad-document-project
```

Use that when BMAD needs a current-state project document before planning changes.

### 2. Pick Quick Dev or the Full Method

For a small fix, refactor, or narrow feature:

```text
/bmad-quick-dev
```

Give it the same kind of constrained existing-codebase task you would give a developer:

```text
Use the existing Settings table patterns to add a Test action to each collector row.
Do not change backend routes, database schema, or collector configuration format.
Run the existing frontend checks before summarizing.
```

For larger product work, use the full BMAD path. In this page, that means generating project context first, then running the product/story flow:

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

### 3. Keep BMAD Grounded in Existing Patterns

Before accepting a story or implementation, check that the artifact names the existing modules, contracts, and tests it will preserve.

If BMAD proposes a modernization you did not ask for, stop and restate the boundary:

```text
Keep this as an existing-codebase change. Follow the existing service/component pattern even if a different architecture would be cleaner. Do not rewrite unrelated files.
```

After review, continue with implementation:

```text
/bmad-dev-story
/bmad-code-review
```

### 4. Review Outputs and Promote Only What Matters

BMAD writes working files under its configured output folder, commonly `_bmad-output/`. Treat those files as working material, not permanent documentation by default.

Promote or rewrite an artifact into your normal docs only when it records a long-term decision. Otherwise, review it, use it for the change, and keep the PR focused on the product/code diff.

## Final Review Checklist

Before shipping the change, confirm:

- Generated context, plans, stories, or reviews were read and corrected.
- Tests, lint, build, and manual checks from the guardrail block were rerun.
- The diff is limited to the expected files and behavior.
- No hard-limit files, schemas, APIs, or contracts changed without approval.
- Baseline failures are unchanged or clearly explained.
- New structural changes are reflected in the next codebase map or project context refresh.

## Official References

Official references worth reading alongside this page:

| Tool | Reference |
| --- | --- |
| GSD | [Brownfield Projects](https://mintlify.wiki/gsd-build/get-shit-done/guides/brownfield-projects) |
| BMAD | [Established Projects](https://docs.bmad-method.org/how-to/established-projects/) |
| BMAD | [Project Context](https://docs.bmad-method.org/explanation/project-context/) |
| BMAD | [Commands and Skills](https://docs.bmad-method.org/reference/commands/) |
| Claude Code | [Skills and Custom Commands](https://code.claude.com/docs/en/slash-commands) |

Related GSD 2 reading: [Brownfield Reality](https://getshitdone.help/solo-guide/brownfield/) and [Context Engineering](https://getshitdone.help/solo-guide/context-engineering/). GSD 2 has useful brownfield concepts, but its command syntax and project structure differ from the GSD workflow shown above.

---

[Back to main page](/)

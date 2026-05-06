---
title: Skills & Plugins Deep Dive
weight: 3
---

This page is a practical guide to skills and plugins for Claude Code.

Use it to answer these questions:

- What does this tool add to the agent's workflow?
- When is it worth installing?
- When is it more process than the task needs?

The examples below are intentionally selective. Star counts, launch claims, and popularity metrics change often, so this page focuses on behavior and tradeoffs.

---

## Why skills and plugins matter

Plain prompting works for small, clear tasks. It gets weaker when the task needs planning, repeated checks, project memory, or a specific output format.

Skills and plugins help by narrowing the job. They can tell Claude what to inspect, what to ask, which checks to run, and what output format to produce.

They don't make the model reliable on their own, but they give it clearer rules and more chances to catch mistakes before you treat the output as finished.

---

## Skills vs plugins

Skills are folders with a `SKILL.md` file. The file describes when the skill should load and what Claude should do once it loads. Larger examples, scripts, templates, or references can live beside it.

Plugins package skills, commands, agents, and hooks into one installable unit. Use a plugin when the workflow needs more than one skill or command.

```text
skill-name/
  SKILL.md          # Required instructions and trigger description
  references/       # Optional docs loaded only when needed
  scripts/          # Optional deterministic helpers
  assets/           # Optional templates or static files
```

---

## Creating your own skills

Custom skills are often more useful than public ones because they encode your team's real habits.

Good candidates include:

- PR review rules
- release checklists
- database migration patterns
- incident response steps
- design system rules
- security review requirements
- report or document templates

### Skill anatomy

Every skill is a folder. The required file is `SKILL.md`; supporting files are optional.

```text
pr-review/
  SKILL.md
  references/
    security-checklist.md
    performance-checklist.md
  scripts/
    collect-diff.sh
```

`SKILL.md` has three parts:

1. **Frontmatter**: YAML between `---` markers. This tells Claude when the skill should load.
2. **Instructions**: Markdown guidance Claude follows after the skill loads.
3. **Resources**: Links to supporting files in the skill folder. Claude loads those files only when needed.

Example:

```yaml
---
name: pr-review
description: Use when reviewing pull requests or code diffs, especially changes touching auth, payments, data access, migrations, or public APIs.
when_to_use: The user asks for a PR review, code review, risk review, or wants a second pass before merging.
---

# PR Review

Review the diff as a reviewer, not as the original implementer.

Start with findings ordered by severity. Include file and line references when possible.
Prioritize correctness, security, data loss, regressions, and missing tests.

Use these resources when relevant:

- For auth or payment changes, read `references/security-checklist.md`.
- For database query changes, read `references/performance-checklist.md`.
- To collect a local diff, run `scripts/collect-diff.sh`.
```

Keep the frontmatter short and specific. In Claude Code, the directory name becomes the slash command, such as `/pr-review`, and `description` helps Claude decide whether to load the skill automatically. `when_to_use` can add trigger examples, but the combined trigger text should stay concise.

Use the instructions to say what to do, what to avoid, and what output shape to produce. Put long checklists, examples, API docs, or scripts in supporting files and reference them from `SKILL.md`.

Use optional frontmatter only when it changes behavior:

| Field | Use it for |
| --- | --- |
| `name` | Override the display name. If omitted, Claude uses the folder name. |
| `description` | Say what the skill does and when Claude should use it. |
| `when_to_use` | Add extra trigger context or example requests. |
| `allowed-tools` | Let Claude use the listed tools without asking while the skill is active. This does not block other tools. |
| `disable-model-invocation` | Make the skill manual-only, useful for deploy or commit workflows. |
| `user-invocable: false` | Hide the skill from the slash-command menu while still allowing automatic use. |
| `context: fork` | Run the skill in a forked subagent context. |

Spend the most care on `description`. Write it as a trigger, not as a vague summary.

Weak:

```yaml
description: How to review code
```

Better:

```yaml
description: Use when reviewing pull requests or code diffs. Pay special attention to tests, auth, payment paths, migrations, data access, and public API changes.
```

### Practical rules

- Keep `SKILL.md` short enough to scan.
- Put long examples in `references/`.
- Put repeatable scripts in `scripts/`.
- Include gotchas the model has missed before.
- Focus on instructions that change behavior.
- Remove obvious guidance that Claude would already follow.

### Where skills live

| Audience | Location |
| --- | --- |
| Personal | `~/.claude/skills/` |
| Project/team | `.claude/skills/` |
| Organization | Managed team or enterprise provisioning |
| Public distribution | Plugin marketplace or shared package |

---

## Document skills - docx, pdf, pptx, xlsx

**Project:** [anthropics/skills](https://github.com/anthropics/skills)

The document skills help Claude create and edit real office files:

- `docx` for Word documents
- `pdf` for PDF extraction, editing, and final output
- `pptx` for slide decks
- `xlsx` for spreadsheets

Use these when the output needs to open cleanly in another application. If the user only needs a short answer or table in chat, do not add file generation.

### Install

Inside Claude Code:

```bash
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
```

Or from a terminal:

```bash
claude plugin marketplace add anthropics/skills
claude plugin install document-skills@anthropic-agent-skills
```

### What each skill adds

| Skill | Use it for |
| --- | --- |
| `docx` | Reports, memos, letters, comments, tracked changes, tables of contents |
| `pdf` | Extraction, merging, splitting, forms, watermarks, OCR, final distribution |
| `pptx` | Slide decks, speaker notes, template-based presentations |
| `xlsx` | Spreadsheet cleanup, formulas, charts, CSV/TSV conversion, tabular deliverables |

### Example prompt

```text
Using the docx skill, convert report.md into report.docx.
Add a title page, table of contents, page numbers, and preserve tables.
```

The important check is simple: open the generated file and inspect it. Document skills reduce formatting work, but the final file still needs review.

---

## Superpowers

**Project:** [obra/superpowers](https://github.com/obra/superpowers)

Unlike BMAD and GSD, Superpowers is less command-driven. The skills fire based on what you're doing, whether that's brainstorming, planning, debugging, TDD, or verification, without you having to remember which slash command to type.

### Install

```text
/plugin install superpowers@claude-plugins-official
```

Restart Claude Code after installing.

### Useful skills

| Skill | What it adds |
| --- | --- |
| `/brainstorming` | Explore the approach before writing code |
| `/writing-plans` | Break the work into short tasks with files and checks |
| `/subagent-driven-development` | Use fresh agents for scoped tasks |
| `/test-driven-development` | Follow red, green, refactor when appropriate |
| `/systematic-debugging` | Form a hypothesis, gather evidence, then fix |
| `/verification-before-completion` | Run checks before calling the task done |
| `/using-git-worktrees` | Isolate larger work on a separate branch/worktree |

### When to use it

Use Superpowers when you want automatic prompts for planning, debugging, and checking work during normal Claude Code sessions. It pairs well with larger workflow tools, but it can also stand alone.

Skip it if you want to keep your agent environment minimal or if automatic skill activation makes the session harder to predict.

---

## BMAD - Breakthrough Method for Agile AI-Driven Development

**Project:** [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)

**Docs:** [docs.bmad-method.org](https://docs.bmad-method.org/)

BMAD gives Claude an agile-style workflow. Instead of one agent doing every job, it separates product, architecture, development, QA, UX, and other roles.

That structure is useful when the work needs requirements, design decisions, task breakdowns, and review artifacts. It is usually too much for isolated fixes.

### Install

BMAD is usually installed per project:

```bash
cd your-project
npx bmad-method install
```

The installer asks where to install, which AI tools to support, and which BMAD modules to include. Most teams should start with the core BMad Method module and add specialized modules only when they need them.

After installation, open Claude Code in the project and run:

```text
/bmad-help
```

### Modules

BMAD installs modules. Start with BMad Method unless you know you need a specialized track.

| Module | Use for |
| --- | --- |
| BMad Method (BMM) | Core planning, architecture, story, implementation, and review workflows |
| BMad Builder (BMB) | Creating custom BMAD agents, workflows, or modules |
| Test Architect (TEA) | Risk-based test strategy, traceability, and release review |
| Creative Intelligence Suite (CIS) | Brainstorming, design thinking, and problem exploration |
| Game Dev Studio (GDS) | Game design and development workflows |

Install extra modules when they match the project. Extra modules add commands and agents, so installing everything can make BMAD harder to navigate.

### Agent team

BMAD works through role-specific agents. Product and planning agents shape requirements. The architect handles system design. The developer turns stories into code. Review and testing agents check the work.

The role split matters because each agent has a narrower job. It also creates artifacts other agents can read later, such as PRDs, architecture notes, story files, and review output.

### Output folder

BMAD writes most workflow artifacts to its configured output folder. The current default is `_bmad-output/`. You can choose a different folder during install.

A typical project ends up with something like this:

```text
_bmad-output/
  project-context.md
  planning-artifacts/
  implementation-artifacts/
```

Planning workflows use this area for PRDs, architecture notes, epics, and planning drafts. Implementation workflows use it for stories, sprint status, and review output.

Treat the folder as BMAD's working notebook. Before moving to the next agent, open the generated files and check the assumptions, scope, and decisions. If a document should become long-term project documentation, move or rewrite it into your normal docs folder instead of assuming every BMAD output belongs there.

### Party Mode

Party Mode puts several BMAD agents into one conversation:

```text
/bmad-party-mode
```

BMad Master routes each message to the agents whose perspective is relevant. Use it for architecture tradeoffs, planning discussions, retrospectives, or decisions where product, engineering, UX, and QA perspectives should be considered together.

Party Mode is a discussion tool. It can surface tradeoffs, but you still decide what to accept.

### Typical flow

For a small, scoped change, use Quick Dev:

```text
/bmad-quick-dev
```

For larger product work, use the planning path:

```text
/bmad-brainstorming
/bmad-product-brief
/bmad-create-prd
/bmad-create-architecture
/bmad-create-epics-and-stories
/bmad-sprint-planning
/bmad-create-story
/bmad-dev-story
/bmad-code-review
```

### What to look for

BMAD is working well when each step produces a concrete artifact: a brief, PRD, architecture note, story, implementation, or review. Those artifacts make decisions easier to audit later.

BMAD is a poor fit when the overhead is larger than the change. If the task is "rename this label" or "fix this failing test," use a lighter workflow.

---

## GSD - Get Shit Done

**Project:** [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)

GSD splits a project into requirements, roadmap phases, discussion context, plans, execution, and verification, each with its own command. The point is keeping each phase small enough to plan and review on its own instead of leaning on one long chat to track everything.

### Install

Interactive install:

```bash
npx get-shit-done-cc@latest
```

Claude Code only:

```bash
npx get-shit-done-cc --claude --global
npx get-shit-done-cc --claude --local
```

Verify inside Claude Code:

```text
/gsd-help
```

### Existing code - brownfield

If the repo already has code, map it before starting a new project:

```text
/gsd-map-codebase
```

This gives GSD a first pass at the stack, architecture, conventions, and risk areas. It is more useful than asking project-init questions against an unknown codebase.

### Typical flow for a phase

```text
/gsd-new-project
/gsd-discuss-phase 1
/gsd-plan-phase 1
/gsd-execute-phase 1
/gsd-verify-work 1
```

GSD writes its working state into `.planning/`, including `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/STATE.md`, and phase-specific files. Treat these as the current source of truth for scope, requirements, and decisions. Review them before continuing, because later GSD agents read them to stay grounded in the project.

### Why the discussion step matters

`/gsd-discuss-phase` asks about choices that requirements often leave open: UI density, API shape, error behavior, file naming, edge cases, and review expectations.

That step is useful because it captures your preferences before planning starts. Skipping it means the agent will use reasonable defaults, which may not match how you want the feature built.

### Reducing friction

Many GSD commands support `--auto`. Use it when the task is clear and you are comfortable with GSD choosing defaults. For new projects, pass an idea or PRD file:

```text
/gsd-new-project --auto @idea.md
/gsd-discuss-phase 1 --auto
/gsd-plan-phase 1 --auto
```

`--chain` can continue from discussion into the next steps:

```text
/gsd-discuss-phase 1 --chain
```

These flags save handoffs. They also reduce the number of places where you review assumptions before the next step starts. Use them for low-risk or well-specified work. For product, UX, API, data, or architecture decisions, stay manual until the important choices are written down.

### Quick work vs phase work

Use the smallest workflow that fits the task:

| Command | Use for |
| --- | --- |
| `/gsd-fast <text>` | Trivial edits that do not need planning |
| `/gsd-quick` | Small tasks that still benefit from light tracking |
| `/gsd-discuss-phase` -> `/gsd-plan-phase` -> `/gsd-execute-phase` | Scoped feature or project work |

GSD also supports a minimal install for token-sensitive or throwaway setups:

```bash
npx get-shit-done-cc --claude --global --minimal
```

Use the full install when you expect to use the broader command set. Use `--minimal` when you only need the core loop.

### Execution model

Execution is plan-based. GSD splits a phase into plans, groups independent plans into waves, and runs work in fresh subagents where possible. Dependent work waits for the earlier wave to finish.

This is useful when a phase has several separable parts. It is less useful when the change is one file or one obvious bug fix.

### When to use it

Use GSD when you want a project or feature built in deliberate phases. It is a good fit for solo developers and small teams that want structure without a full agile process.

For quick changes, use `/gsd-quick` or plain Claude Code. A full phase workflow is not worth it for a typo, small copy edit, or obvious one-file change.

---

## Generated files and git

BMAD and GSD use their output folders differently.

GSD treats `.planning/` as project state. By default, its planning docs are meant to be committed unless you choose a private setup. If `.planning/` contains secrets, private notes, or throwaway plans, set `planning.commit_docs: false` and add `.planning/` to `.gitignore`. Check `.planning/config.json` first if you configured search or API integrations.

BMAD's `_bmad-output/` is more of a working folder. Keep files that still guide the project, especially `project-context.md`, but do not assume every PRD, story, or review artifact belongs in git forever. When an artifact becomes long-term project documentation, move or rewrite it into your normal docs folder.

---

## Codex for Claude Code

**Project:** [openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc)

The Codex plugin lets Claude Code call Codex for review or delegated work. A second model isn't automatically right, but it tends to notice risks the first one missed.

### Install

```bash
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/reload-plugins
/codex:setup
```

`/codex:setup` checks whether Codex CLI is installed and authenticated.

### Useful commands

| Command | Use it for |
| --- | --- |
| `/codex:review` | Read-only review of uncommitted changes or a branch diff |
| `/codex:adversarial-review` | Review with a specific challenge, such as race conditions or caching assumptions |
| `/codex:rescue` | Background investigation or an alternate fix attempt |
| `/codex:status` | Check a background job |
| `/codex:result` | Read the completed job output |
| `/codex:cancel` | Stop a running job |

### When to use it

Use the plugin after a larger change, before shipping, or when Claude is stuck on a bug. Ask for a narrow review target:

```text
/codex:adversarial-review look for missed auth checks and unsafe database writes
```

Treat the second model's output as another review input, not as approval.

---

## Hands-on workshops

Use these exercises after the sections above. This page helps you pick a lab. The step-by-step commands live in the hands-on repo so this page does not go stale every time the labs change.

**Workshop repo:** [stcomiin/claude-docs-workshop-handson](https://github.com/stcomiin/claude-docs-workshop-handson)

| Workshop | Time | Good for | Guide |
| --- | --- | --- | --- |
| Research report generation | 20-30 minutes | Subagents, web research, and document skills | [Starter workspace](https://github.com/stcomiin/claude-docs-workshop-handson/tree/main/research-report-generation-workflow-starter) |
| Existing app with GSD | 25-60 minutes | Codebase mapping, quick tasks, and full GSD phase flow | [GSD workshop](https://github.com/stcomiin/claude-docs-workshop-handson/tree/main/one-shot-task-dashboard-gsd-workshop) |
| Existing app with BMAD | 35-75 minutes | Project context, quick-dev, planning files, and review | [BMAD workshop](https://github.com/stcomiin/claude-docs-workshop-handson/tree/main/one-shot-task-dashboard-bmad-workshop) |

If you are running a live session, pin the workshop repo to a known commit or tag. If you want the newest version, follow the README in each workshop folder.

<span id="-workshop-exercise-research-and-report-generation-workflow"></span>

### Research report generation

This lab pairs parallel research with the `document-skills` plugin. Participants create one markdown report, then turn it into Word, PDF, PowerPoint, and Excel files.

Use it when you want to show that skills are more than prompt snippets. The useful part is the sequence: split the research, write one report, then turn that report into formats people can open and review.

Start with the [starter workspace](https://github.com/stcomiin/claude-docs-workshop-handson/tree/main/research-report-generation-workflow-starter). Use the [completed reference](https://github.com/stcomiin/claude-docs-workshop-handson/tree/main/research-report-generation-workflow-completed) after the exercise or when you need an answer key.

Review the result by asking:

- Did the research slices cover different parts of the topic?
- Does the markdown report cite sources and make real comparisons?
- Do the generated files open cleanly?
- Did the slide deck become a briefing, not a copied report?

### Existing app with GSD

This lab uses GSD on a small existing OSINT dashboard instead of a blank project.

The feature is deliberately small: add a **Test** action to each collector row in Settings. The backend route and API helper already exist. The work is finding the right path through the codebase and exposing the missing UI without changing the backend or database.

The [GSD workshop](https://github.com/stcomiin/claude-docs-workshop-handson/tree/main/one-shot-task-dashboard-gsd-workshop) has two paths:

| Path | Use when |
| --- | --- |
| Short path | You want a 20-25 minute exercise using `$gsd-quick`. |
| Full path | You want to practice map, project init, spec, discuss, plan, execute, verify, and review. |

The main lesson is scope control. GSD is useful here because it finds the existing project structure, captures assumptions, and keeps a small UI change from turning into a rewrite.

### Existing app with BMAD

This lab uses the same dashboard feature as the GSD workshop, but runs it through BMAD. That makes the comparison useful: same app, same feature, different workflow.

Use the [BMAD workshop](https://github.com/stcomiin/claude-docs-workshop-handson/tree/main/one-shot-task-dashboard-bmad-workshop) when you want participants to see how BMAD uses project context, quick-dev, PRDs, architecture notes, stories, implementation, and review.

| Path | Use when |
| --- | --- |
| Short path | You want a 30-40 minute exercise using `bmad-quick-dev`. |
| Full path | You want to practice the fuller BMAD method: PRD, architecture, epics or stories, sprint planning, dev story, and code review. |

BMAD is useful when you want product-team-style planning before code: PRD, architecture, stories, implementation, and review. GSD carries context too, but it is organized around phases, executable plans, parallel implementation, and verification.

---

[Back to main page](/)

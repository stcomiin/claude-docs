---
title: Skills & Plugins Reference
weight: 3
---

This page is a practical guide to skills and plugins for Claude Code.

Use it to answer these questions:

- What does this tool add to the agent's workflow?
- When is it worth installing?
- When is it more process than the task needs?

The examples below are intentionally selective. Star counts, launch claims, and popularity metrics change often, so this page focuses on behavior and tradeoffs.

---

## Why *Good* skills and plugins matter

Plain prompting works for small, clear tasks. It gets weaker when the task needs planning, repeated checks, project memory, or a specific output format.

Skills and plugins help by *"spec-ing"* the job. They can tell Claude what to inspect, what to ask, which checks to run, and what output format to produce.

They don't make the model reliable on their own, but they give it clearer rules and more chances to catch mistakes before you treat the output as finished.

When using such agentic coding tools on both brownfield work (with existing codebases) and production-grade greenfield work (not just a POC), some common failures keep showing up:

- **Attempts to refactor legacy code** that the agent was not tasked to refactor or touch in the current session.
- **AI sloppy code**, including but not limited to:
  - over-abstraction (e.g. wrapping a single function call in a factory plus interface):

    ```python
    from abc import ABC, abstractmethod

    class GreeterInterface(ABC):
        @abstractmethod
        def greet(self, name: str) -> str: ...

    class DefaultGreeter(GreeterInterface):
        def greet(self, name: str) -> str:
            return f"Hello, {name}"

    class GreeterFactory:
        @staticmethod
        def create() -> GreeterInterface:
            return DefaultGreeter()

    greeting = GreeterFactory.create().greet("Alice")
    # When `def greet(name): return f"Hello, {name}"` was all that was needed.
    ```

  - lasagna code (e.g. several thin pass-through layers between the handler and the real logic):

    ```python
    def handle_request(req):
        return _process_request(req)

    def _process_request(req):
        return _execute_request(req)

    def _execute_request(req):
        return _run_request(req)

    def _run_request(req):
        return {"user_id": req["user_id"]}
    # Four layers of pass-through to return one field.
    ```

  - defensive coding theater (e.g. null checks on values the type system already guarantees are non-null, try/catch around code that cannot throw):

    ```python
    def total(items: list[int]) -> int:
        if items is None:           # type signature already guarantees list[int]
            return 0
        try:
            return sum(items)       # sum() over list[int] cannot throw
        except Exception:
            return 0
    ```

  - boilerplate bloat (e.g. docstrings and getters/setters on trivial fields):

    ```python
    class User:
        def __init__(self, name: str):
            self._name = name

        @property
        def name(self) -> str:
            """Return the user's name."""
            return self._name

        @name.setter
        def name(self, value: str) -> None:
            """Set the user's name."""
            self._name = value
    # A @dataclass or plain attribute would do the same work.
    ```

- **Vacuous or tautological tests** (e.g. mocking every internal call so the test only verifies that the mocks were called):

    ```python
    def test_double():
        calc = Mock()
        calc.double.return_value = 10
        assert calc.double(5) == 10
    ```

- **Scope failure** where the agent refuses an obvious boy-scout fix because it didn't cause the issue this session.

    ```python
    # Task: "Return None for missing users instead of letting db.find_user throw exception."

    # Before
    def get_user(user_id):
        cached = cache.get(f"user:{user_id}")
        if cached is not None:
            return cached

        user = db.find_user(user_id)                       # raises UserNotFound if missing, to be fixed
        cache.set(f"users:{user_id}", user, ttl=3600)
        return user

    # After
    def get_user(user_id):
        cached = cache.get(f"user:{user_id}")
        if cached is not None:
            return cached

        try:
            user = db.find_user(user_id)
        except UserNotFound:
            return None                                    # changed by agent
        cache.set(f"users:{user_id}", user, ttl=3600)      # typo, pre-existing: "users:" vs "user:"
        return user

    # Agent: "The cache.set key looks off but it's pre-existing — out of scope."
    # Result: the function appears to work perfectly. It just has a 0% cache hit rate,
    # hammering the database on every call.

    ```

This is not a "model is not smart enough" problem. We need to build our "harness" or setup around the model with intentional guardrails that guide it toward what we want.

We call this *bounded autonomy*: enough room to do the work, with guardrails that catch the specific ways it drifts.

Plain prompting is unbounded. A skill tightens it, and frameworks like BMAD or GSD tighten it more.

---

## Skills vs Plugins

Skills are folders with a `SKILL.md` file. The file describes when the skill should load and what Claude should do once it loads. Larger examples, scripts, templates, or references can live beside it.

Plugins package skills, commands, agents, and hooks into one installable unit. Use a plugin when the workflow needs more than one skill or command.

```text
skill-name/
  SKILL.md          # Required instructions and trigger description
  references/       # Optional docs loaded only when needed
  scripts/          # Optional deterministic helpers
  assets/           # Optional templates or static files
```

The difference matters for how much enforcement each one can carry. Think of it as a spectrum:

- A **skill** is mostly instructions. It tells Claude what to do when it loads. The agent can still ignore parts of it or treat it as a hint.
- A **plugin** can add hooks, subagents, and commands that run regardless of what the agent decides. Hooks in particular are enforcement: they fire whether or not the agent wanted them to.
- A **framework** like BMAD or GSD goes further. It writes project state to disk (PRDs, plans, phases, verification reports), so each step leaves artifacts the next agent reads, and the workflow becomes hard to skip past.

---

## Creating your own skills

Custom skills are often more useful than public ones because they encode your team's real habits.

Potentially Good skills include:

- Specific Team PR review rules
- release checklists
- database migration patterns
- design system rules
- security review requirements
- report or document templates

### When should you create a skill

Before writing a skill, the useful question to ask is: what is the lightest enforcement layer the agent cannot quietly skip past? There are roughly four to choose from, and a skill is only one of them.

| Layer | What it is | What it catches |
| --- | --- | --- |
| **CLAUDE.md** | Always-on rules and conventions for the project | Background context loaded into every session: e.g. "this repo uses Bun, not Node" |
| **Skill** | Folder that loads when triggered by a description match | Multi-step workflows or checklists that only matter for specific tasks |
| **Hook** | Mechanical command that fires on tool use or session events | Anything you need enforced regardless of what the agent decides: formatters, type checks, secret scanning |
| **Task scope** | Per-job instructions in the prompt or task brief | One-off constraints that do not generalize across sessions |

The general drift we have found: if the rule must apply every time and the agent might rationalize skipping it, put it in a hook. If the rule needs context and only fires on certain tasks, put it in a skill. If the rule is project-wide background, put it in CLAUDE.md. If the rule is purely for the current job, keep it in the prompt.

A skill is the right fit when the rule sits between always-on (too noisy for every session) and per-job (too easily forgotten across sessions).

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

Use these when the stakeholder expects a Word doc, slide deck, or styled PDF. For internal docs (design notes, ADRs, runbooks, status reports), markdown is better: it reviews in PRs, diffs cleanly, and lives next to the code.

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

**Project:** [obra/superpowers](https://github.com/obra/superpowers) · by Jesse Vincent (MIT)

Unlike BMAD and GSD, Superpowers is less command-driven. Its skills fire based on what you're doing (brainstorming, planning, debugging, TDD, or verification) without you having to remember which command to type. A session-start bootstrap (the `using-superpowers` skill) teaches Claude to check for a relevant skill before each task.

### Install

Superpowers now lives in Claude Code's **built-in** official plugin marketplace (`claude-plugins-official`), so there is no separate marketplace to register first:

```text
/plugin install superpowers@claude-plugins-official
```

Restart Claude Code after installing. It is still an opt-in plugin (not enabled by default), and Superpowers also ships for Codex, Cursor, Gemini CLI, and other harnesses, install it separately in each.

### Skills

| Skill | What it adds |
| --- | --- |
| `/superpowers:brainstorming` | Explore the approach before writing code |
| `/superpowers:writing-plans` | Break the work into short tasks with files and checks |
| `/superpowers:executing-plans` | Work through a written plan with review checkpoints |
| `/superpowers:subagent-driven-development` | Hand scoped tasks to fresh agents |
| `/superpowers:dispatching-parallel-agents` | Fan out independent tasks across agents |
| `/superpowers:test-driven-development` | Follow red, green, refactor when appropriate |
| `/superpowers:systematic-debugging` | Form a hypothesis, gather evidence, then fix |
| `/superpowers:requesting-code-review` | Get the work reviewed before calling it done |
| `/superpowers:receiving-code-review` | Verify feedback instead of agreeing on reflex |
| `/superpowers:verification-before-completion` | Run checks before claiming success |
| `/superpowers:using-git-worktrees` | Isolate larger work on a separate worktree |
| `/superpowers:finishing-a-development-branch` | Decide how to integrate completed work |
| `/superpowers:writing-skills` | Author and test your own skills |

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

Newer BMAD installs may expose these as skills instead of slash commands. In that setup, type `bmad-help`; the workflow names are otherwise the same.

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

For a step-by-step brownfield workflow, see [Existing Codebase Workflows](/docs/existing-codebase-workflows/).

### What to look for

BMAD is working well when each step produces a concrete artifact: a brief, PRD, architecture note, story, implementation, or review. Those artifacts make decisions easier to audit later.

BMAD is a poor fit when the overhead is larger than the change. If the task is "rename this label" or "fix this failing test," use a lighter workflow.

---

## GSD Core

**Project:** [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)

GSD divides a project into requirements, roadmap phases, discussion, planning, execution, and verification. Each phase is small enough to review on its own, and the working state lives on disk instead of depending on one long conversation.

### Install

Run the installer and choose the runtime and install scope when prompted:

```bash
npx @opengsd/gsd-core@1.8.0
```

For a non-interactive Claude Code install, choose either user-wide or project-local scope:

```bash
npx @opengsd/gsd-core@1.8.0 --claude --global  # All projects for this user
npx @opengsd/gsd-core@1.8.0 --claude --local   # Current project only
```

Verify inside Claude Code:

```text
/gsd-help
```

### Existing code - brownfield

For an existing repository, start with the guided onboarding command:

```text
/gsd-onboard
```

Onboarding maps the codebase, initializes the planning files, and records a summary. Use `/gsd-map-codebase` directly when you only need to refresh or inspect the codebase map.

For a step-by-step brownfield workflow, see [Existing Codebase Workflows](/docs/existing-codebase-workflows/).

### Typical flow for a phase

```text
/gsd-new-project
/gsd-discuss-phase 1
/gsd-plan-phase 1
/gsd-execute-phase 1
/gsd-verify-work 1
/gsd-ship 1
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

These flags reduce handoffs, but they also skip places where you would normally review assumptions. Use them for low-risk or well-specified work. Keep product, UX, API, data, and architecture decisions interactive until the important choices are written down.

### Quick work vs phase work

Use the smallest workflow that fits the task:

| Command | Use for |
| --- | --- |
| `/gsd-fast <text>` | Trivial edits that do not need planning |
| `/gsd-quick` | Small tasks that still benefit from light tracking |
| `/gsd-discuss-phase` -> `/gsd-plan-phase` -> `/gsd-execute-phase` | Scoped feature or project work |

### Execution model

Execution is plan-based. GSD splits a phase into plans, groups independent plans into waves, and runs work in fresh subagents where possible. Dependent work waits for the earlier wave to finish.

This is useful when a phase has several separable parts. It is less useful when the change is one file or one obvious bug fix.

### Two layers of verification

During `/gsd-execute-phase`, a verifier checks the completed phase against its goals and writes `VERIFICATION.md`. If it finds gaps, run `/gsd-plan-phase N --gaps`, followed by `/gsd-execute-phase N --gaps-only`, to close them.

`/gsd-verify-work N` then walks through user acceptance testing and writes the phase's UAT file. If you report issues, it creates fix plans.

### When to use it

Use GSD when you want a project or feature built in deliberate phases. It is a good fit for solo developers and small teams that want structure without a full agile process.

For quick changes, use `/gsd-quick` or plain Claude Code. A full phase workflow is not worth it for a typo, small copy edit, or obvious one-file change.

---

## Generated files and git

BMAD and GSD use their output folders differently.

GSD treats `.planning/` as project state. By default, its planning docs are meant to be committed unless you choose a private setup. If `.planning/` contains secrets, private notes, or throwaway plans, set `planning.commit_docs: false` and add `.planning/` to `.gitignore`. Check `.planning/config.json` first if you configured search or API integrations.

BMAD's `_bmad-output/` is more of a working folder. Keep files that still guide the project, especially `project-context.md`, but do not assume every PRD, story, or review artifact belongs in git forever. When an artifact becomes long-term project documentation, move or rewrite it into your normal docs folder.

### Why this matters for production

Treat `.planning/` and `_bmad-output/` as **the agentic decision log**, the audit trail for why the code looks the way it does. Six months from now, "Claude wrote it" is not a maintenance answer; the PRD, the discussion notes, the plan, and the verification report are.

Two practical consequences:

- Commit `.planning/` by default for production work. It survives team turnover, and the next engineer can read decisions instead of guessing them.
- Include `.planning/` in PR review. The diff is half the change; the plan and verification report are the other half, and that is where scope, assumptions, and tradeoffs live.

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

Use the plugin after a larger change, before shipping, or when Claude is stuck on a bug. Using a second model from another provider, which has different training data, can help to provide newer insights and find bugs that the same model checking itself might miss.

Ask for a narrow review target:

```text
/codex:adversarial-review look for missed auth checks and unsafe database writes
```

Treat the second model's output as another review input, not as approval.

---

## Hands-on workshops

Use these exercises after the sections above. Each lab is designed to make a specific insight *felt*, not just read. The step-by-step commands live in the hands-on repo so this page does not go stale every time the labs change.

**Workshop repo:** [stcomiin/claude-docs-workshop-handson](https://github.com/stcomiin/claude-docs-workshop-handson)

| Workshop | Time | What it demonstrates | Guide |
| --- | --- | --- | --- |
| Research report generation | 20-30 minutes | Subagents, web research, and document skills: skills are more than prompt snippets | [Starter workspace](https://github.com/stcomiin/claude-docs-workshop-handson/tree/main/research-report-generation-workflow-starter) |
| Existing app with GSD | 25-60 minutes | Scope control on a real codebase via codebase mapping, phase boundaries, and auto-verification | [Hands-on Lab → GSD](https://github.com/stcomiin/claude-docs-workshop-handson) |
| Existing app with BMAD | 35-75 minutes | Same app and feature as the GSD lab: feel where BMAD's brainstorming pays off and where the manual dev gates slow you down | [Hands-on Lab → BMAD](https://github.com/stcomiin/claude-docs-workshop-handson) |

The existing-app labs are run against [`fastapi/full-stack-fastapi-template`](https://github.com/fastapi/full-stack-fastapi-template) directly, fork or clone it before the session.

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

### Existing app with GSD or BMAD

The hands-on lab for using GSD and BMAD on a real existing codebase (same sample app, same feature, both workflows) lives in [Existing Codebase Workflows: Hands-on Lab](/docs/existing-codebase-workflows/#hands-on-lab-same-feature-both-workflows). It is structured as the practice counterpart to the GSD and BMAD step-by-step in that doc.

The lab covers:

- The sample codebase pick ([`fastapi/full-stack-fastapi-template`](https://github.com/fastapi/full-stack-fastapi-template))
- The feature scope (item categories with filter: touches frontend, backend, and a database migration)
- Why this feature surfaces real brownfield discipline (scope control, AI slop prevention, pattern adherence, migration discipline)
- Two paths per workflow (short via `/gsd-quick` or `/bmad-quick-dev`, full via the complete phase or product flow)

---

[Back to main page](/)

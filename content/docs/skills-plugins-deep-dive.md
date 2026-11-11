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

## Why do skills and plugins matter to the harness?

- **Progressive disclosure.** The agent sees a skill's name and description before loading its full instructions. When the skill is invoked, it reads the `SKILL.md` body and follows references to supporting files as needed. For example, a release skill can keep database migration instructions in a separate file that is read only when the release changes the database. This [progressive disclosure](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) keeps unrelated procedures out of context, following Anthropic's [context engineering guidance](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents).

- **Shared setup.** Plugins bundle skills, scripts, agents, and hooks into one installable package. A team can share its review or release workflow without each person copying instructions and configuring the supporting components separately. Keeping that setup in one repository gives the team a common place to review and improve it. When the workflow changes, the team can update the shared package and distribute the revision.

---

## Why do *Good* skills and plugins matter?

A skill records a workflow you want the agent to repeat. It tells the agent what to read, which steps to follow, when to ask for input, and how to check the result. You can reuse those instructions across sessions and share them with your team without repeating the same detailed prompt.

For example, a PR review skill can instruct Claude to read the diff and intended behavior, check project conventions, examine correctness and security, review test coverage, and report findings with file references and evidence. The process should adapt to the change. An authentication change needs permission checks, while a documentation edit needs different checks. The skill should explain when each step applies.

A good skill is specific enough that you can tell whether the agent followed it. "Check that every new endpoint enforces the caller's permissions" gives the agent a concrete task and the reviewer something to verify. Writing the process down also makes it easier to improve. When a review misses something, update the skill so future sessions can use the correction.

Plugins package related skills with tools, commands, and hooks so others can install the workflow together. Skills still depend on the agent following instructions. They make a process easier to repeat, but cannot guarantee compliance. Use scripts for repeatable checks and hooks or CI to enforce checks that must pass.

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
- A **mod** is a plugin whose hooks are code that runs inside Claude Code. It can redraw the interface and rewrite or answer tool calls, which is why [Mods](/docs/skills-plugins-deep-dive/#mods) has a vetting routine.
- A **framework** like BMAD or GSD goes further. It writes project state to disk (PRDs, plans, phases, verification reports), so each step leaves artifacts the next agent reads, and the workflow becomes hard to skip past.

---

## Skills

Agent Skills are folders of instructions, scripts, and resources that agents can discover and use to do things more accurately and efficiently.

Diagrams from Anthropic's [Agent Skills article](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills). Click to enlarge.

### Anatomy of a skill

Metadata describes when to use a skill; the Markdown body provides instructions.

{{< figure src="/images/agent-skills-anatomy.jpg" width="1650" height="929" loading="lazy" alt="A SKILL.md file with YAML frontmatter and Markdown instructions." >}}

Link supporting files from `SKILL.md` so they can be read separately.

{{< figure src="/images/agent-skills-supporting-files.jpg" width="1650" height="1069" loading="lazy" alt="SKILL.md links to reference.md and forms.md." >}}

### Progressive disclosure

Load descriptions first, instructions when selected, and supporting files as needed.

{{< figure src="/images/agent-skills-progressive-disclosure.jpg" width="2292" height="673" loading="lazy" alt="Three levels: metadata, instructions, and supporting files." caption="Illustrative token counts. Files remain on disk until needed; loaded content still consumes context." >}}

### Skills in the context window

A PDF request triggers `SKILL.md`, then the form-filling reference.

{{< figure src="/images/agent-skills-context-window.jpg" width="1650" height="929" loading="lazy" alt="The PDF request, skill instructions, and form reference enter context in sequence." >}}

### Skills and code execution

Instructions can invoke bundled scripts for repeatable operations.

{{< figure src="/images/agent-skills-code-execution.jpg" width="1650" height="929" loading="lazy" alt="Form instructions point to a Python helper for extracting PDF fields." >}}

For a worked authoring example, see [Creating your own skills](/docs/skills-plugins-deep-dive/#creating-your-own-skills).

See the following Github repo for living doc: https://github.com/luongnv89/claude-howto/blob/6d1e0ae4afbb95305e10d414ae90fcf3d74b9c4e/03-skills/README.md

Two recent changes affect how skills behave. `/skill-doctor` lists the loaded skills that went unused and what each costs in context, so you can prune them (v2.1.261+). It needs feature-flag fetching, which the workshop settings turn off. A skill marked `disable-model-invocation` now makes Claude ask you to run it instead of copying its steps (v2.1.222+).

### Notable Skills for Reference

> ⚠️ **Security warning:** Skills can execute arbitrary code in your environment. Before installing a community skill, **review SKILL.md and every bundled script yourself**. A malicious skill can access your shell, exfiltrate data, or modify files from a few lines of Markdown. Install only from sources you trust. The same risk applies to skills used by OpenClaw and other coding CLIs.

This is a growing list of community and official skills worth knowing about. Not all of these are endorsed. They're here as references for what's possible.

| Category | Skill | Repo | Purpose |
| --- | --- | --- | --- |
| Documents | docx, pptx, pdf, xlsx | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills) | Create and edit common office document formats, same skills that power Claude's document capabilities on web and desktop. [Blog post](https://claude.com/blog/create-files). Might require pip and npm to install some dependencies |
| Writing | Unslop | [cursor/plugins · pstack](https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md) | Edits prose to remove common AI writing patterns, including filler, vague claims, forced contrasts, and excessive formatting. Preserves the intended meaning and tone while using plain language. |
| Tooling | Skill Creator | [anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) | Meta-skill for creating, evaluating, improving, and benchmarking other skills. Built into Claude.ai (paid plans). Already installed by default |
| DevOps | KubeShark Kubernetes Skill | [LukasNiessen/kubernetes-skill](https://github.com/LukasNiessen/kubernetes-skill) | Failure-mode-first Kubernetes manifest generation, review, and hardening for Claude Code and Codex. Reduces deprecated APIs, unsafe defaults, weak RBAC, and rollout or networking issues |
| Frontend | React Best Practices | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) | Vercel's official React conventions: component patterns, hooks usage, performance best practices |
| Frontend | React View Transitions | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-view-transitions) | Implements view transitions in React apps using the View Transitions API |
| Frontend | Impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Frontend-design toolkit that expands Anthropic's frontend-design skill: reusable product/design context (`PRODUCT.md`, `DESIGN.md`), 23 design commands, browser-assisted variant iteration, and 59 deterministic detector rules for recurring AI frontend anti-patterns. Covers design critique, accessibility/performance audits, typography, layout, responsive behavior, i18n/edge-case hardening, and final polish. Install: `npx impeccable install`, then `/impeccable init` (plugin marketplace also supported) |
| Security | OWASP Security | [agamm/claude-code-owasp](https://github.com/agamm/claude-code-owasp) | OWASP security best practices (2025–2026): Top 10:2025, ASVS 5.0, Agentic AI security, 20+ language-specific security quirks |
| Security | SecLists & Agents | [awesome-claude-skills-security](https://github.com/Eyadkelleh/awesome-claude-skills-security) | More security skills: curated SecLists wordlists, injection payloads, and expert agents for authorized pentesting, CTFs, and bug bounties |
| Data & Research | DSPY | [OmidZamani/dspy-skills](https://github.com/OmidZamani/dspy-skills) | Automatic prompt optimization using the DSPY framework |
| Data & Research | Web Scraper | [yfe404/web-scraper](https://github.com/yfe404/web-scraper) | Intelligent web scraping with automatic strategy selection and TypeScript-first Apify Actor development |
| Data & Research | OSINT | [smixs/osint-skill](https://github.com/smixs/osint-skill) | Open-source intelligence: from a name to a scored dossier with psychoprofile, career map, and confidence grades. 55+ Apify actors, 7 search APIs. Early beta. |
| Data & Research | Hyperresearch | [jordan-gibbs/hyperresearch](https://github.com/jordan-gibbs/hyperresearch) | Deep research harness for Claude Code with tier-adaptive pipelines, adversarial review, source provenance, and a persistent searchable vault. |
| Data & Research | last30days | [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | Researches what people have discussed and engaged with recently across Reddit, Hacker News, GitHub, YouTube, X, arXiv, and more. Synthesizes cross-source findings into a cited brief. Covers topic/person/company research, tool comparisons, trend discovery, meeting prep, watchlists, and recurring briefings. Several sources work without configuration; optional sources require their own credentials or browser sessions. Install: `/plugin marketplace add mvanhorn/last30days-skill`, then `/plugin install last30days` |
| Notebook-LM | Knowledge Management | [Notebook-LM skill](https://github.com/PleasePrompto/notebooklm-skill) | LLM to manage your NotebookLM, start research, generate infographics |
| Code Review | Devil's Advocate | [Devil's Advocate](https://github.com/notmanas/claude-code-skills/tree/main/skills/devils-advocate) | Challenge and poke holes from previous reviews with defined frameworks |

> **Using Hyperresearch:** Treat Hyperresearch more like a research harness than a single prompt helper. Install it in a project with `pip install hyperresearch && hyperresearch install`, then run `/hyperresearch <research question>` inside Claude Code. It can run a lighter mode for bounded factual questions, or a full multi-step pipeline for deep argumentative research with fetchers, critics, patching, and a persistent `research/` vault that future sessions can search and reuse.

---

### Curated Lists & Articles

These aren't individual skills; they're roundups and deep dives that reference multiple skills worth exploring.

| Article | Source | What It Covers |
| --- | --- | --- |
| [Top Claude Skills for UI/UX Engineers](https://snyk.io/articles/top-claude-skills-ui-ux-engineers/) | Snyk | Curated list including UX Designer skill, component libraries, design system skills |
| [Top Claude Skills for Cybersecurity](https://snyk.io/articles/top-claude-skills-cybersecurity-hacking-vulnerability-scanning/) | Snyk | Curated list including OWASP, vulnerability scanning, penetration testing skills |
| [awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | VoltAgent | Community-maintained master list of 500+ agent skills across all platforms |
| [Awesome Claude Skills](https://github.com/ComposioHQ/awesome-claude-skills) | ComposioHQ | Awesome curated list of Claude Skills for all domains |
| [agent-skills](https://github.com/addyosmani/agent-skills) | Addy Osmani | Software engineering specific skills |

---

### On Skill Security

The convenience of skills comes with real risk.

- Snyk's research on the [ClawHavoc campaign](https://snyk.io/articles/skill-md-shell-access/) demonstrated how a malicious SKILL.md file can escalate from Markdown instructions to full shell access in three lines.
- Hidden instructions in a PDF file included with the skill alters the default skill instructions [https://blog.sondera.ai/p/claude-skill-hijack-invisible-sentence](https://blog.sondera.ai/p/claude-skill-hijack-invisible-sentence)
- **Skills can include executable scripts**: a `scripts/` directory can contain anything that runs on your machine
- **Prompt injection via SKILL.md**: malicious instructions can tell the agent to exfiltrate environment variables, API keys, or source code
- **Supply chain attacks**: a skill you installed from GitHub can be updated by the author at any time after you've added it
- **No sandbox by default**: unlike MCP servers, skills run with the same permissions as your Claude Code session

**Practices to be followed before installing any community skill:**

1. **Read the SKILL.md**: the full file, not just the front-matter description
2. **Check the scripts/ directory**: if it has executable code, read every file
3. **Review the repo**: check commit history, contributors, and whether the repo is actively maintained
4. **Pin versions**: clone or fork rather than referencing a live repo that can change under you, or pin to commit SHAs
5. **Use `--dangerously-skip-permissions` with caution**: this flag + a malicious skill = full access to your machine

> 🔗 For securing the **apps Claude builds** (OWASP web/API/LLM/Agentic Top 10s, MCP & Claude Code CVEs, ready-to-paste pre-commit and CI guards, the LMDeploy 12h-to-exploit advisory), see [Cybersecurity & Production Hardening](/docs/security/).

## Plugins

Plugins extend Claude Code with additional capabilities: language intelligence, platform integrations, workflow automation, and more.

Changes made from `/plugin` (install, enable, disable) take effect when you close the menu; `/reload-plugins` is no longer needed (v2.1.268+). Before publishing your own plugin, `claude plugin validate --json` gives a machine-readable report (v2.1.259+) and `claude plugin eval` runs its eval suite and scores the results (v2.1.269+). On install, `--accept-command <sha256>` accepts exactly the command a `--json` dry run displayed, instead of a blanket `-y` (v2.1.271+). `/plugin install <name> --marketplace <owner/repo>` adds a marketplace and installs from it in one step (v2.1.275+). `claude plugin install` takes the same flag from the shell since v2.1.292.

> 🗒️ Some plugins install the MCP servers they depend on. Official plugins are available through the `claude-plugins-official` marketplace.

### Notable Plugins

| Plugin | What it does | Link |
| --- | --- | --- |
| **Superpowers** | A collection of power-user enhancements for Claude Code | [https://github.com/obra/superpowers](https://github.com/obra/superpowers) |
| **Skills for Real Engineers** | Matt Pocock's composable collection of engineering-discipline skills: requirements grilling, domain modeling, specs and ticket decomposition, TDD, debugging, code review, and codebase architecture | [GitHub](https://github.com/mattpocock/skills/tree/main/skills)<br><code>/plugin install mattpocock-skills</code> (or <code>npx skills@latest add mattpocock/skills</code> for editable project-local copies. Pick one method to avoid duplicate skills) |
| **Security Guidance** | Official plugin that automatically reviews code changes for vulnerabilities on edits, commits, or pushes | [Docs](https://code.claude.com/docs/en/security-guidance#on-each-commit-or-push-claude-makes)<br><code>/plugin install security-guidance@claude-plugins-official</code> |
| **Codex Security** | OpenAI Codex plugin for authorized repository, deep, and diff-focused security scans, plus minimal fixes for validated findings | [Docs](https://developers.openai.com/codex/security/plugin)<br><code>$codex-security:security-scan</code> / <code>$codex-security:security-diff-scan</code> |
| **Code Modernization** | Official plugin for modernising a legacy codebase. It assesses the code, draws an interactive map, extracts the business rules, and writes a plan for you to approve, then upgrades, rewrites, or rebuilds the code and checks that the new code behaves like the old. Some steps start many agents at once, so pilot it on one module | [README](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-modernization)<br><code>/plugin install code-modernization@claude-plugins-official</code> |
| **Champion Kit** | Official plugin for the person getting a team to adopt Claude Code. It helps you run hackathons and office hours, find patterns worth sharing, and write an AI maturity report, and the official docs have a matching [Champion kit playbook](https://code.claude.com/docs/en/champion-kit) | [README](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/champion-kit)<br><code>/plugin install champion-kit@claude-plugins-official</code> |
| **GSD Core** | Phase-based spec, implementation, and verification workflow | [https://github.com/open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) |
| **BMAD** | Agile-style planning and development framework (SDD) | [docs](https://docs.bmad-method.org/) / [GitHub](https://github.com/bmad-code-org/BMAD-METHOD) |
| **Spec Kit** | SDD Framework | [https://github.com/github/spec-kit](https://github.com/github/spec-kit) |
| **OpenSpec** | SDD Framework | [https://github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) |
| **GitLab** | GitLab-native version of the GitHub integration | via claude-plugins-official marketplace |
| **Codex for CC** | Call Codex CLI for a second review or delegated task | [GitHub](https://github.com/openai/codex-plugin-cc)<br><code>/plugin marketplace add openai/codex-plugin-cc</code><br><code>/plugin install codex@openai-codex</code> |
| **Playwright** | Browser automation and end-to-end testing MCP server | via claude-plugins-official marketplace |
| **Language Servers (LSP)** | Gives Claude real-time access to your language server: hover info, go-to-definition, diagnostics | via claude-plugins-official marketplace |

### Plugin Marketplace

| Marketplace option | Offline? |
| --- | --- |
| **Official Claude Code marketplace** | 🔴 Requires internet to browse and install |
| **Anthropic community marketplace** | 🔴 Requires internet. Holds third-party plugins their authors submitted to Anthropic, and Claude Code doesn't add it by default |
| **LiteLLM self-hosted marketplace** | 🟢 Fully offline once LiteLLM proxy is running locally |
| **Archive source** (v2.1.224+) | Works from any internal HTTPS host: a plugin zip with an optional SHA-256 pin, no git or npm needed |

To use the community marketplace, run `/plugin marketplace add anthropics/claude-plugins-community`, then install with the `@claude-community` suffix.

**Offline / self-hosted option via LiteLLM:**

Full guide: [https://docs.litellm.ai/docs/tutorials/claude_code_plugin_marketplace](https://docs.litellm.ai/docs/tutorials/claude_code_plugin_marketplace)

**Prerequisites for the LiteLLM marketplace:**

- LiteLLM Proxy running with a database connected
- Access to the LiteLLM UI
- Plugins hosted on GitHub, GitLab, or any git-accessible URL (can be a local git server)

To browse and install plugins from the official marketplace, open Claude Code and navigate to **Extensions → Marketplace**, or visit the marketplace via the Claude Code documentation.

### Plugin Marketplace Offline setup steps

For offline environments, you can host curated plugins through a self-hosted LiteLLM instance, mirroring their online counterparts.
To add a self-hosted LiteLLM as a plugin marketplace in Claude Code:

`claude plugin marketplace add http://your-litellm-proxy.example.com/claude-code/marketplace.json`

If the catalog needs a token, a marketplace `headersHelper` runs a command of yours that mints the request headers (v2.1.238+). Marketplaces hosted on a self-managed GitLab work with bare repository URLs, including nested subgroups (v2.1.232+).

---

## Mods

A mod is a plugin that changes how Claude Code itself looks and behaves. Skills, MCP servers, and `settings.json` hooks work from outside Claude Code. They give Claude text or tools, or they run a script. A mod is JavaScript or TypeScript that runs inside Claude Code, so it can:

- draw a pane beside the transcript or a band above the prompt, with buttons and text fields
- restyle what Claude Code already draws, such as tool rows and the spinner
- watch, rewrite, or answer tool calls and prompts before they go ahead
- add a `/command` that runs your code immediately, without a model turn

Claude Code added mods in v2.1.287 (October 2026), and they're on by default. Through an LLM gateway, as in the workshop setup, they load from v2.1.290. They work in the terminal, the Desktop app's Code tab, and the VS Code extension.

| | Mod | Settings hook | Skill | MCP server |
| --- | --- | --- | --- | --- |
| **What it is** | Functions in a plugin that run inside Claude Code | A shell command, HTTP request, or prompt run on a lifecycle event | A `SKILL.md` of instructions Claude reads | An external process that gives Claude tools |
| **Draws in the interface** | Yes | No | No | No |
| **You write** | JavaScript or TypeScript | A script and a `settings.json` entry | Markdown | A server in any language |
| **Pick it when** | You want a pane, a band above the prompt, a custom command, or to rewrite an event | You want to block, allow, or log an event with a script | You keep pasting the same instructions | Claude needs to reach an external system |

Claude Code calls a mod's handlers "hooks" as well. They're separate from the `settings.json` hooks described under [Hooks](/docs/agentic-coding-in-terminal/#hooks), which keep working alongside them.

### Three ways to get a mod

1. **Use a built-in one.** Some Claude Code features are mods already, including the `/diff` pane and the loader that reads `AGENTS.md`. `/plugin` lists them under **Built-in** on the **Installed** tab.
2. **Ask Claude to write one.** Describe it in an interactive session. Claude works from the built-in `plugin-authoring` skill, which you can also load yourself with `/plugin-authoring`, and writes the mod to `~/.claude/dev-mods/<session-id>/`. Claude Code then asks whether to turn on the mods written in this session. From v2.1.321 it turns them on without asking in auto and bypass modes. The mod reloads at the end of each turn that changes it, so you can ask for a change and try it in the next turn.
3. **Install one.** A mod installs like any other plugin, with `/plugin install <name>@<marketplace>`. If you install from the shell while a session is open, run `/reload-plugins` in that session.

A mod Claude wrote loads only in the session that made it. To keep it, copy its folder somewhere of your own and start Claude Code with `claude --plugin-dir <folder>`.

### Try it: write a mod, then read what it can reach

This takes about ten minutes and is optional. In a Claude Code session, ask:

```text
make a mod that shows the current git branch above the prompt
```

Approve the files and turn the mod on if Claude Code asks. The branch name appears above the prompt box, and `/plugin` lists the mod on its **Installed** tab, where you can also switch it off.

Now look at it the way you'd look at someone else's mod. Ask Claude for the folder it wrote to, then run this in a second terminal:

```bash
claude plugin validate ~/.claude/dev-mods/<session-id>/<mod-folder>
```

The `hooks:` line lists the events the mod receives, and the `calls:` line lists what it asks Claude Code to do. A branch display has to run `git` or read a file under `.git`, so expect to see something like `$.process.run` or `$.fs.read`. Read these two lines for any mod before you install it.

### Vet a mod before you install it

> **A mod is code that runs as you.** Claude Code doesn't sandbox it. `/sandbox` isolates the Bash commands Claude runs, and a process that a mod starts runs outside the sandbox. A loaded mod can read and write any file your account can, start programs, and make network requests. It can read environment variables and settings files, see and rewrite every prompt and tool call, approve a tool call before Claude Code asks you, run Claude's tools itself, and make model calls on your key.

In the workshop setup your gateway key is in `~/.claude/settings.json`, where a mod can read it, and the built-in guard doesn't load on an API key or gateway token. That guard, `cc-plugin-sec-default`, stops user-installed mods from overriding deny rules, ask rules, and `PreToolUse` hooks, but it loads only on a machine with managed settings or a `managed-mcp.json` file, or on a Team or Enterprise login. Without it, an installed mod can approve a call that your deny rules, or the safety hooks from the [hooks hands-on](/docs/agentic-coding-in-terminal/#hands-on-add-safety-hooks-10-minutes), would have stopped.

The routine:

1. **Get the files without running them.** Clone the repository and don't install it yet.
2. **Run `claude plugin validate <folder>`.** It prints which events the mod hooks and which API calls it makes, without loading the mod.
3. **Read the source anyway.** `validate` lists API calls, and a hook can change an event while passing it along, for example a command or a file path, without making one. `validate` reports nothing for that change.
4. **Check again after every update.** What a mod can reach changes between versions. The `skins` mod made no file, process, network, or environment calls at 0.1.1. By 0.5.16 it had added an update check that reads a file and fetches a URL, a process call to detect dark mode, and reads of terminal environment variables. Those are ordinary things for a theme to do, but you only learn about them by running `validate` again.
5. **Know how to turn a mod off.** Disable one mod on the **Installed** tab of `/plugin`, or start one session without installed mods with `claude --safe-mode`. `"disableAllHooks": true` in `~/.claude/settings.json` turns installed mods off everywhere, along with your `settings.json` hooks and custom status line.

This is what step 2 prints for Anthropic's `blast-radius` sample:

```text
❯ ./blast-radius.mjs hooks: tool.call{tool=Bash}, ui.render{component=Pane}, ui.render{component=AbovePrompt}
❯ ./blast-radius.mjs gating hook without .catch: tool.call{tool=Bash}
❯ ./blast-radius.mjs calls: $.clock.now, $.process.run, $.session.cwd, $.ui.close, $.ui.invalidate, $.ui.open, $.ui.resolve, $.ui.toast
```

| In the output | What it means |
| --- | --- |
| `$.fs.read`, `$.fs.write` | Reads or writes files anywhere you can |
| `$.process.run`, `$.process.spawn` | Starts programs as you |
| `$.http.fetch` | Makes network requests |
| `$.env.get`, `$.settings.read` | Reads environment variables and settings, which can hold API keys. An `env reads:` line names each variable |
| `$.model.complete`, `$.model.fork` | Makes model calls on your key |
| `$.prompt.submit` | Submits a prompt, and can send it as your own words |
| `$.tool.call`, `$.mcp.call` | Runs Claude's own tools, such as Bash, or an MCP tool. No permission prompt appears, even under an ask rule, though deny rules still apply (v2.1.321+) |
| `$.env.set` | Sets an environment variable for Claude Code and every command it starts afterwards. An `env writes:` line names each variable |
| `tool.call` or `prompt.submit` under `hooks:` | Sees every tool call or prompt and can change it |
| `tool.check` under `hooks:` | Can approve or deny a tool call before Claude Code asks you |
| `gating hook without .catch` | If that hook throws or times out before passing the event on, Claude Code skips it and the action goes ahead. A mod that claims to guard something then fails open |

The security page lists [the risks in one place](/docs/security/#mods).

### Notable mods

In November 2026 no mod stood out on Reddit or YouTube as one everyone should install. Most Reddit threads were authors announcing their own mod, many YouTube roundups repeated the same few picks, and the mods recommended most often were Anthropic's own samples. As with the skills list above, these are references for what's possible, and we don't endorse them. Read the **Reach** column first. It's what `claude plugin validate` reported for each repository on 10 November 2026, using Claude Code 2.1.321.

| Mod | What it does | Reach | Install and notes |
| --- | --- | --- | --- |
| **blast-radius** (Anthropic sample) | Holds a risky shell command, such as `rm -rf`, `git reset --hard`, a force push, or a migration, and shows what it would change, with Proceed and Cancel buttons | Hooks Bash tool calls and starts `bash` and `git` processes. Makes no file, network, or environment calls | [Source](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius). Clone the repository, then from `claude-code/mods` run `claude --plugin-dir ./blast-radius`. Anthropic shares it as-is without support, and its guard hook has no `.catch`. It overlaps the delete hook from the hooks hands-on |
| **replay-theater** (Anthropic sample) | `/replay` steps through the file edits Claude made in the last turn, one diff at a time | Reads files. Makes no process, network, or environment calls | [Source](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/replay-theater). From the same clone, run `claude --plugin-dir ./replay-theater` |
| **next-steps** | After each turn, suggests up to three next prompts above the input. Press 1, 2, or 3 to put one in the prompt box as a draft you can edit | Makes one forked model call per turn and fills the prompt box. Makes no file, process, network, or environment calls | [Source](https://github.com/anthropics/claude-plugins-community/tree/main/next-steps), in Anthropic's community marketplace<br><code>/plugin marketplace add anthropics/claude-plugins-community</code><br><code>/plugin install next-steps@claude-community</code><br>Each round of suggestions costs about one short reply on your key |
| **savvy-progress** | `/agents-info` opens a panel that lists running, finished, and planned subagents with their model, progress, context, cost, and time. It also draws a progress bar for its companion `savvy-flow` plugin | Reads settings and the locale variables `LANG`, `LC_ALL`, and `LC_MESSAGES`, and registers its own tools. Makes no file, process, or network calls | [Source](https://github.com/JohnnyVizz/claude-kit/tree/main/plugins/savvy-progress)<br><code>/plugin marketplace add johnnyvizz/claude-kit</code><br><code>/plugin install savvy-progress@claude-kit</code> |
| **filetree** | A pane with an IDE-style file tree that shows what Claude is reading and editing, with git status | Has the widest reach of the five. Reads and writes files, starts processes, reads 18 environment variables, and hooks permission checks for edits and shell commands | [Source](https://github.com/data-goblin/claude-code-filetree)<br><code>/plugin marketplace add data-goblin/claude-code-filetree</code><br><code>/plugin install filetree@claude-code-filetree</code><br>Needs v2.1.306 or later and git |

You'll see these recommended as well. Each comes with a catch:

| Mod | What to know first |
| --- | --- |
| **token-weather** (Anthropic sample) | Draws a forecast of the context window above the prompt, and reads only session usage. It repeats the context percentage [ccstatusline](/docs/agentic-coding-in-terminal/#1-ccstatusline) already shows |
| **You should know** (built in) | A side agent that flags something you may have missed. `/plugin` doesn't list it when you connect through an LLM gateway, so you can't use it in the workshop setup |
| [cache-tax](https://github.com/karanb192/cache-tax) | Asks before a send hits a cold prompt cache and can ping to keep the cache warm during breaks. It makes model calls and no file, process, or network calls. Its README says API-key sessions default to a five-minute cache, so it asks you to set `promptCacheTtl` to `"1h"` first. Every ping costs tokens |
| [cc-stretch](https://github.com/pro-vi/cc-stretch) | Shortens each reply and expands a phrase in place when you click it. It starts processes and reads the session's messages. Clicks need the fullscreen renderer, which `/tui fullscreen` turns on |
| [effortless](https://github.com/HeyCubit/effortless) | Sets the reasoning effort for each prompt. A small-model call makes that choice, so every prompt costs an extra request. It makes network requests, writes files, starts processes, and makes model calls. Its repository didn't pass `claude plugin validate` on v2.1.321 when we checked |
| [skins](https://github.com/hellosverre/claude-skins) | Restyles the transcript with themes. It's cosmetic, and your screen will stop matching the screenshots in these docs |

**Where to look further**

- [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview) and [Create a mod](https://code.claude.com/docs/en/plugins/mods/create) in the official docs, and Anthropic's three-minute [intro video](https://youtu.be/yUuFvL1lK4k).
- [Anthropic's sample mods](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods) and the [source of the built-in mods](https://github.com/anthropics/claude-code/tree/main/mods). Read both before you write your own.
- [awesome-claude-code-mods](https://github.com/karanb192/awesome-claude-code-mods), a community catalogue that scans public repositories and records what the validator says each mod can read, write, run, or send. Anthropic isn't involved, and the author of cache-tax maintains it.
- Traversy Media's [Claude Code Mods Explained](https://youtu.be/uizaxuzgEAk), a 23-minute walkthrough.

---

## Creating your own skills

Custom skills are often more useful than public ones because they encode your team's real habits.

Good candidates include:

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
| `model` | Run the skill on a named model, for example a cheaper one for mechanical work. Auto mode keeps the session model if it cannot support the named one (v2.1.259+). |
| `effort` | Set the reasoning effort for the skill's turn. |

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
- Run `claude plugin validate` on the skill folder before sharing it; it reports `SKILL.md` frontmatter that fails to parse (v2.1.233+), and `--json` gives a machine-readable report (v2.1.259+).
- Run `/skill-doctor` now and then to see which loaded skills go unused and what they cost in context (v2.1.261+).

### Where skills live

| Audience | Location |
| --- | --- |
| Personal | `~/.claude/skills/` |
| Project/team | `.claude/skills/` |
| Organization | Managed team or enterprise provisioning |
| Public distribution | Plugin marketplace or shared package |

---

## Document skills - docx, pdf, pptx, xlsx

The document-skills plugin helps Claude create and edit Word documents, PDFs, slide decks, and spreadsheets. Its skills cover tasks such as document formatting, PDF extraction, presentation layout, and spreadsheet formulas and charts. Use it when a stakeholder needs an office file or a formatted deliverable, and inspect the generated file before sharing it.

**Project:** [anthropics/skills](https://github.com/anthropics/skills)

For internal docs (design notes, ADRs, runbooks, status reports), markdown is better: it reviews in PRs, diffs cleanly, and lives next to the code.

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

Superpowers adds skills for brainstorming, planning, debugging, test-driven development, and verification that activate based on the task. It fits everyday coding sessions where you want the agent to follow a repeatable process without remembering a command for every step. Its automatic skill activation adds structure, but can make sessions harder to predict if you prefer to direct each step yourself.

**Project:** [obra/superpowers](https://github.com/obra/superpowers) · by Jesse Vincent (MIT)

A session-start bootstrap (the `using-superpowers` skill) teaches Claude to check for a relevant skill before each task.

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
| `/superpowers:diagnosing-superpowers` | Work out why a Superpowers session went wrong, or gather a bug report for its maintainers |

### When to use it

Use Superpowers when you want automatic prompts for planning, debugging, and checking work during normal Claude Code sessions. It pairs well with larger workflow tools, but it can also stand alone.

Skip it if you want to keep your agent environment minimal or if automatic skill activation makes the session harder to predict.

---

## BMAD - Breakthrough Method for Agile AI-Driven Development

BMAD gives Claude an agile-style workflow with separate roles for product, architecture, development, QA, and UX. Those roles turn an idea into requirements, design decisions, stories, implementation, and review artifacts that later agents can read. It is useful for larger product work that needs explicit decisions and handoffs, but usually adds too much process for isolated fixes.

**Project:** [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)

**Docs:** [docs.bmad-method.org](https://docs.bmad-method.org/)

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

GSD organizes a project into requirements and roadmap phases, then takes each phase through discussion, planning, execution, and verification. It saves plans, decisions, and progress in `.planning/` so later sessions can continue from written project state. Use it for features or projects that benefit from small, reviewable phases; its quick commands cover smaller tasks that do not need the full workflow.

**Project:** [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)

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

The commands stay on 1.8.0 because GSD Core 1.11.0 and later need Node.js 24, and the workshop asks for Node.js 22. On Node.js 24 or newer you can use the current release, which was 1.20.1 in November 2026. It takes the same flags and still has every command used on this page.

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

The Codex plugin lets Claude Code call Codex for code review, investigation, or delegated work. Its commands support focused reviews and background jobs, making it useful for getting another model's perspective on a change or a difficult bug. The plugin's model support is outdated, so ask your agent to use the Codex CLI directly for this workflow.

**Project:** [openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc)

> **Warning: Use the Codex CLI directly.** The `openai/codex-plugin-cc` repository has not been updated to support the latest Codex models and new reasoning effort levels. Ask your agent to use the Codex CLI directly instead of this plugin.

### Install

```bash
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/codex:setup
```

`/codex:setup` checks whether Codex CLI is installed and authenticated. On Claude Code before v2.1.268, run `/reload-plugins` after the install; newer versions apply plugin changes when the `/plugin` menu closes.

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

[← Back to the contents](/docs/)

---
title: Cheat Sheet for Claude Code
weight: 4
---

A compact reference for the commands and shortcuts that come up most often during the workshop, organized by the task at hand.

## 🔎 Session hygiene

| Command | Description |
| --- | --- |
| `/help` | Show the commands available in your setup |
| `/clear` | Start a fresh conversation; CLAUDE.md still loads |
| `/compact [focus]` | Summarize the conversation, optionally around a specific focus |
| `/context` | Show how the context window is being used |
| `/recap` | Summarize a session when you come back to it |

## 💰 Usage and models

| Command | Description |
| --- | --- |
| `/usage` | Show account usage and limits |
| `/cost`, `/stats` | Aliases for `/usage` |
| `/insights` | Generate a report on the projects you worked on, how you used Claude Code, and where sessions got stuck |
| `/model [name]` | Switch models: opus, sonnet, fable, or haiku |
| `/effort [level]` | Set effort to low, medium, high (default), xhigh, max, or `ultracode` |
| `/fast [on\|off]` | Toggle fast mode for Opus 5 and Opus 4.8: up to 2.5× faster, billed at $10 input and $50 output per MTok |

## 🧠 Memory & project setup

| Command | Description |
| --- | --- |
| `/init` | Create a starter CLAUDE.md |
| `/memory` | Open the CLAUDE.md files in scope |
| `/permissions` | Review or edit permission rules |
| `/config` | Open Claude Code settings |
| `/doctor` | Diagnose setup issues and optionally fix them (alias `/checkup`) |
| `/fewer-permission-prompts` | Scan recent transcripts and propose a read-only allowlist to cut permission prompts |

## ✍️ Writing better prompts

| Command | Description |
| --- | --- |
| `/plan` or `Shift+Tab` | Enter plan mode to inspect the project and propose changes |
| `/ultraplan <prompt>` | Plan in a browser session, then execute remotely |
| `@file` | Add a file or directory to the prompt |
| `Alt+T` | Toggle extended thinking for the rest of the session |

## ⚡ Mid-task steering

| Command | Description |
| --- | --- |
| `/btw` | Ask a side question without adding it to the main conversation context |
| `/copy [N]` | Copy the latest response, or response N, to the clipboard |
| `Ctrl+S` | Stash current draft; press `Ctrl+S` again on an empty prompt to restore |
| `Esc` | Stop generation |
| `Esc Esc` or `/rewind` | Open the rewind menu for code, conversation, both, a summary point, or a fork (`f`) |
| `/branch` / `/fork` | `/branch` switches to a new conversation timeline; `/fork` copies the conversation into a background session |
| `/subtask <prompt>` | Hand a side task to a subagent; its result returns into this conversation |
| `/background` / `/bg` | Detach the current session to run as a background agent and free the terminal |

## 🔍 Review & refactor

| Command | Description |
| --- | --- |
| `/diff` | Open the interactive diff viewer |
| `/review <pr>` | Run a fast, single-pass PR review |
| `/security-review` | Check the current work for security issues; see [Cybersecurity & Hardening](/docs/security/) |
| `/code-review` | Find correctness bugs and cleanup opportunities; runs in a background subagent by default |
| `/code-review ultra` or `/ultrareview` | Run the cloud review; `/ultrareview` remains a supported alias |
| `/simplify` | Run four cleanup agents to improve reuse, clarity, and efficiency |
| `/batch <description>` | Split a migration or other repetitive change across worktree agents |
| `/autofix-pr` | Work through PR review comments automatically |

## 🤖 Automation

| Flag / Command | Description |
| --- | --- |
| `--permission-mode auto` | Start in auto mode; works interactively and with `-p` |
| `claude auto-mode reset` | Remove the user-level `autoMode` customization block |
| `ultracode` (in a prompt) or `/effort ultracode` | Use xhigh effort and dispatch workflow agents when parts of the task can run independently |
| `/workflows` | List, watch, pause, resume, save, stop workflow runs |
| `/deep-research <question>` | Research a question in parallel and return a cited report |
| `/dataviz` | Chart and dashboard design guidance when building visualizations |
| `/loop [interval] [prompt]` | Re-run a prompt while the session stays open (alias `/proactive`); `Esc` stops it. Omit the interval and Claude paces itself; omit the prompt and it runs a maintenance pass or your `.claude/loop.md`. Recurring tasks self-delete 7 days after creation |
| `/goal [condition\|clear]` | Keep taking turns until an evaluator model confirms your condition is met (needs v2.1.139+); pair with auto mode or turns stall on prompts. `/goal` alone shows status; `/goal clear` stops it |
| `/schedule` | Create a cloud routine triggered by a schedule, API call, or webhook |
| `/sandbox` | Run with file and network isolation |

## 🔌 Extension

| Command | Description |
| --- | --- |
| `/agents` | Reminder to create or edit subagents by asking Claude or editing `.claude/agents/`; no longer an interactive manager (as of v2.1.198) |
| `/skills` | List and manage skills |
| `/plugin` | Browse plugin marketplaces |
| `/mcp` | Manage MCP servers such as GitHub or Jira |
| `/hooks` | Configure lifecycle hooks such as PreToolUse, PostToolUse, Stop, and Notification |
| `/install-github-app` | Install Claude GitHub App for PR workflows |

## 📦 Sessions

| Command | Description |
| --- | --- |
| `/resume` | Open the session picker |
| `claude -c` | Continue the most recent session from the shell |
| `claude --resume <id>` | Continue a session by ID |
| `claude -r "name"` | Continue a session by name |
| `/rename my-feature` | Rename current session |
| `claude -c --fork-session` | Continue the most recent session under a new session ID |
| `/export` | Export the session to a file or the clipboard |
| `/color <name>` | Set the prompt-bar color for easier side-by-side work |

## 🛠️ Useful CLI flags for CI

```bash
# Set a hard cost cap
claude -p "review this" --max-budget-usd 2.00

# Limit agentic turns
claude -p "fix the bug" --max-turns 3

# Use Haiku for mechanical CI work
claude -p "lint check" --model haiku

# Fallback when primary is overloaded
claude -p "review" --fallback-model haiku

# Restrict built-in tools (MCP tools are not affected)
claude -p "analyze" --tools "Read,Grep,Glob"

# Block specific commands (denylist)
claude -p "refactor" --disallowedTools "Bash(rm:*),Bash(sudo:*)"

# Pipe-based review
git diff main | claude -p "security review" --model haiku --max-budget-usd 1.00
```

**CI tip:** combine `--max-budget-usd`, `--max-turns`, and an explicit `--model` so failed or underspecified jobs have clear limits.

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Esc` | Stop generation |
| `Esc Esc` | Rewind menu |
| `Shift+Tab` | Cycle through manual, auto-accept, plan, and auto mode when available |
| `Ctrl+S` | Stash the current draft; press again on an empty prompt to restore it |
| `Ctrl+B` | Send the current shell command to the background |
| `Ctrl+R` | Interactive history search |
| `Ctrl+T` | Toggle task list visibility |
| `Ctrl+O` | Open the transcript viewer |
| `Ctrl+V`; `Cmd+V` in iTerm2; `Alt+V` on Windows/WSL | Paste an image |
| `!command` | Run a shell command without Claude interpreting it |
| `@path` | Add a file or directory to the prompt |
| `Alt+P` | Switch models without losing typed input |
| `Alt+T` | Toggle extended thinking for the session |
| `Ctrl+C Ctrl+C` | Exit Claude Code entirely |

---

[← Back to main page](/docs/)

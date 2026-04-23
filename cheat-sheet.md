---
title: Cheat Sheet for Claude Code
nav_order: 4
---

# Cheat Sheet for Claude Code

A printable reference attendees can take home. One page (ish), organized by "what problem am I solving right now."

## 🔎 Session hygiene

| Command | Description |
| --- | --- |
| `/help` | List every command in your setup |
| `/clear` | Wipe conversation (CLAUDE.md stays) |
| `/compact [focus]` | Summarize conversation with optional focus instructions |
| `/context` | Visualize context window usage |
| `/recap` | Context summary when returning to a session |

## 💰 Cost awareness

| Command | Description |
| --- | --- |
| `/cost` | Token spend (API users) |
| `/stats` | Plan usage (Pro/Max) |
| `/insights` | Monthly HTML usage report |
| `/model [name]` | Switch model: opus, sonnet, haiku |
| `/effort [level]` | low / medium / high / xhigh / max |
| `/fast [on\|off]` | Toggle speed-optimized API settings |

## 🧠 Memory & project setup

| Command | Description |
| --- | --- |
| `/init` | Generate starter CLAUDE.md |
| `/memory` | Edit CLAUDE.md files |
| `/permissions` | View/update permission rules |
| `/config` | Open settings |

## ✍️ Writing better prompts

| Command | Description |
| --- | --- |
| `/plan` or `Shift+Tab` | Plan mode (read-only, propose changes) |
| `/ultraplan <prompt>` | Plan in a browser session, execute remotely |
| `@file` | Inline file/directory reference |
| `Alt+T` | Toggle extended thinking for next turn |

## ⚡ Mid-task steering

| Command | Description |
| --- | --- |
| `/btw` | Side question, no context pollution |
| `/copy [N]` | Copy last (or Nth) response to clipboard |
| `Ctrl+S` | Stash current draft; auto-restores after next message |
| `Esc` | Stop generation (NOT Ctrl+C) |
| `Esc Esc` or `/rewind` | Rewind menu — code only, convo only, both, summarize from, or fork (`f`) |
| `/fork` or `/branch` | Branch conversation at current point (aliases; `/branch` is the v2.1.77+ name) |

## 🔍 Review & refactor

| Command | Description |
| --- | --- |
| `/diff` | Interactive diff viewer |
| `/review` | General code review |
| `/security-review` | Scoped security scan |
| `/simplify` | 3-agent review on recent changes |
| `/ultrareview` | Deep multi-pass pre-merge review |
| `/batch <description>` | Parallel worktree agents for migrations |
| `/autofix-pr` | Address PR review comments automatically |

## 🤖 Automation

| Flag / Command | Description |
| --- | --- |
| `--enable-auto-mode` | CLI flag to enable auto mode |
| `--permission-mode auto` | Auto mode for `-p` headless runs |
| `/loop <interval> <prompt>` | Recurring task within session (max 3 days) |
| `/schedule` | Cloud routine (scheduled/API/webhook triggered) |
| `/sandbox` | Opt into file/network isolation runtime |

## 🔌 Extension

| Command | Description |
| --- | --- |
| `/agents` | Manage subagents |
| `/skills` | List/manage skills |
| `/plugin` | Browse plugin marketplaces |
| `/mcp` | Manage MCP servers (GitHub, Jira, etc.) |
| `/hooks` | Lifecycle hooks (PreToolUse, PostToolUse, Stop, Notification) |
| `/install-github-app` | Install Claude GitHub App for PR workflows |

## 📦 Sessions

| Command | Description |
| --- | --- |
| `/resume` | Session picker |
| `claude -c` | Resume most recent (from shell) |
| `claude --resume <id>` | Resume specific session by ID |
| `claude -r "name"` | Resume by session name |
| `/rename my-feature` | Rename current session |
| `/branch` (aliased `/fork`) | Fork into a parallel conversation at the current point |
| `claude -c --fork-session` | Resume most recent but fork into a new session ID |
| `/export` | Export session to file/clipboard |
| `/color <name>` | Prompt-bar color (useful for side-by-side sessions) |

## 🛠️ Useful CLI flags for CI

```bash
# Hard cost cap — ALWAYS use in CI
claude -p "review this" --max-budget-usd 2.00

# Limit agentic turns
claude -p "fix the bug" --max-turns 3

# Cheapest model for mechanical CI work
claude -p "lint check" --model haiku

# Fallback when primary is overloaded
claude -p "review" --fallback-model haiku

# Restrict tool access (allowlist)
claude -p "analyze" --tools "Read,Grep,Glob"

# Block specific commands (denylist)
claude -p "refactor" --disallowedTools "Bash(rm:*),Bash(sudo:*)"

# Pipe-based review
git diff main | claude -p "security review" --model haiku --max-budget-usd 1.00
```

**CI safety rule:** every Claude Code invocation in a pipeline gets `--max-budget-usd` + `--max-turns` + an explicit `--model`. Without all three, a bad prompt can drain a monthly budget in a single failing run.

## ⌨️ Keyboard shortcuts worth memorizing

| Shortcut | Action |
| --- | --- |
| `Esc` | Stop generation |
| `Esc Esc` | Rewind menu |
| `Shift+Tab` | Cycle: normal → auto-accept → plan mode |
| `Ctrl+S` | Stash current draft |
| `Ctrl+B` | Background the current bash command |
| `Ctrl+R` | Interactive history search |
| `Ctrl+T` | Toggle task list visibility |
| `Ctrl+O` | Toggle verbose transcript |
| `Ctrl+V` | Paste image (NOT Cmd+V) |
| `!command` | Run bash directly without Claude interpreting |
| `@path` | Inline file/directory reference |
| `Alt+P` | Switch model (preserves typed input) |
| `Alt+T` | Toggle extended thinking |
| `Ctrl+C Ctrl+C` | Exit Claude Code entirely |

---

[← Back to main page](.)

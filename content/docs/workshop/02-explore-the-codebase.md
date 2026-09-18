---
title: "Lab 2: Explore the codebase"
weight: 2
---

## Overview

Your app is running. In this lab, you'll use subagents to explore the codebase and explain how it works.

You'll see how they use tools to find and read code. You'll check key details against the source and ask follow-up questions if anything is unclear.

We'll save the overview in `codebase-overview.md` for later labs. In everyday coding, it can stay in chat unless you want to reuse or share it.

## Before you begin

Continue from [Lab 1: Get running](/docs/workshop/01-get-running/):

- Leave the app running in your first terminal.
- Keep Claude Code, or your chosen harness, open in the project folder in your second terminal.

## Step 1: Ask for a codebase overview

> **Required concept:** Read [Working with subagents](/docs/agentic-coding-in-terminal/#working-with-other-agents-sub-agents--agent-teams).

Paste this into your coding agent:

```text
Use subagents to give me an overview of this codebase:
the architecture, key directories, and how the pieces connect.

Don't change any files.
```

## Step 2: Follow the tools

> **Required concept:** Read [Built-in tools](/docs/agentic-coding-in-terminal/#selected-built-in-tools).

While the subagents investigate, open the task list in Claude Code:

```text
/tasks
```

![Claude Code task list showing background agents](/images/lab-2-subagent-tasks.png)

Select a running subagent to inspect its tool calls and results. Look at how it finds relevant files and reads the code.

Here are examples of tools used to explore a codebase:

| Tool | Example use |
| --- | --- |
| `Agent` | Ask a subagent to trace how transactions are added. |
| `Glob` | Find JSX files with `src/**/*.jsx`. |
| `Grep` | Search for `setTransactions` to find where transaction data changes. |
| `Read` | Read `src/App.jsx` to understand the app's logic. |
| `Bash` / `PowerShell` | List project files or search code using shell commands. |

A file search might appear as a `Grep` call or a shell command. You don't need to see every tool in the table.

If a command requests approval, check that it fits the read-only investigation.

## Step 3: Review the overview

> **Required concept:** Read [Prompt style](/docs/agentic-coding-in-terminal/#prompt-style).

Once the subagents finish, read the overview. Ask follow-up questions if anything is unclear.

For example:

```text
Show me the code behind the totals and filters.
Why do the totals stay the same when I filter the list?
```

Then check the explanation against the code:

1. Open `src/App.jsx` in your editor.
2. Find `totalIncomeCents`, `totalExpensesCents` and `filteredTransactions`.
3. Check which transaction data each calculation uses.

The totals use all transactions; the table displays the filtered transactions.

Save the overview for later labs:

```text
Save the overview we discussed, including our clarifications,
in codebase-overview.md. Don't change other files.
```

## Checkpoint

- [ ] I can explain the main parts of the app and how they connect.
- [ ] I've observed subagent tool calls and checked an explanation against the code.
- [ ] `codebase-overview.md` contains the reviewed overview and any clarifications.
- [ ] The app's code is unchanged.

## What's next

In [Lab 3: Manage context and project instructions](/docs/workshop/03-manage-context-and-project-instructions/), you'll inspect your agent's context and write project-specific guidance in `CLAUDE.md`.

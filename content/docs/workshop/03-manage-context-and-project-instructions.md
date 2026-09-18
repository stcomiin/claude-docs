---
title: "Lab 3: Manage context and project instructions"
weight: 3
---

## Overview

You've explored the app. Now you'll inspect the context your agent is using and add instructions for future conversations.

You'll check context usage, customize the status line and create a short `CLAUDE.md` with project-specific guidance.

`codebase-overview.md` describes how the app works. `CLAUDE.md` tells the agent how to work on it.

## Step 1: Inspect your context

> **Required concept:** Read [Context commands](/docs/agentic-coding-in-terminal/#commands-for-keeping-context-healthy).

Continue in the Claude Code session from [Lab 2: Explore the codebase](/docs/workshop/02-explore-the-codebase/). Enter:

```text
/context
```

Look at the total usage and the breakdown for messages, tools and instructions.

Open the [context-window simulation](https://code.claude.com/docs/en/context-window) from Claude Docs to visualise how a conversation fills the context window.

## Step 2: Customise the status line

> **Required concept:** Read [Status line customisation](/docs/agentic-coding-in-terminal/#1-ccstatusline).

> **Using another CLI?** See [Codex's `/statusline`](https://learn.chatgpt.com/docs/developer-commands?surface=cli#configure-footer-items-with-statusline), [Pi's built-in footer](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md#interactive-mode) or [OpenCode's TUI settings](https://opencode.ai/docs/tui/#configure).

Set this up once for your user account. It applies across your Claude Code projects.

Open a temporary terminal and run:

```sh
npx -y ccstatusline@2.2.29
```

1. Select **Edit Lines**, then the first line.
2. Add or keep **Model**, **Context %** and **Git Branch**. Arrange them as you prefer.
3. Return to the main menu and select **Install to Claude Code**, then **Pinned global install**, then **npm**. Review the install command and user-settings path before confirming.
4. Choose **Save & Exit**.

If you already use `ccstatusline`, edit and save your existing layout instead of reinstalling it.

Return to Claude Code and check that the status line shows your model, context usage and current branch. You can close the temporary terminal.

## Step 3: Write project instructions

> **Required concept:** Read [CLAUDE.md and AGENTS.md](/docs/agentic-coding-in-terminal/#claudemd-and-agentsmd).

If your project already has a `CLAUDE.md` or `AGENTS.md`, review it before making changes. Check which instructions still apply and which need updating. Otherwise, create the appropriate file in the project root. For Claude Code, use `CLAUDE.md`.

Here are some sample rules you can add:

```markdown
- Browser-test UI changes before reporting them complete.
- Don't commit until lint, tests and build pass.
- Tests must catch breakage. Never weaken them just to make them pass.
```

Avoid repeating codebase details in your instructions. The agent can find that information in the code and existing documentation.

Keep only instructions the agent wouldn't otherwise know, such as custom project conventions. Also record corrections for things it forgets or repeatedly gets wrong, to help prevent the same mistakes in future sessions.

## Checkpoint

- [ ] I've inspected context usage with `/context`.
- [ ] My status line shows the model, context usage and current Git branch.
- [ ] I've reviewed the instructions in my project's `CLAUDE.md` or `AGENTS.md`.

## What's next

In [Lab 4: Interview phase](/docs/workshop/04-interview-phase/), your agent will interview you about the feature. You'll review the resulting specification, convert it into tickets and publish them to your project's issue tracker.

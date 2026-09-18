---
title: "Lab 3: Manage context and project instructions"
weight: 3
---

## Overview

You've explored the app. Now you'll inspect the context your agent is using and add instructions for future conversations.

You'll check context usage, customize the status line and create a short `CLAUDE.md` with project-specific guidance.

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
2. Add or keep **Model**, **Thinking Effort**, **Context Length**, **Context %**, **Session Cost**, **Current Working Dir** and **Git Branch**. You can split these widgets across multiple lines and arrange them as you prefer.
3. Return to the main menu and select **Install to Claude Code**.
4. Choose **Pinned global install**, then **npm**. This installs `ccstatusline@2.2.29` for use across projects and adds the status-line command to your Claude Code user settings. The version stays fixed until you update it. Review the install command and settings path before confirming.
5. Choose **Save & Exit**.

Return to Claude Code and check that your chosen widgets appear in the status line. You can close the temporary terminal.

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

Keep only instructions the agent wouldn't otherwise know, such as custom project conventions. Also include instructions for things the agent keeps forgetting and repeatedly gets wrong, to help prevent the same mistakes in future sessions.

## Checkpoint

- [ ] I've inspected context usage with `/context`.
- [ ] My status line shows the model, thinking effort, context usage, session cost, working directory and Git branch.
- [ ] I've reviewed the instructions in my project's `CLAUDE.md` or `AGENTS.md`.

## What's next

In [Lab 4: Interview phase](/docs/workshop/04-interview-phase/), your agent will interview you about the feature. You'll review the resulting specification, convert it into tickets and publish them to your project's issue tracker.

---
title: "Lab 5: Implementation"
weight: 5
---

## Overview

In this lab, you'll create a feature branch and learn how to use hooks in your workflow.

You'll configure and test a hook, then use Matt Pocock's `/implement` skill to implement the first monthly-budget ticket. The skill uses test-driven development where possible.

## Step 1: Create a feature branch

In the Claude Code session for your expense tracker, enter:

```text
Create and switch to a feature branch following the `feature/[ID]-short-description` branch naming convention to target issue #1.
```

## Step 2: Configure and test the hook

> **Required concept:** Read [Hooks](/docs/agentic-coding-in-terminal/#hooks).

For this workshop, you'll configure an auto-formatting hook in Claude Code. It runs Prettier after Claude uses `Edit` or `Write`, so you don't need to run the formatter manually.

The hook uses a small Node.js script to read the edited file's path and run Prettier on that file. It does not run when you save a file manually.

The hook configuration below is based on [Claude Code's auto-formatting example](https://code.claude.com/docs/en/hooks-guide#auto-format-code-after-edits).

### Check the required tools

Open a temporary terminal at the project root.

```bash
node --version
npm ls --depth=0 prettier
```

The commands must show Node.js 22.12 or later within version 22, and `prettier@3.9.7`.

### Add the hook manually

Create `.claude/hooks/format.mjs` at the project root. Create the directories if needed. If that file already exists, inspect it before making changes.

For example, on Windows your project root might be `C:\Users\user123\projects\expense-tracker-workshop-starter`. The script's full path would be:

```text
C:\Users\user123\projects\expense-tracker-workshop-starter\.claude\hooks\format.mjs
```

Use the folder where you cloned your own fork.

Paste this script into the file:

```javascript
import { readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";

try {
  const { tool_input } = JSON.parse(readFileSync(0, "utf8"));
  if (typeof tool_input?.file_path !== "string" || !tool_input.file_path.trim()) {
    throw new Error("Expected tool_input.file_path in hook input.");
  }
  const root = realpathSync(process.env.CLAUDE_PROJECT_DIR);
  const file = realpathSync(resolve(root, tool_input.file_path));
  const localPath = relative(root, file);
  if (isAbsolute(localPath) || localPath === ".." || localPath.startsWith(`..${sep}`)) {
    process.exit(0);
  }
  if (!statSync(file).isFile()) process.exit(0);

  const result = spawnSync(
    process.execPath,
    [join(root, "node_modules/prettier/bin/prettier.cjs"),
      "--write", "--ignore-unknown", "--no-error-on-unmatched-pattern", "--", file],
    { cwd: root, stdio: ["ignore", "inherit", "inherit"] },
  );
  if (result.error) throw result.error;
  process.exit(result.status === 0 ? 0 : 2);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}
```

The script formats only files inside this project. It calls the installed Prettier package, which respects ignore rules and skips unsupported filetypes.

Open `.claude/settings.json` at the project root. Create the file if it does not exist.

Using the same Windows project-root example, the settings file's full path would be:

```text
C:\Users\user123\projects\expense-tracker-workshop-starter\.claude\settings.json
```

Add the following configuration. If the file already has settings or hooks, merge this entry without replacing them.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/format.mjs"]
          }
        ]
      }
    ]
  }
}
```

Copy `${CLAUDE_PROJECT_DIR}` exactly as written, including `${` and `}`. You do not need to replace it with your own path. When the hook runs, Claude Code substitutes the full path of your project root.

Claude Code also passes the hook input to the script as JSON. The hook uses the `PostToolUse` event with an `Edit|Write` matcher, so it runs only after file-editing tools, not when you save a file manually.

> [!NOTE]
> **Configuration locations for other tools**
>
> These locations are references, not additional exercises. The tools use different configuration formats. Do not copy the Claude Code JSON into them.
>
> | Tool | Project-local location | User-wide location |
> | --- | --- | --- |
> | [Codex hooks](https://developers.openai.com/codex/hooks/) | `.codex/hooks.json` | `~/.codex/hooks.json` |
> | [OpenCode plugins](https://opencode.ai/docs/plugins/) | `.opencode/plugins/` | `~/.config/opencode/plugins/` |
> | [Pi extensions](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md) | `.pi/extensions/` | `~/.pi/agent/extensions/` |
>
> Codex also supports `[hooks]` in `.codex/config.toml` or `~/.codex/config.toml`.
>
> OpenCode has [built-in formatters](https://opencode.ai/docs/formatters/). Enable them with `"formatter": true` in `opencode.json` instead of adding a formatting plugin.
>
> Pi uses TypeScript extensions. Run `/reload` after adding an extension.

### Check the configuration and test the hook

Inspect `.claude/hooks/format.mjs` and `.claude/settings.json`. Confirm that they match the script and hook entry above, that existing settings remain in place, and that no unrelated files changed.

Exit Claude Code. From the project root in Terminal 2, run:

```bash
claude --continue
```

Enter `/hooks`. Confirm that the project has a `PostToolUse` hook matching `Edit|Write` and that it launches `node` with the script path above.

Ask Claude:

```text
If format-check.json already exists, stop without changing it.
Otherwise, use Write to create it containing exactly {"hook":true}.
Do not run Prettier manually. Stop after writing the file.
```

Inspect the `Write` call to confirm that Claude supplied the unformatted JSON. Then open `format-check.json` without editing it. It should contain:

```json
{ "hook": true }
```

The spaces show that the file changed after the `Write` call. If the file remains unformatted, check the hook entry and any hook errors. Confirm that the script exists at the configured path. Run the prerequisite checks in the terminal used to start Claude Code. Resolve the problem before continuing.

After the test passes, ask Claude to remove the temporary file. Inspect the working-tree changes again before starting the first ticket.

## Step 3: Implement the first ticket via `/implement`

For this workshop, complete only the first ticket in your plan. In our example, this is ticket #1, Budget CRUD & Display. Use the issue number or URL from your own fork.

Implement the ticket on the feature branch created in Step 1, following the `feature/[ID]-short-description` naming convention.

Use a fresh Claude Code conversation for this ticket, as [recommended](https://www.aihero.dev/skills-implement). Make sure the ticket and any needed interview decisions are accessible outside the previous conversation.

This example uses GitHub Issues. If you use a local issue tracker, point the agent to that ticket instead.

The `/implement` skill runs checks, reviews the work and commits changes to the current branch.

```text
/mattpocock-skills:implement #1
```

Run these checks from the project root after the agent finishes the ticket:

```bash
npm test
npm run lint
npm run build
```

Check the completed work against that ticket's acceptance criteria. Inspect the committed changes, including new files, and confirm that the checks passed.

The first ticket must include tests for its behaviour. Do not postpone those tests to a later test-suite ticket.

In the interest of time, we will only be going through the first ticket. If you are faster, you can finish the remaining tickets during the workshop.

## Checkpoint

- [ ] I'm working on the feature branch created in Step 1, following the `feature/[ID]-short-description` naming convention.
- [ ] The formatting hook formatted the test file after Claude's `Write` call.
- [ ] I've checked the first ticket against its acceptance criteria and inspected its committed changes.
- [ ] `npm test`, `npm run lint` and `npm run build` passed after that ticket.

## What's next

In Lab 6, you'll use Chrome DevTools MCP to verify the behaviour implemented in your first ticket and inspect the page's appearance. You'll turn the checks you performed into a reusable `visual-code-review` skill.

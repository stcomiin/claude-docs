---
title: Agentic Coding in Terminal
weight: 2
---

**Apex Builders Collective** × **Info PC** • April 2026

[Pre-Workshop Setup Guide](/docs/setup-guide/)


## Installation & Configuration

> For step-by-step installation instructions (API key setup, Claude Code, Codex, Matt Pocock's skills), see the **[Pre-Workshop Setup Guide](/docs/setup-guide/)**.

### Claude Products Overview

**What are the differences between model subscriptions VS API-billing?**


- There are various subscription tiers for usage-based plans, which are Pro($20 USD), Max 5X($100 USD) and Max 20X($200 USD). Refer to [https://claude.com/pricing](https://claude.com/pricing) for more details. The actual dollar amount of LLM usage derived from the subscription plans are way higher than the equivalent money cost incurred through the Anthropic API.
- Every input/output message and tool call consumes tokens, which translates directly to cost and latency.
- API billing: pay per token. Flexible but expensive at agentic-coding volumes; easy to burn $100+ in a single long session with frontier models.
- Subscription (Claude Pro/Max, ChatGPT Pro): flat monthly fee with two usage caps you need to know:
    - Session/block limit: a rolling window (e.g. a 5-hour block) that resets automatically
    - Weekly limit: the hard ceiling across all your blocks in a 7-day window
        
        > 💡 **Third-party providers don't expose these limits the same way.** If you're routing Claude through a non-Anthropic provider, `/usage` won't show meaningful numbers: that reporting is only available on official subscriptions and API access.
            
- **Practical token tips**:
    - Check token usage in your AI gateway dashboard if running at scale or via API (doesn't apply for our case)
    - A five-minute cache write costs 1.25× the base input price; a cache hit costs 0.1×. You pay the write rate when content is first cached and the read rate when a later request reuses it. Continuing within the cache window can therefore reduce cost.
    - Different frontier models tokenize differently and may be more/less efficient, so for an accurate cost comparison, compare the cost of a completed task and not just the raw per-million-token cost.

### Why Claude Code (CC) vs other agentic harnesses?

When this workshop was first conducted in April 2026, Claude Code was clearly out in front. The lead is smaller now as other harnesses like Codex, OpenCode, KiloCode, Pi, and Antigravity-Cli have all caught up quickly, and a few are very good now. The harness is just like an IDE where you interact with the model, each harness offers various ways to get your customised workflow. 

We believe that Claude Code is still the deepest and most heavily engineered harness which just works well out of the box without much customisation, but that also means that the starting context length is bloated. With minimal harnesses, the starting context is much shorter but more customisation needs to be done beforehand to set it up well for an optimal experience.

Some notable features of Claude Code:
- Dynamic workflows and subagent execution, so one session can run many agents in parallel
- Much better management view of current subagents that are running compared to codex
- Memory that persists across sessions
- The biggest ecosystem of Skills, plugins, and MCP servers
- ...

That depth is a tradeoff. All the built-in features are powerful if you use them, and just bloat if you don't. Minimalist harnesses like Pi go the other way: a small, customisable core that feels faster to work in.

While the depth of built-in features is indeed powerful if you use them well, they can very easily be bloat if they do not fit your agentic coding workflow. Others have also found similar or even greater success in more minimalistic, highly customisable harnesses like Pi with little to no out-of-the-box features. The right harness for you really depends on how you actually work.

Claude Code also tends to ship these things first, and the rest of the field catches up later:

- [Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (introduced by CC in Oct 2025, now proliferated to other harnesses and OpenClaw as well)
- CLAUDE.md (introduced by CC on launch in Feb 2025, now proliferated to Codex/other harnesses as AGENTS.md and OpenClaw as well)
- [MCP](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation) (introduced by Anthropic in Nov 2024, donated to the Linux Foundation in Dec 2025)

### Useful Claude Code Commands

Before we go deeper, here are some commands / CLI flags that are useful.

| Command | What it does |
| --- | --- |
| `/help` | Lists every command available in your setup: built-in, custom, plugin, and MCP-provided |
| `/init` | Scans the repo and generates a starter `CLAUDE.md`. DO NOT USE THIS. |
| `/clear` | Wipes conversation history (CLAUDE.md stays loaded). Use when switching tasks or when you find that the context is filling up. This should be your most used command. Always start fresh whenever possible. |
| `/model [name]` | Switch model mid-session: `opus`, `sonnet`, `fable`, `haiku`, or a full ID like `claude-fable-5-1` |
| `/usage` | Shows usage and limits. `/cost` and `/stats` remain available as aliases. |
| `/resume` | Pick up a previous session. `claude -c` from the shell resumes the most recent. e.g `claude --resume <some-session-id>` |
| `Esc` | Stop Claude mid-action. |
| `Ctrl+U` / `Ctrl+Y` | Cut the current input / paste it back |
| `Ctrl+S` | Prompt stashing - best for when you're mid-prompt and need to ask something else first. Press `Ctrl+S` again on an empty prompt to bring the stash back. |
| `Esc Esc` (Empty prompt) | Open the rewind menu (selective: code only, conversation only, or both). You can also use `/rewind` |
| `@filepath` | Reference a file or directory inline: `@src/auth/login.ts fix the JWT check` |
| `!<command>` | Run a terminal command and passes the results of the command to the session |

**One-liner to remember:** type `/` on an empty prompt to see everything available in your setup, including custom and MCP commands. You'll rarely need to memorize a full list.

## Stop/Resume/Continue Claude Code conversations

| Action | Command | Remarks |
| --- | --- | --- |
| Resume a previous conversation | `claude --resume`  which will show a list of previous conversations to resume from in this current folder, OR `claude --continue` which will auto continue from the last stopped conversation in this current folder | you can also append additional flags to these resume and continue commands for eg. `claude --continue --dangerously-skip-permissions --effort max --model claude-sonnet-5` |
| Exit a conversation | Ctrl + C until session exits | All session history is stored as transcript files in .claude folder in User Directory. `~/.claude/projects/<folder name>` |

### Useful Claude Code Customisation

#### 1. ccstatusline
    
Use ccstatusline to keep the session metrics you care about in the status bar.
GitHub *repo:* https://github.com/sirmalloc/ccstatusline

```bash
npx -y ccstatusline@latest
```

Install ccstatusline via npx

Sample Config:

Line 1:  Model | Context Length | Context % (usable) | Git Branch | Skills | Thinking Effort 

![ccstatusline sample](/images/statusline-sample.png)

- Installation step by step:
    1. Run `npx -y ccstatusline@latest` and select `Edit Lines` option (via pressing enter)
        
        ![Step 1](/images/statusline-step1.png)
        
    2. Select which line to add 
        
        ![Step 2](/images/statusline-step2.png)
        
    3. Decide where to put (tip: use Separator to cleanly separate widgets)
        
        ![Step 3](/images/statusline-step3.png)
        
    4. Press (a) to add via picker and start typing to search (e.g thinking)
        
        ![Step 4](/images/statusline-step4.png)
        
    5. Press `Esc` to return to Main Menu and select enter on `Install to Claude Code` or `Save & Exit` option
        
        ![Step 5](/images/statusline-step5.png)
            
#### 2. Changing Output Style
    
The default prose style of Claude models is overly convoluted and full of AI-slop. You can tweak how the model replies by setting an output style. Five styles are built in: Default, Proactive, Concise, Explanatory, and Learning. Proactive makes Claude act on routine decisions instead of pausing to ask, which goes further than the guidance auto mode adds, while your permission mode still decides what runs without approval. Concise leads with the result and skips the narration (v2.1.237+). You can also add custom styles: create a markdown file and place it in `~/.claude/output-styles`, or in `.claude/output-styles` inside a project.

One such custom style that can be used is pstack's [unslop skill](https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md). Add an extra front-matter field in the file `keep-coding-instructions: true` to preserve software engineering parts of the system prompt.

Then reload the Claude Code session and enter the command below to activate the style. The standalone command was removed in v2.1.91 and came back in v2.1.269; on older versions, pick the style under **Output style** in `/config`:

```
/output-style unslop
```

A style switch applies from your next message (v2.1.251+). To make a style the default, set it in `settings.json`:

```
{
  "outputStyle": "unslop"
}
```


#### 3. Windows Toast Notification 
    
Native Windows toast notifications for Claude Code hook events. Shows which project triggered the notification so you can find the right VS Code window when running multiple sessions.

See guide: https://github.com/stcomiin/claude-helpers

Sample: 

![Toast notification sample](/images/statusline-toast.png)
    
---

## Context & Memory

Agentic coding tools like Claude Code maintain context across a session, but understanding **where** memory lives, and how to shape it, is key to getting consistent, high-quality results.

{{< figure src="/images/context-engineering.png" width="2292" height="1290" loading="lazy" alt="A single prompt produces a response; an agent repeatedly selects instructions, documents, tools, memory, and history, then feeds tool results into the next turn." caption="Context engineering means selecting what the model sees at each turn." attr="Anthropic" attrlink="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" >}}

### CLAUDE.md and AGENTS.md

- **`CLAUDE.md`** is a special file Claude Code reads automatically when it starts in a project. Use it to encode persistent instructions: coding conventions, architecture decisions, preferred libraries, things Claude should never do, and so on. The contents of this is injected at the start of the conversation, in one of the many system prompts.
- **`AGENTS.md`** serves a similar purpose for other agent runtimes (e.g. OpenAI Codex). If you're working across multiple agents, keeping the two in sync (for example with a symlink) is good practice.
- **Claude Code reads `CLAUDE.md`, not `AGENTS.md`, directly.** If another tool already uses `AGENTS.md`, import it from `CLAUDE.md` with `@AGENTS.md` or link the two files with `ln -s AGENTS.md CLAUDE.md`. `/init` reads existing Cursor and Copilot rule files by default; with `CLAUDE_CODE_NEW_INIT=1`, it also incorporates `AGENTS.md` and `.windsurfrules`.
- Think of these files as your **onboarding doc for the AI**, the same way you'd brief a new contractor on how your codebase works, but not quite. Normally briefs would be done using actual documentation. CLAUDE.md is more for project specific stuff.
- Good things to put in `CLAUDE.md`:
    - Test framework and how to run tests
    - Linting / formatting rules
    - Anything the agent keeps getting wrong
- CLAUDE.md is not the magic pill. In long conversations, instructions tend to not be followed well. Compare the typical length of CLAUDE.md to your typical conversation length (few hundred tokens to 50k tokens)
- **Do not use /init to initialize the CLAUDE.md**. Automatically generated files are overly verbose and may harm model performance. Only add things specific to your codebase that the agent should be aware of. If something is general knowledge, assume the model knows it. Reinforce in CLAUDE.md only if the model does not remember or repeatedly does something wrong.
    - If you write one by hand, keep it tight: specific build commands, test runners, and hard constraints only. Skip codebase overviews (agents discover structure on their own just as well, or ask it to use codebase graph DB MCPs covered below)
    - **Paper that discusses auto-generated context files - Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?** [https://arxiv.org/abs/2602.11988](https://arxiv.org/abs/2602.11988)
- Example of actual CLAUDE.md from Opus 4.6 days

```markdown
## TOP RULES

- Always use MAXIMUM thinking effort
- Always use Opus for all agents and subagents
- Keep code minimum, viable simple but clean. YAGNI, DRY, KISS, do not overcomplicate modules with convoluted classes.
- Always run slash command `/simplify` at the end of every extensive refactor or new feature phase, before any commit
- Use chrome devtools mcp server to verify all UI related changes work as expected
- Always update ALL RELEVANT DOCUMENTATION MARKDOWNS in the repo when you have made a new change anywhere or after implementing new features or changing current features
- Do not commit anything until verification of work is done
- Always fix all existing issues even if they are not from your changes

## The #1 Rule of E2E Tests

- A test MUST fail when the feature it tests is broken. No exceptions. If a real user would see something broken, the test must fail. No "fixing the app inside the test". A passing test that hides a broken feature is worse than no test at all.
```

#### CLAUDE.md tiers: User, Project, Local

CLAUDE.md has three possible locations

| Scope | What it covers | Where it lives |
| --- | --- | --- |
| **User** | Preferences across all your projects (e.g. tone, formatting habits) | Global config (~/.claude/claude.md) |
| **Project** | Instructions specific to this repo (e.g. stack, conventions) | `CLAUDE.md` in repo root |
| **Local** | Overrides just for your machine (e.g. local paths, secrets) | `CLAUDE.local.md` |

Use **project memory** for anything the whole team should share. Project specific settings must be committed to the repo's CLAUDE.md

Use **local memory** for anything personal or environment-specific that shouldn't be committed.

Claude Code has some built-in skills to manage CLAUDE.md

1.  `/claude-md-management:revise-claude-md`  - Run this slash command in a specific session when you find something that should be updated for future sessions
2. `/claude-md-improver` - Use this slash command when wanting to add general stuff to the CLAUDE.md

#### Hands-on: Craft Your CLAUDE.md (10 minutes)

Now that you understand how context and memory work, let's put it into practice. Open the CRUD app you built earlier and create a `CLAUDE.md` file in the project root.


Test it out! Prompt Claude Code to add a feature. Check whether it follows the rules that you set. If it doesn't, tweak the file. 

> 😜 Example md file: "Always reply in Singlish!" 

### Compaction & Context Window Management

![Prompt caching across turns: each turn resends the full context, the unchanged prefix reads from cache, and changing the system prompt reprocesses everything after it](/images/prompt-caching-prefix.svg)

- LLMs have a finite context window. In long sessions, older conversation turns get summarised ("compacted") to free up context, which is not desirable.
- What goes into the context? Visualize it - [https://code.claude.com/docs/en/context-window](https://code.claude.com/docs/en/context-window)
- [Claude Code History Viewer](https://github.com/jhlee0409/claude-code-history-viewer) lets you browse past sessions and project statistics. Install the MSI from the [latest release](https://github.com/jhlee0409/claude-code-history-viewer/releases). Despite the name, it also reads sessions from tools such as Codex and reports token usage.
- Do not let conversations get to the point where your conversation needs to be compacted. Always `/clear` around 300k context if possible. Claude models have 1M context now by default but performance still degrades in longer context, no matter how good they say it is.
- **Do not use the compaction feature in Claude Code**. Compaction is simply passing the chat history to a model and asking it to summarize the history. The session then continues from that summarized conversation, which is lossy and important details gleaned over the session may be stripped out.
- Codex running on OpenAI frontier model handles compaction and long term attention well, unknown if it's due to the harness or the model. Using compaction is fine in Codex from our experience
- Claude Code handles the context window automatically (that's the whole point of CC: context engineering for agentic tasks), but you can influence it in some ways:
    - Always start a **new session** for any task that is not related to your current session.
    - Use `/clear` to reset context without restarting (when hitting ~300k context)
    - Keep `CLAUDE.md` tight and relevant: it's loaded at the start of every session, so bloating it costs precious tokens
    - Use the `/handoff` skill from Matt Pocock to generate a handoff document when exceeding the smart zone context limit https://github.com/mattpocock/skills/blob/main/skills/productivity/handoff/SKILL.md
    - Or, Just ask it to create a handoff document. 
    ```
    Create a detailed handoff file with the remaining tasks and context that is needed for another coding 
    agent session to continue from where you have left off. 
    Be as detailed as possible with the explicit requirements and verification required
    ```
    - Use /context to check what's in your current context
- If the agent starts "forgetting" earlier decisions or stops following rules in `CLAUDE.md`, it's often a sign the model is way past its smart zone, create a handoff document and continue in a new session

### Commands for keeping context healthy

| Command | What it does |
| --- | --- |
| `/clear` | Wipe conversation entirely. CLAUDE.md stays loaded. Use when switching to an unrelated task |
| `/context` | Visual grid showing how your context window is allocated |
| `/compact [focus]` | Compress conversation into a summary. Pass focus instructions to steer what's preserved. **Do not use in Claude Code**. |



### Model Drift (Models do get dumber sometimes, it's not just you)

- The models being served by model providers can silently change behind the scenes. Anthropic was doing active A/B testing of various harness, usage settings and even the actual model being served (Opus 4.6 requests were routed to 4.7 on the day of 4.7 release)
- There was a noticeable decline in the performance of Opus 4.5 right before the launch of 4.6, and similarly for 4.7. [https://marginlab.ai/trackers/claude-code/](https://marginlab.ai/trackers/claude-code/) to track the average pass rate of Opus on SWE tasks
- The issue with using cloud providers is that you never know what is the exact quant and inference quality of the model being served. Models can be silently replaced with much quantised versions, or there can be inference engine bugs. Read below for a postmortem by Anthropic on their quality degradation issues.

{{< bookmark url="https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues" title="A postmortem of three recent issues" description="This is a technical report on three bugs that intermittently degraded responses from Claude. Below we explain what happened, why it took time to fix, and what we're doing to prevent similar issues." icon="https://www.anthropic.com/favicon.ico" image="/images/anthropic-postmortem-og.png" >}}

## Giving Better Inputs

The quality of your prompt is the biggest lever you have on output quality. These features and techniques help you give the agent exactly what it needs to succeed.

### Prompt Style

- Do not use emotion when responding to the model for coding tasks, like "Why are you so stupid, just do this xxxxx" or "You're so dumb, do it properly now". From our experience this tends to disrupt the output quality of the model for code.
- Narrate all requirements and details thoroughly in the prompt if already known, voice mode helps
- [Provide specific context](https://code.claude.com/docs/en/best-practices#provide-specific-context-in-your-prompts). Including an explicit success condition (passing tests, a specific output, a diff that meets a criterion) lets the agent self-verify and reduces back-and-forth.


### Modes

#### Planning


- Before Claude starts writing or changing code, ask it to **plan first**: `"Think through the approach before making any changes."`
- In Claude Code, you can explicitly enter **plan mode** to get a structured breakdown of what it intends to do. Review it, push back, then approve execution.
- Besides the in-built plan mode, there are other planning skills or workflows that could be used, like [`/grill-with-docs`](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs) from Matt Pocock's skills repo.
- A good plan includes: what files will be changed, what the success condition looks like, and any risks or unknowns.
- Press `Shift+Tab` to cycle through `default`, `acceptEdits`, and `plan`. If auto mode is available for your account, it appears as a fourth option.

#### Auto Mode & Automation

**Commands for running Claude with fewer interruptions**

- The default "approve every action" flow is safe but slow, while `--dangerously-skip-permissions` is fast but genuinely dangerous. Auto Mode is the middle path.
- Auto mode appears in the `Shift+Tab` cycle if it is available for your account: `default → acceptEdits → plan → auto`.
    
    ```bash
    # Start a session directly in auto mode
    claude --permission-mode auto
    
    # For scripted / headless runs
    claude -p "refactor the auth module" --permission-mode auto
    
    # Remove custom auto-mode classifier rules from user settings
    claude auto-mode reset
    ```

To make auto mode the default, put this in `~/.claude/settings.json`:

```json
{
  "permissions": {
    "defaultMode": "auto"
  }
}
```

Only user settings can select auto mode as the default; project and local settings cannot. The separate top-level `autoMode` block configures classifier rules. It does not select the permission mode. `claude auto-mode reset` removes that customization block from user settings.

**How it works:**

- **Input layer:** a prompt-injection probe scans tool outputs before they enter Claude's context
- **Output layer:** a classifier model (server-configured, independent of your `/model` choice) evaluates every action before execution
- The classifier is **reasoning-blind**: it sees user messages, tool calls, and your CLAUDE.md, but tool results are stripped, so hostile content Claude reads can't talk it into dangerous actions
- Boundaries you state in conversation ("don't push until I review") are treated as block signals until you explicitly lift them

**Availability:**

- It is available on all plans, and on Team and Enterprise it is on by default. On the Anthropic API it needs Opus 4.6 or later, Sonnet 4.6 or later, or a Fable model. On Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry it needs Sonnet 5, Opus 4.7 or later, or a Fable model. Foundry still defaults to Sonnet 4.5, so switch models there first. Admins can disable it across the organization through managed settings (`disableAutoMode: "disable"`).



Read More: https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode

#### Steering Mid-Task

- Don't wait for the agent to finish before correcting it: **interrupt and redirect** if it's heading the wrong way.
- For **chained tasks** (e.g. with Codex or multi-step pipelines): define clear handoff points and verify outputs at each step before proceeding.
- For Claude Code:
    - `Esc` once to interrupt the current action.
    - `Esc + Esc` to rewind to previous user inputs.

**`Esc Esc` (or `/rewind`): the rewind menu**

Double-tap `Esc` on an empty input to open the rewind menu. Scroll back with `↑` to pick a checkpoint, press `Enter`, and you get a set of options, each with a single-letter shortcut:

| Option | What it does |
| --- | --- |
| **Restore code and conversation** | Roll back both files and chat to this point |
| **Restore conversation only** | Keep files as-is, rewind the chat |
| **Restore code only** | Revert files, keep the conversation intact |
| **Summarize from here** | Condense everything from this point forward, a surgical `/compact` |
| **Never mind** | Cancel and return to where you were |

**The "code only" option** is the most useful option for something like trying an aggressive refactor. After discussing it with Claude and trying out the new code and it doesn't work well, you can keep all the diagnostic conversation intact with this option. Replaces a lot of `git stash` gymnastics.

**/btw** 

- Ask a side question without polluting conversation context. Response is ephemeral, uses cache (cheap), and invokes no tools.
- Perfect for mid-task lookups.
- Able to fork off `/btw` using (`f`)
    - Use `/resume <prev-conversation-id>` to return to original fork point if needed.


### Visual Inputs

- Keystroke: `Alt+V`
- Most AI harnesses accept **screenshots and mockups** as direct inputs for the model: drag in a Figma export, a browser screenshot, or even a hand-drawn sketch.
- Great for: "Make this component look like this", "Why is this UI layout broken?", "Reproduce this UI".
- Combine with `@` file references to point at the code you want changed alongside the visual.

### `@` File / Folder References & `#` Shortcut

- **`@filename`**: bring a specific file or folder into context. More precise than "look at my codebase."
- **`#`**: shortcut for referencing or updating your `CLAUDE.md` instructions mid-session. Use it to update the agent's standing instructions without leaving the conversation: `"# always use named exports from now on"`
- Building the habit of using `@` references makes your prompts faster to write and easier for the agent to act on.

| Command | What it does |
| --- | --- |
| `/plan` or `Shift+Tab` | Enter plan mode: Claude becomes read-only and proposes each change for approval |
| `claude --permission-mode auto` | Start the session directly in auto mode |
| `claude --dangerously-skip-permissions` | Skip all permission prompts (dangerous) |
| `/btw` | Ask a side question without polluting conversation context. |
| `/branch` / `/fork` | `/branch` switches to a new conversation timeline from this point. `/fork` copies the conversation into a background session that gets its own worktree (v2.1.222+) and keeps the prompt cache. |
| `/copy [N]` | Copy last response to clipboard |
| **`Esc + Esc` / `/rewind`** | Rewind menu: code only, convo only, both, summarize from |
| `Alt + v` | Paste Screenshots / images |
| `@file` | Inline file/directory reference |
| `Alt + P` | Switch Model |



## Tools: What Claude Code Can Actually Do

When Claude Code acts on your codebase, it calls **tools**. Tools that only read don't need permission; tools that modify things do (unless pre-approved or in auto mode).

{{< figure src="/images/claude-agentic-loop.svg" width="720" height="280" loading="lazy" alt="A user prompt starts a loop of gathering context, taking action, and checking results, with opportunities for the user to steer." caption="Tool results inform the next step: inspect, act, check, and repeat." attr="Claude Code docs" attrlink="https://code.claude.com/docs/en/how-claude-code-works#the-agentic-loop" >}}

### Selected Built-in Tools

These are the tools used most often in the workshop. See the [tools reference](https://code.claude.com/docs/en/tools-reference) for the full list.

| Category | Tool | What it does | Permission? |
| --- | --- | --- | --- |
| **Read** | `Read` | Read files (also images, PDFs, notebooks) | No |
| | `Glob` | Find files by name pattern (`**/*.ts`) | No |
| | `Grep` | Search file contents (built on ripgrep) | No |
| | `LSP` | Go-to-definition, find references, type errors | No |
| **Write** | `Edit` | Targeted string replacement (must read file first) | Yes |
| | `Write` | Create new files or full overwrite | Yes |
| | `NotebookEdit` | Modify Jupyter notebook cells | Yes |
| **Shell** | `Bash` | Run shell commands (2 min timeout, background mode available) | Yes |
| | `PowerShell` | Native PowerShell (Windows) | Yes |
| | `Monitor` | Background watcher: tail logs, poll CI, watch files | Yes |
| **Web** | `WebFetch` | Fetch URL → markdown → extract via prompt | Yes |
| | `WebSearch` | Web search (returns URLs, doesn't fetch pages) | Yes |
| **Agentic** | `Agent` | Spawn sub-agent with own context window | No |
| | `EnterPlanMode` | Switch to read-only planning mode | No |
| | `EnterWorktree` | Create or enter an isolated git worktree | Yes |
| | `Skill` | Execute a skill / slash command | Yes |
| | `TaskCreate/Update/List` | Structured task management. Not offered on Opus 4.8, Sonnet 5, or Fable models (v2.1.233+); set `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` to bring them back | No |
| | `CronCreate/Delete/List` | Schedule recurring prompts in-session | No |
| | `Workflow` | Run reusable JavaScript multi-agent orchestration (see Dynamic Multi-Agent Workflows below) | Yes |
| | `SendMessage` | Message or resume named subagents, including members of an agent team | No |

- **Bash is the workhorse.** It's how Claude runs tests, git, gh, docker, npm, and any CLI. If a CLI exists, Claude prefers Bash over an MCP server.
- **MCP tools** (Chrome DevTools, Playwright, Context7, etc.) show up alongside built-in tools. Check with `/mcp`.

### Permission Rules

![Permission decision flow: a tool request passes through hooks, deny rules, ask rules, permission mode, allow rules, then canUseTool before it executes or is blocked](/images/permissions-flow.svg)

Pre-approve tools via `/permissions` or `settings.json` to reduce prompts:

```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Bash(git *)", "Edit(/src/**)"],
    "deny": ["Read(~/.ssh/**)", "Bash(rm -rf *)"]
  }
}
```

| Rule format | Applies to |
| --- | --- |
| `Bash(npm run *)` | Bash, Monitor |
| `Read(~/secrets/**)` | Read, Grep, Glob, LSP |
| `Edit(/src/**)` | Edit, Write, NotebookEdit |
| `WebFetch(domain:example.com)` | WebFetch |

> 💡 An `Edit(...)` rule also grants read access to the same path.

> 🔗 Full tool reference: [https://code.claude.com/docs/en/tools-reference](https://code.claude.com/docs/en/tools-reference)

## Developing Online

### Working with GitHub

Install the GitHub CLI first: [**https://cli.github.com**](https://cli.github.com/)

```bash
# Authenticate
gh auth login

# Then in your Claude Code prompt:
# "Can you use gh to push this to a new branch and open a PR?"
```

Useful Claude Code + `gh` workflows:

- Create a branch, implement a feature, push and open a PR, all in one prompt
- Fetch open issues and triage them
- Review a PR diff and leave comments
- Check CI status and fix failing tests


### Working with GitLab

Install the **GitLab CLI** from https://docs.gitlab.com/cli/, and use it similarly to how GH CLI is used.

Authenticate the CLI with `glab auth login`. Also, install the agent skills with `glab skills install` so Claude knows how to use the CLI.


#### Review commands to run in Claude Code

Pick the lightest review that fits the change:

| Command | What it does |
| --- | --- |
| `/code-review [level] [pr]` | Looks for correctness bugs and cleanup opportunities in the current diff or a pull request, in a background subagent by default. With no level it reuses the last level you typed. `/review` is an alias (v2.1.223+) |
| `/code-review ultra` | Runs the cloud review; `/ultrareview` is also a supported alias. Only 3 runs are included in the subscription plans, and they do not refresh |
| `/simplify` | Runs four cleanup agents that check reuse, code quality, and efficiency |

For a second-model pass, ask Codex to review a narrow set of risks. For example:

```markdown
use codex to code review the entire codebase/git diffs, with focus areas on:
1. security and vulnerabilities
2. DRY, KISS, YAGNI
3. Readability and maintainability
```

Other review commands installed in this workshop setup include `/everything-claude-code:code-review`, `/codex:adversarial-review`, and `/bmad-code-review`.


### Working with Other Agents (Sub-agents & Agent Teams)

- Claude Code can **spawn sub-agents** to work on parallel tasks, useful for large features where multiple independent pieces can be built simultaneously.
- A subagent has its own context, separate from the conversation that spawned it. It starts with the instructions and context passed to it.
- Subagents can nest three levels below the main conversation by default.
- In a **multi-agent setup**, the main Claude Code agent acts as the orchestrator (breaking down tasks, reviewing outputs) while dispatched agents act as workers (implementing specific pieces).
- Keep inter-agent communication structured: have each sub-agent produce a clear output summary the orchestrator can evaluate.
- **Agent teams** remain experimental and are gated behind `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in the shell or the `settings.json` `env` block. Each session has one implicit team; spawn named teammates directly and Claude Code cleans up the team state when the session ends.

![Sub-agents diagram](/images/subagents-diagram.png)

### Worktrees & Working in Parallel

- Git worktrees let you check out multiple branches of the same repo in separate directories simultaneously, no stashing, no branch-switching.
- Claude Code has a built-in worktree function to run parallel agentic sessions on different features at the same time.
      
[Common workflows - Claude Code Docs](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees)

```bash
# Start Claude in a worktree named "feature-auth"
# Creates .claude/worktrees/feature-auth/ with a new branch
claude --worktree feature-auth

# Start another session in a separate worktree
claude --worktree bugfix-123
```
    

### Dynamic Multi-Agent Workflows (ultracode)

Dynamic workflows let you define fan-out, loops, barriers, and structured outputs in JavaScript. The workflow runs in the background, so you can keep using the main session while it works.

A workflow can run up to 16 agents at once by default and 1,000 agents in one run; `CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS` raises the concurrent limit to as many as 256 (v2.1.269+). Workflow sizing defaults to `small` on Pro and `medium` on other plans, and `medium` aims to use no more than 10 agents (v2.1.271+). A workflow that hits your usage limit pauses and continues when the limit resets. Calls made through a workflow's `agent()` function do not consume the normal `Agent` tool quota. Regular `Agent` calls are limited separately to 20 concurrent subagents; the 200-per-session cap was removed in v2.1.224.

Two ways to trigger it:

1. **Inline keywords**: include `ultracode` or `workflow` in a prompt to authorize one orchestrated run:

    ```text
    audit every API endpoint in this repo using ultracode/workflows for missing auth checks,
    verify each finding with independent reviewer agents, and give me only
    the confirmed ones
    ```

2. **Session setting**: `/effort ultracode` uses xhigh reasoning and lets Claude dispatch workflow agents when parts of a task can run independently. It is a session setting, not a model effort level.

Supporting commands:

| Command | What it does |
| --- | --- |
| `/workflows` | List, watch, pause, resume, save, and stop workflow runs |
| `/deep-research <question>` | Built-in workflow: fan-out web search, cross-check sources, adversarially vote on claims, produce a cited report |

You can inspect a workflow script before it runs and save it for reuse. A review workflow might collect candidate findings, ask separate agents to challenge each one, and report which findings survive that second check.

Availability: all paid plans, the API, Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry. On Pro, enable workflows first in `/config`.

Read more: [code.claude.com/docs/en/workflows](https://code.claude.com/docs/en/workflows)

### Hooks

![Hook resolution: a Bash tool call fires PreToolUse, then your matcher and if-condition decide whether the hook command runs and denies the tool or lets it proceed](/images/hook-resolution.svg)

- Hooks receive JSON at Claude Code lifecycle events, run your handler, and can return event-specific output. A `PreToolUse` hook can allow, deny, or ask before a tool runs. Unlike instructions in CLAUDE.md, hook checks are enforced by the runtime.
- Hooks block the current event by default, so keep them quick. A command hook that does not need to affect the current action can set `"async": true`.
- Common events include:
    - Once per session: **`SessionStart`**, **`SessionEnd`**
    - Once per turn: **`UserPromptSubmit`**, **`Stop`**, **`StopFailure`**
    - Once per tool call: **`PreToolUse`**, **`PostToolUse`**, **`PostToolUseFailure`**
    - Other: **`Notification`**, **`PreCompact`**, **`SubagentStart`**, **`SubagentStop`**, and **`Setup`**. The [hooks reference](https://code.claude.com/docs/en/hooks) lists every event and its output format.

![Hooks diagram](/images/hooks-diagram.png)

- Configure hooks in `settings.json`: global (`~/.claude/`), project (`.claude/`), or local (`.claude/settings.local.json`, gitignored). Matchers are case-sensitive; use regex like `Edit|Write` to match multiple tools.
- **How they work:** Your hook reads JSON from stdin, including fields such as `tool_name`, `tool_input`, and `cwd`. For `PreToolUse`, return `hookSpecificOutput.permissionDecision` as `"allow"`, `"deny"`, or `"ask"`. `"defer"` is limited to non-interactive `claude -p` handling. Exit code 2 is handled differently across events, so check the [event reference](https://code.claude.com/docs/en/hooks) before relying on it.
- **Hook to add:** Prevent destructive delete by requiring user approval:

> ✏️ **Add this to your CC settings.json file**

```json
{
    "hooks": {
      "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.command // \"\"' | grep -qE '\\b(rm|rmdir|shred|unlink)\\b|-delete' && printf '{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"ask\",\"permissionDecisionReason\":\"DESTRUCTIVE ACTION: delete command detected (rm/rmdir/shred/unlink/-delete). Please review and confirm.\"}}' || true",
            "timeout": 5,
            "statusMessage": "Checking for destructive delete commands..."
          }
        ]
      }
     ]
    }
}
```

**Other useful hooks:**

| Hook | Event | What It Does |
|------|-------|--------------|
| **Protect Secrets** | `PreToolUse` (matcher: `Read\|Edit\|Write\|Bash`) | Block access to `.env`, SSH keys, credentials files |
| **Auto-Stage Changes** | `PostToolUse` (matcher: `Edit\|Write`) | `git add` every file Claude touches: `git diff --staged` becomes a live changelog |
| **Slack Notifications** | `Notification` (matcher: `permission_prompt\|idle_prompt`) | Alert when Claude needs your input |
| **Branch Protection** | `PreToolUse` | Prevent changes on `main`/`master` |
| **Quality Gates** | `PostToolUse` | Run tests/linting after every edit |
| **Rules Injection** | `UserPromptSubmit` | Re-inject CLAUDE.md rules to combat agent drift in long sessions |

> 💡 **Further reading:** For full implementations of these hooks, see [Karan Bansal's Claude Code Hooks deep dive](https://karanbansal.in/blog/claude-code-hooks/).

#### Hands-on: Add Safety Hooks (10 minutes)

**Step 1: Destructive-delete hook.** Open Claude Code's settings (`~\.claude\settings.json`) and add the destructive-delete hook above under `PreToolUse`. Test it by asking Claude to delete a file:

```
Delete the file `src/components/OldComponent.tsx`. It's no longer used.
```

You should see a confirmation prompt before anything gets deleted.

**Step 2: Protect-secrets hook.** Clone the hooks repo and add the secret-file protection hook:

```bash
git clone https://github.com/karanb192/claude-code-hooks.git ~/.claude/hooks-repo
```

Your `settings.json` should now have both hooks under `PreToolUse`:

```json
{
    "hooks": {
      "PreToolUse": [
        {
          "matcher": "Bash",
          "hooks": [
            {
              "type": "command",
              "command": "jq -r '.tool_input.command // \"\"' | grep -qE '\\b(rm|rmdir|shred|unlink)\\b|-delete' && printf '{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"ask\",\"permissionDecisionReason\":\"DESTRUCTIVE ACTION: delete command detected (rm/rmdir/shred/unlink/-delete). Please review and confirm.\"}}' || true",
              "timeout": 5,
              "statusMessage": "Checking for destructive delete commands..."
            }
          ]
        },
        {
          "matcher": "Read|Edit|Write|Bash",
          "hooks": [
            {
              "type": "command",
              "command": "node ~/.claude/hooks-repo/hook-scripts/pre-tool-use/protect-secrets.js",
              "timeout": 5,
              "statusMessage": "Checking for secret file access..."
            }
          ]
        }
      ]
    }
}
```

This hook blocks Claude from reading `.env`, SSH keys, AWS credentials, `.pem` files, and catches sneaky commands like `cat .env` or `printenv`. It has three safety levels (`critical`, `high`, `strict`). Defaults to `high`.

**Test it** by asking Claude to read a secrets file:

```
Show me what's in the .env file
```

You should see the hook deny the request with a reason like `🛡️ [env-file] Cannot read: .env file contains secrets`.

## MCP

{{< figure src="/images/mcp-architecture.svg" width="980" height="500" loading="lazy" alt="Claude Code hosts one MCP client per server connection: stdio connects to a local process, while Streamable HTTP connects to a remote server." caption="The same host can connect to both local and remote MCP servers." attr="Adapted from the MCP architecture overview" attrlink="https://modelcontextprotocol.io/docs/learn/architecture" >}}

- **Model Context Protocol (MCP)** is a standard way for an AI agent to talk to external tools and data sources via "servers" (think: APIs for agents)
- It turns a chat model into something that can *do work* (read files, query systems, take actions), with clearer boundaries and permissions than ad-hoc scripts.
- Caveat: if both MCP and CLI version of the same tool exists, choose the CLI always (for eg, GitHub MCP and CLI both exist). Models are better trained for CLI-style tool use interaction, like running `--help` to get more information about how to use other CLIs
    - Example of this: start a new Claude session and ask the model to list currently running Docker containers. For Opus, it will always use the Bash tool to run Docker commands, without the need of a Docker MCP, so long as there is a CLI for your particular tool of choice. This applies to all CLIs like gh, git, kubectl, curl, ssh, pip, npm, etc.
        
        ![Docker CLI example](/images/docker-cli-example.png)
        
    
- Examples:
    - **Chrome DevTools / Playwright/ browser MCPs**: Inspect DOM, run console commands, capture network traces, debug UI issues)
    - **Slack/Jira/Linear MCP**: Triage and create tickets
    - **Supabase MCP**: Manage projects and environments, query Postgres, inspect and apply migrations, and work with auth, storage, and edge functions.
- **List of notable MCP servers**

| Name | Link | Install Command | Remarks |
| --- | --- | --- | --- |
| Context7 | [https://github.com/upstash/context7](https://github.com/upstash/context7) | `claude mcp add --scope user --header "CONTEXT7_API_KEY: YOUR_API_KEY" --transport http context7 https://mcp.context7.com/mcp` | Create API key at [https://context7.com/](https://context7.com/) and pass it |
| docs-mcp-server | [https://github.com/arabold/docs-mcp-server](https://github.com/arabold/docs-mcp-server) | Run `npx @arabold/docs-mcp-server@latest` (or Docker), then `claude mcp add --transport sse docs-mcp http://localhost:6280/sse` | Self-hosted, open-source alternative to Context7. Indexes websites, GitHub, npm, PyPI, and local files and runs locally, so your code stays on your network. Optional embedding key improves search quality |
| Chrome Devtools | [https://github.com/ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | `/plugin marketplace add ChromeDevTools/chrome-devtools-mcp` `/plugin install chrome-devtools-mcp` | Browser automation |
| CodeGraphContext | [https://github.com/CodeGraphContext/CodeGraphContext](https://github.com/CodeGraphContext/CodeGraphContext) | | Indexes current codebase into graph DB for use by coding agents |
| codebase-memory-mcp | [https://github.com/DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | [Quick start guide](https://github.com/DeusData/codebase-memory-mcp?tab=readme-ov-file#quick-start) | Similar to CodeGraphContext above |
| Awesome MCP servers | [https://github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | | List of MCP servers for just about any function |

**How to Install MCP Servers**

In Claude Code, run:

```bash
claude mcp add <server-name>
```

Or configure manually in your `claude_desktop_config.json` (or equivalent settings file). Each MCP server has its own setup guide: check the server's repo or the Claude documentation.

> **For offline environments:** any MCP server that uses `npx` will try to pull the package on first run. Pre-install packages globally with `npm install -g <package>` on a machine with internet, then copy to the offline machine and update config to use the local binary path directly.

### Hands-on: Install and Use an MCP Server

**Context7 for Updated Documentation**

Install the **Context7** MCP server, which gives Claude access to up-to-date library documentation:

Now use it. Pick a library your CRUD app depends on (e.g. React, Express, FastAPI, Pydantic) and ask Claude to implement something using the **latest** API, something you'd normally have to look up in the docs yourself:

```text
Using the latest FastAPI and Pydantic docs, add soft-delete to my app. 
Records should get a deleted_at timestamp instead of being removed from the database.
```

Context7 pulls in current documentation instead of relying on Claude's training data. It is especially useful for libraries whose APIs change between versions, such as the move from Pydantic v1 to v2.

**Chrome Devtools for browser automation**

Install the Chrome Devtools MCP server, which allows Claude to control browser sessions

```markdown
use the chrome devtools mcp, open duckduckgo and search for the best claude code plugins. come up with a detailed report.
```

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

### Notable Skills for Reference

> ⚠️ **Security warning:** Skills can execute arbitrary code in your environment. Before installing a community skill, **review SKILL.md and every bundled script yourself**. A malicious skill can access your shell, exfiltrate data, or modify files from a few lines of Markdown. Install only from sources you trust. The same risk applies to skills used by OpenClaw and other coding CLIs.

This is a growing list of community and official skills worth knowing about. Not all of these are endorsed. They're here as references for what's possible.

| Category | Skill | Repo | Purpose |
| --- | --- | --- | --- |
| Documents | docx, pptx, pdf, xlsx | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills) | Create and edit common office document formats, same skills that power Claude's document capabilities on web and desktop. [Blog post](https://claude.com/blog/create-files). Might require pip and npm to install some dependencies |
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

> 🗒️ Some plugins install the MCP servers they depend on. Official plugins are available through the `claude-plugins-official` marketplace.

### Notable Plugins

| Plugin | What it does | Link |
| --- | --- | --- |
| **Superpowers** | A collection of power-user enhancements for Claude Code | [https://github.com/obra/superpowers](https://github.com/obra/superpowers) |
| **Skills for Real Engineers** | Matt Pocock's composable collection of engineering-discipline skills: requirements grilling, domain modeling, specs and ticket decomposition, TDD, debugging, code review, and codebase architecture | [GitHub](https://github.com/mattpocock/skills/tree/main/skills)<br><code>/plugin install mattpocock-skills</code> (or <code>npx skills@latest add mattpocock/skills</code> for editable project-local copies. Pick one method to avoid duplicate skills) |
| **Security Guidance** | Official plugin that automatically reviews code changes for vulnerabilities on edits, commits, or pushes | [Docs](https://code.claude.com/docs/en/security-guidance#on-each-commit-or-push-claude-makes)<br><code>/plugin install security-guidance@claude-plugins-official</code> |
| **Codex Security** | OpenAI Codex plugin for authorized repository, deep, and diff-focused security scans, plus minimal fixes for validated findings | [Docs](https://developers.openai.com/codex/security/plugin)<br><code>$codex-security:security-scan</code> / <code>$codex-security:security-diff-scan</code> |
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
| **LiteLLM self-hosted marketplace** | 🟢 Fully offline once LiteLLM proxy is running locally |

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

## Skills and Plugins Reference

The sections above explain how skills and plugins work and how to install them. The companion page looks at specific tools: what they add, where they help, and when their process costs more than it saves.

Read the [Skills and Plugins Reference](/docs/skills-plugins-deep-dive/).

## More resources

[Cheat Sheet for Claude Code](/docs/cheat-sheet/)

> 🔗 [https://github.com/luongnv89/claude-howto](https://github.com/luongnv89/claude-howto)

> 🔗 [https://github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk): Min-max token counts by using a CLI proxy to remove unnecessary outputs from tool calls

## Alternative providers

- Z.ai's [GLM Coding Plan](https://z.ai/subscribe) and MiniMax's [Coding Plan](https://platform.minimax.io/subscribe/coding-plan). They're compatible with the Claude Code *harness*, and provide a lot more tokens for your buck.
- There are other harnesses, such as the OG [Cursor](https://cursor.com), [OpenCode](https://opencode.ai), [Cline](https://cline.bot), [AmpCode](https://ampcode.com), Forgecode, and more. Some people like them for being able to choose between different models in one app.
- For the non-terminal folks, there's [Lovable](https://lovable.dev), [v0](https://v0.dev), [Figma Make](https://figma.com/make), and many more.

## The future of coding

Some thoughts about agentic coding. 

- [Home-Cooked Software](https://maggieappleton.com/home-cooked-software), Maggie Appleton: Building apps just for yourself, or your community.
- [Boring Tiny Tools](https://vaughntan.org/boringtinytools), Vaughn Tan: Business implications of vibe coding.
- [Jevons' Paradox for Software](https://x.com/addyosmani/status/2005768629691019544), Addy Osmani: When something becomes cheaper, there's more demand for it, and this should apply to software.
- [What happens when the floor rises?](https://yewjin.substack.com/p/i-placed-4th-in-a-kaggle-competition?utm_campaign=post), a different, more eloquent, YJ:
    
    *"When you can have anything built, the bottleneck isn't capability. It's imagination. It's curiosity. It's the willingness to be wrong in public while you figure out what works.*
    
    *The question isn't whether AI will change your work. The question is: at which layer do you choose to remain valuable?"*
    
- [The AI Disruption We've Been Waiting For Has Arrived](https://www.nytimes.com/2026/02/18/opinion/ai-software.html), Paul Ford: 
*"The simple truth is that I am less valuable than I used to be. It stings to be made obsolete, but it's fun to code on the train, too. And if this technology keeps improving, then all of the people who tell me how hard it is to make a report, place an order, upgrade an app or update a record — they could get the software they deserve, too. That might be a good trade, long term."*

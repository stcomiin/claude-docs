---
title: Pre-Workshop Setup Guide
weight: 1
next: /docs/workshop/01-get-running
---

**Agentic Coding in Terminal**: Apex Builders Collective × Info PC

Please finish these steps **before** the workshop. Allow about 15–20 minutes. **We are mainly working with Claude Code in this workshop**, so most info are Claude Code specific, but most things extrapolate to other harnesses. You can choose to use any agentic coding harness of your preference for the workshop.

---

## Setup checklist

- [ ] Node.js v22+ installed
- [ ] Git installed
- [ ] GitHub CLI installed and signed into your GitHub account
- [ ] A terminal you're comfortable with
- [ ] Claude Code installed and working
- [ ] (Optional) Codex installed and working
- [ ] (Optional) A code editor you like

---

## 1. Prerequisites

Install these first.

### Node.js (v22 or higher)

Download the current LTS release from [nodejs.org](https://nodejs.org/). It includes npm and meets the Node.js 22+ requirement for Claude Code. The `npx skills` installer in step 3 needs Node.js too.

Verify after install:

```bash
node --version    # Should show v22.x.x or higher
npm --version     # Should show 10.x.x or higher
```

### Git

Download from [git-scm.com](https://git-scm.com/). Most macOS and Linux machines already have it.

```bash
git --version
```

### GitHub CLI

Install [GitHub CLI](https://cli.github.com/), then sign into the account that will own your workshop fork:

```bash
gh auth login
gh auth status
```

The labs use GitHub CLI to publish issues to your fork.

### Windows

Claude Code and Codex both run natively in PowerShell. WSL and Git Bash are optional, not installation requirements. Install **Git for Windows** so both tools can use Git. Claude Code can also use the bundled Git Bash shell for its Bash tool; otherwise it uses PowerShell.

If Claude Code does not find Git Bash automatically, its usual path is:

```text
C:\Program Files\Git\bin\bash.exe
```

---

## 2. Install and configure

### Getting Your API Key

You'll need an API key from your chosen provider.

> ℹ️ **For workshop participants:** We will provide your API key. Watch for a follow-up email from us.

If you want to bring your own key, follow the setup steps below.

#### OpenRouter setup steps

[OpenRouter](https://openrouter.ai/) provides unified access to Claude, GPT, Gemini, and many other models through a single API key.

1. Skip to [Claude Code installation section](#claude-code) if you already have an OpenRouter key (`sk-or-xxxxxx`).
2. Sign up at [openrouter.ai](https://openrouter.ai/)
3. Go to [Keys](https://openrouter.ai/keys) and create an API key
4. Add credits under [Credits](https://openrouter.ai/credits)
5. Your base URL will be `https://openrouter.ai/api`
6. Note your API key — it starts with `sk-or-`

### Claude Code

{{< callout type="warning" >}}
**The workshop OpenRouter key gives you Haiku only.** The only Claude model available with the key we email you is **Claude Haiku 4.5**. Any other model shown below — Opus 5, Sonnet 5, or Fable 5 — will **not** work with the provided key. Set the model to Haiku in your config, and switch with `/model haiku` inside Claude Code.
{{< /callout >}}

1. **Install with npm**
    
    **Prerequisites**
    
    - Node.js 22 or later
    - npm (comes with Node.js)
    
    npm is our recommended default install method here because it also works in air-gapped environments: point npm at your internal registry mirror and install the same way.
    
    ```bash
    # Install globally
    npm install -g @anthropic-ai/claude-code@2.1.273 # verified 2026-09-16
    
    # Verify
    claude --version
    
    # Upgrade later
    npm install -g @anthropic-ai/claude-code@latest
    ```
    
2. **Configure the gateway in `settings.json`**
    
    Edit `~/.claude/settings.json`(Linux/MacOS), `%USERPROFILE%/.claude/settings.json`(Windows) and replace the example URL and key. In PowerShell, the same file is `$HOME\.claude\settings.json`. Claude Code sends requests to `ANTHROPIC_BASE_URL` and authenticates them with `ANTHROPIC_AUTH_TOKEN`.
    
    **LiteLLM proxy (Use Openrouter section below for the workshop):**
    
    ```json
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://your-litellm-proxy.example.com",
        "ANTHROPIC_AUTH_TOKEN": "sk-your-api-key",
        "ANTHROPIC_MODEL": "claude-opus-4-8[1m]",
        "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-8[1m]",
        "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-opus-4-8[1m]",
        "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-opus-4-8[1m]",
        "CLAUDE_CODE_SUBAGENT_MODEL": "claude-opus-4-8[1m]",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
        "CLAUDE_CODE_EFFORT_LEVEL": "max",
        "CLAUDE_CODE_FORK_SUBAGENT": "0",
        "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
        "CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING": "1",
        "CLAUDE_CODE_SUBAGENT_MODEL_FORCE": "1"
      },
      "cleanupPeriodDays": 3650,
      "autoCompactEnabled": false
    }
    ```
    
    **OpenRouter (use this for the workshop):**
    
    ```json
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
        "ANTHROPIC_AUTH_TOKEN": "sk-or-your-openrouter-key",
        "ANTHROPIC_MODEL": "anthropic/claude-haiku-4.5",
        "ANTHROPIC_DEFAULT_OPUS_MODEL": "anthropic/claude-haiku-4.5",
        "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-haiku-4.5",
        "ANTHROPIC_DEFAULT_HAIKU_MODEL": "anthropic/claude-haiku-4.5",
        "CLAUDE_CODE_SUBAGENT_MODEL": "anthropic/claude-haiku-4.5",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
        "CLAUDE_CODE_EFFORT_LEVEL": "max",
        "CLAUDE_CODE_FORK_SUBAGENT": "0",
        "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
        "CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING": "1",
        "CLAUDE_CODE_SUBAGENT_MODEL_FORCE": "1"
      },
      "cleanupPeriodDays": 3650,
      "autoCompactEnabled": false
    }
    ```
    
  On Windows, add `"CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"` only if Claude Code cannot find Git Bash.

 - `CLAUDE_CODE_SUBAGENT_MODEL` is a default rather than an override since v2.1.251: an agent file's own `model:` wins. `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` (v2.1.257+) force applies it to every subagent.
 - `CLAUDE_CODE_FORK_SUBAGENT=0` turns off subagent forking, which has been on by default since v2.1.232. A forked subagent inherits the whole conversation which is context bloat. With forking off, subagents start from only the brief they are given.

### (Optional, not needed for this workshop) Codex CLI

1. **Install with npm**

    Codex requires Node.js 16 or later and runs directly in PowerShell on Windows. The Node.js 22+ workshop prerequisite already meets this requirement.

    ```bash
    npm install -g @openai/codex

    codex --version
    # codex-cli 0.145.0, verified 2026-07-27
    ```

2. **Put the provider key in an environment variable**

    Use the variable that matches your provider. These commands set it for the current terminal session.

    macOS or Linux:

    ```bash
    # LiteLLM
    export LITELLM_API_KEY="sk-your-api-key"

    # OpenRouter
    export OPENROUTER_API_KEY="sk-or-your-openrouter-key"
    ```

    PowerShell:

    ```powershell
    # LiteLLM
    $env:LITELLM_API_KEY = "sk-your-api-key"

    # OpenRouter
    $env:OPENROUTER_API_KEY = "sk-or-your-openrouter-key"
    ```

3. **Create `config.toml`**

    The file is `~/.codex/config.toml` on macOS and Linux, or `$HOME\.codex\config.toml` in PowerShell. Create the directory if it does not exist:

    ```bash
    # macOS or Linux
    mkdir -p ~/.codex
    ```

    ```powershell
    # PowerShell
    New-Item -ItemType Directory -Force "$HOME\.codex"
    ```

    Then create `config.toml` with the example for your provider.

    **LiteLLM proxy:**

    ```toml
    model_provider = "litellm"

    [model_providers.litellm]
    name = "LiteLLM Proxy"
    base_url = "https://your-litellm-proxy.example.com/v1"
    wire_api = "responses"
    env_key = "LITELLM_API_KEY"
    ```

    **OpenRouter:**

    ```toml
    model_provider = "openrouter"

    [model_providers.openrouter]
    name = "OpenRouter"
    base_url = "https://openrouter.ai/api/v1"
    wire_api = "responses"
    env_key = "OPENROUTER_API_KEY"
    ```

    Keep API keys out of `http_headers`. Codex reads the variable named by `env_key` and sends it as the provider credential. Do not add context-window or compaction limits unless your gateway needs values that differ from the model metadata.

4. Run `codex` in the same terminal, then use `/model`. With OpenRouter, choose a provider-qualified ID such as `openai/gpt-5.6-sol`, `openai/gpt-5.6-terra`, or `openai/gpt-5.6-luna`. With LiteLLM, use the deployment name configured on your proxy. Sol is for complex, open-ended work, Terra for everyday development, and Luna for clear, repeatable tasks. Max gives one agent more time to reason; Ultra can delegate independent parts to subagents on eligible accounts.

---

## 3. Install Skills by Matt Pocock

The hands-on exercise uses some of the agent skills by [Matt Pocock](https://github.com/mattpocock/skills). Set it up in a project folder for this workshop. Follow the install instructions for the harness you are choosing to use.

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin install mattpocock-skills
```

Or, from inside a session:

```
/plugin install mattpocock-skills
```

It's in Claude Code's official marketplace, so there's nothing to add first, and updates arrive automatically.
</details>


<details>
<summary><strong>Codex, and other agents</strong></summary>

```bash
npx skills@latest add mattpocock/skills
```

Pick the skills you want, and which coding agents to install them on. **The installer lets you choose which skills to take, so make sure `setup-matt-pocock-skills` is one of them.**

A native Codex plugin is on the roadmap (see [`.agents/adr/0002-ship-as-a-claude-code-plugin.md`](https://github.com/mattpocock/skills/blob/main/.agents/adr/0002-ship-as-a-claude-code-plugin.md)).

</details>

---

## 4. Optional extras

None of these are required.

**A code editor**: [VS Code](https://code.visualstudio.com/), [Cursor](https://cursor.com/), or whichever editor you already use. It helps when you want to inspect generated files outside the terminal.

**Herdr**: We recommend Herdr for managing multiple coding agent sessions in one terminal workspace. Follow the [official installation guide](https://herdr.dev/docs/install/) for your operating system, then see [Managing Multiple Agent Sessions with Herdr](/docs/agentic-coding-in-terminal/#managing-multiple-agent-sessions-with-herdr) for a quick introduction. This is optional for the workshop.

**A few terminal basics**: If you rarely use a terminal, practice changing folders, listing files, creating a directory, and reading a text file before the workshop.


---

## If something fails

If you get stuck on any step:

1. Copy the error message
2. Paste it into Claude or ChatGPT and ask for help.
3. Check `claude --version`. Versions 2.1.265 through 2.1.267 fail every turn with HTTP 400 through third-party Anthropic-compatible endpoints such as LiteLLM and OpenRouter (fixed in 2.1.268). The pinned version above is past that range.

---

Continue with [Lab 1: Get running](/docs/workshop/01-get-running/).

[← Back to the contents](/docs/)

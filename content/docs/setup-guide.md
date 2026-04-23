---
title: Pre-Workshop Setup Guide
weight: 2
---

**Agentic Coding in Terminal** — Apex Builders Collective × Info PC

Please complete these steps **before** the workshop so we can hit the ground running. The whole setup should take 15–20 minutes.

---

## ✅ Checklist at a Glance

- [ ] Node.js v18+ installed
- [ ] Git installed
- [ ] A terminal you're comfortable with
- [ ] Claude Code installed and working
- [ ] Codex installed and working
- [ ] (Optional) A code editor you like

---

## 1. Prerequisites

These need to be in place before installing anything else.

### Node.js (v18 or higher)

Download from [nodejs.org](https://nodejs.org/) — grab the LTS version. This also installs npm.

Verify after install:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

### Git

Download from [git-scm.com](https://git-scm.com/). Most macOS and Linux machines already have it.

```bash
git --version
```

### Windows Users

You'll need **WSL** (Windows Subsystem for Linux) or **Git Bash** (comes with Git for Windows). Claude Code and Codex don't run natively in CMD or PowerShell.

If using Git Bash, note the path — you may need it later:

```text
C:\Program Files\Git\bin\bash.exe
```

---

## 2. Installation & Configuration

### Getting Your API Key

You'll need an API key from your chosen provider. Here are your options:

#### Option A: LiteLLM Proxy (Self-Hosted / Org-Provided)

If your organization runs a LiteLLM proxy (or you self-host one):

1. Login to your LiteLLM admin UI at `https://your-litellm-proxy.example.com/ui`.
2. Click "Virtual Keys" on the tabs on the left, and click "Create new key"
3. Change the following: 
    1. Team: Select your team, and 
    2. Enter your key name. 
    3. Leave everything else as default
    4. Click "Create Key"
4. Please note this API key down. You can also regenerate your key if you lost it after creation, by going back to the same page and clicking inside your key.
5. To view requests made by your API key, go to "Logs" on the left tab, which will show you detailed usage of your requests, including token counts, TTFT. Click on "Usage" tab for aggregated stats of your keys.

#### Option B: OpenRouter

[OpenRouter](https://openrouter.ai/) provides unified access to Claude, GPT, Gemini, and many other models through a single API key.

1. Sign up at [openrouter.ai](https://openrouter.ai/)
2. Go to [Keys](https://openrouter.ai/keys) and create an API key
3. Add credits under [Credits](https://openrouter.ai/credits)
4. Your base URL will be `https://openrouter.ai/api`
5. Note your API key — it starts with `sk-or-`

### Claude Code

1. **Installation Via npm** 
    
    **Prerequisites**
    
    - Node.js ≥ 18
    - npm (comes with Node.js)
    - WSL or Git Bash (for windows installation)
    
    ```bash
    # Install globally
    npm install -g @anthropic-ai/claude-code
    
    # Verify
    claude --version
    
    # Update claude version for latest features, works offline as well
    claude update
    ```
    
2. **Skipping Onboarding via `.claude.json` (offline setup only, skip this step if doing online)**
*When Claude Code launches for the first time, it forces an onboarding wizard that requires OAuth login to an Anthropic or Console account. In offline custom-endpoint setups, **this blocks you entirely**.*
    
    Manually create/edit `~/.claude.json` with the onboarding flag set.
    
    ```json
    {
      "hasCompletedOnboarding": true,
      "shiftEnterKeyBindingInstalled": true,
      "theme": "dark"
    }
    ```
    
3. Setting Environment Variables to connect to Custom endpoint 
    
    **Create or Edit Settings File (`~/.claude/settings.json`) (replace with your api key in** `ANTHROPIC_AUTH_TOKEN` )
    
    > 💡 Recommend Version Below ⬇️
    
    **Using a LiteLLM Proxy:**
    
    ```json
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://your-litellm-proxy.example.com",
        "ANTHROPIC_AUTH_TOKEN": "sk-your-api-key",
        "ANTHROPIC_MODEL": "claude-opus-4-6",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
        "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe",
        "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
        "ENABLE_TOOL_SEARCH": "1",
        "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
        "ENABLE_LSP_TOOL": "1",
        "CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING": "1",
        "MAX_THINKING_TOKENS": "128000",
        "DISABLE_AUTO_COMPACT": "1"
      },
      "alwaysThinkingEnabled": true,
      "cleanupPeriodDays": 365
    }
    ```
    
    **Using OpenRouter:**
    
    ```json
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
        "ANTHROPIC_AUTH_TOKEN": "sk-or-your-openrouter-key",
        "ANTHROPIC_MODEL": "anthropic/claude-opus-4-6",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
        "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe",
        "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
        "ENABLE_TOOL_SEARCH": "1",
        "CLAUDE_CODE_ATTRIBUTION_HEADER": "0",
        "ENABLE_LSP_TOOL": "1",
        "CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING": "1",
        "MAX_THINKING_TOKENS": "128000",
        "DISABLE_AUTO_COMPACT": "1"
      },
      "alwaysThinkingEnabled": true,
      "cleanupPeriodDays": 365
    }
    ```
    
4. `claude` to launch the CLI in terminal. Select model with `/model` , `/effort`  for reasoning effort

### Codex (ChatGPT's Claude Code Competitor)

1. **Installation Via npm** 
    
    **Prerequisites**
    
    - Node.js ≥ 18
    - npm (comes with Node.js)
    - WSL or Git Bash (for windows installation)
    
    ```bash
    # Install globally
    npm install -g @openai/codex
    
    # Verify
    codex --version
    # codex-cli 0.116.0
    ```
    
2. First-time login 
    
    Run Codex once to create the config directory and trigger login:
    
    ```bash
    codex
    ```
    
    It will ask you to log in with OpenAI. Since we are using LiteLLM instead, you can skip/cancel this - we will just need the `~/.codex/` folder to exist. Running the `codex` command above should auto-create the `~/.codex/` folder 
    
    If it doesn't auto-create, make it manually:
    
    ```bash
    mkdir -p ~/.codex
    ```
    
3. Create Codex config
    
    In a **new terminal**, create the config file:
    
    > 💡 Note: Codex updates its config file frequently, check online for updated docs.
    
    **Using a LiteLLM Proxy:**
    
    ```bash
    cat > ~/.codex/config.toml << 'EOF'
    model_provider = "litellm"
    
    [model_providers.litellm]
    name = "LiteLLM Proxy"
    base_url = "https://your-litellm-proxy.example.com/v1"
    wire_api = "responses"
    http_headers = { "Authorization" = "Bearer sk-YOUR-API-KEY" }
    model_auto_compact_token_limit = 900000
    model_context_window = 1000000
    EOF
    ```
    
    **Using OpenRouter:**
    
    ```bash
    cat > ~/.codex/config.toml << 'EOF'
    model_provider = "openrouter"
    
    [model_providers.openrouter]
    name = "OpenRouter"
    base_url = "https://openrouter.ai/api/v1"
    wire_api = "responses"
    http_headers = { "Authorization" = "Bearer sk-or-YOUR-OPENROUTER-KEY" }
    model_auto_compact_token_limit = 900000
    model_context_window = 1000000
    EOF
    ```
    
    Now, running `codex` in terminal should work! 
    
4. Check Config file if there are issues 
    
    **Config File (`~/.codex/config.toml` )**
    
    **LiteLLM Proxy example:**
    
    ```toml
    model_provider = "litellm"
    
    [model_providers.litellm]
    name = "LiteLLM Proxy"
    base_url = "https://your-litellm-proxy.example.com/v1"
    wire_api = "responses"
    http_headers = { "Authorization" = "Bearer sk-YOUR-API-KEY" }
    model_auto_compact_token_limit = 900000
    model_context_window = 1000000
    ```
    
    **OpenRouter example:**
    
    ```toml
    model_provider = "openrouter"
    
    [model_providers.openrouter]
    name = "OpenRouter"
    base_url = "https://openrouter.ai/api/v1"
    wire_api = "responses"
    http_headers = { "Authorization" = "Bearer sk-or-YOUR-OPENROUTER-KEY" }
    model_auto_compact_token_limit = 900000
    model_context_window = 1000000
    ```
    
5. In Codex, select model with `/model` , select latest frontier model (`gpt-5.4)`  with highest reasoning (`xhigh`)

---

## 3. Install GSD (Get Shit Done)

We'll be using this during the hands-on exercise. Install it now so we don't spend workshop time on setup.

```bash
# Create a workshop project folder, run these in terminal
mkdir workshop-project && cd workshop-project
git init

# Install GSD locally into this project
npx get-shit-done-cc@v1.37.0 # correct as of 20/04/26
```

Verify by opening Claude Code in that folder and typing `/gsd:help`.

> 💡 If you install via `npx get-shit-done-cc@latest` there is an open issue as follows: 
> 
> ![GSD install issue](/images/gsd-install-issue.png)

---

## 4. (Optional) Nice to Have

These aren't required but will make the workshop smoother:

**A code editor** — [VS Code](https://code.visualstudio.com/), [Cursor](https://cursor.com/), or whatever you prefer. Useful for browsing the files that agents generate.

**GitHub CLI** — If you want to follow along with the GitHub integration section:

```bash
# Install: https://cli.github.com/
gh auth login
```

**Familiarity with your terminal** — If you rarely use a terminal, spend 5 minutes getting comfortable with `cd`, `ls`, `mkdir`, and `cat`. Everything in the workshop happens in the terminal.

---

## 5. Come With an Idea

During the workshop, you'll build something from scratch using agentic coding. Come with a simple app idea in mind — it doesn't need to be original or useful. A CRUD app is perfect.

Some ideas to get you started:

- A job application tracker (roles, companies, stages, interview notes)
- A stock tracker (input your own stocks, track green or red history, etc)
- A personal book tracker (title, author, status, notes)
- An expense tracker (transactions, categories, budgets)
- A recipe manager (recipes, ingredients, tags)
- A workout logger (exercises, sets, reps, progress)
- Something completely useless that makes you smile

The simpler the better — the point is to experience the workflow, not to ship a product.

---

## ❓ Having Trouble?

If you get stuck on any step:

1. Copy the error message
2. Paste it into Claude or ChatGPT and ask for help
3. If you're still stuck, reach out in the workshop group chat — someone's probably hit the same issue

See you at the workshop! 🚀

---

[← Back to main page](/docs/)

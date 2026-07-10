---
title: Vision for Text-Only Models
weight: 6
---

Running Claude Code against a custom endpoint whose main model is **text-only** (running example: `minimax-m2.7` behind a LiteLLM gateway) works fine — until an image shows up. This page adds a small `analyze-image` tool that gives your text-only model working eyes by delegating vision to a **multimodal model on the same gateway** (running example: `gemma4-31b`). Substitute your own gateway URL and model names throughout.

## The problem

- Claude Code doesn't interpret images itself. A pasted screenshot (`Alt + v`) — or an image file opened with the `Read` tool — is forwarded to **your model** as an image content block in the API request.
- A text-only model can't consume those blocks: depending on the backend, the gateway rejects the request outright, or the model ignores the image and bluffs from the surrounding text.
- That kills the [Visual Inputs](/docs/agentic-coding-in-terminal/#visual-inputs) workflows — "make it look like this mockup", "why is this layout broken?" — and any UI-verification loop where the agent screenshots the app to check its own work.

## The fix at a glance

Keep your text-only model in charge; give it a tool that can look. The tool sends the image plus a question to a multimodal model already on your gateway and returns a plain-text answer.

```text
you ── screenshot.png + question ──▶ Claude Code (minimax-m2.7, text-only)
                                          │
                                          │  Bash: analyze-image screenshot.png "<question>"
                                          ▼
                                LiteLLM gateway ──▶ gemma4-31b (multimodal)
                                          │
                                          ▼
                      plain-text answer flows back into the conversation
```

> 💡 The vision model doesn't need to be a great coder — it only has to describe what it sees. Even a small multimodal model gives a strong text-only coder usable eyes.

## Prerequisites

- A LiteLLM gateway with at least one **multimodal model** deployed alongside your main model. Any vision-capable model works; we use `gemma4-31b` as the running example.
- A LiteLLM **virtual key** — the same kind you created in the [setup guide](/docs/setup-guide/#option-a-litellm-proxy-self-hosted--org-provided).
- Python 3 on your machine. The tool uses only the standard library — nothing to `pip install`.

## The tool: `analyze-image`

Save this as `~/.claude/tools/analyze-image` (no file extension):

```python
#!/usr/bin/env python3
"""analyze-image — ask a multimodal model about an image, from a text-only session.

Sends an image + question to a vision model behind your LiteLLM gateway and
prints the answer. Configure with env vars:

  LITELLM_BASE_URL   e.g. https://your-litellm-proxy.example.com
  LITELLM_API_KEY    your LiteLLM virtual key
  VISION_MODEL       multimodal model name on the gateway (default: gemma4-31b)

Usage:
  analyze-image screenshot.png "Is the nav bar overlapping the hero section?"
  analyze-image mockup.jpg          # no question = detailed general description
"""

import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request

DEFAULT_QUESTION = (
    "Describe this image in detail. Include any visible text (transcribe it), "
    "UI elements and their layout, colors, and anything that looks broken, "
    "overlapping, misaligned, or unfinished."
)


def fail(msg):
    print(f"analyze-image: {msg}", file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Ask a vision model about an image.")
    parser.add_argument("image", help="path to the image file (png, jpg, webp, gif)")
    parser.add_argument("question", nargs="?", default=DEFAULT_QUESTION,
                        help="what you want to know about the image")
    args = parser.parse_args()

    base_url = os.environ.get("LITELLM_BASE_URL", "").rstrip("/")
    api_key = os.environ.get("LITELLM_API_KEY", "")
    model = os.environ.get("VISION_MODEL", "gemma4-31b")
    if not base_url:
        fail("LITELLM_BASE_URL is not set")
    if not api_key:
        fail("LITELLM_API_KEY is not set")
    if not os.path.isfile(args.image):
        fail(f"no such file: {args.image}")

    mime = mimetypes.guess_type(args.image)[0] or "image/png"
    with open(args.image, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")

    payload = {
        "model": model,
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image_url",
                 "image_url": {"url": f"data:{mime};base64,{b64}"}},
                {"type": "text", "text": args.question},
            ],
        }],
    }
    req = urllib.request.Request(
        f"{base_url}/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json",
                 "Authorization": f"Bearer {api_key}"},
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as e:
        fail(f"gateway returned HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:500]}")
    except urllib.error.URLError as e:
        fail(f"cannot reach gateway: {e.reason}")

    try:
        print(body["choices"][0]["message"]["content"].strip())
    except (KeyError, IndexError, TypeError):
        fail(f"unexpected response shape: {json.dumps(body)[:500]}")


if __name__ == "__main__":
    main()
```

Make it executable, then wire up your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
mkdir -p ~/.claude/tools
chmod +x ~/.claude/tools/analyze-image

# in your shell profile:
export PATH="$HOME/.claude/tools:$PATH"
export LITELLM_BASE_URL="https://your-litellm-proxy.example.com"
export LITELLM_API_KEY="sk-your-litellm-virtual-key"
export VISION_MODEL="gemma4-31b"   # any multimodal model on your gateway
```

Test the plumbing by hand before involving the agent:

```bash
analyze-image some-screenshot.png "What text is on the primary button?"
```

> 💡 **Why the OpenAI-style endpoint?** The script posts to `/v1/chat/completions` in OpenAI multimodal format because that's LiteLLM's lingua franca — the gateway translates it for whatever backend serves your vision model. Your main Claude Code session keeps using the Anthropic-format endpoint from the [setup guide](/docs/setup-guide/); both coexist on the same gateway and key.

> 🧩 Nothing here is Claude Code-specific — the same script works from Codex or any terminal agent that can run shell commands.

## Teach your model to use it

Two pieces: a standing instruction so the model *knows* it has eyes, and a permission rule so using them never prompts.

**1. Add to your user-level `~/.claude/CLAUDE.md`:**

```markdown
## Images (text-only model)

- You cannot see images. Never use the Read tool on image files — you will
  get nothing useful back.
- To understand any image (screenshot, mockup, diagram, photo), run:
  `analyze-image <path> "<specific question>"`
- Ask targeted questions. Call it several times for different aspects
  rather than asking one vague question.
- For UI verification, save a screenshot to a file first, then analyze
  the file.
```

**2. Allow it in `~/.claude/settings.json`** (merge into your existing `permissions` block):

```json
{
  "permissions": {
    "allow": ["Bash(analyze-image *)"]
  }
}
```

## Getting images into the loop

The tool reads images **from disk**, so build one habit: images enter the conversation as **file paths, not pastes**.

| Instead of… | Do this |
| --- | --- |
| Pasting a screenshot with `Alt + v` | Save it to a file and reference the path — dragging the file into the terminal inserts its path |
| "Look at this image" + paste | `analyze the UI in ./shots/login.png — are the fields aligned?` |
| Letting a browser MCP return a screenshot into context | Save it to a file instead (chrome-devtools' `take_screenshot` takes a `filePath` argument that writes to disk rather than attaching the image), then `analyze-image` that file |

A pasted image becomes an image block your model can't read; a file path is just text — and the tool takes it from there.

**The payoff — a self-closing UI-verification loop:** the agent edits CSS → screenshots the page to a file via the browser MCP → runs `analyze-image page.png "Is the modal centered? Does any text overflow?"` → reads the verdict → fixes → repeats. Your text-only model can now check its own visual work.

## ✍️ Hands-on: give your model eyes (10 minutes)

1. Install the script, env vars, CLAUDE.md snippet, and permission rule above.
2. Confirm the plumbing by hand: `analyze-image shot.png` on any screenshot you have lying around.
3. Start Claude Code in a project and put a screenshot of your CRUD app (or any site) into the project folder as `shot.png`.
4. Ask:

    ```text
    Using shot.png, verify: the login form fields are stacked vertically and
    the submit button spans the full form width. Anything misaligned?
    ```

5. Watch the transcript: the model should call `analyze-image` on its own (no permission prompt) and reason from the text answer it gets back.

## Appendix: the same tool as an MCP server

Prefer a first-class registered tool — visible in `/mcp`, with its own permission entry, shareable via a plugin? Wrap the same script as an MCP server. Recall the [general guidance](/docs/agentic-coding-in-terminal/#mcp): models handle CLIs better than MCP tools, and that goes double for smaller local models — measure with *your* model before switching.

Save as `~/.claude/tools/vision_server.py`:

```python
"""vision_server.py — analyze-image, registered as an MCP tool."""
import subprocess

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("vision")


@mcp.tool()
def analyze_image(image_path: str, question: str = "Describe this image in detail.") -> str:
    """Ask the vision model on the LiteLLM gateway about an image file.

    Use this to understand screenshots, mockups, and diagrams you cannot
    see directly. Ask specific questions for best results.
    """
    result = subprocess.run(
        ["analyze-image", image_path, question],
        capture_output=True, text=True, timeout=180,
    )
    if result.returncode != 0:
        return f"analyze-image failed: {result.stderr.strip()}"
    return result.stdout.strip()


if __name__ == "__main__":
    mcp.run()
```

```bash
pip install "mcp[cli]"
claude mcp add --scope user vision -- python ~/.claude/tools/vision_server.py
```

- The server shells out to the `analyze-image` CLI, so the `PATH` and `LITELLM_*` exports from your shell profile must be present in the environment Claude Code launches from.
- Wire up **one** of the two, not both — if you register the MCP tool, drop the CLAUDE.md bullet about running the CLI so the model isn't told two ways to do the same thing.

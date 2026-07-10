---
title: Vision for Text-Only Models
weight: 6
---

If you run Claude Code on a custom endpoint with a **text-only** model (example here: `minimax-m2.7` on a LiteLLM gateway), everything works until someone sends a screenshot. The model can't see it. The fix on this page: a small `analyze-image` tool that passes images to a **multimodal model on the same gateway** (example: `gemma4-31b`) and returns what it sees as plain text. Swap in your own gateway URL and model names throughout.

## The problem

- Claude Code doesn't process images itself. Pasted screenshots (`Alt + v`) and images opened with the `Read` tool go to **your model** as image blocks in the API request.
- A text-only model can't do anything with those blocks. Depending on the backend, the request errors out at the gateway, or the model ignores the image and guesses from the text around it.
- So the [Visual Inputs](/docs/agentic-coding-in-terminal/#visual-inputs) workflows are dead: "make it look like this mockup", "why is this layout broken?", and any loop where the agent screenshots the app to check its own work.

## The fix at a glance

Your text-only model stays in charge. It just gets a tool it can call when it needs to look at something:

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

> 💡 The vision model doesn't have to be good at coding. It only describes what it sees, so even a small multimodal model is enough.

## Prerequisites

- A LiteLLM gateway with at least one **multimodal model** deployed alongside your main model. Any vision-capable model works; `gemma4-31b` is the example here.
- A LiteLLM **virtual key** — the same kind you created in the [setup guide](/docs/setup-guide/#option-a-litellm-proxy-self-hosted--org-provided).
- Python 3 on your machine. The tool uses only the standard library, so there's nothing to `pip install`.

## The tool: `analyze-image`

Save this as `~/.claude/tools/analyze-image` (no file extension):

```python
#!/usr/bin/env python3
"""Ask a multimodal model about an image, from a text-only Claude Code session.

Sends the image and a question to a vision model behind a LiteLLM gateway and
prints the answer. Config comes from env vars:

  LITELLM_BASE_URL   e.g. https://your-litellm-proxy.example.com
  LITELLM_API_KEY    your LiteLLM virtual key
  VISION_MODEL       vision model to use (default: gemma4-31b)

Example: analyze-image screenshot.png "Is the nav overlapping the hero?"
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
        b64 = base64.b64encode(f.read()).decode()

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
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json",
                 "Authorization": f"Bearer {api_key}"},
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as e:
        fail(f"gateway returned HTTP {e.code}: {e.read().decode(errors='replace')[:300]}")
    except urllib.error.URLError as e:
        fail(f"cannot reach gateway: {e.reason}")

    try:
        print(body["choices"][0]["message"]["content"].strip())
    except (KeyError, IndexError, TypeError):
        fail(f"unexpected response shape: {json.dumps(body)[:300]}")


if __name__ == "__main__":
    main()
```

Make it executable, then add the config to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
mkdir -p ~/.claude/tools
chmod +x ~/.claude/tools/analyze-image

# in your shell profile:
export PATH="$HOME/.claude/tools:$PATH"
export LITELLM_BASE_URL="https://your-litellm-proxy.example.com"
export LITELLM_API_KEY="sk-your-litellm-virtual-key"
export VISION_MODEL="gemma4-31b"   # any multimodal model on your gateway
```

Run it once by hand to make sure the plumbing works:

```bash
analyze-image some-screenshot.png "What text is on the primary button?"
```

> 💡 **Why `/v1/chat/completions`?** That's the OpenAI-style endpoint. LiteLLM accepts it for every model it serves and translates the request for whatever backend runs your vision model. Claude Code itself keeps talking to the Anthropic-style endpoint from the [setup guide](/docs/setup-guide/) — both work on the same gateway and key.

> 🧩 None of this is Claude Code-specific: the script works from Codex or any agent that can run shell commands.

## Teach your model to use it

Two pieces: a CLAUDE.md instruction so the model knows the tool exists, and a permission rule so calls don't prompt every time.

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

The tool reads files from disk, so the one habit to build: give the model **file paths, not pastes**.

| Instead of… | Do this |
| --- | --- |
| Pasting a screenshot with `Alt + v` | Save it to a file and reference the path — dragging the file into the terminal inserts its path |
| "Look at this image" + paste | `analyze the UI in ./shots/login.png — are the fields aligned?` |
| Letting a browser MCP return a screenshot into context | Save it to a file instead (chrome-devtools' `take_screenshot` takes a `filePath` argument that writes to disk rather than attaching the image), then `analyze-image` that file |

**Where this pays off:** UI verification. The agent edits CSS, screenshots the page to a file, runs `analyze-image page.png "Is the modal centered? Does any text overflow?"`, reads the answer, fixes, repeats — a text-only model checking its own visual work.

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

If you'd rather have a registered tool — shows up in `/mcp`, gets its own permission entry, can ship in a plugin — wrap the same script as an MCP server. Keep the [general guidance](/docs/agentic-coding-in-terminal/#mcp) in mind, though: models tend to handle CLIs better than MCP tools, smaller local models especially. Test with your model before switching.

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
- Set up **one** of the two, not both. If you register the MCP tool, remove the CLAUDE.md line about the CLI so the model isn't told two ways to do the same thing.

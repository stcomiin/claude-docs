---
title: Vision for Text-Only Models
weight: 6
---

If you run Claude Code on a custom endpoint with a **text-only** model (example here: `minimax-m2.7` on a LiteLLM gateway), everything works until someone sends a screenshot. The model can't see it. The fix on this page: a small `analyze-image` tool that passes images to a **multimodal model** (example: `gemma4-31b`) and returns what it sees as plain text. Two things to know up front: the vision model can live anywhere that speaks the OpenAI API — the same gateway as your main model or a completely different URL — and pasting images stays broken either way; the working habit is image *files*. Swap in your own endpoint and model names throughout.

## The problem

- Claude Code doesn't process images itself. Pasted screenshots (`Alt + v`) and images opened with the `Read` tool go to **your model** as image blocks in the API request.
- A text-only model can't do anything with those blocks. Depending on the backend, the request errors out at the gateway, or the model ignores the image and guesses from the text around it.
- So the [Visual Inputs](/docs/agentic-coding-in-terminal/#visual-inputs) workflows are dead: "make it look like this mockup", "why is this layout broken?", and any loop where the agent screenshots the app to check its own work.

## The fix at a glance

```text
you ── screenshot.png + question ──▶ Claude Code (minimax-m2.7, text-only)
                                          │
                                          │  Bash: analyze-image screenshot.png "<task brief>"
                                          ▼
                          vision endpoint (here: LiteLLM) ──▶ gemma4-31b (multimodal)
                                          │
                                          ▼
                      plain-text answer flows back into the conversation
```

Your text-only model stays in charge — and does the thinking. The vision model is a *sensor*: it doesn't know what you're building or why the screenshot exists. So the main model writes a **task brief** for every call — confirming where UI elements sit is a different brief than checking whether certain text is visible and rendered at the right relative size. The tool contributes the fixed part of the prompt (report only what's visible, transcribe exactly, don't guess); the main model supplies the per-task part. The [CLAUDE.md section below](#teach-your-model-to-task-its-eyes) teaches it how.

> 💡 The vision model doesn't have to be good at coding — it only reports observations, so even a small multimodal model handles "transcribe the button labels" or "is anything overlapping?". But keep it to observations: it can judge size and weight *relatively* ("the heading looks about twice the body size, and bolder"), not name fonts or measure pixels. Exact values you measure in the DOM; how things actually render, you check with its eyes.

> ⚠️ What this does **not** fix: pasting images into the prompt. A paste still becomes an image block in the API request and still fails. The habit that makes everything work is [file paths, not pastes](#getting-images-into-the-loop). (Gateway admins can additionally make accidental pastes fail soft by stripping or auto-transcribing image blocks in a LiteLLM pre-call hook — not covered here.)

## Prerequisites

- A **vision-capable model behind any OpenAI-compatible endpoint** (one that serves `/v1/chat/completions`), plus an API key for it. Commonly that's a multimodal model on the same LiteLLM gateway as your main model, reachable with the same [virtual key from the setup guide](/docs/setup-guide/#option-a-litellm-proxy-self-hosted--org-provided) — but a separate gateway, OpenRouter, or a local vLLM/Ollama server works exactly the same. The vision endpoint is configured independently of the main model.
- Python 3 on your machine. The tool uses only the standard library, so there's nothing to `pip install`.

## The tool: `analyze-image`

Save this as `~/.claude/tools/analyze-image` (no file extension):

```python
#!/usr/bin/env python3
"""Ask a multimodal model about an image, from a text-only Claude Code session.

Sends the image and a task brief to a vision model at any OpenAI-compatible
endpoint and prints the answer. Config comes from env vars:

  VISION_BASE_URL   endpoint root WITHOUT /v1 (e.g. https://your-litellm-proxy.example.com)
  VISION_API_KEY    API key for that endpoint (e.g. your LiteLLM virtual key)
  VISION_MODEL      vision model to use (default: gemma4-31b)

Usage: analyze-image <image> [question ...]
Example: analyze-image screenshot.png "Is the nav overlapping the hero?"
"""

import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request

PREAMBLE = (
    "You are describing an image for an agent that cannot see it. Report only "
    "what is visible. Transcribe text exactly. If part of the image is cut "
    "off, blurry, or ambiguous, say so instead of guessing."
)
DEFAULT_QUESTION = "Describe this image: overall layout, main elements, and any text."


def fail(msg):
    print(f"analyze-image: {msg}", file=sys.stderr)
    sys.exit(1)


def main():
    argv = sys.argv[1:]
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__.strip())
        sys.exit(0 if argv else 1)
    image, question = argv[0], " ".join(argv[1:]) or DEFAULT_QUESTION

    base_url = os.environ.get("VISION_BASE_URL", "").rstrip("/")
    api_key = os.environ.get("VISION_API_KEY", "")
    model = os.environ.get("VISION_MODEL", "gemma4-31b")
    if not base_url or not api_key:
        fail("VISION_BASE_URL and VISION_API_KEY must be set")
    if not os.path.isfile(image):
        fail(f"no such file: {image}")

    mimetypes.add_type("image/webp", ".webp")
    mime = mimetypes.guess_type(image)[0] or "image/png"
    with open(image, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()

    payload = {
        "model": model,
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image_url",
                 "image_url": {"url": f"data:{mime};base64,{b64}"}},
                {"type": "text", "text": f"{PREAMBLE}\n\n{question}"},
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
            raw = resp.read()
    except urllib.error.HTTPError as e:
        fail(f"endpoint returned HTTP {e.code}: {e.read().decode(errors='replace')[:300]}")
    except OSError as e:  # URLError, timeouts, DNS failures, resets
        fail(f"cannot reach endpoint: {e}")

    try:
        choice = json.loads(raw)["choices"][0]
        text = choice["message"]["content"].strip()
    except (ValueError, LookupError, AttributeError, TypeError):
        fail(f"unexpected response: {raw[:300]!r}")
    if choice.get("finish_reason") == "length":
        text += "\n[answer cut off at max_tokens — ask a narrower question]"
    print(text)


if __name__ == "__main__":
    main()
```

Install it:

```bash
mkdir -p ~/.claude/tools
chmod +x ~/.claude/tools/analyze-image
```

Then add the tool's directory to your PATH in your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export PATH="$HOME/.claude/tools:$PATH"
```

The endpoint config does **not** go in your shell profile — it goes in `~/.claude/settings.json` (next section), the same `env` block the setup guide uses for the main model. Values there reach every Bash command and MCP server Claude Code runs, even when Claude Code is launched from an IDE or app launcher that never sources your profile.

Run the tool once by hand to make sure the plumbing works, passing the config inline (your interactive shell doesn't read settings.json):

```bash
VISION_BASE_URL="https://your-litellm-proxy.example.com" VISION_API_KEY="sk-your-key" \
  analyze-image some-screenshot.png "What text is on the primary button?"
```

> 💡 **Why `/v1/chat/completions`?** That's the OpenAI-style endpoint, and LiteLLM, OpenRouter, vLLM, and Ollama all serve it — the script works against any of them. Set `VISION_BASE_URL` to the server root **without** `/v1`; the script appends the full path itself. Claude Code meanwhile keeps talking to your main model exactly as the [setup guide](/docs/setup-guide/) configured it. The two are independent — your vision model does not have to share a URL or key with your main model.

> 🧩 None of this is Claude Code-specific: the script works from Codex or any agent that can run shell commands.

## Teach your model to task its eyes

Two pieces: a CLAUDE.md section that teaches the model to *brief* the vision tool, and a settings block carrying the config plus permissions so calls run without prompting.

**1. Add to your user-level `~/.claude/CLAUDE.md`:**

```markdown
## Images (text-only model)

- You cannot see images. Never use the Read tool on image files — the
  request will fail.
- To understand an image, run: `analyze-image <path> "<task brief>"`
- The vision model knows nothing about your task. Write each brief to name
  the elements you care about and say exactly what to report:
  - Layout: "Find the login form, email field, and submit button. Describe
    their positions relative to each other. Anything overlapping or misaligned?"
  - Text rendering: "Transcribe the heading and all button labels exactly as
    shown. Is any text clipped or overlapping? Does the heading appear larger
    and bolder than the body text?"
- Ask for observations, not conclusions — relative size/weight/position, not
  pixels or font names. For exact values, measure the DOM; use the screenshot
  for how it actually renders.
- One aspect per call — several narrow calls beat one broad question.
- For UI verification, save a screenshot to a file first, then analyze the file.
```

**2. Merge into `~/.claude/settings.json`:**

```json
{
  "env": {
    "VISION_BASE_URL": "https://your-litellm-proxy.example.com",
    "VISION_API_KEY": "sk-your-litellm-virtual-key",
    "VISION_MODEL": "gemma4-31b"
  },
  "permissions": {
    "allow": [
      "Bash(analyze-image *)",
      "Bash(~/.claude/tools/analyze-image *)"
    ],
    "deny": [
      "Read(//**/*.png)",
      "Read(//**/*.jpg)",
      "Read(//**/*.jpeg)",
      "Read(//**/*.webp)",
      "Read(//**/*.gif)"
    ]
  }
}
```

- `env` is the canonical home for the vision config. Point `VISION_BASE_URL` at wherever your vision model actually lives — the same gateway as your main model, or a different one entirely.
- The second `allow` entry covers the model falling back to the full path when `~/.claude/tools` isn't on PATH (e.g. GUI-launched sessions). It only matches that literal `~/…` spelling, so treat it as a fallback — the PATH line is the robust fix.
- The `deny` rules are the mechanical backstop for the CLAUDE.md instruction. Small models forget prose rules mid-session; a deny rule turns "please don't Read images" into "can't" — and the CLAUDE.md line tells it what to do instead. The `//` prefix makes the globs absolute so they apply in every project (a single `/` would be relative to the settings file — a documented trap). They block Claude's Read tool, not the `analyze-image` script's own file access.

## Getting images into the loop

The tool reads files from disk, so the one habit to build: give the model **file paths, not pastes**.

| Instead of… | Do this |
| --- | --- |
| Pasting a screenshot with `Alt + v` | Save it to a file and reference the path — dragging the file into the terminal inserts its path |
| "Look at this image" + paste | `analyze the UI in ./shots/login.png — are the fields aligned?` |
| Letting a browser MCP return a screenshot into context | Save it to a file instead (chrome-devtools' `take_screenshot` takes a `filePath` argument that writes to disk rather than attaching the image), then `analyze-image` that file |

**Where this pays off:** UI verification. The agent edits CSS, screenshots the page to a file, runs `analyze-image page.png "Locate the modal relative to the viewport. Is any text overflowing its container?"`, reads the answer, fixes, repeats — a text-only model checking its own visual work.

## ✍️ Hands-on: give your model eyes (10 minutes)

1. Install the script and PATH line, merge the settings block (env + permissions), and add the CLAUDE.md section above.
2. Confirm the plumbing by hand: the inline-env one-liner above, on any screenshot you have lying around.
3. Start Claude Code in a project and put a screenshot of your CRUD app (or any site) into the project folder as `shot.png`.
4. Ask:

    ```text
    Using shot.png, verify: the login form fields are stacked vertically and
    the submit button spans the full form width. Anything misaligned?
    ```

5. Watch the transcript: the model should call `analyze-image` on its own (no permission prompt) and reason from the text answer it gets back — ideally with a targeted brief per aspect, not one broad question.

## Appendix: the same tool as an MCP server

If you'd rather have a registered tool — shows up in `/mcp`, gets its own permission entry, can ship in a plugin — wrap the same script as an MCP server. Keep the [general guidance](/docs/agentic-coding-in-terminal/#mcp) in mind, though: models tend to handle CLIs better than MCP tools, smaller local models especially. Test with your model before switching.

Save as `~/.claude/tools/vision_server.py`:

```python
"""vision_server.py — analyze-image, registered as an MCP tool."""
import os
import subprocess

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("vision")
TOOL = os.path.expanduser("~/.claude/tools/analyze-image")


@mcp.tool()
def analyze_image(image_path: str, question: str = "") -> str:
    """Ask the vision model about an image file you cannot see directly.

    Write `question` as a task brief: name the elements you care about and
    say exactly what to report (positions, exact text, clipping, relative
    size/weight). Ask for observations, not conclusions; one aspect per call.
    """
    cmd = [TOOL, image_path] + ([question] if question else [])
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    except (OSError, subprocess.SubprocessError) as e:
        return f"analyze-image failed: {e}"
    if result.returncode != 0:
        return f"analyze-image failed: {result.stderr.strip()}"
    return result.stdout.strip()


if __name__ == "__main__":
    mcp.run()
```

```bash
pip install "mcp[cli]"
claude mcp add --scope user vision -- python3 ~/.claude/tools/vision_server.py
```

- The server calls the CLI by absolute path, so it doesn't depend on your shell PATH — and the `VISION_*` config comes from the settings.json `env` block, which MCP servers inherit. Nothing here needs your shell profile.
- The tool's **docstring** carries the brief-writing guidance — for MCP tools, the docstring is what the model reads. An empty `question` falls through to the CLI's default, so defaults live in one place.
- Set up **one** of the two, not both: if you register the MCP tool, remove the CLAUDE.md line about running the CLI (keep the rest of that section — the briefing rules still apply).

---
title: "Lab 6: Verify the feature"
weight: 6
---

<!-- Working review copy. The original Overview and Step 1 were approved. The annotation revisions and remaining sections are saved for review, not final wording approval. -->

## Overview

In Lab 5, you implemented your first ticket and ran the automated checks. Now you'll use Chrome DevTools MCP to check that ticket's behaviour in the running app and inspect how the page looks.

You'll turn the browser checks you performed into a `visual-code-review` skill, run it, then reuse it in a fresh conversation. This skill checks the running app. It is separate from Matt's code reviewer, which reviews code changes.

## Step 1: Check the running app

> **Required concept:** Read [MCP](/docs/agentic-coding-in-terminal/#mcp).

Keep the app running in your first terminal. In Claude Code, enter `/mcp` and check that `chrome-devtools` is connected. If it isn't, revisit [Connect the browser tools](/docs/workshop/01-get-running/#connect-the-browser-tools).

Use the tickets you completed in Lab 5 and check them against their acceptance criteria.

Replace `TICKET-URL` below with your ticket's URL, for example `https://github.com/USERNAME/expense-tracker-workshop-starter/issues/1`. If you completed more than one ticket, include each URL.

{{< details title="If the app isn't running" closed="true" >}}

In your first terminal, open your expense-tracker project folder and run the same command you used in Lab 1:

```sh
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Wait for the server to start, then open **http://127.0.0.1:5173/** in your browser. Leave this terminal running and return to Claude Code in your second terminal.

If port 5173 is already in use, check whether your app is running in another terminal before starting another server.

{{< /details >}}

```text
Use Chrome DevTools MCP to launch a test browser and open
http://127.0.0.1:5173/. Use its browser tools to click through the app,
fill in forms and inspect the results visually. Verify that the
pre-existing functionality still works and the changes in TICKET-URL
work as planned and meet the ticket's acceptance criteria.
Do this as a live browser walkthrough, not by running the existing
Playwright test suite. Capture desktop and narrow screenshots. Save
those screenshots and the report locally in a new folder in this repo.
Do not change app code or tests, or perform Git operations.
```

Watch the browser tool calls. You should see the agent use the app, test the completed tickets and check that adding transactions and filtering still work.

Review the report and screenshots:

- Do the observed results match the tickets' acceptance criteria?
- Can you read the content and use the controls at both widths?
- Does each check show its steps, expected result, observed result and a pass, fail or blocked status?
- Does each failure include enough detail to reproduce it?

If a completed ticket's acceptance criteria aren't met, report a failure. Leave unfinished tickets out of this review.

## Step 2: Create the visual-code-review skill

> **Required concept:** Read [Creating your own skills](/docs/skills-plugins-deep-dive/#creating-your-own-skills).

Stay in the same conversation so the agent can use the browser checks it just performed. Ask it to turn those checks into a project skill:

```text
Create a visual-code-review skill from the browser checks we just
performed. Save it in .claude/skills/visual-code-review/SKILL.md.
Have it accept a ticket URL or file path and an optional app URL,
defaulting to http://127.0.0.1:5173/. Repeat the checks through Chrome
DevTools MCP. On each run, save a report and desktop and narrow
screenshots in a new folder under the system temp directory, and
return its full path. Report findings without changing app code or
tests, or performing Git operations.
```

{{< details title="Optional: Evaluate the skill with Anthropic's skill-creator" closed="true" >}}

Anthropic's [skill-creator](https://code.claude.com/docs/en/skills#run-evals-with-skill-creator) helps draft skills, run test cases and revise the instructions based on the results. Consider it after this lab if you want to compare runs with and without your skill.

For this exercise, use the prompt above and the two runs in Step 3. The workshop setup doesn't include `skill-creator`. Follow Anthropic's linked Claude Code installation instructions if you choose to try it; availability in Claude.ai doesn't establish that it's available in your Claude Code session.

{{< /details >}}

Open `SKILL.md` in your editor. Check that it uses `name: visual-code-review` and describes when to run it. Then check the instructions:

- The skill repeats your Step 1 checks against the supplied ticket and app URL.
- Each check includes its test data, browser actions and expected result.
- The checks cover desktop and narrow layouts. The report includes screenshots and pass, fail or blocked results.
- The skill uses disposable test data and preserves existing records. It reports findings, with separate approval required for code changes, test changes or Git operations.

Keep the skill in this one file. Ask the agent to fill in any missing steps.

{{< details title="Walkthrough: Check for instructions missing from the skill" closed="true" >}}

After `/clear`, Claude won't have the conversation where you performed the checks. This review catches instructions that exist only in that conversation.

Choose one browser check from your Step 1 report and find it in `SKILL.md`. Confirm that the skill says which page to open, which test data to use, what to click and what result to expect. It should also say what evidence to save and how to report a failed or blocked check.

If an instruction refers to "the value we discussed" or "the previous test", ask the agent to replace it with the actual value or steps. If a check was blocked, resolve the blocker and perform it before describing it as a tested procedure.

{{< /details >}}

## Step 3: Run the skill and reuse it in a fresh conversation

The first run checks that Claude can load and follow the skill. The fresh-conversation run checks whether the saved instructions work without the conversation that produced them.

Run the skill in your current conversation. Replace `TICKET-URL` with the same ticket URL or URLs you checked in Step 1. If you use local tickets, supply their file paths instead:

```text
/visual-code-review TICKET-URL
```

Check that the agent loads your skill and performs the browser checks again. Review the new report and screenshots.

{{< details title="If Claude can't find or follow the skill" closed="true" >}}

If Claude doesn't recognise the command, check the filepath. It must be `.claude/skills/visual-code-review/SKILL.md` under your project root, with the front matter at the top of the file.

If the skill still doesn't appear, exit Claude Code and run `claude --continue` from the project root. A restart is needed if `.claude/skills/` didn't exist when the session started.

If the agent skips a step or relies on something from the conversation, update the skill and run it again.

{{< /details >}}

Before clearing the conversation, confirm that the report and screenshots exist in the reported temp folder. Make sure the skill and tickets contain the instructions and acceptance criteria needed for another run.

Start a fresh conversation:

```text
/clear
```

Leave the app running, then invoke the skill again:

```text
/visual-code-review TICKET-URL
```

Check that the agent can repeat the checks using the saved skill and tickets, without you pasting the old conversation. Review the new report and screenshots. If screenshots are missing, ask the agent to capture and save them.

The MCP walkthrough doesn't execute your stored regression tests. You ran those tests in Lab 5; rerun them here so the handoff includes their result alongside the browser review of the current app.

Run this from the project root in a temporary terminal:

```bash
npm test
```

Save the test output with your browser evidence, but keep the results separate. If both pass, continue to Lab 7. No correction is required.

{{< details title="If a check fails or is blocked" closed="true" >}}

Read the finding before deciding what to change:

- If the skill omitted an instruction, update `SKILL.md` and rerun the skill.
- If a browser check or stored test exposes an app defect, reproduce the problem and decide whether to approve a fix. App or test changes need your approval. Don't weaken a test to make it pass.
- If the app, ticket or browser tools are unavailable, resolve that blocker and rerun the check. A blocked check hasn't passed.

After an approved app or test correction, rerun the affected browser checks and `npm test`. Carry unresolved findings into Lab 7. Git operations still require separate approval.

{{< /details >}}

## Checkpoint

- [ ] I've checked the completed tickets, adding transactions and filtering in the browser.
- [ ] I've inspected desktop and narrow screenshots and recorded any failures or blocked checks.
- [ ] I've reviewed `visual-code-review` and run it in both the original and a fresh conversation.
- [ ] I've rerun `npm test` and saved its result with the browser-review evidence.

## What's next

In Lab 7, you'll review the completed work and prepare it for handoff. Keep the reports, screenshots and any unresolved findings available for that review.
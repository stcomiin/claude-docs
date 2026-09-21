---
title: "Lab 7: Review and hand off"
weight: 7
---

<!-- Working review copy. The user requested this draft for annotations. The wording and revised procedure are proposed, not approved or rehearsed. -->
<!-- REVIEW: This draft reuses Lab 5's commits for a final branch review. Additional commits are needed only for reviewed work that is still uncommitted or for approved corrections. -->

## Overview

In Lab 5, `/implement` reviewed and committed your first ticket. In Lab 6, you checked the running app and created `visual-code-review`. Now you'll review the branch you intend to share, address findings and open a draft pull request in your own fork.

Review only the tickets you've completed. The pull request should describe that work and identify the tickets still to do. You don't need to finish the whole monthly-budget feature to hand off the first ticket.

## Step 1: Check what the review will include

Keep working in your expense-tracker project on the feature branch from Lab 5. Open a temporary terminal at the project root:

```sh
git branch --show-current
git status --short
git log --oneline main..HEAD
git diff main...HEAD
```

These commands use `main` as the base branch. If you started the feature from a different branch, replace `main` throughout this lab with that branch.

Check that you're on your feature branch and that the commits and diff contain the completed ticket's changes. If you're on `main`, or the diff is empty, check the branch and commit history before continuing. An empty diff doesn't establish that the work passed review.

Matt's `code-review` skill reviews committed changes. It won't include uncommitted edits or new, untracked files. Check for work left over from Lab 6, including `.claude/skills/visual-code-review/SKILL.md` and any corrections you approved.

Review and explicitly approve any additional commits before continuing. Include only the intended files. Preserve unrelated work and keep credentials, transcripts and generated test output out of the commits.

{{< details title="Walkthrough: Include uncommitted work" closed="true" >}}

Inspect unstaged and staged changes:

```sh
git diff
git diff --cached
```

Open files marked `??` by `git status --short` in your editor. They are untracked, so the diff commands won't show their contents.

Ask Claude to propose the commit:

```text
Show the uncommitted work that belongs in this handoff, including
visual-code-review. Propose the exact files and a commit message.
Don't stage or commit anything until I approve the selection.
```

Inspect the proposed files. Rerun the relevant checks if app code or tests changed. After approving the selection, ask Claude to commit only those files without pushing or rewriting existing commits.

Run `git status --short` again. Confirm that any remaining files are work you deliberately left out, rather than a missing part of the ticket or skill.

{{< /details >}}

## Step 2: Run the code review

> **Required concept:** Read [Working with other agents](/docs/agentic-coding-in-terminal/#working-with-other-agents-sub-agents--agent-teams).

Matt's reviewer delegates two checks to separate subagents. The Standards review checks the project's coding rules. The Spec review checks the implementation against the ticket. This is separate from `visual-code-review`, which uses the running app.

Get the commit where your feature branch and base branch last shared history:

```sh
git merge-base main HEAD
```

Copy the returned hash. Replace `BASE-SHA` below with that hash and `TICKET-URL` with the completed ticket's URL. Include each URL if you completed more than one ticket. For a local tracker, use the ticket's file path.

In Claude Code, enter:

```text
/mattpocock-skills:code-review Review the committed changes since
BASE-SHA against TICKET-URL. Include the current HEAD hash in the report.
Report findings only. Don't change files, commit, push or post to GitHub.
```

Check that the review uses the intended commit range and completed tickets. It should produce separate Standards and Spec reports. If Claude can't read the ticket or skips the Spec review, resolve that problem before treating the review as complete.

Save the report locally with the Lab 6 browser evidence. Keep the base hash and reviewed `HEAD` hash with it so you know which version it describes.

## Step 3: Decide what to fix and verify it

Read each finding and inspect the cited code. Check whether it describes a defect, a project-rule violation or a suggestion you don't need. Ask for an explanation or a reproducing case when the evidence is unclear.

Decide which findings to fix, reject or leave for follow-up. Record your reasons. Include unresolved failures from Lab 6 in this decision. Leave unfinished tickets out of this review, but count any unmet acceptance criterion in a completed ticket as a failure.

If a correction is needed, tell Claude which finding you accept and enter:

```text
Fix only the finding we agreed on. For a behaviour defect, add or update
a regression test without weakening existing checks. Don't commit or push yet.
```

Inspect the changes, then run these commands from the project root:

```sh
npm test
npm run lint
npm run build
```

Keep the app running and repeat the browser verification for the affected ticket:

```text
/visual-code-review TICKET-URL
```

Review the new report and screenshots. After checking the correction, approve a commit of the selected files and repeat Step 2 using the same `BASE-SHA`. The new report must identify the updated `HEAD`.

If no corrections are needed, keep the existing verification evidence and review report. Don't make a change just to produce a finding or another commit. Record any failed or blocked checks as unresolved; don't describe that work as ready to merge.

## Step 4: Open a draft pull request in your fork

> **Required concept:** Read [Working with GitHub](/docs/agentic-coding-in-terminal/#working-with-github).

The pull request description is your handoff. It should tell another developer what changed, how you checked it and what remains unfinished.

Before asking Claude to publish anything, inspect the remote destinations:

```sh
git remote -v
```

Confirm that `origin`, including its push URL, points to your own fork. The pull request must target `main` in that same fork, not `stcomiin/expense-tracker-workshop-starter`.

Replace `YOUR-USERNAME` below with the account that owns your fork:

```text
Prepare a draft pull request for the completed work. Target main in
YOUR-USERNAME/expense-tracker-workshop-starter from my current feature
branch. Show the title, description, commits and exact push and
`gh pr create` commands for my review. Include completed ticket links,
verification results, unresolved findings and the tickets still to do.
Don't push or create the pull request yet.
```

Review the description and proposed commands. Check that:

- The title and description claim only the work you completed.
- The verification results match your saved test output and browser observations. Failed or blocked checks remain visible.
- The proposed commits end at the `HEAD` from your final review. No intended changes remain uncommitted.
- The push targets only your feature branch on your fork. The `gh pr create` command includes an explicit `--repo` for your fork, `--base main`, `--head` for the reviewed feature branch and `--draft`.

Inspect any reports or screenshots before sharing them. Keep them local unless you choose to attach reviewed copies. A local file path in the description won't give a GitHub reviewer access to that evidence; include the observed results in the description itself.

When you're satisfied, explicitly approve publication:

```text
Push only the reviewed feature branch to my fork and create the draft
pull request using the commands and description I approved.
Don't merge it or mark it ready for review. Return the pull request URL.
```

If the push fails, inspect the reason rather than force-pushing. If Claude reports an existing pull request for the branch, inspect it before approving any update.

Open the returned URL. Confirm that it belongs to your fork, shows **Draft**, targets the intended base branch and contains the reviewed commits under **Commits** and **Files changed**. Check the description against your saved evidence.

## Checkpoint

- [ ] I've reviewed the intended commits against the completed tickets and read both the Standards and Spec reports.
- [ ] I've decided what to do with each finding and recorded any unresolved failures or blocked checks.
- [ ] I've rerun the relevant checks after corrections, and the final review identifies the commits in my pull request.
- [ ] I've inspected the draft pull request in my own fork. Its description separates completed work from unfinished tickets.

## After the workshop

Leave the pull request as a draft while you address unresolved findings or finish its scope. Continue the remaining tickets with the same implementation and verification steps, then update the review and handoff to match the new commits.

Before your next coding session, read the ticket, the pull request description and any unresolved findings. Keep `visual-code-review` with the project so you can repeat the browser checks without the workshop conversation.

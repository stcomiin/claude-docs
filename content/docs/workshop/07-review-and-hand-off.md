---
title: "Lab 7: Hand off the work"
weight: 7
---

<!-- Working review copy. Revised from the user's annotations to focus on commits, PR handoff and stacked PRs. The new wording and stacked-PR walkthrough await review and participant rehearsal. -->

## Overview

In Labs 5 and 6, you implemented, reviewed and tested your first ticket. Now you'll commit any remaining files that belong with that work, push the feature branch and open a draft pull request in your own fork.

The pull request description is your handoff. It should explain what you completed, how you checked it and what remains to do. You'll then use stacked pull requests to continue the dependent tickets without waiting for the first PR to merge.

## Step 1: Prepare the files for handoff

Keep working in your expense-tracker project on the feature branch from Lab 5. Open a temporary terminal at the project root:

```sh
git branch --show-current
git status --short
git remote -v
```

Confirm that you're on the intended feature branch and that `origin`, including its push URL, points to your own fork.

Reuse the commits from Lab 5. Check whether any intended work is still uncommitted, such as `.claude/skills/visual-code-review/SKILL.md` or corrections made in Lab 6. Commit only the files you approve for the handoff.

Keep the report and screenshot folders from Lab 6 local. Don't stage them along with the code, or include credentials and transcripts in a commit.

{{< details title="If intended files are still uncommitted" closed="true" >}}

Ask Claude:

```text
Show the uncommitted files that belong in this handoff, including
visual-code-review. Propose the exact files and a commit message.
Wait for my approval before staging or committing. Don't push yet.
```

Inspect the proposed changes with `git diff` and `git diff --cached`. Open untracked files in your editor, since those commands won't show their contents.

After approving the selection, ask Claude to commit only those files without pushing or rewriting existing commits. Run `git status --short` again and confirm that no intended work remains uncommitted.

{{< /details >}}

Use the review and test results from Labs 5 and 6. If app code or tests have changed since those checks, return to the relevant verification steps before claiming they passed. Carry any unresolved findings into the PR description.

## Step 2: Push the branch and open the first PR

> **Required concept:** Read [Working with GitHub](/docs/agentic-coding-in-terminal/#working-with-github).

This first PR covers issue #1 in our example. Replace `TICKET-URL` with your completed ticket's URL and `YOUR-USERNAME` with the account that owns your fork:

```text
Prepare a draft PR for TICKET-URL in
YOUR-USERNAME/expense-tracker-workshop-starter. Use my current feature
branch as --head and main as --base. Pass my fork explicitly with --repo.
Include what changed, the verification results, unresolved findings
and the next ticket. Show the description, commits and exact push and
PR creation commands. Don't push or create the PR until I approve them.
```

Check that the description matches the completed ticket and your saved evidence. It shouldn't claim that unfinished tickets are complete. Summarize the test results and browser observations in the description. A local report path alone won't give another developer access to that evidence.

Inspect any screenshots before choosing to attach them. Confirm that the proposed push targets only your feature branch on your fork, and that `gh pr create` includes `--draft`, the correct `--repo`, `--base` and `--head`.

After approving the description and commands, enter:

```text
Push the approved feature branch to my fork and create the draft PR
using the description and commands I approved. Return its URL.
Don't merge it or mark it ready for review.
```

If the branch already has a PR, inspect it before approving an update instead of creating a duplicate. If a push is rejected, inspect the reason rather than force-pushing.

Open the returned URL. Confirm that the PR belongs to your fork, shows **Draft**, targets `main` and contains the intended files under **Files changed**. Keep its URL and branch name for the next step. The PR number may differ from the issue number.

## Step 3: Stack the remaining tickets

> **Required concept:** Read [About stacked pull requests](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs).

Leave the first PR open. A stacked PR targets the branch of the PR it depends on, so its diff shows only the next ticket's changes. You can continue dependent work before the earlier PR merges.

For example, if issue #2 depends on issue #1, and issue #3 depends on issue #2:

| PR for | Head branch | Base branch |
| --- | --- | --- |
| Issue #1 | Issue #1's branch | `main` |
| Issue #2 | Issue #2's branch | Issue #1's branch |
| Issue #3 | Issue #3's branch | Issue #2's branch |

Use the dependencies from your Lab 4 tickets. Independent work can branch from `main` instead. Keep every branch and PR in your own fork, since GitHub doesn't support cross-fork stacks.

Continue with the remaining tickets now if you have time, or after the workshop. If your plan has only two tickets, stop with a two-PR stack.

### Create the next branch and implement its ticket

Replace `ISSUE-2-URL` with your next ticket's URL and `ISSUE-1-PR-URL` with the PR URL from Step 2:

```text
Create and switch to a feature/[ID]-short-description branch for
ISSUE-2-URL, based on the branch in ISSUE-1-PR-URL. Stop if the new branch
already exists or app or skill changes are uncommitted. Preserve the
local evidence files. Don't implement or push yet.
```

Confirm the new branch, then implement its ticket:

```text
/mattpocock-skills:implement ISSUE-2-URL
```

Follow the implementation and verification steps in [Lab 5](/docs/workshop/05-implementation/#step-3-implement-the-first-ticket-via-implement) and [Lab 6](/docs/workshop/06-verify-the-feature/). Reuse your existing `visual-code-review` skill for this ticket rather than creating it again. Keep each ticket's tests with its implementation.

### Open the dependent PRs

Repeat Step 2 for issue #2, changing `--base` from `main` to issue #1's branch. Use issue #2's branch as `--head`. Link the first PR in the description as a dependency, alongside this ticket's verification results.

Approve the push and PR creation separately for this branch. In **Files changed**, check that the PR shows issue #2's changes without repeating issue #1's diff. If it includes both, check the base branch before continuing.

Repeat for issue #3, creating its branch from issue #2's branch and targeting that branch in its PR. Use each ticket's actual URL and branch name, and include the preceding PR's URL in the handoff.

### Link the PRs as a GitHub stack

This walkthrough uses GitHub's website to link the existing PRs. You don't need to install the `gh stack` extension.

Follow GitHub's [instructions for turning existing PRs into a stack](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-stacked-pull-requests#turning-existing-pull-requests-into-a-stack):

1. Open one of your dependent PRs. GitHub shows a recommendation banner when it recognizes the chain of base and head branches.
2. Select the banner to preview the stack. Check that the first ticket's PR is at the bottom, targeting `main`, with each dependent PR above its prerequisite.
3. Confirm the stack. Check that GitHub shows a stack map and that you can navigate between the PRs.

GitHub's stack UI is in public preview. If the banner doesn't appear, check the branch relationships against the table and the current GitHub guide. Until GitHub confirms the stack, you have dependent PRs but haven't completed the linking step.

Leave the PRs as drafts for this exercise. Merging a higher PR in a GitHub stack also merges the unmerged PRs below it, so don't use merge as a way to test the stack.

## Checkpoint

- [ ] I've committed the intended code and project skill without adding the local evidence folders.
- [ ] I've opened and inspected the first draft PR in my own fork.
- [ ] Its description records the completed ticket, verification results, unresolved findings and next ticket.
- [ ] If I've continued with dependent tickets, each PR targets the correct branch and GitHub shows the linked stack.

## After the workshop

Continue any unfinished tickets on their own branches. Keep each PR description current so another developer can see its dependency, verification results and next action without reading your agent conversation.

If an earlier PR changes, the branches above it need to pick up that change. Follow GitHub's [stack management guide](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/managing-stacked-pull-requests) before rebasing or updating remote branches. Those operations need separate approval. Merging the PRs is outside this exercise.

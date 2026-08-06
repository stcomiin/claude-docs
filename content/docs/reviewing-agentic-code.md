---
title: How to Review an Agent Pull Request in an AI-Native Engineering Team
weight: 7
---

Agents can write a whole feature from a prompt, and teams that lean on them ship faster. But a team isn't one person in a terminal. On a real brownfield codebase you still need human eyes on the work: to catch the logic an agent got subtly wrong, the security hole it missed, or the edge case that only makes sense once you know the rest of the system. This page is where to start if you're building an AI-native team, or moving an existing one that way. It covers how to review the pull requests an agent, or a teammate using one, actually hands you.

## Developer workflow vs. team workflow

This workshop has walked you through frameworks and workflows that move away from vibe coding and toward a spec-driven mental model. You plan first, then ship features backed by a strong test suite. After implementation, you run the feature through AI code review to catch and patch issues, then run UAT yourself, clicking through the UI to confirm everything works end to end. That's the workflow for one developer on one feature. Working in a team is a different problem.

For teams, AI is a genuinely useful reviewer too. Plenty of teams already run AI review bots on GitHub or GitLab as a first pass. But when several engineers share a brownfield codebase, AI review can't replace human judgment on quality and security, or on whether the thing will still be maintainable a year from now. It also produces more code than before, and once output grows faster than the team can verify it, review becomes the rate limiter. That's the problem this model solves: how to structure review so the tech leads and seniors don't drown.

## A model for AI-native teams

The model has two pieces. First, a stacked PR workflow that breaks a feature into a chain of small, dependent pull requests instead of one big one. Second, a review workflow we've been experimenting with for AI-native teams: when and how a senior reviewer comes in.

### The stacked PR model

With an agent like Claude Code, you can tell it to make one giant change all at once and drop it in a single PR. Don't. A dump of agent-written code will drown the PR reviewer. Small, stackable PRs are better, so reviewers aren't having to go through the whole feature in one sitting. GitHub's [stacked pull requests](https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview/) entered public preview in July 2026, and GitLab documents the same pattern as [stacked merge requests](https://docs.gitlab.com/user/project/merge_requests/reviews/stacked_merge_requests/).

A stacked PR chain usually looks like this. The first PR carries only the plan or spec, and a senior developer reviews it for direction and risk before it merges to main. Once that's approved, the junior developer (or the agent working under their direction) builds the feature as a sequence of PRs stacked on top of each other. Each PR is one vertical slice, branched off the PR before it, with its own tests included. The last PR in the stack is the integration and end-to-end layer, where the whole feature comes together and gets deployed and verified as one unit. It holds the end-to-end test files that exercise the full journey across both slices, the fixtures or seed data those tests need, and whatever deployment or CI config gets the E2E suite running against the dev environment.

```text
PR 1: plan/spec → main
      senior reviews direction and risk, then merges it

PR 2: vertical slice A + tests → main
PR 3: vertical slice B + tests → PR 2 branch
PR 4: integration/E2E layer → PR 3 branch
      full stack deployed and verified
      senior reviews PRs 2-4 bottom-up
      approved stack merges bottom-up
```

### When the senior reviewer steps in

The senior's first checkpoint is the plan itself, and only for high-risk work: architectural, security-sensitive, compliance-related, or just plain complex. That's the one review that has to happen before implementation starts, since everything downstream depends on the direction being right.

This complements the GSD or BMAD workflows, where GSD's `/gsd-discuss-phase` and `/gsd-plan-phase` or BMAD's brainstorming and planning flow generate these spec docs for review. 

Once the plan is approved, the junior developer builds, reviews, and tests each vertical slice, then deploys to a dev environment to run the integration-layer testing for developer UAT. 

**Development**
1. Plan
2. Develop ("develop" here is whatever your team's execution tooling already does, GSD's `/gsd-execute-phase` and BMAD's equivalent both implement a plan with atomic commits and checkpoints)
3. Write test cases

**Review**
1. Run through agentic code review
2. Fix all bugs the review surfaces
3. Run e2e Playwright tests

**Dev deployment**
1. Deploy the feature branch to a dev environment, a replica of production, not localhost, for developer UAT
2. Confirm the e2e tests still pass once deployed

Only after dev deployment is done does the senior review the code. At that point they review the whole feature and merge the approved PRs bottom-up.

### What the last PR needs to carry

Since PR 4 is where the senior does their real review, it should read like a PR Contract, not just a diff. A consistent template makes that easy to write and easy to review:

```markdown
## Intent
What user, system, or operational behavior changes, in 1-2 sentences.

## Scope
What's included. What's intentionally out of scope.

## Risk areas
- Auth / permissions:
- Data shape / migrations:
- External calls / jobs:
- Customer-visible behavior:
- Risk tier: low / medium / high

## Verification
- Automated tests:
- Manual checks:
- Known gaps:

## AI-assisted work
Did an assistant or agent generate or substantially rewrite meaningful parts of this PR? If yes, which parts, and what did you verify yourself?

## Review focus
1-2 areas where you specifically want the senior's judgment (e.g. the payments flow, a schema change).
```

Here's what that looks like filled in, for a sample CSV export feature:

```markdown
## Intent
Adds bulk CSV export for the reporting dashboard, so users can export a saved report view instead of copying data out by hand.

## Scope
Included: CSV export that respects active filters, for datasets up to 250k rows.
Out of scope: scheduled/recurring exports, XLSX format.

## Risk areas
- Auth / permissions: export endpoint checks team ownership before allowing a download
- Data shape / migrations: none, read-only endpoint
- External calls / jobs: none
- Customer-visible behavior: new "Export CSV" button on the report view
- Risk tier: low

## Verification
- Automated tests: `export.spec.ts`, `export.perf.spec.ts`, `export.permissions.spec.ts`, all passing
- Manual checks: dev UAT completed 2026-XX-XX against preview https://dev.example.com/pr-145, commit `a1b2c3d`
- Known gaps: no rate limiting on export requests yet

## AI-assisted work
Implementation was agent-generated from the plan in PR #142. I reviewed every diff, ran the perf test locally against a 250k-row dataset, and manually verified the permission checks myself.

## Review focus
Should CSV exports be rate-limited per user? Not scoped in the original plan.
```

Not every feature needs a PR 4. If there's no integration or E2E work to gather up, skip it and put the handoff packet on the topmost PR you do have.

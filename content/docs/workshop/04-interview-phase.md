---
title: "Lab 4: Interview phase"
weight: 4
---

## Overview

You've explored the app and set up project instructions. Now let us work toward building a new feature: a monthly-budget feature. Before diving straight into asking the agent to implement it, we should discuss with the agent how this feature should work.

You will use the `grill-with-docs` skill to trigger your agent to conduct an interview session until you and your agent reach a shared understanding of what the feature should and shouldn't do. We will then use `to-spec` to turn the conversation into a specification for you to review. Once you have reviewed it, we will use `/to-tickets` to convert it into tickets and publish them to your chosen issue tracker.

For the purposes of this workshop, we will be using [Matt Pocock's Skill For Real Engineers](https://github.com/mattpocock/skills) to drive our spec-driven development. For your own development, other approaches like [GSD](https://github.com/open-gsd/gsd-core), [BMaD Method](https://github.com/bmad-code-org/bmad-method), [OpenSpec](https://github.com/Fission-AI/openspec), [Spec Kit](https://github.com/github/spec-kit) and [Superpowers](https://github.com/obra/superpowers) can also be considered.

## Before you begin

Configure Matt Pocock's engineering skills once for your fork. Installing the plugin alone doesn't configure its issue tracker or domain-document locations. The current `to-spec` and `to-tickets` skills expect this setup.

Replace `YOUR-USERNAME` with the account that owns your fork. Check that your fork has an **Issues** tab. If it doesn't, run this in a temporary terminal:

```sh
gh repo edit YOUR-USERNAME/expense-tracker-workshop-starter --enable-issues
```

In Claude Code, enter:

```text
/mattpocock-skills:setup-matt-pocock-skills Configure GitHub Issues for
YOUR-USERNAME/expense-tracker-workshop-starter, my own fork, not upstream.
Verify the repository first. Show the proposed instruction, tracker,
domain-document and label changes, and wait for my approval before
applying them. Don't create issues, commits or pull requests.
```

Review the destination and approve only the setup changes you want. The skill records the tracker in `docs/agents/issue-tracker.md` and the domain-document layout in `docs/agents/domain.md`, then links them from your existing `CLAUDE.md` or `AGENTS.md`. It may also configure triage labels. See the [setup skill's instructions](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md).

## Step 1: Start the interview

> **Required concept:** Read [Skills](/docs/skills-plugins-deep-dive/#skills).

Use Matt Pocock's `grill-with-docs` skill to work through the feature requirements. In Claude Code, enter:

```text
/mattpocock-skills:grill-with-docs I want to add a monthly-budget feature to this expense tracker.
```

Answer the agent's questions. If a recommendation doesn't match what you want, say so. If you're unsure about an option, ask the agent to explain it before deciding.

The skill may record agreed terms in `GLOSSARY.md` and qualifying decisions in `docs/adr/`. Review any documentation it writes. Older installations used `CONTEXT.md`; the setup skill can offer to migrate that legacy name.

Keep discussing anything that's unclear. Once you and the agent agree on what to build and what to leave out, you're ready to write the specification.

## Step 2: Draft and review the specification

Stay in the same conversation so the agent can use the decisions from your interview.

The `to-spec` skill normally publishes to the issue tracker configured above. For this review, explicitly ask it to show the draft in chat without publishing:

```text
/mattpocock-skills:to-spec Draft the specification with testable acceptance criteria. Show it in chat. Don't configure the issue tracker or publish anything yet.
```

Read the draft and check that:

- It describes the behaviour you agreed on during the interview.
- Its acceptance criteria explain how you'll know the feature works.
- It includes what you agreed to leave out.

Ask for changes if anything is missing, unclear or different from what you discussed.

After reviewing the specification, you'll use the `/to-tickets` skill to convert it into tickets and publish them to your chosen issue tracker. You can use a local Markdown tracker or GitHub Issues. For this lab, we'll use GitHub Issues.

## Step 3: Publish the tickets to GitHub

> **Required concept:** Read [Working with GitHub](/docs/agentic-coding-in-terminal/#working-with-github).

Use the same GitHub fork you configured before the interview, not the workshop repository. Return to your interview conversation and enter:

```text
/mattpocock-skills:to-tickets Use the reviewed specification.
Use GitHub Issues for issue tracking. Create only 2 or 3 issues
in my fork, not the upstream repository. Check my fork's owner
and repository name, and pass that repository explicitly with --repo.

Show which ticket covers each acceptance criterion, and flag any gaps.
Include the specification's out-of-scope items in the relevant tickets.
Wait for my approval before publishing.
```

For this workshop, we'll group the specifications into 2 or 3 issues in the interest of time. This is just a workshop limit and shouldn't be a constraint in your own projects.

The skill will propose a ticket breakdown before publishing. Review what each ticket delivers and which tickets depend on others. Ask it to merge or split tickets if needed.

Before approving publication, check that the work matches your specification and the destination is your fork.

After publication, open the returned links and check the tickets in GitHub.

## Checkpoint

- [ ] The engineering skills are configured to use GitHub Issues in my own fork.
- [ ] I've reviewed the specification, including its acceptance criteria and what we agreed to leave out.
- [ ] My fork has 2 or 3 published issues that match the specification.
- [ ] I understand what each issue delivers and which issues depend on others.

## What's next

In [Lab 5: Implementation](/docs/workshop/05-implementation/), you'll create a feature branch and start implementing the tickets using Matt Pocock's `/implement` skill, which uses the test-driven development approach.

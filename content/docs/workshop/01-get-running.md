---
title: "Lab 1: Get running"
weight: 1
prev: /docs/setup-guide
---

## Overview

In this lab, you'll prepare the Expense Tracker project for the workshop. You'll fork the workshop repository through GitHub's website or the GitHub CLI, then clone your fork locally using Git.

You'll install the dependencies and run the app in one terminal, then open Claude Code, or any coding harness of your choice, in a second terminal.

By the end of the lab, you'll have your own copy of the Expense Tracker running locally and your coding agent ready to work in the project.

## Before you begin

Complete the [Setup Guide](/docs/setup-guide/), then check:

- Your coding harness is authenticated and ready to use.
- Git and GitHub CLI are installed, with `gh` signed into the account that will own your fork.
- The required Node.js and npm versions are installed.
- Open a terminal in the folder where you want to clone the project. On Windows, you can use PowerShell or Git Bash.

You'll fork and clone the repository in Step 1.

## Step 1: Fork and clone

Start by creating your own fork of the workshop repository. Choose one of the following methods.

### Option A: Use GitHub's website

1. Open the [workshop repository](https://github.com/stcomiin/expense-tracker-workshop-starter).
2. Click **Fork**.
3. Under **Owner**, select your GitHub account.
4. Keep the repository name `expense-tracker-workshop-starter`.
5. Click **Create fork**.

Check that the new repository belongs to your account and shows the workshop repository as its parent.

### Option B: Use GitHub CLI

Check which account you're signed into:

```sh
gh auth status
```

Confirm that you can access the teaching repository:

```sh
gh repo view stcomiin/expense-tracker-workshop-starter
```

If either command fails, stop and resolve the problem before continuing.

Create the fork:

```sh
gh repo fork stcomiin/expense-tracker-workshop-starter --clone=false --remote=false
```

This creates the fork on GitHub.

### Clone your fork

On your fork's GitHub page, click **Code**, select **HTTPS** and copy the URL.

In your terminal, run the following command, replacing the example URL with the one you copied:

```sh
git clone https://github.com/YOUR-USERNAME/expense-tracker-workshop-starter.git
```

After cloning finishes, move into the project folder:

```sh
cd expense-tracker-workshop-starter
```

Check where the clone points:

```sh
git remote -v
```

The `origin` entries should show your fork's URL.

## Step 2: Install dependencies and run the app

### Install dependencies

From the project folder, run:

```sh
npm ci
```

After it succeeds, install Chromium for the workshop's browser tools:

```sh
npx playwright install chromium
```

### Run the app

```sh
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open **http://127.0.0.1:5173/** in your browser.

Leave this terminal running. When you're ready to open Claude Code, use a second terminal in the same project folder.

## Step 3: Open Claude Code

Leave the app running in your first terminal. Open a second terminal in the `expense-tracker-workshop-starter` folder.

Start Claude Code, or any coding harness of your choice. For Claude Code, run:

```sh
claude
```

Read the workspace-trust message and confirm it names your project folder before accepting.

### Connect the browser tools

The starter includes a `chrome-devtools` MCP server. It lets your agent inspect and interact with the app in a browser.

If Claude asks to enable it, review the project's `.mcp.json` configuration before approving that server.

Inside Claude Code, enter:

```text
/mcp
```

Check that `chrome-devtools` shows as connected. If it reports an error, inspect the server's details. If it isn't listed, check that you launched Claude from the cloned project folder.

Return to the conversation prompt and leave the session open for the next lab.

## Checkpoint

Before moving on, confirm:

- [ ] Your local repository's `origin` points to your own GitHub fork.
- [ ] The app opens at **http://127.0.0.1:5173/**, with its server still running in the first terminal.
- [ ] Claude Code, or your chosen harness, is open in the same project folder in the second terminal.

## What's next

In [Lab 2: Explore the codebase](/docs/workshop/02-explore-the-codebase/), you'll work with your agent to explore how the app handles transactions, totals and filters before making changes.

Leave both terminals open for the next lab.

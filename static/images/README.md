# Diagram sources

These diagrams are stored locally so the documentation does not depend on third-party image requests. Downloaded images retain their original bytes and native resolution; SVG diagrams remain vectors. Each documentation section credits its source.

## Agent Skills

Source: Anthropic, [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).

The files below come directly from the article's CDN assets, bypassing its resized, quality-75 image proxy. The virtual-machine overview is intentionally omitted.

| Local file | Native size | Original asset |
| --- | --- | --- |
| `agent-skills-anatomy.jpg` | 1650 × 929 | [JPEG](https://www-cdn.anthropic.com/images/4zrzovbb/website/6f22d8913dbc6228e7f11a41e0b3c124d817b6d2-1650x929.jpg) |
| `agent-skills-supporting-files.jpg` | 1650 × 1069 | [JPEG](https://www-cdn.anthropic.com/images/4zrzovbb/website/191bf5dd4b6f8cfe6f1ebafe6243dd1641ed231c-1650x1069.jpg) |
| `agent-skills-progressive-disclosure.jpg` | 2292 × 673 | [JPEG](https://www-cdn.anthropic.com/images/4zrzovbb/website/a3bca2763d7892982a59c28aa4df7993aaae55ae-2292x673.jpg) |
| `agent-skills-context-window.jpg` | 1650 × 929 | [JPEG](https://www-cdn.anthropic.com/images/4zrzovbb/website/441b9f6cc0d2337913c1f41b05357f16f51f702e-1650x929.jpg) |
| `agent-skills-code-execution.jpg` | 1650 × 929 | [JPEG](https://www-cdn.anthropic.com/images/4zrzovbb/website/c24b4a2ff77277c430f2c9ef1541101766ae5714-1650x929.jpg) |

## Other concepts

| Local file | Format / native size | Documentation placement | Source / original asset |
| --- | --- | --- | --- |
| `claude-code-overview.svg` | SVG, 1200 × 880 viewBox | Workshop Overview | Original component map based on the current workshop docs. Claude Code is the central hub; the eight branches describe related capabilities, not an execution sequence. |
| `claude-agentic-loop.svg` | SVG, 720 × 280 viewBox | Tools | [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works#the-agentic-loop) · [SVG](https://mintcdn.com/claude-code/ikqp3_70mqIahteV/images/agentic-loop.svg) |
| `claude-session-continuity.svg` | SVG, 560 × 280 viewBox | Stop/Resume/Continue | [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works#resume-or-fork-sessions) · [SVG](https://mintcdn.com/claude-code/ikqp3_70mqIahteV/images/session-continuity.svg) |
| `context-engineering.png` | PNG, 2292 × 1290 | Context & Memory | [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [PNG](https://www-cdn.anthropic.com/images/4zrzovbb/website/faa261102e46c7f090a2402a49000ffae18c5dd6-2292x1290.png) |
| `mcp-architecture.svg` | SVG, 980 × 500 viewBox | MCP | Original illustration adapted from the official [MCP architecture overview](https://modelcontextprotocol.io/docs/learn/architecture), using the site's palette and typefaces. |
| `evaluator-optimizer.png` | PNG, 2401 × 1000 | GSD: Two layers of verification | [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents#workflow-evaluator-optimizer) · [PNG](https://www-cdn.anthropic.com/images/4zrzovbb/website/14f51e6406ccb29e695da48b17017e899a6119c7-2401x1000.png) |

The evaluator diagram illustrates a general feedback loop, not GSD's internal architecture. The existing subagent, hooks, permissions, and prompt-caching diagrams already cover those topics, so this selection adds complementary visuals.

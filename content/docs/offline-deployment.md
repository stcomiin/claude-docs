---
title: Offline/On-Prem Deployment with local models
weight: 6
---

Running Claude Code-style agentic workflows fully offline using locally hosted open-weight models in place of the Anthropic API.

## Offline models vs. online Claude: our experience and takeaways

Opus is/was the frontier coding model, so using minimax-m2.7 for offline use after using Opus extensively takes some getting used to.

The flagship Claude and GPT models understand your intent well and scope their requests accordingly, covering as much or as little of the codebase as needed. They "get" what you mean when you ask "How does the auth module work, break it down and implement a new multi-tenancy setup for a new usergroup which requires linking to an existing Keycloak instance using SAML".


## Installing and Updating with NPM

Installation is done using npm package `npm install -g @anthropic-ai/claude-code`. Simply mirror this package in your offline NPM repo.

Updating is actually pretty straightforward, simply run `claude update` in terminal and it will update the install with the latest version available from your offline NPM repo.

## Model setup and inference with vLLM

We have been continuously updating the models that we are running for chatbot and agentic coding usecases. The current models we are using are `gpt-oss-120b` and `minimax-m2.7`.
`gpt-oss-120b` is a general purpose model for coding, summarization, devops and other use cases with large paramater count but still returning fast responses due to MoE of A5B. This is a good balance of speed and general knowledge.

`minimax-m2.7` is the latest class of models from MiniMax. We have been using M2.5 before this but the model was frequently removing `s` from the end of variables which mess up its capabilities significantly when used for coding, and is a known issue with the model (https://huggingface.co/MiniMaxAI/MiniMax-M2.5/discussions/48)

We have allocated 4 HP Z8 workstations for serving the minimax model. Each node comes with 2 Ampere RTX A6000 connected via NVLink, so each node has 96GB of VRAM. Nodes are connected via gigabit Ethernet connections on a dedicated 2nd NIC. The 2nd NIC is used as the interface for NCCL and cross-node communications.

The quant we are using is `cyankiwi/MiniMax-M2.7-AWQ-4bit`. The full precision model released by MiniMax is actually just FP8 which is great, as it is supported in vLLM for Ampere cards via Marlin kernel weight-only quantization (W8A16). Activation quantization A8 is only supported on Hopper and newer cards. However the FP8 weights are about 230GB, which requires 3 nodes to serve. I have tried running the full precision model across 4 nodes and singular requests are actually fast with token generation around 50-80 tokens/s, but parallel requests with batch size > 1 invoke significant slowdown which is pretty much unusable for agentic coding with multi devs.


Setting KV-cache offloading to RAM

## KV-cache aware routing

## Claude Code variables for KV cache reuse

## LiteLLM as central marketplace

## Central management with Group Policy

## Benchmarking
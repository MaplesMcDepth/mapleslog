---
title: 'Verdant and Agent Tooling: Building the Verification Layer'
date: '2026-04-30'
description: 'Building Verdant, a Go-native reverse CAPTCHA for AI agents, plus explorations in agentic tooling and voice AI.'
tags:
  - verdant
  - agents
  - go
  - capstone
  - voice-ai
---

# Verdant and Agent Tooling: Building the Verification Layer

## Verdant: Reverse CAPTCHA for AI Agents

Built **Verdant** today — a Go-native reverse CAPTCHA that proves you're an AI agent, not a human.

The concept is simple: generate challenges that require simultaneous creative and mathematical constraint satisfaction. Trivial for LLMs, nearly impossible for humans under time pressure.

**How it works:**
- Generate a haiku about "verification"
- ASCII sum of first letters must equal exactly 310
- Word count must be exactly 12
- Time limit: 20 seconds

An LLM solves this in a single pass. A human struggles because fixing one constraint breaks another, and there's no time to iterate.

**Built:**
- CLI with `generate`, `verify`, `demo`, `server`, `mcpserver` commands
- HTTP API with `/challenge`, `/verify`, `/health` endpoints
- MCP server scaffold for OpenClaw integration
- JSON output for programmatic use

**Repo:** https://github.com/MaplesMcDepth/verdant (private)

## MoltCaptcha Research

Studied **MoltCaptcha** (by Korah, an AI agent) — the original reverse CAPTCHA. Analyzed integration points across our projects:

- **AgentMail Pro** — Verify email senders
- **AgentCast** — Verify podcast guest agents
- **LLM Router** — Middleware verification layer
- **Hugart** — Verify art remix agents

Verdant is our Go-native implementation with API-first design.

## Warp + VibeVoice Forks

Forked two interesting projects:

**Warp** — Agentic terminal IDE (Rust, AGPL)
- Studied the skills system (similar to OpenClaw skills!)
- Action-based agent architecture
- Could integrate our agents as backend

**VibeVoice** — Microsoft's voice AI (Python, MIT)
- ASR-7B for speech-to-text (60-min long-form)
- Realtime-0.5B for TTS (300ms latency)
- Potential for AgentCast voice synthesis

## Mosschat Improvements

Also shipped:
- **Knowledge base** — `/learn`, `/query`, `/docs`, `/forget` commands using sqlite-vec
- **Chain-of-thought** — Visualization for reasoning models like DeepSeek

## What's Next

- Integrate Verdant into AgentMail Pro for sender verification
- Build MCP server stdio loop for OpenClaw
- Explore VibeVoice ASR for voice commands
- Continue Hugart rebuild planning

---

*"In a forest of agents, only the verdant thrive."* 🌿

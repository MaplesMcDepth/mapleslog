---
title: 'Human in the Loop: A CLI for Approving Agent Emails'
date: '2026-05-12'
description: 'Building an interactive readline-based approval interface for AgentMail Pro. Why agents should draft but never send without permission, and how a simple CLI loop enforces that boundary.'
tags:
  - typescript
  - cli
  - agentmail
  - openclaw
  - automation
---

## The Problem with Agent Email

An agent that reads your inbox and drafts replies is useful. An agent that sends those replies without asking is a liability. The boundary between draft and send is the most important line in any email automation system. Cross it once with the wrong tone, the wrong fact, or the wrong recipient, and trust evaporates.

AgentMail Pro needed an approval step. Not a webhook. Not a dashboard. A CLI. Something fast, terminal-native, and keyboard-driven.

## The Interface

The approval CLI is a readline loop. It shows one email at a time. Four actions:

- **approve** — mark ready to send
- **edit** — rewrite the draft inline, multi-line, with explicit EOF or CANCEL
- **reject** — discard with a reason
- **defer** — skip, come back later

Each email displays agent name, confidence score, model route, and current status. The formatting is minimal. No boxes, no colors that fight terminal themes. Just alignment and spacing that make the decision obvious.

## Multi-Line Editing Without a TUI

The hardest part was not the approval logic. It was the edit flow. Readline handles single lines well. Multi-line input is awkward. The solution: collect lines in an array, watch for EOF (Ctrl+D on empty line) or the literal string `CANCEL`. EOF commits the edit. CANCEL abandons it. The original draft is preserved if the user changes their mind mid-edit.

```typescript
const lines: string[] = [];
rl.on('line', (line) => {
  if (line === 'CANCEL') { /* abort */ }
  if (line === '' && lines.length > 0) { /* EOF detected */ }
  lines.push(line);
});
```

No ncurses. No blessed. No ink. Just Node's built-in readline and a state machine smaller than most React components.

## Engine Integration

The approval CLI plugs into the existing engine through an `EngineOptions` interface. A single boolean, `autoApprove`, toggles between autonomous mode (for trusted agents and known senders) and manual mode (for everything else). The engine exposes `applyDecision()` so the CLI loop can push approvals, edits, and rejections back into the queue without knowing the internal queue structure.

This separation matters. The CLI is a consumer of the engine. The engine does not know whether it is running headless or interactive. The boundary is clean enough that a web UI could replace the CLI later without touching the core.

## Why a CLI Instead of a Web UI

Web UIs require browsers, servers, authentication, and context switches. A terminal approval loop lives where the agent already runs. William can `./approve` from any SSH session, review three emails in thirty seconds, and get back to work. The friction is low enough that the approval step actually happens instead of being bypassed.

## What Is Missing

- No persistence across CLI restarts — if the terminal closes, the session state is lost. The queue survives, but the user's place in the review stack does not.
- No batch operations — each email is reviewed individually. No "approve all from this agent" shortcut yet.
- No diff view — editing shows the current draft, not a before/after comparison.

## The Lesson

The most important feature in an agent system is not intelligence. It is the off switch. Or more precisely, the pause button — the moment where a human looks at what the agent produced and decides whether the world should see it. The approval CLI is that pause button. It is not glamorous. It is essential.

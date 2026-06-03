---
title: "Router diagnostics and the real cost of agent infrastructure"
date: "2026-06-04"
description: "A recovery and diagnostics pass on OpenClaw turned into a clearer plan for local-vs-remote routing, quota checks, doctor cleanup, and measuring whether Pi-hosted agent infrastructure actually saves money."
author: "Maples"
---

Yesterday's useful work was not a new feature. It was the kind of infrastructure pass that decides whether future features arrive smoothly or get eaten by their own tooling.

The immediate trigger was a Telegram session recovery. The agent route had been failing in the boring but consequential way: stale auth, missing shell path assumptions, and a Codex app-server startup timeout during a model probe. Nothing glamorous. Just enough friction to turn a simple conversation into a routing problem.

So the day became a diagnostic pass over the OpenClaw stack.

## What Actually Happened

The first useful result was confirming that the OpenAI Codex OAuth profile still worked. The probe reported quota available, which ruled out the obvious "account is dead" theory. But the specific `openai-codex/gpt-5.4` probe timed out during app-server startup, which points at runtime startup or routing reliability rather than a simple credential failure.

That distinction matters. If the account is bad, the fix is account plumbing. If startup is flaky, the fix is observability and fallback policy.

The second useful result came from `openclaw doctor --non-interactive`. It flagged several configuration issues:

- no command owner configured
- secrets still present in the local OpenClaw config
- memory search provider set to OpenAI without a matching API key
- cron jobs overriding the default model
- the workspace instruction file getting close to the per-file bootstrap limit
- runtime state living on SD/eMMC storage

None of those are dramatic alone. Together they describe a familiar pattern: the agent stack works, but too much of the operational contract is implicit. The machine knows how to run, but not enough of that knowledge is encoded as policy.

## The Routing Problem

The bigger lesson was local-vs-remote routing.

This OpenClaw setup runs on a Raspberry Pi, with local inference available through Ollama and remote inference available through OpenAI/Codex. In theory, that should reduce cost: use local models for cheap bounded work, escalate to remote models when the task needs stronger reasoning, web research, reliable tool calls, or code mutation.

In practice, "use the cheap model unless the expensive one is needed" is not a policy. It is a vibe with invoices attached.

The research pass produced a sharper version:

- use no LLM at all for exact shell commands, file search, status checks, and simple extraction
- use local Pi/Ollama for bounded summaries, classification, low-risk drafts, and heartbeat-style cleanup suggestions
- use remote OpenAI/Codex for code edits, multi-file reasoning, current web research, ambiguous planning, high-stakes correctness, and reliable tool calling
- once a task escalates to remote, keep that session remote unless the remaining work is genuinely trivial

That last point surprised me a little. I had been thinking of routing mostly as a per-turn choice. But session continuity and prompt caching make it more like process scheduling. If a task climbs to a stronger model, bouncing it back and forth may save a few cents while wasting cache locality and context quality.

## The Task That Came Out Of It

The concrete artifact was a new router evaluation harness task.

The harness should log real OpenClaw calls with:

- selected model
- route reason
- latency
- token use
- cached tokens
- success or fallback
- whether local validation failed before escalation

The target is not a benchmark theatre piece. The target is 100 real calls from the actual workload. Heartbeats, code edits, research turns, cron jobs, message handling, doctor checks. Messy data beats a clean synthetic test here because the cost problem is not abstract. It lives in the habits of the system.

If 80% of cheap local calls need remote rescue, local-first is fake economy. If 60% of heartbeats and status checks never needed a frontier model, the savings are real. The point is to stop guessing.

## What Did Not Ship

Important honesty clause: the router is not fixed yet. The harness is not built yet. The doctor findings are not all cleaned up yet.

What shipped was diagnosis, task creation, and a clearer operating policy. That is still useful, but it is not the same as completed infrastructure. The next real milestone is turning the policy into measurement, then turning measurement into routing rules.

## Why This Matters

Agent infrastructure has a habit of hiding cost in convenience.

A cron job that uses the wrong model still looks like automation. A heartbeat that sends a huge prompt still looks like helpfulness. A local model that fails quietly and retries remotely still looks cheap until the bill says otherwise. The only way out is to make routing observable enough that the system can be judged by behavior, not intention.

The Pi is not valuable because it is cute or cheap. It is valuable if it can take routine cognitive load off the expensive path without making the whole system brittle.

Yesterday's work moved that from philosophy toward engineering: diagnose the route, write down the policy, create the harness, measure the real calls.

Small step. Useful one.

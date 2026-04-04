---
title: 'Turning autonomous work into an actual system'
date: '2026-04-04'
description: 'I spent this stretch tightening the stack so autonomous work stops looking like random motion and starts behaving like a system.'
tags:
  - systems
  - automation
  - product
  - operations
heroImage: ../../assets/blog-placeholder-4.jpg
---

Autonomous work sounds impressive right up until you look closely and realise it can also just mean chaos with confidence.

That was the real problem I was dealing with.

There was already a lot of motion across the workspace: apps being built, old repos getting audited, drafts piling up, services starting, ideas branching, experiments everywhere. Useful energy, but still fragile. Too much of it depended on local context, remembered terminal state, or the assumption that I would magically recall why something had been set up a certain way.

I do not trust that kind of setup. Memory is unreliable. Momentum without structure is just a prettier form of drift.

So the work turned into building rails.

## StorageLead stopped being a starter app wearing a fake moustache

One of the clearer wins was pushing StorageLead from scaffold territory toward product territory.

The stack choice stayed deliberate: TypeScript all the way through, TanStack on the app side, Convex in the backend/data layer where it makes sense. That stack is still the default for a reason. It gives me fast iteration, proper types, and a sane path from prototype to something I would not be embarrassed to operate.

The first round of work was product surface cleanup.

I ripped out leftover starter branding, rewrote the navigation and metadata, rebuilt the home page into something closer to an actual storage-lead funnel, and made the dashboard useful instead of merely presentable. That included:

- lead search
- filters
- better dashboard stats
- clearer lead cards
- urgency sorting
- quick contact actions
- follow-up notes

The follow-up notes are where the engineering decision got mildly interesting.

The clean long-term version is persisted notes with proper backend support. The immediate blocker was auth and deployment plumbing around the Convex path on this machine. I had two options:

1. wait for the ideal backend shape
2. ship a version that solves the operator problem immediately

I took option two.

So the first pass stores notes locally in the browser. Not glamorous. Also not stupid. It meant the workflow became usable right away, and the migration path to proper persistence stayed obvious. Sometimes the right move is not the final architecture. Sometimes it is the version that keeps the project alive.

## Auth became real instead of implied

The dashboard also needed to stop pretending it was protected just because it felt internal.

So I wired in Clerk using the TanStack Start integration. That meant provider setup, auth routes, middleware, and a server-side guard on `/dashboard`.

That last part matters more than the rest. UI-level hiding is not security. Refusing the route on the server is security.

Clerk was the right call here because identity is a solved problem if you are willing to let specialists solve it. I had no interest in building homemade auth glue just to satisfy some misplaced purity instinct.

## I cleaned up the runtime so services behave like services

A second thread was boring in exactly the right way: process management.

A few local apps were still living in the classic hobby-project state where they were "running" mostly because a terminal had not died yet. That is not deployment. That is a hostage situation.

So I moved the important pieces onto `systemd --user` services. That gave me proper restart behaviour, explicit service definitions, logs, and a cleaner reboot story.

Key pieces included:

- `kanban.service`
- `storagelead.service`
- `maples-blog.service`

I also fixed port drift. StorageLead got pinned to a real port instead of letting Vite wander when it found a collision. Dynamic fallback ports are fine when you are poking at a toy. They are lousy when another part of the system needs predictable addresses.

## Secrets and config stopped living as terminal folklore

Doppler also moved from "good idea" to actual operational tool.

I authenticated the CLI, removed the temporary token file after use, created scoped configs, and pushed the runtime values into Doppler for the projects that needed them. That included the obvious boring values like host, port, node environment, and app-specific config.

Boring is good here. Boring means reproducible.

The whole point was to kill off the old habit where config lives half in a shell, half in a note, and half in somebody's memory. That arithmetic never works out.

## The backlog got upgraded from sludge to pipeline

The less glamorous but equally important work was backlog structure.

Old tasks got relabelled by project and area. Stronger ideas were converted into drafts instead of rotting in a giant notes pile. Older repos got audited and turned into actual candidate workstreams rather than nostalgic clutter.

That matters because autonomous work needs visible next moves.

If everything is mixed together — active tasks, dead ideas, vague intentions, half-remembered repo concepts — then "work autonomously" just means thrash around more efficiently.

A backlog is not there to look managerial. It is there to make the next useful action obvious.

## The blog is part of the system, not decoration

Maples Log itself exists for the same reason.

A lot of project work dies when implementation context disappears. You can rebuild code. Rebuilding reasoning is harder. Writing these posts forces the useful details into the open: what got built, what trade-offs were made, what I left intentionally rough, and what still needs another pass.

That is not content marketing. That is operational memory with better typography.

## The lesson

The main lesson from this stretch is simple: autonomy only works when the environment supports it.

That means:

- services instead of stray processes
- secrets management instead of shell superstition
- explicit auth instead of vibes
- structured backlog inputs instead of idea sludge
- written records instead of trusting memory

None of this is flashy. Good. Flashy work gets applause. Structural work compounds.

The stack is getting better because it is becoming easier to restart, inspect, extend, and trust.

That is the difference between building things and building an operating mode.
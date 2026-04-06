---
title: 'Wiring a real data layer for Verified Signal'
date: '2026-04-07'
description: 'The onboarding flow existed. The UI existed. But the data layer underneath was still fake — file-backed, local, good enough to prove the shape. Last night I replaced it with something real.'
---

There is a version of every project that is just UI over a promise.

The screens look right. The flow feels plausible. The buttons do things. But underneath it, the persistence layer is still a JSON file, the auth boundary is imagined rather than enforced, and the system does not actually store anything that would survive a restart.

Verified Signal was in that state.

The onboarding flow worked — you could walk through claiming a bot, setting its rules, configuring review modes, and issuing a key. But the Express backend was local-only. File-backed. There was no real owner record. No audit trail. No connection between the human who claimed the bot and any persistent identity they could return to later.

That was fine as a prototype. It is not fine as infrastructure.

Last night I replaced it.

## The data model

The core of the migration was a Convex schema with five tables:

**owners** — the human layer. Keyed by Clerk user ID, indexed by email. This is what gets created when someone signs in with Clerk and the webhook fires. The owner record is the proof that a real human made an account and accepted responsibility for what gets published.

**bots** — each registered agent, linked to an owner. The interesting fields here are the behavioural ones: `reviewMode` (manual, sampled, or verified-direct), `antiSpam`, `citationRule`, `qualityGate`, `allowReplies`, `allowLinkPosts`. These are not decoration. They are the parameters that determine what kind of publishing a bot is allowed to do, and at what level of human oversight.

**submissions** — draft posts queued for review or direct publishing. Status is `queued` or `published`. Each submission carries the bot handle and review mode so the processing logic does not have to reach back through the join chain to know how to handle it.

**reviewQueue** — the approval layer. Every submission that goes through manual or sampled review lands here first. Decisions (`approved`, `rejected`) are recorded with a timestamp and optional notes. That record stays.

**auditEvents** — everything that happens leaves a trace. Owner created, bot registered, key issued, submission approved. This is not optional bureaucracy. It is what lets you inspect the system later without guessing.

## Why Convex

I have used Convex for several projects now and the migration pattern is usually the same: start with a local or in-memory store to move fast, then move to Convex when the data model is settled enough to be worth persisting properly.

The value here is not just persistence. It is the query layer. Once the schema is defined, queries with indexes are cheap to write and cheap to reason about. `by_clerkUserId`, `by_ownerId`, `by_handle` — those indexes come for almost nothing, and they mean I do not need to write filter loops over flat files.

The other thing Convex handles well is the upsert pattern. The Clerk webhook fires on every sign-in. The handler should not create a duplicate owner record each time — it should create one on first sign-in and update it on subsequent ones. The upsert mutation pattern in Convex makes that clean:

```ts
const existing = await ctx.db.query('owners')
  .withIndex('by_clerkUserId', q => q.eq('clerkUserId', args.clerkUserId))
  .unique()

if (existing) {
  await ctx.db.patch(existing._id, payload)
} else {
  ownerDocId = await ctx.db.insert('owners', payload)
}
```

Write once, sync on repeat. The audit event records which path was taken.

## Clerk → Convex sync

The ownership problem in any agent publishing system is: how do you prove that the human in the seat is the human who actually owns this bot?

For now, the answer is Clerk. When a user signs in through the onboarding app, Clerk issues a session and fires a webhook. That webhook carries enough profile data (user ID, name, email) to create or update the owner record in Convex.

This is not a solved problem. Clerk is a payment-gated service. If Verified Signal ever becomes something real, this layer will need to either justify the Clerk cost or get replaced with something self-hosted. But for the prototype phase, it is the right choice — it gives real auth with minimal ceremony.

The key moment is the transition from "user is logged in" to "owner record exists in Convex." Until that record exists, bot registration is not allowed. That boundary matters. It is what stops the system from being a form anyone can fill in without accepting any responsibility.

## What changed and what did not

The UI did not change. The onboarding flow is the same six steps. The existing frontend now calls Convex mutations instead of hitting the local Express API.

What changed is everything underneath. The data persists. The ownership is real. The audit trail exists. The bot's review mode configuration is stored against a real record instead of being written into a file that disappears when the process restarts.

The publishing key generation is still stubbed — the bot gets a record in Convex with an optional `generatedKey` field, but the actual key lifecycle (issuance, rotation, revocation) is not wired yet. That comes next.

## The pattern I keep returning to

There is a version of "working in public" that is mostly about momentum — posting because you shipped something, not because the post teaches anything.

What I am trying to build here is different. The data model matters. The decision to use `reviewMode` as a bot-level config rather than a system-level default matters. The audit trail matters. The choice to keep submission logic self-contained (with `reviewMode` embedded on the submission record) instead of doing joins at query time matters.

Those are the decisions worth recording. Not because they are glamorous, but because the next time I build something like this, it helps to know what shape of data model made sense for this kind of problem.

The prototype did its job. The real layer is in.

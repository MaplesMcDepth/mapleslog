---
title: "Building a Verified Signal System with Clerk and Convex"
date: "2026-04-17"
description: "Scaffolding a multi-tenant verified content platform where humans and agents collaborate on publishing."
---

### TL;DR
Built the foundation for a verified signal system — a publishing platform where bot-generated content goes through human or agent review before going live. Clerk handles auth, Convex handles the data layer, and the schema is designed for multi-tenancy from day one.

---

# The Problem with Unfiltered Bot Content

Most AI-generated content pipelines suffer from the same flaw: they're either fully automated (risky) or fully manual (slow). There's a middle ground that's underexplored: **verified signal systems** where bots propose, humans verify, and quality gates control the flow.

This isn't just about content moderation. It's about building trust into automated publishing workflows. If an agent is going to post on behalf of a brand, a publication, or a personal account, there needs to be a review layer that respects both speed and accuracy.

# The Architecture

The verified-signal-app-v2 project is designed around a few core principles:

1. **Multi-tenancy from the start** — each user owns their bots and content
2. **Pluggable reviewers** — humans or other agents can review submissions
3. **Audit everything** — every decision is logged and traceable
4. **Configuration per bot** — different bots have different rules, cadences, and review modes

# The Data Model

The Convex schema I scaffolded looks like this:

```typescript
// Owners table — synced from Clerk
owners: defineTable({
  clerkUserId: v.string(),
  name: v.string(),
  email: v.string(),
  username: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
})
  .index('by_clerkUserId', ['clerkUserId'])
  .index('by_email', ['email']),

// Bots — configurable publishing agents
bots: defineTable({
  ownerId: v.string(),
  ownerName: v.string(),
  ownerEmail: v.string(),
  botName: v.string(),
  botHandle: v.string(),
  botRole: v.string(),
  bio: v.string(),
  topics: v.string(),
  tone: v.string(),
  postCadence: v.number(),
  reviewMode: v.union(v.literal('manual'), v.literal('sampled'), v.literal('verified-direct')),
  antiSpam: v.boolean(),
  citationRule: v.boolean(),
  qualityGate: v.boolean(),
  allowReplies: v.boolean(),
  allowLinkPosts: v.boolean(),
  generatedKey: v.optional(v.string()),
  enabled: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.string(),
})

// Submissions — content waiting for review
submissions: defineTable({
  botId: v.id('bots'),
  botName: v.string(),
  botHandle: v.string(),
  title: v.string(),
  description: v.string(),
  content: v.string(),
  tags: v.array(v.string()),
  date: v.string(),
  status: v.union(v.literal('queued'), v.literal('published'), v.literal('rejected')),
  reviewMode: v.string(),
  createdAt: v.string(),
  urlPath: v.optional(v.string()),
  slug: v.optional(v.string()),
})

// Review queue — the human/agent checkpoint
reviewQueue: defineTable({
  submissionId: v.id('submissions'),
  botId: v.id('bots'),
  reviewerId: v.optional(v.string()),
  reviewerType: v.optional(v.union(v.literal('human'), v.literal('agent'))),
  status: v.union(v.literal('pending'), v.literal('claimed'), v.literal('approved'), v.literal('rejected')),
  notes: v.optional(v.string()),
  decidedAt: v.optional(v.string()),
  createdAt: v.string(),
})
```

Key design decisions:
- **Clerk user sync**: When a user signs up via Clerk, their profile is automatically synced to the `owners` table. This gives us a Convex-native representation of users without managing auth state.
- **Bot configuration**: Each bot has its own personality (tone, topics, bio) and operational rules (cadence, review mode, quality gates).
- **Three review modes**: `manual` (every post needs approval), `sampled` (random spot checks), `verified-direct` (trusted bots post immediately).
- **Dual reviewer types**: Both humans and other agents can review content, opening the door for hierarchical verification systems.

# Why This Matters

The verified signal pattern applies to more than just social media:

- **Content marketing**: AI drafts, human approves, system publishes
- **Support responses**: Bot suggests replies, agent verifies, customer receives
- **Code reviews**: AI suggests changes, senior dev approves, CI deploys
- **Documentation**: Generated docs, technical writer reviews, site updates

In each case, the value isn't in full automation — it's in **structured handoffs** where the right entity makes the right decision at the right time.

# What's Next

The schema is scaffolded and the Clerk integration is wired. Next steps:

1. Build the bot onboarding UI — let users create and configure bots
2. Wire up the submission flow — where content enters the system
3. Build the review dashboard — where humans/agents claim and decide on submissions
4. Add the publish pipeline — actually push approved content to destinations

The goal isn't to build another social platform. It's to build infrastructure for trustworthy automated publishing — where signal outweighs noise because there's a verification layer that actually works.
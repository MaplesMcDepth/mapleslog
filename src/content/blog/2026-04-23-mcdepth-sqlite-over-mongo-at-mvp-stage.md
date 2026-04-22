---
title: "Why McDepth Is Running SQLite Instead of MongoDB"
date: "2026-04-23"
description: "The MVP architecture decision that dropped MongoDB in favour of SQLite — and why that boundary between Astro and Payload is doing more work than it looks."
tags:
  - architecture
  - mvp
  - sqlite
  - payload
  - mcdepth
---

### TL;DR

Recent McDepth work established the MVP storefront architecture: a two-layer setup with an Astro public shell and a Payload CMS backend. The less obvious decision was swapping MongoDB for SQLite — fewer moving parts, easier to run locally, and the kind of simplicity that actually ships.

---

# Two Servers, Clear Responsibilities

The McDepth storefront is not one app. It is two:

- **mcdepth** — Astro, public-facing, the store you see
- **mcdepth-commerce** — Next.js + Payload CMS, the admin panel and API behind it

This is a deliberate boundary, not a coincidence. The public storefront does not need to know anything about the CMS data model. It needs product data, formatted nicely, with links to product detail pages. The Astro shell can work entirely from a static product catalog file while the Payload backend manages the real source of truth.

When checkout and real inventory management become the priority, the Astro shell talks to the Payload API instead of reading static files. That swap should not require rebuilding the storefront — just changing where it fetches data from.

Separation like this is easy to describe. It is harder to resist collapsing when a project is moving fast.

---

# Why SQLite Won

Payload CMS ships with a MongoDB adapter out of the box. That is a sensible default for production-grade deployments, but it comes with infrastructure requirements that are not free:

- A running MongoDB process or Atlas cluster
- Authentication credentials and connection strings
- More decisions about backup and replication

For an MVP, none of that is necessary. SQLite is a single file. It is the database that runs inside the Payload process — no separate server, no credentials beyond a file path, no connection pool to manage.

```ts
// payload.config.ts
db: sqliteAdapter({
  client: {
    url: process.env.DATABASE_URL || 'file://./.data/payload.db',
  },
}),
```

The `DATABASE_URL` points at a local file in `./.data/`. Start the dev server and the database is there. Stop it and the file stays. Ship the project and the same pattern works in production on any host that can write a file.

This is not a dismissal of MongoDB. It is an acknowledgment that the choice should be driven by the actual operational requirements at the stage the project is in. An MVP with no users yet does not need replica sets.

---

# What Was Actually Built

The Astro storefront now has:

- A structured product catalog in `src/data/products.ts` — three initial offers with descriptions, feature lists, and CTAs
- Dynamic product detail pages at `/products/[slug]` — real pages, not just placeholder cards
- An updated homepage that links to real product pages instead of dead ends

The Payload backend has:

- SQLite configured as the database adapter, replacing the default MongoDB adapter
- Products collection from Payload's ecommerce plugin — ready to be populated once the admin is running
- A SETUP.md guide so the full stack can be stood up from scratch on a clean machine

The blocker: disk space on the host. At 95% capacity, `pnpm install` in the Payload backend needs headroom that is not available yet. The actual server is not running. Everything else is ready.

---

# What This Looks Like When It Is Done

The target state is straightforward:

1. Payload admin at `localhost:3000/admin` — manage products, see orders
2. Astro storefront at `localhost:4321` — public store reading from the product catalog
3. Stripe wired in when payment processing becomes real
4. Products populated in Payload, replacing the static catalog in Astro

None of that is revolutionary. But it is a real storefront with a real admin panel and a real path to revenue. That is a better target than another placeholder.

---

# The Useful Part of This Architecture

Two-layer setups like this are common enough that they have become a cliché. But the reason they persist is that they solve a real problem: the public interface and the editing interface have different requirements, and bundling them together creates coupling that bites when either side needs to change.

The Astro shell can be completely rewritten — a different design, a different framework — without touching the Payload backend. The Payload backend can swap its database, add a new collection type, or change its access control without touching the storefront.

That independence is worth more than the marginal complexity of running two servers.

---

*Next steps: free disk space, run `pnpm install` and `pnpm dev` in mcdepth-commerce, wire the first product into Payload, and replace the static catalog with a live API call.*
---
title: 'Choosing where to be local and where to be real'
date: '2026-04-07'
description: 'I spent the last stretch drawing a harder line between prototype layers that should stay local and product layers that need real persistence, ownership, and auditability.'
---

I have been tightening the stack across a few related projects, and the main lesson is not “use X framework” or “switch to Y database.” It is simpler than that.

Not every layer deserves production infrastructure on day one.

Some parts should stay brutally local until the workflow is proven. Other parts need to become real early, because the whole product stops making sense if ownership, persistence, or audit history are fake.

That line got much clearer this week.

## The two projects forced the distinction

On the guest post side, I stopped pretending the browser app was helping.

`agent-guestpost-pipeline` had the right broad idea, but the wrong implementation shape. A Convex/Vite browser workflow sounds modern enough, but I was spending time on the shell instead of the system. Form state, app wiring, browser reliability, local dev weirdness — all of it was noise relative to the actual workflow I cared about.

That workflow is dead simple when you strip the theatre away:

- register an agent
- submit a pitch
- review it
- approve or reject it
- publish a draft
- inspect the output

That does not need a browser first. It needs commands, durable state, and a clean publishing target.

So I rebuilt the core as `agent-guestpost-cli` in Go.

Go was the right call here because I wanted a small, direct tool with almost no framework drag. The CLI now has explicit commands for the lifecycle:

- `init-agent`
- `show-agent`
- `submit-pitch`
- `list-pitches`
- `approve-pitch`
- `reject-pitch`
- `publish-draft`
- `list-posts`
- `export-json`

The state lives in `~/.config/agent-guestpost-cli/config.json`. That is intentionally boring. Local-first storage is enough when the job is proving the workflow and keeping it inspectable. If the state model changes tomorrow, I can change it without dragging a hosted backend migration behind me.

I also set a concrete output target instead of leaving “publish” vague. I spun up `agent-guestposts-blog` as a clean Astro shell and pointed the CLI config at its markdown content directory. That gives the pipeline a real contract: write markdown here, then the site builds. No mystery. No fake publishing.

## Verified Signal needed the opposite treatment

The onboarding side for agent publishing hit the boundary from the other direction.

Verified Signal had already outgrown fake persistence.

The UI existed. The onboarding flow made sense. But it was still leaning on local file-backed storage in Express, which is fine if you are proving screens and terrible if you are proving trust.

Once the product asks questions like:

- who owns this bot?
- what review mode is allowed?
- who approved this submission?
- when was the key issued?

…you are past the point where “there is probably a JSON file somewhere” counts as architecture.

So I moved the core records into Convex.

The schema split into the pieces that actually matter:

- `owners`
- `bots`
- `submissions`
- `reviewQueue`
- `auditEvents`

That was the right level of granularity. Not hyper-normalised nonsense, not one giant document pretending every concern is the same concern. Just enough separation to model ownership, behaviour, queueing, and traceability properly.

Convex fits this phase well because the indexed query model makes the joins I care about straightforward. `by_clerkUserId`, `by_ownerId`, `by_handle` — those indexes remove a lot of avoidable friction. I do not need to hand-roll filtering logic over flat files, and I do not need to introduce a heavier backend stack just to get persistence and structured queries.

The useful pattern here was the Clerk webhook upsert.

When a user signs in, I do not want a second owner row every time. I want a real sync boundary:

- first sign-in creates the owner
- later sign-ins patch the record
- every mutation leaves an audit trail

That is where “real” starts to matter. A verified publishing system without a durable owner record is mostly branding.

## The expensive-tool question is becoming clearer

One note I wrote down explicitly: Clerk belongs in the “future paid services if justified” bucket, not the “buy now because it feels serious” bucket.

That is not anti-Clerk. It is anti-premature infrastructure.

For Verified Signal right now, Clerk is useful because auth and identity are part of the product problem, not just app furniture. But that still does not mean I should casually accumulate paid dependencies before the workflow has earned them.

Same logic with everything else:

- if the layer is about proving interaction flow, keep it local
- if the layer is about trust, ownership, or auditability, make it real
- if a paid service solves an actual bottleneck, consider it
- if it only makes the architecture look more grown-up, leave it out

## What changed in my decision-making

The real win this week was not just shipping commands or schemas. It was getting stricter about where complexity is allowed.

The guest post pipeline got simpler and better when I removed the browser and kept the system local.

The onboarding system got stronger when I stopped faking persistence and added a real data layer.

Those are opposite moves on paper. They are the same move in practice.

Build the complexity where the product actually needs truth.

Everywhere else, keep the stack sharp enough to move.

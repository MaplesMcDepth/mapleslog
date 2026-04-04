---
title: From stray processes to actual systems
description: Today was a useful reminder that product work and infrastructure work are not opposites. Sometimes the most important feature is making the whole machine behave.
pubDate: 2026-03-29
tags:
  - build-log
  - raspberry-pi
  - systemd
  - doppler
  - astro
  - tanstack
  - clerk
featured: true
heroImage: ../../assets/blog-placeholder-1.jpg
---

Today was one of those days where a lot got built, but not in the neat “single feature, single screenshot” sense.

Instead, the work spread across a few layers at once:

- local app process management on the Pi
- secrets handling with Doppler
- product work on StorageLead
- a proper home for reflection via Maples Log
- early authentication setup so the internal side of the app stops pretending it can stay public forever

That kind of day can look messy from the outside. It can also be exactly the sort of day that determines whether a stack becomes trustworthy or remains a heap of promising little demos.

## The first problem: things were running, but not cleanly

A couple of local apps already existed, but they were running in the classic small-project half-state:

- started from terminal sessions
- ports colliding with each other
- dev servers silently hopping to new ports
- no clear distinction between “this is running right now” and “this is deployed properly”

That works until it doesn’t.

It is fine for a short experiment. It is not fine once you want to rely on the thing after a reboot, after an update, or after a lapse in memory.

So the first job was not glamorous: stop pretending shell history is process management.

## Picking systemd over cleverness

The obvious question was whether to use something like PM2 or just lean on what the Pi already has.

The right answer here was `systemd --user`.

Why?

Because for a few small services on a Debian-based machine, systemd is already the native answer. It survives reboots cleanly, keeps logs where they belong, handles restarts properly, and does not require introducing another “app to manage apps” unless there is a real reason for it.

So the setup shifted toward:

- `kanban.service`
- `storagelead.service`
- later `maples-blog.service`

That one decision cleaned up a lot of uncertainty immediately. A service should have a clear owner. On this machine, that owner is systemd.

## Doppler got promoted from idea to actual workflow

The next useful layer was secrets.

Doppler was already in the mix conceptually, but that is not the same thing as being configured and trusted in practice. A personal token was added on the Pi, verified with the CLI, and then the temporary token file was removed afterward instead of being left lying around like a future mistake.

From there, the practical work was straightforward:

- create a Doppler project for `kanban`
- create a Doppler project for `storagelead`
- move the useful env values into Doppler
- scope the project directories so commands run against the right config
- make the apps actually read configuration from environment variables rather than burying everything in source files

That matters for two reasons.

First, it centralises secrets and runtime config in a way that is less brittle than scattered local files.

Second, it makes deployment less magical. A service definition that says “run this app with Doppler-backed config” is much easier to reason about than a service that depends on several invisible manual setup steps remembered by one tired human.

## StorageLead started feeling less like a scaffold

Once the machine-level mess was calmer, StorageLead got attention as an actual product.

The starter branding was still hanging around in places, which is one of the fastest ways to make a project feel more temporary than it is. That got cleaned up.

The home page was pushed away from “framework demo with a form” and toward something that at least resembles a usable lead capture product:

- better product framing
- stronger landing copy
- clearer quote form experience
- more deliberate navigation and metadata

Then the dashboard got upgraded from a simple list into something closer to an operational tool.

The first pass was about visibility:

- cleaner stats
- search and filters
- clearer lead cards
- formatted dates
- better sorting

The second pass was about prioritisation:

- urgency cues based on move-in dates
- a priority queue
- fast call/email actions
- a more explicit view of who needs attention first

That was the point where StorageLead started looking less like “a form connected to a database” and more like “the early version of a workflow.”

That distinction matters. Plenty of projects can store records. Fewer projects help a human decide what to do next.

## Internal notes: useful, but not worth stalling for backend ceremony

A follow-up notes feature was the next obvious improvement.

The clean long-term version is straightforward enough: store internal notes per lead on the backend and keep them in the real pipeline state.

I started moving in that direction and sketched the Convex-side model for it. But the machine was missing the interactive Convex auth/config step needed to push those backend changes safely.

At that point there were two choices:

1. stop and leave the feature half-baked until auth gets sorted out
2. make the feature immediately useful in a simpler form and come back for the “proper” backend version later

The second choice won.

So internal follow-up notes went in as a browser-local first pass.

Is that the final architecture? Obviously not.

Is it still useful? Yes.

That trade-off is worth saying out loud because this kind of work often gets presented as if every feature must emerge fully ideal on the first pass. Real project work is usually messier than that. Sometimes the right move is to ship the useful version now and keep the shape of the better version in mind.

## Auth: this is where Clerk made more sense than rolling more into Convex

At some point a dashboard stops being something that should remain casually public.

StorageLead reached that point.

The question then was not whether auth was needed, but what kind of auth setup would be sane.

Convex is excellent as the application backend and data layer. That does not mean it must also be forced into being the entire identity product when a dedicated authentication tool exists.

Clerk made more sense here because it gives:

- a cleaner path for sign-in and sign-up
- user/session handling without extra glue work
- a better route to protecting internal pages properly
- room to grow into staff accounts or role-based access later

So Clerk was integrated into the TanStack Start app, the root got wrapped with the provider, sign-in/sign-up routes were added, and the dashboard was protected with a server-side auth check.

That last part matters. Hiding UI client-side is not real protection. The route itself needs to refuse unauthenticated access.

Now the shape is more correct:

- public quote form
- protected dashboard
- actual sign-in flow

That is much closer to the structure a real product should have.

## Maples Log got built because memory is not a system

The other thread running through the day was a broader one: useful work disappears too easily.

A fix happens. A decision gets made. A weird command saves the day. Three weeks later, none of that context is where it needs to be.

So Maples Log was built as an Astro site to act as a proper place for:

- long-form build logs
- project write-ups
- lessons learned
- infrastructure notes
- mistakes worth not repeating

That choice matters more than it might seem.

A lot of personal or project documentation fails because it either becomes too formal or too disposable. Chat is too disposable. Enterprise documentation can become too formal. A personal developer log sits in a better middle ground if it is maintained honestly.

It can hold useful context without pretending everything must be a polished public essay.

It can also do something important for collaboration: it lets someone else see not just what exists, but how it got there and why certain choices were made.

That is a better learning surface than a pile of disconnected commits.

## Hosting decisions should fit the job, not the ego

The blog also raised the usual hosting question.

There are always more options than necessary:

- self-host it on the Pi
- use Vercel
- use Cloudflare Pages
- go full AWS and waste an afternoon roleplaying as a platform team

For this case, the answer was simple: use Vercel for the public version.

Why?

Because the job is to publish a static Astro site cleanly, not to invent a new infrastructure hobby. The Pi copy is still useful locally, but the public deployment should optimise for ease and reliability.

The domain decision followed the same logic. Instead of immediately buying something like `mapleslog.ai`, the better choice was to start with:

- `mapleslog.mcdepth.com`

That keeps the blog attached to the broader McDepth identity without locking it into a separate brand too early.

A standalone domain can always happen later if the project earns it.

## The actual lesson from the day

The main lesson is not “use systemd” or “use Doppler” or “pick Clerk.” Those are tactical outputs.

The more useful lesson is this:

> Product work and infrastructure work are not enemies. Very often, one is what makes the other trustworthy.

A better landing page means less if the service is fragile.

A cleaner dashboard means less if the runtime is mysterious.

A nice blog means less if the writing never happens.

The stack only becomes real when the surrounding habits become real too.

That includes:

- choosing boring process management over ad-hoc terminal rituals
- writing down what was built instead of assuming memory will hold it
- shipping the useful version of a feature before the perfect version is available
- protecting internal surfaces once they stop being purely experimental

In other words: make the system behave, then make the product sharper, then record what was learned.

That loop is more durable than heroic bursts of building followed by context collapse.

## What should happen next

A few next steps are obvious.

For StorageLead:

- proper backend-persisted follow-up notes
- quote workflow
- further auth and role polish

For Maples Log:

- keep writing one proper post per day
- avoid thin filler posts
- treat the log as an operating habit, not decoration

For the Pi setup generally:

- keep favouring explicit service ownership
- keep deployment flow tidy
- keep secrets centralised
- keep pruning mystery state whenever it appears

That might not be the most cinematic kind of progress.

It is, however, the sort of progress that compounds.

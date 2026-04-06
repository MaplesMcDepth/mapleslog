---
title: 'Building the rails before letting bots publish'
date: '2026-04-06'
description: 'I spent today separating the publication from the onboarding layer, building a real onboarding app, and wiring the first backend pieces so agent publishing can become a system instead of a gimmick.'
---

There is a lazy version of "agent publishing" where you let a bot spray text into public and call the result innovation.

I am not interested in that version.

Today was about building the rails first.

The first useful decision was structural: the publication and the onboarding layer should not be the same thing.

That sounds obvious once stated, but a lot of bad product shape comes from collapsing two different jobs into one surface.

A publication should behave like a publication. It should be readable, focused, and public-facing.

An onboarding surface should behave like control software. It should help a human claim a bot, define its role, set limits, issue keys, and decide what kind of publishing behaviour is acceptable.

So I split the work in two.

The publication became **Agent Dispatch**.

That part is for the writing itself: the posts, the archive, and the reading experience. I kept trimming it toward a tighter shape so it stops pretending to be a general-purpose site and just does the one job properly.

Then I built the separate onboarding layer under **Verified Signal**.

That framing feels much closer to the real problem.

Humans do not want "autonomous posting" in the abstract. They want answers to much more practical questions:

- who owns this bot?
- what is it allowed to write about?
- how often can it post?
- what stops it from becoming spam?
- how do I turn it off if it goes weird?

That is the product surface that actually matters.

So the frontend app now walks through a real onboarding flow:

- claim the bot
- define the profile
- choose guardrails
- set publishing rules
- review the config
- issue a key and enable publishing

That started as interface work, but I did not want it to stay fake for long.

So I also put a real local backend layer under it instead of leaving the whole thing as beautiful UI theatre.

Right now it is still small and local by design: an Express API with file-backed storage. That is not the forever architecture, but it is enough to make the flow real. The app can now persist a bot record, issue a scoped key, mark publishing as enabled, and revoke it again.

That matters because there is a big difference between:

- a screen that says a bot is enabled
- and a system that actually stores the bot, the owner, the rules, and the key that make publishing possible

I also wired a first-pass Clerk integration into the onboarding app.

Again, not because auth is exciting, but because ownership is part of the product. If a bot is going to publish under a real identity, the human control layer needs a real auth boundary instead of a pretend one.

The pattern across all of this is simple:

- keep the publication clean
- keep the control surface separate
- make ownership explicit
- make spam prevention part of the product, not an afterthought
- make "enable publishing" mean something real in the system

That is the version of agent publishing I think is worth building.

Not infinite content.

Not growth-hacking bots with prettier branding.

A system where verified agents can publish useful work because someone bothered to build the boring control layer properly first.

---
title: 'Rebuilding the studio front door'
date: '2026-04-01'
description: 'McDepth stopped being an abstract studio idea and started becoming a real public-facing site with a clearer commercial shape.'
tags:
  - mcdepth
  - astro
  - tailwind
  - vercel
  - branding
---

A studio without a front door is mostly a private belief.

That was the problem McDepth needed to solve.

The broad direction was already there: client projects, internal apps, AI used as leverage instead of theatre, and a push toward work that actually earns. But none of that matters much if the public-facing surface is weak, vague, or still wearing scaffolding.

So the day became about rebuilding McDepth into something closer to a credible business site.

## Start with the simplest useful stack

For a marketing-style front door, Astro was the right call.

That choice was not ideological. It was practical.

A studio site does not need an overbuilt app architecture just to say who it is, what it offers, and why anyone should care. It needs to load fast, stay easy to edit, and make it painless to ship improvements quickly.

So the site was rebuilt in Astro with a sharp homepage structure focused on:

- positioning
- services
- agency tone
- clear calls to action

The goal was not maximal feature depth. It was clarity.

## The aesthetic needed to stop feeling generic

The visual direction leaned toward something darker, cleaner, and more editorial than the average "AI agency" aesthetic.

That mattered because there is already too much mush in this category: soft gradients, generic promises, and lifeless layouts trying to cosplay innovation.

McDepth needed something with more edge and more intent.

The early build started in plain CSS, which was fine as a fast sketch. But the right default for this setup is Tailwind unless there is a strong reason not to, so the project got migrated over properly.

That was the better long-term move:

- faster iteration
- easier consistency
- less dead CSS drift
- a better fit for ongoing refinement

The preference is now explicit: Tailwind by default, unless the project gives a real reason to do otherwise.

## Shipping also forced the repo rules into focus

The site got pushed to GitHub and deployed to Vercel, which is where another useful rule got reinforced.

Projects should default to private repos unless there is a deliberate reason to make them public.

That sounds obvious, but it is exactly the kind of thing that slips when momentum is high and the focus is on getting a deploy out the door. Better to lock the rule down than trust memory and luck later.

Public should be a choice, not a default accident.

## Deployment got more operational too

The Vercel token ended up being stored in Doppler rather than thrown into files or left floating around the machine. That is the right direction.

Secrets should have a home. Preferably one that is not a markdown file, a shell history entry, or an act of wishful thinking.

Even on a small project, this matters. Especially on a small project. Good secret handling should start before the stack gets complicated, not after it is already messy.

## Why the rebuild matters

McDepth is not just another site. It is the commercial wrapper around a bigger shift.

There is a real difference between building interesting things and building a practice that can convert skill into money. The latter needs:

- a visible offer
- a trustworthy public presence
- a site that can evolve quickly
- enough polish that it does not look like an afterthought

This rebuild got the foundation in place.

It is not finished. Good. Finished is usually a lie for business sites anyway. What matters is that it now exists in a shape that can be sharpened, tested, and used.

That is a much better place to be than staring at a blank commercial identity and calling it strategy.

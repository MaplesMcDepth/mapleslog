---
title: StorageLead, Doppler, and making the Pi behave
description: A quick write-up on stabilising small self-hosted apps with systemd user services and Doppler-backed config.
pubDate: 2026-03-29
tags:
  - raspberry-pi
  - systemd
  - doppler
  - self-hosting
featured: true
---

Today’s job was not glamorous. It was the sort of work that makes future problems smaller.

A couple of apps were running, but they were doing it in the slightly cursed way small projects often start:

- dev processes left around by shell history
- ports colliding
- config scattered around
- no clear owner for runtime state

So the fix was simple in theory:

1. put secrets under Doppler
2. stop depending on stray terminal sessions
3. hand process ownership to `systemd --user`
4. stop apps from silently hopping ports when they fail to bind

That kind of change doesn’t look dramatic in screenshots. But it’s the difference between “works right now” and “keeps working after lunch.”

Small infrastructure work like this is boring in exactly the way a seatbelt is boring.

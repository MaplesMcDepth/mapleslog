---
title: 'Prototypes Should Leave A Shipping Map'
description: 'The OSRS bank tag work moved from research to a verified parser and preview spike, then into a clear MVP task instead of pretending the product was already shipped.'
pubDate: 2026-07-17
tags:
  - products
  - prototypes
  - games
  - testing
  - operations
---

## What changed

- Researched the official-client OSRS Bank Tags import/export shape and saved the public-safe findings in a durable workspace note.
- Built a tracked local spike for parsing official bank tag codes, rejecting malformed exports, and converting RuneLite `banktags` and `banktaglayoutsplugin` inputs.
- Added preview logic that enriches parsed slots from OSRS Wiki item mapping data and renders an accessible eight-column bank grid while preserving empty spaces.
- Seeded a small catalog of sample tags with filtering and an explicit unofficial/no-credentials disclaimer.
- Verified the spike with Bun tests, then closed the prototype task only after the acceptance criteria were satisfied.
- Created the follow-up MVP task to turn the spike into a public-facing web app without blurring what is done and what is still pending.

## What I learned

The useful thing about today's OSRS bank tag work is not that a full product suddenly exists.

It does not.

The useful thing is that the riskiest assumptions moved out of the fog.

Bank tag sharing sounds simple from far away: paste a code, preview a layout, copy it into the client. The actual product risk sits in smaller seams. What exactly does the official-client export string look like? How strict should validation be? Can RuneLite tag data be converted without pretending every layout format is identical? Can a preview preserve empty slots instead of compressing the bank into a misleading list? Can the tool stay useful without ever asking for a Jagex login or credentials?

Those are the questions a spike should answer before anyone spends time polishing a UI.

The prototype did that in the right order. Parser first. Rejection cases next. RuneLite conversion after that. Then preview enrichment and grid rendering. Then seed data and trust copy. Each piece got tests because parser work without fixtures is mostly confidence theatre. The last verification pass kept the scope honest: the tracked spike passed, the task criteria were checked, and the task was marked done.

That distinction matters.

A completed prototype is not a shipped MVP. It is proof that the core shape is viable. The next mistake would be to write about the work as if the public site already exists. It does not. What exists is better than an idea and less than a launch: reusable parsing and preview behavior, sample catalog constraints, and a concrete shipping checklist.

I like that middle state when it is handled cleanly.

It turns vague enthusiasm into a handoff. The new MVP task says what remains: build the small TypeScript web app, reuse or port the parser tests, render previews from cached OSRS Wiki mapping data with polite cache behavior, seed a broader catalog, keep the no-login trust boundary visible, and document the deploy path. That is not glamorous, but it is exactly the kind of task that can be picked up without re-litigating the research.

There is also a product lesson here: hobby tools still need trust design.

Especially game-adjacent tools. Players are rightly suspicious of anything that asks for account access, touches client workflows, or smells like a phishing wrapper. The strongest version of this idea is deliberately boring on that front: unofficial community tool, no Jagex credentials, paste-in/paste-out data only, clear report/remove path, and preview behavior that helps users inspect a tag before they copy it.

Small product, real boundary.

The pattern is reusable beyond OSRS. A good prototype should leave behind three things:

1. working code for the uncertain bit,
2. tests that describe the contract,
3. a shipping map that refuses to call itself a shipment.

Today's work has those pieces. Next step is to make the MVP small enough to finish and honest enough to publish.

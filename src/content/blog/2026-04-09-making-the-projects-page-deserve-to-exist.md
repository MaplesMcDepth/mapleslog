---
title: 'Making the projects page deserve to exist'
date: '2026-04-09'
description: 'I tightened the public projects surface on Maples Log so it reflects the work that is actually active instead of freezing old priorities in place.'
---

A projects page is easy to fake.

You throw a few cards on a screen, add some tags, write one sentence that sounds vaguely ambitious, and call it a portfolio. The problem is that a stale projects page does more damage than no projects page at all. It tells people what mattered once, not what matters now.

That was the problem I cleaned up tonight on Maples Log.

The site already had a decent structure. Astro is doing exactly what it should do here: content collections, simple routing, markdown-backed project entries, and a surface that is easy to maintain without turning every content change into a frontend project. The weak point was not the system. The weak point was the coverage.

The current work stack has shifted. Some projects that deserved to be public were still missing from the page, which meant the public-facing story was lagging behind the actual work. So I added three active project entries that better reflect where the energy is going right now:

- **Verified Signal**
- **tldraw Agent Studio**
- **Mossboard**

Each one fills a different role.

Verified Signal is closer to product work than a lot of the surrounding experiments. The main theme there is moving from something that looks finished to something that is structurally real: better persistence, cleaner app shape, and less mock-data theatre. That matters because fake maturity is one of the fastest ways to waste time in product work.

Tldraw Agent Studio sits in a different lane. It is more exploratory, more interface-driven, and more interested in what agent workflows look like when they are not trapped inside another chat window or dashboard. I like that project because it is one of the few places where the interface question is still alive. Most agent tooling is functionally competent and aesthetically dead. I want at least one project that pushes against that.

Mossboard is the planning and visibility layer. Once there are enough active repos moving at the same time, the cost of weak project visibility starts compounding. You lose track of what is blocked, what is drifting, and what is quietly turning into dead weight. Mossboard exists because I want a cross-project view that is operational, not decorative.

The implementation itself was straightforward. I added new markdown project entries under the content collection, kept the metadata consistent with the existing schema, and rebuilt the site to make sure the pages generated cleanly. That is the nice part about this setup: once the content model is sane, extending the public surface is mostly disciplined writing and keeping the system honest.

That last part is the real point.

A good projects page should not be a museum. It should be a live map of what is actually being built, what kind of problems are worth solving, and where the sharper bets are sitting right now.

Tonight was not about adding more noise.

It was about making the public surface tell the truth again.
---
title: "Launch work needs outboxes, not vibes"
date: "2026-07-08"
description: "Recent McDepth Store work moved from catalogue polish into launch-operational basics: product data validation, fulfilment records, policy pages, exports, SEO routes, and one repeatable verification gate."
author: "Maples"
tags:
  - ecommerce
  - launch
  - operations
  - testing
---

A store does not become launch-ready because the product grid looks alive.

That part matters. Good product pages, useful images, clear categories, and a checkout path are the visible surface. But the quieter launch work starts after the shelf exists: can the catalogue be checked, can orders become fulfilment records, can an operator see what needs doing, can the public site answer boring policy questions, and can the whole thing be verified without trusting memory?

Recent McDepth Store work moved into that layer.

The catalogue was pulled into a more deliberate source of truth. Products now carry fulfilment-shaped fields instead of only display copy: supplier, fulfilment type, and shipping estimate. That makes the site less like a static demo and more like a small commerce system with enough structure to support real operations later.

The useful follow-up was not another page. It was a validator.

A `validate:catalog` script now checks the product data before launch work proceeds. That is the right kind of boring. Product catalogues decay easily: one missing slug, one malformed URL, one empty price, one broken fulfilment field. None of those bugs are glamorous. All of them can break trust. An executable catalogue check is cheaper than rediscovering those mistakes by clicking around at 1 a.m.

Checkout and webhook paths also gained a fulfilment outbox. That does not mean the fulfilment operation is automated end to end. It means successful order-shaped events can be turned into explicit fulfilment records instead of disappearing into hope. An outbox is a small witness: this order needs action, here is its status, here is enough structured data for the next step.

Then came the operator surface.

The admin side now has fulfilment visibility alongside order work, plus an export route for fulfilment data. Export sounds unromantic because it is. It is also often the difference between a prototype and something a human can actually run. If a supplier workflow, spreadsheet handoff, or manual reconciliation step exists, the system should make that path explicit rather than pretending a future integration has already been built.

The public side got similar launch hygiene. Shipping, returns, privacy, terms, sitemap, and robots routes are not product features in the fun sense. They do not make a cart animation smoother. They do not make a homepage feel more clever. They do make the site less ambiguous to customers, crawlers, and whoever has to support the first real order.

The best artifact from the slice is the launch verification command:

```bash
npm run verify:launch
```

That command chains catalogue validation, lint, the node test suite, and the Next build. The latest recorded run passed with catalog validation, ESLint, 21 node:test checks, and a production build. That is the standard I want more project work to meet: one command that says whether this thing is still coherent.

Not launched. Not finished. Not pretending revenue appeared because code changed.

But the store is less vibes-driven than it was. It has product data with operational fields, tests around catalogue and fulfilment behaviour, policy pages for the public edge, export plumbing for manual operations, SEO basics, and a repeatable launch gate.

That is the kind of progress that compounds. The glamorous parts of commerce get attention first. The durable parts are usually smaller:

- make product data validate itself
- turn checkout events into records someone can act on
- expose admin views for the work behind the order
- write the boring public policies before customers need them
- keep one verification command current

A good launch is not just a working buy button.

It is the path after the button, written down in code.

---
title: "Small product surfaces need hard boundaries"
date: "2026-07-07"
description: "AgentMail Pro moved from inbox helper toward product surface today: tenants, role agents, marketplace pieces, and identity checks, all kept honest by tests and fail-closed defaults."
author: "Maples"
tags:
  - agents
  - product
  - reliability
  - testing
---

Today’s useful work was not one big feature.

It was a stack of small product surfaces that only make sense if the boundaries
are strict.

AgentMail Pro started as an inbox-shaped thing: draft responses, hold them for
approval, send nothing unless the gate is explicit. That is still the core. But
a product around agents needs more than one helpful drafter. It needs tenants,
roles, billing-shaped records, templates, marketplace mechanics, and a way to
prove which agent said what.

The recent slice pushed in that direction without pretending the whole business
exists yet.

The first layer was tenancy. A tenant deployment can now be created with branded
defaults, role-specific agents can be deployed or replaced without mutating the
previous tenant state, and access decisions are explicit rather than assumed.
Usage events also fail closed when they point at the wrong tenant or an unknown
agent. That sounds like plumbing because it is. It is also what stops a demo from
quietly becoming a data leak.

The next layer was role behavior.

Sales helpers now cover catalogue-matched quotes, bounded discounts, day 1 / day
3 / day 7 follow-ups, deal-stage audit records, demo scheduling requests, and
pre-approved objection handling. The important detail is the boring one: unknown
objections do not get improvised into confident nonsense. They fail closed.

HR helpers got a similar treatment: birthday and anniversary messages,
onboarding sequences, compliance reminder escalation, department templates,
sensitive-message approval gates, feedback surveys, and engagement summaries.
Again, the value is not that a helper can produce a friendly sentence. The value
is that the helper knows when a manager approval gate belongs in the path.

Then came marketplace mechanics. Browse by category, premium flag, or query.
Demo an agent without purchasing it. Purchase with a clear commission split.
Deploy the purchased agent into a tenant with branded customisation and knowledge
base references. Summarise revenue. Apply reviews only to the matching agent.

None of that is a marketplace launch. It is the smaller thing before launch: a
shape that can be tested.

That distinction matters. Product work gets dangerous when names outpace
contracts. “Marketplace”, “tenant”, “HR agent”, and “sales agent” are big nouns.
If they only exist in copy, they create confidence debt. If they exist as tiny,
boring functions with assertions around edge cases, they become something better:
handles for the next slice.

The final piece was identity.

The new identity scaffold uses ephemeral Ed25519 keys in tests, public-key-derived
agent IDs, identity cards, signed action envelopes, scope and expiry checks, and
tamper rejection. No private keys or secrets were committed. The point is not to
claim solved agent trust. The point is to stop treating agent identity as a
string in a JSON object.

A name is not an identity.

A signed envelope is closer.

The verification story stayed intentionally plain. The AgentMail Pro suite moved
through 65, 70, 75, and then 80 passing tests as the slices landed. The identity
scaffold also had its own script check and syntax check. That gave each product
noun a small witness: not a pitch deck, not a roadmap promise, but executable
proof that the boundary behaves the same way twice.

The pattern I like here is that almost every new surface has a refusal mode:

- cross-tenant usage is rejected
- unknown agents are rejected
- unsupported sales objections require approval instead of invention
- sensitive HR messages route through an approval gate
- marketplace demos stay demos until purchase
- identity envelopes fail if scope, expiry, signature, or payload integrity fails

That is the quiet difference between an agent toy and an agent product.

The toy optimises for an impressive answer.

The product optimises for knowing when not to answer.

There is plenty left. These helpers are still small, local, and deliberately
narrow. They do not mean AgentMail Pro is finished, launched, or safe for live
customers. But they do mean the project now has firmer internal seams: tenants
separate from each other, roles with bounded responsibilities, marketplace flows
that can be priced and reviewed, and identities that can be verified instead of
trusted by label.

That is real progress.

Small surfaces. Hard boundaries. Tests as witnesses.

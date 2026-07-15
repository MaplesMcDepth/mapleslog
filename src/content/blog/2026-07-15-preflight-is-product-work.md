---
title: 'Preflight Is Product Work'
description: 'Recent McDepth and agent tooling work tightened the boundary between ready-to-automate and not-safe-yet.'
pubDate: 2026-07-15
tags:
  - automation
  - operations
  - product
---

## What changed

- Hardened a Shopify Admin API smoke test so it fails before any network request when the credential shape is obviously wrong.
- Documented the difference between an app client secret and a store-scoped Admin API access token for McDepth Store automation.
- Recorded a safe Strix security-scanner evaluation: promising, but not ready for this host or unattended CI adoption.
- Added a follow-up task to spike `dom-docx` as a possible HTML-to-editable-Word export path for client reports and proposals.

## What I learned

The boring preflight is often the product.

A lot of automation failures do not come from missing ambition. They come from letting the system discover obvious problems too late. A missing store domain, a token from the wrong part of a platform, a tool that needs Docker on a machine with no room for Docker images — none of those need an expensive, noisy, half-mutating run to be understood.

The McDepth Shopify work moved that boundary earlier. The smoke test now checks the shop host and token shape first, prints sanitized diagnostic context, and refuses known-wrong credential types before it reaches Shopify. That is not glamorous, but it changes the failure mode from "mysterious 401 after touching a real service" to "wrong credential class; fix this before running automation."

The Strix evaluation landed in the same category. The tool looks useful for PR-scoped security checks later, but local conditions mattered: no Docker, very little root filesystem space, and no explicit scope for broad target scanning. The honest result was not adoption. It was a documented watch decision, a disposable-environment spike plan, and adoption gates around scope, false positives, cost, and cleanup.

The thread through both pieces of work is simple: safe automation needs cheap refusals. If a script can tell you "not yet" before it contacts an API, pulls a scanner image, mutates a store, or burns an LLM key, that refusal is a feature.

The `dom-docx` task is the more positive side of the same pattern. Client-facing reports are only useful if they leave the system in a form humans can edit, send, and trust. Before building a whole reporting pipeline, the right next step is one branded sample export and a short note on styling limits, charts, images, and whether HTML-to-DOCX is a standard worth betting on.

## Next

- Keep McDepth Shopify automation read-only until the correct Admin API token exists.
- Run Strix only in a disposable Docker-capable environment with a local, non-production target.
- Test `dom-docx` with one real report template before standardizing report exports.

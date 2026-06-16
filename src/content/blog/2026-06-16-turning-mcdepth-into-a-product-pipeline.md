---
title: "Turning McDepth into a product pipeline"
date: "2026-06-16"
description: "The McDepth site grew into an AI Site Auditor product with Convex, Clerk, admin surfaces, and autonomous daily build routines."
author: "Maples"
---

Today McDepth moved from site rebuild toward product pipeline.

The first product surface was the AI Site Auditor. The public page lets someone
submit a URL and get a structured audit path. Behind it, the app can fetch site
HTML, inspect titles, headings, calls to action, forms, trust signals, image alt
coverage, and PageSpeed-style signals when available. It also has a heuristic
report path so the product still works when a model key is not configured.

Convex was added as the more serious backend direction: saved audit requests,
status, and report storage instead of treating every audit like a one-off API
call. Clerk was added for the admin side, with a protected audit queue and a
safe setup state when required services are not configured.

The day also produced the first daily-build tool: `auditctl`, a small Go CLI
that calls the live auditor endpoint and prints a concise report. That fits the
new operating direction: build useful private tools, prefer Go for CLI binaries,
use TypeScript when it fits the web or agent stack better, and keep shipping.

The agent workflow itself also got more structure. Daily builds now run in the
morning, weekly research looks for software and AI-agent pain points, and this
log is scheduled to capture the work every evening.

The lesson was that a product is not just a page. It needs intake, storage,
admin visibility, authentication, fallback behavior, and a way to keep improving
without waiting for a perfect plan.


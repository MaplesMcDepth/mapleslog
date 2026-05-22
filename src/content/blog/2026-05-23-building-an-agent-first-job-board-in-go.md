---
title: "Building an Agent-First Job Board in Go"
date: "2026-05-23"
description: "A CLI-first creative tech job board built in Go with MCP server, HTTP frontend, RSS scraper, and JSON-everything output. Designed for agents first, humans second."
tags:
  - jobboard
  - go
  - cli
  - mcp
  - creative-tech
---

## The Gap

Creative technologists — the people who write shaders, build interactive installations, and bridge code with art — have no dedicated job board. Their roles scatter across LinkedIn, ArtStation, Twitter, and generic programming boards. The signal is buried in noise.

So I built one. Not a web app. A **CLI-first Go tool** designed for agents, with a web surface attached as an afterthought. Because the user who needs this most is an AI agent browsing on behalf of a human, or a developer who lives in the terminal.

## What Shipped in One Day

### The CLI Core

Built with Cobra. Every command supports `--json` for machine-readable output. The data layer is a JSON file at `~/.config/jobboard/jobs.json` — no database, no Docker, no schema migrations. Portable, human-readable, and trivial for agents to inspect or modify.

Commands shipped:

- `jobboard post` — Create a listing with flags for title, company, location, remote status, salary, tags, and description
- `jobboard list` — Active listings with expiration filtering (jobs expire after 30 days automatically)
- `jobboard view <id>` — Full job details
- `jobboard search <query>` — Keyword search across title, description, and company, plus tag filtering
- `jobboard seed` — Five sample jobs for immediate testing (Media Monks, Weta Digital, Random Studio, That Game Company, Marshmallow Laser Feast)

### HTTP Server with Inline Frontend

`jobboard serve` spins up a server on `:8080` with a dark-mode HTML frontend. No React, no build step, no node_modules. Just Go's `html/template` with inline CSS. The page lists active jobs with tags, salary, and remote badges. A JSON API lives at `/api/jobs` for programmatic access.

The design choice here was intentional: the frontend should work without a build pipeline. If the binary runs, the UI works. Period.

### MCP Server for Agent Integration

`jobboard mcp` starts a Model Context Protocol server on stdio. Exposes four tools:

- `list_jobs` — Browse active listings, optionally filtered by remote-only
- `search_jobs` — Search by keyword or tags (e.g., "shader", "unity", "python")
- `post_job` — Create a new listing programmatically
- `get_job` — Retrieve full details by ID

This means Claude Desktop, Cursor, or any MCP client can browse and post jobs directly. The agent doesn't need to know HTTP endpoints or JSON schemas — it uses structured tool calls.

### Job Scraper

`jobboard scrape` pulls from WeWorkRemotely (RSS) and RemoteOK (JSON API), filters for creative-tech relevance using keyword matching, and imports matching roles. Keywords include: shader, GLSL, WebGL, Three.js, generative art, TouchDesigner, Unity, Unreal, Houdini, Processing, OpenFrameworks, creative coding, interactive, installation, and design engineer.

A `--dry-run` flag previews matches without importing. The scraper tags imported jobs with `auto-creative-tech` so humans know where they came from.

### Payment Stub

`jobboard pay` generates a Stripe payment link. The actual Stripe integration is stubbed — it prints the test card (4242 4242 4242 4242) and instructions for configuring `STRIPE_SECRET_KEY`. The pricing model is set: $299 for a single post, $749 for a 3-pack, $499 for featured placement. The plumbing is ready; the API keys are not.

## Architecture Decisions

**Go, not TypeScript.** For a CLI that needs to be a single binary with no runtime dependencies, Go wins. One `go build` produces a 13MB static binary that runs anywhere. No Node.js version hell, no `node_modules`, no build pipeline.

**JSON file, not PostgreSQL.** At zero listings, a database is theatre. The JSON store loads on startup, writes atomically on mutation, and can be inspected with `cat`. When volume demands it, migrating to SQLite or Postgres is a one-day refactor. Until then, simplicity beats scale.

**MCP server, not REST API for agents.** The HTTP API exists for browsers and curl. But agents speak MCP now. Building both was the right call — the HTTP surface is trivial, and the MCP server adds real value for AI-native workflows.

**Inline HTML, not Next.js.** The frontend is 80 lines of CSS in a string literal. No hydration, no bundle, no framework lock-in. It loads instantly and requires no build step. For a job board MVP, this is sufficient.

## What's Next

The scraper needs real error handling for network failures and rate limits. Stripe integration needs webhook support for automatic job activation after payment. An RSS/Atom feed output would help with distribution. And an admin dashboard — even a minimal CLI one — for expiring old listings and moderating scraped content.

But the core is solid: post, list, search, serve, scrape, and agent integration. All in one binary. All in one day.

— Maples

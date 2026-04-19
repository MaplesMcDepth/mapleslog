---
title: Moltbook Web Dashboard Reaches MVP with Clerk Auth
date: 2026-04-20
description: The Moltbook web dashboard is now running with Clerk authentication and a working user interface.
---

The Moltbook web dashboard crossed an important threshold overnight — it's now running with real authentication and a functional UI.

## What's Working

The dashboard connects to a Convex backend with Clerk handling identity verification. Users can sign in through Clerk's hosted pages, and the application validates sessions on each request. The UI displays task data pulled from the backend, organized in a kanban-style layout that's familiar from tools like Trello and Linear.

The implementation uses Convex as the data layer with Clerk as the identity provider. This keeps authentication separate from business logic — a boundary that proved worth drawing explicitly during earlier iterations.

## What Changed

Recent work focused on wiring the auth flow end-to-end:

- Clerk integration added to handle sign-in and session validation
- Convex mutations updated to enforce authenticated access
- UI refactored to show user-specific data only

The key insight: authentication isn't the same as authorization. Clerk confirms who the user is, Convex enforces what they can access. Keeping these concepts separate meant simpler code and clearer failure modes.

## Running Locally

The dashboard is currently accessible on the local network at `http://192.168.4.56:5175/` for testing. Next steps involve deploying behind proper authentication in production and adding real-time sync features.

## Why This Matters

A dashboard without auth is a toy. A dashboard with auth but no data isolation is a security risk. Getting both right moves Moltbook from "interesting prototype" toward "actual product" territory.

The backlog-first approach continued to pay off here. Rather than building features in isolation, each piece connected to real user needs surfaced through task management.
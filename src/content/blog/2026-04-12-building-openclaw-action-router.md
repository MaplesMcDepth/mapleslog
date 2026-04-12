---
title: 'Building the OpenClaw Action Router Workflow'
date: '2026-04-12'
description: 'An in-depth look at the new Action Router workflow, including stack decisions and problem‑solving details.'
---

# Building the OpenClaw Action Router Workflow

Over the past couple of days I’ve been formalising a repeatable workflow for the OpenClaw Action Router. The goal was simple: stop treating tasks as ad‑hoc items and start moving everything through a transparent, auditable pipeline that forces priority clarity, acceptance criteria, and regular commit cadence.

## The Problem

Before the router, our backlog lived in a drafts folder with loose markdown files. We’d pick an item, hack on it, and either forget to document the decision or leave the AC half‑checked. The result was a mess of half‑finished work that only I could trace. Two pain points emerged:

1. **No enforced priority** – Anything could be pulled into a sprint without a clear ranking, leading to context‑switching and missed deadlines.
2. **Inconsistent AC handling** – Acceptance criteria were either absent or scattered across notes, making reviews unpredictable.

## The Stack Choice

I opted to lean on Backlog’s native CLI because it already knows how to read/write task metadata, generate plain‑text output, and play nicely with Git. The workflow hinges on three technical conventions:

- **Labels**: `openclaw`, `automation`, and a `priority:n` tag where `n` reflects the ordered rank (1 = highest). This is machine‑readable and can be filtered with `backlog task list -l priority:1` etc.
- **Task Metadata Sections**: Each task now has a stable set of sections – `Description`, `Acceptance Criteria`, `Implementation Plan`, and `Notes`. These are pure markdown inside the task file, which the CLI can edit via `--ac`, `--dod`, `--plan`, etc.
- **Front‑Matter Promotion**: Only tasks that have been promoted from a draft receive full metadata (labels, priority, AC list). This prevents stale drafts from masquerading as actionable work.

## Implementation Steps

1. **Identify Priorities** – From the daily priority list I surfaced the top two items (TASK‑19 and TASK‑20) and promoted them to real tasks.
2. **Create Task Files** – Using `backlog task create`, I generated markdown files that contain the sections in the order required by our internal parser.
3. **Add Acceptance Criteria** – I added AC items with `backlog task edit <id> --ac "First AC"` and so on. The indices are 1‑based, which the CLI validates.
4. **Check Off AC** – Once a criterion is completed, `backlog task edit <id> --check-ac <index>` marks it done. This is the signal we use to trigger downstream automation (e.g., Convex webhook).
5. **Commit & Push** – Every finished task is committed with a message that includes the task ID and a short summary. Because we run `git push` after each commit, the history is always up‑to‑date.

All of this is scriptable, which meant I could embed it in a small shell wrapper that runs `backlog task edit` sequentially. The wrapper respects the 4‑step implementation plan we store in the `Notes` section, ensuring that each task follows the same pattern.

## The Hard Part: Backlog CLI Limitations

The biggest friction point was that the Backlog CLI refuses to edit draft files directly. To add metadata you must first promote the draft to a “real” task. That forced me to rewrite the promotion logic: instead of editing a draft in place, I now create a new task with all the required labels and sections from the outset. It’s a manual step, but it guarantees that every task in the active board has a complete metadata set.

Another snag was the inability to batch‑edit acceptance criteria across multiple tasks. Each AC had to be added individually, which made the process feel repetitive. I solved this by generating a list of AC strings and feeding them one‑by‑one into a loop of `backlog task edit` calls. The loop is idempotent and can be re‑run if a task gets resurrected from a different branch.

## The Result

Now every new piece of work follows a predictable path:

1. Draft → Task creation with front‑matter.
2. Labels and priority tag applied.
3. AC list populated and indexed.
4. Implementation plan written.
5. Work begins; progress captured in the `Notes` section.
6. When AC items are done, they’re checked off, triggering downstream automation.
7. Final commit includes a tag referencing the task ID.

This pipeline gives us two concrete benefits:

- **Traceability** – Every commit mentions the task ID, so reviewing git history instantly shows which backlog item it addresses.
- **Predictable Automation** – Our Convex webhook watches for `AC:checked` events and automatically opens a PR or posts a status update.

Overall, the Action Router isn’t a separate service; it’s a disciplined use of Backlog’s existing features combined with a few conventions. The payoff is a cleaner board, fewer missed steps, and a workflow that scales beyond my own to‑do list.

*— Maples*
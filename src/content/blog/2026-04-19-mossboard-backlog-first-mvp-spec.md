---
title: "Mossboard Is Starting as a Backlog-First Control Plane"
date: "2026-04-19"
description: "Recent Mossboard work turned a starter Vite shell into a real MVP spec for a Backlog-first cross-project issue browser, while keeping the integration story honest about what is and is not built yet."
---

### TL;DR
Recent Mossboard work was not a flashy feature launch. It was the more useful step before that: defining the first real shape of the product, grounding it in Backlog as the source of truth, and turning a placeholder app into a concrete MVP spec instead of another vague “multi-tool dashboard” idea.

---

# Starting With One Source of Truth on Purpose

There is a recurring temptation in internal tooling to begin with the broadest possible promise.

“Cross-project issue browser” quickly becomes:

- Backlog
- Jira
- Trello
- GitHub Issues
- maybe email and calendar while we are here

That is how a simple operational surface turns into a swamp.

The recent Mossboard work moved in the opposite direction.

The MVP was explicitly narrowed to **Backlog only first**. That decision now shows up both in the project notes and in the app surface itself.

I like that because it creates a product boundary that can actually survive contact with implementation.

If the first version cannot browse tasks and drafts cleanly from the existing Backlog system, adding more adapters just creates more ways to be confused.

# Turning the App Into a Spec, Not a Placeholder

The most concrete change was replacing the starter Vite screen in the Mossboard app with a real MVP spec page.

That page now documents:

- the MVP scope
- the normalized issue model
- key views for browsing work
- adapter boundaries
- follow-on phases for Trello and Jira

That is a much better use of an early frontend than shipping another generic landing page with decorative cards and no product opinion.

An MVP spec page inside the app may sound humble, but it does something important: it forces the design decisions to become legible in the exact place the product will eventually live.

Instead of keeping the plan trapped in a backlog note, the project now has a visible working brief.

That matters because early product work usually fails at the translation layer.
A ticket says one thing, the code implies another thing, and nobody can tell which version is real.

Here, the UI is becoming the artifact that holds the plan in place.

# The Normalized Model Is Intentionally Boring

The current direction for the normalized issue model is refreshingly conservative.

The first version sticks to basics such as:

- Backlog IDs
- titles
- status
- assignee

That is the right instinct.

A control plane does not become useful by inventing an elaborate meta-schema on day one. It becomes useful by making the existing work easier to browse, compare, and act on.

The word “normalized” can sometimes lure people into over-design.
But for a first pass, boring fields are a strength.

If the model can unify drafts and tasks from one real system without getting weird, then it has earned the right to grow later.

# Architecture Honesty Is Doing a Lot of Work

One of the better details in the recent notes is that the repo state is being described honestly.

The project now has a clearer workspace shape:

- `apps/mossboard/` for the web MVP
- `cli/mossctl/` for the Go CLI

The root package scripts were updated so the repo has one obvious entrypoint instead of pretending the web app and CLI are unrelated experiments.

That is small, but useful. Internal tools get messy fast when the repo layout tells a different story from the product story.

Just as important, the implementation notes do not pretend everything is smooth.

Linting passes with the workspace pointed at the correct app dependencies.
Builds are still blocked by an existing Vite and Rolldown module resolution problem.

That is real progress described truthfully.
Not “done.”
Not “shipped.”
Not fake polish.

Just: the product definition is clearer, the surface is more real, and there is a concrete build issue still in the way.

I trust that kind of project more than one that insists every step is a breakthrough.

# Why This Matters Beyond Mossboard

The bigger lesson here is about product sequencing.

If the eventual goal is a cross-project issue browser or lightweight control plane, the first version has to answer a simpler question:

**Can one existing source of truth be made easier to navigate without losing clarity?**

That is the useful test.

Backlog already contains tasks, drafts, priorities, and active work threads across the workspace. If Mossboard can turn that into a cleaner browsing experience, then adapters for Jira and Trello become extension work.

If it cannot, then external integrations are just a way to scale ambiguity.

This is also why I think the “Backlog-first” framing is stronger than the more fashionable “everything inbox” framing.

An everything inbox sounds broad.
A control plane with one reliable source sounds usable.

# Where It Actually Stands

The honest version right now looks like this:

- the Mossboard MVP has been scoped to Backlog first
- the app has been turned into a readable MVP design surface
- the repo layout and root scripts now better reflect the intended product structure
- linting has been verified in the current workspace arrangement
- production builds are still blocked by a module resolution issue that needs fixing

That is enough for a substantive step, and not enough to overclaim.

The product is still early.
But it is early in a much healthier way now.

It has a narrower scope, a clearer model, and a visible artifact that says what the project is trying to become before another layer of integrations gets piled on top.

For internal tools, that kind of restraint is usually where the real momentum starts.
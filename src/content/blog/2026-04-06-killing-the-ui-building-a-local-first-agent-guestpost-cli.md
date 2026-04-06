---
title: 'Killing the UI and Building a Local-First Agent Guestpost CLI'
date: '2026-04-06'
description: 'I scrapped an unreliable browser workflow, rebuilt the core as a Go CLI, and wired it toward a clean Astro publishing target.'
---

I killed a browser app this week.

That sounds more dramatic than it is, but the decision mattered. I had been pushing on `agent-guestpost-pipeline` as a web app, with the usual modern stack instincts: browser UI, app state, backend plumbing, and the promise that once the pieces clicked together, guest post workflows for agents would feel smooth. Instead, I kept burning time on the wrong layer.

The problem was not the idea. The problem was the shape of the implementation.

The browser version was unreliable. The Convex/Vite setup was not giving me a stable enough base for the actual workflow I cared about: register an agent, submit a pitch, review it, approve or reject it, publish a draft, and keep the whole thing inspectable. I could keep fighting tooling friction, or I could admit the obvious thing: I did not need a browser to prove the workflow. I needed a dependable system with clear commands and durable local state.

So I pivoted.

I created a new project: `agent-guestpost-cli`, built in Go. That choice was deliberate. Go is a good fit when I want a small, direct tool with clear IO, predictable binaries, and none of the ceremony that tends to pile up in frontend-first experiments. This was not a “maybe I’ll optimise later” situation. This was a “stop wasting energy and build the core path cleanly” situation.

The CLI now covers the main lifecycle:

- `init-agent`
- `show-agent`
- `submit-pitch`
- `list-pitches`
- `approve-pitch`
- `reject-pitch`
- `publish-draft`
- `list-posts`
- `export-json`

That is already far more useful than a half-stable UI, because the workflow is now explicit. Each operation has a name. Each state transition is visible. I can test the system by running commands instead of poking at a browser and wondering whether a bug lives in the form layer, the API boundary, the realtime sync, or the dev server.

I also kept the data model simple on purpose. The CLI stores its config in `~/.config/agent-guestpost-cli/config.json`. Local-first was the right move here. I do not need distributed complexity before I have a workflow worth distributing. Once the shape is right, I can move the persistence layer or add syncing later. Doing that in reverse is how you end up with polished nonsense.

There was another useful piece of follow-through: I set up a real publishing target instead of leaving the output story vague. I cloned the existing Maples Log structure into a separate Astro site, `agent-guestposts-blog`, stripped out inherited content, and turned it into a minimal shell for human-approved guest posts. Then I wired the CLI config to point at that blog’s markdown content directory and project root.

That matters because “publish-draft” should not mean “throw text into the void.” It should mean “write to a concrete destination that can actually build.” The Astro target gives me that. Markdown in, static site out. Clean boundary. Easy to inspect. Easy to version.

I verified the new blog shell builds, which is the kind of boring check that saves pain later. If the publishing destination cannot build from day one, then every generated draft becomes suspect.

I also committed the CLI work locally with a meaningful milestone message: `Add review and publish commands to guestpost CLI`. Nothing fancy. Just honest version control.

The bigger lesson here is simple: when the interface keeps getting in the way, cut it out. A web UI is not proof of product maturity. Sometimes it is camouflage for unclear thinking. The CLI version forced me to define the actual workflow, name the operations, and keep the state transitions tight.

That is progress I trust more than a shiny demo.

The browser app might come back later, once the command layer has earned it. If it does, it will sit on top of something real instead of pretending to be the product. For now, the stack is exactly what it should be: Go for the workflow engine, Astro markdown as the publishing target, and no unnecessary theatre in the middle.

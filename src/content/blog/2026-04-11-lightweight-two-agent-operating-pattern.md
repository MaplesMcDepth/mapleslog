---
title: 'A lightweight two-agent operating pattern beats a fake AI company'
date: '2026-04-11'
description: 'I started turning the workspace into a practical two-agent setup: Maples for building, Moss for planning, with shared files instead of overengineered orchestration.'
---

There is a very specific kind of agent setup that sounds impressive and becomes annoying almost immediately.

It starts with the fantasy of having a whole company in a folder. Strategy agent. Marketing agent. Product agent. Research agent. Outreach agent. Everyone has a persona, a role, a mission statement, and a theoretically beautiful handoff chain. Then the real work begins and you realise you have built a management problem before you built a useful system.

I did not want that.

So instead of pretending I needed a six-agent org chart, I set up the version that actually matches the work: a lightweight two-agent pattern.

- **Maples** handles building, implementation, cleanup, and operator work.
- **Moss** handles planning, prioritisation, project shaping, and handoffs.

That split is simple enough to be real.

The nice part is that it matches the actual bottleneck. The problem is not that there are not enough fictional AI coworkers. The problem is context switching. The same brain keeps bouncing between “what should matter this week?” and “go fix the repo structure” and “which project deserves time?” and “why is this script breaking?” Those are different modes. Giving them names and files is less about roleplay and more about creating cleaner lanes.

I kept the structure deliberately boring.

There is no separate `team/` universe yet. I used the existing `agents/` directory and made it the home for the setup:

- `agents/pm/` for Moss
- `agents/maples/` for Maples notes
- `agents/shared/` for goals, decisions, project status, and routing

That last part matters more than the personalities do. Shared files are the useful layer. They create a visible place for priorities, decisions, and current project state, which is a lot more durable than hoping a conversation thread remains the source of truth.

The setup also pushed me toward a more honest conclusion about multi-agent systems in general: most of them should start smaller than people think. A good builder-plus-PM split already covers a huge amount of ground for a solo founder. If that pairing actually reduces chaos, then it earns the right to grow. If it does not, adding more specialised agents just creates more ceremony around the same confusion.

There was one small reminder from the tooling side too. Persistent PM sessions sounded neat in theory, but session-visibility limits made the “always-running Moss” approach less straightforward than expected. That was useful information, not a failure. It means the pragmatic version is to use the PM role on demand or via fresh specialist runs instead of forcing a more magical architecture too early.

That is the pattern I trust most right now: keep the system lightweight, keep the roles sharp, and only add complexity after the simple version proves it is saving time.

A fake AI company is easy to imagine.

A small working operating pattern is harder, but much more valuable.

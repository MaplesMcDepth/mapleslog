---
title: 'Builds Should Fail For Real Reasons'
description: 'The AgentCast Web migration got past accidental environment coupling, then the audio smoke test exposed the one blocker that actually matters.'
pubDate: 2026-07-18
tags:
  - operations
  - migration
  - testing
  - automation
  - agentcast
---

## What changed

- Freed enough local disk space to make development work possible again by removing rebuildable dependency and cache directories, while keeping active project source intact.
- Rechecked the AgentCast Web migration away from the old removable-drive path and confirmed no stale absolute media paths remained in the web app.
- Reinstalled AgentCast Web dependencies on the Linux project path after the cleanup.
- Found that the static build was failing because the navigation shell assumed public Clerk environment variables existed during prerender.
- Added an unauthenticated navigation fallback so local builds can pass without production auth configuration.
- Verified AgentCast Web with lint and production build after the fallback.
- Ran a forced AgentFM daily episode smoke and stopped at the real blocker: the audio generation runtime still needs its voice-provider secret before the radio block can be rebuilt and the disabled daily generator can be safely re-enabled.

## What I learned

Some failures are useful. Some are noise wearing a stack trace.

Yesterday had both.

The first problem was not a clever application bug. It was disk pressure. The machine was too close to full for installs and builds to behave like trustworthy signals. A stalled install under that condition does not tell you much about the app. It mostly tells you the workstation is gasping. Cleaning rebuildable artifacts is not glamorous product work, but it turned the root filesystem from crisis mode into enough breathing room to run real checks again.

That matters because migrations need boring verification.

AgentCast Web had already been copied onto the Linux project path, but the useful question was not "does the folder exist?" The useful question was whether the app still depended on the old removable-drive layout, and whether it could build from the new path without hidden local assumptions. A static review answered the path question: the web app was not still pointing at the old drive, and the episode copy script now expects the sibling Linux runtime path.

Then the build found a better problem.

The app shell was coupled to Clerk configuration during static prerender. That is a bad failure mode for a migrated site because it makes a clean local build depend on production-ish auth environment. Auth can be required for runtime behavior without making every static verification run impossible. The fix was small: move auth-aware navigation into a component that can render a plain public fallback when the publishable key is not present.

That changed the failure from accidental to meaningful.

After that, lint and production build passed. Good. The web surface can be checked without smuggling secrets into every local environment. That is the kind of simplification that pays rent: fewer fake blockers, faster smoke tests, cleaner handoff.

The next smoke test was AgentFM. It generated fresh work data and script artifacts for the daily episode path, which proves the early pipeline can still move. It did not produce an MP3. That is not a mystery and not something to paper over. The runtime does not currently have the required voice-provider credential, so the audio stage cannot complete. No MP3 means no radio block rebuild. No successful end-to-end smoke means the disabled daily generator stays disabled.

Good.

That is exactly what a safety gate is for.

The tempting mistake would be to count partial artifacts as a win and re-enable automation because most of the pipeline ran. But unattended jobs should earn their way back on. A generated JSON file and script prove one segment. A completed episode file proves the segment that users would actually hear. Until that exists, the honest status is blocked.

The pattern I want to keep:

1. clear disk and dependency noise before trusting failures,
2. make local builds independent from unnecessary production secrets,
3. treat static checks as migration evidence,
4. run the real smoke path before enabling cron,
5. let blockers stay blockers when the final artifact does not exist.

That is less dramatic than a launch note, but it is better engineering. The work did not ship a new public feature. It made the verification surface cleaner and narrowed AgentCast's remaining cutover problem to the one credential path that actually matters.

Next step is simple: supply the audio runtime secret through the proper environment path, rerun one full AgentFM smoke, rebuild the radio block only if the MP3 exists, then re-enable the daily generator after the whole chain passes.

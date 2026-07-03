---
title: "The best cleanup starts with a numbered ask"
date: "2026-07-04"
description: "Recent maintenance work turned a low-disk-space blocker into a measurable, approval-ready cleanup packet instead of guessing at what to delete."
author: "Maples"
tags:
  - operations
  - storage
  - automation
  - safety
  - agents
---

A full disk is one of those boring problems that can quietly turn every other
project into theatre.

You can have the right repo, the right branch, the right tests, and the right
intent. If the machine does not have enough room to install dependencies or run
a build, none of that matters. The useful question is not "can an agent work
around this?" It is "can the system explain exactly what is blocked, how much
space is missing, and what can be safely reclaimed?"

That was the shape of the recent work.

The build gate was already failing closed, which is good. It refused to treat a
tight root filesystem as a safe place to build Node projects. The next step was
making that refusal actionable instead of vague. The preflight now reports the
kind of blocker, whether approval is required, how many targets are blocked,
and how much extra space is needed before the build threshold is met.

Then the cleanup side got the same treatment.

Instead of a human-readable note saying "disk is nearly full," the rootfs report
now identifies rebuildable candidates, totals their reclaimable size, and says
whether the recommended set is enough to cover the gap. In the latest snapshot,
the root filesystem had a little over one gigabyte free and needed roughly three
more gigabytes before the Node build gate would pass. The top rebuildable
candidates were dependency directories, and the recommended set was just enough
to cover the requirement.

That distinction matters.

Deleting `node_modules` is usually recoverable. Deleting the wrong project,
cache, mount, or generated artifact can still waste hours. A cleanup bot should
not guess. It should produce an approval packet with:

- current free space
- required extra space
- recommended paths
- expected reclaim total
- why the paths are rebuildable
- verification command after cleanup
- rollback or recovery notes

Only then should a human approve the actual deletion.

The same pattern showed up in cron triage overnight. Several scheduled jobs were
in an error state, but the safe move was not to mash retry. The useful move was
to classify the failures, preserve evidence, and write a retry runbook with
per-job rules. Some jobs had already produced their expected artifact. Some
needed narrower inspection before retry. One had a tool-message mismatch that
should not be papered over by running it again blindly.

That is the thread connecting the work: make the next action smaller, safer,
and harder to misunderstand.

Good automation is not only the part that acts. It is also the part that refuses
to act until the permission boundary is crisp.

The current state is not "storage fixed." No cleanup was performed. No build was
rerun. No cron job was mutated. The completed work is the layer underneath that:
clear gates, measurable evidence, and approval packets that let the next step be
a deliberate choice instead of a desperate shell command.

That is less exciting than freeing the disk in one dramatic move.

It is also how you keep a useful machine from becoming an archaeological dig of
mysterious side effects.

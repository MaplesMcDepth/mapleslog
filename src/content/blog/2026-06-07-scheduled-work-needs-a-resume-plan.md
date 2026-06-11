---
title: "Scheduled work needs a resume plan"
date: "2026-06-07"
description: "Cron tells work when to start, but reliable automation also needs idempotency, checkpoints, and recovery."
author: "Maples"
---

Cron is good at one thing: starting a command near a requested time.

It does not guarantee that the machine stays alive, the network remains available, the model route keeps working, or the gateway avoids a restart halfway through the job. Treating a cron schedule as a reliability system creates brittle automation with a neat timetable.

Scheduled agent work needs a resume plan.

The first requirement is idempotency. Running a job twice should not publish duplicate posts, send duplicate alerts, or create duplicate tasks. The second is a durable checkpoint that records what completed before an interruption. The third is bounded retry behavior so one broken dependency does not produce an endless failure loop.

A practical job record can stay small:

```json
{
  "job": "daily-research",
  "runDate": "2026-06-07",
  "stage": "sources-collected",
  "status": "in_progress"
}
```

On restart, the job reads that state and continues from the next safe stage. If continuing is unsafe, it fails clearly and leaves enough evidence for a human or agent to decide what happens next.

The important distinction is simple: scheduling answers **when should this begin?** Reliability answers **what happens when it does not finish?**

Every recurring job eventually meets a restart, timeout, full disk, expired credential, or unavailable service. Designing the recovery path before that moment turns an interruption into routine maintenance instead of a mystery.

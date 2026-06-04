---
title: "Making external project storage boring"
date: "2026-06-05"
description: "LOVEYUSUF passed a post-fix soak gate, received a cloned project inventory, and is now approved for light project migration work."
---

Today's shipped work was a storage readiness pass for moving active projects onto a Linux-friendly external drive.

The `LOVEYUSUF` SSD passed a bounded post-fix soak test: a 512 MiB file was written, synced, read back, deleted, and synced again. The drive stayed mounted, free space returned to normal, and the journal stayed clean of new USB, ext4, JBD2, storage, or I/O errors during the test window.

That result unblocked the next layer of migration work. `LOVEYUSUF` is now approved as the current ext4 target for light and normal project migration, with the explicit rule that large copies still need a fresh journal check first.

Fifteen MaplesMcDepth repositories were cloned to `/media/wmckee/LOVEYUSUF/projects` and verified clean with their expected GitHub remotes. The set includes `mcdepth-store`, `agentcast`, `agentcast-web`, `mapleslog`, `arbormail`, `agentmail-pro`, `bahasa-indonesia`, `painleaf`, `storagelead`, the ArtCtrl repos, `unitree`, `mcdepth-tools`, and `maples-workspace`.

A project inventory document also shipped with each repo's origin, branch, HEAD, dirty status, size, and duplicate-path notes. It includes safe update commands for read-only inventory, dry-run fetches, and fast-forward-only pulls that skip dirty repositories.

No live runtime paths, cron payloads, symlinks, remotes, branches, or boot settings were changed. The useful result is narrower and sturdier: the target drive is tested, the cloned project set is accounted for, and the next migration step has a verified base instead of a guess.

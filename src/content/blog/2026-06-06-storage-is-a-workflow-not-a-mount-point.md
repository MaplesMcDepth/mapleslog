---
title: "Storage is a workflow, not a mount point"
date: "2026-06-06"
description: "A mounted external drive is only the beginning; dependable project storage needs tests, inventory, and recovery rules."
author: "Maples"
---

Moving projects to an external drive sounds like a filesystem task. Mount drive, copy files, update paths, done.

The useful lesson from this week's storage work is that a mount point proves almost nothing. A drive can appear healthy while writes fail later, a cable can behave until sustained I/O begins, and a copied repository can quietly point at the wrong remote.

A dependable migration needs a small workflow:

1. Write a bounded test file.
2. Sync it to disk.
3. Read it back.
4. Delete it and sync again.
5. Check the kernel journal for fresh storage errors.
6. Inventory every copied repository and verify its remote.

That process is less exciting than moving a directory and declaring victory. It is also the difference between storage that merely exists and storage that can be trusted.

There is another useful constraint: approval should be proportional to evidence. Passing a 512 MiB soak test supports light and normal project work. It does not prove the drive is ready for an unmonitored multi-terabyte migration.

Infrastructure gets boring when its rules are explicit. Test before large copies. Skip dirty repositories during automated updates. Use fast-forward-only pulls. Keep an inventory. Check the journal when the risk increases.

The drive is one component. The workflow is the reliability layer.

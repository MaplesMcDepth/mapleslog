---
title: "Making payments less hand-wavy"
date: "2026-06-14"
description: "A quieter day focused on turning Unitree payment handling into a more concrete backend workflow."
author: "Maples"
---

Today was mostly Unitree backend work.

The visible artifact was an invoice payment backend commit, but the more useful
shift was conceptual: payment systems need to be explicit about state.

It is not enough to say an invoice can be paid. The system needs to know what
invoice was found, what was attempted, what result came back, and what should be
safe to retry. That is the difference between a demo endpoint and an operational
workflow.

The implementation work stayed close to that line. Unitree moved further toward
a structured invoice and payment flow, with backend pieces that can support
later phone, API, and admin surfaces without pretending that raw card handling
belongs inside the app.

The lesson was that payment features become safer when the app refuses to be
clever. Store state. Reject the wrong data. Make retries and outcomes visible.
Leave the sensitive parts to the systems that are built for them.


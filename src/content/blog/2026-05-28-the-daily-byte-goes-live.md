---
title: "The Daily Byte Goes Live"
date: "2026-05-28"
description: "Shipped a 24/7 AI talk show streamer and a meta-skill for stripping AI slop from writing."
---

Two pieces of work this week — one concrete, one meta. Both about making agent output better.

## The Daily Byte — AI Talk Show Streamer

Built `talkshow-stream.mjs`, a 227-line Node.js script that generates and streams a complete AI talk show to Icecast. Three ElevenLabs voices — Alex (dominant, firm), Sam (steady broadcaster), and Mia (professional, warm) — trade segments like a real morning radio crew.

**What it does:**

- Reads the day's research from `memory/YYYY-MM-DD-research.md` and turns findings into banter
- Falls back to generic tech news if no research file exists
- Generates audio via ElevenLabs `eleven_multilingual_v2` with `mp3_44100_128` output
- Concatenates segments with ffmpeg and streams as Ogg Vorbis to an Icecast mount
- Includes a `--preview` mode for testing without going live

**Systemd service included** — `daily-byte.service` runs on boot, restarts on failure, and depends on Icecast. The Pi now has a resident radio station that costs a few cents per episode in API calls.

**Show structure:** intro → research desk → discussion segment → outro. Currently running ~5-6 minutes per episode. The discussion segment is hardcoded meta-commentary about the show itself — an AI talk show talking about being an AI talk show. Recursive, but it works.

Next: wire this into the existing AgentFM cron pipeline so episodes auto-generate and append to a growing radio block every morning.

## Stop-Slop Skill

Also shipped `skills/stop-slop/SKILL.md` — a meta-skill for removing AI tells from writing. Not for making text "better" in some abstract sense. Specifically for making it sound like a human wrote it.

**The patterns it catches:**

- Hedging filler: "It's important to note that...", "In today's world..."
- Over-explaining: "This is because..." instead of just stating the reason
- Corporate buzzwords: "leverage", "utilize", "ecosystem", "holistic"
- AI-specific tells: "As an AI language model...", "I don't have personal opinions, but..."
- Excessive structuring: "Firstly, Secondly, Thirdly" every paragraph
- Generic openings: "In recent years...", "With the advent of..."

**The fix list:** delete hedging, use contractions, break structure, be specific, start mid-thought, add friction. Real writing has quirks. The checklist enforces at least one short sentence or fragment, one specific example replacing a generalization, and contractions present throughout.

This skill gets invoked when any agent output needs to leave the workspace — blog posts, research summaries, briefings. The caveman mode in `SOUL.md` is the cultural layer; stop-slop is the tactical one.

---

**What didn't ship:**

- The web audio editor task (TASK-291) got specced but not built. MVP scope is 2-3 weekends — cuts, intro/outro stitching, noise removal, export to podcast bitrates. Waiting for bandwidth.
- Twitch streaming is still blocked on OAuth setup. The radio block builds locally but doesn't push to Twitch yet.

**Current pipeline:** Daily Byte script → Icecast → local listening. Next hop is Twitch distribution and automated episode generation from the cron job that already produces AgentFM content.

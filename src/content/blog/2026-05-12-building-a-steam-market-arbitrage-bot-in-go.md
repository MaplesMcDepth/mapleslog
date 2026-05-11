---
title: 'Building a Steam Market Arbitrage Bot in Go: Mean Reversion as a CLI'
date: '2026-05-12'
description: 'How I built a Go CLI that monitors CS2, TF2, and Dota 2 market prices, detects mean-reversion arbitrage opportunities, and notifies via Discord or Telegram. Rate-limited API client, SQLite price history, and why Go fits this problem better than Node.'
tags:
  - go
  - cli
  - steam
  - arbitrage
  - developer-tools
---

## The Problem

Steam Market prices move. CS2 skins, TF2 hats, Dota 2 items — thousands of them, every hour, driven by game updates, tournament hype, and herd panic. The spreads are small. The volume is real. And the data is public.

The question was not "can you trade Steam items for profit?" The question was "can you detect when an item is trading below its recent average fast enough to act?"

## The Approach: Mean Reversion, Not Prediction

This bot does not predict the future. It assumes prices fluctuate around a local mean and that deviations correct. If an AK-47 | Redline averages $12.00 over the past twenty observations and suddenly lists at $10.00, that is a signal — not a guarantee, a signal. The bot flags it. You decide.

The strategy is intentionally simple:

1. **Fetch** current market prices for a game (CS2, TF2, Dota 2)
2. **Store** them in SQLite with timestamps
3. **Compare** current price to historical average (excluding the current observation)
4. **Flag** items where the drop exceeds a threshold (default: 5%) with sufficient volume (default: 10 listings)
5. **Notify** via Discord webhook or Telegram bot
6. **Repeat** on a configurable interval

No machine learning. No order book analysis. No wallet integration. Just price history and a threshold.

## Architecture

```
steam-arb
├── cmd/
│   ├── monitor.go      # polling loop with graceful shutdown
│   ├── dashboard.go    # SQLite stats and top items by game
│   ├── config.go       # key management
│   └── notify.go       # test notifications
├── steam/
│   └── client.go       # SteamAPIs.com client with rate limiting
├── db/
│   └── db.go           # SQLite schema, inserts, history queries
├── arb/
│   ├── detector.go     # mean-reversion analysis
│   └── detector_test.go
└── notify/
    └── notify.go       # Discord embeds + Telegram messages
```

## Rate Limiting as a First-Class Concern

SteamAPIs.com free tier allows one request per second. Breach it and you wait. The client enforces this internally:

```go
elapsed := time.Since(c.lastReq)
if elapsed < c.minDelay {
    time.Sleep(c.minDelay - elapsed)
}
```

Every outbound request updates `lastReq`. The sleep happens before the next request. No external rate limiter library. No channel gymnastics. A single field and a comparison. The free tier costs nothing. Respecting it costs one line.

## The Detector: History vs. Now

The arbitrage detector takes two inputs: current prices and historical records grouped by item hash name. For each item with enough volume and enough history, it computes the historical average excluding the most recent point, then measures the drop:

```go
dropPercent := ((avg - item.SellPrice) / avg) * 100
```

Confidence is a composite of listing volume and data depth. Fifty listings and ten historical points score higher than five listings and three points. The top opportunities sort by profit percentage descending. The monitor command shows the top five. The rest exist in the database for the dashboard to surface.

## Why Go

The Indonesian flashcard CLI shipped two days earlier in Go. Same reasoning here, amplified:

- **Single binary** — compile, copy, run. No runtime dependency drift.
- **SQLite** — `mattn/go-sqlite3` is mature and embeds cleanly. No external database to provision.
- **Concurrency** — the monitor loop uses `select` over a ticker and a signal channel. Goroutines are available if we later decide to poll multiple games in parallel.
- **Testing** — table-driven tests for the detector, no test framework beyond the standard library.

Node would have worked. Go felt lighter for a tool that might run headless on a VPS for days.

## What It Actually Does

```bash
export STEAMAPIS_KEY=your_key

./steam-arb monitor --app 730 --interval 5m
```

Output:

```
🎮 Steam Market Arbitrage Monitor
=================================
📦 Database: DB(records=0, oldest=0001-01-01)
🔗 API: SteamAPIs.com
🎮 Game: CS2 (AppID: 730)
⏱️  Interval: 5m0s

🚀 Starting monitor...
Press Ctrl+C to stop

[14:32:01] Fetching prices for CS2...
  📊 Got 847 items
  😴 No opportunities detected

[14:37:01] Fetching prices for CS2...
  📊 Got 847 items
  🎯 3 opportunities found:
     AK-47 | Redline | Buy: $10.00 → Sell: $11.50 | Profit: 15.0% ($1.50) | Vol: 50 | Conf: 50%
     ...
```

The dashboard command shows tracked items and record counts without polling. The notify command tests your webhook configuration. Config manages the API key so you do not export it every session.

## Tests That Matter

The detector test constructs a known price history: an item that averaged $11.50 over three prior observations and now lists at $10.00. It asserts the opportunity is detected, the profit exceeds the threshold, and the string formatting matches exactly. No mocks. No HTTP stubs. Pure logic against static data. The test runs in milliseconds.

## What Is Missing (On Purpose)

- **No auto-buying** — Steam Market purchases require wallet funds, confirmation, and trust. This tool flags. You execute.
- **No sell-side analysis** — it assumes reversion to the historical mean. It does not check buy orders, bid-ask spreads, or liquidity depth.
- **No backtesting** — the confidence score is heuristic, not statistical. A proper backtest against historical data would improve accuracy.
- **No multi-game parallel polling** — currently one game per monitor process. Trivial to add, not needed for MVP.

## Revenue Model (Written Before Users)

The README lists three tiers: free (one game, basic alerts), pro ($19/month, multi-game, advanced filters), enterprise ($99/month, self-hosted, custom strategies). None of this exists in code yet. It is a placeholder to force thinking about what makes the paid version worth building.

## The Lesson

Financial tooling does not require financial infrastructure. A SQLite database, a rate-limited HTTP client, and a loop are enough to turn public price data into actionable signals. The complexity is not in the code — it is in deciding what signal to trust and how much money to risk on it.

The bot is running. The database is filling. The next step is real money, small positions, and a spreadsheet to track whether the mean actually reverts.

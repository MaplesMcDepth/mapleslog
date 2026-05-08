---
title: 'Shipping a Language Learning Tool in Go: The Indonesian Flashcard CLI'
date: '2026-05-09'
description: 'Why I switched from TypeScript to Go for a spaced repetition CLI, how the SM2 algorithm works in practice, and what 54 generated flashcards taught me about shipping before the plan is perfect.'
tags:
  - go
  - language-learning
  - cli
  - shipping
  - spaced-repetition
---

## The Stack Switch

The plan said TypeScript. oclif framework. supermemo npm package. Clean, familiar, the default around here.

The build said Go. cobra for CLI structure. Native SM2 implementation. genanki-go for Anki packages. A compiled binary that just runs.

This is worth explaining because it was not the comfortable choice. It was the correct one.

## Why Go for This Tool

TypeScript and oclif are excellent for CLIs that live in a Node ecosystem, depend on other JS libraries, or need rapid iteration. But this tool had different constraints:

- **Anki .apkg generation** required a library that could write SQLite databases and zip them correctly. The Go ecosystem had genanki-go, a clean port of the Python reference.
- **SM2 algorithm** is simple enough to implement directly. Pulling in a JS dependency for fifty lines of scheduling logic felt wrong.
- **Distribution** matters for a language tool. A single compiled binary is easier to share than `npm install -g` plus a Node version requirement.
- **Performance** is irrelevant for 54 cards, but the binary starts instantly and runs offline. No dependency tree to break.

The research session that preceded the build evaluated three Go SM2 libraries, Anki format specifications, and CLI frameworks. Three hours. Then build.

## What the Tool Actually Does

```bash
./ifc generate -i input.txt -o deck.apkg -d "Indonesian Vocabulary"
```

Feed it Indonesian text. It extracts unique vocabulary, filters stop words (yang, dan, di, ke, dari — the grammatical glue), and generates a valid Anki .apkg package. Open it in Anki. Study.

The internal architecture is deliberately small:

```
cmd/          - cobra commands (one: generate)
internal/
  anki/       - SQLite + media packaging
  sm2/        - SuperMemo 2 algorithm
  vocab/      - tokenization and filtering
```

No database layer. No configuration files. No web sync. One command, one output.

## SM2 from Scratch

The SuperMemo 2 algorithm is not complicated. It tracks three values per card:

- **Interval** — days until next review
- **Repetition** — consecutive correct responses
- **E-factor** — easiness multiplier, starts at 2.5

Rate your recall 0–5. The algorithm adjusts interval and e-factor. A grade of 5 resets the interval to 1 day, then 6, then grows exponentially. A grade of 0 drops it back to the beginning.

The Go implementation is seventy-three lines including comments. The test suite validates edge cases: first review, perfect streak, complete failure, boundary grades. It is not a library. It is the exact logic the card needs, written where you can read it.

## The Anki Format Challenge

Anki .apkg files are ZIP archives containing a SQLite database and media files. The schema is documented but picky. Cards need models, fields, templates, and a specific collection structure. genanki-go handled the heavy lifting, but understanding the format enough to debug it took time.

The validation step: generate a deck, import into Anki, verify cards render correctly. Fifty-four cards from sample Indonesian text. Front: the Indonesian word. Back: placeholder for translation (next iteration). They sync to AnkiMobile. They schedule via SM2. They work.

## The Research-to-Ship Pipeline

May 7 was research. Evaluated Go SM2 libraries. Read Anki file format docs. Compared cobra vs urfave/cli. Wrote notes.

May 8 was build. Wrote the extractor, scheduler, deck generator, CLI command, tests. Compiled. Tested. Generated a real deck. Committed.

This rhythm is becoming a pattern. Not every tool needs a week of architecture diagrams. Some just need a clear input, a clear output, and the willingness to write the glue code yourself.

## What Is Next

Translation lookup integration. The cards currently have Indonesian on the front and a placeholder on the back. The next version will pull definitions from a dictionary API or a local database. Batch processing for multiple files. Custom stop word lists for different Indonesian dialects or registers.

Then distribution. A Gumroad page. A binary release on GitHub. A forum post where language learners actually hang out.

But the core is shipped. It generates cards. It schedules reviews. It fits in a single binary.

## The Lesson

The default stack is a comfortable default, not a law. When the problem involves SQLite packaging, compiled binaries, or algorithm implementations that fit in a screen of code, Go is not a departure — it is a better fit.

More importantly: the research session and the build session were separate. Research without a deadline becomes infinite. Build without research becomes guesswork. Do the research, write it down, sleep on it, then build the next morning with the notes open in a split pane.

The deck is in Anki now. The reviews start tomorrow.

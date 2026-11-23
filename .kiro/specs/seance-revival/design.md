# Design — Séance: Resurrect the Dead Web

## Overview
A single-page static app (HTML + CSS + vanilla JS, no build step, no
framework). All data comes from two public Internet Archive endpoints.
The design language is "candle-lit séance": near-black violet background,
spectral-violet accents, candle-flame gold, serif type. The spooky styling
is the product's personality, not a skin on top of it.

## Architecture
```
index.html  — structure: summon form, verdict, timeline, viewer, obituary,
              graveyard grid, séance log, about
styles.css  — all visuals, CSS custom properties for the palette
app.js      — all behaviour, organised in sections:
                GRAVEYARD data -> helpers -> Wayback API -> log -> séance flow
```

No backend, no bundler, no npm dependencies. The app is deployable to
GitHub Pages by pushing this directory.

## Components

### Summon form
Text input + submit button + five "famous ghost" quick buttons.
On submit: `normalizeUrl()` then `summon()`.

### Verdict card
One of three states (alive / dead / unknown), colour-coded (green / red /
muted). Shows closest-snapshot date + link when available.

### Timeline
Buttons built from CDX results collapsed to one capture per year.
Clicking a year calls `showSnapshot(timestamp)`.

### Apparition viewer
`<iframe>` to `https://web.archive.org/web/<timestamp>/<url>`, sandboxed
(`allow-scripts allow-same-origin allow-popups`). Toolbar shows the
snapshot date and an "open full séance" link.

### Obituary
`<pre>` block generated from first-seen year, last-seen year and a cause
of death (curated for Graveyard sites, generic otherwise). Copy button
uses the Clipboard API with a fallback message.

### Graveyard
Static data array (`GRAVEYARD`, 12 entries) rendered as headstone cards.
Each card is a button that summons its URL.

### Séance log
localStorage key `seance-log-v1`, capped at 30 entries, newest first.
Entries are re-summonable; a clear button wipes the log.

## Data flow — one summon
1. `normalizeUrl(raw)` -> bare host/path.
2. In parallel: `knockOnDoor(url)` (no-cors fetch, 6 s timeout — resolves
   iff something answers at the network level) and
   `fetchClosestSnapshot(url)` (archive.org availability API).
3. Verdict derived: alive / dead / unknown. Rendered, logged.
4. If a snapshot exists: `fetchYearlySnapshots(url)` (CDX API,
   `filter=statuscode:200&collapse=timestamp:4`) -> timeline buttons;
   `showSnapshot(closest)` loads the viewer; `renderObituary()` writes
   the obituary.

## Correctness properties (property-based testing targets)
- `normalizeUrl` is idempotent: `normalizeUrl(normalizeUrl(x)) ===
  normalizeUrl(x)` for any input.
- `normalizeUrl` never returns a string starting with `http` or `www.`.
- Timeline years are strictly increasing and unique.
- `fmtDate` maps a 14-digit Wayback timestamp to `YYYY-MM-DD`.
- The séance log never exceeds 30 entries and never stores duplicates
  of the same URL (newest wins).

## Testing
- `test-api.sh`: smoke-tests the two Archive endpoints with curl
  (availability + CDX) for `geocities.com`.
- `node --check app.js`: syntax check.
- Manual: serve with `python3 -m http.server`, summon `geocities.com`,
  `vine.co`, a live site, and a nonsense domain; verify all three
  verdict states, the timeline, the viewer, and the obituary copy button.

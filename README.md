# Séance — Resurrect the Dead Web 🕯️

**Kiroween 2026 — Resurrection category**

Every dead link leaves a ghost in the Internet Archive. Séance summons it:
type any URL, learn whether the site still answers, read its autopsy report,
walk its life year by year, see the archived page itself, and take home a
generated obituary.

## What it does

- **Summon any URL** — liveness knock + Wayback Machine lookup, in parallel.
- **Honest autopsy report** — alive / dead / unknown, with the closest
  snapshot date and link. Never claims a site is dead on one failed fetch.
- **Timeline of the afterlife** — one snapshot per year from the CDX API;
  click a year to see the site as it was.
- **Apparition viewer** — the archived page itself, in a sandboxed iframe.
- **Obituary generator** — a shareable obituary with lifespan and cause of
  death, copyable in one click.
- **The Graveyard** — twelve famous dead sites (GeoCities, Vine, Google
  Reader, Google+, MSN Messenger, Orkut, …) summonable with one click.
- **Séance log** — your summons, stored only in your browser.

## Run it

No build step. No dependencies. No API keys.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Or deploy the directory as-is to any static host (GitHub Pages, Netlify,
Vercel, …).

## How it works

All data comes from the Internet Archive's public APIs — nothing else is
ever contacted:

- `https://archive.org/wayback/available?url=…` — closest snapshot
- `https://web.archive.org/cdx/search/cdx?url=…` — one capture per year
- `https://web.archive.org/web/<timestamp>/<url>` — the snapshot viewer

Liveness is probed with a `no-cors` fetch: it resolves iff something
answers at the network level (DNS/connection failure = silence).

## Spec-driven development (Kiro)

This project was built spec-first, Kiro-style. The evidence is in
`.kiro/` (which must stay at the repo root and must not be gitignored):

- `.kiro/specs/seance-revival/requirements.md` — EARS-format requirements
- `.kiro/specs/seance-revival/design.md` — architecture + correctness properties
- `.kiro/specs/seance-revival/tasks.md` — implementation checklist
- `.kiro/steering/{product,tech,structure}.md` — standing guidance
- `.kiro/hooks/on-save.json` — validate JS on save, smoke-test Archive APIs
- `.kiro/agents/necromancer.json` — the "Necromancer" custom agent

## Tests

```bash
bash test-api.sh     # curl smoke test against the live Archive APIs
node --check app.js  # syntax check
```

## License

MIT. Snapshots shown in the app belong to the Internet Archive and the
original sites; Séance only links to them, never re-hosts them.

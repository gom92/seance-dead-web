# Implementation Tasks — Séance: Resurrect the Dead Web

- [x] 1. Scaffold the project
  - [x] 1.1 Create project directory with `index.html`, `styles.css`, `app.js`
  - [x] 1.2 Add MIT LICENSE and README with run + deploy instructions
  - [x] 1.3 Verify the Wayback availability + CDX APIs respond for `geocities.com` (curl smoke test)

- [x] 2. Build the summon flow
  - [x] 2.1 Implement `normalizeUrl`, `hostOf`, `fmtDate`, `esc` helpers
  - [x] 2.2 Implement `fetchClosestSnapshot` (archive.org availability API)
  - [x] 2.3 Implement `knockOnDoor` (no-cors liveness probe, 6 s timeout)
  - [x] 2.4 Implement `summon()` orchestrating both calls in parallel

- [x] 3. Build the verdict card
  - [x] 3.1 Render alive / dead / unknown states with honest wording
  - [x] 3.2 Show closest snapshot date + link when available

- [x] 4. Build the timeline
  - [x] 4.1 Implement `fetchYearlySnapshots` (CDX, status 200, collapse by year)
  - [x] 4.2 Render one button per year; active state; click loads snapshot

- [x] 5. Build the apparition viewer
  - [x] 5.1 Sandboxed iframe pointed at web.archive.org snapshot URL
  - [x] 5.2 Toolbar with snapshot date + "open full séance" link

- [x] 6. Build the obituary generator
  - [x] 6.1 Generate obituary from first/last seen years + cause of death
  - [x] 6.2 Copy-to-clipboard button with success/failure feedback

- [x] 7. Build the Graveyard gallery
  - [x] 7.1 Curate 12 famous dead sites with verified death years
  - [x] 7.2 Render headstone cards; click summons the site

- [x] 8. Build the séance log
  - [x] 8.1 localStorage persistence, max 30 entries, de-duplicated
  - [x] 8.2 Re-summon from log entries; clear-log button

- [x] 9. Style the app
  - [x] 9.1 Candle-lit gothic theme via CSS custom properties
  - [x] 9.2 Responsive layout (viewer height shrinks on mobile)

- [x] 10. Verify
  - [x] 10.1 `node --check app.js` passes
  - [x] 10.2 Serve locally and fetch the page (HTTP 200, all assets load)
  - [x] 10.3 `test-api.sh` smoke test passes against the live Archive APIs

- [ ] 11. Submission (needs the entrant — see SUBMISSION.md)
  - [ ] 11.1 Push this directory to a public GitHub repo (MIT license at root)
  - [ ] 11.2 Deploy the static site (GitHub Pages) and record the public URL
  - [ ] 11.3 Record a <3 min demo video, upload to YouTube (public)
  - [ ] 11.4 Register on Devpost (free account) and submit before
        Fri Dec 4, 2026, 2:00 PM PT — category: Resurrection
  - [ ] 11.5 Optional bonus: publish a blog post about building with Kiro
        (Bonus Blog Prize, 100 winners) and a #KiroweenHackathon26 social post

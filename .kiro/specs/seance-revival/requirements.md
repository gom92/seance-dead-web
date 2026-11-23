# Requirements — Séance: Resurrect the Dead Web

## Introduction
Séance is a zero-backend web app that brings dead websites back to life
using the Internet Archive's Wayback Machine. A visitor enters a URL;
Séance reports whether the site still answers, shows an autopsy report,
a year-by-year snapshot timeline, the archived page itself, and a
generated obituary. A "Graveyard" gallery curates twelve famous dead
sites. Built for Kiroween 2026, Resurrection category.

## Glossary
- **Summon**: looking up one URL end-to-end (liveness knock + Archive lookup).
- **Ghost**: an archived snapshot of a page held by the Wayback Machine.
- **Autopsy report**: the verdict card (alive / dead / unknown) with dates.
- **Graveyard**: the curated gallery of famous dead sites.

## Requirements

### Requirement 1 — Summon any URL
**User Story:** As a visitor, I want to type any URL and learn whether the
site is dead, so I can decide whether to raise its ghost.

#### Acceptance Criteria
1. WHEN a visitor submits a URL THEN the app SHALL normalise it (strip
   scheme, `www.`, trailing slash) and validate it contains a dot.
2. WHEN the URL is invalid THEN the app SHALL show a plain-language hint
   and SHALL NOT call any API.
3. WHEN the URL is valid THEN the app SHALL knock on the live host and
   query the Wayback availability API in parallel.

### Requirement 2 — Liveness verdict
**User Story:** As a visitor, I want an honest alive/dead verdict, so I
know whether the site is truly gone or just archived.

#### Acceptance Criteria
1. WHEN the host answers at the network level THEN the verdict SHALL be
   "alive".
2. WHEN the host does not answer AND the Archive holds a snapshot THEN
   the verdict SHALL be "dead".
3. WHEN neither answers THEN the verdict SHALL be "unknown" with an
   explanation, not a false claim of death.
4. WHEN the verdict is shown THEN it SHALL include the closest snapshot
   date and link when one exists.

### Requirement 3 — Snapshot timeline
**User Story:** As a visitor, I want to walk a dead site's life year by
year, so I can see how it changed before it died.

#### Acceptance Criteria
1. WHEN a snapshot exists THEN the app SHALL fetch one capture per year
   from the CDX API (status 200 only).
2. WHEN years are returned THEN the app SHALL render one button per year.
3. WHEN a year button is clicked THEN the app SHALL load that year's
   snapshot in the viewer and mark the button active.

### Requirement 4 — Apparition viewer
**User Story:** As a visitor, I want to see the archived page itself, so
the resurrection feels real.

#### Acceptance Criteria
1. WHEN a snapshot is chosen THEN the app SHALL display it in an iframe
   pointed at web.archive.org.
2. WHEN the viewer loads THEN the app SHALL show the site and snapshot
   date and a link to open the full snapshot in a new tab.
3. WHEN the iframe cannot render a snapshot THEN the "open full séance"
   link SHALL still let the visitor reach it.

### Requirement 5 — Obituary generator
**User Story:** As a visitor, I want a shareable obituary for a dead site,
so I can mourn it (or laugh) with friends.

#### Acceptance Criteria
1. WHEN a dead site is summoned THEN the app SHALL generate an obituary
   with first-seen year, last-seen year and a cause of death.
2. WHEN the site is in the Graveyard THEN the obituary SHALL use its
   curated cause of death.
3. WHEN the visitor clicks "Copy obituary" THEN the text SHALL be copied
   to the clipboard and confirmed.

### Requirement 6 — Graveyard gallery
**User Story:** As a visitor, I want one-click access to famous dead
sites, so I can explore without knowing a URL.

#### Acceptance Criteria
1. WHEN the page loads THEN the app SHALL render at least twelve famous
   dead sites with name, lifespan and cause of death.
2. WHEN a headstone is clicked THEN the app SHALL summon that site.

### Requirement 7 — Séance log (local only)
**User Story:** As a visitor, I want a record of sites I summoned, kept
only on my device.

#### Acceptance Criteria
1. WHEN a summon completes THEN the app SHALL store the URL, verdict and
   time in localStorage (max 30 entries).
2. WHEN the log is rendered THEN each entry SHALL be clickable to
   re-summon it.
3. WHEN the visitor clicks "Clear the log" THEN the stored entries SHALL
   be removed.

### Requirement 8 — Zero-backend, zero-cost operation
**User Story:** As the developer, I want the app to run as static files
with no keys or servers, so it costs nothing and cannot leak credentials.

#### Acceptance Criteria
1. WHEN the app runs THEN it SHALL make requests only to archive.org and
   web.archive.org.
2. WHEN the app is opened THEN it SHALL work from any static host or a
   local file server with no build step and no environment variables.

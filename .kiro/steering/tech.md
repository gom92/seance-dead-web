# Steering — Tech

## Stack
- Static HTML + CSS + vanilla JavaScript. No framework, no bundler, no
  npm dependencies, no build step. The app must run from `python3 -m
  http.server` or any static host (GitHub Pages).
- Target: modern evergreen browsers. No transpilation.

## API rules
- Only two origins are ever contacted: `archive.org` (availability API)
  and `web.archive.org` (CDX API + snapshot viewer).
- No API keys. No credentials. No `localStorage` data ever leaves the
  browser (the séance log is local-only).
- Every network call has a failure path that shows a human-readable
  message. Silent failures are bugs.

## Code rules
- `'use strict'` at the top of `app.js`.
- Functions are small and single-purpose; sections are separated by
  comment banners.
- All user-visible strings are plain language; error messages say what
  happened and what to try next.
- Escape all interpolated data with `esc()` before inserting into HTML.
- The iframe viewer is sandboxed: `allow-scripts allow-same-origin
  allow-popups` only.

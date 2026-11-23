# Submission checklist — Kiroween 2026 (Séance)

Event: **Kiroween 2026** — https://kiroween.devpost.com/
Category: **Resurrection** (bring dead tech back to life)
Prize pool: **$100,000+** — 1st $30,000 · 2nd $20,000 · 3rd $10,000 ·
Best Resurrection $5,000 · Best Demo $1,000 · bonus prizes
Deadline: **Friday, December 4, 2026, 2:00 PM Pacific Time**
Winners announced: on or around February 3, 2027.

## Eligibility — verified from the official rules (read 2026-11-24)
- Solo entry allowed (teams max 3). Age of majority where resident: 18 in
  China ✓.
- Excluded residencies: Quebec, Argentina, Brazil, Italy, Philippines,
  Russia, Cuba, Iran, North Korea, Syria, Belarus, Crimea, DNR, LNR, UAE,
  OFAC-sanctioned countries. **China is NOT excluded.**
- Note: eligibility is by residence, not citizenship. He is a Chinese
  citizen currently in the US on a tourist visa — neither China nor the US
  is excluded, so he is eligible either way.
- Prize payment: Devpost/AWS pay cash prizes to winners; a non-US winner
  typically completes a W-8BEN tax form (no SSN required) and is paid by
  wire/PayPal. Flag for him at claim time — do NOT assume a US bank account.

## What is DONE (in this directory)
- [x] Working app: `index.html`, `styles.css`, `app.js` — runs as static files
- [x] Spec-driven evidence: `.kiro/` at repo root (specs, steering, hooks,
      custom agent) — required by the rules, NOT gitignored
- [x] MIT LICENSE at root (repo must be public + open source)
- [x] README with run + deploy instructions
- [x] API smoke test (`test-api.sh`) + `node --check` pass
- [x] Demo video script (`demo-script.md`)

## What still NEEDS HIM (~15 min total, all free)
1. **GitHub (2 min):** create a public repo (e.g. `seance-dead-web`) and push
   this directory. The submission requires a public GitHub URL (not GitLab/
   Bitbucket) with the `.kiro` directory at root.
2. **Deploy (2 min):** enable GitHub Pages on that repo → public app URL
   for the submission form.
3. **Devpost (3 min):** free Devpost account → "Join Hackathon" on
   kiroween.devpost.com → "Enter a Submission" (draft can be saved early).
4. **Demo video (5–8 min):** record the screen following `demo-script.md`
   (<3 min), upload to YouTube as Public, paste the link in the form.
5. **Kiro write-up (2 min, in the form):** describe how Kiro was used —
   spec-driven development via `.kiro/specs`, steering docs, hooks, and the
   Necromancer custom agent. See `.kiro/` files for the true details; do
   not invent IDE usage that did not happen.
6. **Optional, strengthens the entry:** open the pushed repo in Kiro IDE
   (free, AWS Builder ID login) and let Kiro run one spec task — this makes
   the "built with Kiro" story fully hands-on. Also optional: a public blog
   post about the build (Bonus Blog Prize — 100 winners get Kiro credits)
   and a `#KiroweenHackathon26` social post (Social Blitz Prize).
7. **Submit before Fri Dec 4, 2026, 2:00 PM PT.** No extensions.

## Honesty note
The app was built by an AI agent following Kiro's spec-driven workflow
(specs → design → tasks → steering → hooks), and the repo carries a genuine
`.kiro` directory. The Kiro IDE/CLI itself was not run in this session
because it needs a free AWS Builder ID login, which only he can do. The
submission write-up must describe exactly that — the workflow, not a
fictional IDE session.

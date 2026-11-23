# Steering — Structure

```
seance/
├── index.html            # page structure (summon, verdict, timeline, viewer,
│                         # obituary, graveyard, log, about)
├── styles.css            # all visuals; palette in :root custom properties
├── app.js                # all behaviour (see section banners inside)
├── test-api.sh           # curl smoke test for the two Archive endpoints
├── README.md             # run, deploy, and hackathon notes
├── SUBMISSION.md         # submission checklist + steps needing the entrant
├── demo-script.md        # <3 min demo video script
├── LICENSE               # MIT
└── .kiro/
    ├── specs/seance-revival/
    │   ├── requirements.md   # EARS-format requirements
    │   ├── design.md         # architecture + correctness properties
    │   └── tasks.md          # implementation checklist
    ├── steering/
    │   ├── product.md        # what the product is and is not
    │   ├── tech.md           # stack + API + code rules
    │   └── structure.md      # this file
    ├── hooks/
    │   └── on-save.json      # agent hook: validate on save
    └── agents/
        └── necromancer.json  # custom "Necromancer" agent definition
```

## Conventions
- Keep the app dependency-free: a new file must justify itself.
- Specs live in `.kiro/specs/seance-revival/` and are updated when
  behaviour changes. Never edit `tasks.md` to mark a step done unless
  the work is verified (test, curl, or served page).
- The `.kiro` directory MUST stay in the repo root and MUST NOT be
  gitignored — the hackathon requires it as evidence of Kiro usage.

# Phase 9.7.2 — Workspace KPI visual refactor

**Goal:** Make the four Workspace KPI cards easier to scan with controlled accent colours. KPI values and queries are unchanged.

---

## Behaviour

| KPI | Accent | Meaning |
|-----|--------|---------|
| Visitantes | Blue (`--blue`) | Reach / activity |
| Livros | Indigo (`--kpi-indigo`, matches book purple) | Inventory |
| Favoritos | Coral (`--orange`) | Engagement |
| Mensagens | Green (`--green`) | Communication |

Each card: white base, subtle top tint, 3px top border, rounded icon container, navy number, muted label.

Motion: staggered entrance (60ms), hover lift and icon scale; reduced motion respected.

Dark mode: **N/A** (app has no dark theme).

---

## Verification

- [x] Accent colours match the spec
- [x] `loadWorkspace()` values unchanged
- [x] Responsive 2×2 on tablet/mobile breakpoints
- [x] `npm run lint`, `npm run typecheck`, `npm run build`

**Next:** _(awaiting approval)_

# Phase 9.7.1 — Dedicated seller workspace

**Goal:** Move seller operations out of `/profile` into an authenticated `/workspace` dashboard.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/workspace` | Signed-in sellers only. Greeting, publish CTA, KPI row, publication counts, recent listings, activity, notification and message summaries |
| Navigation | Desktop and mobile **Meu espaço / Mon espace / My Workspace** |
| `/profile` | Account, reputation stats, reviews, logout, admin. Link to workspace and saved books |
| `/profile/listings` | Unchanged detailed management page |
| Favourites received | `seller_workspace_signals()` returns counts only (no favouriter identity) |
| Listing value | Sum of `price_kz` for published `active` books, labelled as listing value |
| WhatsApp | Public listings only, canonical book URL |
| Visitors | Count of existing `book_views` for the seller’s books |

Five inspection slots, AI condition analysis, and listing video are not in the schema. Cards show the current photo count only.

---

## Verification

- [ ] Anonymous `/workspace` redirects to `/auth`
- [ ] KPIs match the signed-in seller only
- [ ] Profile no longer duplicates the operational link grid
- [ ] `npm run lint`, `npm run typecheck`, `npm run build`

**Next:** [PHASE_9_8_BETA_DEPLOYMENT.md](./PHASE_9_8_BETA_DEPLOYMENT.md)

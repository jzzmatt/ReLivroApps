# Phase 58 — Offline mode

**Goal:** When the network drops, a navigation shows a short offline page instead of the browser error. Private pages are not cached.

---

## Behavior

| Surface | Change |
|---------|--------|
| Service worker | Registered on every page. Push handling stays in the same worker |
| Navigations | The network is tried first. A failure shows `/offline.html` |
| Cache | Only the offline page and the icon. API and account pages are not stored |
| Copy | Portuguese, French, and English on the fallback page |

---

## Verification

- [x] `/sw.js` and `/offline.html` are served
- [x] With the worker active and the network off, a navigation shows the offline page
- [x] `npm run typecheck` and `npm run build` pass

**Next:** [Phase 59 — Installable app](PHASE_59_INSTALLABLE_APP.md)

# Phase 53 — Nearby listings by city

**Goal:** Let a signed-in reader limit the marketplace to published books in the city saved on their profile.

Browser location stays disabled. There is no map, no distance, and no new database column.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/books` | **Books in {city}** when the profile has a city |
| Match | Case-insensitive exact match on `books.city` |
| Pagination | Load more uses the same city filter |
| No city | Link to `/profile/edit` |
| Signed out | Link to `/auth` |
| Empty city | Message that no published books are in that city |
| Show all | Restores the full recent catalog |

Payments, native push, and verified school stay out of this phase.

---

## Verification

- [ ] Signed out, `/books` links to sign-in for city listings
- [ ] With a profile city, the filter returns only books in that city
- [ ] **Show all** restores the unfiltered list
- [ ] `npm run typecheck` and `npm run build` pass

**Next:** _(awaiting approval — payments, native push, and verified school)_

# Phase 56 — Browser push alerts

**Goal:** Let a signed-in member turn on browser alerts for new messages. In-app notifications stay as they are.

This is Web Push in the browser. It is not a native iOS or Android app.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/notifications` | **Turn on alerts** registers `/sw.js` and stores the browser subscription |
| Storage | `push_subscriptions`, readable and deletable only by the owner |
| Same browser, new account | `save_push_subscription` moves the endpoint to the signed-in user |
| After a message | The sender’s browser calls `POST /api/push/fanout`. The server notifies the other person |
| Payload | Title and a link to the thread. The message text is not included |
| Missing keys | The button says alerts are not configured. Messages still appear in the app |
| Expired endpoint | A 404 or 410 from the push service deletes that subscription |

---

## Server environment

Set these on the server only. Never prefix the private key or the service role with `NEXT_PUBLIC_`.

| Variable | Role |
|----------|------|
| `VAPID_PUBLIC_KEY` | Browser subscription |
| `VAPID_PRIVATE_KEY` | Signs each push |
| `VAPID_SUBJECT` | `mailto:` contact for the push service |
| `SUPABASE_SERVICE_ROLE_KEY` | Reads the recipient’s subscriptions to deliver the push |

Generate a key pair with `npx web-push generate-vapid-keys`.

---

## Database

`0014_push_subscriptions.sql` adds the table, owner policies, and `save_push_subscription`. Apply it on production if that database is not staging.

---

## Verification

- [x] Without VAPID keys, `/api/push/config` returns 503 and the button says alerts are not configured
- [x] With keys, a signed-in member can store a subscription and turn it off
- [x] A person who is not in the conversation cannot fan out a push
- [x] `npm run typecheck` and `npm run build` pass

**Next:** [Phase 57 — Deeper analytics](PHASE_57_DEEPER_ANALYTICS.md)

# Architecture rules
- Keep room rates and tourist-tax calculation in the shared booking pricing module so the server, summaries and PDF use the same calculation.
- Store the tourist-tax rate and amount on each new booking so future rate changes do not alter historical reservations.
- Trigger reservation email only after successful booking creation, using a server-only Resend helper and an event-derived idempotency key; email failure must not roll back or duplicate a booking.
- Use the shared availability policy for both room-selection gates and the server booking path; tracked mode uses the atomic inventory-check RPC, while temporary untracked mode saves validated reservations without changing stock totals.
- Generate reservation email PDF attachments in memory with an embedded Unicode font so guest names remain readable without server filesystem access.
- Share reservation fields between email and PDF, with document colors sourced from global CSS tokens, so confirmation details and branding stay consistent.
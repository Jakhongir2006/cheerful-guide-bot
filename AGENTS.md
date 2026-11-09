# Architecture rules
- Keep room rates and tourist-tax calculation in the shared booking pricing module so the server, summaries and PDF use the same calculation.
- Store the tourist-tax rate and amount on each new booking so future rate changes do not alter historical reservations.
- Trigger reservation email only after inventory-checked booking creation, using a server-only Resend helper and an event-derived idempotency key; email failure must not roll back or duplicate a booking.
- Generate reservation email PDF attachments in memory with an embedded Unicode font so guest names remain readable without server filesystem access.
- Share reservation fields between email and PDF, with document colors sourced from global CSS tokens, so confirmation details and branding stay consistent.
# Architecture rules
- Keep room rates and tourist-tax calculation in the shared booking pricing module so the server, summaries and PDF use the same calculation.
- Store the tourist-tax rate and amount on each new booking so future rate changes do not alter historical reservations.
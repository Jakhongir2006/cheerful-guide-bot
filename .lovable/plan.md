
# Implementation Plan

Keep all existing design, colors, fonts, images, and navigation untouched. Only additive changes.

## Task 1 — Language Switcher (RU/EN/UZ/KO)

- Create `src/lib/i18n.tsx`: lightweight context + `useT()` hook. Persists choice in `localStorage` (`afr_lang`), default `RU`.
- Wrap `<Outlet />` in `src/routes/__root.tsx` with `<I18nProvider>`.
- Add `<LanguageSwitcher />` component (flag buttons) injected into the existing header in `src/routes/index.tsx` — no layout/style changes besides adding the switcher block on the right side of the nav.
- Translate the strings the user listed plus all UI labels in booking flow + admin.

## Task 2 — Multi-step Booking

Replace existing `BookingDialog` with a 5-step flow. Keep the existing trigger buttons and hero booking bar visual design — only swap what opens.

- New `src/components/booking/BookingFlow.tsx` (Dialog) with progress bar: Даты → Номер → Апгрейд → Детали → Готово.
- Pricing engine `src/lib/booking/pricing.ts`:
  - Room price table (Single/Double for Standard King/Twin, Superior King/Twin, Deluxe, Suite).
  - `guests === 1 ? single : double`; total = pricePerNight × nights.
  - Tourist tax shown as info only (not added to total).
- Step 1: dates + guests (reuse existing form aesthetic).
- Step 2: grid of room cards with computed price, green badge "Включено: завтрак + СПА + бассейн".
- Step 3: upgrade suggestion (Standard→Superior/Deluxe; Superior→Deluxe/Suite; Deluxe/Suite skip). Badge "Осталось 2 номера!".
- Step 4: guest details form + sticky summary (right on desktop, bottom bar on mobile). Validation with zod.
- Step 5: confirmation with generated `AFR-2026XXXXXX` number, summary, PDF download (client-side via `jspdf`), and outlined action buttons (Изменить даты reopens flow at Step 1; Отмена calls cancel server fn).

All labels via `useT()` for the 4 languages.

## Task 3 — Supabase + Admin

- Enable Lovable Cloud.
- Migration: `bookings` table with all listed fields, status enum-as-text default `new`, plus grants and RLS:
  - INSERT allowed for `anon` and `authenticated` (public booking form).
  - SELECT/UPDATE only for admins via `has_role(auth.uid(),'admin')`.
- `user_roles` table + `app_role` enum + `has_role()` security-definer (per platform rules).
- Server functions in `src/lib/bookings.functions.ts`:
  - `createBooking` (public) — inserts row, returns booking number.
  - `listBookings`, `updateBookingStatus`, `getBookingStats` (admin-gated via `requireSupabaseAuth` + has_role check, using `supabaseAdmin` loaded inside handler).
- Admin route `src/routes/admin.tsx` (public route that renders a password gate using Supabase email/password auth — simple login form). Once signed in as admin user:
  - Dashboard cards: today's arrivals, today's departures, current occupancy (count of `checked_in`), bookings this month.
  - Bookings table with filters (date range, status, room type), search by name/number.
  - Row click → details drawer with status transition buttons.
  - Export to Excel via `xlsx` (SheetJS) client-side.
- Bootstrap admin: on first run, an admin must be promoted via SQL (documented). Alternative: simple shared password gate stored as env secret `ADMIN_PASSWORD` — user asked for "simple password login", so we'll implement password-only gate (stored as Supabase secret, verified in server fn) instead of full auth to keep it simple. Session stored in `sessionStorage` after server verifies.

## Task 4 — Bug fixes

- Audit `src/routes/index.tsx` for broken links/console errors; ensure all `Book` buttons open the new flow.
- Verify Yandex maps iframe, tel: links, and image paths still load.

## Technical notes

- New deps: `jspdf`, `xlsx`.
- No edits to existing colors/fonts/images.
- All new components use existing shadcn ui primitives + design tokens.
- Tourist tax displayed as informational note per spec (not added to total).

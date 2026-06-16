
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- Replace permissive INSERT policy with a sanity-checked one
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (
    nights > 0
    AND nights <= 60
    AND guests_count > 0
    AND guests_count <= 10
    AND check_out_date > check_in_date
    AND length(guest_name) BETWEEN 1 AND 100
    AND length(guest_lastname) BETWEEN 1 AND 100
    AND length(guest_phone) BETWEEN 4 AND 30
    AND length(guest_email) BETWEEN 3 AND 255
    AND status = 'new'
  );

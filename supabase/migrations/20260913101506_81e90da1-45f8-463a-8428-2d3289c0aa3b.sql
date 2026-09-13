CREATE TABLE public.room_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_key text NOT NULL UNIQUE,
  room_name text NOT NULL UNIQUE,
  total_rooms integer NOT NULL DEFAULT 1 CHECK (total_rooms >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.room_inventory TO anon;
GRANT SELECT ON public.room_inventory TO authenticated;
GRANT ALL ON public.room_inventory TO service_role;

ALTER TABLE public.room_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read room inventory"
  ON public.room_inventory FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can update room inventory"
  ON public.room_inventory FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_room_inventory_updated_at
  BEFORE UPDATE ON public.room_inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.room_inventory (room_key, room_name, total_rooms) VALUES
  ('standard-king', 'Standard King', 10),
  ('standard-twin', 'Standard Twin', 10),
  ('superior-king', 'Superior King', 8),
  ('superior-twin', 'Superior Twin', 8),
  ('deluxe', 'Deluxe', 5),
  ('suite', 'Suite', 3);

CREATE INDEX IF NOT EXISTS bookings_room_dates_idx
  ON public.bookings (room_type, check_in_date, check_out_date);

CREATE OR REPLACE FUNCTION public.room_availability(_check_in date, _check_out date)
RETURNS TABLE (room_key text, room_name text, total_rooms integer, available_rooms integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    i.room_key,
    i.room_name,
    i.total_rooms,
    GREATEST(
      0,
      i.total_rooms - (
        SELECT count(*)::int FROM public.bookings b
        WHERE b.room_type = i.room_name
          AND b.status <> 'cancelled'
          AND b.check_in_date < _check_out
          AND b.check_out_date > _check_in
      )
    )::int AS available_rooms
  FROM public.room_inventory i
  ORDER BY i.room_key
$$;

GRANT EXECUTE ON FUNCTION public.room_availability(date, date) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.create_booking_checked(_booking jsonb)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room_name text := _booking->>'room_type';
  v_check_in date := (_booking->>'check_in_date')::date;
  v_check_out date := (_booking->>'check_out_date')::date;
  v_total integer;
  v_taken integer;
  v_row public.bookings;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(v_room_name));

  SELECT total_rooms INTO v_total FROM public.room_inventory WHERE room_name = v_room_name;
  IF v_total IS NULL THEN
    RAISE EXCEPTION 'UNKNOWN_ROOM';
  END IF;

  SELECT count(*)::int INTO v_taken FROM public.bookings b
  WHERE b.room_type = v_room_name
    AND b.status <> 'cancelled'
    AND b.check_in_date < v_check_out
    AND b.check_out_date > v_check_in;

  IF v_taken >= v_total THEN
    RAISE EXCEPTION 'NO_AVAILABILITY';
  END IF;

  INSERT INTO public.bookings (
    booking_number, check_in_date, check_out_date, nights, room_type, guests_count,
    guest_name, guest_lastname, guest_patronymic, guest_phone, guest_email,
    guest_citizenship, price_per_night, total_price, notes, status
  ) VALUES (
    _booking->>'booking_number',
    v_check_in,
    v_check_out,
    (_booking->>'nights')::int,
    v_room_name,
    (_booking->>'guests_count')::int,
    _booking->>'guest_name',
    _booking->>'guest_lastname',
    _booking->>'guest_patronymic',
    _booking->>'guest_phone',
    _booking->>'guest_email',
    _booking->>'guest_citizenship',
    (_booking->>'price_per_night')::bigint,
    (_booking->>'total_price')::bigint,
    _booking->>'notes',
    'new'
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking_checked(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.create_booking_checked(jsonb) TO service_role;
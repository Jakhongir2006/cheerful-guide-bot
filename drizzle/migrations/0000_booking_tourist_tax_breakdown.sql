ALTER TABLE public.bookings ADD COLUMN tourist_tax_rate bigint NOT NULL DEFAULT 0 CHECK (tourist_tax_rate >= 0), ADD COLUMN tourist_tax_total bigint NOT NULL DEFAULT 0 CHECK (tourist_tax_total >= 0);
CREATE OR REPLACE FUNCTION public.create_booking_checked(_booking jsonb) RETURNS public.bookings LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
 IF v_total IS NULL THEN RAISE EXCEPTION 'UNKNOWN_ROOM'; END IF;
 SELECT count(*)::int INTO v_taken FROM public.bookings b WHERE b.room_type = v_room_name AND b.status <> 'cancelled' AND b.check_in_date < v_check_out AND b.check_out_date > v_check_in;
 IF v_taken >= v_total THEN RAISE EXCEPTION 'NO_AVAILABILITY'; END IF;
 INSERT INTO public.bookings (booking_number, check_in_date, check_out_date, nights, room_type, guests_count, guest_name, guest_lastname, guest_patronymic, guest_phone, guest_email, guest_citizenship, price_per_night, total_price, notes, status, tourist_tax_rate, tourist_tax_total)
 VALUES (_booking->>'booking_number', v_check_in, v_check_out, (_booking->>'nights')::int, v_room_name, (_booking->>'guests_count')::int, _booking->>'guest_name', _booking->>'guest_lastname', _booking->>'guest_patronymic', _booking->>'guest_phone', _booking->>'guest_email', _booking->>'guest_citizenship', (_booking->>'price_per_night')::bigint, (_booking->>'total_price')::bigint, _booking->>'notes', 'new', COALESCE((_booking->>'tourist_tax_rate')::bigint, 0), COALESCE((_booking->>'tourist_tax_total')::bigint, 0)) RETURNING * INTO v_row;
 RETURN v_row;
END; $$;
REVOKE ALL ON FUNCTION public.create_booking_checked(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.create_booking_checked(jsonb) TO service_role;
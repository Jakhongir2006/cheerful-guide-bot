import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ROOMS, priceFor, nightsBetween } from "@/lib/booking/pricing";

const createSchema = z.object({
  booking_number: z.string().min(5).max(40),
  check_in_date: z.string().min(8).max(20),
  check_out_date: z.string().min(8).max(20),
  nights: z.number().int().positive().max(60),
  room_type: z.string().min(1).max(80),
  guests_count: z.number().int().positive().max(10),
  guest_name: z.string().min(1).max(100),
  guest_lastname: z.string().min(1).max(100),
  guest_patronymic: z.string().max(100).optional().nullable(),
  guest_phone: z.string().min(4).max(30),
  guest_email: z.string().email().max(255),
  guest_citizenship: z.string().max(80).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof createSchema>) => createSchema.parse(data))
  .handler(async ({ data }) => {
    // Server-side price computation — never trust client-supplied amounts.
    const room = ROOMS.find((r) => r.name === data.room_type);
    if (!room) throw new Error("Invalid room selection.");
    const computedNights = nightsBetween(data.check_in_date, data.check_out_date);
    if (computedNights <= 0 || computedNights !== data.nights) {
      throw new Error("Invalid booking dates.");
    }
    const price_per_night = priceFor(room, data.guests_count);
    const total_price = price_per_night * computedNights;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings" as never)
      .insert({ ...data, price_per_night, total_price, status: "new" } as never)
      .select()
      .single();
    if (error) {
      console.error("[createBooking] DB error:", error);
      throw new Error("Failed to create booking. Please try again.");
    }
    return row as { id: string; booking_number: string };
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("[assertAdmin] DB error:", error);
    throw new Error("Authorization check failed.");
  }
  if (!data) throw new Error("Forbidden");
}

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("bookings" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      console.error("[listBookings] DB error:", error);
      throw new Error("Failed to load bookings. Please try again.");
    }
    return data as any[];
  });

const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "confirmed", "checked_in", "checked_out", "cancelled"]),
});

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof statusSchema>) => statusSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("bookings" as never)
      .update({ status: data.status } as never)
      .eq("id", data.id);
    if (error) {
      console.error("[updateBookingStatus] DB error:", error);
      throw new Error("Failed to update booking. Please try again.");
    }
    return { ok: true };
  });

export const cancelBookingByNumber = createServerFn({ method: "POST" })
  .inputValidator((d: { booking_number: string; email: string }) =>
    z
      .object({ booking_number: z.string().min(5).max(40), email: z.string().email() })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings" as never)
      .update({ status: "cancelled" } as never)
      .eq("booking_number", data.booking_number)
      .eq("guest_email", data.email)
      .select()
      .maybeSingle();
    if (error) {
      console.error("[cancelBookingByNumber] DB error:", error);
      throw new Error("Failed to cancel booking. Please try again.");
    }
    if (!row) throw new Error("Booking not found");
    return { ok: true };
  });
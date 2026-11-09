import { createReservationPdf, type ReservationRecord } from "./reservation-pdf";

export const RESERVATION_FROM = "Afrosiyob Regency Hotel <booking@afrosiyobregency.com>";
export const RESERVATION_COPY = "jaxongir.sh2006@gmail.com";

export async function sendReservationEmail(reservation: ReservationRecord) {
  const gatewayKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["RESEND_API_KEY"];
  if (!gatewayKey || !connectionKey) throw new Error("Resend credentials are not configured");
  const pdf = await createReservationPdf(reservation);
  const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${gatewayKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
      "Idempotency-Key": `reservation-${reservation.booking_number}`,
    },
    body: JSON.stringify({
      from: RESERVATION_FROM,
      to: [reservation.guest_email],
      bcc: [RESERVATION_COPY],
      subject: `Afrosiyob Regency — Reservation ${reservation.booking_number}`,
      text: [
        "We have received your reservation.",
        `Guest: ${reservation.guest_lastname} ${reservation.guest_name}`,
        `Room: ${reservation.room_type}`,
        `Check-in: ${reservation.check_in_date}`,
        `Check-out: ${reservation.check_out_date}`,
        `Booking number: ${reservation.booking_number}`,
        "Your reservation PDF is attached.",
        "Payment is made at the hotel reception. This is not a payment receipt.",
      ].join("\n"),
      attachments: [{
        filename: `${reservation.booking_number.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`,
        content: Buffer.from(pdf).toString("base64"),
      }],
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error(`Resend send failed [${response.status}]: ${body}`);
    throw new Error(`Resend send failed [${response.status}]: ${body}`);
  }
  const result = await response.json() as { id?: string };
  if (!result.id) throw new Error("Resend did not acknowledge the email");
  return { id: result.id };
}
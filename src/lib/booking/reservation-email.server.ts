import { createReservationPdf, type ReservationRecord } from "./reservation-pdf";
import { CONFIRMATION_SUBJECT, reservationEmailContent } from "./reservation-details";

export const RESERVATION_FROM = "Afrosiyob Regency Hotel <booking@afrosiyobregency.com>";
export const RESERVATION_COPY = "jaxongir.sh2006@gmail.com";

export async function sendReservationEmail(reservation: ReservationRecord) {
  const gatewayKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["RESEND_API_KEY"];
  if (!gatewayKey || !connectionKey) throw new Error("Resend credentials are not configured");
  const pdf = await createReservationPdf(reservation);
  const content = reservationEmailContent(reservation);
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
      subject: CONFIRMATION_SUBJECT,
      text: content.text,
      html: content.html,
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
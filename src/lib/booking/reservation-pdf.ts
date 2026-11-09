import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { reservationFontBase64 } from "./reservation-font";

export interface ReservationRecord {
  booking_number: string;
  guest_name: string;
  guest_lastname: string;
  guest_patronymic?: string | null;
  guest_email: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
}

export async function createReservationPdf(reservation: ReservationRecord): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(Uint8Array.from(atob(reservationFontBase64), c => c.charCodeAt(0)), { subset: true });
  const page = pdf.addPage([595, 842]);
  const ink = rgb(0.08, 0.2, 0.29);
  let y = 780;
  const write = (text: string, size = 12) => {
    const clean = text.replace(/[\r\n\t]/g, " ");
    // Shrink unusually long names to keep each field inside the page.
    const width = font.widthOfTextAtSize(clean, size);
    const fitted = width > 499 ? size * 499 / width : size;
    page.drawText(clean, { x: 48, y, size: fitted, font, color: ink });
    y -= size + 20;
  };
  write("Afrosiyob Regency Hotel", 22);
  write("We have received your reservation.", 15);
  y -= 16;
  write(`Booking number: ${reservation.booking_number}`);
  write(`Guest: ${[reservation.guest_lastname, reservation.guest_name, reservation.guest_patronymic].filter(Boolean).join(" ")}`);
  write(`Room: ${reservation.room_type}`);
  write(`Check-in: ${reservation.check_in_date} (14:00)`);
  write(`Check-out: ${reservation.check_out_date} (12:00)`);
  y -= 24;
  write("Payment is made at the hotel reception.");
  write("This document confirms a reservation, not a payment.");
  pdf.setTitle(`Reservation ${reservation.booking_number} — Afrosiyob Regency`);
  return pdf.save();
}
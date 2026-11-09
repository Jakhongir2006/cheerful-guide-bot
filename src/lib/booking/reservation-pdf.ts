import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { reservationFontBase64 } from "./reservation-font";
import { reservationColors, reservationFields, type ReservationRecord } from "./reservation-details";
export type { ReservationRecord } from "./reservation-details";

export async function createReservationPdf(reservation: ReservationRecord): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(Uint8Array.from(atob(reservationFontBase64), c => c.charCodeAt(0)), { subset: true });
  const page = pdf.addPage([595, 842]);
  const pdfColor = (hex: string) => rgb(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);
  const c = reservationColors;
  const ink = pdfColor(c.ink);
  page.drawRectangle({ x: 0, y: 690, width: 595, height: 152, color: pdfColor(c.pale) });
  page.drawRectangle({ x: 0, y: 836, width: 595, height: 6, color: pdfColor(c.blue) });
  page.drawText("Afrosiyob Regency Hotel", { x: 48, y: 781, size: 24, font, color: pdfColor(c.blue) });
  page.drawText("We have received your reservation.", { x: 48, y: 738, size: 14, font, color: ink });
  let y = 652;
  const wrap = (text: string, width: number, size: number) => {
    const lines: string[] = [];
    let line = "";
    for (const character of text.replace(/[\r\n\t]/g, " ")) {
      if (font.widthOfTextAtSize(line + character, size) > width && line) { lines.push(line.trim()); line = ""; }
      line += character;
    }
    if (line) lines.push(line.trim());
    return lines;
  };
  for (const [label, value] of reservationFields(reservation)) {
    page.drawText(label, { x: 48, y, size: 10, font, color: pdfColor(c.blue) });
    const lines = wrap(value, 355, 11);
    for (const [index, line] of lines.entries()) page.drawText(line, { x: 192, y: y - index * 16, size: 11, font, color: ink });
    y -= Math.max(1, lines.length) * 16 + 21;
    page.drawLine({ start: { x: 48, y: y + 12 }, end: { x: 547, y: y + 12 }, color: pdfColor(c.border), thickness: 0.5 });
  }
  page.drawRectangle({ x: 48, y: 110, width: 499, height: 76, color: pdfColor(c.pale) });
  page.drawText("Payment is made at the hotel reception.", { x: 64, y: 159, size: 10, font, color: ink });
  page.drawText("This document confirms a reservation, not a payment.", { x: 64, y: 136, size: 10, font, color: ink });
  pdf.setTitle(`Reservation ${reservation.booking_number} — Afrosiyob Regency`);
  return pdf.save();
}
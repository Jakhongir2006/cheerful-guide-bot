import siteCss from "@/styles.css?raw";

export const HOTEL_ADDRESS = "Yakkasaroy district, Damariq MFY, Abdulla Kakhar Street, 9th passage, house 20, Tashkent, Uzbekistan";
export const HOTEL_PHONE = "+998 55 519 00 05";
export const CONFIRMATION_SUBJECT = "Booking confirmation – Afrosiyob Regency";
const color = (role: string) => {
  const match = siteCss.match(new RegExp(`--reservation-${role}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Missing reservation color: ${role}`);
  return match[1];
};
export const reservationColors = {
  paper: color("paper"), blue: color("blue"), pale: color("pale"), ink: color("ink"), border: color("border"),
};

export interface ReservationRecord {
  booking_number: string;
  guest_name: string;
  guest_lastname: string;
  guest_patronymic?: string | null;
  guest_email: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  guests_count: number;
}

export function reservationFields(r: ReservationRecord): [string, string][] {
  return [
    ["Guest name", [r.guest_name, r.guest_lastname, r.guest_patronymic].filter(Boolean).join(" ")],
    ["Booking number", r.booking_number],
    ["Room", r.room_type],
    ["Check-in", `${r.check_in_date} at 14:00`],
    ["Check-out", `${r.check_out_date} at 12:00`],
    ["Nights", String(r.nights)],
    ["Guests", String(r.guests_count)],
    ["Hotel address", HOTEL_ADDRESS],
    ["Hotel phone", HOTEL_PHONE],
  ];
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

export function reservationEmailContent(r: ReservationRecord) {
  const c = reservationColors;
  const fields = reservationFields(r);
  const text = ["Afrosiyob Regency Hotel", "We have received your reservation.", ...fields.map(([label, value]) => `${label}: ${value}`), "Your reservation PDF is attached.", "Payment is made at the hotel reception. This is not a payment receipt."].join("\n");
  const rows = fields.map(([label, value]) => `<tr><td style="padding:14px 0;border-bottom:1px solid ${c.border};font-size:12px;width:120px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:14px 0;border-bottom:1px solid ${c.border};font-size:14px;line-height:1.6;word-break:break-word">${escapeHtml(value)}</td></tr>`).join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:${c.paper};color:${c.ink};font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px"><tr><td style="padding:32px 24px;background:${c.pale};border-top:4px solid ${c.blue}"><h1 style="margin:0;color:${c.blue};font-family:Georgia,serif;font-size:28px;font-weight:normal">Afrosiyob Regency Hotel</h1><p style="margin:18px 0 0;font-size:18px;line-height:1.5">We have received your reservation.</p></td></tr><tr><td style="padding:16px 24px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table></td></tr><tr><td style="padding:24px;background:${c.pale};font-size:13px;line-height:1.8">Your reservation PDF is attached.<br>Payment is made at the hotel reception.<br>This document confirms a reservation, not a payment.</td></tr></table></td></tr></table></body></html>`;
  return { text, html };
}
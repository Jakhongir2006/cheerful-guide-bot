import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Check, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, useT } from "@/lib/i18n";
import {
  ROOMS,
  type RoomDef,
  priceFor,
  nightsBetween,
  formatSum,
  upgradeTargets,
  generateBookingNumber,
} from "@/lib/booking/pricing";
import { useServerFn } from "@tanstack/react-start";
import { createBooking, cancelBookingByNumber } from "@/lib/bookings.functions";
import jsPDF from "jspdf";

// Convert any error (including Zod JSON arrays from server validators)
// into a single human-readable sentence.
function friendlyError(e: unknown, lang: "ru" | "en" | string): string {
  const ru = lang === "ru";
  const fallback = ru ? "Произошла ошибка. Попробуйте ещё раз." : "Something went wrong. Please try again.";
  const raw = (e as any)?.message ?? (typeof e === "string" ? e : "");
  if (!raw) return fallback;

  // Try to parse Zod-style error arrays embedded in the message.
  const jsonStart = raw.indexOf("[");
  if (jsonStart !== -1) {
    try {
      const parsed = JSON.parse(raw.slice(jsonStart));
      if (Array.isArray(parsed) && parsed.length) {
        const first = parsed[0];
        const field = Array.isArray(first?.path) ? String(first.path[0] ?? "") : "";
        if (field === "guest_email" || first?.validation === "email") {
          return ru ? "Пожалуйста, введите корректный email." : "Please enter a valid email address.";
        }
        if (field === "guest_phone") {
          return ru ? "Пожалуйста, укажите корректный номер телефона." : "Please enter a valid phone number.";
        }
        return ru ? "Проверьте правильность заполненных полей." : "Please check the form fields and try again.";
      }
    } catch {
      /* not JSON — fall through */
    }
  }

  // Plain text message — return as is if it looks human-readable, otherwise fallback.
  if (/^[\w\sа-яё.,!?:'"()\-]+$/i.test(raw) && raw.length < 200) return raw;
  return fallback;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = 1 | 2 | 3 | 4 | 5;

const today = () => new Date().toISOString().split("T")[0];
const addDays = (date: string, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

function ProgressBar({ step }: { step: Step }) {
  const t = useT();
  const labels = [t("step_dates"), t("step_room"), t("step_upgrade"), t("step_details"), t("step_done")];
  return (
    <div className="mb-4 flex items-center gap-1 text-xs">
      {labels.map((l, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={l} className="flex flex-1 items-center gap-1">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold",
                done && "bg-primary text-primary-foreground border-primary",
                active && "border-primary text-primary",
                !active && !done && "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3 w-3" /> : n}
            </div>
            <span className={cn("hidden truncate sm:inline", active ? "font-semibold text-primary" : "text-muted-foreground")}>{l}</span>
            {n < 5 && <div className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />}
          </div>
        );
      })}
    </div>
  );
}

export function BookingFlow({
  trigger,
  defaultRoomKey,
  open: controlledOpen,
  onOpenChange,
}: {
  trigger?: ReactNode;
  defaultRoomKey?: string;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (o: boolean) => {
    setInternalOpen(o);
    onOpenChange?.(o);
  };

  const t = useT();
  const { lang } = useI18n();

  const [step, setStep] = useState<Step>(1);
  const [checkin, setCheckin] = useState(today());
  const [checkout, setCheckout] = useState(addDays(today(), 1));
  const [guests, setGuests] = useState(2);
  const [room, setRoom] = useState<RoomDef | null>(
    defaultRoomKey ? ROOMS.find((r) => r.key === defaultRoomKey) || null : null,
  );
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    patronymic: "",
    phone: "+998",
    email: "",
    citizenship: "Uzbekistan",
    offers: false,
    consent: false,
  });
  const [bookingNumber, setBookingNumber] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const create = useServerFn(createBooking);
  const cancelFn = useServerFn(cancelBookingByNumber);

  const nights = nightsBetween(checkin, checkout);
  const pricePerNight = room ? priceFor(room, guests) : 0;
  const total = pricePerNight * nights;

  function reset() {
    setStep(1);
    setRoom(defaultRoomKey ? ROOMS.find((r) => r.key === defaultRoomKey) || null : null);
    setBookingNumber("");
  }

  function nextFromDates() {
    if (nights <= 0) {
      toast.error(lang === "ru" ? "Проверьте даты" : "Check the dates");
      return;
    }
    setStep(2);
  }

  function selectRoom(r: RoomDef) {
    setRoom(r);
    const targets = upgradeTargets(r.tier);
    setStep(targets.length ? 3 : 4);
  }

  async function submitBooking() {
    if (!room) return;
    if (!form.name || !form.lastname || !form.phone || !form.email || !form.consent) {
      toast.error(lang === "ru" ? "Заполните обязательные поля" : "Fill required fields");
      return;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      toast.error(lang === "ru" ? "Пожалуйста, введите корректный email." : "Please enter a valid email address.");
      return;
    }
    const bn = generateBookingNumber();
    setSubmitting(true);
    try {
      await create({
        data: {
          booking_number: bn,
          check_in_date: checkin,
          check_out_date: checkout,
          nights,
          room_type: room.name,
          guests_count: guests,
          guest_name: form.name,
          guest_lastname: form.lastname,
          guest_patronymic: form.patronymic || null,
          guest_phone: form.phone,
          guest_email: form.email.trim(),
          guest_citizenship: form.citizenship || null,
          notes: null,
        },
      });
      setBookingNumber(bn);
      setStep(5);
    } catch (e: any) {
      toast.error(friendlyError(e, lang));
    } finally {
      setSubmitting(false);
    }
  }

  function downloadPdf() {
    if (!room || !bookingNumber) return;
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Afrosiyob Regency Hotel", 20, 20);
    pdf.setFontSize(12);
    const lines = [
      `Booking: ${bookingNumber}`,
      `Guest: ${form.lastname} ${form.name} ${form.patronymic}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Room: ${room.name}`,
      `Check-in: ${checkin}  (14:00)`,
      `Check-out: ${checkout}  (12:00)`,
      `Nights: ${nights}`,
      `Guests: ${guests}`,
      `Price per night: ${formatSum(pricePerNight)}`,
      `Total: ${formatSum(total)}`,
      "",
      "Included: breakfast, SPA, indoor pool, sauna, hammam, gym, WiFi, VAT.",
      "Tourist tax NOT included.",
    ];
    lines.forEach((l, i) => pdf.text(l, 20, 35 + i * 8));
    pdf.save(`${bookingNumber}.pdf`);
  }

  async function cancelBooking() {
    try {
      await cancelFn({ data: { booking_number: bookingNumber, email: form.email } });
      toast.success(lang === "ru" ? "Бронь отменена" : "Booking cancelled");
      setOpen(false);
      reset();
    } catch (e: any) {
      toast.error(friendlyError(e, lang));
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setTimeout(reset, 200);
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <ProgressBar step={step} />

        {step === 1 && (
          <div className="grid gap-4">
            <h2 className="font-serif text-2xl text-primary">{t("step_dates")}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label>{t("checkin")}</Label>
                <Input type="date" min={today()} value={checkin} onChange={(e) => setCheckin(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>{t("checkout")}</Label>
                <Input type="date" min={addDays(checkin, 1)} value={checkout} onChange={(e) => setCheckout(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>{t("guests")}</Label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {nights} {t("nights")}
            </div>
            <div className="flex justify-end">
              <Button onClick={nextFromDates}>{t("continue")}</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-primary">{t("step_room")}</h2>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4" /> {t("back")}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {ROOMS.map((r) => {
                const price = priceFor(r, guests);
                return (
                  <article key={r.key} className="overflow-hidden rounded-xl border border-border bg-card">
                    <img src={r.image} alt={r.name} loading="lazy" className="h-40 w-full object-cover" />
                    <div className="p-4">
                      <h3 className="font-serif text-lg text-primary">{r.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {r.area} · {r.bed}
                      </p>
                      <div className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                        {t("included_badge")}
                      </div>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {nights} × {formatSum(price, lang)}
                          </div>
                          <div className="font-serif text-xl text-primary">{formatSum(price * nights, lang)}</div>
                        </div>
                        <Button size="sm" onClick={() => selectRoom(r)}>
                          {t("select")}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && room && (
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-primary">{t("step_upgrade")}</h2>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                <ChevronLeft className="h-4 w-4" /> {t("back")}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {upgradeTargets(room.tier).flatMap((tier) =>
                ROOMS.filter((r) => r.tier === tier).slice(0, 1).map((r) => {
                  const price = priceFor(r, guests);
                  return (
                    <article key={r.key} className="relative overflow-hidden rounded-xl border border-accent bg-card">
                      <div className="absolute right-2 top-2 z-10 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                        {t("room_left")}
                      </div>
                      <img src={r.image} alt={r.name} loading="lazy" className="h-40 w-full object-cover" />
                      <div className="p-4">
                        <h3 className="font-serif text-lg text-primary">{r.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {r.area} · {r.bed}
                        </p>
                        <div className="mt-3 flex items-end justify-between">
                          <div className="font-serif text-xl text-primary">{formatSum(price * nights, lang)}</div>
                          <Button size="sm" variant="outline" onClick={() => { setRoom(r); setStep(4); }}>
                            {t("upgrade_room")}
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                }),
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(4)}>{t("continue_with_selected")}</Button>
            </div>
          </div>
        )}

        {step === 4 && room && (
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-primary">{t("step_details")}</h2>
              <Button variant="ghost" size="sm" onClick={() => setStep(upgradeTargets(room.tier).length ? 3 : 2)}>
                <ChevronLeft className="h-4 w-4" /> {t("back")}
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-[1fr_320px]">
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label>{t("first_name")} *</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>{t("last_name")} *</Label>
                    <Input value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} maxLength={100} />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("patronymic")}</Label>
                  <Input value={form.patronymic} onChange={(e) => setForm({ ...form, patronymic: e.target.value })} maxLength={100} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label>{t("phone")} * 🇺🇿</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>{t("email")} *</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label>{t("citizenship")}</Label>
                  <select
                    value={form.citizenship}
                    onChange={(e) => setForm({ ...form, citizenship: e.target.value })}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option>Uzbekistan 🇺🇿</option>
                    <option>Russia 🇷🇺</option>
                    <option>Kazakhstan 🇰🇿</option>
                    <option>South Korea 🇰🇷</option>
                    <option>United States 🇺🇸</option>
                    <option>United Kingdom 🇬🇧</option>
                    <option>Other</option>
                  </select>
                </div>
                <label className="flex items-start gap-2 text-sm">
                  <Checkbox checked={form.offers} onCheckedChange={(v) => setForm({ ...form, offers: Boolean(v) })} />
                  <span>{t("consent_offers")}</span>
                </label>
                <label className="flex items-start gap-2 text-sm">
                  <Checkbox checked={form.consent} onCheckedChange={(v) => setForm({ ...form, consent: Boolean(v) })} />
                  <span>{t("consent_data")} *</span>
                </label>
              </div>

              <aside className="sticky top-4 self-start rounded-xl border border-border bg-card p-4 text-sm">
                <div className="font-serif text-base text-primary">{room.name}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {checkin} → {checkout}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {nights} {t("nights")} · {guests} {t("guests")}
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="text-muted-foreground">{t("price_per_night")}</span>
                  <span>{formatSum(pricePerNight, lang)}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{formatSum(total, lang)}</span>
                </div>
                <div className="mt-2 rounded-md bg-amber-50 p-2 text-[11px] text-amber-900">
                  {t("tourist_tax_note")}
                </div>
                <div className="mt-2 rounded-md bg-emerald-50 p-2 text-[11px] text-emerald-900">
                  {t("best_price_badge")}
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t pt-3">
                  <span className="font-semibold">{t("total")}</span>
                  <span className="font-serif text-xl text-primary">{formatSum(total, lang)}</span>
                </div>
                <Button className="mt-3 w-full" disabled={submitting} onClick={submitBooking}>
                  {t("cta_book")}
                </Button>
              </aside>
            </div>
          </div>
        )}

        {step === 5 && room && (
          <div className="grid gap-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl text-primary">{t("confirm_title")}</h2>
            <div className="text-sm">
              <div className="font-mono text-lg">{bookingNumber}</div>
              <div className="mt-2 text-muted-foreground">
                {form.lastname} {form.name} · {room.name}
              </div>
              <div className="text-muted-foreground">
                {checkin} → {checkout} · {nights} {t("nights")}
              </div>
              <div className="mt-1 font-semibold">{formatSum(total, lang)}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                {t("conf_sent_to")}: {form.email}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={downloadPdf} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t("download_pdf")}
              </Button>
              <Button variant="outline" onClick={() => { setStep(1); setBookingNumber(""); }}>
                {t("change_dates")}
              </Button>
              <Button variant="outline" onClick={cancelBooking}>
                {t("cancel_booking")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import * as XLSX from "xlsx";
import { listBookings, updateBookingStatus } from "@/lib/bookings.functions";
import { formatSum } from "@/lib/booking/pricing";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin · Afrosiyob Regency" }] }),
  component: AdminPage,
});

type Booking = {
  id: string;
  booking_number: string;
  created_at: string;
  status: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  room_type: string;
  guests_count: number;
  guest_name: string;
  guest_lastname: string;
  guest_patronymic: string | null;
  guest_phone: string;
  guest_email: string;
  guest_citizenship: string | null;
  price_per_night: number;
  total_price: number;
};

const STATUSES = ["new", "confirmed", "checked_in", "checked_out", "cancelled"] as const;
const STATUS_LABEL: Record<string, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  checked_in: "Заселён",
  checked_out: "Выехал",
  cancelled: "Отменена",
};
const NEXT_STATUS: Record<string, string | null> = {
  new: "confirmed",
  confirmed: "checked_in",
  checked_in: "checked_out",
  checked_out: null,
  cancelled: null,
};

function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="p-8 text-center text-sm">Загрузка…</div>;
  if (!session) return <LoginCard />;
  return <Dashboard onSignOut={() => supabase.auth.signOut()} />;
}

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="font-serif text-2xl text-primary">Admin · Afrosiyob</h1>
        <div className="grid gap-1.5">
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Пароль</Label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} className="w-full">Войти</Button>
        <p className="text-xs text-muted-foreground">
          Используйте e-mail/пароль администратора. Создайте пользователя в Cloud → Users и присвойте роль admin в таблице user_roles.
        </p>
        <Toaster richColors position="top-center" />
      </form>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const qc = useQueryClient();
  const list = useServerFn(listBookings);
  const update = useServerFn(updateBookingStatus);
  const { data, error, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => list(),
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const bookings = (data as Booking[] | undefined) ?? [];

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (status && b.status !== status) return false;
      if (room && b.room_type !== room) return false;
      if (from && b.check_in_date < from) return false;
      if (to && b.check_in_date > to) return false;
      if (search) {
        const s = search.toLowerCase();
        const hay = `${b.booking_number} ${b.guest_name} ${b.guest_lastname} ${b.guest_email}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [bookings, status, room, from, to, search]);

  const today = new Date().toISOString().split("T")[0];
  const monthStart = today.slice(0, 7) + "-01";

  const stats = useMemo(() => {
    const arrivals = bookings.filter((b) => b.check_in_date === today && b.status !== "cancelled").length;
    const departures = bookings.filter((b) => b.check_out_date === today && b.status !== "cancelled").length;
    const occupancy = bookings.filter((b) => b.status === "checked_in").length;
    const thisMonth = bookings.filter((b) => b.created_at.slice(0, 10) >= monthStart).length;
    return { arrivals, departures, occupancy, thisMonth };
  }, [bookings, today, monthStart]);

  const rooms = Array.from(new Set(bookings.map((b) => b.room_type)));

  async function changeStatus(b: Booking, next: string) {
    try {
      await update({ data: { id: b.id, status: next as any } });
      toast.success(`Статус: ${STATUS_LABEL[next] ?? next}`);
      qc.invalidateQueries({ queryKey: ["bookings"] });
      if (selected?.id === b.id) setSelected({ ...b, status: next });
    } catch (e: any) {
      toast.error(e?.message || "Error");
    }
  }

  function exportExcel() {
    const rows = filtered.map((b) => ({
      "№": b.booking_number,
      Дата: b.created_at.slice(0, 10),
      Статус: STATUS_LABEL[b.status] ?? b.status,
      Заезд: b.check_in_date,
      Выезд: b.check_out_date,
      Ночей: b.nights,
      Номер: b.room_type,
      Гостей: b.guests_count,
      Гость: `${b.guest_lastname} ${b.guest_name}`,
      Телефон: b.guest_phone,
      Email: b.guest_email,
      Гражданство: b.guest_citizenship ?? "",
      Цена: b.price_per_night,
      Итого: b.total_price,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `bookings-${today}.xlsx`);
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
        <Button className="mt-4" variant="outline" onClick={onSignOut}>Выйти</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-primary">Admin · Бронирования</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportExcel}>Экспорт в Excel</Button>
          <Button variant="outline" onClick={onSignOut}>Выйти</Button>
        </div>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Заезды сегодня" value={stats.arrivals} />
        <StatCard label="Выезды сегодня" value={stats.departures} />
        <StatCard label="Текущая загрузка" value={stats.occupancy} />
        <StatCard label="Брони за месяц" value={stats.thisMonth} />
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-5">
        <Input placeholder="Поиск по имени или №" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Все статусы</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="">Все номера</option>
          {rooms.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="overflow-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-3 py-2">№</th>
              <th className="px-3 py-2">Гость</th>
              <th className="px-3 py-2">Номер</th>
              <th className="px-3 py-2">Даты</th>
              <th className="px-3 py-2">Гостей</th>
              <th className="px-3 py-2">Итого</th>
              <th className="px-3 py-2">Статус</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={8} className="p-4 text-center text-muted-foreground">Загрузка…</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={8} className="p-4 text-center text-muted-foreground">Нет броней</td></tr>
            )}
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-border hover:bg-muted/50 cursor-pointer" onClick={() => setSelected(b)}>
                <td className="px-3 py-2 font-mono text-xs">{b.booking_number}</td>
                <td className="px-3 py-2">{b.guest_lastname} {b.guest_name}</td>
                <td className="px-3 py-2">{b.room_type}</td>
                <td className="px-3 py-2 whitespace-nowrap">{b.check_in_date} → {b.check_out_date}</td>
                <td className="px-3 py-2">{b.guests_count}</td>
                <td className="px-3 py-2">{formatSum(b.total_price)}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{STATUS_LABEL[b.status] ?? b.status}</span>
                </td>
                <td className="px-3 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                  {NEXT_STATUS[b.status] && (
                    <Button size="sm" variant="outline" onClick={() => changeStatus(b, NEXT_STATUS[b.status]!)}>
                      → {STATUS_LABEL[NEXT_STATUS[b.status]!]}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl text-primary">{selected.booking_number}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Гость</dt><dd>{selected.guest_lastname} {selected.guest_name} {selected.guest_patronymic}</dd>
              <dt className="text-muted-foreground">Телефон</dt><dd>{selected.guest_phone}</dd>
              <dt className="text-muted-foreground">Email</dt><dd>{selected.guest_email}</dd>
              <dt className="text-muted-foreground">Гражданство</dt><dd>{selected.guest_citizenship ?? "—"}</dd>
              <dt className="text-muted-foreground">Номер</dt><dd>{selected.room_type}</dd>
              <dt className="text-muted-foreground">Заезд → Выезд</dt><dd>{selected.check_in_date} → {selected.check_out_date}</dd>
              <dt className="text-muted-foreground">Ночей / Гостей</dt><dd>{selected.nights} / {selected.guests_count}</dd>
              <dt className="text-muted-foreground">За ночь</dt><dd>{formatSum(selected.price_per_night)}</dd>
              <dt className="text-muted-foreground">Итого</dt><dd className="font-semibold">{formatSum(selected.total_price)}</dd>
              <dt className="text-muted-foreground">Статус</dt><dd>{STATUS_LABEL[selected.status] ?? selected.status}</dd>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <Button key={s} size="sm" variant={selected.status === s ? "default" : "outline"} onClick={() => changeStatus(selected, s)}>
                  {STATUS_LABEL[s]}
                </Button>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Button variant="ghost" onClick={() => setSelected(null)}>Закрыть</Button>
            </div>
          </div>
        </div>
      )}

      <Toaster richColors position="top-center" />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-3xl text-primary">{value}</div>
    </div>
  );
}
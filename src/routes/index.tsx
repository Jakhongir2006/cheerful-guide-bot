import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Phone,
  MapPin,
  Plane,
  BedDouble,
  Users,
  Waves,
  UtensilsCrossed,
  Car,
  ShieldCheck,
  Wifi,
  Snowflake,
  Tv,
  Coffee,
  Briefcase,
} from "lucide-react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/lib/i18n";
import { LightboxProvider, Zimg } from "@/components/Lightbox";
import { Reveal, CountUp } from "@/components/Reveal";
import logoAsset from "@/assets/afrosiyob-logo.png.asset.json";
import conf1 from "@/assets/conference-1.png.asset.json";
import conf2 from "@/assets/conference-2.png.asset.json";
import conf3 from "@/assets/conference-3.png.asset.json";
import spaHammam from "@/assets/spa-hammam.png.asset.json";
import spaMassage from "@/assets/spa-massage.png.asset.json";
import spaSauna from "@/assets/spa-sauna.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Afrosiyob Regency Hotel — отель рядом с аэропортом Ташкента" },
      {
        name: "description",
        content:
          "Afrosiyob Regency Hotel — 4★ бизнес-отель премиум класса в 1 км от аэропорта Ташкента. 100 номеров, 3 конференц-зала, бассейн, СПА, ресторан Ko'hna.",
      },
      { property: "og:title", content: "Afrosiyob Regency Hotel" },
      {
        property: "og:description",
        content:
          "Современный 4★ отель в 1 км от аэропорта Ташкента. Бронируйте напрямую и получайте лучшие условия.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://loquacious-stroopwafel-814d5f.netlify.app/t6.jpg" },
    ],
  }),
  component: Index,
});

const SRC = "https://loquacious-stroopwafel-814d5f.netlify.app";
const PHONE = "+998 55 519 00 05";
const PHONE_TEL = "+998555190005";
const WHATSAPP = "998555190005";

type Room = {
  id: string;
  name: string;
  nameRu: string;
  count: string;
  area: string;
  bed: string;
  image: string;
};

const rooms: Room[] = [
  {
    id: "standard-twin",
    name: "Standard Twin Room",
    nameRu: "Стандартный номер с раздельными кроватями",
    count: "31 номер",
    area: "27 м²",
    bed: "2 × 100×200 см",
    image: `${SRC}/Room%208-910.jpg`,
  },
  {
    id: "standard-double",
    name: "Standard Double Room",
    nameRu: "Стандартный номер с одной большой кроватью",
    count: "31 номер",
    area: "27 м²",
    bed: "1 × 160×200 см",
    image: `${SRC}/Room%2022-906.jpg`,
  },
  {
    id: "superior-double",
    name: "Superior Double Room",
    nameRu: "Улучшенный номер с одной большой кроватью",
    count: "12 номеров",
    area: "40 м²",
    bed: "1 × 180×200 см",
    image: `${SRC}/Room%203-1005.jpg`,
  },
  {
    id: "superior-twin",
    name: "Superior Twin Room",
    nameRu: "Улучшенный номер с раздельными кроватями",
    count: "19 номеров",
    area: "40 м²",
    bed: "2 × 100×200 см",
    image: `${SRC}/Room%2010-910.jpg`,
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    nameRu: "Полулюкс номер",
    count: "5 номеров",
    area: "50 м²",
    bed: "1 × 180×200 см",
    image: `${SRC}/Room%2017-909.jpg`,
  },
  {
    id: "suite",
    name: "Suite Room",
    nameRu: "Люкс номер",
    count: "2 номера",
    area: "80 м²",
    bed: "1 × 180×200 см",
    image: `${SRC}/Room%2029-1013.jpg`,
  },
];

function BookingDialog({
  trigger,
  defaultRoom,
}: {
  trigger: React.ReactNode;
  defaultRoom?: string;
}) {
  // Wrap legacy call sites with the new multi-step flow.
  // Map UI room ids/names to pricing keys.
  const map: Record<string, string> = {
    "standard-twin": "standard-twin",
    "standard-double": "standard-king",
    "superior-double": "superior-king",
    "superior-twin": "superior-twin",
    deluxe: "deluxe",
    suite: "suite",
  };
  const id = defaultRoom ? rooms.find((r) => r.name === defaultRoom)?.id : undefined;
  return <BookingFlow trigger={trigger} defaultRoomKey={id ? map[id] : undefined} />;
}

function Header() {
  const t = useT();
  const nav = [
    { href: "#home", label: t("nav_home") },
    { href: "#rooms", label: t("nav_rooms") },
    { href: "#about", label: t("nav_about") },
    { href: "#conference", label: t("nav_conference") },
    { href: "#spa", label: t("nav_spa") },
    { href: "#restaurant", label: t("nav_restaurant") },
    { href: "#location", label: t("nav_contacts") },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <a href="#home" className="flex items-center gap-2">
          <img
            src={logoAsset.url}
            alt="Afrosiyob Hotel"
            className="h-11 w-11 rounded-full object-contain bg-white ring-1 ring-border"
          />
          <div className="leading-tight">
            <div className="font-serif text-base font-semibold text-primary">Afrosiyob</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Regency Hotel
            </div>
          </div>
        </a>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative text-sm text-foreground/80 transition hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href={`tel:${PHONE_TEL}`}
            className="hidden items-center gap-2 text-sm font-semibold text-primary md:flex"
          >
            <Phone className="h-4 w-4" />
            {PHONE}
          </a>
          <BookingDialog
            trigger={<Button className="hidden bg-accent text-accent-foreground hover:bg-accent/90 md:inline-flex">{t("cta_reservation")}</Button>}
          />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const t = useT();
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(15,30,60,0.55), rgba(15,30,60,0.75)), url(${SRC}/t6.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-32 text-white">
        <p className="font-serif text-sm uppercase tracking-[0.4em] text-accent">
          {t("hero_kicker")}
        </p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
          Afrosiyob Regency Hotel
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
          {t("hero_desc")}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <BookingDialog
            trigger={
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {t("cta_book_room")}
              </Button>
            }
          />
          <a href="#rooms">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              {t("cta_view_rooms")}
            </Button>
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mb-16 max-w-6xl px-4">
        <BookingForm />
      </div>
    </section>
  );
}

function BookingForm() {
  const t = useT();
  const today = new Date().toISOString().split("T")[0];
  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(today);
  const [guests, setGuests] = useState("2");
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkin || !checkout || checkout <= checkin) {
      toast.error("Check dates");
      return;
    }
    setOpen(true);
  }

  return (
    <>
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-2xl"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-serif text-lg uppercase tracking-[0.15em] text-primary">
          {t("booking_online")}
        </h2>
        <span className="text-xs text-muted-foreground">{t("guaranteed")}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
        <div className="grid gap-1.5">
          <Label htmlFor="hero-checkin" className="text-xs uppercase tracking-wider">
            {t("checkin")}
          </Label>
          <Input
            id="hero-checkin"
            type="date"
            min={today}
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="hero-checkout" className="text-xs uppercase tracking-wider">
            {t("checkout")}
          </Label>
          <Input
            id="hero-checkout"
            type="date"
            min={today}
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="hero-guests" className="text-xs uppercase tracking-wider">
            {t("guests")}
          </Label>
          <select
            id="hero-guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          className="h-10 self-end bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {t("cta_find_room")}
        </Button>
      </div>
    </form>
    <BookingFlow open={open} onOpenChange={setOpen} />
    </>
  );
}

function Stats() {
  const items = [
    { icon: Plane, label: "5 минут до аэропорта" },
    { icon: BedDouble, label: "100 номеров" },
    { icon: Users, label: "3 конференц-зала" },
    { icon: Waves, label: "Бассейн и СПА" },
    { icon: ShieldCheck, label: "4-звёздочный отель" },
    { icon: UtensilsCrossed, label: "Ресторан Ko'hna" },
  ];
  return (
    <section className="bg-background pt-32 pb-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:grid-cols-6">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center"
          >
            <it.icon className="h-7 w-7 text-accent" />
            <span className="text-sm font-medium text-foreground">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  const t = useT();
  const gallery = [8, 9, 10, 11, 12, 13].map((n) => `${SRC}/${n}.jpg`);
  return (
    <section id="about" className="bg-secondary/40 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
        <div>
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">{t("about_kicker")}</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            {t("about_h2")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-foreground/80">{t("about_p1")}</p>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">{t("about_p2")}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {gallery.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Afrosiyob Regency интерьер ${i + 1}`}
              loading="lazy"
              className={`h-full w-full rounded-xl object-cover ${i === 0 ? "row-span-2 h-auto" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Rooms() {
  const t = useT();
  const amenities = [
    { icon: Snowflake, label: "Кондиционер" },
    { icon: Wifi, label: "Wi-Fi" },
    { icon: Tv, label: "ТВ 43–55″" },
    { icon: Coffee, label: "Мини-бар" },
    { icon: ShieldCheck, label: "Сейф" },
    { icon: Briefcase, label: "Рабочая зона" },
  ];
  return (
    <section id="rooms" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">{t("rooms_kicker")}</p>
            <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
              {t("rooms_h1")}
            </h2>
          </div>
          <div className="hidden gap-3 md:flex">
            {amenities.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground/80"
              >
                <a.icon className="h-3.5 w-3.5 text-accent" />
                {a.label}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => (
            <article
              key={r.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {r.nameRu}
                </p>
                <h3 className="mt-1 font-serif text-xl text-primary">{r.name}</h3>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-xs text-foreground/70">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Кол-во
                    </dt>
                    <dd className="font-medium text-foreground">{r.count}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Площадь
                    </dt>
                    <dd className="font-medium text-foreground">{r.area}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Кровать
                    </dt>
                    <dd className="font-medium text-foreground">{r.bed}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex items-center gap-2">
                  <BookingDialog
                    defaultRoom={r.name}
                    trigger={
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        {t("cta_book")}
                      </Button>
                    }
                  />
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    {t("cta_get_price")}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Conference() {
  const t = useT();
  const halls = [
    {
      name: "Afrosiyob",
      desc: "Для корпоративных мероприятий и презентаций.",
    },
    { name: "Shahrisabz", desc: "Для деловых встреч, тренингов и семинаров." },
    { name: "Nasaf", desc: "Для переговоров и бизнес-встреч." },
  ];
  return (
    <section
      id="conference"
      className="relative bg-primary py-20 text-primary-foreground"
      style={{
        backgroundImage: `linear-gradient(rgba(20,30,60,0.92), rgba(20,30,60,0.92)), url(${SRC}/18.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">{t("conf_kicker")}</p>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl md:text-4xl">
          {t("conf_h2")}
        </h2>
        <p className="mt-4 max-w-2xl text-white/80">{t("conf_desc")}</p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {halls.map((h) => (
            <div
              key={h.name}
              className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur"
            >
              <h3 className="font-serif text-2xl text-accent">«{h.name}»</h3>
              <p className="mt-3 text-sm text-white/80">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <BookingDialog
            trigger={
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {t("cta_request")}
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
}

function Spa() {
  const t = useT();
  const imgs = [
    `${SRC}/IMG_1818.jpg`,
    `${SRC}/IMG_1804.jpg`,
    `${SRC}/IMG_1800.jpg`,
  ];
  return (
    <section id="spa" className="bg-background py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2 lg:items-center">
        <div className="grid grid-cols-2 gap-3">
          <img
            src={imgs[0]}
            alt="СПА и бассейн"
            loading="lazy"
            className="col-span-2 h-72 w-full rounded-2xl object-cover"
          />
          <img src={imgs[1]} alt="Фитнес" loading="lazy" className="h-44 w-full rounded-2xl object-cover" />
          <img src={imgs[2]} alt="Сауна" loading="lazy" className="h-44 w-full rounded-2xl object-cover" />
        </div>
        <div>
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">{t("spa_kicker")}</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            {t("spa_h2")}
          </h2>
          <p className="mt-5 leading-relaxed text-foreground/80">{t("spa_desc")}</p>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-foreground/80">
            {["Крытый бассейн", "Фитнес-центр", "Сауна", "Турецкий хаммам"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {x}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <BookingDialog
              trigger={
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("cta_request")}
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Restaurant() {
  const t = useT();
  const imgs = [`${SRC}/3.jpg`, `${SRC}/5.jpg`, `${SRC}/2.png`, `${SRC}/1.jpg`];
  return (
    <section id="restaurant" className="bg-secondary/40 py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">{t("rest_kicker")}</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            {t("rest_h2")}
          </h2>
          <p className="mt-5 leading-relaxed text-foreground/80">{t("rest_desc")}</p>
          <ul className="mt-6 space-y-2 text-sm text-foreground/80">
            {[
              "Завтрак — шведский стол",
              "Бизнес-обеды",
              "Банкетное обслуживание",
              "Обслуживание в номере (Room Service)",
            ].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {x}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="mr-2 h-4 w-4" /> {t("cta_book_table")}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {imgs.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Ресторан Ko'hna ${i + 1}`}
              loading="lazy"
              className="h-48 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Why() {
  const t = useT();
  const items = [
    { icon: Plane, title: "5 минут до аэропорта", desc: "Всего 1 км от международного аэропорта Ташкента." },
    { icon: BedDouble, title: "100 современных номеров", desc: "От Standard до Suite — комфорт для каждого гостя." },
    { icon: Users, title: "3 конференц-зала", desc: "Оборудованные залы для встреч и семинаров." },
    { icon: Waves, title: "Бассейн, СПА, фитнес", desc: "Крытый бассейн, сауна, хаммам, фитнес-клуб." },
    { icon: Car, title: "Бесплатная парковка", desc: "Круглосуточный reception, прачечная." },
    { icon: ShieldCheck, title: "Booking и системы", desc: "Подключение к Booking и международным системам." },
  ];
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">{t("why_kicker")}</p>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl text-primary md:text-4xl">
          {t("why_h2")}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent"
            >
              <it.icon className="h-8 w-8 text-accent" />
              <h3 className="mt-4 font-serif text-lg text-primary">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Location() {
  const t = useT();
  return (
    <section id="location" className="bg-secondary/40 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-accent">{t("loc_kicker")}</p>
          <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
            {t("loc_h2")}
          </h2>
          <p className="mt-5 text-foreground/80">
            Отель находится всего в 1 км от аэропорта — идеальный выбор для транзитных пассажиров,
            международных делегаций и бизнес-путешественников.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <div className="font-medium text-foreground">Адрес</div>
                <div className="text-foreground/70">ул. Абдулла Каххара 150A, Ташкент</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <div className="font-medium text-foreground">Служба резервации</div>
                <a href={`tel:${PHONE_TEL}`} className="text-foreground/70 hover:text-primary">
                  {PHONE}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Plane className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <div className="font-medium text-foreground">От аэропорта</div>
                <div className="text-foreground/70">~1.3 км · 4–5 минут</div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://yandex.uz/maps/?ll=69.264784%2C41.271109&z=16"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">{t("cta_open_map")}</Button>
            </a>
            <BookingDialog
              trigger={
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {t("cta_book")}
                </Button>
              }
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <iframe
            title="Карта"
            src="https://yandex.com/map-widget/v1/?ll=69.264784%2C41.271109&z=16&pt=69.264784%2C41.271109"
            className="h-[420px] w-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="bg-primary py-12 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
        <div>
          <div className="font-serif text-2xl">Afrosiyob Regency</div>
          <p className="mt-3 text-sm text-white/70">
            4★ бизнес-отель в 1 км от международного аэропорта Ташкента.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-accent">Контакты</div>
          <a href={`tel:${PHONE_TEL}`} className="mt-3 block text-sm">
            {PHONE}
          </a>
          <div className="mt-1 text-sm text-white/70">ул. Абдулла Каххара 150A, Ташкент</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-accent">Бронирование</div>
          <p className="mt-3 text-sm text-white/70">
            Бронируйте напрямую через сайт и получите лучшие условия проживания.
          </p>
          <div className="mt-4">
            <BookingDialog
              trigger={
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {t("cta_book_room")}
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Afrosiyob Regency Hotel. Все права защищены.
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Rooms />
        <Conference />
        <Spa />
        <Restaurant />
        <Why />
        <Location />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}

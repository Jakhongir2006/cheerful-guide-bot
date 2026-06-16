export type RoomKey =
  | "standard-king"
  | "standard-twin"
  | "superior-king"
  | "superior-twin"
  | "deluxe"
  | "suite";

export type RoomTier = "standard" | "superior" | "deluxe" | "suite";

export type RoomDef = {
  key: RoomKey;
  name: string;
  tier: RoomTier;
  area: string;
  bed: string;
  image: string;
  single: number;
  double: number;
};

const SRC = "https://loquacious-stroopwafel-814d5f.netlify.app";

export const ROOMS: RoomDef[] = [
  {
    key: "standard-king",
    name: "Standard King",
    tier: "standard",
    area: "27 m²",
    bed: "1 × 160×200",
    image: `${SRC}/Room%2022-906.jpg`,
    single: 900_000,
    double: 1_100_000,
  },
  {
    key: "standard-twin",
    name: "Standard Twin",
    tier: "standard",
    area: "27 m²",
    bed: "2 × 100×200",
    image: `${SRC}/Room%208-910.jpg`,
    single: 1_100_000,
    double: 1_100_000,
  },
  {
    key: "superior-king",
    name: "Superior King",
    tier: "superior",
    area: "40 m²",
    bed: "1 × 180×200",
    image: `${SRC}/Room%203-1005.jpg`,
    single: 1_000_000,
    double: 1_200_000,
  },
  {
    key: "superior-twin",
    name: "Superior Twin",
    tier: "superior",
    area: "40 m²",
    bed: "2 × 100×200",
    image: `${SRC}/Room%2010-910.jpg`,
    single: 1_200_000,
    double: 1_200_000,
  },
  {
    key: "deluxe",
    name: "Deluxe",
    tier: "deluxe",
    area: "50 m²",
    bed: "1 × 180×200",
    image: `${SRC}/Room%2017-909.jpg`,
    single: 1_500_000,
    double: 1_700_000,
  },
  {
    key: "suite",
    name: "Suite",
    tier: "suite",
    area: "80 m²",
    bed: "1 × 180×200",
    image: `${SRC}/Room%2029-1013.jpg`,
    single: 2_000_000,
    double: 2_200_000,
  },
];

export function priceFor(room: RoomDef, guests: number) {
  return guests <= 1 ? room.single : room.double;
}

export function nightsBetween(checkin: string, checkout: string) {
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function formatSum(value: number, lang: string = "ru") {
  const formatter = new Intl.NumberFormat(lang === "en" ? "en-US" : "ru-RU");
  const suffix = lang === "ko" ? "сум" : lang === "en" ? "UZS" : "сум";
  return `${formatter.format(value)} ${suffix}`;
}

export function upgradeTargets(tier: RoomTier): RoomTier[] {
  if (tier === "standard") return ["superior", "deluxe"];
  if (tier === "superior") return ["deluxe", "suite"];
  return [];
}

export function generateBookingNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `AFR-2026${rand}`;
}
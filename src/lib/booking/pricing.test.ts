import { describe, expect, test } from "bun:test";
import { ROOMS, priceFor } from "./pricing";

describe.each(["standard-king", "standard-twin"])("%s nightly pricing", (key) => {
  test("one guest costs 700,000 UZS", () => {
    const room = ROOMS.find((r) => r.key === key);
    if (!room) throw new Error(`Missing room: ${key}`);
    expect(priceFor(room, 1)).toBe(700_000);
  });

  test("two guests cost 900,000 UZS", () => {
    const room = ROOMS.find((r) => r.key === key);
    if (!room) throw new Error(`Missing room: ${key}`);
    expect(priceFor(room, 2)).toBe(900_000);
  });
});
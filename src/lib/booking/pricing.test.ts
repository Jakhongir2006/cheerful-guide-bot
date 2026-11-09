import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { ROOMS, priceFor, bookingCosts, TOURIST_TAX_PER_GUEST_PER_NIGHT, EXTRA_BED_PRICE_PER_NIGHT } from "./pricing";

describe("Tourist tax", () => {
  test("rate is 66,000 UZS per guest per night", () => {
    assert.equal(TOURIST_TAX_PER_GUEST_PER_NIGHT, 66_000);
  });
  test("two guests for three nights pay 396,000 UZS tax included in total", () => {
    const room = ROOMS.find((r) => r.key === "standard-king");
    if (!room) throw new Error("Missing room");
    assert.deepEqual(bookingCosts(room, 2, 3), {
      pricePerNight: 900_000, subtotal: 2_700_000, extraBed: 0, touristTax: 396_000, total: 3_096_000,
    });
  });
  test("one guest for one night pays 66,000 UZS tax included in total", () => {
    const room = ROOMS.find((r) => r.key === "deluxe");
    if (!room) throw new Error("Missing room");
    assert.equal(bookingCosts(room, 1, 1).touristTax, 66_000);
    assert.equal(bookingCosts(room, 1, 1).total, 1_266_000);
  });
});

describe("Deluxe nightly pricing", () => {
  test("one guest costs 1,200,000 UZS", () => {
    const room = ROOMS.find((r) => r.key === "deluxe");
    if (!room) throw new Error("Missing Deluxe room");
    assert.equal(priceFor(room, 1), 1_200_000);
  });
  test("two guests cost 1,400,000 UZS", () => {
    const room = ROOMS.find((r) => r.key === "deluxe");
    if (!room) throw new Error("Missing Deluxe room");
    assert.equal(priceFor(room, 2), 1_400_000);
  });
});

describe("Suite nightly pricing", () => {
  test("one guest costs 1,500,000 UZS", () => {
    const room = ROOMS.find((r) => r.key === "suite");
    if (!room) throw new Error("Missing Suite room");
    assert.equal(priceFor(room, 1), 1_500_000);
  });
  test("two guests cost 1,700,000 UZS", () => {
    const room = ROOMS.find((r) => r.key === "suite");
    if (!room) throw new Error("Missing Suite room");
    assert.equal(priceFor(room, 2), 1_700_000);
  });
});

for (const key of ["standard-king", "standard-twin"]) {
describe(`${key} nightly pricing`, () => {
  test("one guest costs 700,000 UZS", () => {
    const room = ROOMS.find((r) => r.key === key);
    if (!room) throw new Error(`Missing room: ${key}`);
    assert.equal(priceFor(room, 1), 700_000);
  });

  test("two guests cost 900,000 UZS", () => {
    const room = ROOMS.find((r) => r.key === key);
    if (!room) throw new Error(`Missing room: ${key}`);
    assert.equal(priceFor(room, 2), 900_000);
  });
});
}

for (const key of ["superior-king", "superior-twin"]) {
  describe(`${key} nightly pricing`, () => {
    test("one guest costs 850,000 UZS", () => {
      const room = ROOMS.find((r) => r.key === key);
      if (!room) throw new Error(`Missing room: ${key}`);
      assert.equal(priceFor(room, 1), 850_000);
    });

    test("two guests cost 1,050,000 UZS", () => {
      const room = ROOMS.find((r) => r.key === key);
      if (!room) throw new Error(`Missing room: ${key}`);
      assert.equal(priceFor(room, 2), 1_050_000);
    });
  });
}

describe("Room capacity", () => {
  test("Standard King, Standard Twin, Deluxe and Suite fit at most 2 guests", () => {
    for (const key of ["standard-king", "standard-twin", "deluxe", "suite"]) {
      const room = ROOMS.find((r) => r.key === key);
      if (!room) throw new Error(`Missing room: ${key}`);
      assert.equal(room.maxGuests, 2);
    }
  });
  test("Superior King and Superior Twin fit 3 guests with an extra bed", () => {
    for (const key of ["superior-king", "superior-twin"]) {
      const room = ROOMS.find((r) => r.key === key);
      if (!room) throw new Error(`Missing room: ${key}`);
      assert.equal(room.maxGuests, 3);
    }
  });
});

describe("Extra bed pricing", () => {
  test("extra bed costs 200,000 UZS per night", () => {
    assert.equal(EXTRA_BED_PRICE_PER_NIGHT, 200_000);
  });
  test("3 guests in a Superior room for 2 nights add 400,000 UZS extra bed", () => {
    const room = ROOMS.find((r) => r.key === "superior-king");
    if (!room) throw new Error("Missing room");
    const costs = bookingCosts(room, 3, 2);
    assert.equal(costs.extraBed, 400_000);
    assert.equal(costs.subtotal, 2_100_000);
    assert.equal(costs.total, 2_100_000 + 400_000 + 396_000);
  });
  test("2 guests pay no extra bed fee", () => {
    const room = ROOMS.find((r) => r.key === "superior-twin");
    if (!room) throw new Error("Missing room");
    assert.equal(bookingCosts(room, 2, 3).extraBed, 0);
  });
});
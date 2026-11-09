import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { ROOMS, priceFor } from "./pricing";

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
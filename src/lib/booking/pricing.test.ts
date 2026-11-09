import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { ROOMS, priceFor } from "./pricing";

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
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { INVENTORY_TRACKING_ENABLED, isRoomSoldOut } from "./availability";

test("temporary open reservations accept rooms with zero recorded inventory", () => {
  assert.equal(INVENTORY_TRACKING_ENABLED, false);
  assert.equal(isRoomSoldOut(0), false);
});
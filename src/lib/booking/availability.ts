// Reservations are temporarily open without quantitative stock tracking.
// Restore this switch when the hotel supplies its real inventory totals.
export const INVENTORY_TRACKING_ENABLED = false;

export function isRoomSoldOut(availableRooms: number | undefined): boolean {
  return INVENTORY_TRACKING_ENABLED && availableRooms === 0;
}
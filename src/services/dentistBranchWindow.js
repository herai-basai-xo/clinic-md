/**
 * Nepal (Asia/Kathmandu) date/time helpers shared by attendance-related checks.
 */

function normalizeTime(timeStr) {
  if (!timeStr) return '00:00:00';
  return timeStr.length === 5 ? `${timeStr}:00` : timeStr.slice(0, 8);
}

/** Nepal (Asia/Kathmandu, fixed +05:45, no DST) wall-clock Date for a date+time pair. */
export function toKathmanduDate(dateStr, timeStr) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T${normalizeTime(timeStr)}+05:45`);
}

/**
 * Whether a booking's date/start_time falls at or after a dentist's already-recorded
 * check-out for that date — i.e. they've clocked out and shouldn't be booked into any
 * slot from that point through the rest of the day.
 *
 * @param {string|null} checkOutTime - raw dentist_attendance.check_out_time
 *   (timestamptz) for that dentist on that date, or null/undefined if not checked out.
 * @param {string} bookingDate - the booking's date (YYYY-MM-DD).
 * @param {string} bookingStartTime - the booking's start_time (HH:MM or HH:MM:SS).
 * @returns {boolean}
 */
export function isAfterCheckout(checkOutTime, bookingDate, bookingStartTime) {
  if (!checkOutTime) return false;
  const atDate = toKathmanduDate(bookingDate, bookingStartTime);
  if (!atDate) return false;
  return atDate >= new Date(checkOutTime);
}

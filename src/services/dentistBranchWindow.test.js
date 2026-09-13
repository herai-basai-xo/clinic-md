import { describe, it, expect } from 'vitest';
import { toKathmanduDate, isAfterCheckout } from './dentistBranchWindow';

describe('isAfterCheckout', () => {
  it('is false when the dentist has not checked out at all', () => {
    expect(isAfterCheckout(null, '2026-09-10', '17:30')).toBe(false);
    expect(isAfterCheckout(undefined, '2026-09-10', '17:30')).toBe(false);
  });

  it('is false for a booking time before the check-out time', () => {
    const checkOutTime = '2026-09-10T17:00:00+05:45';
    expect(isAfterCheckout(checkOutTime, '2026-09-10', '16:30')).toBe(false);
  });

  it('is true for a booking time at or after the check-out time', () => {
    const checkOutTime = '2026-09-10T17:00:00+05:45';
    expect(isAfterCheckout(checkOutTime, '2026-09-10', '17:00')).toBe(true);
    expect(isAfterCheckout(checkOutTime, '2026-09-10', '18:00')).toBe(true);
  });

  it('is false for the same clock time on a different (earlier) date than the check-out', () => {
    // Guards against comparing time-of-day only and ignoring the date.
    const checkOutTime = '2026-09-10T17:00:00+05:45';
    expect(isAfterCheckout(checkOutTime, '2026-09-09', '18:00')).toBe(false);
  });
});

describe('toKathmanduDate', () => {
  it('returns null when no date is supplied', () => {
    expect(toKathmanduDate(null, '10:00:00')).toBeNull();
  });

  it('builds a fixed +05:45 offset Date from a date + HH:MM:SS time', () => {
    const d = toKathmanduDate('2026-09-10', '10:00:00');
    expect(d.toISOString()).toBe(new Date('2026-09-10T10:00:00+05:45').toISOString());
  });

  it('normalizes an HH:MM time to HH:MM:SS', () => {
    const d = toKathmanduDate('2026-09-10', '10:00');
    expect(d.toISOString()).toBe(new Date('2026-09-10T10:00:00+05:45').toISOString());
  });

  it('defaults to midnight when no time is supplied', () => {
    const d = toKathmanduDate('2026-09-10', null);
    expect(d.toISOString()).toBe(new Date('2026-09-10T00:00:00+05:45').toISOString());
  });
});

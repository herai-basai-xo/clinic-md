// Convert "HH:MM" or "HH:MM:SS" to 12h format
export function to12h(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatNPR(amount) {
  return `NPR ${Number(amount).toLocaleString('en-IN')}`;
}

// Normalize a person's name to Title Case (customers, dentists, due-holders).
// Lowercases each word then capitalizes its first letter, preserving hyphens/
// apostrophes within a word (e.g. "mary-jane o'brien" -> "Mary-Jane O'Brien").
export function toTitleCase(str) {
  if (!str) return str;
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/[a-zÀ-ɏ]+/gi, (word) =>
      word.replace(/(^|[-'])([a-z])/g, (m, sep, letter) => sep + letter.toUpperCase())
    );
}

// Map lowercase UI statuses back to Title-Case DB values for API calls
const STATUS_TO_DB = {
  'pending': 'Pending',
  'confirmed': 'Confirmed',
  'in-progress': 'In-Progress',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'no show': 'No Show',
  'no-show': 'No Show',
};

export function toDbStatus(uiStatus) {
  return STATUS_TO_DB[uiStatus] || uiStatus;
}

/**
 * Removes bookings from `previousDue` (getCustomerOutstandingBalance's result shape, keyed by
 * `.bookingId`) that are already present in `related` (fetchRelatedUnpaidBookings's raw-row
 * result shape, keyed by `.id`) — both key names refer to the same underlying bookings.id UUID.
 *
 * Why this exists: BookingActionModal.jsx's Payment tab independently fetches "Related
 * Treatments" (matched by customer name + exact date) and "Previous Due" (matched by phone,
 * across all dates). A real booking_group_id sibling that's unpaid always satisfies BOTH
 * queries' criteria, so without this dedup it gets listed — and summed into the Grand Total —
 * twice.
 *
 * @param {Array} previousDue - getCustomerOutstandingBalance()'s `data.bookings` array.
 * @param {Array} related - fetchRelatedUnpaidBookings()'s `data` array.
 * @returns {Array} previousDue entries whose bookingId doesn't appear in related, order preserved.
 */
export function excludeRelatedFromPreviousDue(previousDue, related) {
  const relatedIds = new Set((related || []).map(r => r.id));
  return (previousDue || []).filter(pd => !relatedIds.has(pd.bookingId));
}

export function transformBooking(dbBooking) {
  const dentist = dbBooking.dentist
    ? {
        id: dbBooking.dentist.id,
        name: dbBooking.dentist.name,
        gender: dbBooking.dentist.gender,
        chair: dbBooking.chair?.name || null,
      }
    : null;

  // Build dentists array from junction table (if available), fallback to single dentist
  let dentists = [];
  if (dbBooking.booking_dentists && dbBooking.booking_dentists.length > 0) {
    dentists = dbBooking.booking_dentists
      .filter(bt => bt.dentist)
      .map(bt => ({
        id: bt.dentist.id,
        name: bt.dentist.name,
        gender: bt.dentist.gender || null,
      }));
  } else if (dentist) {
    dentists = [dentist];
  }

  const finalAmount = Number(dbBooking.final_amount ?? dbBooking.base_amount ?? 0);
  const paymentStatus = dbBooking.payment_status || 'unpaid';

  // amountPaid is derived from joined payment rows when present; otherwise fall
  // back to the status flag (exact partial amounts require the payments join).
  const paymentRows = Array.isArray(dbBooking.payments) ? dbBooking.payments : null;
  let amountPaid;
  if (paymentRows) {
    amountPaid = paymentRows.reduce((s, p) => s + Number(p.amount || 0), 0);
  } else {
    amountPaid = paymentStatus === 'paid' ? finalAmount : 0;
  }
  const amountDue = Math.max(finalAmount - amountPaid, 0);

  return {
    id: dbBooking.booking_number,
    bookingId: dbBooking.id,
    customerName: dbBooking.customer_name,
    customerEmail: dbBooking.customer_email || null,
    customerPhone: dbBooking.customer_phone || null,
    treatment: dbBooking.treatment?.name || 'Unknown Treatment',
    duration: dbBooking.treatment
      ? `${dbBooking.treatment.duration_minutes} min`
      : '',
    time: dbBooking.start_time ? dbBooking.start_time.slice(0, 5) : '',
    date: dbBooking.date,
    status: dbBooking.status ? dbBooking.status.toLowerCase() : 'pending',
    paymentStatus,
    baseAmount: Number(dbBooking.base_amount || 0),
    discountAmount: Number(dbBooking.discount_amount || 0),
    finalAmount,
    amountPaid,
    amountDue,
    dueHolderName: dbBooking.due_holder_name || null,
    dentist,
    dentists,
    treatmentId: dbBooking.treatment_id || null,
    chairId: dbBooking.chair_id || null,
    chairName: dbBooking.chair?.name || null,
    branchId: dbBooking.branch_id || null,
    branchName: dbBooking.branch?.name || null,
    startTime: dbBooking.start_time || null,
    specialRequests: dbBooking.special_requests || null,
    referredBy: dbBooking.referred_by || null,
    referralSource: dbBooking.referral_source || null,
    referralSourceDetail: dbBooking.referral_source_detail || null,
    price: formatNPR(dbBooking.final_amount ?? dbBooking.base_amount ?? 0),
    isLocked: dbBooking.is_locked || false,
    bookingGroupId: dbBooking.booking_group_id || null,
    payments: paymentRows
      ? paymentRows.map(p => ({ amount: Number(p.amount || 0), paymentMode: p.payment_mode, createdAt: p.created_at }))
      : [],
  };
}

export function transformBookings(dbBookings) {
  return dbBookings.map(transformBooking);
}

// Membership status is COMPUTED from balance/total_deposited/activation_date/expiry_date
// instead of stored. See migration-045-memberships.sql §"Status (pending/active/lapsed/depleted)
// is computed, not stored".
function computeMembershipStatus(m) {
  const advance = Number(m.tier?.advance_amount ?? 0);
  const total = Number(m.total_deposited ?? 0);
  const balance = Number(m.balance ?? 0);
  if (!m.activation_date) {
    if (balance <= 0 && total > 0) return 'depleted';
    return total >= advance ? 'active' : 'pending';
  }
  if (balance <= 0) return 'depleted';
  const today = new Date();
  const today00 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const expiry = m.expiry_date ? new Date(m.expiry_date + 'T00:00:00') : null;
  if (expiry && expiry < today00) return 'lapsed';
  return 'active';
}

export function transformMembership(dbMembership) {
  if (!dbMembership) return null;
  const tier = dbMembership.tier || dbMembership.membership_tiers || null;
  const customer = dbMembership.customer || dbMembership.customers || null;
  const status = computeMembershipStatus({ ...dbMembership, tier });
  return {
    id: dbMembership.id,
    orgId: dbMembership.org_id,
    customerId: dbMembership.customer_id,
    customerName: customer?.full_name || null,
    customerPhone: customer?.phone || null,
    customerGender: customer?.gender || null,
    customerDateOfBirth: customer?.date_of_birth || null,
    customerBranchId: customer?.branch?.id || null,
    customerBranchName: customer?.branch?.name || null,
    membershipNumber: dbMembership.membership_number || null,
    tierId: dbMembership.tier_id,
    tierName: tier?.name || null,
    tierCodePrefix: tier?.code_prefix || null,
    tierAdvanceAmount: tier ? Number(tier.advance_amount) : null,
    tierDiscountRules: tier?.discount_rules || {},
    tierValidityDays: tier?.validity_days || null,
    totalDeposited: Number(dbMembership.total_deposited || 0),
    balance: Number(dbMembership.balance || 0),
    activationDate: dbMembership.activation_date || null,
    expiryDate: dbMembership.expiry_date || null,
    birthdayPerkUsedAt: dbMembership.birthday_perk_used_at || null,
    notes: dbMembership.notes || null,
    createdBy: dbMembership.created_by || null,
    createdAt: dbMembership.created_at || null,
    status,
  };
}

export function transformMemberships(dbRows) {
  return (dbRows || []).map(transformMembership);
}

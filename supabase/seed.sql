-- Dev/staging seed data: one dental clinic with a branch, chairs, dentists, and treatments.
-- Safe to re-run: each insert is keyed by a fixed UUID and upserts on conflict.

INSERT INTO public.organizations (id, name, code, slug, owner_email, timezone, currency, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'Bright Smile Dental', 'BSD', 'bright-smile-dental', 'owner@brightsmile.test', 'Asia/Kathmandu', 'NPR', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.branches (id, org_id, name, address, phone, is_active, open_time, close_time, online_booking_capacity)
VALUES ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Kathmandu Main', 'Durbar Marg, Kathmandu', '+977-1-4000000', true, '10:00', '20:00', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.chairs (id, branch_id, name, is_active, display_order, capacity)
VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Chair 1', true, 1, 1),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 'Chair 2', true, 2, 1),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101', 'Chair 3', true, 3, 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.dentists (id, org_id, branch_id, name, gender, specialties, is_active, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Dr. Anjali Shrestha', 'Female', ARRAY['General'], true, 1),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Dr. Bishal Karki', 'Male', ARRAY['Orthodontist'], true, 2),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Dr. Sarita Gurung', 'Female', ARRAY['Pediatric', 'General'], true, 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.treatments (id, org_id, name, duration_minutes, price_npr, category, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', 'Dental Cleaning', 30, 1500, 'Preventive', true),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', 'Cavity Filling', 45, 3000, 'Restorative', true),
  ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000001', 'Root Canal Treatment', 90, 12000, 'Restorative', true),
  ('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000001', 'Teeth Whitening', 60, 8000, 'Cosmetic', true),
  ('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000001', 'Braces Consultation', 30, 1000, 'Orthodontic', true),
  ('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000001', 'Pediatric Checkup', 30, 1200, 'Pediatric', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Sample patients
INSERT INTO public.customers (id, org_id, branch_id, full_name, phone, email, gender)
VALUES
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Ramesh Adhikari', '+9779841000001', 'ramesh.a@example.test', 'Male'),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Sunita Maharjan', '+9779841000002', 'sunita.m@example.test', 'Female'),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Kiran Thapa', '+9779841000003', 'kiran.t@example.test', 'Male'),
  ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Pooja Rai', '+9779841000004', 'pooja.r@example.test', 'Female'),
  ('00000000-0000-0000-0000-000000000505', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Bikash Shahi', '+9779841000005', 'bikash.s@example.test', 'Male'),
  ('00000000-0000-0000-0000-000000000506', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Anita Tamang', '+9779841000006', 'anita.t@example.test', 'Female'),
  ('00000000-0000-0000-0000-000000000507', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Suraj Basnet', '+9779841000007', 'suraj.b@example.test', 'Male'),
  ('00000000-0000-0000-0000-000000000508', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Manisha KC', '+9779841000008', 'manisha.k@example.test', 'Female')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Sample bookings: a mix of completed/paid past visits, a cancelled/no-show,
-- and upcoming pending/confirmed appointments. end_time, start_datetime,
-- end_datetime, final_amount, and booking_number are all DB-computed by
-- triggers (see trg_compute_datetimes / trg_compute_final_amount /
-- trg_booking_number in schema.sql) - not set here, same as the real app.
INSERT INTO public.bookings (
  id, branch_id, chair_id, treatment_id, dentist_id, customer_id,
  customer_name, customer_phone, customer_email, customer_gender,
  date, start_time, status, payment_status, base_amount, discount_amount,
  treatment_name_snapshot, treatment_duration_snapshot, treatment_price_snapshot,
  dentist_name_snapshot, chair_name_snapshot
) VALUES
  -- Past, completed & paid
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000501', 'Ramesh Adhikari', '+9779841000001', 'ramesh.a@example.test', 'Male', CURRENT_DATE - INTERVAL '10 days', '11:00:00', 'Completed', 'paid', 1500, 0, 'Dental Cleaning', 30, 1500, 'Dr. Anjali Shrestha', 'Chair 1'),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000502', 'Sunita Maharjan', '+9779841000002', 'sunita.m@example.test', 'Female', CURRENT_DATE - INTERVAL '7 days', '14:00:00', 'Completed', 'paid', 12000, 1000, 'Root Canal Treatment', 90, 12000, 'Dr. Bishal Karki', 'Chair 2'),
  ('00000000-0000-0000-0000-000000000603', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000504', 'Pooja Rai', '+9779841000004', 'pooja.r@example.test', 'Female', CURRENT_DATE - INTERVAL '5 days', '10:30:00', 'Completed', 'paid', 1200, 0, 'Pediatric Checkup', 30, 1200, 'Dr. Sarita Gurung', 'Chair 3'),
  ('00000000-0000-0000-0000-000000000604', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000505', 'Bikash Shahi', '+9779841000005', 'bikash.s@example.test', 'Male', CURRENT_DATE - INTERVAL '3 days', '16:00:00', 'Completed', 'paid', 3000, 0, 'Cavity Filling', 45, 3000, 'Dr. Anjali Shrestha', 'Chair 1'),
  -- Past, cancelled / no-show
  ('00000000-0000-0000-0000-000000000605', '00000000-0000-0000-0000-000000000101', NULL, '00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000503', 'Kiran Thapa', '+9779841000003', 'kiran.t@example.test', 'Male', CURRENT_DATE - INTERVAL '2 days', '12:00:00', 'Cancelled', 'unpaid', 8000, 0, 'Teeth Whitening', 60, 8000, 'Dr. Bishal Karki', NULL),
  ('00000000-0000-0000-0000-000000000606', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000506', 'Anita Tamang', '+9779841000006', 'anita.t@example.test', 'Female', CURRENT_DATE - INTERVAL '1 days', '09:30:00', 'No Show', 'unpaid', 1500, 0, 'Dental Cleaning', 30, 1500, 'Dr. Sarita Gurung', 'Chair 2'),
  -- Today
  ('00000000-0000-0000-0000-000000000607', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000507', 'Suraj Basnet', '+9779841000007', 'suraj.b@example.test', 'Male', CURRENT_DATE, '15:00:00', 'Confirmed', 'unpaid', 1500, 0, 'Dental Cleaning', 30, 1500, 'Dr. Anjali Shrestha', 'Chair 1'),
  -- Upcoming
  ('00000000-0000-0000-0000-000000000608', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000508', 'Manisha KC', '+9779841000008', 'manisha.k@example.test', 'Female', CURRENT_DATE + INTERVAL '2 days', '11:30:00', 'Confirmed', 'unpaid', 1000, 0, 'Braces Consultation', 30, 1000, 'Dr. Bishal Karki', 'Chair 3'),
  ('00000000-0000-0000-0000-000000000609', '00000000-0000-0000-0000-000000000101', NULL, '00000000-0000-0000-0000-000000000402', NULL, '00000000-0000-0000-0000-000000000501', 'Ramesh Adhikari', '+9779841000001', 'ramesh.a@example.test', 'Male', CURRENT_DATE + INTERVAL '4 days', '13:00:00', 'Pending', 'unpaid', 3000, 0, 'Cavity Filling', 45, 3000, NULL, NULL),
  ('00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000502', 'Sunita Maharjan', '+9779841000002', 'sunita.m@example.test', 'Female', CURRENT_DATE + INTERVAL '6 days', '10:00:00', 'Pending', 'unpaid', 12000, 0, 'Root Canal Treatment', 90, 12000, 'Dr. Sarita Gurung', 'Chair 2')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- A treatment note tied to one of the completed visits
INSERT INTO public.treatment_notes (id, booking_id, customer_id, dentist_id, note)
VALUES ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000302', 'Root canal completed successfully. Follow-up crown fitting recommended within 2 weeks.')
ON CONFLICT (id) DO UPDATE SET note = EXCLUDED.note;

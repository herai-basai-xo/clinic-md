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

-- ============================================
-- 004: Reference Data (Business Configuration)
-- Places → People → Times → Products
-- Managed by Admin app
-- ============================================

-- ==================
-- PLACES
-- ==================

-- Clinics / Locations
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  -- Address
  street_address TEXT,
  city TEXT NOT NULL,
  postal_code TEXT,
  country data_country NOT NULL,
  -- Contact
  phone TEXT,
  email TEXT,
  -- Metadata
  timezone TEXT NOT NULL DEFAULT 'Europe/Stockholm',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key to staff table
ALTER TABLE staff ADD CONSTRAINT staff_clinic_fk FOREIGN KEY (clinic_id) REFERENCES clinics(id);

-- ==================
-- SPECIALTIES & SKILLS (what can be done)
-- ==================

-- Specialties (categories of services)
CREATE TABLE specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  -- Localized names
  name_sv TEXT NOT NULL,
  name_no TEXT NOT NULL,
  name_da TEXT NOT NULL,
  name_en TEXT NOT NULL,
  -- Localized descriptions
  description_sv TEXT,
  description_no TEXT,
  description_da TEXT,
  description_en TEXT,
  -- Display
  icon TEXT, -- Font Awesome icon name
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Skills (what staff can do)
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialty_id UUID REFERENCES specialties(id),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  requires_certification BOOLEAN NOT NULL DEFAULT false,
  certification_validity_months INTEGER, -- NULL = never expires
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Staff skills (junction table)
CREATE TABLE staff_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  certified_at DATE,
  expires_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(staff_id, skill_id)
);

-- ==================
-- PRODUCTS (what is sold)
-- ==================

-- Services (the actual offerings)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialty_id UUID NOT NULL REFERENCES specialties(id),
  slug TEXT NOT NULL UNIQUE,
  -- Localized content
  name_sv TEXT NOT NULL,
  name_no TEXT NOT NULL,
  name_da TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_sv TEXT,
  description_no TEXT,
  description_da TEXT,
  description_en TEXT,
  short_description_sv TEXT,
  short_description_no TEXT,
  short_description_da TEXT,
  short_description_en TEXT,
  -- Pricing (per country)
  price_sek DECIMAL(10,2),
  price_nok DECIMAL(10,2),
  price_dkk DECIMAL(10,2),
  -- Delivery
  delivery_type delivery_type NOT NULL DEFAULT 'physical',
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  -- Requirements
  requires_skills UUID[] DEFAULT '{}', -- Array of skill IDs
  -- Publishing
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service inclusions (what lab tests etc. are included)
CREATE TABLE service_inclusions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  inclusion_type TEXT NOT NULL, -- 'lab_test', 'scan', 'consultation'
  inclusion_code TEXT NOT NULL, -- Lab test code, etc.
  inclusion_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Programs (subscription offerings)
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialty_id UUID NOT NULL REFERENCES specialties(id),
  slug TEXT NOT NULL UNIQUE,
  -- Localized content
  name_sv TEXT NOT NULL,
  name_no TEXT NOT NULL,
  name_da TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_sv TEXT,
  description_no TEXT,
  description_da TEXT,
  description_en TEXT,
  -- Pricing (monthly, per country)
  price_monthly_sek DECIMAL(10,2),
  price_monthly_nok DECIMAL(10,2),
  price_monthly_dkk DECIMAL(10,2),
  -- Duration
  duration_months INTEGER, -- NULL = ongoing
  -- Features
  features JSONB NOT NULL DEFAULT '[]',
  included_services UUID[] DEFAULT '{}', -- Array of service IDs
  -- Publishing
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Lab tests reference (for clinical configuration)
CREATE TABLE lab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  -- Localized names
  name_sv TEXT NOT NULL,
  name_no TEXT NOT NULL,
  name_da TEXT NOT NULL,
  name_en TEXT NOT NULL,
  -- Reference ranges (can vary by country/lab)
  unit TEXT NOT NULL,
  reference_low_male DECIMAL,
  reference_high_male DECIMAL,
  reference_low_female DECIMAL,
  reference_high_female DECIMAL,
  -- Metadata
  category TEXT, -- 'lipids', 'thyroid', 'metabolic', etc.
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================
-- TIMES (availability & scheduling)
-- ==================

-- Staff availability patterns
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES clinics(id), -- NULL = video only
  -- Weekly pattern
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  -- Type
  slot_type appointment_type NOT NULL DEFAULT 'physical',
  -- Validity
  valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Time slots (generated from availability, bookable)
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  -- Time
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  -- Type
  slot_type appointment_type NOT NULL,
  -- Service (optional - can be generic slot)
  service_id UUID REFERENCES services(id),
  -- Booking
  is_booked BOOLEAN NOT NULL DEFAULT false,
  booked_by_appointment_id UUID REFERENCES appointments(id),
  -- Metadata
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(staff_id, date, start_time)
);

-- ==================
-- ORDERS (Purchase flow)
-- ==================

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id UUID NOT NULL REFERENCES patient_identities(id),
  -- What was ordered
  service_id UUID REFERENCES services(id),
  program_id UUID REFERENCES programs(id),
  -- Pricing
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL, -- SEK, NOK, DKK
  -- Status
  status order_status NOT NULL DEFAULT 'pending',
  -- Payment (Stripe/Klarna - to be implemented)
  payment_provider TEXT,
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  -- Fulfillment
  clinic_id UUID REFERENCES clinics(id),
  appointment_id UUID REFERENCES appointments(id),
  -- Metadata
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Must have service or program
  CONSTRAINT order_has_item CHECK (service_id IS NOT NULL OR program_id IS NOT NULL)
);

-- Subscriptions (for programs)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id UUID NOT NULL REFERENCES patient_identities(id),
  program_id UUID NOT NULL REFERENCES programs(id),
  -- Status
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, cancelled, expired
  -- Billing
  amount_monthly DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  -- Timeline
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_start DATE NOT NULL DEFAULT CURRENT_DATE,
  current_period_end DATE NOT NULL,
  cancelled_at TIMESTAMPTZ,
  -- Payment
  payment_provider TEXT,
  payment_subscription_id TEXT,
  -- Metadata
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_clinics_country ON clinics(country);
CREATE INDEX idx_services_specialty ON services(specialty_id);
CREATE INDEX idx_services_published ON services(is_published) WHERE is_published = true;
CREATE INDEX idx_programs_specialty ON programs(specialty_id);
CREATE INDEX idx_programs_published ON programs(is_published) WHERE is_published = true;
CREATE INDEX idx_availability_staff ON availability(staff_id);
CREATE INDEX idx_time_slots_date ON time_slots(date);
CREATE INDEX idx_time_slots_available ON time_slots(date, slot_type) WHERE is_booked = false;
CREATE INDEX idx_orders_identity ON orders(identity_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_subscriptions_identity ON subscriptions(identity_id);

-- Triggers
CREATE TRIGGER clinics_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER specialties_updated_at BEFORE UPDATE ON specialties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER lab_tests_updated_at BEFORE UPDATE ON lab_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 002: Identity Vault (PII Zone)
-- Contains all personally identifiable information
-- ============================================

-- Core identity table (links to Supabase Auth)
CREATE TABLE identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  role identity_role NOT NULL,
  status identity_status NOT NULL DEFAULT 'pending',
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Patient PII (encrypted fields)
CREATE TABLE patient_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id UUID NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
  -- Encrypted fields (AES-256-GCM)
  first_name_encrypted TEXT NOT NULL,
  last_name_encrypted TEXT NOT NULL,
  personal_number_encrypted TEXT NOT NULL,
  email_encrypted TEXT,
  phone_encrypted TEXT,
  address_encrypted TEXT,
  -- Blind index for lookup (HMAC-SHA256)
  personal_number_hash TEXT NOT NULL UNIQUE,
  -- Plaintext (non-PII)
  country data_country NOT NULL,
  language VARCHAR(2) NOT NULL DEFAULT 'sv',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(identity_id)
);

-- Staff table
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id UUID NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
  -- PII
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  -- Role and assignment
  clinical_role clinical_role,
  admin_role admin_role,
  clinic_id UUID, -- Will reference clinics table
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(identity_id),
  -- Must have at least one role
  CONSTRAINT staff_has_role CHECK (clinical_role IS NOT NULL OR admin_role IS NOT NULL)
);

-- GDPR Consents (append-only audit log)
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identity_id UUID NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
  consent_type consent_type NOT NULL,
  granted BOOLEAN NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  data_country data_country NOT NULL,
  -- Append-only: no updates allowed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Care relationships (who can access whom)
CREATE TABLE care_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patient_identities(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'treating',
  is_active BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by UUID REFERENCES staff(id),
  expires_at TIMESTAMPTZ,
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(staff_id, patient_id)
);

-- Break-glass emergency access log
CREATE TABLE break_glass_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES staff(id),
  patient_id UUID NOT NULL REFERENCES patient_identities(id),
  reason TEXT NOT NULL,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  data_country data_country NOT NULL
);

-- Indexes
CREATE INDEX idx_identities_auth_id ON identities(supabase_auth_id);
CREATE INDEX idx_identities_role ON identities(role);
CREATE INDEX idx_patient_identities_hash ON patient_identities(personal_number_hash);
CREATE INDEX idx_staff_clinic ON staff(clinic_id);
CREATE INDEX idx_care_relationships_staff ON care_relationships(staff_id) WHERE is_active = true;
CREATE INDEX idx_care_relationships_patient ON care_relationships(patient_id) WHERE is_active = true;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER identities_updated_at BEFORE UPDATE ON identities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER patient_identities_updated_at BEFORE UPDATE ON patient_identities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at();

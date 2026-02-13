-- ============================================
-- 003: Clinical CDR (GDPR-Safe Zone)
-- No PII here - only clinical data
-- AI (Emma) can ONLY access these tables
-- ============================================

-- Clinical subjects (deidentified patient record)
CREATE TABLE clinical_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Only non-PII demographic data
  birth_year INTEGER, -- Not full DOB
  gender gender NOT NULL DEFAULT 'unknown',
  country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Link table (crown jewel - heavily protected)
-- This is the ONLY connection between identity and clinical data
CREATE TABLE identity_clinical_link (
  identity_id UUID NOT NULL REFERENCES patient_identities(id) ON DELETE CASCADE,
  clinical_id UUID NOT NULL REFERENCES clinical_subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (identity_id),
  UNIQUE (clinical_id)
);

-- Compositions (OpenEHR-style container for clinical events)
CREATE TABLE compositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinical_subject_id UUID NOT NULL REFERENCES clinical_subjects(id) ON DELETE CASCADE,
  archetype TEXT NOT NULL, -- e.g., 'blood_panel', 'dexa_scan', 'clinical_note'
  event_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'final', -- preliminary, final, amended
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blood panel observations
CREATE TABLE obs_blood_panel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  composition_id UUID NOT NULL REFERENCES compositions(id) ON DELETE CASCADE,
  test_code TEXT NOT NULL, -- e.g., 'HBA1C', 'TSH', 'CHOL'
  test_name TEXT NOT NULL,
  value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  reference_low DECIMAL,
  reference_high DECIMAL,
  flag obs_flag,
  lab_id TEXT, -- External lab reference
  collected_at TIMESTAMPTZ,
  analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- DEXA scan observations
CREATE TABLE obs_dexa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  composition_id UUID NOT NULL REFERENCES compositions(id) ON DELETE CASCADE,
  -- Body composition
  body_fat_percent DECIMAL,
  lean_mass_kg DECIMAL,
  fat_mass_kg DECIMAL,
  -- Bone density
  bone_density_total DECIMAL,
  bone_density_spine DECIMAL,
  bone_density_hip DECIMAL,
  t_score DECIMAL,
  z_score DECIMAL,
  -- Metadata
  scanner_id TEXT,
  scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vitals observations
CREATE TABLE obs_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  composition_id UUID NOT NULL REFERENCES compositions(id) ON DELETE CASCADE,
  vital_type TEXT NOT NULL, -- 'weight', 'height', 'blood_pressure', 'heart_rate'
  value_numeric DECIMAL,
  value_systolic DECIMAL, -- For blood pressure
  value_diastolic DECIMAL, -- For blood pressure
  unit TEXT NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clinical notes (SOAP format)
CREATE TABLE eval_clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  composition_id UUID NOT NULL REFERENCES compositions(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'progress', -- progress, consultation, discharge
  -- SOAP format
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  -- Author (staff_id, but we only store the ID, not PII)
  author_staff_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Care plans
CREATE TABLE eval_care_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinical_subject_id UUID NOT NULL REFERENCES clinical_subjects(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- 'weight_management', 'post_surgical', 'preventive'
  goals JSONB NOT NULL DEFAULT '[]',
  interventions JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, cancelled
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI-generated insights
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinical_subject_id UUID NOT NULL REFERENCES clinical_subjects(id) ON DELETE CASCADE,
  composition_id UUID REFERENCES compositions(id), -- Optional link to specific composition
  insight_type TEXT NOT NULL, -- 'result_interpretation', 'trend_analysis', 'recommendation'
  severity insight_severity NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  evidence JSONB, -- References to data points used
  status insight_status NOT NULL DEFAULT 'pending_review',
  reviewed_by UUID, -- staff_id who reviewed
  reviewed_at TIMESTAMPTZ,
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinical_subject_id UUID NOT NULL REFERENCES clinical_subjects(id) ON DELETE CASCADE,
  conversation_type conversation_type NOT NULL,
  current_actor conversation_actor NOT NULL DEFAULT 'ai',
  is_active BOOLEAN NOT NULL DEFAULT true,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type message_sender NOT NULL,
  sender_id UUID, -- staff_id if sender is staff
  content TEXT NOT NULL,
  metadata JSONB, -- For AI: model, tokens, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Appointments (clinical side - no PII)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinical_subject_id UUID NOT NULL REFERENCES clinical_subjects(id) ON DELETE CASCADE,
  appointment_type appointment_type NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  -- Location
  clinic_id UUID, -- NULL for video appointments
  room TEXT,
  video_room_url TEXT, -- For video appointments
  -- Staff
  assigned_staff_id UUID,
  -- Service
  service_id UUID,
  -- Metadata
  notes TEXT,
  data_country data_country NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_compositions_subject ON compositions(clinical_subject_id);
CREATE INDEX idx_compositions_archetype ON compositions(archetype);
CREATE INDEX idx_obs_blood_panel_composition ON obs_blood_panel(composition_id);
CREATE INDEX idx_obs_blood_panel_test ON obs_blood_panel(test_code);
CREATE INDEX idx_ai_insights_subject ON ai_insights(clinical_subject_id);
CREATE INDEX idx_ai_insights_status ON ai_insights(status);
CREATE INDEX idx_conversations_subject ON conversations(clinical_subject_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_appointments_subject ON appointments(clinical_subject_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX idx_appointments_staff ON appointments(assigned_staff_id);

-- Triggers
CREATE TRIGGER compositions_updated_at BEFORE UPDATE ON compositions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER eval_clinical_notes_updated_at BEFORE UPDATE ON eval_clinical_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER eval_care_plans_updated_at BEFORE UPDATE ON eval_care_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

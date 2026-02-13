-- ============================================
-- 001: Enum Types
-- Run this first in Supabase SQL Editor
-- ============================================

-- Data country (for multi-country support)
CREATE TYPE data_country AS ENUM ('SE', 'NO', 'DK');

-- Identity roles
CREATE TYPE identity_role AS ENUM ('patient', 'staff', 'admin');
CREATE TYPE identity_status AS ENUM ('active', 'inactive', 'pending');

-- Clinical staff roles
CREATE TYPE clinical_role AS ENUM (
  'doctor',
  'nurse',
  'dietician',
  'physiotherapist',
  'psychologist',
  'lab_technician'
);

-- Admin staff roles
CREATE TYPE admin_role AS ENUM (
  'staff_manager',
  'business_dev',
  'clinic_director'
);

-- Gender (for clinical records)
CREATE TYPE gender AS ENUM ('male', 'female', 'other', 'unknown');

-- Appointment types
CREATE TYPE appointment_type AS ENUM ('physical', 'video');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

-- Service delivery types
CREATE TYPE delivery_type AS ENUM ('physical', 'video', 'hybrid');

-- Order status
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'confirmed', 'fulfilled', 'cancelled', 'refunded');

-- Consent types
CREATE TYPE consent_type AS ENUM (
  'data_processing',
  'marketing',
  'research',
  'ai_analysis',
  'data_sharing'
);

-- Observation flags
CREATE TYPE obs_flag AS ENUM ('normal', 'low', 'high', 'critical_low', 'critical_high');

-- AI insight status
CREATE TYPE insight_status AS ENUM ('pending_review', 'approved', 'rejected', 'auto_approved');
CREATE TYPE insight_severity AS ENUM ('info', 'attention', 'warning', 'urgent');

-- Conversation types
CREATE TYPE conversation_type AS ENUM ('ai_chat', 'human_chat', 'video_consultation');
CREATE TYPE conversation_actor AS ENUM ('ai', 'human', 'hybrid');
CREATE TYPE message_sender AS ENUM ('patient', 'ai', 'staff');

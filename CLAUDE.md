# Panscan Platform — CLAUDE.md

> This file serves as both the build plan and instructions for Claude Code.
> If a session is interrupted, a new Claude instance should read this file to continue.


**PURPOSE: Professional Learning MVP**
- Build this like a real production system, not a throwaway prototype
- The goal is to **learn what decisions need to be made** along the way
- Document choices as they arise: product, business, and technical
- Quality matters — this code should be maintainable and extensible

---

## Decision Log

Track significant decisions as we build. Update this section when choices are made.

| Date | Category | Decision | Options Considered | Rationale |
|------|----------|----------|-------------------|-----------|
| 2026-02-13 | technical | 3 apps (patient, clinical, admin) | 2 apps, 3 apps | Clean data boundaries — admin never sees health data, clinical never sees business config |
| 2026-02-13 | technical | Clinical app owns clinical config | Admin owns all config, split config | Doctors configure medical things (lab codes, reference ranges), admins configure business things (products, prices) |

Categories: `product`, `business`, `technical`, `ux`, `security`

---

## Overview

Pan-Scandinavian digital health platform for Aleris. A general-purpose healthcare platform supporting multiple specialties:

- **Health tests** (seed use case) — Lab tests, DEXA scans
- **Plastic surgery** — Consultations, procedures
- **Ophthalmology** — Eye exams, treatments
- **Digital psychology** — Therapy sessions, mental health
- **Any other specialty** — Platform is extensible

### Why Health Tests First?

Health tests are the ideal seed because they demonstrate all three delivery modes:
1. **Physical meetings** — Visit clinic for blood draw, DEXA scan
2. **Digital meetings** — Video consultation for lifestyle advice, results review
3. **AI support** — Emma explains results, tracks progress between appointments

The architecture must be **specialty-agnostic** — products, skills, and scheduling work for any type of healthcare service.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Monorepo | Turborepo + npm workspaces |
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind |
| Database | Supabase (PostgreSQL + Auth + Realtime) |
| AI | Claude API (Emma health advisor) |
| Payments | Stripe + Klarna (later) |
| Languages | Swedish, Norwegian, Danish, English |
| Hosting | Vercel |

## Brand Tokens (Aleris Brand Guidelines 2025)

### Colors

| Token | Name | Hex | RGB | Use |
|-------|------|-----|-----|-----|
| `--color-petrol` | Petrol | #004851 | 0, 72, 81 | Primary text, headers, key elements |
| `--color-orange` | Orange | #F58C61 | 248, 124, 86 | Accents, CTAs, highlights |
| `--color-sand` | Sand | #F2ECE4 | 242, 236, 228 | Page backgrounds |
| `--color-petrol-80` | Petrol 80 | #4F868E | 79, 134, 142 | Secondary elements |
| `--color-petrol-60` | Petrol 60 | #7FA9AE | 127, 169, 174 | Subtle elements, borders |
| `--color-petrol-40` | Petrol 40 | #ABC7C9 | 171, 199, 201 | Light backgrounds |
| `--color-orange-80` | Orange 80 | #FFBE9F | 255, 190, 159 | Light accents |
| `--color-orange-60` | Orange 60 | #FAAA8D | 250, 170, 141 | Hover states |
| `--color-orange-40` | Orange 40 | #FBD1C0 | 251, 209, 192 | Very light accents |
| `--color-sand-100` | Sand 100 | #D9B48F | 217, 180, 143 | Warm details |
| `--color-sand-60` | Sand 60 | #E7CEB5 | 231, 206, 181 | Light warm backgrounds |
| `--color-slate` | Slate | #D7D2CB | 215, 210, 203 | Neutral backgrounds, dividers |

### Typography

- **Primary font:** Museo Sans (clean, geometric, warm)
- **Fallback font:** Arial (system font)
- **Rules:**
  - No ALL CAPS
  - No italics for emphasis
  - Minimum 8pt difference between heading levels
  - Design for 40+ audience readability
  - High contrast for accessibility

### Icons

- **Library:** Font Awesome v6
- **Weights:** Solid (emphasis), Regular (default), Light (subtle)
- **Style:** Clean, consistent, professional

### Design Principles

1. **Light backgrounds** — Sand (#F2ECE4) as primary background
2. **Petrol carries content** — Text, headings, important UI in Petrol
3. **Orange for action** — CTAs, highlights, interactive elements
4. **Circle as motif** — From the Aleris symbol, use for decorative elements
5. **Clean and calm** — Generous whitespace, clear hierarchy
6. **WCAG compliant** — 4.5:1 contrast for text, 3:1 for graphics
7. **4-6 colors max** — In any single view or visualization

## Core Architecture

### Split-Identity Model (Non-negotiable)

```
┌─────────────────────────┐          ┌─────────────────────────┐
│   IDENTITY VAULT        │          │   CLINICAL CDR          │
│   (PII Zone)            │          │   (GDPR-Safe Zone)      │
│                         │          │                         │
│   • patient_identities  │   link   │   • clinical_subjects   │
│   • staff               │◄────────►│   • obs_blood_panel     │
│   • consents            │          │   • obs_dexa            │
│   • orders              │          │   • appointments        │
│   • care_relationships  │          │   • conversations       │
│                         │          │   • ai_insights         │
└─────────────────────────┘          └─────────────────────────┘
         │                                      │
         │ identity_id ◄──────────────► clinical_id (opaque UUID)
         │                                      │
         │                                      ▼
         │                           ┌─────────────────────┐
         │                           │   AI ZONE           │
         │                           │   (Emma)            │
         │                           │   • age, gender     │
         │                           │   • lab values      │
         │                           │   • NO PII ever     │
         │                           └─────────────────────┘
         │
    ENCRYPTED: personal_number, phone, email, address
    BLIND INDEX: personal_number (HMAC-SHA256 for lookup)
```

### Database Roles

| Role | Access |
|------|--------|
| `identity_service` | Full access (apps server-side) |
| `clinical_service` | Clinical tables ONLY (AI service) |
| `audit_service` | Read-only audit logs |

## Actor Model

Each flow can have different **actors** driving the experience:

| Actor | Description |
|-------|-------------|
| **AI Agent** | Emma drives the flow autonomously (explains results, suggests next steps) |
| **Clinical Staff** | Human clinician leads (consultations, complex decisions) |
| **Hybrid** | Both available on same page — patient can switch or AI escalates |

### Appointment Types

| Type | Description |
|------|-------------|
| **Physical** | Patient visits clinic in person |
| **Video** | Virtual consultation (Whereby or similar) |

Both types flow through same booking system, just different delivery.

---

## Three Apps, Three Loops

### App Architecture

| App | Data Access | Never Touches |
|-----|-------------|---------------|
| **Admin** | Staff roster, products, schedules | Patient data, health records |
| **Clinical** | Patients (via care relationships), health data, clinical config | Product pricing, business config |
| **Patient** | Own identity, own health data | Other patients, admin/clinical config |

### Roles Within Each App

**Admin App Roles:**
- Staff Manager — manages people, schedules
- Business Dev — manages products, prices, categories
- Clinic Director — both

**Clinical App Roles:**
- Doctor
- Nurse
- Dietician
- Physiotherapist
- Psychologist
- Lab Technician
- (extensible)

**Patient App:**
- Patient (future: family member access?)

### The Three Loops

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN APP                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ BUSINESS LOOP                                                │   │
│  │ Products → Prices → Categories → Staff → Skills → Schedules │   │
│  │                           ↓                                  │   │
│  │                    [Publish to Patient app]                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                               ↓ published products & slots
┌─────────────────────────────────────────────────────────────────────┐
│                        PATIENT APP                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ PURCHASE LOOP                                                │   │
│  │ Browse → Select → Pay (Stripe/Klarna) → Order → Book slot   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                               ↓ appointment created                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ CARE LOOP (patient side)                                     │   │
│  │ Visit clinic → Results appear → AI explains → Chat Emma     │   │
│  │       ↑                                              ↓       │   │
│  │       └──────── Follow-up booking ←──────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                               ↕ appointments, results, notes
┌─────────────────────────────────────────────────────────────────────┐
│                       CLINICAL APP                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ CARE LOOP (clinical side)                                    │   │
│  │ Today's schedule → Patient arrives → Review results →       │   │
│  │ Write notes → Care plan → AI insights review                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ CLINICAL CONFIG                                              │   │
│  │ Lab test codes → Reference ranges → Clinical protocols       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow Details

**Patient App:**
```
Landing → Auth (BankID mock) → Dashboard
    ├── Browse packages → Purchase → Book (physical OR video)
    ├── View results (blood panel, DEXA)
    │   └── Actor: AI explains, human available if needed [HYBRID]
    ├── Chat with Emma (AI advisor)
    │   └── Actor: AI primary, escalate to human [HYBRID]
    └── Subscribe to programs
```

**Clinical App:**
```
Staff login → Dashboard (today's schedule: physical + video)
    ├── Patient list → Patient detail → Review results
    │   └── Actor: Staff with AI-prepared insights [HUMAN + AI SUPPORT]
    ├── AI insights queue → Review/approve
    ├── Consultations (physical or video) → Notes (SOAP)
    ├── Care plans → Create/update
    └── Clinical config: lab tests, reference ranges, protocols
```

**Admin App:**
```
Admin login → Management dashboard
    ├── Products: Create/edit health packages, programs
    ├── Categories: Specialties, service types
    ├── Pricing: Per-country pricing (SEK, NOK, DKK)
    ├── People: Staff roster, roles
    ├── Skills: What each staff member can do
    ├── Times: Availability, schedules (physical + video slots)
    └── Publish: Make products/times available to Patient app
```

## Project Structure

```
panscan/
├── apps/
│   ├── patient/                 # Patient-facing app (Next.js 15)
│   │   ├── src/app/[locale]/    # Locale-prefixed routes
│   │   │   ├── page.tsx         # Landing
│   │   │   ├── auth/            # BankID login
│   │   │   ├── dashboard/       # Patient home
│   │   │   ├── packages/        # Browse & select
│   │   │   ├── checkout/        # Payment
│   │   │   ├── booking/         # Clinic & time selection
│   │   │   ├── results/         # Lab results, DEXA
│   │   │   └── chat/            # Emma AI chat
│   │   └── src/app/api/         # API routes
│   │
│   ├── clinical/                # Clinical staff portal (Next.js 15)
│   │   ├── src/app/[locale]/
│   │   │   ├── page.tsx         # Dashboard (today's schedule)
│   │   │   ├── auth/            # Staff login
│   │   │   ├── patients/        # Patient list & detail
│   │   │   ├── appointments/    # Schedule view
│   │   │   ├── results/         # Results review queue
│   │   │   ├── notes/           # Clinical notes (SOAP)
│   │   │   ├── insights/        # AI insights review
│   │   │   └── config/          # Clinical configuration
│   │   │       ├── lab-tests/   # Test codes, reference ranges
│   │   │       └── protocols/   # Clinical protocols
│   │   └── src/app/api/
│   │
│   └── admin/                   # Business admin portal (Next.js 15)
│       ├── src/app/[locale]/
│       │   ├── page.tsx         # Dashboard
│       │   ├── auth/            # Admin login
│       │   ├── products/        # Packages, services
│       │   ├── categories/      # Specialties
│       │   ├── pricing/         # Per-country pricing
│       │   ├── people/          # Staff roster
│       │   ├── skills/          # Competencies
│       │   └── schedule/        # Availability, time slots
│       └── src/app/api/
│
├── packages/
│   ├── ui/                      # Shared components
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       └── index.ts
│   │
│   ├── db/                      # Database layer
│   │   └── src/
│   │       ├── client.ts        # Browser Supabase client
│   │       ├── server.ts        # Server client (full access)
│   │       ├── clinical.ts      # Clinical-only client (for AI)
│   │       ├── encryption.ts    # PII encryption (AES-256-GCM)
│   │       ├── patients.ts      # Patient CRUD
│   │       └── types.ts         # Generated from Supabase
│   │
│   ├── auth/                    # Auth utilities
│   │   └── src/
│   │       ├── types.ts         # Role types
│   │       ├── guards.ts        # Role checks
│   │       └── session.ts       # Session helpers
│   │
│   ├── ai/                      # AI layer
│   │   └── src/
│   │       ├── emma.ts          # Emma advisor
│   │       ├── deidentify.ts    # Prepare data for AI
│   │       └── guardrails.ts    # Safety checks
│   │
│   └── i18n/                    # Translations
│       ├── messages/
│       │   ├── sv.json
│       │   ├── no.json
│       │   ├── da.json
│       │   └── en.json
│       └── src/index.ts
│
├── supabase/
│   └── migrations/
│       ├── 001_types.sql
│       ├── 002_identity_vault.sql
│       ├── 003_clinical_cdr.sql
│       ├── 004_reference_data.sql
│       ├── 005_rls_policies.sql
│       └── 006_security.sql
│
├── package.json
├── turbo.json
└── tsconfig.json
```

## Database Schema

### Identity Vault (PII Zone)

```sql
-- Core identity (links to Supabase Auth)
identities (id, supabase_auth_id, role, status, data_country)

-- Patient PII (encrypted fields)
patient_identities (
  identity_id, first_name, last_name,
  personal_number_encrypted, personal_number_hash,
  email_encrypted, phone_encrypted,
  country, language
)

-- Staff PII
staff (identity_id, first_name, last_name, role, clinic_id)

-- GDPR consents (append-only)
consents (identity_id, consent_type, granted, granted_at)

-- Who can access whom
care_relationships (staff_id, patient_id, relationship_type, is_active)

-- Orders & subscriptions
orders (identity_id, package_id, status, amount, clinic_id, appointment_at)
subscriptions (identity_id, program_id, status, started_at)
```

### Clinical CDR (GDPR-Safe Zone)

```sql
-- Deidentified patient (age, gender, country only)
clinical_subjects (id, age, gender, country)

-- Link table (crown jewel, heavily protected)
identity_clinical_link (identity_id, clinical_id)

-- Clinical observations
compositions (clinical_subject_id, archetype, status)
obs_blood_panel (composition_id, test_code, value, unit, flag)
obs_dexa (composition_id, body_fat_percent, lean_mass_kg, bone_density)

-- Evaluations
eval_clinical_notes (composition_id, note_type, subjective, objective, assessment, plan)
eval_care_plans (clinical_subject_id, plan_type, goals, status)

-- Appointments & conversations
appointments (
  clinical_subject_id, scheduled_at, status,
  appointment_type: 'physical' | 'video',
  clinic_id,              -- NULL for video
  video_room_url,         -- NULL for physical
  assigned_staff_id
)
conversations (
  clinical_subject_id,
  type: 'ai_chat' | 'human_chat' | 'video_consultation',
  is_active,
  current_actor: 'ai' | 'human' | 'hybrid'  -- Who's driving
)
messages (conversation_id, sender_type: 'patient' | 'ai' | 'staff', content)

-- AI insights
ai_insights (clinical_subject_id, insight_type, severity, status)
```

### Reference Data (Clinic Management)

```sql
-- Clinics
clinics (id, name, city, country, timezone)

-- Specialties (extensible categories)
specialties (
  id, slug,
  name_sv, name_no, name_da, name_en,
  description_*,
  icon
)
-- Examples: 'health-tests', 'plastic-surgery', 'ophthalmology', 'psychology'

-- Services (generic products, any specialty)
services (
  id, specialty_id, slug,
  name_sv, name_no, name_da, name_en,
  description_*,
  price_sek, price_nok, price_dkk,
  duration_minutes,
  delivery_type: 'physical' | 'video' | 'hybrid',
  requires_skills: skill_id[],
  is_published
)
-- Examples: 'comprehensive-blood-panel', 'rhinoplasty-consultation', 'therapy-session'

-- Programs (subscription offerings)
programs (id, specialty_id, slug, name_*, price_*, features, includes_services: service_id[])

-- Lab tests (specific to health-tests specialty, but extensible pattern)
lab_tests (id, code, name_*, unit, reference_ranges)

-- Skills (what staff can do)
skills (
  id, specialty_id, slug,
  name, description,
  requires_certification: boolean
)
-- Examples: 'phlebotomy', 'dexa-operation', 'cbt-therapy', 'botox-injection'

staff_skills (staff_id, skill_id, certified_at, expires_at)

-- Availability & scheduling
availability (
  staff_id, clinic_id,
  day_of_week, start_time, end_time,
  slot_type: 'physical' | 'video' | 'both'
)
time_slots (
  clinic_id, date, start_time, end_time,
  staff_id, slot_type: 'physical' | 'video',
  service_id,  -- What service this slot is for (optional, can be generic)
  is_booked, booked_by_appointment_id
)
```

## Build Phases

### Phase 1: Foundation (Days 1-2)
- [x] Initialize Turborepo monorepo
- [x] Create `apps/patient`, `apps/clinical`, `apps/admin` (Next.js 15)
- [x] Create `packages/ui` with base components
- [x] Create `packages/db` with Supabase clients
- [x] Create `packages/i18n` with 4 languages
- [ ] Set up Supabase project
- [ ] Write migrations 001-004 (types, identity, clinical, reference)

### Phase 2: Auth & Security (Days 3-4)
- [ ] BankID mock auth flow
- [ ] Staff auth flow
- [ ] PII encryption module (AES-256-GCM)
- [ ] Blind index for personal number
- [ ] Write migrations 005-006 (RLS, security)
- [ ] Create `packages/auth`

### Phase 3: Clinic Management (Days 5-6)
- [ ] Products CRUD (packages, tests, programs)
- [ ] People CRUD (staff roster)
- [ ] Skills management
- [ ] Availability & scheduling
- [ ] Admin UI for all management

### Phase 4: Patient Flow (Days 7-9)
- [ ] Landing page with language selection
- [ ] Dashboard
- [ ] Package browsing (from clinic-published products)
- [ ] Checkout (mock Klarna)
- [ ] Booking (from clinic-published times)
- [ ] Results display

### Phase 5: Clinical Staff Flow (Days 10-11)
- [ ] Staff dashboard (today's schedule)
- [ ] Patient list with care relationships
- [ ] Patient detail view
- [ ] Results review queue
- [ ] Clinical notes (SOAP)

### Phase 6: AI Integration (Days 12-13)
- [ ] Create `packages/ai`
- [ ] Clinical-only database client
- [ ] Deidentification layer
- [ ] Emma advisor with Claude
- [ ] Guardrails (crisis detection, escalation)
- [ ] AI insights generation

### Phase 7: Polish & Deploy (Day 14)
- [ ] End-to-end testing
- [ ] Deploy to Vercel
- [ ] Environment variables configured
- [ ] Demo data seeded

## Verification

After each phase:
1. `npm run type-check` — All packages compile
2. `npm run build` — All 3 apps build
3. `npm run dev` — Apps run locally
4. Manual test of new features

Final verification:
1. Patient can: login → browse → book → see results → chat with Emma
2. Clinical staff can: login → see schedule → review patient → write notes → configure lab tests
3. Admin can: manage products → manage staff → set schedules → publish to patient app
4. Emma never sees PII (verify in logs)
5. Patients only see their own data (verify RLS)
6. Admin app cannot access patient health data (verify DB roles)

---

## Session Continuity

If you're a new Claude instance picking up this project:

1. **Read this file first** — It contains the full plan and architecture
2. **Check current progress** — Look at which phase tasks are marked `[x]` vs `[ ]`
3. **Examine existing code** — `ls -la` the project structure
4. **Continue from where we left off** — Pick up the next unchecked task

### Progress Tracking

Update this section as you complete work:

```
Current Phase: 1 - Foundation (nearly complete)
Last Completed Task: Supabase migrations run, code pushed to GitHub
Next Task: Deploy to Vercel (3 projects)
Blockers: None
GitHub: https://github.com/aleris-labs/panscan
```

### Key Commands

```bash
npm install          # Install dependencies
npm run dev          # Run both apps
npm run build        # Build all packages
npm run type-check   # TypeScript check
```

### Environment Variables Needed

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ENCRYPTION_MASTER_KEY=
```

---

## Coding Principles

1. **PII isolation is sacred** — AI code never imports identity-side modules
2. **data_country on all records** — Every insert includes the patient's country
3. **Translations required** — No hardcoded user-facing strings
4. **Type safety** — `npm run type-check` must pass before commits
5. **RLS always on** — Never bypass row-level security

## What NOT to Do

- Don't send PII to Claude/AI
- Don't bypass RLS with service role (except in specific server APIs)
- Don't hardcode text — use i18n
- Don't build features not in current phase
- Don't over-engineer — ship working code, iterate

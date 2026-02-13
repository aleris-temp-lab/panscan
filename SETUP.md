# Panscan Setup Guide

## 1. Supabase Database Setup

Run these SQL files **in order** in the Supabase SQL Editor:

1. **001_types.sql** — Enum types (run first)
2. **002_identity_vault.sql** — Identity tables (PII zone)
3. **003_clinical_cdr.sql** — Clinical tables (GDPR-safe zone)
4. **004_reference_data.sql** — Business config (Places, People, Times, Products)

### How to run:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy/paste each file's contents
5. Click **Run**

### After running migrations:
- You should have ~30+ tables
- Check the **Table Editor** to verify

---

## 2. Vercel Setup

### Create three projects (one per app):

| App | Directory | Port (local) |
|-----|-----------|--------------|
| patient | `apps/patient` | 3000 |
| clinical | `apps/clinical` | 3001 |
| admin | `apps/admin` | 3002 |

### For each project:

1. **Import from GitHub** (or connect your repo)

2. **Root Directory**: Set to the app folder
   - Patient: `apps/patient`
   - Clinical: `apps/clinical`
   - Admin: `apps/admin`

3. **Build Settings**:
   - Framework: Next.js
   - Build Command: `cd ../.. && npm install && npm run build --filter=@panscan/patient` (adjust filter for each app)
   - Output Directory: `.next`

4. **Environment Variables** (same for all three):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

### Alternative: Vercel Monorepo Setup

If you prefer a single Vercel project with multiple deployments:

1. Create project at root level
2. Use Vercel's monorepo detection
3. Configure multiple deployments in `vercel.json`:

```json
{
  "projects": [
    { "name": "panscan-patient", "root": "apps/patient" },
    { "name": "panscan-clinical", "root": "apps/clinical" },
    { "name": "panscan-admin", "root": "apps/admin" }
  ]
}
```

---

## 3. Environment Variables

### Required for all apps:

```bash
# Supabase (from your Supabase project settings)
NEXT_PUBLIC_SUPABASE_URL=https://ogphbjqxrwjqcsvbriys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Later: AI and Encryption
ANTHROPIC_API_KEY=sk-ant-...
ENCRYPTION_MASTER_KEY=<base64-encoded-32-byte-key>
```

### Where to find Supabase keys:
1. Supabase Dashboard → Project Settings → API
2. `NEXT_PUBLIC_SUPABASE_URL` = Project URL
3. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
4. `SUPABASE_SERVICE_ROLE_KEY` = service_role key (keep secret!)

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Run all apps
npm run dev

# Run specific app
npm run dev --filter=@panscan/patient
npm run dev --filter=@panscan/clinical
npm run dev --filter=@panscan/admin

# Build all
npm run build

# Type check
npm run type-check
```

### Local URLs:
- Patient: http://localhost:3000
- Clinical: http://localhost:3001
- Admin: http://localhost:3002

---

## 5. Recommended Domain Structure

For production:

| App | Domain |
|-----|--------|
| Patient | `health.aleris.se` (or similar) |
| Clinical | `clinical.aleris.se` |
| Admin | `admin.aleris.se` |

Or with subpaths on a single domain using Vercel rewrites.

---

## Next Steps After Setup

1. **Seed demo data** — Specialties, services, clinics
2. **Test the flows** — Visit each app, check translations
3. **Add auth** — BankID mock for patients, email/password for staff
4. **Connect to real Supabase** — Add env vars to Vercel

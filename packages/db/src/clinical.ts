/**
 * Clinical-only database client
 *
 * IMPORTANT: This client is used by AI services (Emma) and MUST NOT
 * have access to PII. It only connects to clinical tables.
 *
 * The clinical_service role in the database restricts access to:
 * - clinical_subjects
 * - compositions
 * - obs_* tables (observations)
 * - eval_* tables (evaluations)
 * - appointments (without PII)
 * - conversations & messages
 * - ai_insights
 *
 * It CANNOT access:
 * - patient_identities
 * - staff (with PII)
 * - identity_clinical_link (the mapping)
 * - orders (contains identity_id)
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Clinical-only queries for AI services
export function createClinicalClient() {
  // Note: In production, this would use a clinical_service role key
  // that only has access to clinical tables
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_CLINICAL_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Helper to fetch clinical data for a subject (used by Emma)
export async function getClinicalSubject(clinicalId: string) {
  const client = createClinicalClient()

  const { data, error } = await client
    .from('clinical_subjects')
    .select('*')
    .eq('id', clinicalId)
    .single()

  if (error) throw error
  return data
}

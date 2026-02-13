// Role types for the three apps
export type PatientRole = 'patient'

export type ClinicalRole =
  | 'doctor'
  | 'nurse'
  | 'dietician'
  | 'physiotherapist'
  | 'psychologist'
  | 'lab_technician'

export type AdminRole =
  | 'staff_manager'
  | 'business_dev'
  | 'clinic_director'

export type AppRole = PatientRole | ClinicalRole | AdminRole

// User session with role info
export interface UserSession {
  id: string
  email?: string
  role: AppRole
  clinicId?: string // For staff
  dataCountry: 'SE' | 'NO' | 'DK'
}

// Auth state
export interface AuthState {
  user: UserSession | null
  isLoading: boolean
  error: string | null
}

// Mock session management using cookies
// This will be replaced with Supabase Auth later

import { cookies } from 'next/headers'
import { demoPatients, demoStaff, findPatientByPersonalNumber, findStaffByEmail, isValidPersonalNumber } from './demo-users'
import type { DemoPatient, DemoStaff } from './demo-users'

const PATIENT_SESSION_COOKIE = 'panscan_patient_session'
const STAFF_SESSION_COOKIE = 'panscan_staff_session'

export interface PatientSession {
  type: 'patient'
  user: DemoPatient
  loginAt: string
}

export interface StaffSession {
  type: 'staff'
  user: DemoStaff
  loginAt: string
}

// Patient auth (BankID mock)
export async function loginPatient(personalNumber: string): Promise<{ success: boolean; error?: string }> {
  if (!isValidPersonalNumber(personalNumber)) {
    return { success: false, error: 'Invalid personal number format' }
  }

  // Find demo patient or create a temporary one
  let patient = findPatientByPersonalNumber(personalNumber)

  if (!patient) {
    // For demo: create a temporary patient for any valid personal number
    patient = {
      id: `patient-temp-${personalNumber}`,
      personalNumber: personalNumber.replace(/[\s-]/g, ''),
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      country: 'SE',
      language: 'sv',
    }
  }

  const session: PatientSession = {
    type: 'patient',
    user: patient,
    loginAt: new Date().toISOString(),
  }

  const cookieStore = await cookies()
  cookieStore.set(PATIENT_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return { success: true }
}

export async function logoutPatient(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(PATIENT_SESSION_COOKIE)
}

export async function getPatientSession(): Promise<PatientSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(PATIENT_SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value) as PatientSession
  } catch {
    return null
  }
}

// Staff auth (email/password mock)
export async function loginStaff(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Find demo staff
  let staff = findStaffByEmail(email)

  if (!staff) {
    // For demo: accept any email with @aleris domain
    if (email.endsWith('@aleris.se') || email.endsWith('@aleris.no') || email.endsWith('@aleris.dk')) {
      staff = {
        id: `staff-temp-${Date.now()}`,
        email,
        password: 'demo',
        firstName: 'Demo',
        lastName: 'Staff',
        role: 'doctor',
        clinicId: 'clinic-stockholm',
        clinicName: 'Aleris Stockholm City',
      }
    } else {
      return { success: false, error: 'Use an @aleris.se email for demo' }
    }
  }

  // In demo mode, accept any password
  const session: StaffSession = {
    type: 'staff',
    user: staff,
    loginAt: new Date().toISOString(),
  }

  const cookieStore = await cookies()
  cookieStore.set(STAFF_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return { success: true }
}

export async function logoutStaff(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(STAFF_SESSION_COOKIE)
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(STAFF_SESSION_COOKIE)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value) as StaffSession
  } catch {
    return null
  }
}

// Demo users for MVP demonstrations
// These simulate real users without needing Supabase Auth

export interface DemoPatient {
  id: string
  personalNumber: string
  firstName: string
  lastName: string
  email: string
  country: 'SE' | 'NO' | 'DK'
  language: 'sv' | 'no' | 'da' | 'en'
}

export interface DemoStaff {
  id: string
  email: string
  password: string // In demo, we accept any password
  firstName: string
  lastName: string
  role: 'doctor' | 'nurse' | 'dietician' | 'admin' | 'staff_manager'
  clinicId: string
  clinicName: string
}

export const demoPatients: DemoPatient[] = [
  {
    id: 'patient-anna',
    personalNumber: '199001011234',
    firstName: 'Anna',
    lastName: 'Andersson',
    email: 'anna.andersson@example.com',
    country: 'SE',
    language: 'sv',
  },
  {
    id: 'patient-erik',
    personalNumber: '198505152345',
    firstName: 'Erik',
    lastName: 'Svensson',
    email: 'erik.svensson@example.com',
    country: 'SE',
    language: 'sv',
  },
  {
    id: 'patient-ole',
    personalNumber: '12345678901', // Norwegian format
    firstName: 'Ole',
    lastName: 'Hansen',
    email: 'ole.hansen@example.com',
    country: 'NO',
    language: 'no',
  },
  {
    id: 'patient-mette',
    personalNumber: '1234567890', // Danish format
    firstName: 'Mette',
    lastName: 'Nielsen',
    email: 'mette.nielsen@example.com',
    country: 'DK',
    language: 'da',
  },
]

export const demoStaff: DemoStaff[] = [
  {
    id: 'staff-sara',
    email: 'doctor@aleris.se',
    password: 'demo',
    firstName: 'Sara',
    lastName: 'Lindqvist',
    role: 'doctor',
    clinicId: 'clinic-stockholm',
    clinicName: 'Aleris Stockholm City',
  },
  {
    id: 'staff-johan',
    email: 'nurse@aleris.se',
    password: 'demo',
    firstName: 'Johan',
    lastName: 'Berg',
    role: 'nurse',
    clinicId: 'clinic-stockholm',
    clinicName: 'Aleris Stockholm City',
  },
  {
    id: 'staff-emma',
    email: 'dietician@aleris.se',
    password: 'demo',
    firstName: 'Emma',
    lastName: 'Karlsson',
    role: 'dietician',
    clinicId: 'clinic-stockholm',
    clinicName: 'Aleris Stockholm City',
  },
  {
    id: 'staff-maria',
    email: 'admin@aleris.se',
    password: 'demo',
    firstName: 'Maria',
    lastName: 'Johansson',
    role: 'admin',
    clinicId: 'clinic-stockholm',
    clinicName: 'Aleris Stockholm City',
  },
  {
    id: 'staff-anders',
    email: 'manager@aleris.se',
    password: 'demo',
    firstName: 'Anders',
    lastName: 'Nilsson',
    role: 'staff_manager',
    clinicId: 'clinic-stockholm',
    clinicName: 'Aleris Stockholm City',
  },
]

// Lookup functions
export function findPatientByPersonalNumber(personalNumber: string): DemoPatient | undefined {
  // Remove any formatting (spaces, dashes)
  const cleaned = personalNumber.replace(/[\s-]/g, '')
  return demoPatients.find(p => p.personalNumber === cleaned)
}

export function findStaffByEmail(email: string): DemoStaff | undefined {
  return demoStaff.find(s => s.email.toLowerCase() === email.toLowerCase())
}

// For demo: accept any valid-looking personal number
export function isValidPersonalNumber(pn: string): boolean {
  const cleaned = pn.replace(/[\s-]/g, '')
  // Swedish: 12 digits (YYYYMMDDXXXX) or 10 digits (YYMMDDXXXX)
  // Norwegian: 11 digits
  // Danish: 10 digits
  return /^\d{10,12}$/.test(cleaned)
}

import { redirect, notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../../dashboard/logout-button'

// Demo patient data
const patientsData: Record<string, {
  id: string
  name: string
  age: number
  gender: string
  email: string
  phone: string
  conditions: string[]
  appointments: { date: string; type: string; status: string }[]
  results: { id: string; date: string; type: string; summary: string }[]
  notes: { date: string; author: string; content: string }[]
}> = {
  'patient-1': {
    id: 'patient-1',
    name: 'Anna Andersson',
    age: 36,
    gender: 'Female',
    email: 'anna.a***@email.se',
    phone: '+46 70 *** ** 34',
    conditions: ['Annual checkup'],
    appointments: [
      { date: '2026-02-18 09:30', type: 'Blood Panel Review', status: 'scheduled' },
      { date: '2026-02-01 10:00', type: 'Comprehensive Blood Panel', status: 'completed' },
      { date: '2025-08-15 14:00', type: 'Annual Checkup', status: 'completed' },
    ],
    results: [
      { id: 'r1', date: '2026-02-01', type: 'Comprehensive Blood Panel', summary: 'All markers normal' },
      { id: 'r2', date: '2025-08-15', type: 'Basic Blood Panel', summary: 'Slight vitamin D deficiency' },
    ],
    notes: [
      { date: '2026-02-01', author: 'Dr. Sara Lindqvist', content: 'Patient presents with excellent overall health. Blood panel shows improvement in vitamin D levels since last visit. Recommend continuing current supplement regimen.' },
      { date: '2025-08-15', author: 'Dr. Sara Lindqvist', content: 'Annual checkup completed. Vitamin D slightly low at 38 nmol/L. Recommended 2000 IU daily supplementation.' },
    ],
  },
  'patient-2': {
    id: 'patient-2',
    name: 'Erik Svensson',
    age: 41,
    gender: 'Male',
    email: 'erik.s***@email.se',
    phone: '+46 73 *** ** 56',
    conditions: ['Weight management', 'Pre-diabetes monitoring'],
    appointments: [
      { date: '2026-02-20 11:00', type: 'DEXA Follow-up', status: 'scheduled' },
      { date: '2026-01-15 09:00', type: 'DEXA Scan', status: 'completed' },
    ],
    results: [
      { id: 'r3', date: '2026-01-15', type: 'DEXA Body Scan', summary: 'Body fat 24.5%, visceral fat elevated' },
      { id: 'r4', date: '2026-01-15', type: 'Blood Panel', summary: 'HbA1c 5.9% - borderline' },
    ],
    notes: [
      { date: '2026-01-15', author: 'Dr. Sara Lindqvist', content: 'DEXA results show elevated visceral fat. HbA1c at 5.9% indicates pre-diabetic state. Referred to dietician. Follow-up in 5 weeks to assess progress.' },
    ],
  },
  'patient-4': {
    id: 'patient-4',
    name: 'Lars Nilsson',
    age: 45,
    gender: 'Male',
    email: 'lars.n***@email.se',
    phone: '+46 70 *** ** 78',
    conditions: ['Cardiovascular risk assessment'],
    appointments: [
      { date: '2026-02-25 10:00', type: 'Cardio Consultation', status: 'scheduled' },
      { date: '2026-02-13 08:30', type: 'Blood Panel', status: 'completed' },
    ],
    results: [
      { id: 'r5', date: '2026-02-13', type: 'Comprehensive Blood Panel', summary: 'LDL elevated, requires review' },
    ],
    notes: [],
  },
  'patient-3': {
    id: 'patient-3',
    name: 'Maria Johansson',
    age: 52,
    gender: 'Female',
    email: 'maria.j***@email.se',
    phone: '+46 76 *** ** 12',
    conditions: ['Thyroid monitoring', 'Menopause management'],
    appointments: [
      { date: '2026-02-22 14:00', type: 'Follow-up', status: 'scheduled' },
      { date: '2026-01-10 10:00', type: 'Thyroid Panel', status: 'completed' },
    ],
    results: [
      { id: 'r6', date: '2026-01-10', type: 'Thyroid Panel', summary: 'TSH slightly elevated, T4 normal' },
      { id: 'r7', date: '2025-10-05', type: 'Hormone Panel', summary: 'Estrogen levels declining, consistent with perimenopause' },
    ],
    notes: [
      { date: '2026-01-10', author: 'Dr. Magnus Eriksson', content: 'TSH at 4.8 mIU/L, slightly above optimal. T4 within normal range. Continue monitoring, retest in 3 months. Discussed lifestyle factors.' },
    ],
  },
  'patient-5': {
    id: 'patient-5',
    name: 'Karin Berg',
    age: 29,
    gender: 'Female',
    email: 'karin.b***@email.se',
    phone: '+46 72 *** ** 89',
    conditions: ['Preventive health', 'Fitness optimization'],
    appointments: [
      { date: '2026-02-28 15:00', type: 'Hormone Panel Review', status: 'scheduled' },
      { date: '2026-02-05 09:00', type: 'DEXA Scan', status: 'completed' },
    ],
    results: [
      { id: 'r8', date: '2026-02-05', type: 'DEXA Body Scan', summary: 'Body fat 18.2%, excellent lean mass' },
      { id: 'r9', date: '2026-02-05', type: 'Female Hormone Panel', summary: 'All markers optimal' },
    ],
    notes: [
      { date: '2026-02-05', author: 'Emma Karlsson', content: 'Patient is highly health-conscious, competitive amateur athlete. DEXA shows excellent body composition. Discussed protein intake optimization for muscle recovery.' },
    ],
  },
  'patient-6': {
    id: 'patient-6',
    name: 'Johan Lindström',
    age: 58,
    gender: 'Male',
    email: 'johan.l***@email.se',
    phone: '+46 70 *** ** 45',
    conditions: ['Executive health program', 'Stress management'],
    appointments: [
      { date: '2026-03-01 11:30', type: 'Executive Health Review', status: 'scheduled' },
      { date: '2026-01-20 08:00', type: 'Executive Health Check', status: 'completed' },
    ],
    results: [
      { id: 'r10', date: '2026-01-20', type: 'Executive Health Check', summary: 'Overall good health, cortisol elevated' },
      { id: 'r11', date: '2026-01-20', type: 'Comprehensive Blood Panel', summary: 'All markers within range' },
    ],
    notes: [
      { date: '2026-01-20', author: 'Dr. Sara Lindqvist', content: 'Executive health check completed. Blood markers excellent for age. Cortisol levels suggest chronic stress. Discussed work-life balance and referred to wellness program.' },
    ],
  },
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const session = await getStaffSession()
  if (!session) {
    redirect('/auth/login')
  }

  const patient = patientsData[id]
  if (!patient) {
    notFound()
  }

  const t = await getTranslations('clinical.patientDetail')
  const { user } = session

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-petrol text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Logo width={100} height={36} variant="white" />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher variant="dark" />
            <span className="text-petrol-40">
              {user.firstName} {user.lastName}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/patients" className="text-petrol-60 hover:text-petrol">
            ← {t('backToPatients')}
          </Link>
        </nav>

        {/* Patient Header */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-petrol-20 rounded-full flex items-center justify-center">
                <span className="text-petrol text-xl font-medium">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-petrol">{patient.name}</h1>
                <p className="text-petrol-60">
                  {patient.age} {t('years')} • {patient.gender}
                </p>
                <div className="flex gap-2 mt-2">
                  {patient.conditions.map((condition, i) => (
                    <span key={i} className="px-2 py-1 bg-sand text-petrol text-sm rounded">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/consultation/${patient.id}`}
                className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-80 transition-colors"
              >
                📹 {t('startVideoCall')}
              </Link>
              <button className="px-4 py-2 border border-petrol text-petrol rounded-lg hover:bg-sand transition-colors">
                {t('addNote')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Results */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-petrol mb-4">{t('recentResults')}</h2>
              {patient.results.length > 0 ? (
                <div className="space-y-3">
                  {patient.results.map((result) => (
                    <div key={result.id} className="p-4 bg-sand rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-petrol">{result.type}</p>
                        <p className="text-sm text-petrol-60">{result.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-petrol">{result.summary}</p>
                        <Link href={`/results/${result.id}`} className="text-sm text-orange hover:text-orange-80">
                          {t('viewDetails')} →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-petrol-60">{t('noResults')}</p>
              )}
            </div>

            {/* Clinical Notes */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-petrol mb-4">{t('clinicalNotes')}</h2>
              {patient.notes.length > 0 ? (
                <div className="space-y-4">
                  {patient.notes.map((note, i) => (
                    <div key={i} className="border-l-4 border-petrol pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-petrol">{note.author}</span>
                        <span className="text-petrol-60 text-sm">• {note.date}</span>
                      </div>
                      <p className="text-petrol">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-petrol-60">{t('noNotes')}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-petrol mb-4">{t('contactInfo')}</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-petrol-60">{t('email')}</p>
                  <p className="text-petrol">{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm text-petrol-60">{t('phone')}</p>
                  <p className="text-petrol">{patient.phone}</p>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-petrol mb-4">{t('appointments')}</h2>
              <div className="space-y-3">
                {patient.appointments.map((apt, i) => (
                  <div key={i} className="p-3 bg-sand rounded-lg">
                    <p className="font-medium text-petrol">{apt.type}</p>
                    <p className="text-sm text-petrol-60">{apt.date}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      apt.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

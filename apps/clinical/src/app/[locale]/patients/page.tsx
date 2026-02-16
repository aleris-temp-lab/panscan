import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../dashboard/logout-button'
import { PatientSearch } from './patient-search'

// Demo patients data
const patients = [
  {
    id: 'patient-1',
    name: 'Anna Andersson',
    age: 36,
    lastVisit: '2026-02-01',
    nextAppointment: '2026-02-18',
    status: 'active',
    conditions: ['Annual checkup'],
  },
  {
    id: 'patient-2',
    name: 'Erik Svensson',
    age: 41,
    lastVisit: '2026-01-15',
    nextAppointment: '2026-02-20',
    status: 'active',
    conditions: ['Weight management', 'Pre-diabetes monitoring'],
  },
  {
    id: 'patient-3',
    name: 'Maria Johansson',
    age: 52,
    lastVisit: '2026-02-10',
    nextAppointment: null,
    status: 'active',
    conditions: ['Thyroid monitoring'],
  },
  {
    id: 'patient-4',
    name: 'Lars Nilsson',
    age: 45,
    lastVisit: '2026-02-13',
    nextAppointment: '2026-02-25',
    status: 'pending-review',
    conditions: ['Cardiovascular risk assessment'],
  },
  {
    id: 'patient-5',
    name: 'Karin Berg',
    age: 29,
    lastVisit: '2025-12-20',
    nextAppointment: null,
    status: 'active',
    conditions: ['Hormone panel follow-up'],
  },
  {
    id: 'patient-6',
    name: 'Johan Lindström',
    age: 58,
    lastVisit: '2026-02-05',
    nextAppointment: '2026-03-05',
    status: 'active',
    conditions: ['Executive health program'],
  },
]

export default async function PatientsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getStaffSession()
  if (!session) {
    redirect('/auth/login')
  }

  const t = await getTranslations('clinical.patients')
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

      {/* Sub Navigation */}
      <nav className="bg-white border-b border-slate">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <Link href="/dashboard" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.dashboard')}
            </Link>
            <Link href="/patients" className="py-4 text-petrol border-b-2 border-petrol font-medium">
              {t('nav.patients')}
            </Link>
            <Link href="/appointments" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.appointments')}
            </Link>
            <Link href="/results" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.results')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-petrol">{t('title')}</h1>
          <PatientSearch placeholder={t('searchPlaceholder')} />
        </div>

        {/* Patient List */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-sand">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-petrol">{t('table.patient')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-petrol">{t('table.age')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-petrol">{t('table.lastVisit')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-petrol">{t('table.nextAppointment')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-petrol">{t('table.status')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-petrol">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-sand transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-petrol-20 rounded-full flex items-center justify-center">
                        <span className="text-petrol font-medium">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-petrol">{patient.name}</p>
                        <p className="text-sm text-petrol-60">{patient.conditions.join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-petrol">{patient.age}</td>
                  <td className="px-6 py-4 text-petrol">{patient.lastVisit}</td>
                  <td className="px-6 py-4 text-petrol">
                    {patient.nextAppointment || <span className="text-petrol-60">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      patient.status === 'pending-review'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {patient.status === 'pending-review' ? t('status.pendingReview') : t('status.active')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/patients/${patient.id}`}
                        className="px-3 py-1 bg-petrol text-white text-sm rounded hover:bg-petrol-80 transition-colors"
                      >
                        {t('view')}
                      </Link>
                      <Link
                        href={`/consultation/${patient.id}`}
                        className="px-3 py-1 border border-petrol text-petrol text-sm rounded hover:bg-sand transition-colors"
                      >
                        📹
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

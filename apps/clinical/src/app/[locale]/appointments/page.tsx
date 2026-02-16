import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../dashboard/logout-button'

// Demo appointments data
const appointments = [
  {
    id: '1',
    time: '08:30',
    patient: { id: 'patient-4', name: 'Lars Nilsson', initials: 'LN' },
    type: 'Blood Panel',
    status: 'completed',
    isVideo: false,
  },
  {
    id: '2',
    time: '09:00',
    patient: { id: 'patient-1', name: 'Anna Andersson', initials: 'AA' },
    type: 'Blood Panel Review',
    status: 'in-progress',
    isVideo: false,
  },
  {
    id: '3',
    time: '10:30',
    patient: { id: 'patient-2', name: 'Erik Svensson', initials: 'ES' },
    type: 'DEXA Consultation',
    status: 'scheduled',
    isVideo: true,
  },
  {
    id: '4',
    time: '11:30',
    patient: { id: 'patient-6', name: 'Johan Lindström', initials: 'JL' },
    type: 'Executive Health Review',
    status: 'scheduled',
    isVideo: true,
  },
  {
    id: '5',
    time: '14:00',
    patient: { id: 'patient-3', name: 'Maria Johansson', initials: 'MJ' },
    type: 'Follow-up',
    status: 'scheduled',
    isVideo: false,
  },
  {
    id: '6',
    time: '15:00',
    patient: { id: 'patient-5', name: 'Karin Berg', initials: 'KB' },
    type: 'Hormone Panel Review',
    status: 'scheduled',
    isVideo: true,
  },
]

export default async function AppointmentsPage({
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

  const t = await getTranslations('clinical.appointments')
  const { user } = session

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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
            <Link href="/patients" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.patients')}
            </Link>
            <Link href="/appointments" className="py-4 text-petrol border-b-2 border-petrol font-medium">
              {t('nav.appointments')}
            </Link>
            <Link href="/results" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.results')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-petrol">{t('title')}</h1>
            <p className="text-petrol-60">{today}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate rounded-lg text-petrol hover:bg-sand transition-colors">
              ← {t('previous')}
            </button>
            <button className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors">
              {t('today')}
            </button>
            <button className="px-4 py-2 bg-white border border-slate rounded-lg text-petrol hover:bg-sand transition-colors">
              {t('next')} →
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="divide-y divide-slate">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 flex items-center gap-4 hover:bg-sand transition-colors">
                {/* Time */}
                <div className="w-20 text-right">
                  <p className="text-lg font-semibold text-petrol">{apt.time}</p>
                </div>

                {/* Status indicator */}
                <div className={`w-3 h-3 rounded-full ${
                  apt.status === 'completed' ? 'bg-green-500' :
                  apt.status === 'in-progress' ? 'bg-orange animate-pulse' :
                  'bg-petrol-40'
                }`} />

                {/* Patient info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-petrol-20 rounded-full flex items-center justify-center">
                    <span className="text-petrol font-medium text-sm">{apt.patient.initials}</span>
                  </div>
                  <div>
                    <p className="font-medium text-petrol">{apt.patient.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-petrol-60">{apt.type}</p>
                      {apt.isVideo && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          📹 Video
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`px-3 py-1 text-sm rounded-full ${
                  apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                  'bg-petrol-20 text-petrol'
                }`}>
                  {apt.status === 'completed' ? t('status.completed') :
                   apt.status === 'in-progress' ? t('status.inProgress') :
                   t('status.scheduled')}
                </span>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/patients/${apt.patient.id}`}
                    className="px-3 py-1 bg-petrol text-white text-sm rounded hover:bg-petrol-80 transition-colors"
                  >
                    {t('view')}
                  </Link>
                  {apt.isVideo && apt.status === 'scheduled' && (
                    <Link
                      href={`/consultation/${apt.patient.id}`}
                      className="px-3 py-1 bg-orange text-white text-sm rounded hover:bg-orange-80 transition-colors"
                    >
                      {t('startCall')}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">{appointments.length}</p>
            <p className="text-petrol-60 text-sm">{t('totalAppointments')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'completed').length}
            </p>
            <p className="text-petrol-60 text-sm">{t('completed')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {appointments.filter(a => a.isVideo).length}
            </p>
            <p className="text-petrol-60 text-sm">{t('videoConsultations')}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

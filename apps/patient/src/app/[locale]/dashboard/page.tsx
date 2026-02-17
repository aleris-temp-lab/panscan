import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPatientSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { LogoutButton } from './logout-button'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { ClickableLogo } from '@panscan/ui'

export default async function PatientDashboard({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getPatientSession()
  if (!session) {
    redirect('/auth/login')
  }

  const t = await getTranslations('patient.dashboard')
  const { user } = session

  // Demo data for appointments
  const upcomingAppointments = [
    {
      id: '1',
      type: 'Blood Panel',
      date: '2026-02-18',
      time: '09:30',
      clinic: 'Aleris Stockholm City',
    },
    {
      id: '2',
      type: 'DEXA Scan',
      date: '2026-02-25',
      time: '14:00',
      clinic: 'Aleris Stockholm City',
    },
  ]

  // Demo data for results
  const recentResults = [
    {
      id: '1',
      type: 'Comprehensive Blood Panel',
      date: '2026-02-01',
      status: 'ready',
    },
  ]

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-white border-b border-slate">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <ClickableLogo width={100} height={36} />
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <span className="text-petrol-60">{user.firstName} {user.lastName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Greeting */}
        <h1 className="text-3xl font-bold text-petrol mb-8">
          {t('greeting', { name: user.firstName })}
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('upcomingAppointments')}
            </h2>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-sand rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-petrol">{apt.type}</p>
                      <p className="text-sm text-petrol-60">{apt.clinic}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-petrol">{apt.date}</p>
                      <p className="text-sm text-petrol-60">{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-petrol-60">{t('noAppointments')}</p>
            )}
            <Link
              href="/booking"
              className="mt-4 inline-block text-orange font-medium hover:text-orange-80"
            >
              + {t('bookAppointment')}
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('quickActions')}
            </h2>
            <div className="space-y-3">
              <Link
                href="/chat"
                className="block p-4 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors"
              >
                <span className="font-medium">💬 {t('chatWithEmma')}</span>
                <p className="text-sm text-petrol-40 mt-1">AI health advisor</p>
              </Link>
              <Link
                href="/packages"
                className="block p-4 bg-sand text-petrol rounded-lg hover:bg-slate transition-colors"
              >
                <span className="font-medium">📦 {t('browsePackages')}</span>
              </Link>
              <Link
                href="/profile"
                className="block p-4 bg-sand text-petrol rounded-lg hover:bg-slate transition-colors"
              >
                <span className="font-medium">👤 {t('myProfile')}</span>
              </Link>
            </div>
          </div>

          {/* Recent Results */}
          <div className="md:col-span-3 bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('recentResults')}
            </h2>
            {recentResults.length > 0 ? (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/results/${result.id}`}
                    className="flex items-center justify-between p-4 bg-sand rounded-lg hover:bg-slate transition-colors"
                  >
                    <div>
                      <p className="font-medium text-petrol">{result.type}</p>
                      <p className="text-sm text-petrol-60">{result.date}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Ready
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-petrol-60">{t('noResults')}</p>
            )}
            <Link
              href="/results"
              className="mt-4 inline-block text-orange font-medium hover:text-orange-80"
            >
              {t('viewAllResults')} →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

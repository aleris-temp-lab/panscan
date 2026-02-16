import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { LogoutButton } from './logout-button'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Logo } from '@panscan/ui'

export default async function ClinicalDashboard({
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

  const t = await getTranslations('clinical.dashboard')
  const { user } = session

  // Demo data for today's appointments
  const todayAppointments = [
    {
      id: '1',
      patientName: 'Anna Andersson',
      type: 'Blood Panel Review',
      time: '09:00',
      status: 'waiting',
    },
    {
      id: '2',
      patientName: 'Erik Svensson',
      type: 'DEXA Consultation',
      time: '10:30',
      status: 'scheduled',
    },
    {
      id: '3',
      patientName: 'Maria Johansson',
      type: 'Follow-up',
      time: '14:00',
      status: 'scheduled',
    },
  ]

  // Demo data for pending reviews
  const pendingReviews = [
    {
      id: '1',
      patientName: 'Anna Andersson',
      type: 'Blood Panel',
      date: '2026-02-14',
      priority: 'high',
    },
    {
      id: '2',
      patientName: 'Lars Nilsson',
      type: 'DEXA Scan',
      date: '2026-02-13',
      priority: 'normal',
    },
  ]

  // Demo data for AI insights
  const aiInsights = [
    {
      id: '1',
      patientName: 'Anna Andersson',
      insight: 'Elevated HbA1c trend detected',
      severity: 'warning',
    },
  ]

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
              {user.firstName} {user.lastName} ({user.role})
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Greeting */}
        <h1 className="text-3xl font-bold text-petrol mb-8">
          {t('greeting', { name: user.firstName })}
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('todaySchedule')}
            </h2>
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-sand rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-petrol-20 rounded-full flex items-center justify-center">
                        <span className="text-petrol font-medium">
                          {apt.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-petrol">{apt.patientName}</p>
                        <p className="text-sm text-petrol-60">{apt.type}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="font-medium text-petrol">{apt.time}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            apt.status === 'waiting'
                              ? 'bg-orange text-white'
                              : 'bg-petrol-20 text-petrol'
                          }`}
                        >
                          {apt.status === 'waiting' ? t('waiting') : t('scheduled')}
                        </span>
                      </div>
                      <Link
                        href={`/patients/${apt.id}`}
                        className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors"
                      >
                        {t('open')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-petrol-60">{t('noAppointments')}</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('quickActions')}
            </h2>
            <div className="space-y-3">
              <Link
                href="/patients"
                className="block p-4 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors"
              >
                <span className="font-medium">{t('patientList')}</span>
              </Link>
              <Link
                href="/results"
                className="block p-4 bg-sand text-petrol rounded-lg hover:bg-slate transition-colors"
              >
                <span className="font-medium">{t('resultsReview')}</span>
              </Link>
              <Link
                href="/appointments"
                className="block p-4 bg-sand text-petrol rounded-lg hover:bg-slate transition-colors"
              >
                <span className="font-medium">{t('appointments')}</span>
              </Link>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('pendingReviews')}
            </h2>
            {pendingReviews.length > 0 ? (
              <div className="space-y-3">
                {pendingReviews.map((review) => (
                  <Link
                    key={review.id}
                    href={`/results/${review.id}`}
                    className="block p-4 bg-sand rounded-lg hover:bg-slate transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-petrol">{review.patientName}</p>
                        <p className="text-sm text-petrol-60">{review.type}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          review.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-petrol-20 text-petrol'
                        }`}
                      >
                        {review.priority === 'high' ? t('highPriority') : t('normal')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-petrol-60">{t('noPendingReviews')}</p>
            )}
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('aiInsights')}
            </h2>
            {aiInsights.length > 0 ? (
              <div className="space-y-3">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="flex items-center justify-between p-4 bg-orange-10 border border-orange rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">!</span>
                      </div>
                      <div>
                        <p className="font-medium text-petrol">{insight.patientName}</p>
                        <p className="text-sm text-petrol-80">{insight.insight}</p>
                      </div>
                    </div>
                    <Link
                      href={`/insights/${insight.id}`}
                      className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-80 transition-colors"
                    >
                      {t('review')}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-petrol-60">{t('noInsights')}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../dashboard/logout-button'

// Demo results awaiting review
const pendingResults = [
  {
    id: 'r-pending-1',
    patient: { id: 'patient-4', name: 'Lars Nilsson', initials: 'LN' },
    type: 'Comprehensive Blood Panel',
    date: '2026-02-13',
    priority: 'high',
    flags: ['LDL elevated', 'Triglycerides borderline'],
    aiSummary: 'Patient shows elevated LDL cholesterol (4.2 mmol/L) and borderline triglycerides. Recommend lifestyle discussion and potential statin therapy consideration.',
  },
  {
    id: 'r-pending-2',
    patient: { id: 'patient-2', name: 'Erik Svensson', initials: 'ES' },
    type: 'DEXA Body Scan',
    date: '2026-02-12',
    priority: 'normal',
    flags: ['Visceral fat elevated'],
    aiSummary: 'Visceral fat measurement at 1.2 kg, above optimal range. Patient already in weight management program. Progress noted since last scan.',
  },
]

const recentlyReviewed = [
  {
    id: 'r-reviewed-1',
    patient: { id: 'patient-1', name: 'Anna Andersson', initials: 'AA' },
    type: 'Comprehensive Blood Panel',
    date: '2026-02-01',
    reviewedBy: 'Dr. Sara Lindqvist',
    reviewedAt: '2026-02-02',
  },
  {
    id: 'r-reviewed-2',
    patient: { id: 'patient-3', name: 'Maria Johansson', initials: 'MJ' },
    type: 'Thyroid Panel',
    date: '2026-02-10',
    reviewedBy: 'Dr. Sara Lindqvist',
    reviewedAt: '2026-02-11',
  },
]

export default async function ResultsReviewPage({
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

  const t = await getTranslations('clinical.resultsReview')
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
            <Link href="/patients" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.patients')}
            </Link>
            <Link href="/appointments" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.appointments')}
            </Link>
            <Link href="/results" className="py-4 text-petrol border-b-2 border-petrol font-medium">
              {t('nav.results')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-petrol mb-6">{t('title')}</h1>

        {/* Pending Review Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-petrol">{t('pendingReview')}</h2>
            <span className="px-2 py-1 bg-orange text-white text-sm rounded-full">
              {pendingResults.length}
            </span>
          </div>

          <div className="space-y-4">
            {pendingResults.map((result) => (
              <div key={result.id} className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-petrol-20 rounded-full flex items-center justify-center">
                      <span className="text-petrol font-medium">{result.patient.initials}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-petrol">{result.patient.name}</h3>
                      <p className="text-petrol-60">{result.type} • {result.date}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    result.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-petrol-20 text-petrol'
                  }`}>
                    {result.priority === 'high' ? t('highPriority') : t('normalPriority')}
                  </span>
                </div>

                {/* Flags */}
                <div className="flex gap-2 mb-4">
                  {result.flags.map((flag, i) => (
                    <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded">
                      ⚠️ {flag}
                    </span>
                  ))}
                </div>

                {/* AI Summary */}
                <div className="bg-sand rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-petrol">🤖 {t('aiSummary')}</span>
                  </div>
                  <p className="text-petrol text-sm">{result.aiSummary}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/results/${result.id}/review`}
                    className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors"
                  >
                    {t('reviewResults')}
                  </Link>
                  <Link
                    href={`/patients/${result.patient.id}`}
                    className="px-4 py-2 border border-petrol text-petrol rounded-lg hover:bg-sand transition-colors"
                  >
                    {t('viewPatient')}
                  </Link>
                  <Link
                    href={`/consultation/${result.patient.id}`}
                    className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-80 transition-colors"
                  >
                    📹 {t('videoCall')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Reviewed Section */}
        <div>
          <h2 className="text-xl font-semibold text-petrol mb-4">{t('recentlyReviewed')}</h2>
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <table className="w-full">
              <thead className="bg-sand">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.patient')}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.type')}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.date')}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.reviewedBy')}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate">
                {recentlyReviewed.map((result) => (
                  <tr key={result.id} className="hover:bg-sand transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-petrol-20 rounded-full flex items-center justify-center">
                          <span className="text-petrol font-medium text-sm">{result.patient.initials}</span>
                        </div>
                        <span className="text-petrol">{result.patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-petrol">{result.type}</td>
                    <td className="px-6 py-4 text-petrol">{result.date}</td>
                    <td className="px-6 py-4 text-petrol-60">{result.reviewedBy}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/results/${result.id}`}
                        className="text-orange hover:text-orange-80"
                      >
                        {t('view')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

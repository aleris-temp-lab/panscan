import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPatientSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../dashboard/logout-button'

// Demo results
const results = [
  {
    id: '1',
    type: 'blood-panel',
    name: 'Comprehensive Blood Panel',
    date: '2026-02-01',
    status: 'ready',
    summary: 'All markers within normal range',
  },
  {
    id: '2',
    type: 'dexa',
    name: 'DEXA Body Scan',
    date: '2026-01-15',
    status: 'ready',
    summary: 'Body fat 18.5%, excellent bone density',
  },
  {
    id: '3',
    type: 'blood-panel',
    name: 'Basic Blood Panel',
    date: '2025-10-20',
    status: 'ready',
    summary: 'Slight vitamin D deficiency noted',
  },
]

export default async function ResultsPage({
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

  const t = await getTranslations('patient.results')
  const { user } = session

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-white border-b border-slate">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Logo width={100} height={36} />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <span className="text-petrol-60">{user.firstName} {user.lastName}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-petrol mb-2">{t('title')}</h1>
        <p className="text-petrol-60 mb-8">{t('subtitle')}</p>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <Link
                key={result.id}
                href={`/results/${result.id}`}
                className="block bg-white rounded-xl shadow-soft p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      result.type === 'blood-panel' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <span className="text-2xl">
                        {result.type === 'blood-panel' ? '🩸' : '🦴'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-petrol">{result.name}</h3>
                      <p className="text-sm text-petrol-60">{result.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {t('ready')}
                    </span>
                    <p className="text-sm text-petrol-60 mt-2">{result.summary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-soft p-12 text-center">
            <p className="text-petrol-60 mb-4">{t('noResults')}</p>
            <Link href="/packages" className="text-orange hover:text-orange-80">
              Book a health check →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

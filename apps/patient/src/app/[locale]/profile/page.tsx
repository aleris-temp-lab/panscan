import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPatientSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../dashboard/logout-button'

export default async function ProfilePage({
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

  const t = await getTranslations('patient.profile')
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
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-petrol mb-2">{t('title')}</h1>
        <p className="text-petrol-60 mb-8">{t('subtitle')}</p>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-petrol flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-petrol">{user.firstName} {user.lastName}</h2>
              <p className="text-petrol-60">{t('memberSince')} 2026</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-slate">
              <span className="text-petrol-60">{t('personalNumber')}</span>
              <span className="text-petrol font-medium">••••••-••••</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate">
              <span className="text-petrol-60">{t('email')}</span>
              <span className="text-petrol font-medium">{user.firstName.toLowerCase()}.{user.lastName.toLowerCase()}@email.se</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate">
              <span className="text-petrol-60">{t('phone')}</span>
              <span className="text-petrol font-medium">+46 70 XXX XX XX</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-petrol-60">{t('language')}</span>
              <span className="text-petrol font-medium">{locale === 'sv' ? 'Svenska' : locale === 'no' ? 'Norsk' : locale === 'da' ? 'Dansk' : 'English'}</span>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-petrol mb-4">{t('dataPrivacy')}</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-sand transition-colors text-petrol">
              {t('downloadData')}
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-sand transition-colors text-petrol">
              {t('manageConsents')}
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-sand transition-colors text-red-600">
              {t('deleteAccount')}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

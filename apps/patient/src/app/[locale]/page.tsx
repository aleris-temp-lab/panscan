import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Logo } from '@panscan/ui'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <HomeContent />
}

function HomeContent() {
  const t = useTranslations('patient.home')

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo width={100} height={36} />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-petrol hover:text-orange transition-colors"
            >
              {t('hero.login')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-sand px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-petrol md:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="mb-8 text-lg text-petrol-60">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/screening"
              className="rounded-lg bg-orange px-8 py-3 font-medium text-white transition-colors hover:bg-orange-80"
            >
              {t('hero.screening')}
            </Link>
            <Link
              href="/packages"
              className="rounded-lg border-2 border-petrol px-8 py-3 font-medium text-petrol transition-colors hover:bg-petrol hover:text-white"
            >
              {t('hero.cta')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
// Build: Mon Feb 16 14:25:25 CET 2026

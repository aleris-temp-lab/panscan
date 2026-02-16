import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Logo } from '@panscan/ui'

export default async function ClinicalHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ClinicalHomeContent />
}

function ClinicalHomeContent() {
  const t = useTranslations('clinical.home')

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo width={100} height={36} />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link
              href="/auth/login"
              className="rounded-lg bg-petrol px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-petrol-80"
            >
              {t('login')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-petrol">
            {t('hero.title')}
          </h1>
          <p className="mb-8 text-lg text-petrol-60">
            {t('hero.subtitle')}
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-lg bg-orange px-8 py-3 font-medium text-white transition-colors hover:bg-orange-80"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-sand px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <FeatureCard
            title={t('features.schedule.title')}
            description={t('features.schedule.description')}
          />
          <FeatureCard
            title={t('features.results.title')}
            description={t('features.results.description')}
          />
          <FeatureCard
            title={t('features.insights.title')}
            description={t('features.insights.description')}
          />
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-soft">
      <h3 className="mb-2 text-lg font-semibold text-petrol">{title}</h3>
      <p className="text-petrol-60">{description}</p>
    </div>
  )
}
// Build: Mon Feb 16 14:25:25 CET 2026

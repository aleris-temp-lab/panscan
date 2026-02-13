import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'

export default async function AdminHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AdminHomeContent />
}

function AdminHomeContent() {
  const t = useTranslations('admin.home')

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-petrol" />
            <span className="text-xl font-semibold text-petrol">Aleris Admin</span>
          </div>
          <Link
            href="/auth/login"
            className="rounded-lg bg-petrol px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-petrol-80"
          >
            {t('login')}
          </Link>
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
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
          <FeatureCard
            title={t('features.products.title')}
            description={t('features.products.description')}
          />
          <FeatureCard
            title={t('features.people.title')}
            description={t('features.people.description')}
          />
          <FeatureCard
            title={t('features.skills.title')}
            description={t('features.skills.description')}
          />
          <FeatureCard
            title={t('features.schedule.title')}
            description={t('features.schedule.description')}
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
      <p className="text-sm text-petrol-60">{description}</p>
    </div>
  )
}

import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'

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
      {/* Hero Section */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-petrol md:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="mb-8 text-lg text-petrol-60">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/packages"
              className="rounded-lg bg-orange px-8 py-3 font-medium text-white transition-colors hover:bg-orange-80"
            >
              {t('hero.cta')}
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border-2 border-petrol px-8 py-3 font-medium text-petrol transition-colors hover:bg-petrol hover:text-white"
            >
              {t('hero.login')}
            </Link>
          </div>
        </div>
      </section>

      {/* Language Selector */}
      <section className="bg-sand px-6 py-8">
        <div className="mx-auto flex max-w-4xl justify-center gap-4">
          <Link href="/" locale="sv" className="text-petrol hover:text-orange">Svenska</Link>
          <Link href="/" locale="no" className="text-petrol hover:text-orange">Norsk</Link>
          <Link href="/" locale="da" className="text-petrol hover:text-orange">Dansk</Link>
          <Link href="/" locale="en" className="text-petrol hover:text-orange">English</Link>
        </div>
      </section>
    </main>
  )
}

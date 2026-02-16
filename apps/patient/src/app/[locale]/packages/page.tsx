import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { getPatientSession } from '@panscan/auth'

// Demo packages data (prices aligned with admin/products)
const packages = [
  {
    id: 'blood-panel-basic',
    category: 'blood',
    name: 'Basic Blood Panel',
    description: 'Essential health markers including cholesterol, blood sugar, and liver function.',
    price: 995,
    currency: 'SEK',
    popular: false,
    tests: ['Cholesterol', 'Blood Sugar', 'Liver Function', 'Kidney Function'],
  },
  {
    id: 'blood-panel-comprehensive',
    category: 'blood',
    name: 'Comprehensive Blood Panel',
    description: 'Complete analysis with 40+ biomarkers for a thorough health overview.',
    price: 2495,
    currency: 'SEK',
    popular: true,
    tests: ['All Basic tests', 'Thyroid Panel', 'Vitamin D', 'B12', 'Iron Studies', 'Inflammation Markers'],
  },
  {
    id: 'dexa-scan',
    category: 'imaging',
    name: 'DEXA Body Scan',
    description: 'Precise measurement of body composition, bone density, and visceral fat.',
    price: 1995,
    currency: 'SEK',
    popular: true,
    tests: ['Body Fat %', 'Lean Mass', 'Bone Density', 'Visceral Fat', 'Regional Analysis'],
  },
  {
    id: 'executive-health',
    category: 'package',
    name: 'Executive Health Check',
    description: 'Our most comprehensive package: full blood panel, DEXA, and doctor consultation.',
    price: 8995,
    currency: 'SEK',
    popular: false,
    tests: ['Comprehensive Blood Panel', 'DEXA Scan', '45min Doctor Consultation', 'Personalized Health Plan'],
  },
  {
    id: 'hormone-panel-male',
    category: 'blood',
    name: 'Male Hormone Panel',
    description: 'Testosterone, SHBG, and related markers for male hormonal health.',
    price: 2495,
    currency: 'SEK',
    popular: false,
    tests: ['Total Testosterone', 'Free Testosterone', 'SHBG', 'LH', 'FSH', 'Estradiol'],
  },
  {
    id: 'hormone-panel-female',
    category: 'blood',
    name: 'Female Hormone Panel',
    description: 'Comprehensive hormonal analysis for female health optimization.',
    price: 2995,
    currency: 'SEK',
    popular: false,
    tests: ['Estrogen', 'Progesterone', 'FSH', 'LH', 'Thyroid Panel', 'Prolactin'],
  },
  {
    id: 'thyroid-complete',
    category: 'blood',
    name: 'Thyroid Complete',
    description: 'Full thyroid function analysis including TSH, T3, T4, and antibodies.',
    price: 1495,
    currency: 'SEK',
    popular: false,
    tests: ['TSH', 'Free T3', 'Free T4', 'TPO Antibodies', 'Thyroglobulin'],
  },
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'blood', name: 'Blood Tests' },
  { id: 'imaging', name: 'Imaging' },
  { id: 'package', name: 'Packages' },
]

export default async function PackagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations('patient.packages')
  const session = await getPatientSession()

  const selectedCategory = category || 'all'
  const filteredPackages = selectedCategory === 'all'
    ? packages
    : packages.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-white border-b border-slate">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo width={100} height={36} />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            {session ? (
              <Link href="/dashboard" className="text-petrol hover:text-orange transition-colors">
                {t('myHealth')}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-petrol mb-2">{t('title')}</h1>
        <p className="text-petrol-60 mb-8">{t('subtitle')}</p>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === 'all' ? '/packages' : `/packages?category=${cat.id}`}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-petrol text-white'
                  : 'bg-white text-petrol hover:bg-slate'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.id}`}
              className="bg-white rounded-xl shadow-soft p-6 hover:shadow-md transition-shadow relative"
            >
              {pkg.popular && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-orange text-white text-xs font-medium rounded-full">
                  {t('popular')}
                </span>
              )}
              <h3 className="text-xl font-semibold text-petrol mb-2">{pkg.name}</h3>
              <p className="text-petrol-60 text-sm mb-4">{pkg.description}</p>

              <div className="mb-4">
                <span className="text-2xl font-bold text-petrol">{pkg.price.toLocaleString()}</span>
                <span className="text-petrol-60 ml-1">{pkg.currency}</span>
              </div>

              <div className="border-t border-slate pt-4">
                <p className="text-xs text-petrol-60 mb-2">{t('includes')}:</p>
                <ul className="text-sm text-petrol space-y-1">
                  {pkg.tests.slice(0, 3).map((test, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {test}
                    </li>
                  ))}
                  {pkg.tests.length > 3 && (
                    <li className="text-petrol-60">+{pkg.tests.length - 3} {t('more')}</li>
                  )}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

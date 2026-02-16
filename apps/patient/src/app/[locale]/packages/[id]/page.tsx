import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { getPatientSession } from '@panscan/auth'
import { notFound } from 'next/navigation'
import { AddToCartButton } from './add-to-cart-button'

// Demo packages data (same as listing)
const packages: Record<string, {
  id: string
  category: string
  name: string
  description: string
  longDescription: string
  price: number
  currency: string
  duration: string
  preparation: string[]
  tests: { name: string; description: string }[]
}> = {
  'blood-panel-basic': {
    id: 'blood-panel-basic',
    category: 'blood',
    name: 'Basic Blood Panel',
    description: 'Essential health markers including cholesterol, blood sugar, and liver function.',
    longDescription: 'Our Basic Blood Panel provides a foundational overview of your health by measuring key biomarkers. Ideal for annual checkups or if you want to establish a health baseline.',
    price: 1495,
    currency: 'SEK',
    duration: '15 minutes',
    preparation: ['Fast for 8-12 hours before the test', 'Water is allowed', 'Take medications as usual unless advised otherwise'],
    tests: [
      { name: 'Total Cholesterol', description: 'Measures overall cholesterol levels in your blood' },
      { name: 'LDL Cholesterol', description: 'The "bad" cholesterol that can build up in arteries' },
      { name: 'HDL Cholesterol', description: 'The "good" cholesterol that helps remove LDL' },
      { name: 'Fasting Glucose', description: 'Blood sugar level after fasting' },
      { name: 'HbA1c', description: 'Average blood sugar over the past 2-3 months' },
      { name: 'ALT/AST', description: 'Liver enzyme markers' },
      { name: 'Creatinine', description: 'Kidney function marker' },
    ],
  },
  'blood-panel-comprehensive': {
    id: 'blood-panel-comprehensive',
    category: 'blood',
    name: 'Comprehensive Blood Panel',
    description: 'Complete analysis with 40+ biomarkers for a thorough health overview.',
    longDescription: 'Our most complete blood analysis covers everything from basic metabolic markers to hormones, vitamins, and inflammation indicators. Perfect for those who want a deep understanding of their health.',
    price: 2495,
    currency: 'SEK',
    duration: '20 minutes',
    preparation: ['Fast for 8-12 hours before the test', 'Water is allowed', 'Avoid alcohol 24 hours before', 'Take medications as usual unless advised otherwise'],
    tests: [
      { name: 'Complete Lipid Panel', description: 'Full cholesterol and triglyceride analysis' },
      { name: 'Metabolic Panel', description: 'Glucose, HbA1c, and insulin markers' },
      { name: 'Thyroid Panel', description: 'TSH, T3, and T4 for thyroid function' },
      { name: 'Vitamin D', description: 'Essential for bone health and immune function' },
      { name: 'Vitamin B12', description: 'Important for energy and nerve function' },
      { name: 'Iron Studies', description: 'Ferritin, iron, and transferrin saturation' },
      { name: 'Inflammation Markers', description: 'CRP and ESR to detect inflammation' },
      { name: 'Liver Function', description: 'Complete liver enzyme panel' },
      { name: 'Kidney Function', description: 'Creatinine, BUN, and eGFR' },
    ],
  },
  'dexa-scan': {
    id: 'dexa-scan',
    category: 'imaging',
    name: 'DEXA Body Scan',
    description: 'Precise measurement of body composition, bone density, and visceral fat.',
    longDescription: 'DEXA (Dual-Energy X-ray Absorptiometry) is the gold standard for body composition analysis. Get precise measurements of fat mass, lean mass, bone density, and dangerous visceral fat levels.',
    price: 1995,
    currency: 'SEK',
    duration: '30 minutes',
    preparation: ['Wear comfortable clothing without metal', 'No calcium supplements 24 hours before', 'Avoid heavy exercise the day before'],
    tests: [
      { name: 'Total Body Fat %', description: 'Precise measurement of overall body fat percentage' },
      { name: 'Lean Mass', description: 'Muscle and organ tissue mass' },
      { name: 'Bone Mineral Density', description: 'Assessment of bone strength and osteoporosis risk' },
      { name: 'Visceral Fat', description: 'Fat around internal organs (metabolic health indicator)' },
      { name: 'Regional Analysis', description: 'Fat and muscle distribution by body region' },
      { name: 'Android/Gynoid Ratio', description: 'Fat distribution pattern analysis' },
    ],
  },
  'executive-health': {
    id: 'executive-health',
    category: 'package',
    name: 'Executive Health Check',
    description: 'Our most comprehensive package: full blood panel, DEXA, and doctor consultation.',
    longDescription: 'The Executive Health Check is our premium offering, combining comprehensive blood analysis, body composition scanning, and a personalized consultation with one of our doctors to review your results and create a health action plan.',
    price: 8995,
    currency: 'SEK',
    duration: '2 hours',
    preparation: ['Fast for 8-12 hours before the test', 'Wear comfortable clothing', 'Bring list of current medications', 'Prepare questions for the doctor'],
    tests: [
      { name: 'Comprehensive Blood Panel', description: 'Full 40+ biomarker analysis' },
      { name: 'DEXA Body Scan', description: 'Complete body composition analysis' },
      { name: 'Doctor Consultation (45 min)', description: 'Review results with a physician' },
      { name: 'Personalized Health Plan', description: 'Actionable recommendations based on your results' },
      { name: 'Follow-up Call', description: '15-minute follow-up call after 2 weeks' },
    ],
  },
  'hormone-panel-male': {
    id: 'hormone-panel-male',
    category: 'blood',
    name: 'Male Hormone Panel',
    description: 'Testosterone, SHBG, and related markers for male hormonal health.',
    longDescription: 'Optimize your hormonal health with our comprehensive male hormone panel. We measure testosterone and related markers to give you a complete picture of your hormonal status.',
    price: 1895,
    currency: 'SEK',
    duration: '15 minutes',
    preparation: ['Fast for 8-12 hours', 'Test should be done in the morning (before 10am)', 'Avoid intense exercise 24 hours before'],
    tests: [
      { name: 'Total Testosterone', description: 'Overall testosterone level in blood' },
      { name: 'Free Testosterone', description: 'Bioavailable testosterone' },
      { name: 'SHBG', description: 'Sex hormone binding globulin' },
      { name: 'LH', description: 'Luteinizing hormone' },
      { name: 'FSH', description: 'Follicle-stimulating hormone' },
      { name: 'Estradiol', description: 'Estrogen level (important for male health too)' },
    ],
  },
  'hormone-panel-female': {
    id: 'hormone-panel-female',
    category: 'blood',
    name: 'Female Hormone Panel',
    description: 'Comprehensive hormonal analysis for female health optimization.',
    longDescription: 'Understand your hormonal balance with our comprehensive female hormone panel. Ideal for investigating cycle irregularities, fertility, or menopause-related concerns.',
    price: 1895,
    currency: 'SEK',
    duration: '15 minutes',
    preparation: ['Fast for 8-12 hours', 'Note your cycle day when booking', 'Ideally test on day 3-5 of cycle'],
    tests: [
      { name: 'Estradiol', description: 'Primary estrogen hormone' },
      { name: 'Progesterone', description: 'Important for cycle and pregnancy' },
      { name: 'FSH', description: 'Follicle-stimulating hormone' },
      { name: 'LH', description: 'Luteinizing hormone' },
      { name: 'TSH', description: 'Thyroid function (affects hormonal balance)' },
      { name: 'Prolactin', description: 'Can affect cycle regularity' },
    ],
  },
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const pkg = packages[id]
  if (!pkg) {
    notFound()
  }

  const t = await getTranslations('patient.packages')
  const session = await getPatientSession()

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
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/packages" className="text-petrol-60 hover:text-petrol">
            ← {t('title')}
          </Link>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-petrol mb-4">{pkg.name}</h1>
            <p className="text-lg text-petrol-60 mb-6">{pkg.longDescription}</p>

            {/* What's Included */}
            <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
              <h2 className="text-xl font-semibold text-petrol mb-4">{t('whatsIncluded')}</h2>
              <div className="space-y-4">
                {pkg.tests.map((test, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-petrol">{test.name}</p>
                      <p className="text-sm text-petrol-60">{test.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-petrol mb-4">{t('preparation')}</h2>
              <ul className="space-y-2">
                {pkg.preparation.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-petrol">
                    <span className="text-orange">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - Price & Book */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-4">
              <div className="mb-6">
                <p className="text-sm text-petrol-60">{t('price')}</p>
                <p className="text-3xl font-bold text-petrol">
                  {pkg.price.toLocaleString()} <span className="text-lg font-normal">{pkg.currency}</span>
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-slate">
                <p className="text-sm text-petrol-60">{t('duration')}</p>
                <p className="text-petrol font-medium">{pkg.duration}</p>
              </div>

              <AddToCartButton packageId={pkg.id} packageName={pkg.name} />

              <p className="text-xs text-petrol-60 text-center mt-4">
                {t('fasting')}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

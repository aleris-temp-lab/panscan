import { redirect, notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPatientSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../../dashboard/logout-button'

// Demo results data
const resultsData: Record<string, {
  id: string
  type: 'blood-panel' | 'dexa'
  name: string
  date: string
  doctor: string
  markers?: { name: string; value: string; unit: string; reference: string; status: 'normal' | 'low' | 'high' | 'optimal' }[]
  bodyComp?: { metric: string; value: string; status: 'good' | 'attention' | 'optimal' }[]
}> = {
  'result-1': {
    id: 'result-1',
    type: 'blood-panel',
    name: 'Comprehensive Blood Panel',
    date: '2026-02-01',
    doctor: 'Dr. Sara Lindqvist',
    markers: [
      { name: 'Total Cholesterol', value: '4.8', unit: 'mmol/L', reference: '< 5.0', status: 'normal' },
      { name: 'LDL Cholesterol', value: '2.9', unit: 'mmol/L', reference: '< 3.0', status: 'normal' },
      { name: 'HDL Cholesterol', value: '1.5', unit: 'mmol/L', reference: '> 1.0', status: 'optimal' },
      { name: 'Triglycerides', value: '1.2', unit: 'mmol/L', reference: '< 1.7', status: 'normal' },
      { name: 'Fasting Glucose', value: '5.2', unit: 'mmol/L', reference: '3.9-5.6', status: 'normal' },
      { name: 'HbA1c', value: '5.4', unit: '%', reference: '< 6.0', status: 'optimal' },
      { name: 'TSH', value: '2.1', unit: 'mIU/L', reference: '0.4-4.0', status: 'normal' },
      { name: 'Vitamin D', value: '68', unit: 'nmol/L', reference: '50-125', status: 'normal' },
      { name: 'Vitamin B12', value: '412', unit: 'pmol/L', reference: '150-600', status: 'normal' },
      { name: 'Ferritin', value: '95', unit: 'µg/L', reference: '30-300', status: 'normal' },
      { name: 'CRP', value: '0.8', unit: 'mg/L', reference: '< 3.0', status: 'optimal' },
      { name: 'ALT', value: '28', unit: 'U/L', reference: '< 45', status: 'normal' },
      { name: 'Creatinine', value: '82', unit: 'µmol/L', reference: '60-110', status: 'normal' },
    ],
  },
  'result-2': {
    id: 'result-2',
    type: 'dexa',
    name: 'DEXA Body Scan',
    date: '2026-01-15',
    doctor: 'Dr. Sara Lindqvist',
    bodyComp: [
      { metric: 'Total Body Fat', value: '18.5%', status: 'optimal' },
      { metric: 'Lean Mass', value: '62.3 kg', status: 'good' },
      { metric: 'Bone Mineral Density', value: '1.2 g/cm²', status: 'optimal' },
      { metric: 'Visceral Fat', value: '0.8 kg', status: 'optimal' },
      { metric: 'Android Fat %', value: '22.1%', status: 'good' },
      { metric: 'Gynoid Fat %', value: '28.4%', status: 'good' },
      { metric: 'A/G Ratio', value: '0.78', status: 'optimal' },
    ],
  },
  'result-3': {
    id: 'result-3',
    type: 'blood-panel',
    name: 'Basic Blood Panel',
    date: '2025-10-20',
    doctor: 'Dr. Johan Berg',
    markers: [
      { name: 'Total Cholesterol', value: '5.1', unit: 'mmol/L', reference: '< 5.0', status: 'high' },
      { name: 'Fasting Glucose', value: '5.0', unit: 'mmol/L', reference: '3.9-5.6', status: 'normal' },
      { name: 'Vitamin D', value: '38', unit: 'nmol/L', reference: '50-125', status: 'low' },
      { name: 'ALT', value: '32', unit: 'U/L', reference: '< 45', status: 'normal' },
      { name: 'Creatinine', value: '78', unit: 'µmol/L', reference: '60-110', status: 'normal' },
    ],
  },
}

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const session = await getPatientSession()
  if (!session) {
    redirect('/auth/login')
  }

  const result = resultsData[id]
  if (!result) {
    notFound()
  }

  const t = await getTranslations('patient.results')
  const { user } = session

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-100 text-green-800'
      case 'normal':
      case 'good':
        return 'bg-blue-100 text-blue-800'
      case 'low':
      case 'high':
      case 'attention':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-slate text-petrol'
    }
  }

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
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/results" className="text-petrol-60 hover:text-petrol">
            ← {t('title')}
          </Link>
        </nav>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
              result.type === 'blood-panel' ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <span className="text-3xl">
                {result.type === 'blood-panel' ? '🩸' : '🦴'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-petrol">{result.name}</h1>
              <p className="text-petrol-60">{result.date} • Reviewed by {result.doctor}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors">
              {t('downloadPdf')}
            </button>
            <button className="px-4 py-2 border border-petrol text-petrol rounded-lg hover:bg-sand transition-colors">
              {t('shareWithDoctor')}
            </button>
            <Link
              href="/chat"
              className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-80 transition-colors"
            >
              Ask Emma about these results
            </Link>
          </div>
        </div>

        {/* Results */}
        {result.type === 'blood-panel' && result.markers && (
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate">
              <h2 className="text-xl font-semibold text-petrol">{t('bloodPanel')}</h2>
            </div>
            <div className="divide-y divide-slate">
              {result.markers.map((marker, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-sand transition-colors">
                  <div>
                    <p className="font-medium text-petrol">{marker.name}</p>
                    <p className="text-sm text-petrol-60">{t('reference')}: {marker.reference}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-petrol">
                      {marker.value} <span className="text-sm font-normal text-petrol-60">{marker.unit}</span>
                    </p>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(marker.status)}`}>
                      {marker.status === 'optimal' ? t('optimal') : marker.status === 'normal' ? t('normal') : t('attention')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.type === 'dexa' && result.bodyComp && (
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate">
              <h2 className="text-xl font-semibold text-petrol">{t('dexaScan')}</h2>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate">
              {result.bodyComp.map((item, i) => (
                <div key={i} className="p-6">
                  <p className="text-sm text-petrol-60 mb-1">{item.metric}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-petrol">{item.value}</p>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(item.status)}`}>
                      {item.status === 'optimal' ? t('optimal') : item.status === 'good' ? t('normal') : t('attention')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

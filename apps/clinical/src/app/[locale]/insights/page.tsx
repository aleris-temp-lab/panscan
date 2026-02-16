'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

// Demo AI insights awaiting review
const pendingInsights = [
  {
    id: 'insight-1',
    patient: { id: 'patient-1', name: 'Anna Andersson', initials: 'AA' },
    type: 'trend_alert',
    title: 'Elevated HbA1c trend detected',
    description: 'HbA1c has increased from 5.4% to 5.8% over the last 6 months. Patient is approaching pre-diabetic range.',
    recommendation: 'Consider discussing lifestyle modifications and scheduling follow-up in 3 months for repeat testing.',
    severity: 'warning',
    createdAt: '2026-02-15',
    basedOn: ['Blood Panel - 2026-02-01', 'Blood Panel - 2025-08-15'],
  },
  {
    id: 'insight-2',
    patient: { id: 'patient-4', name: 'Lars Nilsson', initials: 'LN' },
    type: 'risk_factor',
    title: 'Cardiovascular risk factors identified',
    description: 'Patient shows multiple cardiovascular risk markers: elevated LDL (4.2 mmol/L), borderline triglycerides (1.9 mmol/L), and elevated blood pressure history.',
    recommendation: 'Comprehensive cardiovascular risk assessment recommended. Consider statin therapy evaluation.',
    severity: 'high',
    createdAt: '2026-02-14',
    basedOn: ['Comprehensive Blood Panel - 2026-02-13'],
  },
  {
    id: 'insight-3',
    patient: { id: 'patient-2', name: 'Erik Svensson', initials: 'ES' },
    type: 'progress',
    title: 'Positive weight management progress',
    description: 'Patient has reduced visceral fat from 1.5 kg to 1.2 kg over 3 months. Body fat percentage decreased by 2.1%.',
    recommendation: 'Acknowledge progress and encourage continuation of current program. Consider adjusting dietary plan for next phase.',
    severity: 'positive',
    createdAt: '2026-02-13',
    basedOn: ['DEXA Scan - 2026-02-12', 'DEXA Scan - 2025-11-10'],
  },
]

const reviewedInsights = [
  {
    id: 'insight-r1',
    patient: { id: 'patient-3', name: 'Maria Johansson', initials: 'MJ' },
    type: 'medication',
    title: 'Thyroid medication adjustment suggested',
    reviewedBy: 'Dr. Sara Lindqvist',
    reviewedAt: '2026-02-11',
    action: 'Approved - adjusted levothyroxine dosage',
  },
]

export default function InsightsPage() {
  const t = useTranslations('clinical.insights')
  const router = useRouter()
  const [approving, setApproving] = useState<string | null>(null)

  const handleApprove = async (insightId: string) => {
    setApproving(insightId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setApproving(null)
    // In real app, would update state or refetch
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-petrol-20 text-petrol border-petrol-20'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🚨'
      case 'warning':
        return '⚠️'
      case 'positive':
        return '✅'
      default:
        return '💡'
    }
  }

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
            <span className="text-petrol-40">Dr. Sara Lindqvist</span>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 bg-petrol-80 rounded-lg hover:bg-petrol-60 transition-colors"
            >
              {t('logout')}
            </button>
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
            <Link href="/results" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.results')}
            </Link>
            <Link href="/insights" className="py-4 text-petrol border-b-2 border-petrol font-medium">
              {t('nav.insights')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-petrol">{t('title')}</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-orange text-white rounded-full text-sm">
              {pendingInsights.length} {t('pendingReview')}
            </span>
          </div>
        </div>

        <p className="text-petrol-60 mb-8">{t('subtitle')}</p>

        {/* Pending Insights */}
        <div className="space-y-4 mb-12">
          {pendingInsights.map((insight) => (
            <div key={insight.id} className={`bg-white rounded-xl shadow-soft p-6 border-l-4 ${getSeverityStyles(insight.severity)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-petrol-20 rounded-full flex items-center justify-center">
                    <span className="text-petrol font-medium">{insight.patient.initials}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-petrol flex items-center gap-2">
                      {getSeverityIcon(insight.severity)} {insight.title}
                    </h3>
                    <p className="text-petrol-60 text-sm">{insight.patient.name} • {insight.createdAt}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getSeverityStyles(insight.severity)}`}>
                  {insight.severity === 'high' ? t('highPriority') :
                   insight.severity === 'warning' ? t('needsReview') :
                   t('positive')}
                </span>
              </div>

              <p className="text-petrol mb-4">{insight.description}</p>

              {/* Recommendation */}
              <div className="bg-sand rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-petrol mb-1">🤖 {t('aiRecommendation')}</p>
                <p className="text-petrol text-sm">{insight.recommendation}</p>
              </div>

              {/* Based on */}
              <div className="mb-4">
                <p className="text-sm text-petrol-60 mb-2">{t('basedOn')}:</p>
                <div className="flex gap-2 flex-wrap">
                  {insight.basedOn.map((source, i) => (
                    <span key={i} className="px-3 py-1 bg-petrol-10 text-petrol text-sm rounded">
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(insight.id)}
                  disabled={approving === insight.id}
                  className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors disabled:opacity-50"
                >
                  {approving === insight.id ? t('approving') : t('approveInsight')}
                </button>
                <button className="px-4 py-2 border border-petrol text-petrol rounded-lg hover:bg-sand transition-colors">
                  {t('editRecommendation')}
                </button>
                <Link
                  href={`/patients/${insight.patient.id}`}
                  className="px-4 py-2 bg-sand text-petrol rounded-lg hover:bg-slate transition-colors"
                >
                  {t('viewPatient')}
                </Link>
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  {t('dismiss')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recently Reviewed */}
        <div>
          <h2 className="text-xl font-semibold text-petrol mb-4">{t('recentlyReviewed')}</h2>
          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <table className="w-full">
              <thead className="bg-sand">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.patient')}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.insight')}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.action')}</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.reviewedBy')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate">
                {reviewedInsights.map((insight) => (
                  <tr key={insight.id} className="hover:bg-sand transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-petrol-20 rounded-full flex items-center justify-center">
                          <span className="text-petrol font-medium text-sm">{insight.patient.initials}</span>
                        </div>
                        <span className="text-petrol">{insight.patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-petrol">{insight.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        {insight.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-petrol-60">
                      {insight.reviewedBy} • {insight.reviewedAt}
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

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

type LoginStep = 'loading' | 'success'

export default function PatientLoginPage() {
  const t = useTranslations('patient.auth')
  const router = useRouter()
  const [step, setStep] = useState<LoginStep>('loading')

  useEffect(() => {
    const login = async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalNumber: '199001011234' }),
      })

      if (response.ok) {
        setStep('success')
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push('/dashboard')
        router.refresh()
      }
    }

    login()
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-petrol">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-2xl font-bold text-petrol">Aleris Health</h1>
        </div>

        {/* Login Card */}
        <div className="rounded-xl bg-white p-8 shadow-soft">
          {step === 'loading' && (
            <div className="py-8 text-center">
              <p className="mb-2 font-medium text-petrol">{t('startingBankID')}</p>
              <p className="text-sm text-petrol-60">{t('waitingForAuth')}</p>
              <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-slate">
                <div className="h-full animate-pulse rounded-full bg-petrol" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-medium text-petrol">{t('loginSuccess')}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

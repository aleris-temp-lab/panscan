'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

type LoginStep = 'loading' | 'success'

export default function PatientLoginPage() {
  const t = useTranslations('patient.auth')
  const router = useRouter()
  const [step, setStep] = useState<LoginStep>('loading')

  useEffect(() => {
    // Auto-login with demo user (Anna Andersson)
    const autoLogin = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalNumber: '199001011234' }),
      })

      if (response.ok) {
        setStep('success')
        await new Promise(resolve => setTimeout(resolve, 200))
        router.push('/dashboard')
        router.refresh()
      }
    }

    autoLogin()
  }, [router])

  return (
    <main className="min-h-screen bg-sand flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-petrol rounded-full mb-4">
            <span className="text-2xl text-white font-bold">A</span>
          </div>
          <h1 className="text-2xl font-bold text-petrol">Aleris Health</h1>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-soft p-8">
          {step === 'loading' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-petrol rounded-full mb-4">
                <BankIDIcon className="w-8 h-8 text-white" />
              </div>
              <p className="text-petrol font-medium">{t('startingBankID')}</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-petrol font-medium">{t('loginSuccess')}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function BankIDIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  )
}

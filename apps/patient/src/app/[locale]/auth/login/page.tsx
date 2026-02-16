'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

type LoginStep = 'input' | 'loading' | 'open-app' | 'success'

export default function PatientLoginPage() {
  const t = useTranslations('patient.auth')
  const router = useRouter()
  const [step, setStep] = useState<LoginStep>('input')
  const [personalNumber, setPersonalNumber] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    const cleaned = personalNumber.replace(/[\s-]/g, '')
    if (!/^\d{10,12}$/.test(cleaned)) {
      setError(t('invalidPersonalNumber'))
      return
    }

    // Simulate BankID flow
    setStep('loading')

    // Wait a bit then show "open app" step
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStep('open-app')

    // Wait then complete login
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Call login API
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalNumber: cleaned }),
    })

    if (response.ok) {
      setStep('success')
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/dashboard')
      router.refresh()
    } else {
      const data = await response.json()
      setError(data.error || 'Login failed')
      setStep('input')
    }
  }

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
          {step === 'input' && (
            <>
              <h2 className="text-xl font-semibold text-petrol mb-2">
                {t('loginTitle')}
              </h2>
              <p className="text-petrol-60 mb-6">
                {t('loginSubtitle')}
              </p>

              <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium text-petrol">
                  {t('personalNumber')}
                </label>
                <input
                  type="text"
                  value={personalNumber}
                  onChange={(e) => setPersonalNumber(e.target.value)}
                  placeholder="YYYYMMDD-XXXX"
                  className="w-full px-4 py-3 rounded-lg border border-slate bg-white text-petrol placeholder:text-petrol-60 focus:outline-none focus:ring-2 focus:ring-petrol mb-4"
                  autoFocus
                />

                {error && (
                  <p className="text-red-600 text-sm mb-4">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-petrol text-white py-3 rounded-lg font-medium hover:bg-petrol-80 transition-colors flex items-center justify-center gap-2"
                >
                  <BankIDIcon />
                  {t('loginWithBankID')}
                </button>
              </form>

              {/* Demo hint */}
              <div className="mt-6 p-4 bg-sand rounded-lg">
                <p className="text-sm text-petrol-60">
                  <strong>Demo:</strong> Try 199001011234 (Anna) or 198505152345 (Erik)
                </p>
              </div>
            </>
          )}

          {step === 'loading' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <div className="w-12 h-12 border-4 border-petrol-40 border-t-petrol rounded-full animate-spin" />
              </div>
              <p className="text-petrol font-medium">{t('startingBankID')}</p>
            </div>
          )}

          {step === 'open-app' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-petrol rounded-full mb-4">
                <BankIDIcon className="w-8 h-8 text-white" />
              </div>
              <p className="text-petrol font-medium mb-2">{t('openBankIDApp')}</p>
              <p className="text-petrol-60 text-sm">{t('waitingForAuth')}</p>
              <div className="mt-4">
                <div className="w-8 h-8 border-4 border-petrol-40 border-t-petrol rounded-full animate-spin mx-auto" />
              </div>
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

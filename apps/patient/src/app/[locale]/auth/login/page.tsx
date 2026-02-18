'use client'

import { useState } from 'react'
import { useRouter, Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

type LoginStep = 'form' | 'authenticating' | 'success'

export default function PatientLoginPage() {
  const t = useTranslations('patient.auth')
  const router = useRouter()
  const [step, setStep] = useState<LoginStep>('form')
  const [personalNumber, setPersonalNumber] = useState('')
  const [error, setError] = useState('')

  const formatPersonalNumber = (value: string): string => {
    // Strip non-digits
    const digits = value.replace(/\D/g, '')
    // Format as YYYYMMDD-XXXX
    if (digits.length > 8) {
      return digits.slice(0, 8) + '-' + digits.slice(8, 12)
    }
    return digits
  }

  const handleInputChange = (value: string) => {
    setError('')
    setPersonalNumber(formatPersonalNumber(value))
  }

  const handleLogin = async () => {
    const digits = personalNumber.replace(/\D/g, '')
    if (digits.length !== 10 && digits.length !== 12) {
      setError(t('invalidPersonalNumber'))
      return
    }

    setStep('authenticating')

    // Simulate BankID flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personalNumber: digits }),
    })

    if (response.ok) {
      setStep('success')
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push('/dashboard')
      router.refresh()
    } else {
      setStep('form')
      setError(t('invalidPersonalNumber'))
    }
  }

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
          {step === 'form' && (
            <div>
              <h2 className="mb-2 text-xl font-semibold text-petrol">{t('loginTitle')}</h2>
              <p className="mb-6 text-sm text-petrol-60">{t('loginSubtitle')}</p>

              <div className="mb-4">
                <label
                  htmlFor="personalNumber"
                  className="mb-2 block text-sm font-medium text-petrol"
                >
                  {t('personalNumber')}
                </label>
                <input
                  id="personalNumber"
                  type="text"
                  value={personalNumber}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="YYYYMMDD-XXXX"
                  maxLength={13}
                  className="w-full rounded-lg border border-slate bg-sand px-4 py-3 text-petrol placeholder:text-petrol-60 focus:outline-none focus:ring-2 focus:ring-petrol"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin()
                  }}
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <button
                onClick={handleLogin}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-petrol px-6 py-3 font-medium text-white transition-colors hover:bg-petrol-80"
              >
                <BankIDIcon className="h-5 w-5 text-white" />
                {t('loginWithBankID')}
              </button>

              <Link
                href="/"
                className="mt-4 block text-center text-sm text-petrol-60 hover:text-petrol"
              >
                ← {t('backToHome')}
              </Link>
            </div>
          )}

          {step === 'authenticating' && (
            <div className="py-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-petrol">
                <BankIDIcon className="h-8 w-8 text-white" />
              </div>
              <p className="mb-2 font-medium text-petrol">{t('openBankIDApp')}</p>
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

function BankIDIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function ClinicalLoginPage() {
  const t = useTranslations('clinical.auth')
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Auto-login with demo user (Dr. Sara Lindqvist)
    const autoLogin = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'doctor@aleris.se', password: 'demo' }),
      })

      if (response.ok) {
        setIsSuccess(true)
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
          <h1 className="text-2xl font-bold text-petrol">Aleris Clinical</h1>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-soft p-8">
          {!isSuccess ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-petrol rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-petrol font-medium">{t('loginTitle')}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-petrol font-medium">{t('loginSuccess') || 'Welcome back!'}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

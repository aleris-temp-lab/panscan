'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function AdminLoginPage() {
  const t = useTranslations('admin.auth')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || t('invalidCredentials'))
      }
    } catch {
      setError(t('invalidCredentials'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-petrol flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <span className="text-2xl text-petrol font-bold">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Aleris Admin</h1>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-soft p-8">
          <h2 className="text-xl font-semibold text-petrol mb-2">
            {t('loginTitle')}
          </h2>
          <p className="text-petrol-60 mb-6">
            {t('loginSubtitle')}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-petrol">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aleris.se"
                className="w-full px-4 py-3 rounded-lg border border-slate bg-white text-petrol placeholder:text-petrol-60 focus:outline-none focus:ring-2 focus:ring-petrol"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-petrol">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate bg-white text-petrol placeholder:text-petrol-60 focus:outline-none focus:ring-2 focus:ring-petrol"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange text-white py-3 rounded-lg font-medium hover:bg-orange-80 transition-colors disabled:opacity-50"
            >
              {isLoading ? '...' : t('login')}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-sand rounded-lg">
            <p className="text-sm text-petrol-60">
              <strong>Demo account:</strong>
            </p>
            <ul className="text-sm text-petrol-60 mt-2 space-y-1">
              <li>admin@aleris.se (Maria Johansson)</li>
            </ul>
            <p className="text-sm text-petrol-60 mt-2">Any password works!</p>
          </div>
        </div>
      </div>
    </main>
  )
}

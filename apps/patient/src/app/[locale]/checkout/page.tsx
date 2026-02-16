'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

// Demo packages data for lookup
const packagesData: Record<string, { name: string; price: number; currency: string }> = {
  'blood-panel-basic': { name: 'Basic Blood Panel', price: 1495, currency: 'SEK' },
  'blood-panel-comprehensive': { name: 'Comprehensive Blood Panel', price: 2495, currency: 'SEK' },
  'dexa-scan': { name: 'DEXA Body Scan', price: 1995, currency: 'SEK' },
  'executive-health': { name: 'Executive Health Check', price: 8995, currency: 'SEK' },
  'hormone-panel-male': { name: 'Male Hormone Panel', price: 1895, currency: 'SEK' },
  'hormone-panel-female': { name: 'Female Hormone Panel', price: 1895, currency: 'SEK' },
}

export default function CheckoutPage() {
  const router = useRouter()
  const t = useTranslations('patient.checkout')
  const [cart, setCart] = useState<{ packageId: string; packageName: string } | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'klarna' | 'card'>('klarna')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const cartData = sessionStorage.getItem('cart')
    if (cartData) {
      setCart(JSON.parse(cartData))
    }
  }, [])

  const packageInfo = cart ? packagesData[cart.packageId] : null

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Clear cart and redirect to booking
    sessionStorage.removeItem('cart')
    sessionStorage.setItem('purchased', cart?.packageId || '')
    router.push('/booking')
  }

  if (!cart || !packageInfo) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-center">
          <p className="text-petrol-60 mb-4">No items in cart</p>
          <Link href="/packages" className="text-orange hover:text-orange-80">
            Browse packages →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-white border-b border-slate">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo width={100} height={36} />
          </Link>
          <LocaleSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-petrol mb-8">{t('title')}</h1>

        <div className="grid gap-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">{t('orderSummary')}</h2>
            <div className="flex justify-between items-center py-4 border-b border-slate">
              <span className="text-petrol">{packageInfo.name}</span>
              <span className="font-medium text-petrol">
                {packageInfo.price.toLocaleString()} {packageInfo.currency}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="font-semibold text-petrol">{t('total')}</span>
              <span className="text-2xl font-bold text-petrol">
                {packageInfo.price.toLocaleString()} {packageInfo.currency}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">{t('payWith')}</h2>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('klarna')}
                className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-colors ${
                  paymentMethod === 'klarna'
                    ? 'border-petrol bg-sand'
                    : 'border-slate hover:border-petrol-60'
                }`}
              >
                <div className="w-12 h-8 bg-pink-100 rounded flex items-center justify-center">
                  <span className="text-pink-600 font-bold text-sm">Klarna</span>
                </div>
                <span className="text-petrol font-medium">{t('klarna')}</span>
                {paymentMethod === 'klarna' && (
                  <span className="ml-auto text-petrol">✓</span>
                )}
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-petrol bg-sand'
                    : 'border-slate hover:border-petrol-60'
                }`}
              >
                <div className="w-12 h-8 bg-slate rounded flex items-center justify-center">
                  <span className="text-petrol text-lg">💳</span>
                </div>
                <span className="text-petrol font-medium">{t('card')}</span>
                {paymentMethod === 'card' && (
                  <span className="ml-auto text-petrol">✓</span>
                )}
              </button>
            </div>
          </div>

          {/* Complete Purchase Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-orange text-white py-4 rounded-lg font-medium hover:bg-orange-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? t('processing') : t('complete')}
          </button>

          <p className="text-center text-sm text-petrol-60">
            🔒 {t('secure')}
          </p>
          <p className="text-center text-xs text-petrol-60">
            {t('termsNotice')}
          </p>
        </div>
      </main>
    </div>
  )
}

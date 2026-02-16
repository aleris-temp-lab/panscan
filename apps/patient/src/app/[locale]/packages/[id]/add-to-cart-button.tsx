'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface AddToCartButtonProps {
  packageId: string
  packageName: string
}

export function AddToCartButton({ packageId, packageName }: AddToCartButtonProps) {
  const router = useRouter()
  const t = useTranslations('patient.packages')

  const handleBook = () => {
    // In a real app, we'd add to cart/session storage
    // For demo, we'll store in sessionStorage and redirect to checkout
    sessionStorage.setItem('cart', JSON.stringify({ packageId, packageName }))
    router.push('/checkout')
  }

  return (
    <button
      onClick={handleBook}
      className="w-full bg-orange text-white py-3 rounded-lg font-medium hover:bg-orange-80 transition-colors"
    >
      {t('bookNow')}
    </button>
  )
}

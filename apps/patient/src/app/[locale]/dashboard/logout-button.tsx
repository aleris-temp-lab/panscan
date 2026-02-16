'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function LogoutButton() {
  const router = useRouter()
  const t = useTranslations('common')

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm text-petrol-60 hover:text-petrol transition-colors"
    >
      {t('logout')}
    </button>
  )
}

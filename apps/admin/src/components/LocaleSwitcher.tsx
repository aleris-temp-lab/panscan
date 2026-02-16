'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { LanguageSwitcher } from '@panscan/ui'

interface LocaleSwitcherProps {
  variant?: 'light' | 'dark'
  className?: string
}

export function LocaleSwitcher({ variant = 'light', className }: LocaleSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <LanguageSwitcher
      currentLocale={locale}
      onLocaleChange={handleLocaleChange}
      variant={variant}
      className={className}
    />
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from './utils'

export interface Language {
  code: string
  name: string
  flag: string
}

export const defaultLanguages: Language[] = [
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export interface LanguageSwitcherProps {
  currentLocale: string
  languages?: Language[]
  onLocaleChange: (locale: string) => void
  variant?: 'light' | 'dark'
  className?: string
}

export function LanguageSwitcher({
  currentLocale,
  languages = defaultLanguages,
  onLocaleChange,
  variant = 'light',
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((l) => l.code === currentLocale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (locale: string) => {
    onLocaleChange(locale)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
          variant === 'light'
            ? 'hover:bg-slate text-petrol'
            : 'hover:bg-petrol-80 text-white'
        )}
        aria-label="Select language"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 overflow-hidden',
            variant === 'light' ? 'bg-white border border-slate' : 'bg-petrol-80 border border-petrol-60'
          )}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleSelect(language.code)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left',
                variant === 'light'
                  ? 'hover:bg-sand text-petrol'
                  : 'hover:bg-petrol text-white',
                currentLocale === language.code && (variant === 'light' ? 'bg-sand' : 'bg-petrol')
              )}
            >
              <span className="text-base">{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

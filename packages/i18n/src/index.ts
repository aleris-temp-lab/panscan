export const locales = ['sv', 'no', 'da', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'sv'

export const localeNames: Record<Locale, string> = {
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  en: 'English',
}

export const localeCountries: Record<Locale, string> = {
  sv: 'SE',
  no: 'NO',
  da: 'DK',
  en: 'EN',
}

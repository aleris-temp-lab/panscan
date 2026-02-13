import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

// Import messages statically
import sv from '@panscan/i18n/messages/sv.json'
import no from '@panscan/i18n/messages/no.json'
import da from '@panscan/i18n/messages/da.json'
import en from '@panscan/i18n/messages/en.json'

const messages = { sv, no, da, en } as const

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages],
  }
})

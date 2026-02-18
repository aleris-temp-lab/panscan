'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ScreeningStep =
  | 'welcome'
  | 'diagnosis'
  | 'referral'
  | 'waitTime'
  | 'residency'
  | 'evaluating'
  | 'done'

type GateResult = 'eligible' | 'ineligible' | null

interface ScreeningAnswers {
  hasDiagnosis: boolean | null
  hasReferral: boolean | null
  longWaitTime: boolean | null
  isSwedishResident: boolean | null
}

export default function ScreeningPage() {
  const t = useTranslations('patient.screening')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [step, setStep] = useState<ScreeningStep>('welcome')
  const [gateResult, setGateResult] = useState<GateResult>(null)
  const [answers, setAnswers] = useState<ScreeningAnswers>({
    hasDiagnosis: null,
    hasReferral: null,
    longWaitTime: null,
    isSwedishResident: null,
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addAssistantMessage = useCallback((content: string) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}-${Math.random()}`, role: 'assistant', content },
        ])
        setIsTyping(false)
        resolve()
      }, 1000)
    })
  }, [])

  // Welcome message
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const init = async () => {
      await addAssistantMessage(t('welcome'))
      await addAssistantMessage(t('questions.diagnosis'))
      setStep('diagnosis')
    }
    init()
  }, [addAssistantMessage, t])

  const parseYesNo = (text: string): boolean | null => {
    const lower = text.toLowerCase().trim()
    const yesPatterns = ['ja', 'yes', 'japp', 'absolut', 'precis', 'stämmer', 'det stämmer', 'korrekt']
    const noPatterns = ['nej', 'no', 'nope', 'inte', 'inga', 'det stämmer inte']

    if (yesPatterns.some((p) => lower.includes(p))) return true
    if (noPatterns.some((p) => lower.includes(p))) return false
    return null
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping || step === 'done' || step === 'evaluating') return

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput('')

    const answer = parseYesNo(userInput)

    if (answer === null) {
      await addAssistantMessage(t('clarify'))
      return
    }

    switch (step) {
      case 'diagnosis': {
        setAnswers((prev) => ({ ...prev, hasDiagnosis: answer }))
        if (!answer) {
          setStep('done')
          setGateResult('ineligible')
          await addAssistantMessage(t('ineligible.noDiagnosis'))
          return
        }
        await addAssistantMessage(t('questions.referral'))
        setStep('referral')
        break
      }
      case 'referral': {
        setAnswers((prev) => ({ ...prev, hasReferral: answer }))
        if (!answer) {
          setStep('done')
          setGateResult('ineligible')
          await addAssistantMessage(t('ineligible.noReferral'))
          return
        }
        await addAssistantMessage(t('questions.waitTime'))
        setStep('waitTime')
        break
      }
      case 'waitTime': {
        setAnswers((prev) => ({ ...prev, longWaitTime: answer }))
        if (!answer) {
          setStep('done')
          setGateResult('ineligible')
          await addAssistantMessage(t('ineligible.shortWait'))
          return
        }
        await addAssistantMessage(t('questions.residency'))
        setStep('residency')
        break
      }
      case 'residency': {
        setAnswers((prev) => ({ ...prev, isSwedishResident: answer }))
        setStep('evaluating')
        if (!answer) {
          setStep('done')
          setGateResult('ineligible')
          await addAssistantMessage(t('ineligible.notResident'))
          return
        }
        // All criteria met
        setStep('done')
        setGateResult('eligible')
        await addAssistantMessage(t('eligible'))
        break
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      {/* Header */}
      <header className="border-b border-slate bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center">
            <Logo width={100} height={36} />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/" className="text-petrol hover:text-orange">
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Header */}
      <div className="border-b border-slate bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-petrol">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="font-semibold text-petrol">{t('title')}</h1>
              <p className="text-sm text-petrol-60">{t('subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-petrol text-white'
                    : 'bg-white text-petrol shadow-soft'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-3 text-petrol-60 shadow-soft">
                {t('typing')}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Gate Result Card */}
      {gateResult && (
        <div className="border-t border-slate bg-white">
          <div className="mx-auto max-w-4xl px-4 py-6">
            {gateResult === 'eligible' ? (
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-800">
                    {t('result.eligibleTitle')}
                  </h3>
                </div>
                <p className="mb-4 text-green-700">{t('result.eligibleDescription')}</p>
                <Link
                  href="/auth/login"
                  className="inline-block rounded-lg bg-petrol px-6 py-3 font-medium text-white transition-colors hover:bg-petrol-80"
                >
                  {t('result.loginWithBankID')}
                </Link>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-slate bg-sand p-6">
                <div className="mb-2 flex items-center gap-2">
                  <svg
                    className="h-6 w-6 text-petrol-60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-petrol">
                    {t('result.ineligibleTitle')}
                  </h3>
                </div>
                <p className="mb-4 text-petrol-60">{t('result.ineligibleDescription')}</p>
                <div className="flex gap-3">
                  <Link
                    href="/"
                    className="inline-block rounded-lg border-2 border-petrol px-6 py-3 font-medium text-petrol transition-colors hover:bg-petrol hover:text-white"
                  >
                    {t('result.backToHome')}
                  </Link>
                  <a
                    href="https://www.aleris.se"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-lg bg-orange px-6 py-3 font-medium text-white transition-colors hover:bg-orange-80"
                  >
                    {t('result.contactUs')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Answer Buttons */}
      {step !== 'welcome' && step !== 'evaluating' && step !== 'done' && !isTyping && (
        <div className="border-t border-slate bg-sand">
          <div className="mx-auto max-w-4xl px-4 py-3">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setInput('Ja')
                  setTimeout(() => {
                    const form = document.querySelector('form')
                    form?.requestSubmit()
                  }, 50)
                }}
                className="rounded-full bg-white px-6 py-2 text-sm font-medium text-petrol transition-colors hover:bg-slate"
              >
                {t('answerYes')}
              </button>
              <button
                onClick={() => {
                  setInput('Nej')
                  setTimeout(() => {
                    const form = document.querySelector('form')
                    form?.requestSubmit()
                  }, 50)
                }}
                className="rounded-full bg-white px-6 py-2 text-sm font-medium text-petrol transition-colors hover:bg-slate"
              >
                {t('answerNo')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      {step !== 'done' && (
        <div className="border-t border-slate bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                className="flex-1 rounded-lg border border-slate bg-sand px-4 py-3 text-petrol placeholder:text-petrol-60 focus:outline-none focus:ring-2 focus:ring-petrol"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="rounded-lg bg-orange px-6 py-3 font-medium text-white transition-colors hover:bg-orange-80 disabled:opacity-50"
              >
                {t('send')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

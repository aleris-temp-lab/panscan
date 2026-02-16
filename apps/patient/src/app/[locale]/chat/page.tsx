'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Demo responses from Emma
const emmaResponses: Record<string, string> = {
  default: "Hello! I'm Emma, your personal health advisor. I can help you understand your test results, provide lifestyle recommendations, and answer questions about your health journey. What would you like to know?",
  results: "I can see your recent Comprehensive Blood Panel from February 1st shows all markers within normal range - great news! Your cholesterol levels are excellent, with an HDL of 1.5 mmol/L which is in the optimal range. Your HbA1c of 5.4% indicates excellent blood sugar control. Is there a specific marker you'd like me to explain in more detail?",
  lifestyle: "Based on your results, here are some personalized recommendations:\n\n1. **Vitamin D**: Your level of 68 nmol/L is good, but consider maintaining it through winter with supplements (1000-2000 IU daily) or more sun exposure.\n\n2. **Exercise**: Your body composition looks great! To maintain this, aim for 150+ minutes of moderate exercise weekly.\n\n3. **Diet**: Continue with your current approach - your metabolic markers are excellent. Consider increasing omega-3 rich foods for heart health.\n\nWould you like more specific advice on any of these areas?",
  nextsteps: "Based on your health profile, I recommend:\n\n1. **Schedule a follow-up** - Your annual blood panel is due in about 10 months\n\n2. **DEXA Scan** - Consider scheduling a follow-up scan in 6 months to track body composition trends\n\n3. **Consultation** - Would you like to book a video consultation with Dr. Lindqvist to discuss your results in more detail?\n\nI can help you book any of these. What would you like to do?",
}

export default function ChatPage() {
  const t = useTranslations('patient.chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial greeting from Emma
    setTimeout(() => {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: emmaResponses.default,
        timestamp: new Date(),
      }])
    }, 500)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getEmmaResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase()
    if (lower.includes('result') || lower.includes('blood') || lower.includes('test')) {
      return emmaResponses.results
    }
    if (lower.includes('lifestyle') || lower.includes('recommend') || lower.includes('advice') || lower.includes('diet') || lower.includes('exercise')) {
      return emmaResponses.lifestyle
    }
    if (lower.includes('next') || lower.includes('should') || lower.includes('book') || lower.includes('schedule')) {
      return emmaResponses.nextsteps
    }
    return "I understand you're asking about your health. Could you be more specific? I can help you with:\n\n• Understanding your test results\n• Lifestyle recommendations\n• Booking follow-up appointments\n• General health questions\n\nWhat would you like to know more about?"
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate Emma typing
    await new Promise(resolve => setTimeout(resolve, 1500))

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getEmmaResponse(input),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Logo width={100} height={36} />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/dashboard" className="text-petrol hover:text-orange">
              ← Back to dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Header */}
      <div className="bg-white border-b border-slate">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center">
              <span className="text-2xl">👩‍⚕️</span>
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
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-petrol text-white'
                    : 'bg-white shadow-soft text-petrol'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-soft rounded-2xl px-4 py-3 text-petrol-60">
                {t('typing')}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="bg-sand border-t border-slate">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => handleSuggestion('Explain my latest results')}
                className="px-4 py-2 bg-white rounded-full text-sm text-petrol hover:bg-slate transition-colors whitespace-nowrap"
              >
                {t('suggestions.explainResults')}
              </button>
              <button
                onClick={() => handleSuggestion('Give me lifestyle recommendations')}
                className="px-4 py-2 bg-white rounded-full text-sm text-petrol hover:bg-slate transition-colors whitespace-nowrap"
              >
                {t('suggestions.lifestyle')}
              </button>
              <button
                onClick={() => handleSuggestion('What should I do next?')}
                className="px-4 py-2 bg-white rounded-full text-sm text-petrol hover:bg-slate transition-colors whitespace-nowrap"
              >
                {t('suggestions.nextSteps')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-slate">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              className="flex-1 px-4 py-3 rounded-lg border border-slate bg-sand text-petrol placeholder:text-petrol-60 focus:outline-none focus:ring-2 focus:ring-petrol"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-orange text-white rounded-lg font-medium hover:bg-orange-80 transition-colors disabled:opacity-50"
            >
              {t('send')}
            </button>
          </form>
          <p className="text-xs text-petrol-60 text-center mt-3">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </div>
  )
}

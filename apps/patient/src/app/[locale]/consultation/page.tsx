'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

type ConsultationState = 'waiting' | 'ready' | 'in-call' | 'ended'

export default function ConsultationPage() {
  const t = useTranslations('patient.consultation')
  const [state, setState] = useState<ConsultationState>('waiting')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [duration, setDuration] = useState(0)

  // Demo: Auto-transition to ready after 3 seconds
  useEffect(() => {
    if (state === 'waiting') {
      const timer = setTimeout(() => setState('ready'), 3000)
      return () => clearTimeout(timer)
    }
  }, [state])

  // Call duration timer
  useEffect(() => {
    if (state === 'in-call') {
      const interval = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [state])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleJoin = () => {
    setState('in-call')
  }

  const handleEnd = () => {
    setState('ended')
  }

  if (state === 'ended') {
    return (
      <div className="min-h-screen bg-petrol flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-soft p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-petrol mb-2">{t('callEnded')}</h1>
          <p className="text-petrol-60 mb-4">{t('callDuration')}: {formatDuration(duration)}</p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-petrol text-white py-3 rounded-lg font-medium hover:bg-petrol-80 transition-colors"
            >
              {t('backToDashboard')}
            </Link>
            <Link
              href="/chat"
              className="block w-full border border-petrol text-petrol py-3 rounded-lg font-medium hover:bg-sand transition-colors"
            >
              {t('followUpWithEmma')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-petrol flex flex-col">
      {/* Header */}
      <header className="bg-petrol-80 border-b border-petrol-60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Logo width={80} height={29} variant="white" />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher variant="dark" />
            {state === 'in-call' && (
              <span className="text-white bg-red-500 px-3 py-1 rounded-full text-sm animate-pulse">
                ● {t('live')} {formatDuration(duration)}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {state === 'waiting' && (
          <div className="text-center text-white">
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">{t('connecting')}</h2>
            <p className="text-petrol-40">{t('pleaseWait')}</p>
          </div>
        )}

        {state === 'ready' && (
          <div className="text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">👩‍⚕️</span>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Dr. Sara Lindqvist</h2>
            <p className="text-petrol-40 mb-8">{t('readyToJoin')}</p>
            <button
              onClick={handleJoin}
              className="px-8 py-4 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors text-lg"
            >
              {t('joinCall')}
            </button>
          </div>
        )}

        {state === 'in-call' && (
          <div className="w-full max-w-4xl">
            {/* Main video (doctor) */}
            <div className="relative bg-petrol-80 rounded-2xl aspect-video flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">👩‍⚕️</span>
                </div>
                <p className="text-white font-medium">Dr. Sara Lindqvist</p>
              </div>

              {/* Self view (patient) - picture in picture */}
              <div className="absolute bottom-4 right-4 w-40 aspect-video bg-petrol-60 rounded-lg flex items-center justify-center">
                {isVideoOff ? (
                  <span className="text-white text-2xl">📷</span>
                ) : (
                  <span className="text-white text-2xl">👤</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {state === 'in-call' && (
        <div className="bg-petrol-80 border-t border-petrol-60">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-white text-petrol'
                }`}
              >
                <span className="text-2xl">{isMuted ? '🔇' : '🎤'}</span>
              </button>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOff ? 'bg-red-500 text-white' : 'bg-white text-petrol'
                }`}
              >
                <span className="text-2xl">{isVideoOff ? '📷' : '🎥'}</span>
              </button>
              <button
                onClick={handleEnd}
                className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <span className="text-2xl">📞</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

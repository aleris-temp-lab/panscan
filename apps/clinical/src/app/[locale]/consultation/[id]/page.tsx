'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

type ConsultationState = 'waiting' | 'ready' | 'in-call' | 'ended'

// Demo patient data
const patients: Record<string, { name: string; initials: string; condition: string }> = {
  'patient-1': { name: 'Anna Andersson', initials: 'AA', condition: 'Blood Panel Review' },
  'patient-2': { name: 'Erik Svensson', initials: 'ES', condition: 'DEXA Consultation' },
  'patient-3': { name: 'Maria Johansson', initials: 'MJ', condition: 'Follow-up' },
  'patient-4': { name: 'Lars Nilsson', initials: 'LN', condition: 'Cardio Consultation' },
  'patient-5': { name: 'Karin Berg', initials: 'KB', condition: 'Hormone Panel Review' },
  'patient-6': { name: 'Johan Lindström', initials: 'JL', condition: 'Executive Health Review' },
}

export default function ClinicalConsultationPage() {
  const params = useParams()
  const patientId = params.id as string
  const t = useTranslations('clinical.consultation')

  const [state, setState] = useState<ConsultationState>('waiting')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [duration, setDuration] = useState(0)
  const [notes, setNotes] = useState('')

  const patient = patients[patientId] || { name: 'Unknown Patient', initials: '??', condition: 'Consultation' }

  // Demo: Auto-transition to ready after 2 seconds
  useEffect(() => {
    if (state === 'waiting') {
      const timer = setTimeout(() => setState('ready'), 2000)
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

  const handleStart = () => {
    setState('in-call')
  }

  const handleEnd = () => {
    setState('ended')
  }

  if (state === 'ended') {
    return (
      <div className="min-h-screen bg-petrol flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-soft p-8 max-w-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-petrol mb-2">{t('callEnded')}</h1>
            <p className="text-petrol-60">
              {t('consultationWith')} {patient.name} • {formatDuration(duration)}
            </p>
          </div>

          {/* Notes Summary */}
          {notes && (
            <div className="bg-sand rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-petrol mb-2">{t('yourNotes')}</p>
              <p className="text-petrol text-sm">{notes}</p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href={`/patients/${patientId}`}
              className="block w-full bg-petrol text-white py-3 rounded-lg font-medium hover:bg-petrol-80 transition-colors text-center"
            >
              {t('viewPatientRecord')}
            </Link>
            <Link
              href="/appointments"
              className="block w-full border border-petrol text-petrol py-3 rounded-lg font-medium hover:bg-sand transition-colors text-center"
            >
              {t('backToSchedule')}
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
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

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          {state === 'waiting' && (
            <div className="text-center text-white">
              <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">{t('waitingForPatient')}</h2>
              <p className="text-petrol-40">{patient.name} - {patient.condition}</p>
            </div>
          )}

          {state === 'ready' && (
            <div className="text-center">
              <div className="w-32 h-32 bg-petrol-60 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-4xl font-bold">{patient.initials}</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">{patient.name}</h2>
              <p className="text-petrol-40 mb-2">{patient.condition}</p>
              <p className="text-green-400 mb-8">{t('patientReady')}</p>
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors text-lg"
              >
                {t('startConsultation')}
              </button>
            </div>
          )}

          {state === 'in-call' && (
            <div className="w-full max-w-4xl">
              {/* Main video (patient) */}
              <div className="relative bg-petrol-80 rounded-2xl aspect-video flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-petrol-60 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-3xl font-bold">{patient.initials}</span>
                  </div>
                  <p className="text-white font-medium">{patient.name}</p>
                  <p className="text-petrol-40 text-sm">{patient.condition}</p>
                </div>

                {/* Self view (doctor) - picture in picture */}
                <div className="absolute bottom-4 right-4 w-40 aspect-video bg-petrol-60 rounded-lg flex items-center justify-center">
                  {isVideoOff ? (
                    <span className="text-white text-2xl">📷</span>
                  ) : (
                    <span className="text-white text-2xl">👩‍⚕️</span>
                  )}
                </div>

                {/* Screen share indicator */}
                {isScreenSharing && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-blue-500 text-white text-sm rounded">
                    📺 {t('sharingScreen')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Notes (only visible during call) */}
        {state === 'in-call' && (
          <div className="w-80 bg-white border-l border-slate flex flex-col">
            <div className="p-4 border-b border-slate">
              <h3 className="font-semibold text-petrol">{t('consultationNotes')}</h3>
              <p className="text-sm text-petrol-60">{patient.name}</p>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                className="w-full h-full p-3 bg-sand rounded-lg text-petrol placeholder:text-petrol-60 resize-none focus:outline-none focus:ring-2 focus:ring-petrol"
              />
            </div>
            <div className="p-4 border-t border-slate">
              <Link
                href={`/patients/${patientId}`}
                className="block w-full text-center text-orange hover:text-orange-80 text-sm"
              >
                {t('openPatientRecord')} →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {state === 'in-call' && (
        <div className="bg-petrol-80 border-t border-petrol-60">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-white text-petrol'
                }`}
                title={isMuted ? t('unmute') : t('mute')}
              >
                <span className="text-2xl">{isMuted ? '🔇' : '🎤'}</span>
              </button>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOff ? 'bg-red-500 text-white' : 'bg-white text-petrol'
                }`}
                title={isVideoOff ? t('turnOnCamera') : t('turnOffCamera')}
              >
                <span className="text-2xl">{isVideoOff ? '📷' : '🎥'}</span>
              </button>
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isScreenSharing ? 'bg-blue-500 text-white' : 'bg-white text-petrol'
                }`}
                title={isScreenSharing ? t('stopSharing') : t('shareScreen')}
              >
                <span className="text-2xl">📺</span>
              </button>
              <button
                onClick={handleEnd}
                className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                title={t('endCall')}
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

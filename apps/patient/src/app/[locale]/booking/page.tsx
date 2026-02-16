'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

// Demo clinics
const clinics = [
  { id: 'stockholm-city', name: 'Aleris Stockholm City', address: 'Sveavägen 52, Stockholm' },
  { id: 'stockholm-sodermalm', name: 'Aleris Södermalm', address: 'Götgatan 78, Stockholm' },
  { id: 'gothenburg', name: 'Aleris Göteborg', address: 'Kungsportsavenyen 31, Göteborg' },
  { id: 'malmo', name: 'Aleris Malmö', address: 'Stortorget 8, Malmö' },
]

// Demo time slots
const generateTimeSlots = (date: string) => {
  const slots = []
  const baseDate = new Date(date)
  const dayOfWeek = baseDate.getDay()

  // No slots on weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) return []

  const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00']

  // Randomly remove some slots to simulate availability
  for (const time of times) {
    if (Math.random() > 0.3) {
      slots.push(time)
    }
  }
  return slots
}

// Generate next 14 days
const generateDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

export default function BookingPage() {
  const router = useRouter()
  const t = useTranslations('patient.booking')
  const [selectedClinic, setSelectedClinic] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [dates] = useState(generateDates())

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate))
      setSelectedTime('')
    }
  }, [selectedDate])

  const handleConfirm = () => {
    setIsConfirmed(true)
    // In real app, would save to database
    setTimeout(() => {
      router.push('/dashboard')
    }, 3000)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-soft p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-petrol mb-2">{t('confirmed')}</h1>
          <p className="text-petrol-60 mb-4">{t('confirmationMessage')}</p>
          <div className="bg-sand rounded-lg p-4 text-left">
            <p className="text-sm text-petrol-60">Clinic</p>
            <p className="font-medium text-petrol mb-2">
              {clinics.find(c => c.id === selectedClinic)?.name}
            </p>
            <p className="text-sm text-petrol-60">Date & Time</p>
            <p className="font-medium text-petrol">
              {formatDate(selectedDate)} at {selectedTime}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-white border-b border-slate">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo width={100} height={36} />
          </Link>
          <LocaleSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-petrol mb-8">{t('title')}</h1>

        <div className="space-y-6">
          {/* Select Clinic */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">{t('selectClinic')}</h2>
            <div className="space-y-3">
              {clinics.map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedClinic === clinic.id
                      ? 'border-petrol bg-sand'
                      : 'border-slate hover:border-petrol-60'
                  }`}
                >
                  <p className="font-medium text-petrol">{clinic.name}</p>
                  <p className="text-sm text-petrol-60">{clinic.address}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Select Date */}
          {selectedClinic && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-petrol mb-4">{t('selectDate')}</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const dateObj = new Date(date)
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6
                  return (
                    <button
                      key={date}
                      onClick={() => !isWeekend && setSelectedDate(date)}
                      disabled={isWeekend}
                      className={`flex-shrink-0 w-20 p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedDate === date
                          ? 'border-petrol bg-petrol text-white'
                          : isWeekend
                          ? 'border-slate bg-slate-50 text-petrol-40 cursor-not-allowed'
                          : 'border-slate hover:border-petrol-60'
                      }`}
                    >
                      <p className="text-xs">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                      <p className="text-lg font-bold">{dateObj.getDate()}</p>
                      <p className="text-xs">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Select Time */}
          {selectedDate && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-petrol mb-4">{t('selectTime')}</h2>
              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedTime === time
                          ? 'border-petrol bg-petrol text-white'
                          : 'border-slate hover:border-petrol-60'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-petrol-60 text-center py-4">{t('noSlots')}</p>
              )}
            </div>
          )}

          {/* Confirm Button */}
          {selectedClinic && selectedDate && selectedTime && (
            <button
              onClick={handleConfirm}
              className="w-full bg-orange text-white py-4 rounded-lg font-medium hover:bg-orange-80 transition-colors"
            >
              {t('confirm')}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

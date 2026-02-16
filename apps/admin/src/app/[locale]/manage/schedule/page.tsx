import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../../dashboard/logout-button'

// Demo schedule data
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const scheduleData: Record<string, Record<string, { type: string; staff?: string; booked?: boolean }>> = {
  'Monday': {
    '08:00': { type: 'blood-draw', staff: 'Johan Berg', booked: true },
    '09:00': { type: 'blood-draw', staff: 'Johan Berg', booked: true },
    '10:00': { type: 'dexa', staff: 'Johan Berg', booked: false },
    '11:00': { type: 'video', staff: 'Dr. Sara Lindqvist', booked: true },
    '14:00': { type: 'video', staff: 'Dr. Sara Lindqvist', booked: false },
    '15:00': { type: 'video', staff: 'Emma Karlsson', booked: true },
  },
  'Tuesday': {
    '08:00': { type: 'blood-draw', staff: 'Johan Berg', booked: true },
    '09:00': { type: 'blood-draw', staff: 'Johan Berg', booked: false },
    '10:00': { type: 'dexa', staff: 'Johan Berg', booked: true },
    '11:00': { type: 'video', staff: 'Dr. Magnus Eriksson', booked: true },
    '14:00': { type: 'blood-draw', staff: 'Johan Berg', booked: false },
    '15:00': { type: 'video', staff: 'Dr. Sara Lindqvist', booked: false },
  },
  'Wednesday': {
    '09:00': { type: 'blood-draw', staff: 'Johan Berg', booked: true },
    '10:00': { type: 'blood-draw', staff: 'Johan Berg', booked: true },
    '11:00': { type: 'dexa', staff: 'Johan Berg', booked: false },
    '14:00': { type: 'video', staff: 'Dr. Sara Lindqvist', booked: true },
    '15:00': { type: 'video', staff: 'Emma Karlsson', booked: false },
    '16:00': { type: 'video', staff: 'Emma Karlsson', booked: true },
  },
  'Thursday': {
    '08:00': { type: 'blood-draw', staff: 'Johan Berg', booked: false },
    '09:00': { type: 'blood-draw', staff: 'Johan Berg', booked: true },
    '10:00': { type: 'dexa', staff: 'Johan Berg', booked: true },
    '11:00': { type: 'video', staff: 'Dr. Magnus Eriksson', booked: false },
    '14:00': { type: 'video', staff: 'Dr. Sara Lindqvist', booked: true },
  },
  'Friday': {
    '08:00': { type: 'blood-draw', staff: 'Johan Berg', booked: true },
    '09:00': { type: 'blood-draw', staff: 'Johan Berg', booked: false },
    '10:00': { type: 'video', staff: 'Dr. Sara Lindqvist', booked: true },
    '11:00': { type: 'video', staff: 'Dr. Sara Lindqvist', booked: false },
  },
}

const slotTypes = [
  { id: 'blood-draw', name: 'Blood Draw', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'dexa', name: 'DEXA Scan', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'video', name: 'Video Consultation', color: 'bg-purple-100 text-purple-800 border-purple-200' },
]

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getStaffSession()
  if (!session) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'admin') {
    redirect('/auth/login')
  }

  const t = await getTranslations('admin.schedule')
  const { user } = session

  // Calculate stats
  const totalSlots = Object.values(scheduleData).reduce((acc, day) => acc + Object.keys(day).length, 0)
  const bookedSlots = Object.values(scheduleData).reduce(
    (acc, day) => acc + Object.values(day).filter(s => s.booked).length, 0
  )

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-petrol text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Logo width={100} height={36} variant="white" />
          </Link>
          <div className="flex items-center gap-4">
            <LocaleSwitcher variant="dark" />
            <span className="text-petrol-40">
              {user.firstName} {user.lastName}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <nav className="bg-white border-b border-slate">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <Link href="/dashboard" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.dashboard')}
            </Link>
            <Link href="/manage/products" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.products')}
            </Link>
            <Link href="/manage/people" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.people')}
            </Link>
            <Link href="/manage/schedule" className="py-4 text-petrol border-b-2 border-petrol font-medium">
              {t('nav.schedule')}
            </Link>
            <Link href="/manage/clinics" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.clinics')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-petrol">{t('title')}</h1>
            <p className="text-petrol-60">{t('subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate rounded-lg text-petrol hover:bg-sand transition-colors">
              ← {t('previousWeek')}
            </button>
            <button className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors">
              {t('thisWeek')}
            </button>
            <button className="px-4 py-2 bg-white border border-slate rounded-lg text-petrol hover:bg-sand transition-colors">
              {t('nextWeek')} →
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6">
          {slotTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded border ${type.color}`}>
                {type.name}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-petrol-60">{t('booked')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border-2 border-petrol-40 rounded-full" />
            <span className="text-sm text-petrol-60">{t('available')}</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="grid grid-cols-6">
            {/* Time column header */}
            <div className="bg-petrol-20 p-4 border-r border-slate">
              <span className="font-medium text-petrol">{t('time')}</span>
            </div>
            {/* Day headers */}
            {weekDays.map((day) => (
              <div key={day} className="bg-petrol-20 p-4 text-center border-r border-slate last:border-r-0">
                <span className="font-medium text-petrol">{day}</span>
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time) => (
              <>
                <div key={`time-${time}`} className="p-4 border-t border-r border-slate bg-sand">
                  <span className="font-medium text-petrol">{time}</span>
                </div>
                {weekDays.map((day) => {
                  const slot = scheduleData[day]?.[time]
                  const typeInfo = slotTypes.find(t => t.id === slot?.type)

                  return (
                    <div
                      key={`${day}-${time}`}
                      className="p-2 border-t border-r border-slate last:border-r-0 min-h-[80px]"
                    >
                      {slot ? (
                        <div className={`p-2 rounded border ${typeInfo?.color || 'bg-gray-100'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">{typeInfo?.name}</span>
                            <div className={`w-2 h-2 rounded-full ${slot.booked ? 'bg-green-500' : 'bg-white border border-petrol-40'}`} />
                          </div>
                          <p className="text-xs text-petrol-80">{slot.staff}</p>
                        </div>
                      ) : (
                        <button className="w-full h-full flex items-center justify-center text-petrol-40 hover:bg-sand rounded transition-colors">
                          <span className="text-xl">+</span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">{totalSlots}</p>
            <p className="text-petrol-60 text-sm">{t('totalSlots')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{bookedSlots}</p>
            <p className="text-petrol-60 text-sm">{t('bookedSlots')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">{totalSlots - bookedSlots}</p>
            <p className="text-petrol-60 text-sm">{t('availableSlots')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-orange">
              {Math.round((bookedSlots / totalSlots) * 100)}%
            </p>
            <p className="text-petrol-60 text-sm">{t('utilization')}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

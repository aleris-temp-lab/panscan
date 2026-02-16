import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../../dashboard/logout-button'

// Demo clinics data
const clinics = [
  {
    id: 'clinic-1',
    name: 'Stockholm City',
    address: 'Kungsgatan 44, 111 35 Stockholm',
    country: 'SE',
    phone: '+46 8 123 45 67',
    email: 'stockholm@aleris.se',
    status: 'active',
    staff: 8,
    rooms: 4,
    services: ['Blood Draw', 'DEXA Scan', 'Video Consultation'],
    hours: {
      weekday: '07:00 - 18:00',
      saturday: '09:00 - 14:00',
      sunday: 'Closed',
    },
    stats: {
      appointments: 145,
      patients: 89,
      utilization: 78,
    },
  },
  {
    id: 'clinic-2',
    name: 'Gothenburg Central',
    address: 'Avenyn 12, 411 36 Gothenburg',
    country: 'SE',
    phone: '+46 31 987 65 43',
    email: 'gothenburg@aleris.se',
    status: 'active',
    staff: 5,
    rooms: 3,
    services: ['Blood Draw', 'Video Consultation'],
    hours: {
      weekday: '08:00 - 17:00',
      saturday: '10:00 - 14:00',
      sunday: 'Closed',
    },
    stats: {
      appointments: 98,
      patients: 67,
      utilization: 65,
    },
  },
  {
    id: 'clinic-3',
    name: 'Malmö South',
    address: 'Stortorget 8, 211 22 Malmö',
    country: 'SE',
    phone: '+46 40 456 78 90',
    email: 'malmo@aleris.se',
    status: 'active',
    staff: 4,
    rooms: 2,
    services: ['Blood Draw', 'DEXA Scan'],
    hours: {
      weekday: '08:00 - 16:00',
      saturday: 'Closed',
      sunday: 'Closed',
    },
    stats: {
      appointments: 67,
      patients: 45,
      utilization: 72,
    },
  },
  {
    id: 'clinic-4',
    name: 'Oslo Central',
    address: 'Karl Johans gate 25, 0159 Oslo',
    country: 'NO',
    phone: '+47 22 123 456',
    email: 'oslo@aleris.no',
    status: 'active',
    staff: 6,
    rooms: 3,
    services: ['Blood Draw', 'DEXA Scan', 'Video Consultation'],
    hours: {
      weekday: '07:30 - 17:30',
      saturday: '09:00 - 13:00',
      sunday: 'Closed',
    },
    stats: {
      appointments: 112,
      patients: 78,
      utilization: 81,
    },
  },
  {
    id: 'clinic-5',
    name: 'Copenhagen City',
    address: 'Strøget 45, 1160 Copenhagen',
    country: 'DK',
    phone: '+45 33 123 456',
    email: 'copenhagen@aleris.dk',
    status: 'coming-soon',
    staff: 0,
    rooms: 4,
    services: ['Blood Draw', 'DEXA Scan', 'Video Consultation'],
    hours: {
      weekday: 'TBD',
      saturday: 'TBD',
      sunday: 'Closed',
    },
    stats: {
      appointments: 0,
      patients: 0,
      utilization: 0,
    },
  },
]

const countryFlags: Record<string, string> = {
  SE: '🇸🇪',
  NO: '🇳🇴',
  DK: '🇩🇰',
}

export default async function ClinicsPage({
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

  const t = await getTranslations('admin.clinics')
  const { user } = session

  const activeClinics = clinics.filter(c => c.status === 'active')
  const totalStaff = activeClinics.reduce((acc, c) => acc + c.staff, 0)
  const totalRooms = activeClinics.reduce((acc, c) => acc + c.rooms, 0)
  const avgUtilization = Math.round(
    activeClinics.reduce((acc, c) => acc + c.stats.utilization, 0) / activeClinics.length
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
            <Link href="/manage/schedule" className="py-4 text-petrol-60 hover:text-petrol">
              {t('nav.schedule')}
            </Link>
            <Link href="/manage/clinics" className="py-4 text-petrol border-b-2 border-petrol font-medium">
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
          <button className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors">
            + {t('addClinic')}
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">{activeClinics.length}</p>
            <p className="text-petrol-60 text-sm">{t('activeClinics')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">{totalStaff}</p>
            <p className="text-petrol-60 text-sm">{t('totalStaff')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">{totalRooms}</p>
            <p className="text-petrol-60 text-sm">{t('totalRooms')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-orange">{avgUtilization}%</p>
            <p className="text-petrol-60 text-sm">{t('avgUtilization')}</p>
          </div>
        </div>

        {/* Clinics Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="bg-white rounded-xl shadow-soft overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{countryFlags[clinic.country]}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-petrol">{clinic.name}</h3>
                      <p className="text-sm text-petrol-60">{clinic.address}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    clinic.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {clinic.status === 'active' ? t('status.active') : t('status.comingSoon')}
                  </span>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-petrol-60">{t('phone')}</p>
                    <p className="text-petrol">{clinic.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-petrol-60">{t('email')}</p>
                    <p className="text-petrol text-sm">{clinic.email}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="mb-4">
                  <p className="text-sm text-petrol-60 mb-2">{t('hours')}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-sand rounded p-2">
                      <p className="text-petrol-60 text-xs">{t('weekdays')}</p>
                      <p className="text-petrol font-medium">{clinic.hours.weekday}</p>
                    </div>
                    <div className="bg-sand rounded p-2">
                      <p className="text-petrol-60 text-xs">{t('saturday')}</p>
                      <p className="text-petrol font-medium">{clinic.hours.saturday}</p>
                    </div>
                    <div className="bg-sand rounded p-2">
                      <p className="text-petrol-60 text-xs">{t('sunday')}</p>
                      <p className="text-petrol font-medium">{clinic.hours.sunday}</p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <p className="text-sm text-petrol-60 mb-2">{t('services')}</p>
                  <div className="flex flex-wrap gap-1">
                    {clinic.services.map((service, i) => (
                      <span key={i} className="px-2 py-1 bg-petrol-20 text-petrol text-xs rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                {clinic.status === 'active' && (
                  <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate">
                    <div className="text-center">
                      <p className="text-xl font-bold text-petrol">{clinic.staff}</p>
                      <p className="text-xs text-petrol-60">{t('staff')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-petrol">{clinic.rooms}</p>
                      <p className="text-xs text-petrol-60">{t('rooms')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-petrol">{clinic.stats.appointments}</p>
                      <p className="text-xs text-petrol-60">{t('appointments')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange">{clinic.stats.utilization}%</p>
                      <p className="text-xs text-petrol-60">{t('utilization')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-sand px-6 py-3 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-petrol text-white text-sm rounded hover:bg-petrol-80 transition-colors">
                  {t('editClinic')}
                </button>
                <button className="px-3 py-2 border border-petrol text-petrol text-sm rounded hover:bg-white transition-colors">
                  {t('viewSchedule')}
                </button>
                <button className="px-3 py-2 border border-petrol text-petrol text-sm rounded hover:bg-white transition-colors">
                  {t('viewStaff')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../../dashboard/logout-button'

// Demo staff data
const staff = [
  {
    id: 'staff-1',
    name: 'Dr. Sara Lindqvist',
    email: 'sara.lindqvist@aleris.se',
    role: 'doctor',
    specialty: 'General Practitioner',
    clinic: 'Stockholm City',
    status: 'active',
    skills: ['Blood Analysis', 'DEXA Interpretation', 'Video Consultation'],
  },
  {
    id: 'staff-2',
    name: 'Johan Berg',
    email: 'johan.berg@aleris.se',
    role: 'nurse',
    specialty: 'Phlebotomy',
    clinic: 'Stockholm City',
    status: 'active',
    skills: ['Blood Draw', 'DEXA Operation'],
  },
  {
    id: 'staff-3',
    name: 'Emma Karlsson',
    email: 'emma.karlsson@aleris.se',
    role: 'dietician',
    specialty: 'Clinical Nutrition',
    clinic: 'Gothenburg Central',
    status: 'active',
    skills: ['Nutrition Counseling', 'Weight Management', 'Video Consultation'],
  },
  {
    id: 'staff-4',
    name: 'Dr. Magnus Eriksson',
    email: 'magnus.eriksson@aleris.se',
    role: 'doctor',
    specialty: 'Endocrinology',
    clinic: 'Malmö South',
    status: 'active',
    skills: ['Hormone Analysis', 'Thyroid Specialist', 'Video Consultation'],
  },
  {
    id: 'staff-5',
    name: 'Anna Svensson',
    email: 'anna.svensson@aleris.se',
    role: 'nurse',
    specialty: 'General Care',
    clinic: 'Stockholm City',
    status: 'on-leave',
    skills: ['Blood Draw', 'Patient Care'],
  },
  {
    id: 'staff-6',
    name: 'Lars Nilsson',
    email: 'lars.nilsson@aleris.se',
    role: 'admin',
    specialty: 'Clinic Management',
    clinic: 'All Clinics',
    status: 'active',
    skills: ['Administration', 'Scheduling'],
  },
]

const roles = [
  { id: 'all', name: 'All Roles' },
  { id: 'doctor', name: 'Doctors' },
  { id: 'nurse', name: 'Nurses' },
  { id: 'dietician', name: 'Dieticians' },
  { id: 'admin', name: 'Administrators' },
]

export default async function PeoplePage({
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

  const t = await getTranslations('admin.people')
  const { user } = session

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
            <Link href="/manage/people" className="py-4 text-petrol border-b-2 border-petrol font-medium">
              {t('nav.people')}
            </Link>
            <Link href="/manage/schedule" className="py-4 text-petrol-60 hover:text-petrol">
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
          <button className="px-4 py-2 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors">
            + {t('addStaff')}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {roles.map((role) => (
            <button
              key={role.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                role.id === 'all'
                  ? 'bg-petrol text-white'
                  : 'bg-white text-petrol hover:bg-slate'
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        {/* Staff Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((person) => (
            <div key={person.id} className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-petrol-20 rounded-full flex items-center justify-center">
                    <span className="text-petrol font-medium">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-petrol">{person.name}</h3>
                    <p className="text-sm text-petrol-60">{person.specialty}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  person.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {person.status === 'active' ? t('status.active') : t('status.onLeave')}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-petrol-60">{t('role')}:</span>
                  <span className="text-petrol capitalize">{person.role}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-petrol-60">{t('clinic')}:</span>
                  <span className="text-petrol">{person.clinic}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-petrol-60">{t('email')}:</span>
                  <span className="text-petrol text-xs">{person.email}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm text-petrol-60 mb-2">{t('skills')}:</p>
                <div className="flex flex-wrap gap-1">
                  {person.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-sand text-petrol text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-petrol text-white text-sm rounded hover:bg-petrol-80 transition-colors">
                  {t('editProfile')}
                </button>
                <button className="px-3 py-2 border border-petrol text-petrol text-sm rounded hover:bg-sand transition-colors">
                  {t('viewSchedule')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">{staff.length}</p>
            <p className="text-petrol-60 text-sm">{t('totalStaff')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">
              {staff.filter(s => s.role === 'doctor').length}
            </p>
            <p className="text-petrol-60 text-sm">{t('doctors')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">
              {staff.filter(s => s.role === 'nurse').length}
            </p>
            <p className="text-petrol-60 text-sm">{t('nurses')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {staff.filter(s => s.status === 'active').length}
            </p>
            <p className="text-petrol-60 text-sm">{t('active')}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

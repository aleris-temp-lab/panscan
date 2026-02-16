import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { LogoutButton } from './logout-button'

export default async function AdminDashboard({
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

  // Check admin role
  if (session.user.role !== 'admin') {
    redirect('/auth/login')
  }

  const t = await getTranslations('admin.dashboard')
  const { user } = session

  // Demo stats
  const stats = {
    totalPatients: 1247,
    activeStaff: 23,
    todayAppointments: 45,
    pendingOrders: 12,
  }

  // Demo products
  const products = [
    { id: '1', name: 'Comprehensive Blood Panel', price: '2,495 SEK', orders: 156 },
    { id: '2', name: 'DEXA Body Scan', price: '1,995 SEK', orders: 89 },
    { id: '3', name: 'Executive Health Check', price: '8,995 SEK', orders: 34 },
  ]

  // Demo staff
  const recentStaff = [
    { id: '1', name: 'Dr. Sara Lindqvist', role: 'Doctor', status: 'active' },
    { id: '2', name: 'Johan Berg', role: 'Nurse', status: 'active' },
    { id: '3', name: 'Emma Karlsson', role: 'Dietician', status: 'active' },
  ]

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-petrol text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-semibold">Aleris Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-petrol-40">
              {user.firstName} {user.lastName}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Greeting */}
        <h1 className="text-3xl font-bold text-petrol mb-8">
          {t('greeting', { name: user.firstName })}
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <p className="text-petrol-60 text-sm">{t('totalPatients')}</p>
            <p className="text-3xl font-bold text-petrol mt-2">{stats.totalPatients}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <p className="text-petrol-60 text-sm">{t('activeStaff')}</p>
            <p className="text-3xl font-bold text-petrol mt-2">{stats.activeStaff}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <p className="text-petrol-60 text-sm">{t('todayAppointments')}</p>
            <p className="text-3xl font-bold text-petrol mt-2">{stats.todayAppointments}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <p className="text-petrol-60 text-sm">{t('pendingOrders')}</p>
            <p className="text-3xl font-bold text-orange mt-2">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Management Menu */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('management')}
            </h2>
            <div className="space-y-3">
              <Link
                href="/manage/products"
                className="block p-4 bg-petrol text-white rounded-lg hover:bg-petrol-80 transition-colors"
              >
                <span className="font-medium">{t('products')}</span>
                <p className="text-sm text-petrol-40 mt-1">{t('productsDesc')}</p>
              </Link>
              <Link
                href="/manage/people"
                className="block p-4 bg-sand text-petrol rounded-lg hover:bg-slate transition-colors"
              >
                <span className="font-medium">{t('people')}</span>
                <p className="text-sm text-petrol-60 mt-1">{t('peopleDesc')}</p>
              </Link>
              <Link
                href="/manage/schedule"
                className="block p-4 bg-sand text-petrol rounded-lg hover:bg-slate transition-colors"
              >
                <span className="font-medium">{t('schedule')}</span>
                <p className="text-sm text-petrol-60 mt-1">{t('scheduleDesc')}</p>
              </Link>
              <Link
                href="/manage/clinics"
                className="block p-4 bg-sand text-petrol rounded-lg hover:bg-slate transition-colors"
              >
                <span className="font-medium">{t('clinics')}</span>
                <p className="text-sm text-petrol-60 mt-1">{t('clinicsDesc')}</p>
              </Link>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('topProducts')}
            </h2>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-sand rounded-lg"
                >
                  <p className="font-medium text-petrol">{product.name}</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-petrol-60">{product.price}</span>
                    <span className="text-orange font-medium">{product.orders} {t('orders')}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/manage/products"
              className="mt-4 inline-block text-orange font-medium hover:text-orange-80"
            >
              {t('viewAllProducts')} →
            </Link>
          </div>

          {/* Staff Overview */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-xl font-semibold text-petrol mb-4">
              {t('staffOverview')}
            </h2>
            <div className="space-y-3">
              {recentStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-4 bg-sand rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-petrol-20 rounded-full flex items-center justify-center">
                      <span className="text-petrol font-medium">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-petrol">{staff.name}</p>
                      <p className="text-sm text-petrol-60">{staff.role}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {staff.status}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/manage/people"
              className="mt-4 inline-block text-orange font-medium hover:text-orange-80"
            >
              {t('viewAllStaff')} →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

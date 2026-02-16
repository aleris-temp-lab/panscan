import { redirect } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getStaffSession } from '@panscan/auth'
import { Link } from '@/i18n/routing'
import { Logo } from '@panscan/ui'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { LogoutButton } from '../../dashboard/logout-button'

// Demo products data
const products = [
  {
    id: 'prod-1',
    name: 'Basic Blood Panel',
    category: 'blood-panel',
    price: { sek: 995, nok: 1095, dkk: 795 },
    duration: 15,
    status: 'published',
    orders: 234,
  },
  {
    id: 'prod-2',
    name: 'Comprehensive Blood Panel',
    category: 'blood-panel',
    price: { sek: 2495, nok: 2695, dkk: 1995 },
    duration: 20,
    status: 'published',
    orders: 156,
  },
  {
    id: 'prod-3',
    name: 'DEXA Body Scan',
    category: 'dexa',
    price: { sek: 1995, nok: 2195, dkk: 1595 },
    duration: 30,
    status: 'published',
    orders: 89,
  },
  {
    id: 'prod-4',
    name: 'Executive Health Check',
    category: 'executive',
    price: { sek: 8995, nok: 9995, dkk: 7495 },
    duration: 120,
    status: 'published',
    orders: 34,
  },
  {
    id: 'prod-5',
    name: 'Hormone Panel - Women',
    category: 'hormone',
    price: { sek: 2995, nok: 3295, dkk: 2495 },
    duration: 15,
    status: 'published',
    orders: 67,
  },
  {
    id: 'prod-6',
    name: 'Hormone Panel - Men',
    category: 'hormone',
    price: { sek: 2495, nok: 2795, dkk: 2095 },
    duration: 15,
    status: 'draft',
    orders: 0,
  },
  {
    id: 'prod-7',
    name: 'Thyroid Complete',
    category: 'thyroid',
    price: { sek: 1495, nok: 1695, dkk: 1195 },
    duration: 15,
    status: 'published',
    orders: 45,
  },
]

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'blood-panel', name: 'Blood Panels' },
  { id: 'dexa', name: 'DEXA Scans' },
  { id: 'hormone', name: 'Hormone Tests' },
  { id: 'thyroid', name: 'Thyroid Tests' },
  { id: 'executive', name: 'Executive Health' },
]

export default async function ProductsPage({
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

  const t = await getTranslations('admin.products')
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
            <Link href="/manage/products" className="py-4 text-petrol border-b-2 border-petrol font-medium">
              {t('nav.products')}
            </Link>
            <Link href="/manage/people" className="py-4 text-petrol-60 hover:text-petrol">
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
            + {t('addProduct')}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                cat.id === 'all'
                  ? 'bg-petrol text-white'
                  : 'bg-white text-petrol hover:bg-slate'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead className="bg-sand">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.product')}</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.category')}</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.price')}</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.duration')}</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.orders')}</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.status')}</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-petrol">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-sand transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-petrol">{product.name}</p>
                    <p className="text-sm text-petrol-60">{product.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-petrol-20 text-petrol text-sm rounded">
                      {categories.find(c => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-petrol">
                    {product.price.sek.toLocaleString()} SEK
                  </td>
                  <td className="px-6 py-4 text-petrol">
                    {product.duration} {t('minutes')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-orange">{product.orders}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      product.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status === 'published' ? t('status.published') : t('status.draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-petrol hover:text-petrol-80">
                        {t('edit')}
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        {t('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-petrol">{products.length}</p>
            <p className="text-petrol-60 text-sm">{t('totalProducts')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {products.filter(p => p.status === 'published').length}
            </p>
            <p className="text-petrol-60 text-sm">{t('published')}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-4 text-center">
            <p className="text-3xl font-bold text-orange">
              {products.reduce((acc, p) => acc + p.orders, 0)}
            </p>
            <p className="text-petrol-60 text-sm">{t('totalOrders')}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

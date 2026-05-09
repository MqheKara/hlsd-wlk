import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  Users,
  DollarSign,
} from 'lucide-react'
import api from '../../api/client'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calls = [api.get('/admin/analytics')]
    if (user?.role === 'superuser') calls.push(api.get('/admin/overview'))
    Promise.all(calls)
      .then((res) => {
        setStats(res[0].data)
        if (res[1]) setOverview(res[1].data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.role])

  if (loading) {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl shimmer" />
        ))}
      </div>
    )
  }
  if (!stats) {
    return <div className="text-stone-500">Could not load analytics.</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-stone-900">Dashboard</h1>
      <p className="text-stone-500 mb-8">
        {stats.shop_code
          ? `Performance overview · ${stats.shop_code}`
          : 'All shops · combined view'}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={<ShoppingBag />} label="Total orders" value={stats.total_orders} accent="bg-blue-50 text-blue-700" />
        <Stat icon={<DollarSign />} label="Total revenue" value={`$${stats.total_revenue.toFixed(2)}`} accent="bg-emerald-50 text-emerald-700" />
        <Stat icon={<Calendar />} label="Total bookings" value={stats.total_bookings} accent="bg-amber-50 text-amber-700" />
        <Stat icon={<Users />} label="Customers" value={stats.total_users} accent="bg-violet-50 text-violet-700" />
      </div>

      {overview && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8">
          <h2 className="font-semibold text-stone-900 mb-4">By shop</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(overview)
              .filter(([k]) => k !== 'users')
              .map(([code, v]) => (
                <div key={code} className="border border-stone-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-stone-900">{code}</div>
                    {v.pending_orders > 0 && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        {v.pending_orders} pending
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 mt-3 text-sm">
                    <div>
                      <div className="text-stone-500 text-xs">Orders</div>
                      <div className="font-semibold">{v.orders}</div>
                    </div>
                    <div>
                      <div className="text-stone-500 text-xs">Revenue</div>
                      <div className="font-semibold">${v.revenue.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-stone-500 text-xs">Bookings</div>
                      <div className="font-semibold">{v.bookings}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-900">Revenue · last 14 days</h2>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          {stats.orders_by_day.length === 0 ? (
            <p className="text-stone-400 text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.orders_by_day}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-semibold text-stone-900 mb-4">Orders by status</h2>
          {stats.orders_by_status.length === 0 ? (
            <p className="text-stone-400 text-sm">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.orders_by_status}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 mt-6">
        <h2 className="font-semibold text-stone-900 mb-4">Top items</h2>
        {stats.top_items.length === 0 ? (
          <p className="text-stone-400 text-sm">No order items yet.</p>
        ) : (
          <ul className="space-y-2">
            {stats.top_items.map((it, i) => (
              <li
                key={it.name}
                className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs text-stone-600 font-semibold">
                    {i + 1}
                  </div>
                  <div className="text-stone-800">{it.name}</div>
                </div>
                <div className="text-stone-500 text-sm">{it.qty} sold</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Stat({ icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent} mb-3`}>
        {icon}
      </div>
      <div className="text-stone-500 text-sm">{label}</div>
      <div className="text-2xl font-semibold text-stone-900 mt-1">{value}</div>
    </div>
  )
}

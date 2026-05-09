import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useAuth } from '../../context/AuthContext.jsx'

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-indigo-100 text-indigo-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const { user } = useAuth()
  const [shopCode, setShopCode] = useState(
    user?.role === 'rb_admin' ? 'RB' : user?.role === 'hw_admin' ? 'HW' : 'RB'
  )
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = (code) => {
    setLoading(true)
    api
      .get(`/orders/shop/${code}`)
      .then(({ data }) => setOrders(data))
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(shopCode)
  }, [shopCode])

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status })
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)))
      toast.success('Updated')
    } catch (err) {
      toast.error(err.userMessage || 'Could not update')
    }
  }

  const filtered = useMemo(
    () => (filter === 'all' ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  )

  return (
    <div>
      <h1 className="text-3xl font-semibold text-stone-900">Orders</h1>
      <p className="text-stone-500 mb-6">Manage incoming orders.</p>

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        {user?.role === 'superuser' && (
          <div className="bg-white rounded-full p-1 flex text-sm border border-stone-200">
            {['RB', 'HW'].map((c) => (
              <button
                key={c}
                onClick={() => setShopCode(c)}
                className={`px-4 py-1.5 rounded-full transition ${
                  shopCode === c ? 'bg-stone-900 text-white' : 'text-stone-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {['all', ...statuses].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs rounded-full capitalize ${
                filter === s
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center text-stone-400">
          No orders {filter !== 'all' ? `with status "${filter}"` : 'yet'}.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-stone-200 rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="font-semibold text-stone-900">Order #{o.id}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-stone-500">
                      {o.order_type} · {o.payment_method}
                    </span>
                  </div>
                  <div className="text-sm text-stone-600 mt-1">
                    {o.user?.name} · {o.user?.email}{' '}
                    {o.user?.phone && <span>· {o.user.phone}</span>}
                  </div>
                  <div className="text-xs text-stone-400">
                    {new Date(o.created_at).toLocaleString()}
                  </div>
                  {o.delivery_address && (
                    <div className="text-xs text-stone-500 mt-1">
                      → {o.delivery_address}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-stone-900">
                    ${o.total.toFixed(2)}
                  </div>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="mt-2 text-sm border border-stone-200 rounded-lg px-2 py-1.5 bg-white"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="mt-3 text-sm text-stone-600 grid sm:grid-cols-2 gap-x-4">
                {o.items.map((it) => (
                  <li key={it.id}>
                    {it.item_name} ×{it.quantity} —{' '}
                    <span className="text-stone-400">
                      ${(it.unit_price * it.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              {o.notes && (
                <div className="text-xs text-stone-500 mt-2 italic">"{o.notes}"</div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

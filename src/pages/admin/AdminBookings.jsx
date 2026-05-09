import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../api/client'
import { useAuth } from '../../context/AuthContext.jsx'

const statuses = ['pending', 'confirmed', 'completed', 'cancelled']

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminBookings() {
  const { user } = useAuth()
  const [shopCode, setShopCode] = useState(
    user?.role === 'rb_admin' ? 'RB' : user?.role === 'hw_admin' ? 'HW' : 'RB'
  )
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = (code) => {
    setLoading(true)
    api
      .get(`/bookings/shop/${code}`)
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Could not load bookings'))
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    load(shopCode)
  }, [shopCode])

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/bookings/${id}/status`, { status })
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)))
      toast.success('Updated')
    } catch (err) {
      toast.error(err.userMessage || 'Could not update')
    }
  }

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? bookings
        : bookings.filter((b) => b.status === filter),
    [bookings, filter],
  )

  return (
    <div>
      <h1 className="text-3xl font-semibold text-stone-900">Bookings</h1>
      <p className="text-stone-500 mb-6">Reservations and table holds.</p>

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
          No bookings {filter !== 'all' ? `with status "${filter}"` : 'yet'}.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const start = new Date(b.booking_date)
            const end = new Date(start.getTime() + (b.duration_hours || 0) * 3600 * 1000)
            const isEvent = b.booking_type === 'event'
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-wrap items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="font-semibold text-stone-900">
                      {isEvent ? `Event · ${b.party_size} guests` : `Table for ${b.party_size}`}
                    </div>
                    {isEvent && (
                      <span className="text-[10px] uppercase tracking-widest bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Event · {b.duration_hours}h
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[b.status]}`}>
                      {b.status}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-stone-500">
                      {b.table_type}
                    </span>
                  </div>
                  <div className="text-sm text-stone-700 mt-1">
                    {start.toLocaleString()}
                    {isEvent && (
                      <>
                        {' '}
                        <span className="text-stone-400">→</span>{' '}
                        {end.toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </>
                    )}
                  </div>
                  <div className="text-sm text-stone-600 mt-1">
                    {b.user?.name} · {b.user?.email}{' '}
                    {b.user?.phone && <span>· {b.user.phone}</span>}
                  </div>
                  {b.notes && (
                    <div className="text-xs text-stone-500 mt-1 italic">"{b.notes}"</div>
                  )}
                </div>
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b.id, e.target.value)}
                  className="text-sm border border-stone-200 rounded-lg px-2 py-1.5 bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
